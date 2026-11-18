"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AXIS_META, NEUTRAL_THEME, getAttachmentTypeByCode, type Lang } from "@/data/attachment-types";
import type { AttachmentResult } from "@/app/quiz/page";
import { sanitizeNickname } from "@/data/duo";
import LanguageSwitcher, { useLocalizedTitle, useSiteLang } from "@/components/LanguageSwitcher";
import { SITE_NAME_I18N } from "@/lib/site";
import { decodeDuoPayload, encodeDuoPayload, type DuoPayload } from "@/lib/duo-link";

// Same opaque "frosted" card look as app/rate/page.tsx.
const CARD = {
  bg: "rgba(255,255,255,0.78)",
  border: "rgba(255,255,255,0.75)",
  shadow: "0 8px 24px rgba(24,24,27,0.08)",
};
const TEXT_DARK = "#18181b";
const TEXT_MUTED = "rgba(24,24,27,0.65)";

const UI: Record<Lang, {
  home: string;
  pageTitle: string;
  invalidLink: string;
  goHome: string;
  invitedBy: (name: string) => string;
  invited: string;
  partnerType: string;
  desc: string;
  start: string;
  useMine: string;
}> = {
  ko: {
    home: "← 홈",
    pageTitle: "연애 궁합 검사",
    invalidLink: "링크가 올바르지 않아요",
    goHome: "홈으로 가기",
    invitedBy: (n) => `${n}님이 연애 궁합 검사에 초대했어요`,
    invited: "연애 궁합 검사에 초대받았어요",
    partnerType: "상대의 연애 유형",
    desc: "15문항 검사를 마치면 두 사람의 궁합 리포트가 바로 나와요",
    start: "검사 시작하기",
    useMine: "이전 내 결과로 바로 보기",
  },
  en: {
    home: "← Home",
    pageTitle: "Compatibility Test",
    invalidLink: "This link isn't valid",
    goHome: "Go to Home",
    invitedBy: (n) => `${n} invited you to a compatibility test`,
    invited: "You've been invited to a compatibility test",
    partnerType: "Their attachment type",
    desc: "Finish the 15-question test to see your compatibility report right away",
    start: "Start the Test",
    useMine: "Use my previous result",
  },
  ja: {
    home: "← ホーム",
    pageTitle: "恋愛相性診断",
    invalidLink: "リンクが正しくありません",
    goHome: "ホームへ",
    invitedBy: (n) => `${n}さんから恋愛相性診断に招待されました`,
    invited: "恋愛相性診断に招待されました",
    partnerType: "相手の恋愛タイプ",
    desc: "15問の診断を終えると、二人の相性レポートがすぐに表示されます",
    start: "診断を始める",
    useMine: "以前の自分の結果ですぐに見る",
  },
  zh: {
    home: "← 主页",
    pageTitle: "恋爱配对测试",
    invalidLink: "链接无效",
    goHome: "返回主页",
    invitedBy: (n) => `${n}邀请你参加恋爱配对测试`,
    invited: "你收到了恋爱配对测试的邀请",
    partnerType: "对方的恋爱类型",
    desc: "完成15题测试后，即可查看两人的配对报告",
    start: "开始测试",
    useMine: "用我之前的结果直接查看",
  },
  es: {
    home: "← Inicio",
    pageTitle: "Test de Compatibilidad",
    invalidLink: "Este enlace no es válido",
    goHome: "Ir al inicio",
    invitedBy: (n) => `${n} te invitó a un test de compatibilidad`,
    invited: "Te invitaron a un test de compatibilidad",
    partnerType: "Su tipo de apego",
    desc: "Al terminar el test de 15 preguntas verás al instante el informe de compatibilidad",
    start: "Empezar el Test",
    useMine: "Usar mi resultado anterior",
  },
};

function buildDuoResultUrl(partner: DuoPayload, mine: AttachmentResult) {
  const me: DuoPayload = { code: mine.code, p: mine.primaryPercent, s: mine.secondaryPercent ?? null, n: "" };
  return `/duo/result?x=${encodeDuoPayload(partner)}&y=${encodeDuoPayload(me)}`;
}

