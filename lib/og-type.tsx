import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { AXIS_META, getAttachmentTypeByCode } from "@/data/attachment-types";
import { loadNotoSansKR } from "./og-font";
import { OG_SIZE, renderBrandImage } from "./og-render";

// Per-type share image: the type's character art + code + Korean name, on the
// type's own color gradient.
export async function renderTypeImage(rawCode: string) {
  const type = getAttachmentTypeByCode(decodeURIComponent(rawCode));
  if (!type) return renderBrandImage();

  const { name, catchphrase } = type.ko;
  const primary = AXIS_META[type.primaryAxis];
  const secondary = type.secondaryAxis ? AXIS_META[type.secondaryAxis] : primary;
  const brand = "내 연애 유형 테스트";
  const fontData = await loadNotoSansKR(`${brand}${type.code}${name}${catchphrase}`);
  const art = await readFile(join(process.cwd(), "public/characters", `${type.code.replace("+", "")}.png`), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 48, padding: "0 80px",
          background: `linear-gradient(135deg, ${primary.bgFrom} 0%, ${secondary.bgTo} 100%)`,
          fontFamily: "Noto Sans KR", color: "#18181b",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${art}`} width={460} height={460} alt="" />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: primary.textAccent, marginBottom: 20 }}>{brand}</div>
          <div
            style={{
              display: "flex", alignSelf: "flex-start", fontSize: 56, fontWeight: 700, color: "#fff", borderRadius: 24, padding: "6px 30px",
              background: `linear-gradient(135deg, ${primary.colorFrom}, ${secondary.colorTo})`, marginBottom: 24,
            }}
          >
            {type.code}
          </div>
          <div style={{ display: "flex", fontSize: 60, fontWeight: 700, letterSpacing: -2, lineHeight: 1.2, marginBottom: 16 }}>{name}</div>
          <div style={{ display: "flex", fontSize: 32, color: "rgba(24,24,27,0.6)" }}>{catchphrase}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Noto Sans KR", data: fontData, weight: 700, style: "normal" }] }
  );
}
