
"use client";

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { AuthGuard } from '@/components/layout/auth-guard';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function AppContent({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/accueil');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }
  
    return (
        <>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <div className="flex items-center gap-4 md:hidden">
                        <SidebarTrigger />
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Logo className="h-6 w-6 text-primary" />
                            <span className="font-semibold text-lg">AgronomAi</span>
                        </Link>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <Header />
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-card/20 overflow-y-auto">
                    {children}
                </main>
            </SidebarInset>
        </>
    );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <AuthGuard>
        <AppContent>{children}</AppContent>
      </AuthGuard>
  );
}
