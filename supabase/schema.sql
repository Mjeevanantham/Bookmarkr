-- ============================================================
-- Bookmarkr Database Reset Script
-- 🚨 WARNING: This will DROP ALL EXISTING DATA in these tables.
-- Run this entire file in Supabase > SQL Editor to reset/setup.
-- ============================================================

-- 1. Clean up existing tables (Order matters due to foreign keys)
DROP TABLE IF EXISTS public.bookmark_tags CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.bookmarks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 3. PROFILES TABLE
-- Matches src/types/database.ts: Profile
-- =====================================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  social_image text,
  -- Renamed from 'theme_color' to match frontend code
  theme text CHECK (theme IN ('light', 'dark', 'system')) DEFAULT 'system',
  slack_webhook text,
  email_notifications boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 4. BOOKMARKS TABLE
-- Matches src/types/database.ts: Bookmark
-- =====================================================
CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  description text,
  -- Stricter checks to match TypeScript types
  priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status text CHECK (status IN ('saved', 'reading', 'completed')) DEFAULT 'saved',
  reminder_at timestamptz,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 5. TAGS TABLE (Future proofing)
-- =====================================================
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

-- =====================================================
-- 6. BOOKMARK_TAGS TABLE (Many-to-Many)
-- =====================================================
CREATE TABLE public.bookmark_tags (
  bookmark_id uuid REFERENCES public.bookmarks(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (bookmark_id, tag_id)
);

-- =====================================================
-- 7. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_priority ON public.bookmarks(priority);
CREATE INDEX idx_bookmarks_status ON public.bookmarks(status);
CREATE INDEX idx_bookmarks_reminder ON public.bookmarks(reminder_at);
CREATE INDEX idx_tags_user ON public.tags(user_id);

-- =====================================================
-- 8. AUTO UPDATE updated_at TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_bookmarks_updated_at
BEFORE UPDATE ON public.bookmarks
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- =====================================================
-- 9. AUTO CREATE PROFILE ON USER SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger checks if it exists first to avoid dupes (though CREATE OR REPLACE handles function)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark_tags ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Bookmarks Policies
CREATE POLICY "Users manage own bookmarks" 
ON public.bookmarks FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Tags Policies
CREATE POLICY "Users manage own tags" 
ON public.tags FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Bookmark Tags Policies
CREATE POLICY "Users manage own bookmark_tags" 
ON public.bookmark_tags FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.bookmarks 
    WHERE bookmarks.id = bookmark_tags.bookmark_id 
    AND bookmarks.user_id = auth.uid()
  )
);

-- =====================================================
-- 11. BACKFILL PROFILES FOR EXISTING USERS
-- =====================================================
-- Since we dropped the profiles table, this restores your profile
-- from your existing auth account so you can log in immediately.
INSERT INTO public.profiles (id, full_name, avatar_url)
SELECT 
  id, 
  (raw_user_meta_data->>'full_name')::text, 
  (raw_user_meta_data->>'avatar_url')::text
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 12. ENABLE REALTIME FOR MULTI-TAB SYNC
-- =====================================================
-- Required for useBookmarks realtime subscription to work across tabs.
-- Run in Supabase SQL Editor if bookmarks table exists but sync is unreliable:
--   ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
-- (Skip if you get "relation already member of publication")
