import React from 'react';
import { cn } from '../../utils/cn';

type GlassPanelProps = {
  children: React.ReactNode;
  className?: string;
};

const GlassPanel = ({ children, className }: GlassPanelProps) => {
  return (
    <div 
      className={cn(
        "bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl",
        "rounded-2xl", 
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassPanel;