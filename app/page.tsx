"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ATTACHMENT_TYPES, AXIS_META, NEUTRAL_THEME, type Lang } from "@/data/attachment-types";
import LanguageSwitcher, { getStoredLang } from "@/components/LanguageSwitcher";

const STICKER_ROTATIONS = [-3, 2, -1.5, 2.5, -2, 1.5, -2.5, 1];
const rot = (i: number) => STICKER_ROTATIONS[i % STICKER_ROTATIONS.length];

const TEXT: Record<Lang, {
  trustBadge: string;
  titleLine1: string;
  titleLine2: string;
  sub: string;
  startBtn: string;
  lastResultBtn: string;
  steps: { icon: string; num: string; title: string; desc: string }[];
  typesLabel: string;
  footer: string;
  startBtnBottom: string;
}> = {
  ko: {
    trustBadge: "🧠 애착이론 기반 심리 테스트",
    titleLine1: "나 이거였어?",
    titleLine2: "내 진짜 연애 심리",
    sub: "질문 20개로 알아보는 나의 애착유형\n16가지 유형 중 나는 어떤 사람일까?",
    startBtn: "테스트 시작하기 ✨",
    lastResultBtn: "마지막 결과 보기",
    steps: [
      { icon: "📝", num: "01", title: "질문 답하기", desc: "20개 질문에 답해줘" },
      { icon: "💕", num: "02", title: "유형 매칭", desc: "16가지 애착유형 중 매칭" },
      { icon: "📤", num: "03", title: "공유", desc: "친구들한테 공유해봐" },
    ],
    typesLabel: "16가지 유형 중 당신은?",
    footer: "내 연애 유형 테스트 · 20문항 · 애착이론 기반",
    startBtnBottom: "무료로 시작하기 ✨",
  },
  en: {
    trustBadge: "🧠 Based On Attachment Theory",
    titleLine1: "Wait, this is me?",
    titleLine2: "My real love psychology",
    sub: "20 questions to find your attachment style\nWhich of the 16 types are you?",
    startBtn: "Start the Test ✨",
    lastResultBtn: "View Last Result",
    steps: [
      { icon: "📝", num: "01", title: "Answer", desc: "20 quick questions" },
      { icon: "💕", num: "02", title: "Get Matched", desc: "One of 16 attachment types" },
      { icon: "📤", num: "03", title: "Share", desc: "Share with your friends" },
    ],
    typesLabel: "16 types — which one are you?",
    footer: "My Attachment Style Test · 20 questions · Based on attachment theory",
    startBtnBottom: "Start For Free ✨",
  },
  ja: {
    trustBadge: "🧠 愛着理論に基づく心理テスト",
    titleLine1: "私ってこれだったの?",
    titleLine2: "私の本当の恋愛心理",
    sub: "20の質問でわかる愛着スタイル\n16タイプの中であなたはどれ?",
    startBtn: "テストを始める ✨",
    lastResultBtn: "前回の結果を見る",
    steps: [
      { icon: "📝", num: "01", title: "質問に回答", desc: "20の質問に答えてね" },
      { icon: "💕", num: "02", title: "タイプ診断", desc: "16の愛着タイプから診断" },
      { icon: "📤", num: "03", title: "シェア", desc: "友達にシェアしよう" },
    ],
    typesLabel: "16タイプの中であなたは?",
    footer: "恋愛タイプ診断 · 20問 · 愛着理論に基づく",
    startBtnBottom: "無料で始める ✨",
  },
  zh: {
    trustBadge: "🧠 基于依恋理论的心理测试",
    titleLine1: "原来我是这样的人?",
    titleLine2: "我的真实恋爱心理",
    sub: "20道题测出你的依恋类型\n16种类型中你是哪一种?",
    startBtn: "开始测试 ✨",
    lastResultBtn: "查看上次结果",
    steps: [
      { icon: "📝", num: "01", title: "回答问题", desc: "回答20道题目" },
      { icon: "💕", num: "02", title: "类型匹配", desc: "匹配16种依恋类型" },
      { icon: "📤", num: "03", title: "分享", desc: "分享给朋友们" },
    ],
    typesLabel: "16种类型中你是哪一种?",
    footer: "恋爱类型测试 · 20题 · 基于依恋理论",
    startBtnBottom: "免费开始 ✨",
  },
  es: {
    trustBadge: "🧠 Basado En La Teoría Del Apego",
    titleLine1: "¿Espera, soy yo?",
    titleLine2: "Mi verdadera psicología amorosa",
    sub: "20 preguntas para descubrir tu estilo de apego\n¿Cuál de los 16 tipos eres?",
    startBtn: "Empezar el Test ✨",
    lastResultBtn: "Ver Último Resultado",
    steps: [
      { icon: "📝", num: "01", title: "Responder", desc: "20 preguntas rápidas" },
      { icon: "💕", num: "02", title: "Emparejar", desc: "Uno de 16 tipos de apego" },
      { icon: "📤", num: "03", title: "Compartir", desc: "Comparte con tus amigos" },
    ],
    typesLabel: "16 tipos — ¿cuál eres?",
    footer: "Test de Estilo de Apego · 20 preguntas · Basado en teoría del apego",
    startBtnBottom: "Empezar Gratis ✨",
  },
};

