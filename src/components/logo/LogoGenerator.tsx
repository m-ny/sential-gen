import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { generateLogo, supabase } from '../../lib/supabase';
import { saveGeneratorInputs, getGeneratorInputs, clearGeneratorInputs } from '../../lib/storage';
import { products } from '../../lib/stripe-config';

type LogoStyle = 'block' | 'sharp' | 'rounded';

type LogoGeneratorProps = {
  onGenerateClick: () => void;
  isLoggedIn: boolean;
};

const LogoGenerator = ({ onGenerateClick, isLoggedIn }: LogoGeneratorProps) => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<LogoStyle>('block');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const savedInputs = getGeneratorInputs();
    if (savedInputs) {
      setCompanyName(savedInputs.companyName);
      setCompanyDescription(savedInputs.companyDescription);
      setSelectedStyle(savedInputs.style);
      clearGeneratorInputs();
    }

    // Load user credits if logged in
    if (isLoggedIn) {
      loadUserCredits();
    }
  }, [isLoggedIn]);

  const loadUserCredits = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('credits')
        .single();
      
      if (error) {
        throw error;
      }
      
      if (profile) {
        setCredits(profile.credits);
      }
    } catch (err) {
      console.error('Error loading credits:', err);
      setError('Failed to load credits. Please try refreshing the page.');
    }
  };

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      onGenerateClick();
      return;
    }

    if (!companyName || !companyDescription) return;

    setIsGenerating(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      if (credits === 0) {
        // Save current inputs before redirecting to payment
        saveGeneratorInputs({
          companyName,
          companyDescription,
          style: selectedStyle
        });

        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            price_id: products[0].priceId, // Use the first product (10 credits)
            success_url: `${window.location.origin}/user/${session.user.id}?checkout=success`,
            cancel_url: `${window.location.origin}/?checkout=cancelled`,
            mode: 'payment',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const { url } = await response.json();
        window.location.href = url;
        return;
      }

      await generateLogo(companyName, companyDescription, selectedStyle);
      navigate(`/user/${session.user.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate logo');
      setIsGenerating(false);
    }
  };

  const styles: { id: LogoStyle; name: string; image: string }[] = [
    {
      id: 'block',
      name: 'Block',
      image: 'https://raw.githubusercontent.com/m-ny/sential-gen/refs/heads/main/static/block.png'
    },
    {
      id: 'sharp',
      name: 'Sharp',
      image: 'https://raw.githubusercontent.com/m-ny/sential-gen/refs/heads/main/static/sharp.png'
    },
    {
      id: 'rounded',
      name: 'Rounded',
      image: 'https://raw.githubusercontent.com/m-ny/sential-gen/refs/heads/main/static/rounded.png'
    }
  ];

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mb-8">
        <Input
          label="Company Name"
          placeholder="Enter your company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Input
          label="Description"
          placeholder="Describe your company's vision and style"
          value={companyDescription}
          onChange={(e) => setCompanyDescription(e.target.value)}
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-white/80 mb-3">
          Choose Style
        </label>
        <div className="grid grid-cols-3 gap-4">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`relative rounded-lg overflow-hidden aspect-square transition-all duration-200 ${
                selectedStyle === style.id
                  ? 'ring-2 ring-white scale-[1.02]'
                  : 'ring-1 ring-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={style.image}
                alt={style.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                <span className="text-white text-sm font-medium">
                  {style.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <Button 
          className="w-full py-4 text-lg font-medium"
          onClick={handleGenerate}
          disabled={isGenerating || !companyName || !companyDescription}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Processing...
            </span>
          ) : credits === 0 ? (
            'Get Credits to Generate'
          ) : (
            'Generate Logo'
          )}
        </Button>

        {isLoggedIn && (
          <p className="text-center text-white/60 text-sm">
            Credits Available: {credits === -1 ? 'Unlimited' : credits}
          </p>
        )}
      </div>
    </div>
  );
};

export default LogoGenerator;
