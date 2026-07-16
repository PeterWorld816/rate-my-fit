import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadNotoSansKR } from "./og-font";
import type { Character } from "@/data/characters";

export const OG_SIZE = { width: 1200, height: 630 };

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
