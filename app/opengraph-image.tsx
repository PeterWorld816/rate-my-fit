import { renderBrandImage, OG_SIZE } from "@/lib/og-render";

export const alt = "K-Drama 역할 테스트";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderBrandImage();
}
