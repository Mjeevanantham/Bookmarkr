'use client';

import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex flow-root min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white selection:bg-purple-500/30">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/10 via-black to-blue-900/10 opacity-70" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg p-10 text-center"
      >
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]">
          <span className="text-4xl">⚠️</span>
          <div className="absolute inset-0 animate-[ping_3s_ease-in-out_infinite] rounded-full border border-white/5" />
        </div>

        <h2 className="mb-3 text-3xl font-semibold tracking-tight text-white">
          Something went wrong!
        </h2>
        <p className="mx-auto mb-8 max-w-sm text-zinc-500">
          {error.message ||
            "An unexpected error has occurred. We've been notified and are fixing it."}
        </p>

        <button
          onClick={() => reset()}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-6 py-3 text-sm font-medium text-black shadow-lg shadow-white/5 transition-all duration-300 hover:bg-zinc-200"
        >
          <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shine" />
          <RotateCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
          <span className="relative z-10">Try again</span>
        </button>
      </motion.div>
    </div>
  );
}
