'use client';

import { AlertCircle, Bookmark, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AddBookmarkDialog } from '@/components/bookmarks/add-bookmark-dialog';
import { BookmarkCard } from '@/components/bookmarks/bookmark-card';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookmarkContext } from '@/contexts/bookmark-context';

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    bookmarks,
    stats,
    loading,
    error,
    addBookmark,
    editBookmark,
    removeBookmark,
    setFilters,
    realtimeConnected,
  } = useBookmarkContext();

  // Persist view preference
  useEffect(() => {
    const saved = localStorage.getItem('bookmarkView') as 'grid' | 'list' | null;
    if (saved) setView(saved);
  }, []);

  const handleViewChange = (v: 'grid' | 'list') => {
    setView(v);
    localStorage.setItem('bookmarkView', v);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setFilters({ search: query || undefined });
  };

  return (
    <DashboardLayout
      currentView={view}
      onViewChange={handleViewChange}
      onSearchChange={handleSearchChange}
      showViewToggle
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold">Dashboard</h1>
              {realtimeConnected && (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                  title="Real-time sync active"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Manage and organize your bookmarks
            </p>
          </div>
          <AddBookmarkDialog onAdd={addBookmark} />
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookmarks"
            value={stats.total}
            icon={Bookmark}
            loading={loading}
          />
          <StatCard
            title="High Priority"
            value={stats.highPriority}
            icon={TrendingUp}
            loading={loading}
          />
          <StatCard
            title="Reading"
            value={stats.reading}
            icon={Bookmark}
            loading={loading}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={Bookmark}
            loading={loading}
          />
        </div>

        {/* Bookmarks Section */}
        <div>
          <h2 className="mb-4 text-xl font-medium">
            {searchQuery ? `Results for "${searchQuery}"` : 'Recent Bookmarks'}
          </h2>

          {loading ? (
            <div
              className={
                view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'
              }
            >
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Bookmark className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">
                  {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
                </h3>
                <p className="mb-4 text-center text-sm text-muted-foreground">
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Add your first bookmark to get started'}
                </p>
                {!searchQuery && <AddBookmarkDialog onAdd={addBookmark} />}
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'
              }
            >
              {bookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onEdit={editBookmark}
                  onDelete={removeBookmark}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
