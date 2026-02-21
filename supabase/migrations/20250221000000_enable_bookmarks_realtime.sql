-- Enable Realtime for bookmarks table (multi-tab, cross-device sync)
-- Run: supabase db push (or execute in Supabase SQL Editor)
-- If you get "relation already member of publication", the table is already enabled.

-- 1. Add table to Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'bookmarks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
  END IF;
END $$;

-- 2. REPLICA IDENTITY FULL: ensures full row data in UPDATE/DELETE events for reliable sync
ALTER TABLE public.bookmarks REPLICA IDENTITY FULL;
