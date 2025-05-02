import React, { useState } from 'react';
import { X } from 'lucide-react';
import GlassPanel from '../ui/GlassPanel';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Message from '../ui/Message';
import { supabase } from '../../lib/supabase';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              email,
              name: '',
              lastname: '',
              role: 'user',
            },
          },
        });

        if (signUpError) {
          if (signUpError.message.includes('User already registered')) {
            setError('This email is already registered. Please sign in instead.');
          } else {
            setError(signUpError.message);
          }
          return;
        }

        if (data?.user) {
          setSuccess('Account created successfully! You can now sign in.');
          // Switch to sign in mode after successful registration
          setTimeout(() => {
            setIsSignUp(false);
            setSuccess(null);
          }, 2000);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError('Invalid email or password');
          return;
        }

        onClose();
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <GlassPanel className="w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">
          {isSignUp ? 'Create your account' : 'Sign in to continue'}
        </h2>
        
        <p className="text-white/70 mb-6">
          {isSignUp 
            ? 'Create an account to start generating and saving your logo designs.'
            : 'You need to be logged in to generate and save your logo designs.'}
        </p>
        
        {error && (
          <Message type="error" className="mb-4">
            {error}
          </Message>
        )}

        {success && (
          <Message type="success" className="mb-4">
            {success}
          </Message>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
          
          <div className="pt-2">
            <Button 
              className="w-full" 
              disabled={loading}
            >
              {loading 
                ? 'Please wait...' 
                : isSignUp 
                  ? 'Create Account' 
                  : 'Sign In'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-white/70 mb-4">
            {isSignUp 
              ? 'Already have an account?' 
              : "Don't have an account?"}
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccess(null);
              setEmail('');
              setPassword('');
            }}
          >
            {isSignUp ? 'Sign in instead' : 'Create Account'}
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
};

export default AuthModal;