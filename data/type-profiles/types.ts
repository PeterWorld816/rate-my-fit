// 유형별 상세 본문(한국어 원문) 구조. /types/[code] 페이지에 전체가 렌더링되고,
// 이름·강점·약점·한 장면 같은 요약 정보는 data/attachment-types.ts 에서 결과
// 카드와 함께 공유한다.
export type ConflictCase = {
  title: string;
  situation: string; // 상황
  reaction: string; // 이 유형의 반응
  partnerFeels: string; // 상대가 느끼는 감정
  better: string; // 더 나은 대처
};

export type ProfileMatch = { code: string; reason: string };

export type TypeProfile = {
  metaTitle: string;
  metaDescription: string; // 80~160자
  summary: string; // 한 줄 요약
  intro: string[]; // 이 유형 소개 문단
  innerSelf: { outside: string; inside: string; note: string };
  stages: { stage: "썸" | "연애 초반" | "안정기" | "권태기" | "이별"; points: string[] }[];
  texting: { overview: string; replySpeed: string; onReadIgnored: string; phrases: string[] };
  conflicts: ConflictCase[];
  sayings: string[]; // 자주 하는 말
  thoughts: string[]; // 속으로 하는 생각
  cautions: string[];
  tips: { self: string[]; partner: string[] };
  // best[0] / worst[0] 은 attachment-types.ts 의 bestMatch / worstMatch 와 같은 코드
  matches: { best: ProfileMatch[]; worst: ProfileMatch[] };
  growth: { intro: string; practices: { title: string; body: string }[] };
  faq: { q: string; a: string }[];
  relatedGuides: string[]; // data/guides.ts 의 slug
};
