"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AXIS_META, getAttachmentTypeByCode, type AttachmentType, type Lang } from "@/data/attachment-types";
import LanguageSwitcher, { getStoredLang } from "@/components/LanguageSwitcher";

// Frosted-glass *look* without the frosted-glass cost — see the matching
// comment in app/rate/page.tsx. These cards used to carry
// backdrop-filter: blur(10px) each; a higher-opacity flat background gets a
// near-identical look without forcing a GPU backdrop recompute per scroll frame.
const CARD = {
  bg: "rgba(255,255,255,0.78)",
  border: "rgba(255,255,255,0.75)",
  shadow: "0 8px 24px rgba(24,24,27,0.08)",
};
const TEXT_DARK = "#18181b";
const TEXT_MUTED = "rgba(24,24,27,0.65)";
const TEXT_FAINT = "rgba(24,24,27,0.45)";

const UI: Record<Lang, {
  home: string;
  strengthsLabel: string;
  weaknessesLabel: string;
  bestMatchLabel: string;
  worstMatchLabel: string;
  similarLabel: string;
  takeTestCta: string;
  footer: string;
}> = {
  ko: {
    home: "← 홈",
    strengthsLabel: "💪 강점",
    weaknessesLabel: "⚠️ 약점",
    bestMatchLabel: "💚 찰떡궁합",
    worstMatchLabel: "💥 상극",
    similarLabel: "🎬 이런 캐릭터랑 비슷해요",
    takeTestCta: "나는 어떤 유형일까? 테스트하러 가기 ✨",
    footer: "내 연애 유형 테스트 · 애착이론 기반",
  },
  en: {
    home: "← Home",
    strengthsLabel: "💪 Strengths",
    weaknessesLabel: "⚠️ Weaknesses",
    bestMatchLabel: "💚 Best Match",
    worstMatchLabel: "💥 Worst Match",
    similarLabel: "🎬 You're Similar To",
    takeTestCta: "What's my type? Take the test ✨",
    footer: "My Attachment Style Test · Based on attachment theory",
  },
  ja: {
    home: "← ホーム",
    strengthsLabel: "💪 強み",
    weaknessesLabel: "⚠️ 弱み",
    bestMatchLabel: "💚 相性抜群",
    worstMatchLabel: "💥 相性最悪",
    similarLabel: "🎬 似ているキャラ",
    takeTestCta: "私はどのタイプ？テストを受けに行く ✨",
    footer: "恋愛タイプ診断 · 愛着理論に基づく",
  },
  zh: {
    home: "← 主页",
    strengthsLabel: "💪 优点",
    weaknessesLabel: "⚠️ 缺点",
    bestMatchLabel: "💚 绝配",
    worstMatchLabel: "💥 相克",
    similarLabel: "🎬 与你相似的角色",
    takeTestCta: "我是什么类型？去测试一下 ✨",
    footer: "恋爱类型测试 · 基于依恋理论",
  },
  es: {
    home: "← Inicio",
    strengthsLabel: "💪 Fortalezas",
    weaknessesLabel: "⚠️ Debilidades",
    bestMatchLabel: "💚 Mejor Match",
    worstMatchLabel: "💥 Peor Match",
    similarLabel: "🎬 Te Pareces A",
    takeTestCta: "¿Cuál es mi tipo? Hacer el test ✨",
    footer: "Test de Estilo de Apego · Basado en teoría del apego",
  },
};

