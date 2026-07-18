"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Lang = "ko" | "en" | "ja" | "zh" | "es";

const STICKER_ROTATIONS = [-3, 2, -1.5, 2.5, -2, 1.5, -2.5, 1];
const rot = (i: number) => STICKER_ROTATIONS[i % STICKER_ROTATIONS.length];

const LANGUAGES = [
  { code: "ko" as Lang, label: "한국어", flag: "🇰🇷" },
  { code: "en" as Lang, label: "English", flag: "🇺🇸" },
  { code: "ja" as Lang, label: "日本語", flag: "🇯🇵" },
  { code: "zh" as Lang, label: "中文", flag: "🇨🇳" },
  { code: "es" as Lang, label: "Español", flag: "🇪🇸" },
];

const UI: Record<Lang, {
  home: string;
  noResult: string;
  startQuiz: string;
  imagePending: string;
  badge: string;
  celebsLabel: string;
  matchLabel: string;
  charismaLabel: string;
  dramaLabel: string;
  share: string;
  copied: string;
  shareTwitterAria: string;
  retry: string;
  footer: string;
}> = {
  ko: {
    home: "← 홈",
    noResult: "결과가 없어요. 퀴즈를 먼저 풀어줘!",
    startQuiz: "퀴즈 시작하기",
    imagePending: "이미지 준비 중",
    badge: "🎬 K-Drama 역할 테스트",
    celebsLabel: "연상되는 캐릭터",
    matchLabel: "매칭도",
    charismaLabel: "카리스마",
    dramaLabel: "드라마 잠재력",
    share: "공유하기 📤",
    copied: "복사됨! ✓",
    shareTwitterAria: "X(트위터)에 공유",
    retry: "다시 하기",
    footer: "K-Drama 역할 테스트",
  },
  en: {
    home: "← Home",
    noResult: "No result yet. Take the quiz first!",
    startQuiz: "Start the Quiz",
    imagePending: "Image coming soon",
    badge: "🎬 K-Drama Role Test",
    celebsLabel: "Characters Like You",
    matchLabel: "Match",
    charismaLabel: "Charisma",
    dramaLabel: "Drama Potential",
    share: "Share 📤",
    copied: "Copied! ✓",
    shareTwitterAria: "Share on X (Twitter)",
    retry: "Retake Quiz",
    footer: "K-Drama Role Test",
  },
  ja: {
    home: "← ホーム",
    noResult: "結果がありません。先にクイズを受けてね！",
    startQuiz: "クイズを始める",
    imagePending: "画像準備中",
    badge: "🎬 Kドラマ役割テスト",
    celebsLabel: "連想キャラ",
    matchLabel: "マッチ度",
    charismaLabel: "カリスマ",
    dramaLabel: "ドラマ潜在力",
    share: "共有する 📤",
    copied: "コピーしました！✓",
    shareTwitterAria: "X(旧Twitter)で共有",
    retry: "もう一度",
    footer: "Kドラマ役割テスト",
  },
  zh: {
    home: "← 主页",
    noResult: "还没有结果，先去做测试吧！",
    startQuiz: "开始测试",
    imagePending: "图片准备中",
    badge: "🎬 K剧角色测试",
    celebsLabel: "联想角色",
    matchLabel: "匹配度",
    charismaLabel: "魅力值",
    dramaLabel: "戏剧潜力",
    share: "分享 📤",
    copied: "已复制！✓",
    shareTwitterAria: "分享到 X(推特)",
    retry: "重新测试",
    footer: "K剧角色测试",
  },
  es: {
    home: "← Inicio",
    noResult: "Aún no hay resultado. ¡Haz el quiz primero!",
    startQuiz: "Empezar el Quiz",
    imagePending: "Imagen próximamente",
    badge: "🎬 Prueba de Rol K-Drama",
    celebsLabel: "Personajes Como Tú",
    matchLabel: "Match",
    charismaLabel: "Carisma",
    dramaLabel: "Potencial Dramático",
    share: "Compartir 📤",
    copied: "¡Copiado! ✓",
    shareTwitterAria: "Compartir en X (Twitter)",
    retry: "Repetir Quiz",
    footer: "Prueba de Rol K-Drama",
  },
};

