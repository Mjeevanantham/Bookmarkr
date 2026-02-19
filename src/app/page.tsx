'use client';

import { ArrowRight, Bookmark, Bot, Lock, Search, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loader';
import { WavyBackground } from '@/components/ui/wavy-background';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered',
    description: 'Local AI automatically categorizes and tags every link you save.',
  },
  {
    icon: Search,
    title: 'Semantic Search',
    description: 'Find anything instantly - search by meaning, not just keywords.',
  },
  {
    icon: Zap,
    title: 'Instant',
    description: 'Lightning-fast interface with zero friction saving and retrieval.',
  },
  {
    icon: Lock,
    title: 'Private by Default',
    description: 'All processing runs locally. Your data never leaves your device.',
  },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function LandingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, [supabase]);

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  if (loading) return <PageLoader />;

  const fullName = user?.user_metadata?.full_name as string | undefined;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const email = user?.email;
  const initials = fullName ? getInitials(fullName) : 'U';

  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2 text-white">
          <Bookmark className="h-5 w-5" />
          <span className="text-lg font-semibold tracking-tight">Bookmarkr</span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard">
              <div className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm transition hover:bg-white/20">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={avatarUrl} alt={fullName} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-white">
                  {fullName ?? email}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-white/70" />
              </div>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Button
                onClick={handleGetStarted}
                className="bg-white text-black hover:bg-white/90"
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero - Wavy */}
      <WavyBackground
        containerClassName="min-h-screen"
        className="flex flex-col items-center justify-center px-6 pb-20 pt-32 text-center"
        colors={['#6366f1', '#8b5cf6', '#a855f7', '#3b82f6', '#06b6d4']}
        backgroundFill="#09090b"
        blur={8}
        speed="slow"
        waveOpacity={0.4}
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 backdrop-blur-sm">
          <Bot className="h-3.5 w-3.5 text-indigo-300" />
          <span className="text-xs font-medium text-white/80">
            Local-first AI · Zero data leakage
          </span>
        </div>

        <h1 className="mb-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          Your bookmarks,{' '}
          <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            finally organized.
          </span>
        </h1>

        <p className="mb-10 max-w-xl text-lg text-white/60">
          Bookmarkr uses on-device AI to automatically sort, tag, and surface your saved
          links so you spend less time searching and more time doing.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="gap-2 bg-white px-8 text-base font-semibold text-black hover:bg-white/90"
          >
            {user ? 'Go to Dashboard' : 'Start Free'}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <span className="text-sm text-white/40">No credit card required</span>
        </div>

        <div className="mt-20 grid gap-px rounded-2xl border border-white/10 bg-white/10 p-px sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-2 rounded-[calc(1rem-1px)] bg-black/60 p-6 text-left backdrop-blur-sm"
            >
              <f.icon className="h-6 w-6 text-indigo-400" />
              <p className="font-semibold text-white">{f.title}</p>
              <p className="text-sm text-white/50">{f.description}</p>
            </div>
          ))}
        </div>
      </WavyBackground>

      <footer className="border-t bg-black py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-white/60">
            <Bookmark className="h-4 w-4" />
            <span className="text-sm">Bookmarkr</span>
          </div>
          <p className="text-sm text-white/40">2026 Bookmarkr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
