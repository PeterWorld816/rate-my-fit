// Fetches only the glyphs actually used, so Korean OG image text renders
// correctly (Satori's default font has no Hangul coverage).
export async function loadNotoSansKR(text: string, weight: 400 | 700 = 700) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(cssUrl).then((r) => r.text());
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error("Could not find Noto Sans KR font source");
  const fontRes = await fetch(match[1]);
  return fontRes.arrayBuffer();
}
