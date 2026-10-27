"use client";

import { useEffect } from "react";
import { useSiteLang } from "@/components/LanguageSwitcher";

// Keeps <html lang> in step with the language picked in the switcher. The
// root layout renders lang="ko"; this updates it after hydration.
export default function HtmlLangSync() {
  const lang = useSiteLang();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
