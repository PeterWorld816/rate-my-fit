"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CHARACTERS } from "@/data/characters";

type Lang = "ko" | "en";

const STICKER_ROTATIONS = [-3, 2, -1.5, 2.5, -2, 1.5, -2.5, 1];
const rot = (i: number) => STICKER_ROTATIONS[i % STICKER_ROTATIONS.length];

const TEXT = {
  ko: {
    label: "🎬 K-Drama 역할 테스트",
    titleLine1: "내 드라마",
    titleLine2: "역할은?",
    sub: "질문 8개로 당신의 K-Drama 캐릭터를 찾아드립니다\n답하고, 역할 받고, 공유해봐",
    startBtn: "지금 시작하기 ✨",
    lastResultBtn: "마지막 결과 보기",
    steps: [
      { icon: "📝", num: "01", title: "질문 답하기", desc: "8개 질문에 답해줘" },
      { icon: "🎭", num: "02", title: "역할 매칭", desc: "네 성향으로 역할을 찾아" },
      { icon: "📤", num: "03", title: "공유", desc: "친구들한테 공유해봐" },
    ],
    rolesLabel: "20가지 역할 중 당신은?",
    footer: "K-Drama 역할 테스트 · 8문항 테스트 · 공유하고 싶어지는 결과",
    startBtnBottom: "무료로 시작하기 ✨",
  },
  en: {
    label: "🎬 K-Drama Role Test",
    titleLine1: "What's Your",
    titleLine2: "K-Drama Role?",
    sub: "Answer 8 questions. Get your role. Share the drama.\nFind out which K-Drama character you are.",
    startBtn: "Find My Role ✨",
    lastResultBtn: "View Last Result",
    steps: [
      { icon: "📝", num: "01", title: "Answer", desc: "8 quick questions" },
      { icon: "🎭", num: "02", title: "Get Matched", desc: "Your K-Drama role revealed" },
      { icon: "📤", num: "03", title: "Share", desc: "Share with your friends" },
    ],
    rolesLabel: "20 roles — which one are you?",
    footer: "K-Drama Role Test · 8-question quiz · Share-worthy results",
    startBtnBottom: "Start For Free ✨",
  },
};

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("ko");
  const t = TEXT[lang];
  const roles = CHARACTERS.map((c) => c[lang].name);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved) setLang(saved);
  }, []);

  const switchLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  const goQuiz = () => { localStorage.removeItem("ratingResult"); router.push("/quiz"); };

  return (
    <main style={styles.root}>
      <div style={{ ...styles.glow, top: -120, left: -80, background: "rgba(124,58,237,0.2)" }} />
      <div style={{ ...styles.glow, bottom: -100, right: -60, background: "rgba(236,72,153,0.16)" }} />

      <div style={styles.container}>
        {/* lang toggle top right */}
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <div style={styles.langToggle}>
            <button className="tap-btn" style={{ ...styles.langBtn, ...(lang === "ko" ? styles.langBtnActive : {}) }} onClick={() => switchLang("ko")}>한국어</button>
            <button className="tap-btn" style={{ ...styles.langBtn, ...(lang === "en" ? styles.langBtnActive : {}) }} onClick={() => switchLang("en")}>EN</button>
          </div>
        </div>

        {/* label */}
        <div style={styles.labelPill}>{t.label}</div>

        {/* title */}
        <h1 style={styles.title}>
          {t.titleLine1}<br />
          <span style={styles.titleGradient}>{t.titleLine2}</span>
        </h1>

        <p style={styles.sub}>
          {t.sub.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}
        </p>

        {/* CTA */}
        <div style={styles.btnRow}>
          <button className="tap-btn" style={styles.primaryBtn} onClick={goQuiz}>{t.startBtn}</button>
          <button className="tap-btn" style={styles.ghostBtn} onClick={() => router.push("/rate")}>{t.lastResultBtn}</button>
        </div>

        {/* steps */}
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

        {/* roles */}
        <div style={styles.rolesSection}>
          <p style={styles.rolesLabel}>{t.rolesLabel}</p>
          <div style={styles.rolesPillRow}>
            {roles.map((r, i) => <span key={r} style={{ ...styles.rolePill, display: "inline-block", transform: `rotate(${rot(i)}deg)` }}>{r}</span>)}
          </div>
        </div>

        {/* bottom CTA */}
        <button className="tap-btn" style={{ ...styles.primaryBtn, width: "100%", maxWidth: 360, fontSize: 17, padding: "16px 0" }} onClick={goQuiz}>
          {t.startBtnBottom}
        </button>

        <p style={styles.footer}>{t.footer}</p>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "#08080f", color: "#fff", fontFamily: "var(--font-sans)", padding: "60px 16px 80px", position: "relative", overflowX: "hidden" },
  glow: { position: "absolute", width: 500, height: 500, borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none", zIndex: 0 },
  container: { position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 28, textAlign: "center" },
  langToggle: { display: "flex", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: 3, gap: 2 },
  langBtn: { background: "transparent", border: "none", borderRadius: 999, color: "rgba(255,255,255,0.4)", padding: "6px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" },
  langBtnActive: { background: "rgba(124,58,237,0.5)", color: "#fff" },
  labelPill: { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 999, color: "#a78bfa", fontSize: 12, letterSpacing: "1.5px", padding: "6px 18px", textTransform: "uppercase" },
  title: { fontSize: 52, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2.5px", margin: 0 },
  titleGradient: { background: "linear-gradient(135deg, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  sub: { fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, margin: 0 },
  btnRow: { display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" },
  primaryBtn: { background: "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none", borderRadius: 999, color: "#fff", fontSize: 15, fontWeight: 600, padding: "14px 32px", cursor: "pointer", fontFamily: "inherit" },
  ghostBtn: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, color: "rgba(255,255,255,0.6)", fontSize: 15, fontWeight: 500, padding: "14px 28px", cursor: "pointer", fontFamily: "inherit" },
  stepsGrid: { width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  stepCard: { background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  stepNum: { fontSize: 10, letterSpacing: "2px", color: "rgba(167,139,250,0.5)", fontWeight: 600 },
  stepIcon: { fontSize: 28 },
  stepTitle: { fontSize: 14, fontWeight: 600, margin: 0, color: "#fff" },
  stepDesc: { fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: 1.5 },
  rolesSection: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "24px 20px" },
  rolesLabel: { fontSize: 11, letterSpacing: "2px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", margin: 0 },
  rolesPillRow: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  rolePill: { fontSize: 12, padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.03)" },
  footer: { fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "1px", margin: 0 },
};