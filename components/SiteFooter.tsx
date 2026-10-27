import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

// Site-wide footer rendered from the root layout, so the legal/info links are
// in the server HTML of every page (crawlers and AdSense review read those).
const LINKS = [
  { href: "/guide", label: "연애 심리 가이드" },
  { href: "/about", label: "사이트 소개" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/contact", label: "문의하기" },
];

export default function SiteFooter() {
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
        aria-label="사이트 정보"
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
            {l.label}
          </Link>
        ))}
      </nav>
      <p style={{ textAlign: "center", fontSize: 11, color: "rgba(24,24,27,0.45)", margin: "12px 0 0" }}>
        {SITE_NAME} · 애착이론 기반 자기이해 콘텐츠
      </p>
    </footer>
  );
}
