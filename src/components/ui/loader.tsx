'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loader({ className, size = 'md' }: LoaderProps) {
  const containerSize = {
    sm: 'h-4 gap-1',
    md: 'h-8 gap-1.5',
    lg: 'h-16 gap-3',
  };

  const barWidth = {
    sm: 'w-1',
    md: 'w-2',
    lg: 'w-4',
  };

  return (
    <div
      className={cn('flex items-center justify-center', containerSize[size], className)}
    >
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={cn('origin-bottom rounded-full bg-current', barWidth[size])}
          initial={{ scaleY: 0.5, opacity: 0.5 }}
          animate={{
            scaleY: [0.5, 1.2, 0.5],
            opacity: [0.5, 1, 0.5],
            filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
