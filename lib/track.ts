// GA4 event helper. No-op until gtag has loaded (or when GA is not configured).
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: "event" | "config" | "js" | "set", target: string | Date, params?: Record<string, unknown>) => void;
  }
}

export function track(name: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

// 1 when the current visitor arrived via a duo invite (see app/duo/page.tsx).
export function duoFlag(): number {
  try {
    return localStorage.getItem("duoPartner") ? 1 : 0;
  } catch {
    return 0;
  }
}
