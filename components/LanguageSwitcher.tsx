"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/data/attachment-types";

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export function isValidLang(value: string | null): value is Lang {
  return !!value && LANGUAGES.some((l) => l.code === value);
}

// Reads the site-wide language preference. Safe to call during render on the
// client; returns the "ko" default during SSR (no localStorage there).
export function getStoredLang(): Lang {
  if (typeof window === "undefined") return "ko";
  return isValidLang(localStorage.getItem("lang")) ? (localStorage.getItem("lang") as Lang) : "ko";
}

type Props = {
  lang: Lang;
  onChange: (lang: Lang) => void;
};

export default function LanguageSwitcher({ lang, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  const select = (l: Lang) => {
    localStorage.setItem("lang", l);
    onChange(l);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="tap-btn"
        style={{
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(255,255,255,0.8)",
          borderRadius: 999,
          color: "rgba(24,24,27,0.65)",
          padding: "7px 14px",
          fontSize: 13,
          cursor: "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {current.flag} {current.label} ▾
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            background: "#ffffff",
            border: "1px solid rgba(24,24,27,0.08)",
            borderRadius: 14,
            padding: 6,
            zIndex: 100,
            boxShadow: "0 12px 32px rgba(24,24,27,0.14)",
            minWidth: 150,
          }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => select(l.code)}
              className="tap-btn"
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: lang === l.code ? "rgba(124,58,237,0.1)" : "transparent",
                border: "none",
                borderRadius: 8,
                color: lang === l.code ? "#7c3aed" : "rgba(24,24,27,0.7)",
                padding: "9px 14px",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: lang === l.code ? 700 : 400,
                fontFamily: "inherit",
              }}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
