"use client";

import { load, trackPageview } from 'fathom-client';
import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_FATHOM_ID) {
      load(process.env.NEXT_PUBLIC_FATHOM_ID, {
        auto: false
      });
    }
  }, []);

  useEffect(() => {
    if (!pathname) return;

    try {
      const search = searchParams ? searchParams.toString() : '';
      const url = search ? `${pathname}?${search}` : pathname;
      
      trackPageview({
        url: url,
        referrer: document.referrer
      });
    } catch (error) {
      // Silently ignore tracking errors
    }
  }, [pathname, searchParams]);

  return null;
}

export function FathomAnalytics() {
  return (
    <Suspense fallback={null}>
      <TrackPageView />
    </Suspense>
  );
}