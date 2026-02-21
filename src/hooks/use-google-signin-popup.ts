'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { AUTH_SUCCESS_MESSAGE } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

export function useGoogleSignInPopup() {
  const router = useRouter();

  const signInWithPopup = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/dashboard')}`,
      },
    });

    if (error) {
      throw error;
    }

    if (data?.url) {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        data.url,
        'oauth-popup',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`,
      );

      return new Promise<void>((resolve, reject) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          if (event.data?.type === AUTH_SUCCESS_MESSAGE) {
            window.removeEventListener('message', handleMessage);
            if (popup && !popup.closed) popup.close();
            router.push(event.data.next ?? '/dashboard');
            resolve();
          }
        };

        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', handleMessage);
            reject(new Error('Popup closed'));
          }
        }, 500);

        window.addEventListener('message', handleMessage);
      });
    }
  }, [router]);

  return { signInWithPopup };
}
