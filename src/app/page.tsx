'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute left-[20%] top-[20%] h-[400px] w-[400px] rounded-full bg-purple-900/30 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] h-[400px] w-[400px] rounded-full bg-indigo-900/30 blur-[100px]" />
      </div>

      <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-center opacity-20" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30 blur" />
            <Image
              src="/Bookmarkr_full_logo.png"
              alt="Bookmarkr Logo"
              width={200}
              height={60}
              className="relative"
              priority
            />
          </div>
        </motion.div>

        {/* Hero Text */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-4xl bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-5xl font-bold text-transparent sm:text-7xl"
        >
          Your bookmarks, <br />
          <span className="text-indigo-400">reimagined with AI.</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 max-w-2xl text-lg text-zinc-400"
        >
          Organize, search, and discover your saved content like never before using
          local-first AI processing.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10"
        >
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition-all hover:bg-zinc-200 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            Get Started
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-8 text-sm text-zinc-600"
      >
        <p>© 2024 Bookmarkr. All rights reserved.</p>
      </motion.footer>
    </main>
  );
}
