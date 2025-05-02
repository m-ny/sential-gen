import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LogoCard from '../components/logo/LogoCard';
import { supabase } from '../lib/supabase';

const examples = [
  {
    id: 1,
    imageUrl: 'https://yxzstyvesicxnrubiznq.supabase.co/storage/v1/object/public/assets//example-one.png',
    companyName: 'Minimalist Tech',
  },
  {
    id: 2,
    imageUrl: 'https://yxzstyvesicxnrubiznq.supabase.co/storage/v1/object/public/assets//example-two.png',
    companyName: 'Modern Brand',
  },
  {
    id: 3,
    imageUrl: 'https://yxzstyvesicxnrubiznq.supabase.co/storage/v1/object/public/assets//example-three.png',
    companyName: 'Creative Studio',
  },
];

const ExamplesPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        onSignOut={() => setIsLoggedIn(false)} 
        onSignIn={() => setIsLoggedIn(true)} 
      />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4 text-center">
              Example Logos
            </h1>
            <p className="text-white/70 text-lg mb-12 text-center">
              Explore some of our generated logo designs
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {examples.map((logo) => (
                <div key={logo.id} className="aspect-square bg-darkgray-100">
                  <img
                    src={logo.imageUrl}
                    alt={`${logo.companyName} logo example`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExamplesPage;