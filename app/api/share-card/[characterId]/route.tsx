import type { NextRequest } from "next/server";
import { getCharacterById } from "@/data/characters";
import { renderShareCard } from "@/lib/og-render";
import { getSiteUrl } from "@/lib/site";

const LANGS = ["ko", "en", "ja", "zh", "es"] as const;
type Lang = (typeof LANGS)[number];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  const { characterId } = await params;
  const character = getCharacterById(characterId);
  if (!character) {
    return new Response("Character not found", { status: 404 });
  }

  const searchParams = request.nextUrl.searchParams;
  const langParam = searchParams.get("lang");
  const lang: Lang = (LANGS as readonly string[]).includes(langParam ?? "") ? (langParam as Lang) : "ko";

  const scoreParam = Number(searchParams.get("score"));
  const matchScore = Number.isFinite(scoreParam) && scoreParam > 0 && scoreParam <= 100 ? scoreParam : 90;

  const shareUrl = `${getSiteUrl()}/result/${character.id}`;

  return renderShareCard(character, { lang, matchScore, shareUrl });
}
