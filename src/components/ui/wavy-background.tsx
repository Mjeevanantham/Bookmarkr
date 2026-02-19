'use client';

import React, { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: 'slow' | 'fast';
  waveOpacity?: number;
}

export function WavyBackground({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = 'fast',
  waveOpacity = 0.5,
}: WavyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const waveColors = colors ?? ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee'];
    const increment = speed === 'fast' ? 0.002 : 0.001;
    let nt = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    resize();
    window.addEventListener('resize', resize);

    const drawWave = (n: number) => {
      nt += increment;
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth ?? 50;
        ctx.strokeStyle = waveColors[i % waveColors.length] ?? '#000';
        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            Math.sin(x / 800 + nt + i * 0.4) * 100 +
            Math.sin(x / 400 + nt * 2 + i * 0.2) * 30 +
            canvas.height / 2;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.beginPath();
      }
    };

    const render = () => {
      ctx.fillStyle = backgroundFill ?? 'black';
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = waveOpacity;
      drawWave(5);
      animationIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center',
        containerClassName,
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
}
