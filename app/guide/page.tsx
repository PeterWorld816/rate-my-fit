import type { Metadata } from "next";
import Link from "next/link";
import ProsePage from "@/components/ProsePage";
import { GUIDE_CATEGORIES, getGuidesByCategory } from "@/data/guides";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "연애 심리 가이드",
  description: "애착이론 기초, 유형별 연애 패턴, 연락·다툼·화해 같은 연애 소통, 이별 뒤 회복과 안정감 키우기까지 카테고리별로 정리한 연애 심리 가이드.",
  path: "/guide",
});

export default function GuideIndexPage() {
  return (
    <ProsePage
      title="연애 심리 가이드"
      lead="테스트 결과를 더 깊이 이해하고 싶다면 읽어보세요. 애착이론의 기본 개념부터 연애에서 자주 부딪히는 패턴까지 카테고리별로 정리했어요."
    >
      <nav aria-label="가이드 카테고리" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
        {GUIDE_CATEGORIES.map((c) => (
          <a
            key={c.key}
            href={`#${c.key}`}
            style={{
              fontSize: 13, fontWeight: 700, color: "#7c3aed", textDecoration: "none", background: "rgba(124,58,237,0.08)",
              borderRadius: 999, padding: "6px 12px",
            }}
          >
            {c.label}
          </a>
        ))}
      </nav>

      {GUIDE_CATEGORIES.map((c) => (
        <section key={c.key} id={c.key} style={{ scrollMarginTop: 16 }}>
          <h2>{c.label}</h2>
          <p>{c.description}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {getGuidesByCategory(c.key).map((g) => (
              <Link
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="tap-btn"
                style={{
                  display: "block", textDecoration: "none", color: "inherit", background: "#fff",
                  border: "1px solid rgba(24,24,27,0.08)", borderRadius: 16, padding: "16px 18px",
                  boxShadow: "0 4px 16px rgba(24,24,27,0.05)",
                }}
              >
                <span style={{ display: "block", fontSize: 17, fontWeight: 800, lineHeight: 1.4, margin: "0 0 6px", wordBreak: "keep-all" }}>{g.title}</span>
                <span style={{ display: "block", fontSize: 13.5, lineHeight: 1.7, color: "rgba(24,24,27,0.62)", wordBreak: "keep-all" }}>{g.description}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </ProsePage>
  );
}
