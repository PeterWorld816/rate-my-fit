import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ATTACHMENT_TYPES, AXIS_META, getAttachmentTypeByCode } from "@/data/attachment-types";

type Params = { code: string };

export function generateStaticParams() {
  return ATTACHMENT_TYPES.map((t) => ({ code: t.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { code } = await params;
  const type = getAttachmentTypeByCode(decodeURIComponent(code));
  if (!type) return { title: "유형을 찾을 수 없어요" };

  const { name, catchphrase } = type.ko;
  const title = `${type.code} · ${name}`;
  const description = `${catchphrase} — 애착이론 기반 연애 유형 테스트에서 ${name}(${type.code}) 유형에 대해 알아보세요.`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TypeDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { code } = await params;
  const type = getAttachmentTypeByCode(decodeURIComponent(code));
  if (!type) notFound();

  const { ko: content } = type;
  const primary = AXIS_META[type.primaryAxis];
  const secondary = type.secondaryAxis ? AXIS_META[type.secondaryAxis] : primary;
  const gradient = `linear-gradient(135deg, ${primary.colorFrom}, ${secondary.colorTo})`;
  const bestMatch = getAttachmentTypeByCode(content.bestMatch.code);
  const worstMatch = getAttachmentTypeByCode(content.worstMatch.code);

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "var(--font-sans)" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px 64px" }}>
        <Link
          href="/"
          className="tap-btn"
          style={{
            display: "inline-block", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999, color: "rgba(255,255,255,0.7)", padding: "7px 16px", fontSize: 13, textDecoration: "none", marginBottom: 24,
          }}
        >
          ← 홈
        </Link>

        {/* ══ 히어로: 포트레이트 + 코드 뱃지 + 마스코트 + 이름 ══ */}
        <div className="scale-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
          <div
            style={{
              position: "relative", width: 108, height: 108, borderRadius: 28, overflow: "hidden",
              border: `2px solid ${primary.colorFrom}88`, boxShadow: `0 12px 32px ${primary.colorFrom}44`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/characters/${type.imageFile}`}
              alt=""
              style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", height: "156%", width: "auto", maxWidth: "none" }}
            />
          </div>
          <div
            style={{
              display: "inline-block", background: gradient, borderRadius: 20, padding: "10px 28px",
              fontSize: 28, fontWeight: 900, letterSpacing: "1px", boxShadow: `0 12px 40px ${primary.colorFrom}55`,
              transform: "rotate(-2deg)",
            }}
          >
            {type.code}
          </div>
          <div style={{ fontSize: 44 }}>
            {primary.emoji}{type.secondaryAxis ? secondary.emoji : ""}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, lineHeight: 1.25, letterSpacing: "-0.8px" }}>
            {content.name}
          </h1>
          <p style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: 0, fontStyle: "italic" }}>
            &quot;{content.catchphrase}&quot;
          </p>
        </div>

        {/* ══ 강점/약점 ══ */}
        <div className="fade-up" style={{ animationDelay: "0.1s", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "32px 0 0" }}>
          <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 16, padding: "16px 14px" }}>
            <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#5eead4", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>💪 강점</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {content.strengths.map((s) => (
                <li key={s} style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.85)" }}>• {s}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.25)", borderRadius: 16, padding: "16px 14px" }}>
            <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#fb7185", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>⚠️ 약점</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {content.weaknesses.map((w) => (
                <li key={w} style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.85)" }}>• {w}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ══ 궁합 ══ */}
        <div className="fade-up" style={{ animationDelay: "0.15s", display: "flex", flexDirection: "column", gap: 10, margin: "16px 0 0" }}>
          {bestMatch && (
            <Link
              href={`/types/${bestMatch.code}`}
              className="tap-btn"
              style={{ display: "block", textDecoration: "none", color: "#fff", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 16, padding: "14px 16px" }}
            >
              <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#34d399", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>💚 찰떡궁합 · {bestMatch.code} {bestMatch.ko.name}</p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", margin: 0 }}>{content.bestMatch.reason}</p>
            </Link>
          )}
          {worstMatch && (
            <Link
              href={`/types/${worstMatch.code}`}
              className="tap-btn"
              style={{ display: "block", textDecoration: "none", color: "#fff", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 16, padding: "14px 16px" }}
            >
              <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#f87171", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>💥 상극 · {worstMatch.code} {worstMatch.ko.name}</p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", margin: 0 }}>{content.worstMatch.reason}</p>
            </Link>
          )}
        </div>

        {/* ══ 닮은 캐릭터 ══ */}
        {content.similarFigures.length > 0 && (
          <div className="fade-up" style={{ animationDelay: "0.2s", margin: "16px 0 0", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 16, padding: "16px 16px" }}>
            <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "rgba(251,191,36,0.8)", textTransform: "uppercase", fontWeight: 700, margin: "0 0 12px" }}>🎬 이런 캐릭터랑 비슷해요</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {content.similarFigures.map((f) => (
                <div key={f.name}>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 2px", color: "#fff" }}>{f.name}</p>
                  <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/quiz"
          className="tap-btn fade-up"
          style={{
            display: "block", textAlign: "center", marginTop: 28, animationDelay: "0.25s",
            background: "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none", borderRadius: 999, color: "#fff",
            fontSize: 16, fontWeight: 800, padding: "16px", textDecoration: "none", boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
          }}
        >
          나는 어떤 유형일까? 테스트하러 가기 ✨
        </Link>

        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: "16px 0 0", letterSpacing: "1px" }}>
          내 연애 유형 테스트 · 애착이론 기반
        </p>
      </div>
    </main>
  );
}