type LangContent = {
  name: string;
  quote: string;
  summary: string;
  traits: string[];
  shareText: string;
};

type Celeb = { name: string; work: string };

type RatingResult = {
  characterId?: string;
  imageFile?: string;
  celebs?: Celeb[];
  ko?: LangContent;
  en?: LangContent;
  ja?: LangContent;
  zh?: LangContent;
  es?: LangContent;
  matchScore?: number;
  charisma?: number;
  dramaPotential?: number;
};

export default function RatePage() {
  const router = useRouter();
  const [result, setResult] = useState<RatingResult | null>(null);
  const [lang, setLang] = useState<Lang>("ko");
  const [dropOpen, setDropOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Lang | null;
    if (savedLang && LANGUAGES.find(l => l.code === savedLang)) setLang(savedLang);

    const saved = localStorage.getItem("ratingResult");
    if (saved) {
      try {
        setResult(JSON.parse(saved));
        setTimeout(() => setLoaded(true), 100);
      } catch {
        localStorage.removeItem("ratingResult");
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

  const content: LangContent = result?.[lang] ?? result?.en ?? {
    name: "Unknown",
    quote: "",
    summary: "",
    traits: [],
    shareText: "",
  };

  const celebs = Array.isArray(result?.celebs) ? result.celebs : [];
  const characterImgSrc = result?.imageFile ? `/characters/${result.imageFile}` : null;
  const matchScore = result?.matchScore ?? 85;

  const shareUrl = result?.characterId && typeof window !== "undefined"
    ? `${window.location.origin}/result/${result.characterId}`
    : "";
  const shareTextBase = (content.shareText || "").replace(/\n?(rate-my-fit\.com|my-kdrama-role\.vercel\.app)\s*$/i, "").trim();
  const fullShareText = shareUrl ? `${shareTextBase}\n${shareUrl}` : shareTextBase;

  const handleShare = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTwitterShare = () => {
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTextBase)}${shareUrl ? `&url=${encodeURIComponent(shareUrl)}` : ""}`;
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  };

  if (!result || !result.characterId) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>
        <div style={{ textAlign: "center", color: "#fff", padding: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
          <p style={{ fontSize: 18, opacity: 0.6, marginBottom: 24 }}>{ui.noResult}</p>
          <button onClick={() => router.push("/quiz")} className="tap-btn" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none", borderRadius: 999, color: "#fff", fontSize: 15, fontWeight: 700, padding: "14px 32px", cursor: "pointer" }}>
            {ui.startQuiz}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "var(--font-sans)", color: "#fff" }}>

      {/* ── 상단 네비 ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,15,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => router.push("/")} className="tap-btn" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, color: "rgba(255,255,255,0.7)", padding: "7px 16px", fontSize: 13, cursor: "pointer" }}>
            {ui.home}
          </button>
          <div style={{ position: "relative" }} ref={dropRef}>
            <button onClick={() => setDropOpen(p => !p)} className="tap-btn" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, color: "rgba(255,255,255,0.7)", padding: "7px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              {LANGUAGES.find(l => l.code === lang)?.flag} {LANGUAGES.find(l => l.code === lang)?.label} ▾
            </button>
            {dropOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 6, zIndex: 100, boxShadow: "0 12px 40px rgba(0,0,0,0.6)", minWidth: 150 }}>
                {LANGUAGES.map(l => (
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
      <div style={{ maxWidth: 480, margin: "0 auto", paddingTop: 64 }}>

        {/* ══ HERO: 캐릭터 이미지 (전체 너비, 큰 사이즈) ══ */}
        <div className={loaded ? "scale-in" : ""} style={{ position: "relative", width: "100%", aspectRatio: "3/4", background: "linear-gradient(180deg, #1a0a2e 0%, #0a0a0f 100%)", overflow: "hidden" }}>

          {/* 캐릭터 일러스트 */}
          {characterImgSrc && !imgError ? (
            <Image
              src={characterImgSrc}
              alt={content.name}
              fill
              preload
              sizes="(max-width: 480px) 100vw, 480px"
              onError={() => setImgError(true)}
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 100 }}>{content.name.split(" ")[0]}</div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>{ui.imagePending}</p>
            </div>
          )}

          {/* 하단 그라디언트 오버레이 */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,0.5) 40%, transparent 70%)" }} />

          {/* 캐릭터 이름 오버레이 (이미지 위) */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 20px" }}>
            <div style={{ display: "inline-block", background: "rgba(124,58,237,0.3)", backdropFilter: "blur(8px)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#c4b5fd", marginBottom: 8 }}>
              {ui.badge}
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, lineHeight: 1.15, letterSpacing: "-1px", textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
              {content.name}
            </h1>
          </div>
        </div>

        {/* ══ 대사 ══ */}
        {content.quote && (
          <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.15s", margin: "20px 20px 0", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 16, padding: "14px 18px" }}>
            <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6, margin: 0, fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>
              "{content.quote}"
            </p>
          </div>
        )}

        {/* ══ 한줄 설명 ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.2s", padding: "16px 20px 0" }}>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", margin: 0 }}>
            {content.summary}
          </p>
        </div>

        {/* ══ 트레잇 ══ */}
        {content.traits && content.traits.length > 0 && (
          <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.25s", display: "flex", flexWrap: "wrap", gap: 8, padding: "14px 20px 0" }}>
            {content.traits.map((t, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 999, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#c4b5fd", display: "inline-block", transform: `rotate(${rot(i)}deg)` }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* ══ 연상 캐릭터 ══ */}
        {celebs.length > 0 && (
          <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.3s", margin: "16px 20px 0", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 16, padding: "14px 16px" }}>
            <p style={{ fontSize: 10, letterSpacing: "2px", color: "rgba(251,191,36,0.7)", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>
              🎬 {ui.celebsLabel}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {celebs.map((c, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 12, padding: "8px 14px", transform: `rotate(${rot(i + 3)}deg)` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{c.work}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ 스코어 ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.35s", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "16px 20px 0" }}>
          {[
            { label: ui.matchLabel, val: matchScore, color: "#a78bfa" },
            { label: ui.charismaLabel, val: result.charisma ?? 80, color: "#f472b6" },
            { label: ui.dramaLabel, val: result.dramaPotential ?? 80, color: "#fbbf24" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 12px" }}>
              <p style={{ fontSize: 9, letterSpacing: "0.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 4px", fontWeight: 700 }}>{label}</p>
              <p style={{ fontSize: 28, fontWeight: 900, color, margin: "0 0 8px", lineHeight: 1 }}>{val}%</p>
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: color, width: loaded ? `${val}%` : "0%", transition: "width 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s" }} />
              </div>
            </div>
          ))}
        </div>

        {/* ══ 공유 섹션 — 제일 눈에 띄게 ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.4s", margin: "20px 20px 24px" }}>
          {/* 공유 문구 */}
          <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.85)", margin: 0, fontWeight: 500, whiteSpace: "pre-line" }}>
              {fullShareText}
            </p>
          </div>

          {/* 버튼들 */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleShare} className="tap-btn" style={{ flex: 1, background: "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none", borderRadius: 999, color: "#fff", fontSize: 16, fontWeight: 800, padding: "16px", cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,0.4)", letterSpacing: "-0.3px" }}>
              {copied ? ui.copied : ui.share}
            </button>
            <button onClick={handleTwitterShare} aria-label={ui.shareTwitterAria} className="tap-btn"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, color: "rgba(255,255,255,0.8)", fontSize: 18, fontWeight: 700, padding: "16px 20px", cursor: "pointer" }}>
              𝕏
            </button>
            <button onClick={() => { localStorage.removeItem("ratingResult"); router.push("/quiz"); }} className="tap-btn"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600, padding: "16px 20px", cursor: "pointer" }}>
              {ui.retry}
            </button>
          </div>

          {/* 사이트 태그 */}
          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: "16px 0 0", letterSpacing: "1px" }}>
            {ui.footer}
          </p>
        </div>

      </div>
    </main>
  );
}