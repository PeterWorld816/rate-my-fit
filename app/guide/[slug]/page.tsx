import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProsePage from "@/components/ProsePage";
import { GUIDES, GUIDE_CATEGORIES, getGuideBySlug } from "@/data/guides";
import { pageMetadata } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "글을 찾을 수 없어요" };
  return pageMetadata({ title: guide.title, description: guide.description, path: `/guide/${guide.slug}` });
}

export default async function GuideArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  // 같은 카테고리 글을 먼저, 나머지는 뒤에 붙여 최대 5개만 보여 준다.
  const others = [
    ...GUIDES.filter((g) => g.slug !== guide.slug && g.category === guide.category),
    ...GUIDES.filter((g) => g.category !== guide.category),
  ].slice(0, 5);
  const category = GUIDE_CATEGORIES.find((c) => c.key === guide.category);

  return (
    <ProsePage title={guide.title} lead={guide.description} backHref="/guide" backLabel="← 가이드 목록">
      {category && (
        <p style={{ fontSize: 13, color: "rgba(24,24,27,0.55)" }}>
          <Link href={`/guide#${category.key}`}>{category.label}</Link> · {guide.updatedAt} 업데이트
        </p>
      )}
      {guide.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      ))}

      {guide.references.length > 0 && (
        <section>
          <h2>참고문헌</h2>
          <ul style={{ fontSize: 13.5 }}>
            {guide.references.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      <Link
        href="/quiz"
        className="tap-btn"
        style={{
          display: "block", textAlign: "center", margin: "32px 0 0", background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          borderRadius: 999, color: "#fff", fontSize: 16, fontWeight: 800, padding: "15px", textDecoration: "none",
          boxShadow: "0 8px 24px rgba(124,58,237,0.28)",
        }}
      >
        내 연애 유형 테스트 해보기 ✨
      </Link>

      <h2>함께 읽어보면 좋은 글</h2>
      <ul>
        {others.map((g) => (
          <li key={g.slug}>
            <Link href={`/guide/${g.slug}`}>{g.title}</Link>
          </li>
        ))}
      </ul>
    </ProsePage>
  );
}
