import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import GlassPanel from '../components/ui/GlassPanel';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        onSignOut={() => setIsLoggedIn(false)} 
        onSignIn={() => setIsLoggedIn(true)} 
      />
      
      <main className="flex-grow pt-32 pb-16 flex items-center">
        <div className="container mx-auto px-4">
          <GlassPanel className="max-w-2xl mx-auto p-12 text-center">
            <h1 className="text-8xl font-bold text-white mb-6">404</h1>
            <p className="text-2xl text-white/90 mb-2">Page not found</p>
            <p className="text-lg text-white/70 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="inline-flex items-center"
            >
              <MoveLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </GlassPanel>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;