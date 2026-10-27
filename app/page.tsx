import type { Metadata } from "next";
import { GUIDE_CATEGORIES, getGuidesByCategory } from "@/data/guides";
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata } from "@/lib/site";
import HomeContent, { type HomeGuideLink } from "./HomeContent";

// 홈은 클라이언트 컴포넌트라 metadata를 직접 export할 수 없어서 서버 page로 감싼다.
// page 레벨에 openGraph/twitter images가 없으면 같은 세그먼트의 app/opengraph-image.tsx
// 파일 규칙 이미지가 대신 붙는데, Next는 그 URL을 dev에서 metadataBase를 무시하고
// localhost로 만든다. 여기서 images를 명시해 항상 SITE_URL 기준으로 나가게 한다.
export const metadata: Metadata = {
  ...pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" }),
  title: { absolute: HOME_TITLE },
};

// 카테고리마다 첫 글 하나씩만 홈에 노출한다.
const FEATURED_GUIDES: HomeGuideLink[] = GUIDE_CATEGORIES.flatMap((c) =>
  getGuidesByCategory(c.key)
    .slice(0, 1)
    .map((g) => ({ slug: g.slug, title: g.title })),
);

export default function HomePage() {
  return <HomeContent guides={FEATURED_GUIDES} />;
}