// Small, collapsed-by-default trust/legal section under the main footer line
// — brand + copyright, methodology source, a disclaimer (liability + trust),
// and a tone-lowering "it's just for fun" line. Same content as the matching
// section in app/rate/page.tsx, kept out of the main visual flow (native
// <details>, closed by default).
const FOOTER_TRUST: Record<Lang, {
  brand: string;
  toggle: string;
  methodology: string;
  disclaimer: string;
  casual: string;
}> = {
  ko: {
    brand: "내 연애 유형 테스트",
    toggle: "테스트 안내 및 유의사항 보기",
    methodology: "이 테스트는 성인 애착 이론(Adult Attachment Theory)과 ECR(Experiences in Close Relationships) 척도를 참고해 만든 20문항 자가진단 콘텐츠예요.",
    disclaimer: "전문적인 심리 진단이 아니라 자기 이해를 돕기 위한 참고용 콘텐츠입니다. 마음이 힘들 땐 꼭 전문가와 상담해주세요.",
    casual: "가볍게 즐기는 콘텐츠니까 결과에 너무 몰입하지 마세요 😊",
  },
  en: {
    brand: "My Attachment Style Test",
    toggle: "About this test & disclaimer",
    methodology: "This is a 20-question self-assessment inspired by Adult Attachment Theory and the ECR (Experiences in Close Relationships) scale.",
    disclaimer: "This isn't a professional psychological diagnosis — just some content to help you reflect on yourself. If you're struggling, please talk to a licensed professional.",
    casual: "It's just for fun, so don't take the result too seriously 😊",
  },
  ja: {
    brand: "恋愛タイプ診断",
    toggle: "テストについて・注意事項",
    methodology: "このテストは成人愛着理論(Adult Attachment Theory)とECR(Experiences in Close Relationships)尺度を参考に作った20問の自己診断コンテンツです。",
    disclaimer: "専門的な心理診断ではなく、自己理解の参考のためのコンテンツです。つらいときは専門家に相談してくださいね。",
    casual: "気軽に楽しむコンテンツなので、結果にあまりのめり込まないでくださいね😊",
  },
  zh: {
    brand: "恋爱类型测试",
    toggle: "关于本测试及注意事项",
    methodology: "本测试参考成人依恋理论(Adult Attachment Theory)与ECR(亲密关系经历量表)编写，是一份20题的自我评估内容。",
    disclaimer: "这不是专业的心理诊断，只是帮助你了解自己的参考内容。如果心里不好受，请一定要咨询专业人士。",
    casual: "这只是用来轻松娱乐的内容，别把结果看得太重哦😊",
  },
  es: {
    brand: "Test de Estilo de Apego",
    toggle: "Sobre este test y aviso legal",
    methodology: "Este es un autodiagnóstico de 20 preguntas inspirado en la Teoría del Apego Adulto y la escala ECR (Experiences in Close Relationships).",
    disclaimer: "Esto no es un diagnóstico psicológico profesional, solo contenido para ayudarte a reflexionar sobre ti mismo/a. Si lo estás pasando mal, consulta a un profesional con licencia.",
    casual: "Es solo contenido para pasar un buen rato, ¡no te tomes el resultado tan en serio! 😊",
  },
};

function buildCopyright(year: number, brand: string) {
  return `© ${year} ${brand}. All rights reserved.`;
}

