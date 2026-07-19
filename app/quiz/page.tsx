"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type AttachmentAxis = "secure" | "anxious" | "avoidant" | "disorganized";

type Option = { label: string; axis: AttachmentAxis };
type Question = { question: string; options: Option[] };

const AXIS_CODE: Record<AttachmentAxis, string> = {
  secure: "S",
  anxious: "A",
  avoidant: "V",
  disorganized: "D",
};

// Questions 1-12 keep their original K-Drama-era wording (the scenarios read
// fine for a relationship quiz too) but every option is remapped to one of
// the 4 attachment axes below — the old personality tags (warm/cold/etc.)
// don't feed into attachment scoring, so they were dropped. Questions 13-20
// are new.
const QUESTIONS: Question[] = [
  {
    question: "소개팅에서 상대가 먼저 말을 걸었을 때, 당신은?",
    options: [
      { label: "부드럽게 웃으며 대화를 이어간다", axis: "secure" },
      { label: "짧고 시크하게 대답한다", axis: "avoidant" },
      { label: "재치있는 농담으로 분위기를 주도한다", axis: "anxious" },
      { label: "말없이 상대를 관찰한다", axis: "disorganized" },
    ],
  },
  {
    question: "친구가 힘든 일을 겪고 있을 때 당신은?",
    options: [
      { label: "말없이 옆에서 챙겨준다", axis: "secure" },
      { label: "바로 해결책을 제시한다", axis: "avoidant" },
      { label: "분위기를 밝게 바꿔준다", axis: "anxious" },
      { label: "조용히 지켜보다 결정적일 때 나선다", axis: "disorganized" },
    ],
  },
  {
    question: "나를 화나게 하는 사람이 있다면?",
    options: [
      { label: "화내지 않고 조용히 기억해둔다", axis: "avoidant" },
      { label: "바로 맞서서 할 말은 한다", axis: "secure" },
      { label: "그냥 웃으며 넘어간다", axis: "disorganized" },
      { label: "감정을 숨기지 않고 표현한다", axis: "anxious" },
    ],
  },
  {
    question: "이상적인 주말은?",
    options: [
      { label: "집에서 혼자 정비하는 날", axis: "avoidant" },
      { label: "새로운 걸 도전하는 날", axis: "disorganized" },
      { label: "사람들과 화려하게 노는 날", axis: "anxious" },
      { label: "조용한 카페에서 책 읽는 날", axis: "secure" },
    ],
  },
  {
    question: "당신의 옷장 스타일은?",
    options: [
      { label: "올 블랙, 미니멀", axis: "avoidant" },
      { label: "파스텔톤의 부드러운 옷", axis: "secure" },
      { label: "포인트 있는 화려한 룩", axis: "anxious" },
      { label: "편안한 캐주얼", axis: "disorganized" },
    ],
  },
  {
    question: "조직(회사·학교)에서 당신의 포지션은?",
    options: [
      { label: "있는 듯 없는 듯 조용히 일 잘함", axis: "avoidant" },
      { label: "눈에 띄는 리더", axis: "secure" },
      { label: "분위기 메이커", axis: "anxious" },
      { label: "무슨 생각 하는지 모르겠는 사람", axis: "disorganized" },
    ],
  },
  {
    question: "좋아하는 사람이 생기면 당신은?",
    options: [
      { label: "티 안 내고 몰래 챙긴다", axis: "avoidant" },
      { label: "직진한다", axis: "secure" },
      { label: "오히려 퉁명스럽게 군다", axis: "disorganized" },
      { label: "계획적으로 조금씩 다가간다", axis: "anxious" },
    ],
  },
  {
    question: "당신의 인생이 드라마라면, 장르는?",
    options: [
      { label: "재벌가 로맨스", axis: "anxious" },
      { label: "시원한 복수극", axis: "avoidant" },
      { label: "잔잔한 힐링 일상물", axis: "secure" },
      { label: "풋풋한 캠퍼스 성장물", axis: "disorganized" },
    ],
  },
  {
    question: "애인이 갑자기 연락이 뜸해지면?",
    options: [
      { label: "무슨 일 있나 계속 확인하고 싶음", axis: "anxious" },
      { label: "그러려니 하고 기다림", axis: "secure" },
      { label: "오히려 나도 편함", axis: "avoidant" },
      { label: "신경 쓰이는데 티 안 내다가 폭발함", axis: "disorganized" },
    ],
  },
  {
    question: "새로 만난 사람이 급속도로 애정표현을 하면?",
    options: [
      { label: "좋으면서도 진심인지 계속 의심함", axis: "anxious" },
      { label: "자연스럽게 받아들임", axis: "secure" },
      { label: "부담스러워서 거리 둠", axis: "avoidant" },
      { label: "확 끌렸다가 무서워서 밀어냄", axis: "disorganized" },
    ],
  },
  {
    question: "이별 후 새로운 사람 만나기까지 걸리는 시간은?",
    options: [
      { label: "오래 걸림, 계속 전 연애 생각남", axis: "anxious" },
      { label: "슬퍼도 적당히 정리되면", axis: "secure" },
      { label: "빨리 넘어감", axis: "avoidant" },
      { label: "빨리 만나는데 자꾸 비교하게 됨", axis: "disorganized" },
    ],
  },
  {
    question: "애인이 이성 친구와 친하게 지내는 걸 보면?",
    options: [
      { label: "계속 신경 쓰이고 물어보고 싶음", axis: "anxious" },
      { label: "믿고 넘어감", axis: "secure" },
      { label: "딱히 신경 안 씀", axis: "avoidant" },
      { label: "겉으론 쿨한 척, 속으론 복잡함", axis: "disorganized" },
    ],
  },
  {
    question: "애인에게 서운한 게 생기면 표현하는 방식은?",
    options: [
      { label: "바로 티 내고 확인받고 싶어함", axis: "anxious" },
      { label: "차분히 대화로 풀려고 함", axis: "secure" },
      { label: "그냥 넘기거나 혼자 삭힘", axis: "avoidant" },
      { label: "참다가 갑자기 크게 터트림", axis: "disorganized" },
    ],
  },
  {
    question: "연애할 때 상대에게 가장 바라는 것은?",
    options: [
      { label: "끊임없는 확인과 애정표현", axis: "anxious" },
      { label: "신뢰와 안정적인 소통", axis: "secure" },
      { label: "각자의 공간과 자유", axis: "avoidant" },
      { label: "그때그때 다름, 나도 잘 모름", axis: "disorganized" },
    ],
  },
  {
    question: "\"우리 앞으로 어떻게 할까\" 미래 얘기가 나오면?",
    options: [
      { label: "설레면서도 불안한 확인을 계속함", axis: "anxious" },
      { label: "편하게 같이 계획함", axis: "secure" },
      { label: "부담스러워서 화제 돌림", axis: "avoidant" },
      { label: "하고 싶은데 갑자기 겁이 남", axis: "disorganized" },
    ],
  },
  {
    question: "애인이 \"사랑해\"라고 자주 말해주길 바라는가?",
    options: [
      { label: "그렇다, 자주 들어야 안심됨", axis: "anxious" },
      { label: "가끔이어도 진심이면 충분함", axis: "secure" },
      { label: "말보다 행동으로 보여주는 게 편함", axis: "avoidant" },
      { label: "듣고 싶은데 막상 들으면 어색함", axis: "disorganized" },
    ],
  },
  // Original brief only supplied 8 old + 8 new = 16; these 4 fill out the
  // stated 20-question total in the same scenario/axis-order style as 9-16.
  {
    question: "데이트 약속을 잡을 때 당신은?",
    options: [
      { label: "자꾸 확인 문자를 보내게 됨", axis: "anxious" },
      { label: "편하게 정하고 기다림", axis: "secure" },
      { label: "너무 빡빡한 계획은 부담스러움", axis: "avoidant" },
      { label: "정했다가 갑자기 취소하고 싶어짐", axis: "disorganized" },
    ],
  },
  {
    question: "애인과 싸운 후 화해하는 방식은?",
    options: [
      { label: "빨리 풀고 싶어서 계속 먼저 연락함", axis: "anxious" },
      { label: "시간을 갖고 차분히 대화로 푼다", axis: "secure" },
      { label: "먼저 연락하기보다 기다리는 편", axis: "avoidant" },
      { label: "화해하고 싶다가도 자존심에 더 멀어짐", axis: "disorganized" },
    ],
  },
  {
    question: "연애 초반, 상대의 마음을 확신하기까지?",
    options: [
      { label: "계속 신호를 확인해야 안심됨", axis: "anxious" },
      { label: "자연스럽게 시간이 지나면 믿게 됨", axis: "secure" },
      { label: "확신 없어도 크게 신경 안 씀", axis: "avoidant" },
      { label: "확신했다가도 다시 의심이 스멀스멀", axis: "disorganized" },
    ],
  },
  {
    question: "애인이 없을 때 당신의 상태는?",
    options: [
      { label: "외로움을 많이 느끼고 빨리 채우고 싶음", axis: "anxious" },
      { label: "혼자여도 나름 만족하며 지냄", axis: "secure" },
      { label: "오히려 자유롭고 편함", axis: "avoidant" },
      { label: "외롭다가도 막상 생기면 부담스러워함", axis: "disorganized" },
    ],
  },
];

