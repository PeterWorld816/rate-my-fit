"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AXIS_META, NEUTRAL_THEME, type AttachmentType, type Lang } from "@/data/attachment-types";
import { computeDuo, sanitizeNickname } from "@/data/duo";
import LanguageSwitcher, { useLocalizedTitle, useSiteLang } from "@/components/LanguageSwitcher";
import KakaoShareButton from "@/components/KakaoShareButton";
import { SITE_NAME_I18N, SITE_URL } from "@/lib/site";
import { shareOrCopy } from "@/lib/share";
import { decodeDuoPayload } from "@/lib/duo-link";

// Same opaque "frosted" card look as app/rate/page.tsx.
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
  pageTitle: string;
  invalidLink: string;
  goHome: string;
  badge: string;
  partner: string;
  me: string;
  conflictLabel: string;
  tipLabel: string;
  share: string;
  linkCopied: string;
  kakao: string;
  kakaoButton: string;
  tryOther: string;
  restart: string;
  disclaimer: string;
  shareText: (a: string, aCode: string, b: string, bCode: string, score: number) => string;
}> = {
  ko: {
    home: "← 홈",
    pageTitle: "연애 궁합 리포트",
    invalidLink: "링크가 올바르지 않아요",
    goHome: "홈으로 가기",
    badge: "연애 궁합 리포트",
    partner: "상대",
    me: "나",
    conflictLabel: "갈등이 생길 때",
    tipLabel: "두 사람을 위한 팁",
    share: "공유하기 📤",
    linkCopied: "링크가 복사됐어요",
    kakao: "카카오톡 공유",
    kakaoButton: "궁합 리포트 보기",
    tryOther: "다른 사람과도 궁합 보기",
    restart: "처음부터 검사하기",
    disclaimer: "애착유형 경향을 바탕으로 한 참고용 리포트예요. 실제 관계는 두 사람의 대화와 노력으로 달라질 수 있어요.",
    shareText: (a, ac, b, bc, s) => `우리 연애 궁합: ${a}(${ac}) × ${b}(${bc}) — ${s}%\n애착이론 기반 궁합 리포트`,
  },
  en: {
    home: "← Home",
    pageTitle: "Compatibility Report",
    invalidLink: "This link isn't valid",
    goHome: "Go to Home",
    badge: "COMPATIBILITY REPORT",
    partner: "Partner",
    me: "Me",
    conflictLabel: "When conflict arises",
    tipLabel: "Tips for the two of you",
    share: "Share 📤",
    linkCopied: "Link copied",
    kakao: "Share on KakaoTalk",
    kakaoButton: "View the report",
    tryOther: "Check compatibility with someone else",
    restart: "Take the test from the start",
    disclaimer: "This report is a reference based on attachment style tendencies. Real relationships can change through conversation and effort from both people.",
    shareText: (a, ac, b, bc, s) => `Our compatibility: ${a} (${ac}) × ${b} (${bc}) — ${s}%\nAn attachment theory compatibility report`,
  },
  ja: {
    home: "← ホーム",
    pageTitle: "恋愛相性レポート",
    invalidLink: "リンクが正しくありません",
    goHome: "ホームへ",
    badge: "恋愛相性レポート",
    partner: "相手",
    me: "私",
    conflictLabel: "対立が起きたとき",
    tipLabel: "二人のためのヒント",
    share: "共有する 📤",
    linkCopied: "リンクをコピーしました",
    kakao: "カカオトークで共有",
    kakaoButton: "相性レポートを見る",
    tryOther: "ほかの人との相性も見る",
    restart: "最初から診断する",
    disclaimer: "愛着タイプの傾向に基づく参考用のレポートです。実際の関係は、二人の対話と努力によって変わることがあります。",
    shareText: (a, ac, b, bc, s) => `私たちの恋愛相性：${a}（${ac}）× ${b}（${bc}）— ${s}%\n愛着理論に基づく相性レポート`,
  },
  zh: {
    home: "← 主页",
    pageTitle: "恋爱配对报告",
    invalidLink: "链接无效",
    goHome: "返回主页",
    badge: "恋爱配对报告",
    partner: "对方",
    me: "我",
    conflictLabel: "发生冲突时",
    tipLabel: "给两人的建议",
    share: "分享 📤",
    linkCopied: "链接已复制",
    kakao: "分享到KakaoTalk",
    kakaoButton: "查看配对报告",
    tryOther: "和其他人测配对",
    restart: "从头开始测试",
    disclaimer: "这是基于依恋类型倾向的参考报告。真实的关系会因两人的沟通与努力而改变。",
    shareText: (a, ac, b, bc, s) => `我们的恋爱配对：${a}（${ac}）× ${b}（${bc}）— ${s}%\n基于依恋理论的配对报告`,
  },
  es: {
    home: "← Inicio",
    pageTitle: "Informe de Compatibilidad",
    invalidLink: "Este enlace no es válido",
    goHome: "Ir al inicio",
    badge: "INFORME DE COMPATIBILIDAD",
    partner: "Pareja",
    me: "Yo",
    conflictLabel: "Cuando surge un conflicto",
    tipLabel: "Consejos para los dos",
    share: "Compartir 📤",
    linkCopied: "Enlace copiado",
    kakao: "Compartir en KakaoTalk",
    kakaoButton: "Ver el informe",
    tryOther: "Ver compatibilidad con otra persona",
    restart: "Hacer el test desde el inicio",
    disclaimer: "Este informe es una referencia basada en tendencias de estilo de apego. Las relaciones reales pueden cambiar con el diálogo y el esfuerzo de ambos.",
    shareText: (a, ac, b, bc, s) => `Nuestra compatibilidad: ${a} (${ac}) × ${b} (${bc}) — ${s}%\nUn informe de compatibilidad basado en la teoría del apego`,
  },
};

