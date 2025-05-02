import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Rate limiting configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms
const RATE_LIMIT_INTERVAL = 60000; // 1 minute
const MAX_REQUESTS_PER_INTERVAL = 10;

let requestCount = 0;
let intervalStart = Date.now();

// Rate limiting function
const checkRateLimit = () => {
  const now = Date.now();
  if (now - intervalStart >= RATE_LIMIT_INTERVAL) {
    requestCount = 0;
    intervalStart = now;
  }
  
  if (requestCount >= MAX_REQUESTS_PER_INTERVAL) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  requestCount++;
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js/2.x',
    },
  },
  db: {
    schema: 'public',
  },
  // Add retry configuration
  retryAttempts: MAX_RETRIES,
  retryInterval: RETRY_DELAY,
});

const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(operation, retries - 1, delay * 2);
  }
};

export async function generateLogo(
  companyName: string,
  companyDescription: string,
  style: 'block' | 'sharp' | 'rounded'
) {
  try {
    checkRateLimit();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    return await retryWithBackoff(async () => {
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          companyDescription,
          style,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate logo');
      }

      return response.json();
    });
  } catch (error) {
    console.error('Error generating logo:', error);
    throw error instanceof Error 
      ? error 
      : new Error('An unexpected error occurred');
  }
}

export async function getMyLogos() {
  try {
    checkRateLimit();

    return await retryWithBackoff(async () => {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    });
  } catch (error) {
    console.error('Error fetching logos:', error);
    throw error instanceof Error 
      ? error 
      : new Error('An unexpected error occurred');
  }
}