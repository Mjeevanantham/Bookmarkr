'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const floatingAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-indigo-500/30">
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
          className="absolute left-[10%] top-[15%] h-[500px] w-[500px] rounded-full bg-purple-600/40 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: 1,
          }}
          className="absolute bottom-[15%] right-[10%] h-[500px] w-[500px] rounded-full bg-indigo-600/40 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: 2,
          }}
          className="absolute left-[50%] top-[50%] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/30 blur-[100px]"
        />
      </div>

      {/* Animated Grid Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-center"
      />

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-0 h-2 w-2 rounded-full bg-indigo-400/20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, Math.random() * -100, Math.random() * 100],
            x: [null, Math.random() * 50 - 25],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: i * 0.5,
          }}
        />
      ))}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center px-4 text-center"
      >
        {/* Logo with Enhanced Glow */}
        <motion.div variants={itemVariants} className="mb-12">
          <motion.div animate={floatingAnimation} className="relative">
            {/* Multiple glow layers for better contrast */}
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 blur-2xl" />
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-indigo-400 to-purple-600 opacity-50 blur-xl" />
            <div className="relative rounded-xl bg-black/40 p-4 backdrop-blur-sm">
              <Image
                src="/Bookmarkr_full_logo.png"
                alt="Bookmarkr Logo"
                width={240}
                height={72}
                className="relative drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Text with Gradient Animation */}
        <motion.h1
          variants={itemVariants}
          className="max-w-4xl text-5xl font-bold sm:text-7xl lg:text-8xl"
        >
          <span className="bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent">
            Your bookmarks,
          </span>
          <br />
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear' as const,
            }}
            className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-[length:200%_auto] bg-clip-text text-transparent"
          >
            reimagined with AI.
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-8 max-w-2xl text-lg text-zinc-300 sm:text-xl"
        >
          Organize, search, and discover your saved content like never before using{' '}
          <span className="font-semibold text-indigo-300">local-first</span> AI
          processing.
        </motion.p>

        {/* Enhanced CTA Button */}
        <motion.div variants={itemVariants} className="mt-12">
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-10 py-5 text-lg font-semibold text-white shadow-2xl shadow-indigo-500/50 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/70"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

            <span className="relative z-10">Get Started</span>

            <motion.svg
              className="relative z-10 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut' as const,
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </motion.svg>
          </Link>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-wrap items-center justify-center gap-4"
        >
          {['AI-Powered Search', 'Privacy First', 'Lightning Fast'].map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-6 py-2 text-sm font-medium text-indigo-200 backdrop-blur-sm"
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
