import type { Metadata } from "next";

// Production origin. Hard-coded on purpose: every absolute URL the site emits
// (og:url, og:image, canonical, sitemap, share links) must point here, never
// at whatever host the build or the browser happens to be running on.
export const SITE_URL = "https://howyoulove.netlify.app";
export const SITE_NAME = "내 연애 유형 테스트";

export const ADSENSE_CLIENT = "ca-pub-7379794980536826";

// TODO: 실제 문의 받을 이메일 주소로 바꿔주세요. (/contact, /privacy 에서 사용)
export const CONTACT_EMAIL = "howyoulove@example.com";

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
