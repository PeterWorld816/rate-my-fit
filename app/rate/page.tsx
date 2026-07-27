"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { toBlob } from "html-to-image";
import { AXIS_META, NEUTRAL_THEME, getAttachmentTypeByCode, type Lang } from "@/data/attachment-types";
import type { AttachmentResult } from "@/app/quiz/page";
import LanguageSwitcher, { getStoredLang } from "@/components/LanguageSwitcher";

// Frosted-glass card tokens shared across the result screen — sits on top of
// the per-type vivid gradient background rather than a flat dark/light bg.
const CARD = {
  bg: "rgba(255,255,255,0.6)",
  border: "rgba(255,255,255,0.7)",
  shadow: "0 8px 24px rgba(24,24,27,0.08)",
};
const TEXT_DARK = "#18181b";
const TEXT_MUTED = "rgba(24,24,27,0.65)";
const TEXT_FAINT = "rgba(24,24,27,0.45)";

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
  scarcity: (percent: number) => string;
  seeDetail: string;
  saveImage: string;
  saving: string;
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
    scarcity: (p) => `🔥 전체 응답자 중 단 ${p}%만 이 유형이에요`,
    seeDetail: "내 유형 상세 페이지 보기 →",
    saveImage: "이미지로 저장 💾",
    saving: "저장 중...",
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
    scarcity: (p) => `🔥 Only ${p}% of people get this type`,
    seeDetail: "See My Full Type Page →",
    saveImage: "Save as Image 💾",
    saving: "Saving...",
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
    scarcity: (p) => `🔥 回答者の中でこのタイプはたった${p}%`,
    seeDetail: "詳細ページを見る →",
    saveImage: "画像として保存 💾",
    saving: "保存中...",
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
    scarcity: (p) => `🔥 全部答题者中只有${p}%是这个类型`,
    seeDetail: "查看完整类型页面 →",
    saveImage: "保存为图片 💾",
    saving: "保存中...",
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
    scarcity: (p) => `🔥 Solo el ${p}% de la gente obtiene este tipo`,
    seeDetail: "Ver Mi Página De Tipo Completa →",
    saveImage: "Guardar como Imagen 💾",
    saving: "Guardando...",
    share: "Compartir 📤",
    copied: "¡Copiado! ✓",
    shareTwitterAria: "Compartir en X (Twitter)",
    retry: "Repetir Test",
    footer: "Test de Estilo de Apego · Basado en teoría del apego",
  },
};

const HIDDEN_UI: Record<Lang, { badge: string; title: string; desc: string; share: string }> = {
  ko: {
    badge: "🔍 미분류 유형",
    title: "아직 데이터가 부족한 사람",
    desc: "당신의 마음은 어느 한 유형으로 딱 잘라 말하기엔 너무 복잡해요. 16개 유형 그 어디에도 완전히 속하지 않는, 17번째 히든 케이스일지도?",
    share: "나 결과가 히든 유형으로 떴어... 너도 해볼래?",
  },
  en: {
    badge: "🔍 Unclassified",
    title: "Not Enough Data On You Yet",
    desc: "Your heart is too complex to fit neatly into one type. Maybe you're the hidden 17th type — the one none of the 16 could fully capture?",
    share: "I got a hidden result... you gotta try this",
  },
  ja: {
    badge: "🔍 未分類タイプ",
    title: "まだデータが足りない人",
    desc: "あなたの心は一つのタイプにきっぱり分けるには複雑すぎるみたい。16個のどれにも完全には当てはまらない、17番目の隠れタイプかも?",
    share: "私、隠れタイプの結果が出た…あなたもやってみる?",
  },
  zh: {
    badge: "🔍 未分类",
    title: "还没有足够数据的人",
    desc: "你的心太复杂了，没法干脆地归入某一种类型。也许你是那16种之外的第17种隐藏类型？",
    share: "我测出了隐藏结果…你也来试试？",
  },
  es: {
    badge: "🔍 Sin Clasificar",
    title: "Aún No Hay Suficientes Datos Sobre Ti",
    desc: "Tu corazón es demasiado complejo para encajar limpiamente en un solo tipo. Tal vez eres el tipo oculto número 17 — el que ninguno de los 16 pudo capturar del todo.",
    share: "Me salió un resultado oculto... deberías probarlo tú también",
  },
};

