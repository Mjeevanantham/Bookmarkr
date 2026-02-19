// Auto-maintained to match supabase/schema.sql
// Update this file whenever the schema changes.

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'saved' | 'reading' | 'completed';
export type Theme = 'light' | 'dark' | 'system';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  slack_webhook: string | null;
  theme: Theme;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description: string | null;
  priority: Priority;
  status: Status;
  reminder_at: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

// Payload types for create / update operations
export type CreateBookmarkPayload = Pick<Bookmark, 'title' | 'url'> &
  Partial<Pick<Bookmark, 'description' | 'priority' | 'status' | 'reminder_at'>>;

export type UpdateBookmarkPayload = Partial<
  Pick<Bookmark, 'title' | 'url' | 'description' | 'priority' | 'status' | 'reminder_at'>
>;

export type UpdateProfilePayload = Partial<
  Pick<Profile, 'full_name' | 'slack_webhook' | 'theme'>
>;
