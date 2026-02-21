'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

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

export type { BookmarkFilters };

interface BookmarkContextValue {
  bookmarks: Bookmark[];
  stats: BookmarkStats;
  loading: boolean;
  error: string | null;
  addBookmark: (payload: CreateBookmarkPayload) => Promise<void>;
  editBookmark: (id: string, payload: UpdateBookmarkPayload) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  filters: BookmarkFilters;
  setFilters: (filters: BookmarkFilters) => void;
  refetch: () => Promise<void>;
  /** Realtime connection status for UI feedback */
  realtimeConnected: boolean;
}

const DEFAULT_STATS: BookmarkStats = {
  total: 0,
  highPriority: 0,
  reading: 0,
  completed: 0,
};

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [stats, setStats] = useState<BookmarkStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookmarkFilters>({});
  const [realtimeConnected, setRealtimeConnected] = useState(false);

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

  const loadRef = useRef(load);
  loadRef.current = load;

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    load();
  }, [load, filters]);

  // Production-grade Realtime: single subscription, reconnection, status
  useEffect(() => {
    const supabase = createClient();
    const channelName = 'bookmarks-realtime';

    const setupChannel = () => {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookmarks' },
          () => {
            loadRef.current();
          },
        )
        .subscribe((status) => {
          setRealtimeConnected(status === 'SUBSCRIBED');
          if (status === 'CHANNEL_ERROR') {
            console.warn(
              'Bookmarkr: Realtime failed. Run: ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;',
            );
          }
          if (status === 'TIMED_OUT' || status === 'CLOSED') {
            setRealtimeConnected(false);
          }
        });

      return channel;
    };

    let channel = setupChannel();

    // Reconnect on visibility change (tab focus) - recovers from sleep/disconnect
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        supabase.removeChannel(channel);
        channel = setupChannel();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      supabase.removeChannel(channel);
      setRealtimeConnected(false);
    };
  }, []);

  const addBookmark = useCallback(async (payload: CreateBookmarkPayload) => {
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
      setBookmarks((prev) => {
        const hasTemp = prev.some((b) => b.id === tempId);
        if (hasTemp) {
          return prev.map((b) => (b.id === tempId ? created : b));
        }
        const alreadyHas = prev.some((b) => b.id === created.id);
        if (alreadyHas) return prev;
        return [created, ...prev];
      });
      const newStats = await fetchBookmarkStats();
      setStats(newStats);
    } catch (err) {
      setBookmarks((prev) => prev.filter((b) => b.id !== tempId));
      setStats((prev) => ({ ...prev, total: prev.total - 1 }));
      throw err;
    }
  }, []);

  const editBookmark = useCallback(
    async (id: string, payload: UpdateBookmarkPayload) => {
      const previous = bookmarks.find((b) => b.id === id);
      if (!previous) return;

      setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, ...payload } : b)));

      try {
        const updated = await updateBookmark(id, payload);
        setBookmarks((prev) => prev.map((b) => (b.id === id ? updated : b)));
        const newStats = await fetchBookmarkStats();
        setStats(newStats);
      } catch (err) {
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

  const value: BookmarkContextValue = {
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
    realtimeConnected,
  };

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
}

export function useBookmarkContext(): BookmarkContextValue {
  const ctx = useContext(BookmarkContext);
  if (!ctx) {
    throw new Error('useBookmarkContext must be used within BookmarkProvider');
  }
  return ctx;
}
