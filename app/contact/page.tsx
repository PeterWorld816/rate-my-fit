import type { Metadata } from "next";
import Link from "next/link";
import ProsePage from "@/components/ProsePage";
import { CONTACT_EMAIL, SITE_NAME, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "문의하기",
  description: `${SITE_NAME}에 대한 문의, 오류 제보, 제휴 제안은 이메일로 보내주세요.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <ProsePage
      title="문의하기"
      lead="테스트나 콘텐츠에 대한 의견, 오류 제보, 제휴 제안이 있다면 언제든 이메일로 연락해 주세요."
    >
      <h2>이메일</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`} style={{ fontSize: 17, fontWeight: 700 }}>
          {CONTACT_EMAIL}
        </a>
      </p>
      <p>개인이 운영하는 사이트라 답장까지 며칠 걸릴 수 있어요. 보내주신 내용은 모두 꼼꼼히 읽고 있어요.</p>

      <h2>이런 내용을 보내주시면 좋아요</h2>
      <ul>
        <li>질문 문항이나 유형 설명에서 어색하거나 틀린 부분</li>
        <li>페이지가 깨지거나 공유·이미지 저장이 동작하지 않는 문제 (사용 중인 기기와 브라우저를 함께 적어주세요)</li>
        <li>번역이 어색한 부분</li>
        <li>콘텐츠 제휴나 그 밖의 제안</li>
      </ul>

      <h2>안내</h2>
      <p>
        이 사이트는 전문 상담 서비스가 아니어서 개인적인 연애 고민 상담이나 심리 진단은 해드리기 어려워요. 마음이 많이
        힘들다면 정신건강의학과나 상담 전문가의 도움을 받아보세요.
      </p>
      <p>
        개인정보 처리에 관한 내용은 <Link href="/privacy">개인정보처리방침</Link>을 참고해 주세요.
      </p>
    </ProsePage>
  );
}
