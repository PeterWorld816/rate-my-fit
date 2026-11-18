"use client";

import Script from "next/script";

// Google Analytics 4. Renders nothing unless NEXT_PUBLIC_GA_ID is set.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      {/* Plain inline <script> (not next/script afterInteractive) so window.gtag exists
          in the server HTML before hydration — otherwise events fired from mount
          effects (quiz_start, duo_open) on a direct landing are dropped. Calls queue
          in dataLayer until gtag.js below loads. */}
      <script
        id="ga-init"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(GA_ID)});`,
        }}
      />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}
