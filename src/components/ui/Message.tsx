import React from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

type MessageProps = {
  type: 'success' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
};

const Message = ({ type, children, className }: MessageProps) => {
  const styles = {
    success: {
      wrapper: 'bg-green-500/10 border-green-500/20',
      text: 'text-green-400',
      icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
    },
    error: {
      wrapper: 'bg-red-500/10 border-red-500/20',
      text: 'text-red-400',
      icon: <XCircle className="w-5 h-5 text-red-400" />,
    },
    info: {
      wrapper: 'bg-blue-500/10 border-blue-500/20',
      text: 'text-blue-400',
      icon: <AlertCircle className="w-5 h-5 text-blue-400" />,
    },
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        styles[type].wrapper,
        className
      )}
    >
      {styles[type].icon}
      <div className={cn('text-sm', styles[type].text)}>
        {children}
      </div>
    </div>
  );
};

export default Message;