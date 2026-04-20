require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

let images = [];

if (!process.env.HF_API_KEY) {
  console.warn("HF_API_KEY is missing. Add it to server/.env");
}

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_API_KEY,
});

const CHARACTER_POOL = [


  
  {
    id: "berserker-final-form",
    name: "💀 궁극체 폭주형",
    summary: "평소엔 평범해 보여도, 한 번 각 잡히면 통제 불가 상태로 진화하는 타입.",
    traits: ["폭주 모드 ON", "최종진화 직전", "보스급 존재감"],
    vibeHint: "후반부에 판 뒤집는 최종진화 캐릭터 감성",
    worldVibes: ["digital evolution saga", "chaos trickster tournament"],
    tags: ["dark", "edgy", "intense", "chaotic", "bold", "dramatic"],
  },
  {
    id: "lonely-legend",
    name: "🦅 고독한 최강자형",
    summary: "굳이 나서지 않아도 이미 분위기를 지배하고 있는 캐릭터.",
    traits: ["혼자서 다 함", "말보다 포스", "은근 팬 많음"],
    vibeHint: "혼자 다니는데도 최강 포지션인 전설체 감성",
    worldVibes: ["legendary beast chronicle", "ninja rival arc"],
    tags: ["clean", "sharp", "cool", "confident", "heroic", "minimal"],
  },
  {
    id: "social-star",
    name: "😎 인기 인싸형",
    summary: "등장만 해도 분위기 살아나는, 주인공 옆 필수 캐릭터.",
    traits: ["파티 중심", "스타성 있음", "사진빨 잘 받음"],
    vibeHint: "초반부터 인기 많은 파트너 캐릭터 느낌",
    worldVibes: ["pirate crew journey", "monster partner adventure"],
    tags: ["playful", "bright", "trendy", "colorful", "friendly", "sporty"],
  },
  {
    id: "cold-rival",
    name: "🧊 냉정한 라이벌형",
    summary: "처음엔 차가운데, 끝까지 보면 제일 매력적인 라이벌 타입.",
    traits: ["말수 적음", "실력으로 증명", "후반부 떡상"],
    vibeHint: "주인공보다 더 인기 많아지는 라이벌 감성",
    worldVibes: ["ninja rival arc", "mecha rival academy"],
    tags: ["cool", "serious", "mysterious", "minimal", "dark", "composed"],
  },
  {
    id: "dark-villain",
    name: "🐺 다크 빌런형",
    summary: "위험한데 계속 보게 되는, 매력 있는 악역 느낌.",
    traits: ["어둠의 기운", "강렬한 인상", "주인공보다 인기 많을 수도"],
    vibeHint: "타락형 진화 루트 타는 빌런 감성",
    worldVibes: ["digital evolution saga", "chaos trickster tournament"],
    tags: ["dark", "chaotic", "edgy", "dramatic", "intense", "bold"],
  },
  {
    id: "guardian-legend",
    name: "🐲 전설의 수호자형",
    summary: "쉽게 안 움직이지만, 한 번 나서면 판을 뒤집는 존재.",
    traits: ["묵직한 포스", "신뢰감", "최종 카드 느낌"],
    vibeHint: "결정적 순간에 등장하는 수호신 타입",
    worldVibes: ["legendary beast chronicle", "spirit guardian fantasy"],
    tags: ["heroic", "majestic", "balanced", "clean", "powerful", "calm"],
  },
  {
    id: "growth-rookie",
    name: "🌱 초반 약캐 성장형",
    summary: "지금은 평범하지만, 나중에 미친 듯이 진화할 가능성 있는 타입.",
    traits: ["숨겨진 잠재력", "성장형 캐릭터", "반전 있음"],
    vibeHint: "초기엔 약해 보여도 나중에 미친 듯이 성장하는 감성",
    worldVibes: ["digital evolution saga", "hero training arc"],
    tags: ["soft", "hopeful", "cute", "natural", "simple", "friendly"],
  },
  {
    id: "healing-mascot",
    name: "🐰 힐링 마스코트형",
    summary: "존재 자체로 분위기를 편하게 만드는 귀여운 캐릭터.",
    traits: ["무해함", "귀여움", "팀 분위기 담당"],
    vibeHint: "주인공 옆에서 계속 응원해주는 파트너 감성",
    worldVibes: ["monster partner adventure", "healing slice fantasy"],
    tags: ["cute", "soft", "pastel", "light", "friendly", "playful"],
  },
  {
    id: "strategist-brain",
    name: "🧠 천재 전략가형",
    summary: "힘보다 머리로 싸우는 타입. 생각보다 훨씬 위험함.",
    traits: ["계산 빠름", "계획형", "뒤에서 다 설계함"],
    vibeHint: "전투력보다 전술로 이기는 브레인형 감성",
    worldVibes: ["ninja rival arc", "mecha rival academy"],
    tags: ["smart", "focused", "clean", "composed", "minimal", "sharp"],
  },
  {
    id: "trickster",
    name: "🐍 수상한 트릭스터형",
    summary: "뭘 할지 몰라서 더 무서운, 예측불가 캐릭터.",
    traits: ["변수 덩어리", "장난기 있음", "상황 뒤집기 전문가"],
    vibeHint: "적인지 아군인지 끝까지 헷갈리는 교란형 감성",
    worldVibes: ["chaos trickster tournament", "pirate crew journey"],
    tags: ["quirky", "flashy", "chaotic", "mischievous", "unexpected", "playful"],
  },
  {
    id: "power-up-hero",
    name: "🔥 진화형 파워업 캐릭터",
    summary: "싸울수록 강해지는, 전형적인 성장형 주인공 타입.",
    traits: ["점점 강해짐", "위기 → 각성", "마지막에 터짐"],
    vibeHint: "각성 컷씬이 제일 멋있는 정석 주인공 감성",
    worldVibes: ["hero training arc", "digital evolution saga"],
    tags: ["heroic", "passionate", "active", "balanced", "confident", "bright"],
  },
  {
    id: "lightning-mascot",
    name: "⚡ 번개 마스코트형",
    summary: "작고 귀여운데, 존재감은 절대 무시 못 하는 타입.",
    traits: ["빠름", "활발함", "파트너 감성"],
    vibeHint: "귀여운데 은근 에이스인 번개 파트너 타입",
    worldVibes: ["monster partner adventure", "hero training arc"],
    tags: ["cute", "energetic", "bright", "sporty", "playful", "light"],
  },
];

  function cleanJsonText(text = "") {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function normalizeTextArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v) => typeof v === "string")
    .map((v) => v.toLowerCase().trim());
}

