"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { AXIS_META, getAttachmentTypeByCode, type Lang } from "@/data/attachment-types";
import type { AttachmentResult } from "@/app/quiz/page";

const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

const UI: Record<Lang, {
  home: string;
  noResult: string;
  startQuiz: string;
  badge: string;
  strengthsLabel: string;
  weaknessesLabel: string;
  bestMatchLabel: string;
  worstMatchLabel: string;
  similarLabel: string;
  pureLabel: (axisLabel: string) => string;
  seeDetail: string;
  shareCardLabel: string;
  saveImage: string;
  saving: string;
  mobileHint: string;
  share: string;
  copied: string;
  shareTwitterAria: string;
  retry: string;
  footer: string;
}> = {
  ko: {
    home: "← 홈",
    noResult: "결과가 없어요. 테스트를 먼저 해줘!",
    startQuiz: "테스트 시작하기",
    badge: "💕 내 연애 유형 테스트",
    strengthsLabel: "💪 강점",
    weaknessesLabel: "⚠️ 약점",
    bestMatchLabel: "💚 찰떡궁합",
    worstMatchLabel: "💥 상극",
    similarLabel: "🎬 이런 캐릭터랑 비슷해요",
    pureLabel: (a) => `순수 ${a}`,
    seeDetail: "내 유형 상세 페이지 보기 →",
    shareCardLabel: "공유용 카드",
    saveImage: "이미지 저장하기 💾",
    saving: "저장 중...",
    mobileHint: "📱 모바일에서는 이미지를 길게 눌러 저장하세요",
    share: "공유하기 📤",
    copied: "복사됨! ✓",
    shareTwitterAria: "X(트위터)에 공유",
    retry: "다시 하기",
    footer: "내 연애 유형 테스트 · 애착이론 기반",
  },
  en: {
    home: "← Home",
    noResult: "No result yet. Take the test first!",
    startQuiz: "Start the Test",
    badge: "💕 My Attachment Style Test",
    strengthsLabel: "💪 Strengths",
    weaknessesLabel: "⚠️ Weaknesses",
    bestMatchLabel: "💚 Best Match",
    worstMatchLabel: "💥 Worst Match",
    similarLabel: "🎬 You're Similar To",
    pureLabel: (a) => `Pure ${a}`,
    seeDetail: "See My Full Type Page →",
    shareCardLabel: "Share Card",
    saveImage: "Save Image 💾",
    saving: "Saving...",
    mobileHint: "📱 On mobile, long-press the image to save it",
    share: "Share 📤",
    copied: "Copied! ✓",
    shareTwitterAria: "Share on X (Twitter)",
    retry: "Retake Test",
    footer: "My Attachment Style Test · Based on attachment theory",
  },
  ja: {
    home: "← ホーム",
    noResult: "結果がありません。先にテストを受けてね！",
    startQuiz: "テストを始める",
    badge: "💕 恋愛タイプ診断",
    strengthsLabel: "💪 強み",
    weaknessesLabel: "⚠️ 弱み",
    bestMatchLabel: "💚 相性抜群",
    worstMatchLabel: "💥 相性最悪",
    similarLabel: "🎬 似ているキャラ",
    pureLabel: (a) => `完全${a}`,
    seeDetail: "詳細ページを見る →",
    shareCardLabel: "シェアカード",
    saveImage: "画像を保存 💾",
    saving: "保存中...",
    mobileHint: "📱 モバイルでは画像を長押しして保存してください",
    share: "共有する 📤",
    copied: "コピーしました！✓",
    shareTwitterAria: "X(旧Twitter)で共有",
    retry: "もう一度",
    footer: "恋愛タイプ診断 · 愛着理論に基づく",
  },
  zh: {
    home: "← 主页",
    noResult: "还没有结果，先去做测试吧！",
    startQuiz: "开始测试",
    badge: "💕 恋爱类型测试",
    strengthsLabel: "💪 优点",
    weaknessesLabel: "⚠️ 缺点",
    bestMatchLabel: "💚 绝配",
    worstMatchLabel: "💥 相克",
    similarLabel: "🎬 与你相似的角色",
    pureLabel: (a) => `纯${a}`,
    seeDetail: "查看完整类型页面 →",
    shareCardLabel: "分享卡片",
    saveImage: "保存图片 💾",
    saving: "保存中...",
    mobileHint: "📱 在手机上长按图片即可保存",
    share: "分享 📤",
    copied: "已复制！✓",
    shareTwitterAria: "分享到 X(推特)",
    retry: "重新测试",
    footer: "恋爱类型测试 · 基于依恋理论",
  },
  es: {
    home: "← Inicio",
    noResult: "Aún no hay resultado. ¡Haz el test primero!",
    startQuiz: "Empezar el Test",
    badge: "💕 Test de Estilo de Apego",
    strengthsLabel: "💪 Fortalezas",
    weaknessesLabel: "⚠️ Debilidades",
    bestMatchLabel: "💚 Mejor Match",
    worstMatchLabel: "💥 Peor Match",
    similarLabel: "🎬 Te Pareces A",
    pureLabel: (a) => `${a} Puro`,
    seeDetail: "Ver Mi Página De Tipo Completa →",
    shareCardLabel: "Tarjeta para Compartir",
    saveImage: "Guardar Imagen 💾",
    saving: "Guardando...",
    mobileHint: "📱 En móvil, mantén presionada la imagen para guardarla",
    share: "Compartir 📤",
    copied: "¡Copiado! ✓",
    shareTwitterAria: "Compartir en X (Twitter)",
    retry: "Repetir Test",
    footer: "Test de Estilo de Apego · Basado en teoría del apego",
  },
};

