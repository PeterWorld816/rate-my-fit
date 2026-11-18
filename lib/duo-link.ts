import { getAttachmentTypeByCode } from "@/data/attachment-types";
import { sanitizeNickname } from "@/data/duo";

// Compact, URL-safe encoding of one person's duo result:
// base64url(UTF-8 of "code|primaryPercent|secondaryPercent|nickname").
export type DuoPayload = { code: string; p: number; s: number | null; n: string };

export function encodeDuoPayload(p: DuoPayload): string {
  const bytes = new TextEncoder().encode(`${p.code}|${p.p}|${p.s ?? ""}|${p.n}`);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeDuoPayload(raw: string | null): DuoPayload | null {
  if (!raw) return null;
  try {
    let b64 = raw.trim().replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    const [code = "", pRaw = "", sRaw = "", ...rest] = text.split("|");
    if (!getAttachmentTypeByCode(code)) return null;
    const p = Number(pRaw);
    const s = sRaw === "" ? null : Number(sRaw);
    return {
      code,
      p: pRaw !== "" && Number.isFinite(p) ? Math.round(p) : 0,
      s: s !== null && Number.isFinite(s) ? Math.round(s) : null,
      n: sanitizeNickname(rest.join("|")),
    };
  } catch {
    return null;
  }
}