// TODO: replace with a real "% of respondents who got this type" stat once
// we have actual quiz-result analytics. For now this is a deterministic
// (same code always shows the same number, no flicker on re-render)
// plausible-looking placeholder — pure types skew higher, hybrids lower,
// purely for narrative "rare type" framing, not real data.
function generateScarcityPercent(code: string): number {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = (hash * 31 + code.charCodeAt(i)) >>> 0;
  const isPure = !code.includes("+");
  const [min, max] = isPure ? [8, 15] : [3, 9];
  return min + (hash % (max - min + 1));
}

function buildShareText(lang: Lang, code: string, name: string) {
  switch (lang) {
    case "ko": return `나 ${code}형 ${name} 나옴ㅋㅋ 너는?`;
    case "ja": return `私は${code}型 ${name}になった！あなたは？`;
    case "zh": return `我是${code}型 ${name}！你呢？`;
    case "es": return `¡Salí ${name} (${code})! ¿Y tú?`;
    default: return `I got ${name} (${code})! What about you?`;
  }
}

function fireResultConfetti(colors: string[]) {
  confetti({ particleCount: 80, spread: 70, startVelocity: 45, origin: { y: 0.35 }, colors, zIndex: 999 });
  setTimeout(() => {
    confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.45 }, colors, zIndex: 999 });
    confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.45 }, colors, zIndex: 999 });
  }, 150);
}