// Small, collapsed-by-default trust/legal section under the main footer line
// — same content as the matching sections in app/rate/page.tsx and
// app/types/[code]/TypeDetailContent.tsx: brand + copyright, methodology
// source, a disclaimer (liability + trust), and a tone-lowering "it's just
// for fun" line.
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

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("ko");
  const t = TEXT[lang];
  const trust = FOOTER_TRUST[lang];

  useEffect(() => {
    setLang(getStoredLang());
  }, []);

  const goQuiz = () => {
    localStorage.removeItem("attachmentResult");
    router.push("/quiz");
  };

  return (
    <main style={styles.root}>
      <div style={{ ...styles.glow, top: -120, left: -80, background: "rgba(167,139,250,0.35)" }} />
      <div style={{ ...styles.glow, bottom: -100, right: -60, background: "rgba(244,114,182,0.3)" }} />

      <div style={styles.container}>
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </div>

        <div style={styles.labelPill}>{t.trustBadge}</div>

        <h1 style={styles.title}>
          {t.titleLine1}<br />
          <span style={styles.titleGradient}>{t.titleLine2}</span>
        </h1>

        <p style={styles.sub}>
          {t.sub.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}
        </p>

        <div style={styles.btnRow}>
          <button className="tap-btn" style={styles.primaryBtn} onClick={goQuiz}>{t.startBtn}</button>
          <button className="tap-btn" style={styles.ghostBtn} onClick={() => router.push("/rate")}>{t.lastResultBtn}</button>
        </div>

        <div style={styles.stepsGrid}>
          {t.steps.map(({ icon, num, title, desc }, i) => (
            <div key={num} style={{ ...styles.stepCard, transform: `rotate(${rot(i)}deg)` }}>
              <div style={styles.stepNum}>{num}</div>
              <div style={styles.stepIcon}>{icon}</div>
              <p style={styles.stepTitle}>{title}</p>
              <p style={styles.stepDesc}>{desc}</p>
            </div>
          ))}
        </div>

        {/* ══ 16 types preview grid ══ */}
        <div style={styles.typesSection}>
          <p style={styles.typesLabel}>{t.typesLabel}</p>
          <div style={styles.typesGrid}>
            {ATTACHMENT_TYPES.map((type, i) => {
              const primary = AXIS_META[type.primaryAxis];
              const secondary = type.secondaryAxis ? AXIS_META[type.secondaryAxis] : primary;
              const content = type[lang];
              return (
                <Link
                  key={type.code}
                  href={`/types/${type.code}`}
                  className="tap-btn"
                  style={{
                    ...styles.typeCard,
                    background: `linear-gradient(135deg, ${primary.bgFrom}, ${secondary.bgTo})`,
                    border: `1px solid ${primary.colorFrom}66`,
                    boxShadow: `0 4px 14px ${primary.colorFrom}26`,
                  }}
                >
                  <span
                    style={{
                      ...styles.typeBadge,
                      background: `linear-gradient(135deg, ${primary.colorFrom}, ${secondary.colorTo})`,
                      transform: `rotate(${rot(i)}deg)`,
                    }}
                  >
                    {type.code}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/characters/${type.code.replace("+", "")}.png`}
                    alt=""
                    style={styles.typeThumb}
                  />
                  <span style={styles.typeName}>{content.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <button className="tap-btn" style={{ ...styles.primaryBtn, width: "100%", maxWidth: 360, fontSize: 17, padding: "16px 0" }} onClick={goQuiz}>
          {t.startBtnBottom}
        </button>

        {/* ══ 푸터 — 기존 한 줄 + 신뢰도/고지 섹션(기본 접힘). container의 gap: 28이
            자식마다 붙기 때문에 하나의 래퍼로 묶어서 내부 간격만 촘촘하게 유지 ══ */}
        <div style={styles.footerBlock}>
          <p style={styles.footer}>{t.footer}</p>

          <details style={{ textAlign: "center" }}>
            <summary style={styles.footerToggle}>{trust.toggle}</summary>
            <div style={styles.footerTrustBody}>
              <p style={styles.footerTrustText}>{trust.methodology}</p>
              <p style={styles.footerTrustText}>{trust.disclaimer}</p>
              <p style={styles.footerTrustText}>{trust.casual}</p>
            </div>
          </details>

          <p style={styles.footerCopyright}>{buildCopyright(new Date().getFullYear(), trust.brand)}</p>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: `linear-gradient(180deg, ${NEUTRAL_THEME.bgFrom} 0%, ${NEUTRAL_THEME.bgTo} 100%)`, color: NEUTRAL_THEME.text, fontFamily: "var(--font-sans)", padding: "60px 16px 80px", position: "relative", overflowX: "hidden" },
  glow: { position: "absolute", width: 500, height: 500, borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none", zIndex: 0, opacity: 0.5 },
  container: { position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 28, textAlign: "center" },
  labelPill: { background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 999, color: "#7c3aed", fontSize: 12, letterSpacing: "1.5px", padding: "6px 18px", textTransform: "uppercase" },
  title: { fontSize: 44, fontWeight: 900, lineHeight: 1.15, letterSpacing: "-2px", margin: 0 },
  titleGradient: { background: "linear-gradient(135deg, #7c3aed, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  sub: { fontSize: 15, color: NEUTRAL_THEME.textMuted, lineHeight: 1.8, margin: 0 },
  btnRow: { display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" },
  primaryBtn: { background: "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none", borderRadius: 999, color: "#fff", fontSize: 15, fontWeight: 600, padding: "14px 32px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(124,58,237,0.28)" },
  ghostBtn: { background: NEUTRAL_THEME.cardBg, border: `1px solid ${NEUTRAL_THEME.cardBorder}`, borderRadius: 999, color: NEUTRAL_THEME.text, fontSize: 15, fontWeight: 500, padding: "14px 28px", cursor: "pointer", fontFamily: "inherit" },
  stepsGrid: { width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  stepCard: { background: NEUTRAL_THEME.cardBg, border: `1px solid ${NEUTRAL_THEME.cardBorder}`, borderRadius: 20, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, boxShadow: "0 4px 16px rgba(24,24,27,0.05)" },
  stepNum: { fontSize: 10, letterSpacing: "2px", color: "#a78bfa", fontWeight: 700 },
  stepIcon: { fontSize: 28 },
  stepTitle: { fontSize: 14, fontWeight: 600, margin: 0, color: NEUTRAL_THEME.text },
  stepDesc: { fontSize: 12, color: NEUTRAL_THEME.textFaint, margin: 0, lineHeight: 1.5 },
  typesSection: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, background: NEUTRAL_THEME.cardBg, border: `1px solid ${NEUTRAL_THEME.cardBorder}`, borderRadius: 20, padding: "24px 16px", boxShadow: "0 4px 16px rgba(24,24,27,0.05)" },
  typesLabel: { fontSize: 11, letterSpacing: "2px", color: NEUTRAL_THEME.textFaint, textTransform: "uppercase", margin: 0 },
  typesGrid: { width: "100%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 },
  typeCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, borderRadius: 16, padding: "10px 4px 12px", textDecoration: "none", color: NEUTRAL_THEME.text },
  typeBadge: { fontSize: 11, fontWeight: 900, color: "#fff", borderRadius: 999, padding: "2px 9px", boxShadow: "0 4px 12px rgba(24,24,27,0.18)" },
  typeThumb: { width: 64, height: 64, objectFit: "contain" },
  typeName: { fontSize: 10.5, fontWeight: 600, lineHeight: 1.3, color: NEUTRAL_THEME.text },
  footer: { fontSize: 11, color: NEUTRAL_THEME.textFaint, letterSpacing: "1px", margin: 0 },
  footerBlock: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  footerToggle: { cursor: "pointer", fontSize: 11, color: NEUTRAL_THEME.textFaint, letterSpacing: "0.3px" },
  footerTrustBody: { marginTop: 10, display: "flex", flexDirection: "column", gap: 6, padding: "0 6px", maxWidth: 420 },
  footerTrustText: { fontSize: 11, lineHeight: 1.6, color: NEUTRAL_THEME.textFaint, margin: 0 },
  footerCopyright: { fontSize: 10, color: NEUTRAL_THEME.textFaint, margin: 0, opacity: 0.75 },
};
