import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import Button from '../ui/Button';
import GlassPanel from '../ui/GlassPanel';
import LoadingSpinner from '../ui/LoadingSpinner';
import Message from '../ui/Message';
import { createCheckoutSession } from '../../lib/stripe';

type PricingCardProps = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  negativeFeatures?: string[];
  cta: string;
  highlight?: boolean;
  badge?: string;
  footer: string;
  priceId: string;
  mode: 'payment' | 'subscription';
  isLoggedIn: boolean;
  onSignIn: () => void;
};

const PricingCard = ({
  name,
  price,
  period,
  description,
  features,
  negativeFeatures = [],
  cta,
  highlight = false,
  badge,
  footer,
  priceId,
  mode,
  isLoggedIn,
  onSignIn,
}: PricingCardProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!isLoggedIn) {
      onSignIn();
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const checkoutUrl = await createCheckoutSession(priceId);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      setError('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassPanel
      className={`relative ${
        highlight
          ? 'border-white/20 ring-2 ring-white/20'
          : 'border-white/10'
      }`}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">
            {badge}
          </span>
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          {name}
        </h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-white">
            {price}
          </span>
          <span className="text-white/60 ml-1">
            /{period}
          </span>
        </div>
        <p className="text-white/70 mb-6">
          {description}
        </p>

        {error && (
          <Message type="error" className="mb-6">
            {error}
          </Message>
        )}

        <Button
          variant={highlight ? 'primary' : 'outline'}
          className="w-full mb-6"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : null}
          {loading ? 'Processing...' : cta}
        </Button>

        <div className="space-y-3">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
              <span className="text-white/80 text-sm">{feature}</span>
            </div>
          ))}
          {negativeFeatures?.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <X className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
              <span className="text-white/40 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-white/60 text-sm text-center">
            {footer}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
};

export default PricingCard;