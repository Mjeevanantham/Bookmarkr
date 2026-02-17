'use client';

import { Bookmark, ExternalLink, MoreVertical, Plus, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

interface BookmarkType {
  id: string;
  title: string;
  url: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'reading' | 'completed' | 'saved';
}

const mockBookmarks: BookmarkType[] = [
  {
    id: '1',
    title: 'Next.js Documentation',
    url: 'https://nextjs.org/docs',
    description: 'The official Next.js documentation with guides and API references',
    priority: 'high',
    status: 'reading',
  },
  {
    id: '2',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    description: 'A utility-first CSS framework for rapid UI development',
    priority: 'medium',
    status: 'completed',
  },
  {
    id: '3',
    title: 'shadcn/ui',
    url: 'https://ui.shadcn.com',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS',
    priority: 'low',
    status: 'saved',
  },
];

export default function DashboardPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedView = localStorage.getItem('bookmarkView') as 'grid' | 'list' | null;
    if (savedView) setView(savedView);

    setTimeout(() => {
      setBookmarks(mockBookmarks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
    localStorage.setItem('bookmarkView', newView);
  };

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: bookmarks.length,
    highPriority: bookmarks.filter((b) => b.priority === 'high').length,
    reading: bookmarks.filter((b) => b.status === 'reading').length,
    completed: bookmarks.filter((b) => b.status === 'completed').length,
  };

  return (
    <DashboardLayout
      currentView={view}
      onViewChange={handleViewChange}
      onSearchChange={setSearchQuery}
      showViewToggle
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage and organize your bookmarks
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Bookmark
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookmarks</CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highPriority}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reading</CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reading}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Bookmarks Section */}
        <div>
          <h2 className="mb-4 text-xl font-medium">Recent Bookmarks</h2>

          {loading ? (
            <div
              className={
                view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'
              }
            >
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Bookmark className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">No bookmarks yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Start organizing your web content by adding your first bookmark
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Bookmark
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'
              }
            >
              {filteredBookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{bookmark.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">
                      {bookmark.description}
                    </CardDescription>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {new URL(bookmark.url).hostname}
                    </a>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Badge
                      variant={bookmark.priority === 'high' ? 'destructive' : 'secondary'}
                    >
                      {bookmark.priority}
                    </Badge>
                    <Badge variant="outline">{bookmark.status}</Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
