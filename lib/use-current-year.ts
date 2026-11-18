"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// The visitor's current year, or null on the server and during hydration.
// Statically prerendered pages would otherwise bake in the build year, and the
// client's `new Date().getFullYear()` would differ after New Year (or across
// time zones), causing a hydration text mismatch.
export function useCurrentYear(): number | null {
  return useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => null);
}

export function buildCopyright(year: number | null, brand: string) {
  return year === null ? `© ${brand}. All rights reserved.` : `© ${year} ${brand}. All rights reserved.`;
}
