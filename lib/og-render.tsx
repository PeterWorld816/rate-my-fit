import { ImageResponse } from "next/og";
import { loadNotoSansKR } from "./og-font";

export const OG_SIZE = { width: 1200, height: 630 };

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
