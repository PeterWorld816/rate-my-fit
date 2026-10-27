import { ATTACHMENT_TYPES } from "@/data/attachment-types";
import { OG_SIZE } from "@/lib/og-render";
import { renderTypeImage } from "@/lib/og-type";

export const alt = "내 연애 유형 테스트 — 유형 캐릭터";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return ATTACHMENT_TYPES.map((t) => ({ code: t.code }));
}

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return renderTypeImage(code);
}
