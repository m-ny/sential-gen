import React from 'react';
import { cn } from '../../utils/cn';

type PlanBadgeProps = {
  plan: string;
  className?: string;
};

const PlanBadge = ({ plan, className }: PlanBadgeProps) => {
  const styles = {
    starter: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    creator: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    studio: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    free: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  const planName = {
    starter: 'Starter',
    creator: 'Creator',
    studio: 'Studio',
    free: 'Free',
  };

  return (
    <span
      className={cn(
        'px-2 py-1 text-xs font-medium rounded-full border',
        styles[plan as keyof typeof styles] || styles.free,
        className
      )}
    >
      {planName[plan as keyof typeof planName] || 'Free'}
    </span>
  );
}

export default PlanBadge;