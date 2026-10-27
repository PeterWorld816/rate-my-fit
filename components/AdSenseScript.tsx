"use client";

import Script from "next/script";
import { ADSENSE_CLIENT } from "@/lib/site";

// AdSense loader — one per page, Auto ads only (no <ins> slots). A client
// component so the URL isn't duplicated into the server-component payload;
// the server HTML carries a single preload for it and the browser injects the
// one <script> after hydration.
export default function AdSenseScript() {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
