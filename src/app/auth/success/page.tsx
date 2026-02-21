'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { AUTH_SUCCESS_MESSAGE } from '@/lib/constants';

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get('next') ?? '/dashboard';

  useEffect(() => {
    // If opened in a popup (has opener), notify parent and close
    if (typeof window !== 'undefined' && window.opener) {
      window.opener.postMessage(
        { type: AUTH_SUCCESS_MESSAGE, next },
        window.location.origin,
      );
      window.close();
      return;
    }

    // Normal redirect flow (e.g. user opened login in same tab)
    router.replace(next);
  }, [next, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}
