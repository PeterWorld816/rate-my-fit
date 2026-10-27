import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "테스트 시작",
  description: "20개 질문에 답하고 16가지 연애 유형 중 나의 애착유형을 알아보세요. 응답은 브라우저에서만 처리돼요.",
  path: "/quiz",
});

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
