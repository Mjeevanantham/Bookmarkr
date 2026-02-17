import { Bookmark, Search, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Organization',
    description:
      'Automatically categorize and tag your bookmarks using local AI processing.',
  },
  {
    icon: Search,
    title: 'Semantic Search',
    description:
      'Find any bookmark instantly with intelligent search that understands context.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Built with modern web technologies for instant loading and smooth interactions.',
  },
  {
    icon: Bookmark,
    title: 'Privacy First',
    description: 'Your data stays yours. All processing happens locally on your device.',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Bookmark className="h-6 w-6" />
            <span className="text-xl font-semibold">Bookmarkr</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 items-center">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="mb-6 text-5xl font-semibold tracking-tight sm:text-6xl">
            Your bookmarks,
            <br />
            <span className="text-muted-foreground">organized intelligently.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Stop losing track of important links. Bookmarkr uses local-first AI to help
            you organize, search, and rediscover your saved content.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg">Start Free</Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-semibold">Everything you need</h2>
            <p className="text-muted-foreground">
              Powerful features to manage your bookmarks efficiently
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="mb-2 h-10 w-10" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              <span className="font-medium">Bookmarkr</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Bookmarkr. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
