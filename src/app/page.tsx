'use client';

import { motion } from 'framer-motion';
import { Bookmark, Search, Sparkles, Zap } from 'lucide-react';
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

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Smart organization using local AI processing',
  },
  {
    icon: Search,
    title: 'Fast Search',
    description: 'Find any bookmark instantly with semantic search',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for speed with modern web technologies',
  },
  {
    icon: Bookmark,
    title: 'Privacy First',
    description: 'Your data stays yours with local-first architecture',
  },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 selection:bg-indigo-500/30">
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
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex max-w-5xl flex-col items-center text-center"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <Image
              src="/Bookmarkr_favicon.png"
              alt="Bookmarkr Logo"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
          </div>
        </motion.div>

        {/* Hero Text */}
        <motion.h1
          variants={itemVariants}
          className="mb-6 text-5xl font-bold sm:text-6xl lg:text-7xl"
        >
          <span className="bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent">
            Your bookmarks,
          </span>
          <br />
          <span className="text-gradient">reimagined with AI.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mb-10 max-w-2xl text-lg text-white/70 sm:text-xl"
        >
          Organize, search, and discover your saved content like never before using{' '}
          <span className="font-semibold text-indigo-300">local-first</span> AI
          processing.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="mb-16">
          <Link href="/login" className="btn-primary text-lg">
            Get Started
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          variants={itemVariants}
          className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="glass-card group p-6 text-center transition-transform hover:scale-105"
            >
              <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-3">
                <feature.icon className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
