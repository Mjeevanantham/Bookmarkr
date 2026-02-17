'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white selection:bg-rose-500/30">
      {/* Background Effect */}
      <div className="pointer-events-none absolute inset-0 h-full w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-black to-black opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,50,50,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,50,50,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-rose-500/20 bg-zinc-900/60 p-8 text-center shadow-[0_0_50px_-20px_rgba(225,29,72,0.3)] backdrop-blur-2xl"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 shadow-[0_0_30px_-5px_rgba(225,29,72,0.4)]">
          <AlertCircle className="h-8 w-8 text-rose-500" />
        </div>

        <h2 className="mb-2 text-xl font-semibold text-white">Authentication Failed</h2>
        <p className="mb-8 text-sm leading-relaxed text-zinc-500">
          We encountered an issue while verifying your identity. This could be due to a
          session timeout or cancelled login.
        </p>

        <Link
          href="/login"
          className="group relative block w-full overflow-hidden rounded-lg bg-rose-600 py-3 text-sm font-medium text-white shadow-lg shadow-rose-900/20 transition-all duration-300 hover:bg-rose-500"
        >
          <div className="group-hover:animate-shine absolute inset-0 translate-x-[-200%] skew-x-[-12deg] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="relative z-10">Try Again</span>
        </Link>
      </motion.div>
    </div>
  );
}
