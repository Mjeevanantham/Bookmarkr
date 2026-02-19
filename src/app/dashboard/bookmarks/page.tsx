'use client';

import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AddBookmarkDialog } from '@/components/bookmarks/add-bookmark-dialog';
import { BookmarkCard } from '@/components/bookmarks/bookmark-card';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookmarks } from '@/hooks/use-bookmarks';
import type { Priority, Status } from '@/types';

const STATUS_OPTIONS: { label: string; value: Status | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Saved', value: 'saved' },
  { label: 'Reading', value: 'reading' },
  { label: 'Completed', value: 'completed' },
];

const PRIORITY_OPTIONS: { label: string; value: Priority | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

export default function BookmarksPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const {
    bookmarks,
    loading,
    error,
    addBookmark,
    editBookmark,
    removeBookmark,
    filters,
    setFilters,
  } = useBookmarks();

  useEffect(() => {
    const saved = localStorage.getItem('bookmarkView') as 'grid' | 'list' | null;
    if (saved) setView(saved);
  }, []);

  const handleViewChange = (v: 'grid' | 'list') => {
    setView(v);
    localStorage.setItem('bookmarkView', v);
  };

  const handleSearchChange = (query: string) => {
    setFilters({ ...filters, search: query || undefined });
  };

  const setStatus = (status: Status | 'all') => {
    setFilters({ ...filters, status });
  };

  const setPriority = (priority: Priority | 'all') => {
    setFilters({ ...filters, priority });
  };

  const activeStatus = filters.status ?? 'all';
  const activePriority = filters.priority ?? 'all';

  return (
    <DashboardLayout
      currentView={view}
      onViewChange={handleViewChange}
      onSearchChange={handleSearchChange}
      showViewToggle
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">All Bookmarks</h1>
            <p className="text-sm text-muted-foreground">
              {loading
                ? 'Loading…'
                : `${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <AddBookmarkDialog onAdd={addBookmark} />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">Status:</span>
            <div className="flex gap-1">
              {STATUS_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={activeStatus === opt.value ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setStatus(opt.value)}
                  className="h-7 px-2.5 text-xs"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">Priority:</span>
            <div className="flex gap-1">
              {PRIORITY_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={activePriority === opt.value ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setPriority(opt.value)}
                  className="h-7 px-2.5 text-xs"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Active filter badges */}
          {(activeStatus !== 'all' || activePriority !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2.5 text-xs text-muted-foreground"
              onClick={() => setFilters({})}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Bookmark Grid/List */}
        {loading ? (
          <div
            className={
              view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'
            }
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
                {activeStatus !== 'all' || activePriority !== 'all' || filters.search
                  ? 'No bookmarks match these filters'
                  : 'No bookmarks yet'}
              </h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                {activeStatus !== 'all' || activePriority !== 'all' || filters.search
                  ? 'Try adjusting your filters or search query'
                  : 'Start saving links to build your collection'}
              </p>
              {!filters.search && activeStatus === 'all' && activePriority === 'all' && (
                <AddBookmarkDialog onAdd={addBookmark} />
              )}
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
    </DashboardLayout>
  );
}
