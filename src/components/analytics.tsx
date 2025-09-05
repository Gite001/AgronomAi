
"use client"

import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function pageview(url: string, gaId?: string) {
    const effectiveGaId = gaId || process.env.NEXT_PUBLIC_GA_ID;
    if (!effectiveGaId || typeof window.gtag !== 'function') {
        return;
    }
    window.gtag("config", effectiveGaId, {
        page_path: url,
    })
}

export function Analytics({ gaId }: { gaId?: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const effectiveGaId = gaId || process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!effectiveGaId || effectiveGaId === 'YOUR_GOOGLE_ANALYTICS_ID') {
      return;
    }
    const url = `${pathname}?${searchParams.toString()}`;
    pageview(url, effectiveGaId);
  }, [pathname, searchParams, effectiveGaId]);


  if (!effectiveGaId || effectiveGaId === 'YOUR_GOOGLE_ANALYTICS_ID') {
    console.warn("Google Analytics ID (NEXT_PUBLIC_GA_ID) is not set. Tracking is disabled.");
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${effectiveGaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${effectiveGaId}', {
                page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
