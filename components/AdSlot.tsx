"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/data/attachment-types";
import { useSiteLang } from "@/components/LanguageSwitcher";
import { ADSENSE_CLIENT } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const LABEL: Record<Lang, string> = {
  ko: "광고",
  en: "Advertisement",
  ja: "広告",
  zh: "广告",
  es: "Publicidad",
};

// Manual AdSense unit. Uses the loader already in app/layout.tsx <head>.
// The <ins> only renders after mount, so server HTML and the first client
// render match (an empty placeholder div) and AdSense never fills a node
// React is still hydrating. The wrapper's 28px vertical margin keeps the ad
// at least 24px away from neighbouring buttons (accidental-click policy).
export default function AdSlot({ slot }: { slot: string | undefined }) {
  const lang = useSiteLang();
  const [mounted, setMounted] = useState(false);
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Intentional one-time mount flag: <ins> must not exist until after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const ins = insRef.current;
    if (!mounted || !ins || pushed.current) return;
    if (ins.hasAttribute("data-adsbygoogle-status")) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blocked or loader unavailable — leave the slot empty.
    }
  }, [mounted]);

  if (!slot) return null;

  return (
    <div style={{ margin: "28px 0", minHeight: 120 }}>
      <p style={{ textAlign: "center", fontSize: 11, color: "rgba(24,24,27,0.45)", margin: "0 0 6px" }}>{LABEL[lang]}</p>
      {mounted ? (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div style={{ display: "block" }} />
      )}
    </div>
  );
}
