import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ATTACHMENT_TYPES, getAttachmentTypeByCode } from "@/data/attachment-types";
import TypeDetailContent from "./TypeDetailContent";

type Params = { code: string };

export function generateStaticParams() {
  return ATTACHMENT_TYPES.map((t) => ({ code: t.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { code } = await params;
  const type = getAttachmentTypeByCode(decodeURIComponent(code));
  if (!type) return { title: "유형을 찾을 수 없어요" };

  const { name, catchphrase } = type.ko;
  const title = `${type.code} · ${name}`;
  const description = `${catchphrase} — 애착이론 기반 연애 유형 테스트에서 ${name}(${type.code}) 유형에 대해 알아보세요.`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Server component (for generateStaticParams/generateMetadata SEO needs) that
// hands off actual rendering to a client component — the type detail page
// needs to read the site's language preference from localStorage, which
// isn't available server-side.
export default async function TypeDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { code } = await params;
  const type = getAttachmentTypeByCode(decodeURIComponent(code));
  if (!type) notFound();

  return <TypeDetailContent type={type} />;
}