export default function TypeDetailContent({ type }: { type: AttachmentType }) {
  const [lang, setLang] = useState<Lang>("ko");

  useEffect(() => {
    setLang(getStoredLang());
  }, []);

  const ui = UI[lang];
  const trust = FOOTER_TRUST[lang];
  const content = type[lang];
  const primary = AXIS_META[type.primaryAxis];
  const secondary = type.secondaryAxis ? AXIS_META[type.secondaryAxis] : primary;
  const gradient = `linear-gradient(135deg, ${primary.colorFrom}, ${secondary.colorTo})`;
  const pageBg = `linear-gradient(180deg, ${primary.bgFrom} 0%, ${secondary.bgTo} 100%)`;
  const bestMatch = getAttachmentTypeByCode(content.bestMatch.code);
  const worstMatch = getAttachmentTypeByCode(content.worstMatch.code);

  return (
    <main style={{ minHeight: "100vh", background: pageBg, color: TEXT_DARK, fontFamily: "var(--font-sans)" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px 64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Link
            href="/"
            className="tap-btn"
            style={{
              display: "inline-block", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.8)",
              borderRadius: 999, color: TEXT_MUTED, padding: "7px 16px", fontSize: 13, textDecoration: "none",
            }}
          >
            {ui.home}
          </Link>
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </div>

        {/* ══ 히어로: 포트레이트 + 코드 뱃지 + 마스코트 + 이름 ══ */}
        <div className="scale-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
          <div
            style={{
              width: 270, height: 270, maxWidth: "68vw", maxHeight: "68vw", borderRadius: 40, background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.7)", boxShadow: `0 16px 40px ${primary.colorFrom}44`,
              display: "flex", alignItems: "center", justifyContent: "center", padding: 14,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/characters/${type.code.replace("+", "")}.png`}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div
            style={{
              display: "inline-block", background: gradient, borderRadius: 20, padding: "10px 28px",
              fontSize: 28, fontWeight: 900, letterSpacing: "1px", color: "#fff", boxShadow: `0 12px 32px ${primary.colorFrom}66`,
              transform: "rotate(-2deg)",
            }}
          >
            {type.code}
          </div>
          <div style={{ fontSize: 44 }}>
            {primary.emoji}{type.secondaryAxis ? secondary.emoji : ""}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, lineHeight: 1.25, letterSpacing: "-0.8px", color: TEXT_DARK }}>
            {content.name}
          </h1>
          <p style={{ fontSize: 16, fontWeight: 600, color: TEXT_MUTED, margin: 0, fontStyle: "italic" }}>
            &quot;{content.catchphrase}&quot;
          </p>
        </div>

        {/* ══ 강점/약점 ══ */}
        <div className="fade-up" style={{ animationDelay: "0.1s", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "32px 0 0" }}>
          <div style={{ background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "16px 14px", boxShadow: CARD.shadow }}>
            <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#0f766e", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>{ui.strengthsLabel}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {content.strengths.map((s) => (
                <li key={s} style={{ fontSize: 13, lineHeight: 1.5, color: TEXT_DARK }}>• {s}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "16px 14px", boxShadow: CARD.shadow }}>
            <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#be123c", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>{ui.weaknessesLabel}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {content.weaknesses.map((w) => (
                <li key={w} style={{ fontSize: 13, lineHeight: 1.5, color: TEXT_DARK }}>• {w}</li>
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
              style={{ display: "block", textDecoration: "none", color: TEXT_DARK, background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "14px 16px", boxShadow: CARD.shadow }}
            >
              <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#0f766e", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>{ui.bestMatchLabel} · {bestMatch.code} {bestMatch[lang].name}</p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: TEXT_MUTED, margin: 0 }}>{content.bestMatch.reason}</p>
            </Link>
          )}
          {worstMatch && (
            <Link
              href={`/types/${worstMatch.code}`}
              className="tap-btn"
              style={{ display: "block", textDecoration: "none", color: TEXT_DARK, background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "14px 16px", boxShadow: CARD.shadow }}
            >
              <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#be123c", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>{ui.worstMatchLabel} · {worstMatch.code} {worstMatch[lang].name}</p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: TEXT_MUTED, margin: 0 }}>{content.worstMatch.reason}</p>
            </Link>
          )}
        </div>

        {/* ══ 닮은 캐릭터 ══ */}
        {content.similarFigures.length > 0 && (
          <div className="fade-up" style={{ animationDelay: "0.2s", margin: "16px 0 0", background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "16px 16px", boxShadow: CARD.shadow }}>
            <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#b45309", textTransform: "uppercase", fontWeight: 700, margin: "0 0 12px" }}>{ui.similarLabel}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {content.similarFigures.map((f) => (
                <div key={f.name}>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 2px", color: TEXT_DARK }}>{f.name}</p>
                  <p style={{ fontSize: 12.5, color: TEXT_MUTED, margin: 0, lineHeight: 1.5 }}>{f.description}</p>
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
            background: gradient, border: "none", borderRadius: 999, color: "#fff",
            fontSize: 16, fontWeight: 800, padding: "16px", textDecoration: "none", boxShadow: `0 8px 32px ${primary.colorFrom}55`,
          }}
        >
          {ui.takeTestCta}
        </Link>

        <p style={{ textAlign: "center", fontSize: 11, color: TEXT_FAINT, margin: "16px 0 0", letterSpacing: "1px" }}>
          {ui.footer}
        </p>

        {/* ══ 신뢰도/고지 섹션 — 기본 접힘, 작은 글씨로 메인 콘텐츠보다 튀지 않게 ══ */}
        <details style={{ marginTop: 14, textAlign: "center" }}>
          <summary style={{ cursor: "pointer", fontSize: 11, color: TEXT_FAINT, letterSpacing: "0.3px" }}>
            {trust.toggle}
          </summary>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6, padding: "0 6px" }}>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: TEXT_FAINT, margin: 0 }}>{trust.methodology}</p>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: TEXT_FAINT, margin: 0 }}>{trust.disclaimer}</p>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: TEXT_FAINT, margin: 0 }}>{trust.casual}</p>
          </div>
        </details>

        <p style={{ textAlign: "center", fontSize: 10, color: TEXT_FAINT, margin: "10px 0 0", opacity: 0.75 }}>
          {buildCopyright(new Date().getFullYear(), trust.brand)}
        </p>
      </div>
    </main>
  );
}
