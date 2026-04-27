"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Lang = "ko" | "en" | "ja" | "zh" | "es";

const LANGUAGES = [
  { code: "ko" as Lang, label: "한국어", flag: "🇰🇷" },
  { code: "en" as Lang, label: "English", flag: "🇺🇸" },
  { code: "ja" as Lang, label: "日本語", flag: "🇯🇵" },
  { code: "zh" as Lang, label: "中文", flag: "🇨🇳" },
  { code: "es" as Lang, label: "Español", flag: "🇪🇸" },
];

type LangContent = {
  name: string;
  quote: string;
  summary: string;
  traits: string[];
  shareText: string;
};

type Celeb = { name: string; work: string };

type RatingResult = {
  imageUrl?: string;
  characterId?: string;
  imageFile?: string;
  celebs?: Celeb[];
  caption?: string;
  tags?: string[];
  worldVibe?: string;
  analysisMethod?: string;
  ko?: LangContent;
  en?: LangContent;
  ja?: LangContent;
  zh?: LangContent;
  es?: LangContent;
  matchScore?: number;
  charisma?: number;
  plotArmor?: number;
  dramaPotential?: number;
  // 이전 형식 호환
  characterType?: string;
  summary?: string;
  traits?: string[];
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

  // 이전/새 형식 모두 호환
  const content: LangContent = result?.[lang] ?? result?.en ?? {
    name: result?.characterType ?? "Unknown",
    quote: "",
    summary: result?.summary ?? "",
    traits: Array.isArray(result?.traits) ? result.traits : [],
    shareText: `나 K-Drama 캐릭터 테스트 했는데 ${result?.characterType ?? "??"} 나왔어 😭 너도 해봐 → rate-my-fit.com`,
  };

  const celebs = Array.isArray(result?.celebs) ? result.celebs : [];
  const characterImgSrc = result?.imageFile ? `/characters/${result.imageFile}` : null;
  const matchScore = result?.matchScore ?? 85;

  const handleShare = () => {
    navigator.clipboard.writeText(content.shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!result || !result.imageUrl) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", color: "#fff", padding: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
          <p style={{ fontSize: 18, opacity: 0.6, marginBottom: 24 }}>결과가 없어요. 사진을 먼저 올려줘!</p>
          <button onClick={() => router.push("/upload")} style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none", borderRadius: 999, color: "#fff", fontSize: 15, fontWeight: 700, padding: "14px 32px", cursor: "pointer" }}>
            사진 업로드하기
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'Pretendard', 'Apple SD Gothic Neo', system-ui, sans-serif", color: "#fff" }}>

      {/* ── 글로벌 애니메이션 ── */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        @keyframes barGrow { from { width:0%; } to { width:var(--w); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .scale-in { animation: scaleIn 0.4s ease both; }
      `}</style>

      {/* ── 상단 네비 ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,15,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => router.push("/")} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, color: "rgba(255,255,255,0.7)", padding: "7px 16px", fontSize: 13, cursor: "pointer" }}>
            ← 홈
          </button>
          <div style={{ position: "relative" }} ref={dropRef}>
            <button onClick={() => setDropOpen(p => !p)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, color: "rgba(255,255,255,0.7)", padding: "7px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              {LANGUAGES.find(l => l.code === lang)?.flag} {LANGUAGES.find(l => l.code === lang)?.label} ▾
            </button>
            {dropOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 6, zIndex: 100, boxShadow: "0 12px 40px rgba(0,0,0,0.6)", minWidth: 150 }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => switchLang(l.code)} style={{ display: "block", width: "100%", background: lang === l.code ? "rgba(167,139,250,0.15)" : "transparent", border: "none", borderRadius: 8, color: lang === l.code ? "#a78bfa" : "rgba(255,255,255,0.7)", padding: "9px 14px", fontSize: 13, cursor: "pointer", textAlign: "left", fontWeight: lang === l.code ? 700 : 400 }}>
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
            <img src={characterImgSrc} alt={content.name} onError={() => setImgError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 100 }}>{content.name.split(" ")[0]}</div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>이미지 준비 중</p>
            </div>
          )}

          {/* 하단 그라디언트 오버레이 */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,0.5) 40%, transparent 70%)" }} />

          {/* 캐릭터 이름 오버레이 (이미지 위) */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 20px" }}>
            <div style={{ display: "inline-block", background: "rgba(124,58,237,0.3)", backdropFilter: "blur(8px)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#c4b5fd", marginBottom: 8 }}>
              🎬 K-Drama Role Test
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, lineHeight: 1.15, letterSpacing: "-0.5px", textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
              {content.name}
            </h1>
          </div>

          {/* AI/랜덤 배지 */}
          <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
            {result.analysisMethod === "huggingface" ? "🤖 AI 분석" : "🎲 랜덤"}
          </div>
        </div>

        {/* ══ 내 사진 + 매칭% ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.1s", padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 16 }}>

          {/* 내 사진 — 크게! */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", overflow: "hidden", border: "3px solid #7c3aed", boxShadow: "0 0 0 3px rgba(124,58,237,0.3), 0 8px 32px rgba(124,58,237,0.3)" }}>
              <img src={result.imageUrl} alt="you" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#7c3aed,#ec4899)", borderRadius: 999, padding: "3px 10px", fontSize: 10, fontWeight: 800, letterSpacing: "1px", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(124,58,237,0.4)" }}>
              YOU
            </div>
          </div>

          {/* 매칭 % */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
              {lang === "ko" ? "역할 매칭도" : lang === "ja" ? "マッチ率" : lang === "zh" ? "匹配度" : lang === "es" ? "Coincidencia" : "Role Match"}
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, background: "linear-gradient(135deg, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {matchScore}%
            </div>
            {/* 바 */}
            <div style={{ marginTop: 8, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#7c3aed,#ec4899)", width: loaded ? `${matchScore}%` : "0%", transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
            </div>
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
              <span key={i} style={{ fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 999, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#c4b5fd" }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* ══ 연상 캐릭터 ══ */}
        {celebs.length > 0 && (
          <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.3s", margin: "16px 20px 0", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 16, padding: "14px 16px" }}>
            <p style={{ fontSize: 10, letterSpacing: "2px", color: "rgba(251,191,36,0.7)", textTransform: "uppercase", fontWeight: 700, margin: "0 0 10px" }}>
              🎬 {lang === "ko" ? "연상되는 캐릭터" : lang === "ja" ? "連想キャラ" : lang === "zh" ? "联想角色" : lang === "es" ? "Personajes" : "Characters Like You"}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {celebs.map((c, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 12, padding: "8px 14px" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{c.work}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ 스코어 — 심플하게 2개만 크게 ══ */}
        <div className={loaded ? "fade-up" : ""} style={{ animationDelay: "0.35s", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "16px 20px 0" }}>
          {[
            { label: lang === "ko" ? "카리스마" : "Charisma", val: result.charisma ?? 80, color: "#f472b6" },
            { label: lang === "ko" ? "드라마 잠재력" : "Drama Potential", val: result.dramaPotential ?? 80, color: "#fbbf24" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px" }}>
              <p style={{ fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 4px", fontWeight: 700 }}>{label}</p>
              <p style={{ fontSize: 36, fontWeight: 900, color, margin: "0 0 8px", lineHeight: 1 }}>{val}</p>
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
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.85)", margin: 0, fontWeight: 500 }}>
              {content.shareText}
            </p>
          </div>

          {/* 버튼들 */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleShare} style={{ flex: 1, background: "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none", borderRadius: 999, color: "#fff", fontSize: 16, fontWeight: 800, padding: "16px", cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,0.4)", transition: "transform 0.15s", letterSpacing: "-0.3px" }}>
              {copied ? "복사됨! ✓" : "공유하기 📤"}
            </button>
            <button onClick={() => { localStorage.removeItem("ratingResult"); router.push("/upload"); }}
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600, padding: "16px 20px", cursor: "pointer" }}>
              다시 하기
            </button>
          </div>

          {/* 사이트 태그 */}
          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: "16px 0 0", letterSpacing: "1px" }}>
            rate-my-fit.com
          </p>
        </div>

      </div>
    </main>
  );
}