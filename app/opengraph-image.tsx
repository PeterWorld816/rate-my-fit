import { renderBrandImage, OG_SIZE } from "@/lib/og-render";

export const alt = "내 연애 유형 테스트 — 애착이론 기반 20개 질문, 16가지 유형";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderBrandImage();
}