function parsePercent(raw: string | null): number | null {
  if (raw === null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.round(n) : null;
}

export default function DuoInvitePage() {
  return (
    <Suspense fallback={<main style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${NEUTRAL_THEME.bgFrom} 0%, ${NEUTRAL_THEME.bgTo} 100%)` }} />}>
      <DuoInvite />
    </Suspense>
  );
}

function DuoInvite() {
  const router = useRouter();
  const params = useSearchParams();
  const lang = useSiteLang();
  const ui = UI[lang];
  useLocalizedTitle(lang, `${ui.pageTitle} · ${SITE_NAME_I18N[lang]}`);

  const [mine, setMine] = useState<AttachmentResult | null>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("attachmentResult");
      if (!saved) return;
      const parsed: AttachmentResult = JSON.parse(saved);
      if (parsed && !parsed.hidden && getAttachmentTypeByCode(parsed.code)) setMine(parsed);
    } catch {
      // Corrupt or unavailable storage — just don't offer the shortcut.
    }
  }, []);

  // New compact links carry everything in `i`; older links used a/ap/as/n.
  const fromCompact = decodeDuoPayload(params.get("i"));
  // A raw "+" in a hand-typed query decodes to a space; restore it.
  const aCode = fromCompact?.code ?? (params.get("a") ?? "").replace(/ /g, "+");
  const type = getAttachmentTypeByCode(aCode);
  const nickname = fromCompact?.n ?? sanitizeNickname(params.get("n"));

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

  if (!type) {
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

  const partner: DuoPayload = fromCompact ?? {
    code: type.code,
    p: parsePercent(params.get("ap")) ?? 0,
    s: parsePercent(params.get("as")),
    n: nickname,
  };

  const primary = AXIS_META[type.primaryAxis];
  const secondary = type.secondaryAxis ? AXIS_META[type.secondaryAxis] : primary;
  const gradient = `linear-gradient(135deg, ${primary.colorFrom}, ${secondary.colorTo})`;
  const pageBg = `linear-gradient(180deg, ${primary.bgFrom} 0%, ${secondary.bgTo} 100%)`;

  const handleStart = () => {
    try {
      localStorage.setItem("duoPartner", JSON.stringify(partner));
    } catch {
      // Storage unavailable — the quiz still works, just without the duo hand-off.
    }
    router.push("/quiz");
  };

  return (
    <main style={{ minHeight: "100vh", background: pageBg, fontFamily: "var(--font-sans)", color: TEXT_DARK }}>
      {nav}
      <div className="scale-in" style={{ maxWidth: 480, margin: "0 auto", padding: "96px 20px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1.4, letterSpacing: "-0.5px" }}>
          {nickname ? ui.invitedBy(nickname) : ui.invited}
        </h1>

        <div
          style={{
            width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            background: `linear-gradient(160deg, ${primary.bgFrom} 0%, ${secondary.bgTo} 100%)`,
            border: "1px solid rgba(255,255,255,0.8)", borderRadius: 28, padding: "24px 20px 26px", boxShadow: CARD.shadow,
          }}
        >
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.85)", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: primary.textAccent }}>
            {ui.partnerType}
          </div>
          <div style={{ width: 220, height: 220, maxWidth: "60vw", maxHeight: "60vw", borderRadius: 36, background: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.8)", boxShadow: `0 16px 40px ${primary.colorFrom}44`, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/characters/${type.code.replace("+", "")}.png`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ display: "inline-block", background: gradient, borderRadius: 18, padding: "8px 24px", fontSize: 24, fontWeight: 900, letterSpacing: "1px", color: "#fff", boxShadow: `0 12px 32px ${primary.colorFrom}66`, transform: "rotate(-2deg)" }}>
            {type.code}
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, margin: 0, lineHeight: 1.25, letterSpacing: "-0.8px" }}>
            {type[lang].name}
          </h2>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_MUTED, margin: "4px 0 0" }}>{ui.desc}</p>

        <button
          onClick={handleStart}
          className="tap-btn"
          style={{ width: "100%", background: gradient, border: "none", borderRadius: 999, color: "#fff", fontSize: 16, fontWeight: 800, padding: "16px", cursor: "pointer", boxShadow: `0 8px 32px ${primary.colorFrom}55`, letterSpacing: "-0.3px" }}
        >
          {ui.start}
        </button>
        {mine && (
          <button
            onClick={() => router.push(buildDuoResultUrl(partner, mine))}
            className="tap-btn"
            style={{ width: "100%", background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 999, color: TEXT_DARK, fontSize: 14, fontWeight: 700, padding: "15px", cursor: "pointer", boxShadow: CARD.shadow }}
          >
            {ui.useMine}
          </button>
        )}
      </div>
    </main>
  );
}
