// Central re-export point for all app types
export type {
  Bookmark,
  CreateBookmarkPayload,
  Priority,
  Profile,
  Status,
  Theme,
  UpdateBookmarkPayload,
  UpdateProfilePayload,
} from './database';

export type BasicResponse = {
  status: 'ok' | 'error';
  message?: string;
};

// Auth user shape (from Supabase user_metadata)
export type AppUser = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
};
