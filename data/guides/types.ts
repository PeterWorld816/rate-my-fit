// /guide 아티클 원문(한국어) 구조. 글 하나가 data/guides/<slug>.ts 파일 하나다.
export type GuideCategory = "basics" | "types" | "communication" | "growth";

export type GuideSection = { heading: string; paragraphs: string[] };

export type GuideArticle = {
  slug: string;
  category: GuideCategory;
  title: string;
  description: string; // 메타 설명용 1~2문장 (80~140자)
  publishedAt: string; // 작성일 (YYYY-MM-DD)
  updatedAt: string; // 수정일 (YYYY-MM-DD) — sitemap lastmod에도 사용
  sections: GuideSection[];
  // 실제로 출간된 연구·도서만, APA 형식 문자열로
  references: string[];
};
