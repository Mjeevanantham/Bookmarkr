'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
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
  DialogTrigger,
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
import type { CreateBookmarkPayload } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  url: z.string().url('Must be a valid URL'),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['saved', 'reading', 'completed']),
});

type FormValues = z.output<typeof schema>;

interface AddBookmarkDialogProps {
  onAdd: (payload: CreateBookmarkPayload) => Promise<void>;
}

export function AddBookmarkDialog({ onAdd }: AddBookmarkDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: 'medium',
      status: 'saved',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setSaving(true);
      setError(null);
      await onAdd({
        title: values.title,
        url: values.url,
        description: values.description || undefined,
        priority: values.priority,
        status: values.status,
      });
      reset();
      setOpen(false);
      setShowMore(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bookmark');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Bookmark
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bookmark</DialogTitle>
          <DialogDescription>Save a new URL to your collection.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* URL - Primary Input */}
          <div className="space-y-1.5">
            <Label htmlFor="bm-url">URL</Label>
            <Input
              id="bm-url"
              placeholder="https://..."
              type="url"
              autoFocus
              {...register('url')}
            />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="bm-title">Title</Label>
            <Input
              id="bm-title"
              placeholder="e.g. Next.js Documentation"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* More Options Toggle */}
          <div className="pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowMore(!showMore)}
              className="flex w-full items-center justify-between px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              <span className="text-xs font-semibold uppercase tracking-wider">
                More Options
              </span>
              {showMore ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {showMore && (
            <div className="space-y-4 duration-200 animate-in fade-in slide-in-from-top-2">
              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="bm-desc">Description</Label>
                <Textarea
                  id="bm-desc"
                  placeholder="Short note about this link..."
                  rows={2}
                  {...register('description')}
                />
              </div>

              {/* Priority + Status row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select
                    defaultValue="medium"
                    onValueChange={(v) =>
                      setValue('priority', v as FormValues['priority'])
                    }
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
                    defaultValue="saved"
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
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Bookmark'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
