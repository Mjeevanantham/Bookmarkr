'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_SUCCESS_MESSAGE = 'BOOKMARKR_AUTH_SUCCESS';

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get('next') ?? '/dashboard';

  useEffect(() => {
    // If opened in a popup (has opener), notify parent and close
    if (typeof window !== 'undefined' && window.opener) {
      window.opener.postMessage({ type: AUTH_SUCCESS_MESSAGE, next }, window.location.origin);
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

export { AUTH_SUCCESS_MESSAGE };
