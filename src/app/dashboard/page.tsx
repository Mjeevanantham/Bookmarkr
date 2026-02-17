'use client';

import { motion } from 'framer-motion';
import { Bookmark, ExternalLink, MoreVertical, Plus, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { GlassCard } from '@/components/ui/glass-card';
import { SkeletonCard } from '@/components/ui/skeleton';

// Mock data - replace with actual Supabase data
interface BookmarkType {
  id: string;
  title: string;
  url: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'reading' | 'completed' | 'saved';
  createdAt: string;
}

const mockBookmarks: BookmarkType[] = [
  {
    id: '1',
    title: 'Next.js Documentation',
    url: 'https://nextjs.org/docs',
    description: 'The official Next.js documentation with guides and API references',
    priority: 'high',
    status: 'reading',
    createdAt: '2024-02-15',
  },
  {
    id: '2',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    description: 'A utility-first CSS framework for rapid UI development',
    priority: 'medium',
    status: 'completed',
    createdAt: '2024-02-14',
  },
  {
    id: '3',
    title: 'Framer Motion',
    url: 'https://www.framer.com/motion',
    description: 'Production-ready animation library for React',
    priority: 'low',
    status: 'saved',
    createdAt: '2024-02-13',
  },
];

export default function DashboardPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load view preference from localStorage
    const savedView = localStorage.getItem('bookmarkView') as 'grid' | 'list' | null;
    if (savedView) setView(savedView);

    // Simulate loading
    setTimeout(() => {
      setBookmarks(mockBookmarks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
    localStorage.setItem('bookmarkView', newView);
  };

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: bookmarks.length,
    highPriority: bookmarks.filter((b) => b.priority === 'high').length,
    reading: bookmarks.filter((b) => b.status === 'reading').length,
    completed: bookmarks.filter((b) => b.status === 'completed').length,
  };

  return (
    <AppShell
      currentView={view}
      onViewChange={handleViewChange}
      onSearchChange={setSearchQuery}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-white/60">
              Manage and organize your smart bookmarks
            </p>
          </div>
          <Button>
            <Plus className="h-5 w-5" />
            Add Bookmark
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Total Bookmarks</p>
                  <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="rounded-full bg-indigo-500/20 p-3">
                  <Bookmark className="h-6 w-6 text-indigo-400" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">High Priority</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {stats.highPriority}
                  </p>
                </div>
                <div className="rounded-full bg-red-500/20 p-3">
                  <TrendingUp className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Reading</p>
                  <p className="mt-2 text-3xl font-bold text-white">{stats.reading}</p>
                </div>
                <div className="rounded-full bg-yellow-500/20 p-3">
                  <Bookmark className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Completed</p>
                  <p className="mt-2 text-3xl font-bold text-white">{stats.completed}</p>
                </div>
                <div className="rounded-full bg-green-500/20 p-3">
                  <Bookmark className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Bookmarks Section */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">Your Bookmarks</h2>

          {loading ? (
            <div
              className={
                view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'
              }
            >
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <GlassCard>
              <EmptyState
                title="No bookmarks yet"
                description="Start organizing your web content by adding your first bookmark"
                action={
                  <Button>
                    <Plus className="h-5 w-5" />
                    Add Your First Bookmark
                  </Button>
                }
              />
            </GlassCard>
          ) : (
            <div
              className={
                view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'
              }
            >
              {filteredBookmarks.map((bookmark, index) => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard hover className="group relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-2 font-semibold text-white transition-colors group-hover:text-indigo-400">
                          {bookmark.title}
                        </h3>
                        <p className="mb-3 line-clamp-2 text-sm text-white/60">
                          {bookmark.description}
                        </p>
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mb-4 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {new URL(bookmark.url).hostname}
                        </a>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={bookmark.priority}>{bookmark.priority}</Badge>
                          <Badge variant="default">{bookmark.status}</Badge>
                        </div>
                      </div>
                      <button className="rounded-lg p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
