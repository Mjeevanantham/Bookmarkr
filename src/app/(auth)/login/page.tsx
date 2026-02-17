'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Loader } from '@/components/ui/loader';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0A0A0A] text-white selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 h-full w-full">
        {/* Deep background gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#000000] to-black opacity-90" />

        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 mix-blend-screen blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/20 mix-blend-screen blur-[120px]"
        />

        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Smooth spring-like curve
        className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-2xl border border-white/5 bg-zinc-900/40 p-8 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
      >
        {/* Premium ambient light effect inside card */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20" />

        {/* Logo Section */}
        <div className="group relative mb-10 flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
            <Image
              src="/Bookmarkr_full_logo.png"
              alt="Bookmarkr"
              width={160}
              height={50}
              className="relative opacity-90 drop-shadow-2xl invert"
              priority
            />
          </div>
          <p className="animate-in fade-in slide-in-from-bottom-2 mt-3 text-sm text-zinc-400 delay-100 duration-1000">
            Intelligent bookmark manager
          </p>
        </div>

        {/* Action Section */}
        <div className="w-full space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-white px-5 py-3.5 text-sm font-medium text-black shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {/* Button Shine Effect */}
            <div className="absolute inset-0 translate-x-[-200%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shine" />

            {loading ? (
              <Loader size="sm" className="text-zinc-600" />
            ) : (
              <>
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="relative z-10 font-semibold tracking-wide">
                  Sign in with Google
                </span>
              </>
            )}
          </button>

          <div className="mt-6 text-center text-xs text-zinc-600">
            By continuing, you agree to our{' '}
            <a href="#" className="underline transition-colors hover:text-zinc-400">
              Terms of Service
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
