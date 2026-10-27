import Link from "next/link";
import { NEUTRAL_THEME } from "@/data/attachment-types";

// Shared shell for the plain-text pages (about/privacy/contact/guide): neutral
// theme, readable line length, a back link. Server component.
export default function ProsePage({
  title,
  lead,
  backHref = "/",
  backLabel = "← 홈",
  children,
}: {
  title: string;
  lead?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        flex: 1,
        background: `linear-gradient(180deg, ${NEUTRAL_THEME.bgFrom} 0%, ${NEUTRAL_THEME.bgTo} 100%)`,
        color: NEUTRAL_THEME.text,
        fontFamily: "var(--font-sans)",
      }}
    >
      <article className="prose-page" style={{ maxWidth: 680, margin: "0 auto", padding: "32px 16px 56px" }}>
        <Link
          href={backHref}
          style={{
            display: "inline-block", background: "#fff", border: `1px solid ${NEUTRAL_THEME.cardBorder}`,
            borderRadius: 999, color: NEUTRAL_THEME.textMuted, padding: "7px 16px", fontSize: 13, textDecoration: "none",
          }}
        >
          {backLabel}
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.3, letterSpacing: "-0.8px", margin: "24px 0 12px", wordBreak: "keep-all" }}>
          {title}
        </h1>
        {lead && <p style={{ fontSize: 15, lineHeight: 1.8, color: NEUTRAL_THEME.textMuted, margin: "0 0 8px" }}>{lead}</p>}
        {children}
      </article>
    </main>
  );
}
