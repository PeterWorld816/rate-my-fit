import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadNotoSansKR } from "./og-font";
import { generateQrDataUrl } from "./qr";
import { AXIS_META, type AttachmentType, type Lang } from "@/data/attachment-types";

export const OG_SIZE = { width: 1200, height: 630 };
export const SHARE_CARD_SIZE = { width: 1080, height: 1920 };

// public/characters/*.png ship as ~1086x1448 with a baked-in caption strip
// covering roughly the bottom third of the image. The share card renders its
// own name/quote/traits overlay, so crop the source down to just the photo
// (top ~64%) to avoid the baked-in strip showing through underneath ours.
const PORTRAIT_ASPECT = 1086 / 1448;
const PORTRAIT_VISIBLE_FRACTION = 0.64;

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

async function loadPortrait(imageFile: string): Promise<string | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", "characters", imageFile));
    return `data:image/png;base64,${buf.toString("base64")}`;
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

  const text = `${content.name} ${content.catchphrase} ${figure?.name ?? ""} ${primary.label[lang]} ${secondary.label[lang]} ${siteLabel} ${ctaLabel} ${badgeLabel}`;
  const [fontData, portraitSrc, qrSrc] = await Promise.all([
    loadNotoSansKR(text),
    loadPortrait(type.imageFile),
    generateQrDataUrl(shareUrl),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          background: "#0a0a0f",
          fontFamily: "Noto Sans KR",
          color: "#fff",
        }}
      >
        {portraitSrc ? (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portraitSrc}
              width={Math.round((SHARE_CARD_SIZE.height / PORTRAIT_VISIBLE_FRACTION) * PORTRAIT_ASPECT)}
              height={Math.round(SHARE_CARD_SIZE.height / PORTRAIT_VISIBLE_FRACTION)}
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 200,
              background: `linear-gradient(180deg, ${primary.colorFrom}33 0%, #0a0a0f 100%)`,
            }}
          >
            {primary.emoji}{type.secondaryAxis ? secondary.emoji : ""}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            display: "flex",
            background:
              "linear-gradient(to bottom, rgba(10,10,15,0.75) 0%, rgba(10,10,15,0.05) 26%, rgba(10,10,15,0.1) 50%, rgba(10,10,15,0.92) 78%, #0a0a0f 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 64px 56px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(124,58,237,0.3)",
                border: "2px solid rgba(167,139,250,0.4)",
                borderRadius: 999,
                padding: "14px 30px",
                fontSize: 26,
                fontWeight: 700,
                color: "#c4b5fd",
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
                fontSize: 40,
                fontWeight: 900,
                letterSpacing: 1,
                boxShadow: `0 8px 32px ${primary.colorFrom}66`,
              }}
            >
              {type.code}
            </div>
          </div>

          <div style={{ display: "flex", flex: 1 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                display: "flex",
                fontSize: 66,
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: -1.5,
                textShadow: "0 4px 24px rgba(0,0,0,0.8)",
              }}
            >
              {content.name}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 32,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.9)",
                background: "rgba(167,139,250,0.12)",
                border: "2px solid rgba(167,139,250,0.3)",
                borderRadius: 24,
                padding: "22px 28px",
              }}
            >
              &quot;{content.catchphrase}&quot;
            </div>

            {/* ── 퍼센트 바 ── */}
            {secondaryPercent !== null ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", height: 20, borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,0.1)" }}>
                  <div style={{ display: "flex", width: `${primaryPercent}%`, background: primary.colorFrom }} />
                  <div style={{ display: "flex", width: `${secondaryPercent}%`, background: secondary.colorTo }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 700 }}>
                  <div style={{ display: "flex", color: primary.colorFrom }}>{primary.label[lang]} {primaryPercent}%</div>
                  <div style={{ display: "flex", color: secondary.colorTo }}>{secondary.label[lang]} {secondaryPercent}%</div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: primary.colorFrom }}>
                {primary.label[lang]} {primaryPercent}%
              </div>
            )}

            {figure ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", fontSize: 22, letterSpacing: 1, color: "rgba(251,191,36,0.8)", fontWeight: 700 }}>
                  🎬 {figure.name}
                </div>
                <div style={{ display: "flex", fontSize: 20, color: "rgba(255,255,255,0.5)" }}>{figure.description}</div>
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 8,
                paddingTop: 26,
                borderTop: "2px solid rgba(255,255,255,0.12)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>
                  {siteLabel}
                </div>
                <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.5)" }}>{ctaLabel}</div>
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
      </div>
    ),
    { ...SHARE_CARD_SIZE, fonts: [{ name: "Noto Sans KR", data: fontData, weight: 700, style: "normal" }] }
  );
}
