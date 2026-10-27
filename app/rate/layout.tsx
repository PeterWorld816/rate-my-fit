import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

// Personal result screen (reads the visitor's own result from localStorage) —
// nothing indexable here, so keep it out of search results.
export const metadata: Metadata = {
  ...pageMetadata({
    title: "내 테스트 결과",
    description: "애착이론 기반 연애 유형 테스트 결과",
    path: "/rate",
  }),
  robots: { index: false, follow: true },
};

export default function RateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
