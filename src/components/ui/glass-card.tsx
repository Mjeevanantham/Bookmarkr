import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function GlassCard({
  children,
  hover = false,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div className={cn('glass-card p-6', hover && 'glass-hover', className)} {...props}>
      {children}
    </div>
  );
}
