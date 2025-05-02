import React from 'react';
import LogoCard from './LogoCard';

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

const LogoGallery = () => {
  return (
    <div className="mt-20">
      <h2 className="text-2xl font-bold text-white mb-6">Example Logos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {examples.map((logo) => (
          <LogoCard 
            key={logo.id}
            imageUrl={logo.imageUrl}
            companyName={logo.companyName}
          />
        ))}
      </div>
    </div>
  );
};

export default LogoGallery;