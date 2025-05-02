import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LogoGenerator from '../components/logo/LogoGenerator';
import Button from '../components/ui/Button';
import AuthModal from '../components/auth/AuthModal';
import GlassPanel from '../components/ui/GlassPanel';
import { supabase } from '../lib/supabase';

const examples = [
  {
    id: 1,
    imageUrl: 'https://raw.githubusercontent.com/m-ny/sential-gen/refs/heads/main/static/example-one.png',
    companyName: 'Minimalist Tech',
  },
  {
    id: 2,
    imageUrl: 'https://raw.githubusercontent.com/m-ny/sential-gen/refs/heads/main/static/example-twoo.png',
    companyName: 'Modern Brand',
  },
  {
    id: 3,
    imageUrl: 'https://raw.githubusercontent.com/m-ny/sential-gen/refs/heads/main/static/example-threee.png',
    companyName: 'Creative Studio',
  },
  {
    id: 4,
    imageUrl: 'https://raw.githubusercontent.com/m-ny/sential-gen/refs/heads/main/static/example-four.png',
    companyName: 'Digital Agency',
  },
  {
    id: 5,
    imageUrl: 'https://raw.githubusercontent.com/m-ny/sential-gen/refs/heads/main/static/example-five.png',
    companyName: 'Future Systems',
  },
];

const faqs = [
  {
    question: "How does the logo generation process work?",
    answer: "Our AI-powered system creates unique, minimalist logo marks based on your company name and description. You can choose from three distinct styles: Block, Sharp, or Rounded. Each generation is instant, and you'll have your logo in minutes."
  },
  {
    question: "What's included in the commercial license?",
    answer: "When you generate a logo, you receive a perpetual, worldwide commercial license. This means you can use the logo for any business purpose. The license includes rights for digital and print use, merchandise, and branding."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 7-day refund period for issues with generations. If our support team determines your situation warrants a refund, we'll process it promptly."
  },
  {
    question: "Can I modify the generated logos?",
    answer: "Yes, you receive high-resolution files that can be modified using any design software. The commercial license allows for modifications and derivative works."
  },
];

const HomePage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (sessionError.message?.includes('refresh_token_not_found')) {
            await handleSignOut();
          }
          return;
        }
        
        setIsLoggedIn(!!session);
        setUserId(session?.user.id);
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        if (error.message?.includes('refresh_token_not_found') || 
            error.error?.message?.includes('refresh_token_not_found')) {
          await handleSignOut();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'TOKEN_REFRESHED') {
          setIsLoggedIn(!!session);
          setUserId(session?.user.id);
        } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          await handleSignOut();
        } else {
          setIsLoggedIn(!!session);
          setUserId(session?.user.id);
        }
      } catch (error: any) {
        console.error('Auth state change error:', error);
        if (error.message?.includes('refresh_token_not_found') || 
            error.error?.message?.includes('refresh_token_not_found')) {
          await handleSignOut();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUserId(undefined);
      setShowAuthModal(false);
      localStorage.removeItem('supabase.auth.token');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header 
        isLoggedIn={isLoggedIn}
        userId={userId}
        onSignOut={handleSignOut}
        onSignIn={() => setShowAuthModal(true)}
      />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-32">
            <h1 className="text-5xl md:text-6xl font-normal italic font-serif mb-6 text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Mark it. Own it.
            </h1>
            <p className="text-white/70 text-lg mb-16 text-center max-w-2xl mx-auto">
              Generate sleek, high-impact logo marks from just a name and idea—no design skills required.
            </p>
            
            <GlassPanel className="p-8 backdrop-blur-xl bg-white/[0.04] border border-white/[0.08]">
              <LogoGenerator 
                onGenerateClick={() => !isLoggedIn && setShowAuthModal(true)}
                isLoggedIn={isLoggedIn}
              />
            </GlassPanel>
          </div>

          <div className="flex justify-center items-center gap-6 mb-24">
            <div className="relative w-48">
              <img
                src="https://yxzstyvesicxnrubiznq.supabase.co/storage/v1/object/public/assets//laurel.png"
                alt="Rating laurel"
                className="w-full h-auto opacity-80"
              />
            </div>
            <p className="text-white/80 text-lg italic max-w-md">
              "This has saved me thousands, generated logo mark in minutes rather than weeks"
            </p>
          </div>

          <div className="relative overflow-hidden py-12 mb-24">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...examples, ...examples].map((example, index) => (
                <div key={`${example.id}-${index}`} className="mx-4 w-64 flex-shrink-0">
                  <img
                    src={example.imageUrl}
                    alt={example.companyName}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <GlassPanel 
                  key={index}
                  className={`transition-all duration-200 ${
                    openFaqIndex === index ? 'bg-white/[0.06]' : 'hover:bg-white/[0.05]'
                  }`}
                >
                  <button
                    className="w-full text-left px-6 py-4 flex items-center justify-between"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    {openFaqIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-white/60" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/60" />
                    )}
                  </button>
                  
                  {openFaqIndex === index && (
                    <div className="px-6 pb-4 text-white/70">
                      {faq.answer}
                    </div>
                  )}
                </GlassPanel>
              ))}
            </div>
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

export default HomePage;
