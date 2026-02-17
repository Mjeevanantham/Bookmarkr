import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'high' | 'medium' | 'low' | 'default';
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  children,
  className,
  ...props
}: BadgeProps) {
  const variants = {
    high: 'bg-red-500/20 text-red-300 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-300 border-green-500/30',
    default: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
