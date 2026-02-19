import { Bookmark } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Bookmark className="h-8 w-8 animate-pulse" />
      <div className="flex gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-foreground delay-0 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-foreground [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-foreground [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export function InlineLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="flex gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
      </div>
    </div>
  );
}
