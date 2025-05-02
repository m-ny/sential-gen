import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Message from '../components/ui/Message';
import AuthModal from '../components/auth/AuthModal';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { getGeneratorInputs } from '../lib/storage';
import { products } from '../lib/stripe-config';

const PricingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      setMessage({
        type: 'success',
        text: 'Payment successful! You can now generate your logos.',
      });
      
      const savedInputs = getGeneratorInputs();
      if (savedInputs) {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } else if (checkoutStatus === 'cancelled') {
      setMessage({
        type: 'error',
        text: 'Payment cancelled. Please try again or contact support if you need help.',
      });
    }
  }, [searchParams, navigate]);

  const handlePurchase = async () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: products[0].priceId,
          success_url: `${window.location.origin}/pricing?checkout=success`,
          cancel_url: `${window.location.origin}/pricing?checkout=cancelled`,
          mode: 'payment',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      setMessage({
        type: 'error',
        text: 'Failed to start checkout process. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const product = products[0];

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header 
        isLoggedIn={isLoggedIn} 
        onSignOut={async () => {
          await supabase.auth.signOut();
          setIsLoggedIn(false);
        }} 
        onSignIn={() => setShowAuthModal(true)} 
      />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Create your perfect logo
            </h1>
            <p className="text-white/70 text-lg mb-8">
              Get instant access to our professional logo generator.
            </p>

            {message && (
              <div className="mb-8">
                <Message type={message.type}>
                  {message.text}
                </Message>
              </div>
            )}

            <GlassPanel className="p-8 backdrop-blur-xl">
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">{product.price}</span>
                  <span className="text-white/70 ml-2">one-time</span>
                </div>

                <div className="space-y-4 text-left mb-8">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-white/80 flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full py-4 text-lg font-medium"
                  onClick={handlePurchase}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Get Started Now'}
                </Button>

                <p className="mt-6 text-white/60 text-sm">
                  Generate your logo in minutes, not weeks.
                </p>
              </div>
            </GlassPanel>
          </div>
        </div>
      </main>

      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default PricingPage;