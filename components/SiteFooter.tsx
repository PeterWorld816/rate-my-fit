"use client";

import Link from "next/link";
import type { Lang } from "@/data/attachment-types";
import { useSiteLang } from "@/components/LanguageSwitcher";

// Site-wide footer rendered from the root layout, so the legal/info links are
// in the server HTML of every page (crawlers and AdSense review read those).
// Server render is always Korean; the client follows the language switcher.
const TEXT: Record<Lang, { nav: string; guide: string; about: string; privacy: string; terms: string; contact: string; tagline: string }> = {
  ko: { nav: "사이트 정보", guide: "연애 심리 가이드", about: "사이트 소개", privacy: "개인정보처리방침", terms: "이용약관", contact: "문의하기", tagline: "내 연애 유형 테스트 · 애착이론 기반 자기이해 콘텐츠" },
  en: { nav: "Site info", guide: "Relationship Guide", about: "About", privacy: "Privacy Policy", terms: "Terms of Use", contact: "Contact", tagline: "My Attachment Style Test · Self-reflection content based on attachment theory" },
  ja: { nav: "サイト情報", guide: "恋愛心理ガイド", about: "サイトについて", privacy: "プライバシーポリシー", terms: "利用規約", contact: "お問い合わせ", tagline: "恋愛タイプ診断 · 愛着理論にもとづく自己理解コンテンツ" },
  zh: { nav: "网站信息", guide: "恋爱心理指南", about: "关于本站", privacy: "隐私政策", terms: "使用条款", contact: "联系我们", tagline: "恋爱类型测试 · 基于依恋理论的自我了解内容" },
  es: { nav: "Información del sitio", guide: "Guía de relaciones", about: "Acerca de", privacy: "Política de privacidad", terms: "Términos de uso", contact: "Contacto", tagline: "Test de Estilo de Apego · Contenido de autoconocimiento basado en la teoría del apego" },
};

const LINKS = [
  { href: "/guide", key: "guide" },
  { href: "/about", key: "about" },
  { href: "/privacy", key: "privacy" },
  { href: "/terms", key: "terms" },
  { href: "/contact", key: "contact" },
] as const;

export default function SiteFooter() {
  const t = TEXT[useSiteLang()];
  return (
    <footer
      style={{
        background: "#f4f3f9",
        borderTop: "1px solid rgba(24,24,27,0.08)",
        padding: "20px 16px 28px",
        fontFamily: "var(--font-sans)",
      }}
    >
      <nav
        aria-label={t.nav}
        style={{
          maxWidth: 560,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 18px",
        }}
      >
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{ fontSize: 13, color: "rgba(24,24,27,0.7)", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            {t[l.key]}
          </Link>
        ))}
      </nav>
      <p style={{ textAlign: "center", fontSize: 11, color: "rgba(24,24,27,0.45)", margin: "12px 0 0" }}>
        {t.tagline}
      </p>
    </footer>
  );
}