export default function RatePage() {
  const router = useRouter();
  const [result, setResult] = useState<AttachmentResult | null>(null);
  const [lang, setLang] = useState<Lang>("ko");
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  // Points at the hidden minimal 9:16 share card (character + name + one-line
  // + URL only), NOT the visible hero — the visible hero carries a lot more
  // detail than makes sense as a shareable poster.
  const shareCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLang(getStoredLang());

    const saved = localStorage.getItem("attachmentResult");
    if (saved) {
      try {
        const parsed: AttachmentResult = JSON.parse(saved);
        setResult(parsed);
        setTimeout(() => {
          setLoaded(true);
          if (parsed.hidden || !parsed.primaryType) {
            fireResultConfetti(["#a1a1aa", "#71717a", "#d4d4d8", "#ffffff"]);
            return;
          }
          const p = AXIS_META[parsed.primaryType];
          const s = parsed.secondaryType ? AXIS_META[parsed.secondaryType] : p;
          fireResultConfetti([p.colorFrom, p.colorTo, s.colorFrom, s.colorTo, "#ffffff"]);
        }, 100);
      } catch {
        localStorage.removeItem("attachmentResult");
      }
    }
  }, []);

  const ui = UI[lang];

  if (result?.hidden) {
    const hiddenUi = HIDDEN_UI[lang];
    return (
      <main style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${NEUTRAL_THEME.bgFrom} 0%, ${NEUTRAL_THEME.bgTo} 100%)`, fontFamily: "var(--font-sans)", color: TEXT_DARK }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.5)" }}>
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => router.push("/")} className="tap-btn" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: 999, color: TEXT_MUTED, padding: "7px 16px", fontSize: 13, cursor: "pointer" }}>
              {ui.home}
            </button>
            <LanguageSwitcher lang={lang} onChange={setLang} />
          </div>
        </div>

        <div className={loaded ? "scale-in" : ""} style={{ maxWidth: 480, margin: "0 auto", padding: "100px 20px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "inline-block", background: "rgba(24,24,27,0.06)", border: "1px solid rgba(24,24,27,0.1)", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: TEXT_MUTED }}>
            {hiddenUi.badge}
          </div>
          <div style={{ fontSize: 72 }}>❓</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, lineHeight: 1.3, letterSpacing: "-0.8px", color: TEXT_DARK }}>
            {hiddenUi.title}
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_MUTED, margin: 0, maxWidth: 360 }}>
            {hiddenUi.desc}
          </p>

          <div style={{ background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "14px 16px", margin: "12px 0 0", boxShadow: CARD.shadow, backdropFilter: "blur(10px)", width: "100%" }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DARK, margin: 0, fontWeight: 500 }}>
              {hiddenUi.share}
            </p>
          </div>

          <button
            onClick={() => { navigator.clipboard.writeText(hiddenUi.share); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
            className="tap-btn"
            style={{ width: "100%", background: "linear-gradient(135deg,#71717a,#3f3f46)", border: "none", borderRadius: 999, color: "#fff", fontSize: 16, fontWeight: 800, padding: "16px", cursor: "pointer", boxShadow: "0 8px 32px rgba(63,63,70,0.35)", letterSpacing: "-0.3px" }}
          >
            {copied ? ui.copied : ui.share}
          </button>
          <button
            onClick={() => { localStorage.removeItem("attachmentResult"); router.push("/quiz"); }}
            className="tap-btn"
            style={{ width: "100%", background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 999, color: TEXT_MUTED, fontSize: 14, fontWeight: 600, padding: "16px", cursor: "pointer" }}
          >
            {ui.retry}
          </button>
        </div>
      </main>
    );
  }

  const type = result ? getAttachmentTypeByCode(result.code) : undefined;

  if (!result || !type) {
    return (
      <main style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${NEUTRAL_THEME.bgFrom} 0%, ${NEUTRAL_THEME.bgTo} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>
        <div style={{ textAlign: "center", color: NEUTRAL_THEME.text, padding: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>💕</div>
          <p style={{ fontSize: 18, color: NEUTRAL_THEME.textMuted, marginBottom: 24 }}>{ui.noResult}</p>
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
  const pageBg = `linear-gradient(180deg, ${primary.bgFrom} 0%, ${secondary.bgTo} 100%)`;
  const bestMatch = getAttachmentTypeByCode(content.bestMatch.code);
  const worstMatch = getAttachmentTypeByCode(content.worstMatch.code);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/types/${type.code}` : "";
  const shareTextBase = buildShareText(lang, type.code, content.name);
  const fullShareText = shareUrl ? `${shareTextBase}\n${shareUrl}` : shareTextBase;

  const handleShare = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Captures the hidden minimal share card (see shareCardRef below), not the
  // full visible hero — keeps the shared image a clean, poster-like 9:16
  // instead of a screenshot of the whole detailed result screen. Prefers the
  // native share sheet on mobile (goes straight to Instagram/KakaoTalk/etc.)
  // and falls back to a plain download when Web Share isn't available.
  const handleSaveOrShareImage = async () => {
    if (imageBusy || !shareCardRef.current) return;
    setImageBusy(true);
    try {
      const blob = await toBlob(shareCardRef.current, { pixelRatio: 2, cacheBust: true });
      if (!blob) return;
      const file = new File([blob], `attachment-type-${type.code}.png`, { type: "image/png" });

      if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: content.name, text: shareTextBase });
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Capture failed or the user dismissed the native share sheet — no-op.
    } finally {
      setImageBusy(false);
    }
  };

  const handleTwitterShare = () => {
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTextBase)}${shareUrl ? `&url=${encodeURIComponent(shareUrl)}` : ""}`;
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main style={{ minHeight: "100vh", background: pageBg, fontFamily: "var(--font-sans)", color: TEXT_DARK }}>

      {/* ── 상단 네비 ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.5)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => router.push("/")} className="tap-btn" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: 999, color: TEXT_MUTED, padding: "7px 16px", fontSize: 13, cursor: "pointer" }}>
            {ui.home}
          </button>
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </div>
      </div>

      {/* ── 메인 컨텐츠 ── */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 20px 24px" }}>

        {/* ══ HERO — 크고 임팩트 있게. 공유 이미지는 아래 별도의 숨겨진 카드에서 캡처 ══ */}
        <div
          className={loaded ? "scale-in" : ""}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center",
            background: `linear-gradient(160deg, ${primary.bgFrom} 0%, ${secondary.bgTo} 100%)`,
            border: "1px solid rgba(255,255,255,0.8)", borderRadius: 28,
            padding: "32px 20px 26px", boxShadow: CARD.shadow,
          }}
        >
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.85)", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: primary.textAccent }}>
            {ui.badge}
          </div>
          <div
            style={{
              width: 300, height: 300, maxWidth: "74vw", maxHeight: "74vw", borderRadius: 44, background: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(255,255,255,0.8)", boxShadow: `0 16px 40px ${primary.colorFrom}44`,
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
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0, lineHeight: 1.2, letterSpacing: "-1px", color: TEXT_DARK }}>
            {content.name}
          </h1>
          <p style={{ fontSize: 17, fontWeight: 600, color: TEXT_MUTED, margin: 0, fontStyle: "italic" }}>
            &quot;{content.catchphrase}&quot;
          </p>

          {/* ── 희소성 문구: 실제 통계 붙기 전까지 코드 기반 결정론적 가짜 숫자 ── */}
          <div
            style={{
              display: "inline-block", background: "rgba(255,255,255,0.8)", border: `1px solid ${primary.colorFrom}55`,
              borderRadius: 999, padding: "8px 18px", fontSize: 13, fontWeight: 800, color: primary.textAccent,
            }}
          >
            {ui.scarcity(generateScarcityPercent(type.code))}
          </div>

          {/* ── 퍼센트 바 / 순수형 강조 ── */}
          <div style={{ width: "100%", marginTop: 10 }}>
            {type.secondaryAxis && result.secondaryPercent !== null ? (
              <div style={{ background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "16px", backdropFilter: "blur(10px)" }}>
                <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: "rgba(24,24,27,0.08)" }}>
                  <div style={{ width: loaded ? `${result.primaryPercent}%` : 0, background: primary.colorFrom, transition: "width 1s cubic-bezier(0.4,0,0.2,1) 0.2s" }} />
                  <div style={{ width: loaded ? `${result.secondaryPercent}%` : 0, background: secondary.colorTo, transition: "width 1s cubic-bezier(0.4,0,0.2,1) 0.3s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12.5 }}>
                  <span style={{ color: primary.textAccent, fontWeight: 700 }}>{primary.label[lang]} {result.primaryPercent}%</span>
                  <span style={{ color: secondary.textAccent, fontWeight: 700 }}>{secondary.label[lang]} {result.secondaryPercent}%</span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "18px", backdropFilter: "blur(10px)" }}>
                <p style={{ fontSize: 18, fontWeight: 900, margin: 0, color: primary.textAccent }}>{ui.pureLabel(primary.label[lang])}</p>
                <p style={{ fontSize: 12, color: TEXT_FAINT, margin: "6px 0 0" }}>{result.primaryPercent}%</p>
              </div>
            )}
          </div>
        </div>

        {/* ══ 공유용 미니멀 9:16 카드 — 화면엔 안 보이고 캡처 전용 (캐릭터+타입+한줄 문구+URL만) ══ */}
        <div
          ref={shareCardRef}
          aria-hidden="true"
          style={{
            position: "fixed", top: 0, left: -99999, width: 540, height: 960,
            display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
            background: `linear-gradient(160deg, ${primary.bgFrom} 0%, ${secondary.bgTo} 100%)`,
            fontFamily: "var(--font-sans)", color: TEXT_DARK, padding: "72px 44px 48px",
          }}
        >
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.85)", borderRadius: 999, padding: "8px 22px", fontSize: 15, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: primary.textAccent }}>
            {ui.badge}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 380, height: 380, margin: "28px 0" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/characters/${type.code.replace("+", "")}.png`}
              alt=""
              crossOrigin="anonymous"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div
            style={{
              display: "inline-block", background: gradient, borderRadius: 24, padding: "14px 36px",
              fontSize: 36, fontWeight: 900, letterSpacing: "1px", color: "#fff", marginBottom: 20,
            }}
          >
            {type.code}
          </div>
          <h2 style={{ fontSize: 44, fontWeight: 900, margin: 0, lineHeight: 1.2, letterSpacing: "-1px" }}>
            {content.name}
          </h2>
          <p style={{ fontSize: 22, fontWeight: 600, color: TEXT_MUTED, margin: "16px 0 0", fontStyle: "italic" }}>
            &quot;{content.catchphrase}&quot;
          </p>
          <div style={{ marginTop: "auto", fontSize: 20, fontWeight: 700, color: primary.textAccent }}>
            {shareUrl.replace(/^https?:\/\//, "")}
          </div>
        </div>

        {/* ══ 공유 섹션 — 위 카드를 그대로 캡처해서 저장/공유 ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.15s", margin: "16px 0 0" }}>
          <div style={{ background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14, boxShadow: CARD.shadow, backdropFilter: "blur(10px)" }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DARK, margin: 0, fontWeight: 500, whiteSpace: "pre-line" }}>
              {fullShareText}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleShare} className="tap-btn" style={{ flex: 1, background: gradient, border: "none", borderRadius: 999, color: "#fff", fontSize: 15, fontWeight: 800, padding: "16px", cursor: "pointer", boxShadow: `0 8px 32px ${primary.colorFrom}55`, letterSpacing: "-0.3px" }}>
              {copied ? ui.copied : ui.share}
            </button>
            <button
              onClick={handleSaveOrShareImage}
              disabled={imageBusy}
              className="tap-btn"
              style={{ flex: 1, background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 999, color: TEXT_DARK, fontSize: 15, fontWeight: 800, padding: "16px", cursor: imageBusy ? "default" : "pointer", opacity: imageBusy ? 0.6 : 1, boxShadow: CARD.shadow }}
            >
              {imageBusy ? ui.saving : ui.saveImage}
            </button>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button onClick={handleTwitterShare} aria-label={ui.shareTwitterAria} className="tap-btn"
              style={{ flex: 1, background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 999, color: TEXT_DARK, fontSize: 18, fontWeight: 700, padding: "14px 20px", cursor: "pointer" }}>
              𝕏
            </button>
            <button onClick={() => { localStorage.removeItem("attachmentResult"); router.push("/quiz"); }} className="tap-btn"
              style={{ flex: 1, background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 999, color: TEXT_MUTED, fontSize: 14, fontWeight: 600, padding: "14px 20px", cursor: "pointer" }}>
              {ui.retry}
            </button>
          </div>
        </div>

        {/* ══ 강점/약점 ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.25s", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "32px 0 0" }}>
          <div style={{ background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "16px 14px", boxShadow: CARD.shadow, backdropFilter: "blur(10px)" }}>
            <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#0f766e", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>{ui.strengthsLabel}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {content.strengths.map((s) => (
                <li key={s} style={{ fontSize: 13, lineHeight: 1.5, color: TEXT_DARK }}>• {s}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "16px 14px", boxShadow: CARD.shadow, backdropFilter: "blur(10px)" }}>
            <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#be123c", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>{ui.weaknessesLabel}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {content.weaknesses.map((w) => (
                <li key={w} style={{ fontSize: 13, lineHeight: 1.5, color: TEXT_DARK }}>• {w}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ══ 궁합 ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.3s", display: "flex", flexDirection: "column", gap: 10, margin: "18px 0 0" }}>
          {bestMatch && (
            <Link href={`/types/${bestMatch.code}`} className="tap-btn" style={{ display: "block", textDecoration: "none", color: TEXT_DARK, background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "14px 16px", boxShadow: CARD.shadow, backdropFilter: "blur(10px)" }}>
              <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#0f766e", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>{ui.bestMatchLabel} · {bestMatch.code} {bestMatch[lang].name}</p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: TEXT_MUTED, margin: 0 }}>{content.bestMatch.reason}</p>
            </Link>
          )}
          {worstMatch && (
            <Link href={`/types/${worstMatch.code}`} className="tap-btn" style={{ display: "block", textDecoration: "none", color: TEXT_DARK, background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "14px 16px", boxShadow: CARD.shadow, backdropFilter: "blur(10px)" }}>
              <p style={{ fontSize: 11, letterSpacing: "1.5px", color: "#be123c", textTransform: "uppercase", fontWeight: 700, margin: "0 0 6px" }}>{ui.worstMatchLabel} · {worstMatch.code} {worstMatch[lang].name}</p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: TEXT_MUTED, margin: 0 }}>{content.worstMatch.reason}</p>
            </Link>
          )}
        </div>

        {/* ══ 닮은 캐릭터 ══ */}
        {content.similarFigures.length > 0 && (
          <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.35s", margin: "18px 0 0", background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "16px 16px", boxShadow: CARD.shadow, backdropFilter: "blur(10px)" }}>
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

        {/* ══ 유형 상세 페이지 링크 ══ */}
        <Link
          href={`/types/${type.code}`}
          className="tap-btn fade-up"
          style={{ display: "block", animationDelay: "0.4s", textAlign: "center", marginTop: 20, background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 999, color: TEXT_MUTED, fontSize: 14, fontWeight: 600, padding: "14px", textDecoration: "none", boxShadow: CARD.shadow }}
        >
          {ui.seeDetail}
        </Link>

        <p style={{ textAlign: "center", fontSize: 11, color: TEXT_FAINT, margin: "28px 0 0", letterSpacing: "1px" }}>
          {ui.footer}
        </p>

      </div>
    </main>
  );
}
