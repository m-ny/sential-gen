import React from 'react';
import { Download } from 'lucide-react';

type LogoCardProps = {
  imageUrl: string;
  companyName: string;
};

const LogoCard = ({ imageUrl, companyName }: LogoCardProps) => {
  return (
    <div className="relative group overflow-hidden rounded-xl">
      <div className="aspect-square bg-[#0A0A0A] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={`${companyName} logo`} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      {/* Hover Actions */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
        <button className="text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors backdrop-blur-lg">
          <Download className="w-5 h-5" />
        </button>
      </div>
      
      {/* Title Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white font-medium">{companyName}</p>
      </div>
    </div>
  );
};

export default LogoCard;