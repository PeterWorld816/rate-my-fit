import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadNotoSansKR } from "./og-font";
import { generateQrDataUrl } from "./qr";
import type { Character } from "@/data/characters";

export const OG_SIZE = { width: 1200, height: 630 };
export const SHARE_CARD_SIZE = { width: 1080, height: 1920 };

// public/characters/*.png ship as ~1086x1448 with a baked-in caption strip
// covering roughly the bottom third of the image. The share card renders its
// own name/quote/traits overlay, so crop the source down to just the photo
// (top ~64%) to avoid the baked-in strip showing through underneath ours.
const PORTRAIT_ASPECT = 1086 / 1448;
const PORTRAIT_VISIBLE_FRACTION = 0.64;

type Lang = "ko" | "en" | "ja" | "zh" | "es";

const MATCH_LABEL: Record<Lang, string> = {
  ko: "매칭도",
  en: "MATCH",
  ja: "マッチ度",
  zh: "匹配度",
  es: "COINCIDENCIA",
};

const CTA_LABEL: Record<Lang, string> = {
  ko: "나도 내 역할 찾으러 가기 ✨",
  en: "Find your own role ✨",
  ja: "自分の役割も探しに行く ✨",
  zh: "去找找我的角色 ✨",
  es: "Encuentra tu propio rol ✨",
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
  const text = "K-Drama 역할 테스트 질문 8개로 당신의 드라마 캐릭터를 찾아드립니다";
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
          🎬 K-DRAMA ROLE TEST
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -2, marginBottom: 20 }}>
          K-Drama 역할 테스트
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 820 }}>
          질문 8개로 당신의 K-Drama 역할을 찾아드립니다
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Noto Sans KR", data: fontData, weight: 700, style: "normal" }] }
  );
}

export async function renderCharacterImage(character: Character) {
  const text = `${character.ko.name} ${character.ko.quote} ${character.ko.traits.join(" ")} K-Drama 역할 테스트`;
  const [fontData, portraitSrc] = await Promise.all([
    loadNotoSansKR(text),
    loadPortrait(character.imageFile),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #1a0a2e 0%, #0a0a0f 70%)",
          fontFamily: "Noto Sans KR",
          color: "#fff",
        }}
      >
        <div
          style={{
            width: 460,
            height: "100%",
            display: "flex",
            background: "linear-gradient(180deg, #2a1a3e 0%, #0a0a0f 100%)",
          }}
        >
          {portraitSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={portraitSrc} width={460} height={630} style={{ objectFit: "cover", objectPosition: "top" }} />
          ) : (
            <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", fontSize: 140 }}>
              {character.ko.name.split(" ")[0]}
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px 56px 56px 48px", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: "rgba(124,58,237,0.3)",
              border: "2px solid rgba(167,139,250,0.4)",
              borderRadius: 999,
              padding: "8px 20px",
              fontSize: 20,
              fontWeight: 700,
              color: "#c4b5fd",
            }}
          >
            🎬 K-DRAMA ROLE TEST
          </div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 700, lineHeight: 1.2, letterSpacing: -1 }}>
            {character.ko.name}
          </div>
          {character.ko.quote ? (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.85)",
                background: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.25)",
                borderRadius: 16,
                padding: "16px 22px",
              }}
            >
              &quot;{character.ko.quote}&quot;
            </div>
          ) : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {character.ko.traits.slice(0, 3).map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  fontSize: 20,
                  fontWeight: 700,
                  padding: "8px 18px",
                  borderRadius: 999,
                  background: "rgba(124,58,237,0.18)",
                  border: "1px solid rgba(124,58,237,0.35)",
                  color: "#c4b5fd",
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>
            K-Drama 역할 테스트
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Noto Sans KR", data: fontData, weight: 700, style: "normal" }] }
  );
}

export async function renderShareCard(
  character: Character,
  opts: { lang: Lang; matchScore: number; shareUrl: string }
) {
  const { shareUrl } = opts;
  const lang = opts.lang in MATCH_LABEL ? opts.lang : "ko";
  const matchScore = Math.min(99, Math.max(1, Math.round(opts.matchScore)));
  const content = character[lang] ?? character.ko;
  const matchLabel = MATCH_LABEL[lang];
  const ctaLabel = CTA_LABEL[lang];
  const siteLabel = shareUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const text = `${content.name} ${content.quote} ${content.traits.join(" ")} ${matchLabel} ${matchScore}% ${siteLabel} ${ctaLabel} K-DRAMA ROLE TEST`;
  const [fontData, portraitSrc, qrSrc] = await Promise.all([
    loadNotoSansKR(text),
    loadPortrait(character.imageFile),
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
              fontSize: 260,
              background: "linear-gradient(180deg, #2a1a3e 0%, #0a0a0f 100%)",
            }}
          >
            {content.name.split(" ")[0]}
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
                fontSize: 30,
                fontWeight: 700,
                color: "#c4b5fd",
              }}
            >
              🎬 K-DRAMA ROLE TEST
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                borderRadius: 28,
                padding: "16px 26px",
                boxShadow: "0 8px 32px rgba(124,58,237,0.5)",
              }}
            >
              <div style={{ display: "flex", fontSize: 22, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.85)" }}>
                {matchLabel}
              </div>
              <div style={{ display: "flex", fontSize: 48, fontWeight: 900, color: "#fff" }}>{matchScore}%</div>
            </div>
          </div>

          <div style={{ display: "flex", flex: 1 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div
              style={{
                display: "flex",
                fontSize: 72,
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: -1.5,
                textShadow: "0 4px 24px rgba(0,0,0,0.8)",
              }}
            >
              {content.name}
            </div>

            {content.quote ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 34,
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.9)",
                  background: "rgba(167,139,250,0.12)",
                  border: "2px solid rgba(167,139,250,0.3)",
                  borderRadius: 24,
                  padding: "24px 30px",
                }}
              >
                &quot;{content.quote}&quot;
              </div>
            ) : null}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {content.traits.slice(0, 3).map((t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    fontSize: 26,
                    fontWeight: 700,
                    padding: "12px 26px",
                    borderRadius: 999,
                    background: "rgba(124,58,237,0.2)",
                    border: "2px solid rgba(124,58,237,0.4)",
                    color: "#c4b5fd",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 14,
                paddingTop: 30,
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
