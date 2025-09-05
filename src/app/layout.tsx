
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { JournalProvider } from '@/context/journal-context';
import { ActionPlanProvider } from '@/context/action-plan-context';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Suspense, useEffect, useState } from 'react';
import { Analytics } from '@/components/analytics';
import { AuthProvider } from '@/context/auth-context';
import Script from 'next/script';

// Metadata is now defined as a static object as we can't export it from a "use client" component.
// You can move this to a metadata export if you convert layout back to a Server Component.
// export const metadata: Metadata = {
//   title: 'AgronomAi',
//   description: "Une application web intelligente pour les professionnels de l'agriculture.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <title>AgronomAi</title>
        <meta name="description" content="Une application web intelligente pour les professionnels de l'agriculture." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {process.env.NEXT_PUBLIC_COOKIEBOT_CBID && process.env.NEXT_PUBLIC_COOKIEBOT_CBID !== 'YOUR_COOKIEBOT_ID' && (
            <Script
                id="cookiebot"
                src={`https://consent.cookiebot.com/uc.js?cbid=${process.env.NEXT_PUBLIC_COOKIEBOT_CBID}`}
                strategy="afterInteractive"
            />
        )}
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <AuthProvider>
          <SidebarProvider>
            <JournalProvider>
              <ActionPlanProvider>
                  {children}
                  {isMounted && <Toaster />}
              </ActionPlanProvider>
            </JournalProvider>
          </SidebarProvider>
        </AuthProvider>
        
        <Suspense>
          <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        </Suspense>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID !== 'YOUR_ADSENSE_CLIENT_ID' && (
            <Script
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />
        )}
      </body>
    </html>
  );
}
