import { Bookmark, FileText, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: 'bookmark' | 'file' | 'sparkles';
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = 'bookmark',
  title,
  description,
  action,
}: EmptyStateProps) {
  const icons = {
    bookmark: Bookmark,
    file: FileText,
    sparkles: Sparkles,
  };

  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-6">
        <Icon className="h-12 w-12 text-indigo-400" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-white/60">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
