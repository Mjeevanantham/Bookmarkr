'use client';

import { Bookmark, Home, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Bookmarks', href: '/dashboard/bookmarks', icon: Bookmark },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Image
              src="/Bookmarkr_favicon.png"
              alt="Bookmarkr"
              width={24}
              height={24}
              className="h-6 w-6"
            />
          </div>
          <span className="text-xl font-bold text-white">Bookmarkr</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white shadow-lg shadow-indigo-500/10'
                    : 'text-white/60 hover:bg-white/5 hover:text-white',
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            <LogOut className="h-5 w-5" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </aside>
  );
}
