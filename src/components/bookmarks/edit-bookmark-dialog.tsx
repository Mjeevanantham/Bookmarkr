'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Bookmark, UpdateBookmarkPayload } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  url: z.string().url('Must be a valid URL'),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['saved', 'reading', 'completed']),
});

type FormValues = z.infer<typeof schema>;

interface EditBookmarkDialogProps {
  bookmark: Bookmark;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (id: string, payload: UpdateBookmarkPayload) => Promise<void>;
}

export function EditBookmarkDialog({
  bookmark,
  open,
  onOpenChange,
  onEdit,
}: EditBookmarkDialogProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description ?? '',
      priority: bookmark.priority,
      status: bookmark.status,
    },
  });

  // Reset form when bookmark changes
  useEffect(() => {
    reset({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description ?? '',
      priority: bookmark.priority,
      status: bookmark.status,
    });
  }, [bookmark, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      setSaving(true);
      setError(null);
      await onEdit(bookmark.id, {
        title: values.title,
        url: values.url,
        description: values.description || undefined,
        priority: values.priority,
        status: values.status,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bookmark');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
          <DialogDescription>Update your bookmark details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" {...register('title')} />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-url">URL</Label>
            <Input id="edit-url" type="url" {...register('url')} />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-desc">Description (optional)</Label>
            <Textarea id="edit-desc" rows={2} {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                defaultValue={bookmark.priority}
                onValueChange={(v) => setValue('priority', v as FormValues['priority'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                defaultValue={bookmark.status}
                onValueChange={(v) => setValue('status', v as FormValues['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saved">Saved</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
