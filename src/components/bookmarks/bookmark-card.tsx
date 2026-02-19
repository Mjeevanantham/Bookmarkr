'use client';

import { ExternalLink, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditBookmarkDialog } from './edit-bookmark-dialog';
import type { Bookmark, UpdateBookmarkPayload } from '@/types';

const PRIORITY_VARIANT: Record<
  Bookmark['priority'],
  'destructive' | 'default' | 'secondary'
> = {
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
};

const STATUS_LABEL: Record<Bookmark['status'], string> = {
  saved: 'Saved',
  reading: 'Reading',
  completed: 'Completed',
};

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (id: string, payload: UpdateBookmarkPayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function BookmarkCard({ bookmark, onEdit, onDelete }: BookmarkCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete(bookmark.id);
    } finally {
      setDeleting(false);
    }
  };

  let hostname = '';
  try {
    hostname = new URL(bookmark.url).hostname;
  } catch {
    hostname = bookmark.url;
  }

  return (
    <>
      <Card className="flex flex-col transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-base leading-snug">
              {bookmark.title}
            </CardTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deleting ? 'Deleting…' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-2">
          {bookmark.description && (
            <CardDescription className="mb-2 line-clamp-2">
              {bookmark.description}
            </CardDescription>
          )}
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="max-w-[180px] truncate">{hostname}</span>
          </a>
        </CardContent>

        <CardFooter className="flex gap-2 pt-2">
          <Badge variant={PRIORITY_VARIANT[bookmark.priority]}>{bookmark.priority}</Badge>
          <Badge variant="outline">{STATUS_LABEL[bookmark.status]}</Badge>
        </CardFooter>
      </Card>

      <EditBookmarkDialog
        bookmark={bookmark}
        open={editOpen}
        onOpenChange={setEditOpen}
        onEdit={onEdit}
      />
    </>
  );
}