export type AttachmentResult = {
  code: string;
  primaryType: AttachmentAxis;
  secondaryType: AttachmentAxis | null;
  primaryPercent: number;
  secondaryPercent: number | null;
};

const PURE_GAP_RATIO = 0.2;

function scoreAnswers(answers: Option[]): AttachmentResult {
  const counts: Record<AttachmentAxis, number> = { secure: 0, anxious: 0, avoidant: 0, disorganized: 0 };
  for (const a of answers) counts[a.axis]++;

  const total = answers.length;
  const ranked = (Object.entries(counts) as [AttachmentAxis, number][]).sort((a, b) => b[1] - a[1]);
  const [primaryAxis, primaryCount] = ranked[0];
  const [secondaryAxis, secondaryCount] = ranked[1];

  const isPure = (primaryCount - secondaryCount) / total >= PURE_GAP_RATIO;
  const primaryPercent = Math.round((primaryCount / total) * 100);
  const secondaryPercent = Math.round((secondaryCount / total) * 100);

  return {
    code: isPure ? AXIS_CODE[primaryAxis] : `${AXIS_CODE[primaryAxis]}+${AXIS_CODE[secondaryAxis]}`,
    primaryType: primaryAxis,
    secondaryType: isPure ? null : secondaryAxis,
    primaryPercent,
    secondaryPercent: isPure ? null : secondaryPercent,
  };
}

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [selected, setSelected] = useState<string | null>(null);

  const total = QUESTIONS.length;
  const question = QUESTIONS[step];

  const selectOption = (option: Option) => {
    if (selected) return;
    setSelected(option.label);
    setTimeout(() => {
      const next = [...answers, option];
      if (step + 1 < total) {
        setAnswers(next);
        setDirection("forward");
        setStep(step + 1);
        setSelected(null);
        return;
      }
      const result = scoreAnswers(next);
      localStorage.setItem("attachmentResult", JSON.stringify(result));
      router.push("/rate");
    }, 260);
  };

  const goBack = () => {
    if (step === 0) {
      router.push("/");
      return;
    }
    setSelected(null);
    setAnswers(answers.slice(0, -1));
    setDirection("back");
    setStep(step - 1);
  };

  return (
    <main style={styles.root}>
      <div style={{ ...styles.glow, top: -100, left: -60, background: "rgba(124,58,237,0.18)" }} />
      <div style={{ ...styles.glow, bottom: -80, right: -40, background: "rgba(236,72,153,0.14)" }} />

      <div style={styles.container}>
        <button className="tap-btn" style={styles.backBtn} onClick={goBack}>← {step === 0 ? "Home" : "이전"}</button>

        <div style={styles.progressWrap}>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${((step + 1) / total) * 100}%` }} />
          </div>
          <p style={styles.progressLabel}>{step + 1} / {total}</p>
        </div>

        <div key={step} className={direction === "forward" ? "quiz-step-forward" : "quiz-step-back"} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={styles.header}>
            <div style={styles.labelPill}>💕 애착유형 테스트</div>
            <h1 style={styles.question}>{question.question}</h1>
          </div>

          <div style={styles.optionsWrap}>
            {question.options.map((opt) => (
              <button
                key={opt.label}
                className="tap-btn"
                style={{
                  ...styles.optionBtn,
                  ...(selected === opt.label ? styles.optionBtnSelected : null),
                  opacity: selected && selected !== opt.label ? 0.4 : 1,
                }}
                onClick={() => selectOption(opt)}
                disabled={!!selected}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#08080f",
    color: "#fff",
    fontFamily: "var(--font-sans)",
    padding: "40px 16px 80px",
    position: "relative",
    overflowX: "hidden",
  },
  glow: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    filter: "blur(100px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: 480,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  backBtn: {
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 999,
    color: "rgba(255,255,255,0.6)",
    padding: "8px 18px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  progressWrap: { display: "flex", flexDirection: "column", gap: 8 },
  progressTrack: { height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg,#7c3aed,#ec4899)", borderRadius: 3, transition: "width 0.3s ease" },
  progressLabel: { fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0, textAlign: "right" },
  header: { display: "flex", flexDirection: "column", gap: 12 },
  labelPill: {
    alignSelf: "flex-start",
    background: "rgba(124,58,237,0.15)",
    border: "1px solid rgba(124,58,237,0.3)",
    borderRadius: 999,
    color: "#a78bfa",
    fontSize: 12,
    letterSpacing: "1.5px",
    padding: "6px 16px",
    textTransform: "uppercase",
  },
  question: { fontSize: 26, fontWeight: 800, lineHeight: 1.35, letterSpacing: "-0.8px", margin: 0 },
  optionsWrap: { display: "flex", flexDirection: "column", gap: 12 },
  optionBtn: {
    textAlign: "left",
    background: "#0f0f1a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontWeight: 500,
    padding: "18px 20px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "border-color 0.15s, background 0.15s, opacity 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease",
  },
  optionBtnSelected: {
    background: "rgba(124,58,237,0.22)",
    borderColor: "#a78bfa",
    color: "#fff",
    transform: "scale(1.02)",
    boxShadow: "0 0 0 2px rgba(167,139,250,0.5), 0 8px 24px rgba(124,58,237,0.35)",
  },
};
