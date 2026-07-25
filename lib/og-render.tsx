import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadNotoSansKR } from "./og-font";
import { generateQrDataUrl } from "./qr";
import { AXIS_META, type AttachmentType, type Lang } from "@/data/attachment-types";

export const OG_SIZE = { width: 1200, height: 630 };
export const SHARE_CARD_SIZE = { width: 1080, height: 1920 };

const CARD_BG = "rgba(255,255,255,0.6)";
const CARD_BORDER = "rgba(255,255,255,0.75)";
const TEXT_DARK = "#18181b";
const TEXT_MUTED = "rgba(24,24,27,0.65)";

const BADGE_LABEL: Record<Lang, string> = {
  ko: "💕 내 연애 유형 테스트",
  en: "💕 MY ATTACHMENT STYLE TEST",
  ja: "💕 恋愛タイプ診断",
  zh: "💕 恋爱类型测试",
  es: "💕 TEST DE ESTILO DE APEGO",
};

const CTA_LABEL: Record<Lang, string> = {
  ko: "나도 내 유형 찾으러 가기 ✨",
  en: "Find your own type ✨",
  ja: "自分のタイプも探しに行く ✨",
  zh: "去找找我的类型 ✨",
  es: "Encuentra tu propio tipo ✨",
};

async function loadMascot(imageFile: string): Promise<string | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", "mascots", imageFile));
    return `data:image/svg+xml;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function renderBrandImage() {
  const text = "내 연애 유형 테스트 애착이론 기반 20개 질문으로 알아보는 나의 애착유형";
  const fontData = await loadNotoSansKR(text);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a0a2e 0%, #0a0a0f 65%)",
          color: "#fff",
          fontFamily: "Noto Sans KR",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(124,58,237,0.25)",
            border: "2px solid rgba(167,139,250,0.4)",
            borderRadius: 999,
            padding: "10px 28px",
            fontSize: 26,
            fontWeight: 700,
            color: "#c4b5fd",
            marginBottom: 32,
          }}
        >
          💕 내 연애 유형 테스트
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, letterSpacing: -2, marginBottom: 20 }}>
          나 이거였어? 내 진짜 연애 심리
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 820 }}>
          애착이론 기반 · 20개 질문으로 알아보는 16가지 애착유형
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Noto Sans KR", data: fontData, weight: 700, style: "normal" }] }
  );
}

export async function renderShareCard(
  type: AttachmentType,
  opts: { lang: Lang; primaryPercent: number; secondaryPercent: number | null; shareUrl: string }
) {
  const { shareUrl } = opts;
  const lang: Lang = opts.lang in BADGE_LABEL ? opts.lang : "ko";
  const content = type[lang];
  const primary = AXIS_META[type.primaryAxis];
  const secondary = type.secondaryAxis ? AXIS_META[type.secondaryAxis] : primary;
  const primaryPercent = Math.min(99, Math.max(1, Math.round(opts.primaryPercent)));
  const secondaryPercent = opts.secondaryPercent !== null ? Math.min(99, Math.max(1, Math.round(opts.secondaryPercent))) : null;
  const badgeLabel = BADGE_LABEL[lang];
  const ctaLabel = CTA_LABEL[lang];
  const siteLabel = shareUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const figure = content.similarFigures[0];

  const text = `${content.name} ${content.catchphrase} ${figure?.name ?? ""} ${figure?.description ?? ""} ${primary.label[lang]} ${secondary.label[lang]} ${siteLabel} ${ctaLabel} ${badgeLabel}`;
  const [fontData, mascotSrc, qrSrc] = await Promise.all([
    loadNotoSansKR(text),
    loadMascot(type.imageFile),
    generateQrDataUrl(shareUrl),
  ]);

  const pageBg = `linear-gradient(180deg, ${primary.bgFrom} 0%, ${secondary.bgTo} 100%)`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: pageBg,
          fontFamily: "Noto Sans KR",
          color: TEXT_DARK,
          padding: "72px 64px 56px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.7)",
              border: "2px solid rgba(255,255,255,0.85)",
              borderRadius: 999,
              padding: "14px 30px",
              fontSize: 30,
              fontWeight: 700,
              color: primary.textAccent,
            }}
          >
            {badgeLabel}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: `linear-gradient(135deg, ${primary.colorFrom}, ${secondary.colorTo})`,
              borderRadius: 20,
              padding: "14px 30px",
              fontSize: 46,
              fontWeight: 900,
              letterSpacing: 1,
              color: "#fff",
              boxShadow: `0 8px 32px ${primary.colorFrom}66`,
            }}
          >
            {type.code}
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
          {mascotSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mascotSrc} width={560} height={560} style={{ objectFit: "contain" }} />
          ) : (
            <div style={{ display: "flex", fontSize: 260 }}>
              {primary.emoji}{type.secondaryAxis ? secondary.emoji : ""}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 80,
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: -1.5,
            }}
          >
            {content.name}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 38,
              fontStyle: "italic",
              color: TEXT_DARK,
              background: CARD_BG,
              border: `2px solid ${CARD_BORDER}`,
              borderRadius: 24,
              padding: "22px 28px",
            }}
          >
            &quot;{content.catchphrase}&quot;
          </div>

          {/* ── 퍼센트 바 ── */}
          {secondaryPercent !== null ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", height: 20, borderRadius: 999, overflow: "hidden", background: "rgba(24,24,27,0.1)" }}>
                <div style={{ display: "flex", width: `${primaryPercent}%`, background: primary.colorFrom }} />
                <div style={{ display: "flex", width: `${secondaryPercent}%`, background: secondary.colorTo }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 700 }}>
                <div style={{ display: "flex", color: primary.textAccent }}>{primary.label[lang]} {primaryPercent}%</div>
                <div style={{ display: "flex", color: secondary.textAccent }}>{secondary.label[lang]} {secondaryPercent}%</div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: primary.textAccent }}>
              {primary.label[lang]} {primaryPercent}%
            </div>
          )}

          {figure ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", fontSize: 26, letterSpacing: 1, color: "#b45309", fontWeight: 700 }}>
                🎬 {figure.name}
              </div>
              <div style={{ display: "flex", fontSize: 24, color: TEXT_MUTED }}>{figure.description}</div>
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
              paddingTop: 26,
              borderTop: "2px solid rgba(24,24,27,0.12)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: TEXT_DARK, letterSpacing: -0.5 }}>
                {siteLabel}
              </div>
              <div style={{ display: "flex", fontSize: 26, color: TEXT_MUTED }}>{ctaLabel}</div>
            </div>
            {qrSrc ? (
              <div style={{ display: "flex", background: "#fff", borderRadius: 16, padding: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrSrc} width={110} height={110} style={{ display: "flex" }} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ),
    { ...SHARE_CARD_SIZE, fonts: [{ name: "Noto Sans KR", data: fontData, weight: 700, style: "normal" }] }
  );
}
