import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    outline:
      'rounded-lg border-2 border-indigo-500/50 bg-transparent px-6 py-2.5 text-white hover:border-indigo-500 hover:bg-indigo-500/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        variant !== 'primary' && variant !== 'ghost' && sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