export default function DuoResultPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${NEUTRAL_THEME.bgFrom} 0%, ${NEUTRAL_THEME.bgTo} 100%)` }} />}>
      <DuoResult />
    </Suspense>
  );
}

// Counts from 0 up to `target` over `durationMs` (ease-out).
function useCountUp(target: number, durationMs: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

function PersonColumn({ type, label, lang }: { type: AttachmentType; label: string; lang: Lang }) {
  const primary = AXIS_META[type.primaryAxis];
  const secondary = type.secondaryAxis ? AXIS_META[type.secondaryAxis] : primary;
  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: TEXT_MUTED, margin: 0, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</p>
      <div style={{ width: 128, height: 128, maxWidth: "34vw", maxHeight: "34vw", borderRadius: 28, background: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.8)", boxShadow: `0 12px 30px ${primary.colorFrom}44`, display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/characters/${type.code.replace("+", "")}.png`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div style={{ display: "inline-block", background: `linear-gradient(135deg, ${primary.colorFrom}, ${secondary.colorTo})`, borderRadius: 14, padding: "5px 14px", fontSize: 16, fontWeight: 900, letterSpacing: "0.5px", color: "#fff" }}>
        {type.code}
      </div>
      <p style={{ fontSize: 14, fontWeight: 800, color: TEXT_DARK, margin: 0, lineHeight: 1.35 }}>{type[lang].name}</p>
    </div>
  );
}

