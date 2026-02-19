import { createClient } from '@/lib/supabase/client';
import type {
  Bookmark,
  CreateBookmarkPayload,
  Priority,
  Status,
  UpdateBookmarkPayload,
} from '@/types';

export interface BookmarkFilters {
  status?: Status | 'all';
  priority?: Priority | 'all';
  search?: string;
}

// ─── READ ─────────────────────────────────────────────────────

export async function fetchBookmarks(filters: BookmarkFilters = {}): Promise<Bookmark[]> {
  const supabase = createClient();

  let query = supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.priority && filters.priority !== 'all') {
    query = query.eq('priority', filters.priority);
  }

  if (filters.search && filters.search.trim() !== '') {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,url.ilike.%${filters.search}%`,
    );
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data as Bookmark[];
}

// ─── CREATE ───────────────────────────────────────────────────

export async function createBookmark(payload: CreateBookmarkPayload): Promise<Bookmark> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      ...payload,
      user_id: user.id,
      priority: payload.priority ?? 'medium',
      status: payload.status ?? 'saved',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Bookmark;
}

// ─── UPDATE ───────────────────────────────────────────────────

export async function updateBookmark(
  id: string,
  payload: UpdateBookmarkPayload,
): Promise<Bookmark> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookmarks')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Bookmark;
}

// ─── DELETE ───────────────────────────────────────────────────

export async function deleteBookmark(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from('bookmarks').delete().eq('id', id);

  if (error) throw new Error(error.message);
}

// ─── STATS ────────────────────────────────────────────────────

export interface BookmarkStats {
  total: number;
  highPriority: number;
  reading: number;
  completed: number;
}

export async function fetchBookmarkStats(): Promise<BookmarkStats> {
  const supabase = createClient();

  const { data, error } = await supabase.from('bookmarks').select('status, priority');

  if (error) throw new Error(error.message);

  const rows = data ?? [];
  return {
    total: rows.length,
    highPriority: rows.filter((r) => r.priority === 'high').length,
    reading: rows.filter((r) => r.status === 'reading').length,
    completed: rows.filter((r) => r.status === 'completed').length,
  };
}
