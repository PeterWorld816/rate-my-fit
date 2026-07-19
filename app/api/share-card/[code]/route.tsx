import type { NextRequest } from "next/server";
import { getAttachmentTypeByCode } from "@/data/attachment-types";
import { renderShareCard } from "@/lib/og-render";
import { getSiteUrl } from "@/lib/site";

const LANGS = ["ko", "en", "ja", "zh", "es"] as const;
type Lang = (typeof LANGS)[number];

function clampPercent(raw: string | null, fallback: number) {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 && n <= 100 ? n : fallback;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const type = getAttachmentTypeByCode(decodeURIComponent(code));
  if (!type) {
    return new Response("Attachment type not found", { status: 404 });
  }

  const searchParams = request.nextUrl.searchParams;
  const langParam = searchParams.get("lang");
  const lang: Lang = (LANGS as readonly string[]).includes(langParam ?? "") ? (langParam as Lang) : "ko";

  const primaryPercent = clampPercent(searchParams.get("primary"), 65);
  const secondaryRaw = searchParams.get("secondary");
  const secondaryPercent = type.secondaryAxis && secondaryRaw !== null ? clampPercent(secondaryRaw, 35) : null;

  const shareUrl = `${getSiteUrl()}/types/${type.code}`;

  return renderShareCard(type, { lang, primaryPercent, secondaryPercent, shareUrl });
}
