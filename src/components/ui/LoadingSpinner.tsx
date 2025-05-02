import React from 'react';
import { cn } from '../../utils/cn';

type LoadingSpinnerProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const LoadingSpinner = ({ className, size = 'md' }: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-white/20 border-t-white',
        sizes[size],
        className
      )}
    />
  );
};

export default LoadingSpinner;