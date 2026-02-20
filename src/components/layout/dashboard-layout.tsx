'use client';

import {
  Bookmark,
  ChevronsLeft,
  Grid3x3,
  LayoutDashboard,
  List,
  LogOut,
  Search,
  Settings,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Bookmarks', href: '/dashboard/bookmarks', icon: Bookmark },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface DashboardLayoutProps {
  children: ReactNode;
  onViewChange?: (view: 'grid' | 'list') => void;
  currentView?: 'grid' | 'list';
  onSearchChange?: (search: string) => void;
  showViewToggle?: boolean;
}

export function DashboardLayout({
  children,
  onViewChange,
  currentView = 'grid',
  onSearchChange,
  showViewToggle = false,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setUserLoading(false);
    });
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearchChange?.(e.target.value);
  };

  const fullName = user?.user_metadata?.full_name as string | undefined;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const email = user?.email;
  const initials = fullName ? getInitials(fullName) : (email?.[0]?.toUpperCase() ?? 'U');
  const displayName = fullName ?? email ?? 'User';

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <aside
          className={cn(
            'group relative flex flex-col border-r bg-muted/10 transition-all duration-300 ease-in-out',
            isCollapsed ? 'w-[60px]' : 'w-64',
          )}
        >
          {/* Collapse Toggle */}
          <div
            className={cn(
              'absolute -right-3 top-6 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border bg-background text-foreground opacity-0 shadow-sm transition-opacity hover:bg-muted group-hover:opacity-100',
              isCollapsed && 'rotate-180',
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronsLeft className="h-3 w-3" />
          </div>

          <div className="flex h-14 items-center justify-center border-b px-3">
            {isCollapsed ? (
              <Image
                src="/Bookmarkr_favicon.png"
                alt="B"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <div className="flex w-full items-center justify-start px-2 transition-all duration-300">
                <Image
                  src="/Bookmarkr_full_logo.png"
                  alt="Bookmarkr"
                  width={160}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1 p-2">
            {navigation.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname?.startsWith(item.href + '/');

              return isCollapsed ? (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-muted',
                        isActive
                          ? 'bg-foreground text-background hover:bg-foreground/90'
                          : 'text-muted-foreground',
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="sr-only">{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-4">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
                    isActive
                      ? 'bg-muted font-semibold text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile (Bottom Sidebar) */}
          <div className="border-t p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={cn(
                    'flex cursor-pointer items-center rounded-md p-2 transition-colors hover:bg-muted',
                    isCollapsed ? 'justify-center' : 'gap-3',
                  )}
                >
                  {userLoading ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : (
                    <Avatar className="h-8 w-8 shrink-0 border border-border/40">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                  )}
                  {!isCollapsed && !userLoading && (
                    <div className="flex flex-1 flex-col overflow-hidden text-left">
                      <span className="truncate text-sm font-medium leading-none">
                        {displayName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {email}
                      </span>
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side={isCollapsed ? 'right' : 'top'}
                className="w-56"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex h-14 items-center gap-4 bg-background px-6">
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchValue}
                onChange={handleSearchChange}
                className="h-9 w-full max-w-sm border-none bg-muted/40 pl-9 shadow-none focus-visible:ring-1 focus-visible:ring-ring sm:w-80"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {showViewToggle && (
                <div className="flex items-center rounded-md border bg-background p-1 shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-7 w-7 rounded-sm',
                      currentView === 'grid' && 'bg-muted shadow-sm',
                    )}
                    onClick={() => onViewChange?.('grid')}
                  >
                    <Grid3x3 className="h-4 w-4" />
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-7 w-7 rounded-sm',
                      currentView === 'list' && 'bg-muted shadow-sm',
                    )}
                    onClick={() => onViewChange?.('list')}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
