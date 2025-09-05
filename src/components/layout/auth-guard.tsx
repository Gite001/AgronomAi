
'use client';

import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect handles redirection for unauthenticated users.
    // Wait until the authentication state is resolved.
    if (loading) {
      return;
    }

    // If loading is done and there's no user, redirect to the landing page.
    if (!user) {
      // Exclude public paths from redirection logic to avoid loops
      if (pathname !== '/accueil') {
          router.push('/accueil');
      }
    }
  }, [user, loading, router, pathname]);

  // While checking auth state, show a loading indicator.
  // This prevents content flashing for a moment before redirection.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If there's a user, render the protected content.
  // If no user, this will be null while the redirection effect runs.
  return <>{children}</>;
}
