import React from 'react';
import { cn } from '../../utils/cn';

type InputProps = {
  label?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ label, className, id, ...props }: InputProps) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-white/80 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "bg-[#111111] text-white w-full rounded-lg px-4 py-2.5",
          "border border-white/10 focus:border-white/15 focus:outline-none",
          "placeholder:text-[#777] focus:ring-2 focus:ring-white/5",
          "transition-all duration-200 ease-in-out backdrop-blur-lg",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default Input;