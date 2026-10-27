import type { GuideArticle, GuideCategory } from "./types";
import attachmentTheory from "./attachment-theory";
import fourAttachmentStyles from "./four-attachment-styles";
import howToReadAttachmentTest from "./how-to-read-attachment-test";
import secureAttachmentInLove from "./secure-attachment-in-love";
import anxiousAttachmentInLove from "./anxious-attachment-in-love";
import avoidantAttachmentInLove from "./avoidant-attachment-in-love";
import fearfulAvoidantAttachment from "./fearful-avoidant-attachment";
import anxiousAvoidantTrap from "./anxious-avoidant-trap";
import textingAndAttachment from "./texting-and-attachment";
import demandWithdrawPattern from "./demand-withdraw-pattern";
import repairAfterConflict from "./repair-after-conflict";
import canAttachmentStyleChange from "./can-attachment-style-change";
import buildingEarnedSecurity from "./building-earned-security";
import breakupAndAttachment from "./breakup-and-attachment";

export type { GuideArticle, GuideCategory, GuideSection } from "./types";

// /guide 목록의 섹션 순서와 소개 문구
export const GUIDE_CATEGORIES: { key: GuideCategory; label: string; description: string }[] = [
  { key: "basics", label: "애착이론 기초", description: "애착이론이 무엇이고, 테스트 결과를 어떻게 읽으면 좋은지부터 시작해요." },
  { key: "types", label: "유형 깊이 알기", description: "안정형·불안형·회피형·혼란형이 연애에서 실제로 어떻게 움직이는지 살펴봐요." },
  { key: "communication", label: "연애 소통과 갈등", description: "연락, 다툼, 화해처럼 커플이 매일 부딪히는 장면을 애착의 눈으로 풀어 봐요." },
  { key: "growth", label: "성장과 회복", description: "애착 성향이 달라질 수 있는지, 이별 뒤와 일상에서 안정감을 키우는 방법을 다뤄요." },
];

// 카테고리 안에서는 이 배열 순서대로 노출된다.
export const GUIDES: GuideArticle[] = [
  attachmentTheory,
  fourAttachmentStyles,
  howToReadAttachmentTest,
  secureAttachmentInLove,
  anxiousAttachmentInLove,
  avoidantAttachmentInLove,
  fearfulAvoidantAttachment,
  anxiousAvoidantTrap,
  textingAndAttachment,
  demandWithdrawPattern,
  repairAfterConflict,
  canAttachmentStyleChange,
  buildingEarnedSecurity,
  breakupAndAttachment,
];

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getGuidesByCategory(category: GuideCategory): GuideArticle[] {
  return GUIDES.filter((g) => g.category === category);
}
