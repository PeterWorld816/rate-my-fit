import { access } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CHARACTERS, getCharacterById } from "@/data/characters";

type Params = { characterId: string };

export function generateStaticParams() {
  return CHARACTERS.map((c) => ({ characterId: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { characterId } = await params;
  const character = getCharacterById(characterId);
  if (!character) return { title: "역할을 찾을 수 없어요" };

  const title = character.ko.name;
  const description = character.ko.summary;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

async function portraitExists(imageFile: string) {
  try {
    await access(join(process.cwd(), "public", "characters", imageFile));
    return true;
  } catch {
    return false;
  }
}

export default async function ResultPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { characterId } = await params;
  const character = getCharacterById(characterId);
  if (!character) notFound();

  const hasPortrait = await portraitExists(character.imageFile);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#fff",
        fontFamily: "'Pretendard', 'Apple SD Gothic Neo', system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px 48px" }}>
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999,
            color: "rgba(255,255,255,0.7)",
            padding: "7px 16px",
            fontSize: 13,
            textDecoration: "none",
            marginBottom: 20,
          }}
        >
          ← 홈
        </Link>

        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "3/4",
            borderRadius: 24,
            overflow: "hidden",
            background: "linear-gradient(180deg, #1a0a2e 0%, #0a0a0f 100%)",
          }}
        >
          {hasPortrait ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/characters/${character.imageFile}`}
              alt={character.ko.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100 }}>
              {character.ko.name.split(" ")[0]}
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,0.5) 40%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 20px" }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(124,58,237,0.3)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(167,139,250,0.3)",
                borderRadius: 999,
                padding: "4px 14px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#c4b5fd",
                marginBottom: 8,
              }}
            >
              🎬 K-Drama Role Test
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, lineHeight: 1.15, letterSpacing: "-0.5px", textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
              {character.ko.name}
            </h1>
          </div>
        </div>

        {character.ko.quote && (
          <div style={{ margin: "20px 0 0", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 16, padding: "14px 18px" }}>
            <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6, margin: 0, fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>
              &quot;{character.ko.quote}&quot;
            </p>
          </div>
        )}

        <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", margin: "16px 0 0" }}>{character.ko.summary}</p>

        {character.ko.traits.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "14px 0 0" }}>
            {character.ko.traits.map((t) => (
              <span key={t} style={{ fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 999, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#c4b5fd" }}>
                {t}
              </span>
            ))}
          </div>
        )}

        <Link
          href="/quiz"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: 28,
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            border: "none",
            borderRadius: 999,
            color: "#fff",
            fontSize: 16,
            fontWeight: 800,
            padding: "16px",
            textDecoration: "none",
            boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
          }}
        >
          나도 내 역할 찾으러 가기 ✨
        </Link>

        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: "16px 0 0", letterSpacing: "1px" }}>
          K-Drama 역할 테스트
        </p>
      </div>
    </main>
  );
}
