import type { Metadata } from "next";
import type { Lang } from "@/data/attachment-types";

// Production origin. Hard-coded on purpose: every absolute URL the site emits
// (og:url, og:image, canonical, sitemap, share links) must point here, never
// at whatever host the build or the browser happens to be running on.
export const SITE_URL = "https://howyoulove.netlify.app";
export const SITE_NAME = "내 연애 유형 테스트";

// 홈(/) 기본 메타. 루트 layout(사이트 기본값)과 app/page.tsx(홈 자체)가 함께 쓴다.
export const HOME_TITLE = "내 연애 유형 테스트 | 애착유형 검사";
export const HOME_DESCRIPTION =
  "애착이론 기반 20개 질문으로 알아보는 나의 연애 유형. 안정형·불안형·회피형·혼란형, 16가지 유형 중 나는 뭘까?";

// Brand name per UI language, for client-side document.title swaps.
export const SITE_NAME_I18N: Record<Lang, string> = {
  ko: SITE_NAME,
  en: "My Attachment Style Test",
  ja: "恋愛タイプ診断",
  zh: "恋爱类型测试",
  es: "Test de Estilo de Apego",
};

export const ADSENSE_CLIENT = "ca-pub-7379794980536826";

// 문의 이메일 (/contact, /privacy, /terms 에서 사용)
export const CONTACT_EMAIL = "rmfrmfyoutube@gmail.com";

// Per-page metadata with a clean canonical path. openGraph/twitter are set in
// full here because a child segment's openGraph object replaces the parent's
// rather than merging, so og:url would otherwise keep pointing at the home page.
export function pageMetadata({
  title,
  description,
  path,
  images,
}: {
  title: string;
  description: string;
  path: string;
  images?: string[];
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "ko_KR",
      // Falls back to the site-wide brand card (app/opengraph-image.tsx). A
      // segment with its own opengraph-image file still overrides this.
      images: images ?? ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images ?? ["/twitter-image"],
    },
  };
}
