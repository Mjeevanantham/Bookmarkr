'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 h-full w-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="select-none bg-gradient-to-b from-white to-white/10 bg-clip-text text-[12rem] font-bold leading-none tracking-tighter text-transparent"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative"
        >
          <h2 className="mb-6 text-2xl font-light tracking-tight text-white/80">
            Page not found
          </h2>
          <p className="mx-auto mb-10 max-w-sm text-zinc-500">
            The page you are looking for might have been removed, had its name changed, or
            is temporarily unavailable.
          </p>

          <Link
            href="/"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white px-8 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-zinc-200"
          >
            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform group-hover:animate-shine" />
            <span className="relative z-10">Return Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
