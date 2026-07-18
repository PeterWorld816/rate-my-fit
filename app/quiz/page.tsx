"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CHARACTERS, type Character } from "@/data/characters";

type Option = { label: string; tags?: string[]; worldVibe?: string };
type Question = { question: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    question: "소개팅에서 상대가 먼저 말을 걸었을 때, 당신은?",
    options: [
      { label: "부드럽게 웃으며 대화를 이어간다", tags: ["warm", "friendly", "gentle"] },
      { label: "짧고 시크하게 대답한다", tags: ["cold", "minimal", "composed"] },
      { label: "재치있는 농담으로 분위기를 주도한다", tags: ["charismatic", "bright", "charming"] },
      { label: "말없이 상대를 관찰한다", tags: ["mysterious", "calm", "focused"] },
    ],
  },
  {
    question: "친구가 힘든 일을 겪고 있을 때 당신은?",
    options: [
      { label: "말없이 옆에서 챙겨준다", tags: ["loyal", "soft", "gentle"] },
      { label: "바로 해결책을 제시한다", tags: ["sharp", "determined", "focused"] },
      { label: "분위기를 밝게 바꿔준다", tags: ["bright", "energetic", "warm"] },
      { label: "조용히 지켜보다 결정적일 때 나선다", tags: ["composed", "calm", "dominant"] },
    ],
  },
  {
    question: "나를 화나게 하는 사람이 있다면?",
    options: [
      { label: "화내지 않고 조용히 기억해둔다", tags: ["dark", "calculated", "composed"] },
      { label: "바로 맞서서 할 말은 한다", tags: ["intense", "dominant", "sharp"] },
      { label: "그냥 웃으며 넘어간다", tags: ["gentle", "warm", "calm"] },
      { label: "감정을 숨기지 않고 표현한다", tags: ["dramatic", "passionate", "energetic"] },
    ],
  },
  {
    question: "이상적인 주말은?",
    options: [
      { label: "집에서 혼자 정비하는 날", tags: ["minimal", "calm", "composed"] },
      { label: "새로운 걸 도전하는 날", tags: ["active", "energetic", "determined"] },
      { label: "사람들과 화려하게 노는 날", tags: ["glamorous", "colorful", "dramatic"] },
      { label: "조용한 카페에서 책 읽는 날", tags: ["gentle", "natural", "light"] },
    ],
  },
  {
    question: "당신의 옷장 스타일은?",
    options: [
      { label: "올 블랙, 미니멀", tags: ["dark", "sharp", "minimal"] },
      { label: "파스텔톤의 부드러운 옷", tags: ["soft", "gentle", "light"] },
      { label: "포인트 있는 화려한 룩", tags: ["wealthy", "glamorous", "refined"] },
      { label: "편안한 캐주얼", tags: ["natural", "warm", "friendly"] },
    ],
  },
  {
    question: "조직(회사·학교)에서 당신의 포지션은?",
    options: [
      { label: "있는 듯 없는 듯 조용히 일 잘함", tags: ["composed", "focused", "minimal"] },
      { label: "눈에 띄는 리더", tags: ["dominant", "charismatic", "determined"] },
      { label: "분위기 메이커", tags: ["energetic", "bright", "charming"] },
      { label: "무슨 생각 하는지 모르겠는 사람", tags: ["mysterious", "dark", "intense"] },
    ],
  },
  {
    question: "좋아하는 사람이 생기면 당신은?",
    options: [
      { label: "티 안 내고 몰래 챙긴다", tags: ["gentle", "loyal", "composed"] },
      { label: "직진한다", tags: ["passionate", "determined", "active"] },
      { label: "오히려 퉁명스럽게 군다", tags: ["cold", "charming", "dramatic"] },
      { label: "계획적으로 조금씩 다가간다", tags: ["calculated", "refined", "focused"] },
    ],
  },
  {
    question: "당신의 인생이 드라마라면, 장르는?",
    options: [
      { label: "재벌가 로맨스", worldVibe: "elite world" },
      { label: "시원한 복수극", worldVibe: "revenge arc" },
      { label: "잔잔한 힐링 일상물", worldVibe: "slice of life" },
      { label: "풋풋한 캠퍼스 성장물", worldVibe: "coming-of-age" },
    ],
  },
];

function pickCharacter(answers: Option[]): Character {
  const tagCounts: Record<string, number> = {};
  let worldVibe = "";
  for (const a of answers) {
    a.tags?.forEach((t) => { tagCounts[t] = (tagCounts[t] ?? 0) + 1; });
    if (a.worldVibe) worldVibe = a.worldVibe;
  }

  let best = CHARACTERS[0];
  let bestScore = -1;
  for (const c of CHARACTERS) {
    let score = 0;
    for (const tag of c.tags) score += tagCounts[tag] ?? 0;
    if (worldVibe && c.worldVibes.includes(worldVibe)) score += 3;
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}

function buildShareText(lang: "ko" | "en" | "ja" | "zh" | "es", name: string) {
  switch (lang) {
    case "ko": return `나 ${name} 나왔어! 너는 어떤 역할이 나올까?`;
    case "ja": return `私は${name}になりました！あなたは？`;
    case "zh": return `我得到了${name}！你呢？`;
    case "es": return `¡Salí ${name}! ¿Y tú?`;
    default: return `I got ${name}! What's your K-Drama role?`;
  }
}

function buildResult(character: Character) {
  const langs = ["ko", "en", "ja", "zh", "es"] as const;
  const result: Record<string, unknown> = {
    characterId: character.id,
    imageFile: character.imageFile,
    celebs: character.celebs,
    matchScore: Math.floor(Math.random() * 15 + 82),
    charisma: Math.floor(Math.random() * 15 + 72),
    dramaPotential: Math.floor(Math.random() * 15 + 74),
    analysisMethod: "quiz",
  };
  for (const lang of langs) {
    result[lang] = { ...character[lang], shareText: buildShareText(lang, character[lang].name) };
  }
  return result;
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
      const character = pickCharacter(next);
      const result = buildResult(character);
      localStorage.setItem("ratingResult", JSON.stringify(result));
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
            <div style={styles.labelPill}>🎬 K-Drama Role Test</div>
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