function DuoResult() {
  const router = useRouter();
  const params = useSearchParams();
  const lang = useSiteLang();
  const ui = UI[lang];
  useLocalizedTitle(lang, `${ui.pageTitle} · ${SITE_NAME_I18N[lang]}`);

  const [toast, setToast] = useState<string | null>(null);
  const pathname = usePathname();
  const query = params.toString();
  const shareUrl = `${SITE_URL}${pathname}${query ? `?${query}` : ""}`;

  useEffect(() => {
    try {
      localStorage.removeItem("duoPartner");
    } catch {
      // Storage unavailable — nothing to clean up.
    }
  }, []);

  // New compact links use x (partner) / y (me); older links used a/ap/as/an/b/bp/bs.
  const x = decodeDuoPayload(params.get("x"));
  const y = decodeDuoPayload(params.get("y"));
  const compact = x && y;
  // A raw "+" in a hand-typed query decodes to a space; restore it.
  const aCode = compact ? x.code : (params.get("a") ?? "").replace(/ /g, "+");
  const bCode = compact ? y.code : (params.get("b") ?? "").replace(/ /g, "+");
  const nickname = compact ? x.n : sanitizeNickname(params.get("an"));
  const duo = computeDuo(aCode, bCode, lang);
  const score = useCountUp(duo?.score ?? 0, 800);

  const nav = (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.82)", backdropFilter: "blur(4px)", borderBottom: "1px solid rgba(255,255,255,0.5)", transform: "translateZ(0)", willChange: "transform" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => router.push("/")} className="tap-btn" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: 999, color: TEXT_MUTED, padding: "7px 16px", fontSize: 13, cursor: "pointer" }}>
          {ui.home}
        </button>
        <LanguageSwitcher lang={lang} />
      </div>
    </div>
  );

  if (!duo) {
    return (
      <main style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${NEUTRAL_THEME.bgFrom} 0%, ${NEUTRAL_THEME.bgTo} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>
        {nav}
        <div style={{ textAlign: "center", color: NEUTRAL_THEME.text, padding: 32 }}>
          <p style={{ fontSize: 18, color: NEUTRAL_THEME.textMuted, marginBottom: 24 }}>{ui.invalidLink}</p>
          <button onClick={() => router.push("/")} className="tap-btn" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none", borderRadius: 999, color: "#fff", fontSize: 15, fontWeight: 700, padding: "14px 32px", cursor: "pointer" }}>
            {ui.goHome}
          </button>
        </div>
      </main>
    );
  }

  const { a, b, pair, tier } = duo;
  const aMeta = AXIS_META[a.primaryAxis];
  const bMeta = AXIS_META[b.primaryAxis];
  const gradient = `linear-gradient(135deg, ${aMeta.colorFrom}, ${bMeta.colorTo})`;
  const pageBg = `linear-gradient(180deg, ${aMeta.bgFrom} 0%, ${bMeta.bgTo} 100%)`;

  const shareText = ui.shareText(a[lang].name, a.code, b[lang].name, b.code, duo.score);

  const handleShare = async () => {
    if (await shareOrCopy(ui.pageTitle, shareText, shareUrl)) {
      setToast(ui.linkCopied);
      setTimeout(() => setToast(null), 2000);
    }
  };

  const labelStyle = { fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase" as const, fontWeight: 700, margin: "0 0 10px" };
  const cardStyle = { background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "16px", boxShadow: CARD.shadow };

  return (
    <main style={{ minHeight: "100vh", background: pageBg, fontFamily: "var(--font-sans)", color: TEXT_DARK }}>
      {nav}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 20px 32px" }}>

        {/* ══ HERO ══ */}
        <div
          className="scale-in"
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center",
            background: `linear-gradient(160deg, ${aMeta.bgFrom} 0%, ${bMeta.bgTo} 100%)`,
            border: "1px solid rgba(255,255,255,0.8)", borderRadius: 28, padding: "28px 16px 26px", boxShadow: CARD.shadow,
          }}
        >
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.85)", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: aMeta.textAccent }}>
            {ui.badge}
          </div>

          <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 6 }}>
            <PersonColumn type={a} label={nickname || ui.partner} lang={lang} />
            <div style={{ fontSize: 28, fontWeight: 300, color: TEXT_MUTED, flexShrink: 0 }}>×</div>
            <PersonColumn type={b} label={ui.me} lang={lang} />
          </div>

          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: "-2px", background: gradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontVariantNumeric: "tabular-nums" }}>
              {score}%
            </div>
            <p style={{ fontSize: 16, fontWeight: 800, color: TEXT_DARK, margin: "10px 0 0" }}>{tier}</p>
          </div>
        </div>

        {/* ══ 리포트 카드 ══ */}
        <div className="fade-up" style={{ animationDelay: "0.15s", display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
          <div style={cardStyle}>
            <p style={{ ...labelStyle, color: aMeta.textAccent, textTransform: "none", letterSpacing: "-0.2px", fontSize: 17, fontWeight: 900 }}>{pair.title}</p>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: TEXT_DARK, margin: 0 }}>{pair.summary}</p>
          </div>
          <div style={cardStyle}>
            <p style={{ ...labelStyle, color: "#be123c" }}>{ui.conflictLabel}</p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DARK, margin: 0 }}>{pair.conflict}</p>
          </div>
          <div style={cardStyle}>
            <p style={{ ...labelStyle, color: "#0f766e" }}>{ui.tipLabel}</p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DARK, margin: 0 }}>{pair.tip}</p>
          </div>
        </div>

        {/* ══ 공유 ══ */}
        <div className="fade-up" style={{ animationDelay: "0.25s", marginTop: 20 }}>
          <button onClick={handleShare} className="tap-btn" style={{ width: "100%", background: gradient, border: "none", borderRadius: 999, color: "#fff", fontSize: 15, fontWeight: 800, padding: "16px", cursor: "pointer", boxShadow: `0 8px 32px ${aMeta.colorFrom}55`, letterSpacing: "-0.3px" }}>
            {ui.share}
          </button>
          <KakaoShareButton
            title={shareText.split("\n")[0]}
            description={pair.title}
            imageUrl={`${SITE_URL}/opengraph-image`}
            url={shareUrl}
            buttonTitle={ui.kakaoButton}
            label={ui.kakao}
            style={{ width: "100%", marginTop: 10 }}
          />
        </div>

        {/* ══ 하단 이동 ══ */}
        <div className="fade-up" style={{ animationDelay: "0.3s", display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
          <button onClick={() => router.push("/rate")} className="tap-btn" style={{ width: "100%", background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 999, color: TEXT_DARK, fontSize: 14, fontWeight: 700, padding: "15px", cursor: "pointer", boxShadow: CARD.shadow }}>
            {ui.tryOther}
          </button>
          <button onClick={() => router.push("/quiz")} className="tap-btn" style={{ width: "100%", background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 999, color: TEXT_MUTED, fontSize: 14, fontWeight: 600, padding: "15px", cursor: "pointer" }}>
            {ui.restart}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, lineHeight: 1.6, color: TEXT_FAINT, margin: "28px 8px 0" }}>
          {ui.disclaimer}
        </p>
      </div>

      {toast && (
        <div
          role="status"
          style={{
            position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)", zIndex: 1000,
            background: "rgba(24,24,27,0.88)", color: "#fff", borderRadius: 999, padding: "10px 20px",
            fontSize: 14, fontWeight: 600, boxShadow: "0 8px 24px rgba(24,24,27,0.2)", whiteSpace: "nowrap",
          }}
        >
          {toast}
        </div>
      )}
    </main>
  );
}
