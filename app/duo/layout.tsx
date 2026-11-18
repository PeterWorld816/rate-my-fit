import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

// Invite / result screens are built from per-visitor query strings —
// nothing indexable here, so keep them out of search results.
export const metadata: Metadata = {
  ...pageMetadata({
    title: "연애 궁합 검사",
    description: "애착이론 기반 연애 유형으로 보는 두 사람의 궁합",
    path: "/duo",
  }),
  robots: { index: false, follow: true },
};

export default function DuoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
