'use client';

import { ArrowRight, Bookmark, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageLoader } from '@/components/ui/loader';
import { WavyBackground } from '@/components/ui/wavy-background';
import { useGoogleSignInPopup } from '@/hooks/use-google-signin-popup';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const features = [
  {
    title: 'AI-Powered',
    description:
      'Smart AI automatically categorizes, tags, and prioritizes every link you save.',
  },
  {
    title: 'Instant Search',
    description: 'Find anything instantly with real-time, lightning-fast text filtering.',
  },
  {
    title: 'Instant',
    description:
      'Optimistic UI ensures zero friction. Saving and organizing feels instantaneous.',
  },
  {
    title: 'Private & Secure',
    description:
      'Protected by industry-standard Row Level Security. Only you can access your data.',
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
  const { signInWithPopup } = useGoogleSignInPopup();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleGetStarted = useCallback(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      setSignInOpen(true);
    }
  }, [user, router]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setSignInLoading(true);
      await signInWithPopup();
      setSignInOpen(false);
    } catch (err) {
      console.error('Sign in failed:', err);
    } finally {
      setSignInLoading(false);
    }
  }, [signInWithPopup]);

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
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white"
                onClick={() => setSignInOpen(true)}
              >
                Sign In
              </Button>
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
        className="flex h-full flex-col items-center justify-center px-6 text-center"
        colors={['#27272a', '#3f3f46', '#52525b', '#71717a', '#a1a1aa']}
        backgroundFill="#09090b"
        blur={8}
        speed="slow"
        waveOpacity={0.4}
      >
        <h1 className="mb-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          Your bookmarks,{' '}
          <span className="bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
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
        </div>

        <div className="mt-20 w-full max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-scroll flex w-max gap-6 py-4">
            {[...features, ...features, ...features, ...features].map((f, i) => (
              <div
                key={i}
                className="flex w-[300px] flex-shrink-0 flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <p className="font-semibold text-white">{f.title}</p>
                <p className="text-sm text-white/50">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </WavyBackground>

      {/* Sign In Popup Dialog */}
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to Bookmarkr</DialogTitle>
            <DialogDescription>
              Use your Google account to access your bookmarks
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={handleGoogleSignIn}
            disabled={signInLoading}
            className="w-full"
            variant="outline"
            size="lg"
          >
            {signInLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                Continue with Google
              </>
            )}
          </Button>
        </DialogContent>
      </Dialog>

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
