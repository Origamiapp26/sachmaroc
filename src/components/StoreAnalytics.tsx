"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/tracking";

export default function StoreAnalytics({
  facebookPixelId,
  googleAnalyticsId,
}: {
  facebookPixelId: string;
  googleAnalyticsId: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fbId = facebookPixelId.trim();
  const gaId = googleAnalyticsId.trim();

  useEffect(() => {
    if (!pathname || (!fbId && !gaId)) return;
    trackPageView();
  }, [pathname, searchParams, fbId, gaId]);

  if (!fbId && !gaId) return null;

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { send_page_view: false });
            `}
          </Script>
        </>
      )}

      {fbId && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbId}');
          `}
        </Script>
      )}
    </>
  );
}
