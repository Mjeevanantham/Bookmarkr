'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import {
  createBookmark,
  deleteBookmark,
  fetchBookmarks,
  fetchBookmarkStats,
  updateBookmark,
  type BookmarkFilters,
  type BookmarkStats,
} from '@/services/bookmarks';
import type { Bookmark, CreateBookmarkPayload, UpdateBookmarkPayload } from '@/types';

// Re-export filter type so pages don't need to import from services directly
export type { BookmarkFilters };

interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  stats: BookmarkStats;
  loading: boolean;
  error: string | null;
  // Mutations
  addBookmark: (payload: CreateBookmarkPayload) => Promise<void>;
  editBookmark: (id: string, payload: UpdateBookmarkPayload) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  // Filter controls
  filters: BookmarkFilters;
  setFilters: (filters: BookmarkFilters) => void;
  refetch: () => Promise<void>;
}

const DEFAULT_STATS: BookmarkStats = {
  total: 0,
  highPriority: 0,
  reading: 0,
  completed: 0,
};

export function useBookmarks(initialFilters: BookmarkFilters = {}): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [stats, setStats] = useState<BookmarkStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookmarkFilters>(initialFilters);

  // Ref to hold the latest filters without triggering subscription re-registration
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const load = useCallback(async () => {
    try {
      setError(null);
      const [data, statsData] = await Promise.all([
        fetchBookmarks(filtersRef.current),
        fetchBookmarkStats(),
      ]);
      setBookmarks(data);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    load();
  }, [load, filters]); // Re-fetch when filters change

  // Realtime subscription — multi-tab sync
  // Uses stable load ref to avoid re-subscribing; ensure bookmarks table is in supabase_realtime publication
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('bookmarks-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks' },
        () => {
          loadRef.current();
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn(
            'Bookmarkr: Realtime subscription failed. Ensure "public.bookmarks" is in supabase_realtime publication. Run: ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;'
          );
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── Mutations ──────────────────────────────────────────────

  const addBookmark = useCallback(async (payload: CreateBookmarkPayload) => {
    // Optimistic insert
    const tempId = `temp-${Date.now()}`;
    const optimistic: Bookmark = {
      id: tempId,
      user_id: '',
      title: payload.title,
      url: payload.url,
      description: payload.description ?? null,
      priority: payload.priority ?? 'medium',
      status: payload.status ?? 'saved',
      reminder_at: payload.reminder_at ?? null,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setBookmarks((prev) => [optimistic, ...prev]);
    setStats((prev) => ({ ...prev, total: prev.total + 1 }));

    try {
      const created = await createBookmark(payload);
      // Replace temp row with real row
      setBookmarks((prev) => prev.map((b) => (b.id === tempId ? created : b)));
      setStats((prev) => ({
        ...prev,
        highPriority:
          created.priority === 'high' ? prev.highPriority + 1 : prev.highPriority,
        reading: created.status === 'reading' ? prev.reading + 1 : prev.reading,
        completed: created.status === 'completed' ? prev.completed + 1 : prev.completed,
      }));
    } catch (err) {
      // Rollback on error
      setBookmarks((prev) => prev.filter((b) => b.id !== tempId));
      setStats((prev) => ({ ...prev, total: prev.total - 1 }));
      throw err;
    }
  }, []);

  const editBookmark = useCallback(
    async (id: string, payload: UpdateBookmarkPayload) => {
      const previous = bookmarks.find((b) => b.id === id);
      if (!previous) return;

      // Optimistic update
      setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, ...payload } : b)));

      try {
        const updated = await updateBookmark(id, payload);
        setBookmarks((prev) => prev.map((b) => (b.id === id ? updated : b)));
        // Refresh stats as priority/status may have changed
        const newStats = await fetchBookmarkStats();
        setStats(newStats);
      } catch (err) {
        // Rollback
        setBookmarks((prev) => prev.map((b) => (b.id === id ? previous : b)));
        throw err;
      }
    },
    [bookmarks],
  );

  const removeBookmark = useCallback(
    async (id: string) => {
      const previous = bookmarks.find((b) => b.id === id);
      if (!previous) return;

      // Optimistic delete
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      setStats((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        highPriority:
          previous.priority === 'high'
            ? Math.max(0, prev.highPriority - 1)
            : prev.highPriority,
        reading:
          previous.status === 'reading' ? Math.max(0, prev.reading - 1) : prev.reading,
        completed:
          previous.status === 'completed'
            ? Math.max(0, prev.completed - 1)
            : prev.completed,
      }));

      try {
        await deleteBookmark(id);
      } catch (err) {
        // Rollback
        setBookmarks((prev) => [previous, ...prev]);
        setStats((prev) => ({
          ...prev,
          total: prev.total + 1,
          highPriority:
            previous.priority === 'high' ? prev.highPriority + 1 : prev.highPriority,
          reading: previous.status === 'reading' ? prev.reading + 1 : prev.reading,
          completed:
            previous.status === 'completed' ? prev.completed + 1 : prev.completed,
        }));
        throw err;
      }
    },
    [bookmarks],
  );

  return {
    bookmarks,
    stats,
    loading,
    error,
    addBookmark,
    editBookmark,
    removeBookmark,
    filters,
    setFilters,
    refetch: load,
  };
}
