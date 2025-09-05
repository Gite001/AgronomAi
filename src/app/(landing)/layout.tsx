
"use client";

import { Logo } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoginDialog from "@/components/auth/login-dialog";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  // While loading, or if the user is logged in (and about to be redirected),
  // you might want to show a loader or nothing to prevent flashing the landing page.
  if (loading || user) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
       <header className="px-4 lg:px-6 h-14 flex items-center bg-background/95 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="w-full max-w-7xl mx-auto flex items-center">
          <Link href="/accueil" className="flex items-center gap-2" prefetch={false}>
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">AgronomAi</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <LoginDialog>
                <Button variant="outline">Connexion / Inscription</Button>
            </LoginDialog>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="flex flex-col gap-4 py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
          <p className="text-xs text-muted-foreground">&copy; 2025 AgronomAi. Tous droits réservés. Développée par Abderrahim Bayoussef.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="tel:+212767241426" className="group flex items-center gap-1.5 transition-all">
                  <span className="text-foreground/80 group-hover:text-primary group-hover:underline underline-offset-4">+212 767 241 426</span>
              </a>
              <a href="mailto:bayoussef.lat@gmail.com" className="group flex items-center gap-1.5 transition-all">
                  <span className="text-foreground/80 group-hover:text-primary group-hover:underline underline-offset-4">bayoussef.lat@gmail.com</span>
              </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
