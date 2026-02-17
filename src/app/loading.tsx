'use client';

import { Loader } from '@/components/ui/loader';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" className="text-white" />
        <span className="animate-pulse text-sm font-medium text-white/50">
          Loading Bookmarkr...
        </span>
      </div>
    </div>
  );
}
