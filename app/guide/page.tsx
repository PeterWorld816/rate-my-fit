import type { Metadata } from "next";
import Link from "next/link";
import ProsePage from "@/components/ProsePage";
import { GUIDES } from "@/data/guides";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "연애 심리 가이드",
  description: "애착이론의 기초부터 안정형·불안형·회피형·혼란형의 차이, 불안-회피 커플의 갈등, 애착유형의 변화 가능성까지 쉽게 정리한 연애 심리 가이드.",
  path: "/guide",
});

export default function GuideIndexPage() {
  return (
    <ProsePage
      title="연애 심리 가이드"
      lead="테스트 결과를 더 깊이 이해하고 싶다면 읽어보세요. 애착이론의 기본 개념부터 연애에서 자주 부딪히는 패턴까지 정리했어요."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
        {GUIDES.map((g, i) => (
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
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "#a78bfa" }}>GUIDE {String(i + 1).padStart(2, "0")}</span>
            <span style={{ display: "block", fontSize: 17, fontWeight: 800, lineHeight: 1.4, margin: "4px 0 6px", wordBreak: "keep-all" }}>{g.title}</span>
            <span style={{ display: "block", fontSize: 13.5, lineHeight: 1.7, color: "rgba(24,24,27,0.62)", wordBreak: "keep-all" }}>{g.description}</span>
          </Link>
        ))}
      </div>
    </ProsePage>
  );
}
