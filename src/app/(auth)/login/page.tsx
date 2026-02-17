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
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute -right-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card group p-8">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative flex flex-col items-center text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <Image
                  src="/Bookmarkr_favicon.png"
                  alt="Bookmarkr Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              </div>
            </motion.div>

            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="mb-8 text-white/60">Sign in to access your smart bookmarks</p>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100 hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Loader size="sm" className="text-zinc-600" />
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                  <span className="relative z-10">Sign in with Google</span>
                </>
              )}
            </button>

            <div className="mt-8 flex items-center gap-2 text-xs text-white/40">
              <div className="h-px w-8 bg-white/20" />
              <span>Smart Bookmark Manager</span>
              <div className="h-px w-8 bg-white/20" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
