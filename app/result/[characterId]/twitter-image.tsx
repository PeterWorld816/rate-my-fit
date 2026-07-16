import { getCharacterById } from "@/data/characters";
import { renderBrandImage, renderCharacterImage, OG_SIZE } from "@/lib/og-render";

export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;
  const character = getCharacterById(characterId);
  if (!character) return renderBrandImage();
  return renderCharacterImage(character);
}