function safeNumber(value, fallback) {
  const n = Number(value);
  if (Number.isFinite(n)) {
    return Math.max(0, Math.min(100, Math.round(n)));
  }
  return fallback;
}

function scoreCharacter(character, tags, worldVibe) {
  let score = 0;

  for (const tag of character.tags) {
    if (tags.includes(tag)) {
      score += 2;
    }
  }

  if (character.worldVibes.includes(worldVibe)) {
    score += 4;
  }

  return score;
}

function pickBestCharacter(tags, worldVibe) {
  let bestCharacter = CHARACTER_POOL[0];
  let bestScore = -1;

  for (const character of CHARACTER_POOL) {
    const score = scoreCharacter(character, tags, worldVibe);
    if (score > bestScore) {
      bestScore = score;
      bestCharacter = character;
    }
  }

  return bestCharacter;
}

app.post("/upload", (req, res) => {
  const imageUrl = req.body?.imageUrl;

  if (!imageUrl || typeof imageUrl !== "string") {
    return res.status(400).json({ error: "Valid imageUrl is required in /upload" });
  }

  if (!images.includes(imageUrl)) {
    images.push(imageUrl);
  }

  res.json({
    message: "Saved!",
    imageUrl,
    totalImages: images.length,
  });
});

app.get("/images", (req, res) => {
  res.json({
    count: images.length,
    images,
  });
});

app.post("/rate", async (req, res) => {
  try {
    const imageUrl = req.body?.imageUrl;

    if (!imageUrl || typeof imageUrl !== "string") {
      return res.status(400).json({ error: "Valid imageUrl is required in /rate" });
    }

    if (!process.env.HF_API_KEY) {
      return res.status(500).json({
        error: "HF_API_KEY is missing in server/.env",
      });
    }

    const response = await client.responses.create({
      model: "google/gemma-4-26B-A4B-it",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You analyze outfit vibe from an uploaded image for a playful anime-inspired app. " +
                "Do not identify the person. " +
                "Do not mention copyrighted characters or franchises. " +
                "Return only compact JSON.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                'Analyze the visible outfit, styling, colors, and overall vibe. Return JSON only in this exact schema: ' +
                '{"caption":"string","tags":["string"],"worldVibe":"string","fashionScore":0,"flexScore":0,"charisma":0,"evolution":0}. ' +
                'Allowed tags: ["cute","soft","playful","bright","dark","edgy","sporty","trendy","colorful","friendly","clean","sharp","cool","mysterious","dramatic","smart","focused","minimal","quirky","flashy","active","balanced","natural","pastel","light","powerful","majestic","composed","mischievous","unexpected","passionate","intense","chaotic","heroic","confident","hopeful","simple","energetic"]. ' +
                'Allowed worldVibe: ["monster partner adventure","digital evolution saga","pirate crew journey","ninja rival arc","spirit guardian fantasy","mecha rival academy","chaos trickster tournament","hero training arc","legendary beast chronicle","healing slice fantasy"].',
            },
            {
              type: "input_image",
              image_url: imageUrl,
            },
          ],
        },
      ],
    });

const raw = response.output_text || "";
const cleaned = cleanJsonText(raw);

let parsed;

try {
  parsed = JSON.parse(cleaned);
} catch (err) {
  console.error("Failed to parse model JSON:", raw);
  console.error("Cleaned JSON text:", cleaned);
  return res.status(500).json({
    error: "Model did not return valid JSON",
    raw,
    cleaned,
  });
}

    const tags = normalizeTextArray(parsed.tags);
    const worldVibe =
      typeof parsed.worldVibe === "string"
        ? parsed.worldVibe.toLowerCase().trim()
        : "monster partner adventure";

    const selectedCharacter = pickBestCharacter(tags, worldVibe);

    res.json({
      imageUrl,
      caption: typeof parsed.caption === "string" ? parsed.caption : "",
      tags,
      worldVibe,
      characterType: selectedCharacter.name,
      summary: selectedCharacter.summary,
      traits: selectedCharacter.traits,
      vibeHint: selectedCharacter.vibeHint,
      fashionScore: safeNumber(parsed.fashionScore, 70),
      flexScore: safeNumber(parsed.flexScore, 68),
      charisma: safeNumber(parsed.charisma, 72),
      evolution: safeNumber(parsed.evolution, 74),
    });
  } catch (error) {
    console.error("RATE error:", error);

    res.status(500).json({
      error: "Failed to analyze image with Hugging Face Gemma 4",
      detail: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});