import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Download, Share2, Heart, ImagePlus } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import { supabase, getMyLogos, generateLogo } from '../lib/supabase';
import { getGeneratorInputs } from '../lib/storage';
import type { Database } from '../lib/database.types';

type Logo = Database['public']['Tables']['logos']['Row'];

const UserDashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGeneration, setActiveGeneration] = useState<Logo | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.id !== userId) {
        navigate('/');
        return;
      }
      
      await loadLogos();

      // Check if we just completed checkout
      const checkoutStatus = searchParams.get('checkout');
      if (checkoutStatus === 'success') {
        const savedInputs = getGeneratorInputs();
        if (savedInputs) {
          try {
            await generateLogo(
              savedInputs.companyName,
              savedInputs.companyDescription,
              savedInputs.style
            );
            await loadLogos(); // Reload logos to show the new one
          } catch (error) {
            console.error('Error generating logo:', error);
          }
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [userId, navigate, searchParams]);

  const loadLogos = async () => {
    try {
      const logos = await getMyLogos();
      setLogos(logos);
      const pending = logos.find(logo => !logo.image_url);
      if (pending) {
        setActiveGeneration(pending);
        pollLogoStatus(pending.id);
      }
    } catch (error) {
      console.error('Error loading logos:', error);
    }
  };

  const pollLogoStatus = async (logoId: string) => {
    const interval = setInterval(async () => {
      const { data: logo } = await supabase
        .from('logos')
        .select('*')
        .eq('id', logoId)
        .single();

      if (logo?.image_url) {
        clearInterval(interval);
        setActiveGeneration(null);
        loadLogos();
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  const handleDownload = async (logo: Logo) => {
    try {
      // For base64 images
      if (logo.image_url.startsWith('data:image/')) {
        const link = document.createElement('a');
        link.href = logo.image_url;
        link.download = `${logo.company_name.toLowerCase().replace(/\s+/g, '-')}-logo.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fallback for URL-based images
        const response = await fetch(logo.image_url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${logo.company_name.toLowerCase().replace(/\s+/g, '-')}-logo.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading logo:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-center"
        >
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading your logos...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header 
        isLoggedIn={true}
        userId={userId}
        onSignOut={async () => {
          await supabase.auth.signOut();
          navigate('/');
        }}
        onSignIn={() => {}}
      />

      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Your Logos</h1>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key="logos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {activeGeneration && (
                <GlassPanel className="mb-8 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Generating Logo</h3>
                      <p className="text-white/70">
                        Creating your design for {activeGeneration.company_name}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear"
                      }}
                    />
                  </div>
                </GlassPanel>
              )}

              {logos.length === 0 ? (
                <GlassPanel className="p-12 text-center">
                  <ImagePlus className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Logos Generated Yet</h3>
                  <p className="text-white/60 mb-6">
                    Start creating unique, minimalist logos for your brand.
                  </p>
                  <Button onClick={() => navigate('/')}>
                    Generate Your First Logo
                  </Button>
                </GlassPanel>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {logos.map((logo) => (
                    <motion.div
                      key={logo.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <GlassPanel className="overflow-hidden">
                        {logo.image_url ? (
                          <>
                            <img
                              src={logo.image_url}
                              alt={logo.company_name}
                              className="w-full aspect-square object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                              <button className="text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors backdrop-blur-lg">
                                <Heart className="w-5 h-5" />
                              </button>
                              <button 
                                className="text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors backdrop-blur-lg"
                                onClick={() => handleDownload(logo)}
                              >
                                <Download className="w-5 h-5" />
                              </button>
                              <button className="text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors backdrop-blur-lg">
                                <Share2 className="w-5 h-5" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="w-full aspect-square bg-white/5 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-white/40" />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold">{logo.company_name}</h3>
                          <p className="text-sm text-white/70 mt-1">{logo.company_description}</p>
                          <p className="text-xs text-white/40 mt-2">{logo.style} style</p>
                        </div>
                      </GlassPanel>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;