'use client';

import { motion } from 'framer-motion';
import { ExternalLink, MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { GlassCard } from '@/components/ui/glass-card';

// This will be replaced with actual Supabase data
const mockBookmarks = [
  {
    id: '1',
    title: 'Next.js Documentation',
    url: 'https://nextjs.org/docs',
    description: 'The official Next.js documentation with guides and API references',
    priority: 'high' as const,
    status: 'reading' as const,
  },
  {
    id: '2',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    description: 'A utility-first CSS framework for rapid UI development',
    priority: 'medium' as const,
    status: 'completed' as const,
  },
];

export default function BookmarksPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [bookmarks] = useState(mockBookmarks);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AppShell currentView={view} onViewChange={setView} onSearchChange={setSearchQuery}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">All Bookmarks</h1>
            <p className="mt-1 text-sm text-white/60">
              {filteredBookmarks.length} bookmark
              {filteredBookmarks.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <Button>
            <Plus className="h-5 w-5" />
            Add Bookmark
          </Button>
        </div>

        {/* Bookmarks */}
        {filteredBookmarks.length === 0 ? (
          <GlassCard>
            <EmptyState
              title="No bookmarks found"
              description={
                searchQuery
                  ? 'Try adjusting your search query'
                  : 'Start organizing your web content by adding your first bookmark'
              }
              action={
                !searchQuery && (
                  <Button>
                    <Plus className="h-5 w-5" />
                    Add Your First Bookmark
                  </Button>
                )
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
    </AppShell>
  );
}
