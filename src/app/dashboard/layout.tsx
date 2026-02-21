'use client';

import { BookmarkProvider } from '@/contexts/bookmark-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <BookmarkProvider>{children}</BookmarkProvider>;
}
