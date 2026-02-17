'use client';

import { Bookmark, ExternalLink, MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';
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

const mockBookmarks = [
  {
    id: '1',
    title: 'Next.js Documentation',
    url: 'https://nextjs.org/docs',
    description: 'The official Next.js documentation with guides and API references',
    priority: 'high' as const,
    status: 'reading' as const,
  },
  {
    id: '2',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    description: 'A utility-first CSS framework for rapid UI development',
    priority: 'medium' as const,
    status: 'completed' as const,
  },
  {
    id: '3',
    title: 'shadcn/ui',
    url: 'https://ui.shadcn.com',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS',
    priority: 'low' as const,
    status: 'saved' as const,
  },
];

export default function BookmarksPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [bookmarks] = useState(mockBookmarks);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout
      currentView={view}
      onViewChange={setView}
      onSearchChange={setSearchQuery}
      showViewToggle
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">All Bookmarks</h1>
            <p className="text-sm text-muted-foreground">
              {filteredBookmarks.length} bookmark
              {filteredBookmarks.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Bookmark
          </Button>
        </div>

        {/* Bookmarks */}
        {filteredBookmarks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bookmark className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Start organizing your web content by adding your first bookmark'}
              </p>
              {!searchQuery && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Bookmark
                </Button>
              )}
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
    </DashboardLayout>
  );
}