function buildShareText(lang: Lang, code: string, name: string) {
  switch (lang) {
    case "ko": return `나 ${code}형 ${name} 나옴ㅋㅋ 너는?`;
    case "ja": return `私は${code}型 ${name}になった！あなたは？`;
    case "zh": return `我是${code}型 ${name}！你呢？`;
    case "es": return `¡Salí ${name} (${code})! ¿Y tú?`;
    default: return `I got ${name} (${code})! What about you?`;
  }
}

const CONFETTI_COLORS = ["#7c3aed", "#ec4899", "#fbbf24", "#c4b5fd"];

function fireResultConfetti() {
  confetti({ particleCount: 80, spread: 70, startVelocity: 45, origin: { y: 0.35 }, colors: CONFETTI_COLORS, zIndex: 999 });
  setTimeout(() => {
    confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.45 }, colors: CONFETTI_COLORS, zIndex: 999 });
    confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.45 }, colors: CONFETTI_COLORS, zIndex: 999 });
  }, 150);
}

export default function RatePage() {
  const router = useRouter();
  const [result, setResult] = useState<AttachmentResult | null>(null);
  const [lang, setLang] = useState<Lang>("ko");
  const [dropOpen, setDropOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Lang | null;
    if (savedLang && LANGUAGES.find((l) => l.code === savedLang)) setLang(savedLang);

    const saved = localStorage.getItem("attachmentResult");
    if (saved) {
      try {
        setResult(JSON.parse(saved));
        setTimeout(() => {
          setLoaded(true);
          fireResultConfetti();
        }, 100);
      } catch {
        localStorage.removeItem("attachmentResult");
      }
    }

    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLang = (l: Lang) => { setLang(l); localStorage.setItem("lang", l); setDropOpen(false); };

  const ui = UI[lang];
  const type = result ? getAttachmentTypeByCode(result.code) : undefined;

  if (!result || !type) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>
        <div style={{ textAlign: "center", color: "#fff", padding: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>💕</div>
          <p style={{ fontSize: 18, opacity: 0.6, marginBottom: 24 }}>{ui.noResult}</p>
          <button onClick={() => router.push("/quiz")} className="tap-btn" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none", borderRadius: 999, color: "#fff", fontSize: 15, fontWeight: 700, padding: "14px 32px", cursor: "pointer" }}>
            {ui.startQuiz}
          </button>
        </div>
      </main>
    );
  }

  const content = type[lang];
  const primary = AXIS_META[type.primaryAxis];
  const secondary = type.secondaryAxis ? AXIS_META[type.secondaryAxis] : primary;
  const gradient = `linear-gradient(135deg, ${primary.colorFrom}, ${secondary.colorTo})`;
  const bestMatch = getAttachmentTypeByCode(content.bestMatch.code);
  const worstMatch = getAttachmentTypeByCode(content.worstMatch.code);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/types/${type.code}` : "";
  const shareTextBase = buildShareText(lang, type.code, content.name);
  const fullShareText = shareUrl ? `${shareTextBase}\n${shareUrl}` : shareTextBase;

  const secondaryQuery = type.secondaryAxis && result.secondaryPercent !== null ? `&secondary=${result.secondaryPercent}` : "";
  const shareCardUrl = `/api/share-card/${type.code}?primary=${result.primaryPercent}${secondaryQuery}&lang=${lang}`;

  const handleShare = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadImage = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await fetch(shareCardUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `attachment-type-${type.code}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(shareCardUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  const handleTwitterShare = () => {
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTextBase)}${shareUrl ? `&url=${encodeURIComponent(shareUrl)}` : ""}`;
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "var(--font-sans)", color: "#fff" }}>

      {/* ── 상단 네비 ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,15,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => router.push("/")} className="tap-btn" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, color: "rgba(255,255,255,0.7)", padding: "7px 16px", fontSize: 13, cursor: "pointer" }}>
            {ui.home}
          </button>
          <div style={{ position: "relative" }} ref={dropRef}>
            <button onClick={() => setDropOpen((p) => !p)} className="tap-btn" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, color: "rgba(255,255,255,0.7)", padding: "7px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              {LANGUAGES.find((l) => l.code === lang)?.flag} {LANGUAGES.find((l) => l.code === lang)?.label} ▾
            </button>
            {dropOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 6, zIndex: 100, boxShadow: "0 12px 40px rgba(0,0,0,0.6)", minWidth: 150 }}>
                {LANGUAGES.map((l) => (
                  <button key={l.code} onClick={() => switchLang(l.code)} className="tap-btn" style={{ display: "block", width: "100%", background: lang === l.code ? "rgba(167,139,250,0.15)" : "transparent", border: "none", borderRadius: 8, color: lang === l.code ? "#a78bfa" : "rgba(255,255,255,0.7)", padding: "9px 14px", fontSize: 13, cursor: "pointer", textAlign: "left", fontWeight: lang === l.code ? 700 : 400 }}>
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 메인 컨텐츠 ── */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 20px 24px" }}>

        {/* ══ HERO: 코드 뱃지 + 마스코트 + 이름 ══ */}
        <div className={loaded ? "scale-in" : ""} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(124,58,237,0.3)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#c4b5fd" }}>
            {ui.badge}
          </div>
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
          <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, lineHeight: 1.2, letterSpacing: "-0.8px" }}>
            {content.name}
          </h1>
          <p style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: 0, fontStyle: "italic" }}>
            &quot;{content.catchphrase}&quot;
          </p>
        </div>

        {/* ══ 퍼센트 바 / 순수형 강조 ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.1s", margin: "24px 0 0" }}>
          {type.secondaryAxis && result.secondaryPercent !== null ? (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px" }}>
              <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,0.06)" }}>
                <div style={{ width: loaded ? `${result.primaryPercent}%` : 0, background: primary.colorFrom, transition: "width 1s cubic-bezier(0.4,0,0.2,1) 0.2s" }} />
                <div style={{ width: loaded ? `${result.secondaryPercent}%` : 0, background: secondary.colorTo, transition: "width 1s cubic-bezier(0.4,0,0.2,1) 0.3s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12.5 }}>
                <span style={{ color: primary.colorFrom, fontWeight: 700 }}>{primary.label[lang]} {result.primaryPercent}%</span>
                <span style={{ color: secondary.colorTo, fontWeight: 700 }}>{secondary.label[lang]} {result.secondaryPercent}%</span>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", background: `linear-gradient(135deg, ${primary.colorFrom}22, ${primary.colorTo}22)`, border: `1px solid ${primary.colorFrom}55`, borderRadius: 16, padding: "18px" }}>
              <p style={{ fontSize: 18, fontWeight: 900, margin: 0, color: "#fff" }}>{ui.pureLabel(primary.label[lang])}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "6px 0 0" }}>{result.primaryPercent}%</p>
            </div>
          )}
        </div>

        {/* ══ 강점/약점 ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.15s", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0 0" }}>
          <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 16, padding: "16px 14px" }}>
            <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#5eead4", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>{ui.strengthsLabel}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {content.strengths.map((s) => (
                <li key={s} style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.85)" }}>• {s}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.25)", borderRadius: 16, padding: "16px 14px" }}>
            <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#fb7185", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>{ui.weaknessesLabel}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {content.weaknesses.map((w) => (
                <li key={w} style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.85)" }}>• {w}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ══ 궁합 ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.2s", display: "flex", flexDirection: "column", gap: 10, margin: "16px 0 0" }}>
          {bestMatch && (
            <Link href={`/types/${bestMatch.code}`} className="tap-btn" style={{ display: "block", textDecoration: "none", color: "#fff", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 16, padding: "14px 16px" }}>
              <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#34d399", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>{ui.bestMatchLabel} · {bestMatch.code} {bestMatch[lang].name}</p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", margin: 0 }}>{content.bestMatch.reason}</p>
            </Link>
          )}
          {worstMatch && (
            <Link href={`/types/${worstMatch.code}`} className="tap-btn" style={{ display: "block", textDecoration: "none", color: "#fff", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 16, padding: "14px 16px" }}>
              <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#f87171", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>{ui.worstMatchLabel} · {worstMatch.code} {worstMatch[lang].name}</p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", margin: 0 }}>{content.worstMatch.reason}</p>
            </Link>
          )}
        </div>

        {/* ══ 닮은 캐릭터 ══ */}
        {content.similarFigures.length > 0 && (
          <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.25s", margin: "16px 0 0", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 16, padding: "16px 16px" }}>
            <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "rgba(251,191,36,0.8)", textTransform: "uppercase", fontWeight: 700, margin: "0 0 12px" }}>{ui.similarLabel}</p>
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

        {/* ══ 유형 상세 페이지 링크 ══ */}
        <Link
          href={`/types/${type.code}`}
          className="tap-btn fade-up"
          style={{ display: "block", animationDelay: "0.3s", textAlign: "center", marginTop: 16, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 600, padding: "14px", textDecoration: "none" }}
        >
          {ui.seeDetail}
        </Link>

        {/* ══ 공유용 세로 카드 ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.3s", margin: "20px 0 0" }}>
          <p style={{ fontSize: 10, letterSpacing: "2px", color: "rgba(196,181,253,0.7)", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>
            🖼️ {ui.shareCardLabel}
          </p>
          <div style={{ position: "relative", width: "100%", aspectRatio: "9/16", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", background: "#0a0a0f" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shareCardUrl}
              alt={content.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="tap-btn"
            style={{
              display: "block", width: "100%", textAlign: "center", marginTop: 12,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999,
              color: "#fff", fontSize: 15, fontWeight: 700, padding: "14px",
              cursor: downloading ? "default" : "pointer", opacity: downloading ? 0.6 : 1,
            }}
          >
            {downloading ? ui.saving : ui.saveImage}
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "10px 0 0" }}>
            {ui.mobileHint}
          </p>
        </div>

        {/* ══ 공유 섹션 ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.35s", margin: "20px 0 0" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.85)", margin: 0, fontWeight: 500, whiteSpace: "pre-line" }}>
              {fullShareText}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleShare} className="tap-btn" style={{ flex: 1, background: "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none", borderRadius: 999, color: "#fff", fontSize: 16, fontWeight: 800, padding: "16px", cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,0.4)", letterSpacing: "-0.3px" }}>
              {copied ? ui.copied : ui.share}
            </button>
            <button onClick={handleTwitterShare} aria-label={ui.shareTwitterAria} className="tap-btn"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, color: "rgba(255,255,255,0.8)", fontSize: 18, fontWeight: 700, padding: "16px 20px", cursor: "pointer" }}>
              𝕏
            </button>
            <button onClick={() => { localStorage.removeItem("attachmentResult"); router.push("/quiz"); }} className="tap-btn"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600, padding: "16px 20px", cursor: "pointer" }}>
              {ui.retry}
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: "16px 0 0", letterSpacing: "1px" }}>
            {ui.footer}
          </p>
        </div>

      </div>
    </main>
  );
}
