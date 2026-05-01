require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json({ limit: "10mb" }));

let images = [];

// Groq 클라이언트
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ─── 캐릭터 풀 ────────────────────────────────────────────────────────────────
const CHARACTERS = [
  {
    id: "dex",
    imageFile: "dex.png",
    celebs: [{ name: "덱스", work: "솔로지옥" }],
    tags: ["charismatic", "dark", "intense", "mysterious", "dominant"],
    worldVibes: ["crime empire", "romance arc", "rivals-to-lovers"],
    ko: { name: "👑 위험한데 끌리는 남자", quote: "나한테 빠지면 책임 못 져.", summary: "위험한 거 알면서도 계속 보게 되는 타입. 눈빛 하나로 분위기 장악.", traits: ["위험한 매력", "눈빛 치트키", "끌리면 이미 늦음"], shareText: "나 위험한데 끌리는 남자 나왔어😈 조심해 너는?\nrate-my-fit.com" },
    en: { name: "👑 Dangerous But Irresistible", quote: "I warned you not to fall for me.", summary: "You know he's trouble but you can't stop watching.", traits: ["Deadly charisma", "Eye contact cheat code", "Too late once hooked"], shareText: "I got Dangerous But Irresistible 😈 consider yourself warned.\nrate-my-fit.com" },
    ja: { name: "👑 危険なのに惹かれる男", quote: "俺に落ちても責任取れないぞ。", summary: "危険とわかっていても目が離せないタイプ。", traits: ["危険な魅力", "眼差しチートコード", "惹かれたらもう手遅れ"], shareText: "危険なのに惹かれる男が出た😈 あなたは？\nrate-my-fit.com" },
    zh: { name: "👑 危险却让人着迷的男人", quote: "爱上我，我可不负责。", summary: "明知危险却无法停止凝视。", traits: ["致命魅力", "眼神作弊码", "着迷了就已经晚了"], shareText: "我得到了危险却让人着迷的男人😈 你呢？\nrate-my-fit.com" },
    es: { name: "👑 Peligroso Pero Irresistible", quote: "Te advertí que no te enamoraras.", summary: "Sabes que es problema pero no puedes dejar de mirarlo.", traits: ["Carisma mortal", "Trampa visual", "Ya es tarde"], shareText: "Salí Peligroso Pero Irresistible 😈 ¿y tú?\nrate-my-fit.com" },
  },
  {
    id: "rich",
    imageFile: "rich.png",
    celebs: [{ name: "김우빈", work: "상속자들" }, { name: "이민호", work: "꽃보다 남자" }],
    tags: ["cold", "wealthy", "intense", "sharp", "dominant", "refined"],
    worldVibes: ["elite world", "romance arc", "rivals-to-lovers"],
    ko: { name: "😤 싸가지 없는데 츤데레", quote: "내가 왜 신경 써. 그냥... 지나가다 봤어.", summary: "처음엔 진짜 별로인데 알고 보면 다 챙겨주고 있었음.", traits: ["표면은 싸가지", "속은 다 챙겨줌", "재수없음 = 매력"], shareText: "나 싸가지 없는데 츤데레 나왔어😤 너는?\nrate-my-fit.com" },
    en: { name: "😤 Rude But Secretly Caring", quote: "It's not like I was worried about you.", summary: "Acts unbearable at first but has been looking out for you the whole time.", traits: ["Rude on surface", "Secretly caring", "Rudeness IS the charm"], shareText: "I got Rude But Secretly Caring 😤 tsundere confirmed.\nrate-my-fit.com" },
    ja: { name: "😤 態度悪いけどツンデレ", quote: "別に心配してたわけじゃないし。", summary: "最初は最悪に見えるけど、実はずっと気にかけていた。", traits: ["表面は態度悪い", "実は全員の世話", "態度悪さ=魅力"], shareText: "態度悪いけどツンデレが出た😤 あなたは？\nrate-my-fit.com" },
    zh: { name: "😤 没礼貌但闷骚", quote: "又不是在担心你。", summary: "一开始真的很讨厌，但其实一直都在默默照顾你。", traits: ["表面没礼貌", "默默照顾", "没礼貌=魅力"], shareText: "我得到了没礼貌但闷骚😤 你呢？\nrate-my-fit.com" },
    es: { name: "😤 Grosero Pero Protector", quote: "No es que estuviera preocupado por ti.", summary: "Parece insoportable al principio pero ha estado cuidándote.", traits: ["Grosero exterior", "Secretamente cuida", "La grosería ES el encanto"], shareText: "Salí Grosero Pero Protector 😤 ¿y tú?\nrate-my-fit.com" },
  },
  {
    id: "ceo",
    imageFile: "ceo.png",
    celebs: [{ name: "공유", work: "도깨비" }, { name: "박서준", work: "김비서가 왜 그럴까" }],
    tags: ["cold", "dominant", "refined", "serious", "sharp", "composed", "wealthy"],
    worldVibes: ["corporate romance", "elite world", "rivals-to-lovers"],
    ko: { name: "🧊 포옹이 필요한 CEO", quote: "회의실에서 제일 무섭지만 집 가면 고양이한테 반말 들음.", summary: "회의실에선 공포의 대상인데 사실 그냥 많이 외로운 타입.", traits: ["회의실 공포의 대상", "집에선 고양이 집사", "연봉 높고 친구 없음"], shareText: "나 포옹이 필요한 CEO 나왔어🧊 너는?\nrate-my-fit.com" },
    en: { name: "🧊 CEO Who Needs A Hug", quote: "Terrifying in meetings. Gets bossed by his cat at home.", summary: "Terrifying in boardrooms. Gets talked down to by their cat. Just lonely.", traits: ["Office villain", "Cat's servant", "High salary zero friends"], shareText: "I got CEO Who Needs A Hug 🧊 honestly same.\nrate-my-fit.com" },
    ja: { name: "🧊 ハグが必要なCEO", quote: "会議室では最恐。家では猫に見下される。", summary: "会議室では最恐だが、家では猫に見下される。実はただ孤独。", traits: ["職場の恐怖", "家では猫の下僕", "高給友達ゼロ"], shareText: "ハグが必要なCEOが出た🧊 あなたは？\nrate-my-fit.com" },
    zh: { name: "🧊 需要拥抱的CEO", quote: "会议室最可怕，回家却被猫看不起。", summary: "在会议室最可怕，回家却被猫看不起。其实只是很孤独。", traits: ["办公室恐怖", "猫的仆人", "高薪无朋友"], shareText: "我得到了需要拥抱的CEO🧊 你呢？\nrate-my-fit.com" },
    es: { name: "🧊 CEO Que Necesita Un Abrazo", quote: "Aterrador en reuniones. Su gato le manda en casa.", summary: "Aterrador en reuniones pero su gato le habla mal. Solo está solo.", traits: ["Villano de oficina", "Sirviente del gato", "Sueldo alto cero amigos"], shareText: "Salí CEO Que Necesita Un Abrazo 🧊 ¿y tú?\nrate-my-fit.com" },
  },
  {
    id: "revenge_women",
    imageFile: "revenge_women.png",
    celebs: [{ name: "송혜교", work: "더 글로리" }, { name: "김소연", work: "펜트하우스" }],
    tags: ["intense", "glamorous", "dominant", "dramatic", "sharp", "charismatic", "calculated", "dark"],
    worldVibes: ["revenge arc", "elite world", "political drama", "mystery thriller"],
    ko: { name: "😊 웃는데 무서운 여자", quote: "다 기억하고 있어. 하나도 빠짐없이.", summary: "항상 웃고 있는데 그게 제일 무서운 타입. 웃음 뒤에 10년 계획이 있음.", traits: ["웃음 = 경보", "기억력 = 무기", "10년 계획 있음"], shareText: "나 웃는데 무서운 여자 나왔어😊 다 기억하고 있어 너는?\nrate-my-fit.com" },
    en: { name: "😊 Smiling But Terrifying", quote: "I remember everything. Every single thing.", summary: "Always smiling — and that's exactly what makes her terrifying.", traits: ["Smile = warning", "Memory is weapon", "10-year plan"], shareText: "I got Smiling But Terrifying 😊 I remember everything.\nrate-my-fit.com" },
    ja: { name: "😊 笑ってるけど怖い女", quote: "全部覚えてるよ。一つ残らず。", summary: "いつも笑っているのに、それが一番怖いタイプ。", traits: ["笑顔=警報", "記憶力=武器", "10年計画"], shareText: "笑ってるけど怖い女が出た😊 あなたは？\nrate-my-fit.com" },
    zh: { name: "😊 笑着但很可怕的女人", quote: "我全都记得。一件不落。", summary: "总是在笑——但这正是她最可怕的地方。", traits: ["笑容=警报", "记忆=武器", "10年计划"], shareText: "我得到了笑着但很可怕的女人😊 你呢？\nrate-my-fit.com" },
    es: { name: "😊 Sonriendo Pero Aterradora", quote: "Recuerdo todo. Absolutamente todo.", summary: "Siempre sonriendo — y eso es lo que la hace aterradora.", traits: ["Sonrisa = alarma", "Memoria = arma", "Plan 10 años"], shareText: "Salí Sonriendo Pero Aterradora 😊 ¿y tú?\nrate-my-fit.com" },
  },
  {
    id: "first_sight",
    imageFile: "first_sight.png",
    celebs: [{ name: "차은우", work: "아스달 연대기" }, { name: "박보검", work: "응답하라 1988" }],
    tags: ["warm", "charming", "bright", "natural", "friendly", "light", "mysterious"],
    worldVibes: ["romance arc", "slice of life", "coming-of-age", "campus romance"],
    ko: { name: "👀 한번 더 보게 되는 사람", quote: "어? 저 사람 원래 저랬나?", summary: "처음엔 그냥 지나쳤는데 어느 순간 계속 눈이 가는 타입.", traits: ["처음엔 평범해 보임", "알수록 매력 상승", "계속 눈이 감"], shareText: "나 한번 더 보게 되는 사람 나왔어👀 처음엔 몰랐지? 너는?\nrate-my-fit.com" },
    en: { name: "👀 Makes You Look Twice", quote: "Wait, was that person always like that?", summary: "Overlooked at first but suddenly you can't stop looking.", traits: ["Ordinary at first", "More attractive over time", "Can't stop looking"], shareText: "I got Makes You Look Twice 👀 you didn't notice at first.\nrate-my-fit.com" },
    ja: { name: "👀 二度見してしまう人", quote: "あれ、あの人ってもともとあんな感じだっけ？", summary: "最初は素通りしたのにいつの間にかずっと目が行くタイプ。", traits: ["最初は普通", "知るほど魅力UP", "ずっと目が行く"], shareText: "二度見してしまう人が出た👀 あなたは？\nrate-my-fit.com" },
    zh: { name: "👀 让人多看一眼的人", quote: "咦？那个人原来这样吗？", summary: "一开始忽略了，但不知什么时候一直在看的类型。", traits: ["一开始普通", "越了解越有魅力", "一直在看"], shareText: "我得到了让人多看一眼的人👀 你呢？\nrate-my-fit.com" },
    es: { name: "👀 Te Hace Mirar Dos Veces", quote: "Espera, ¿esa persona siempre fue así?", summary: "Pasado por alto al principio pero no puedes dejar de mirar.", traits: ["Ordinario al principio", "Más atractivo con tiempo", "No puedes dejar de mirar"], shareText: "Salí Te Hace Mirar Dos Veces 👀 ¿y tú?\nrate-my-fit.com" },
  },
];

// ─── 허용 태그/월드바이브 ─────────────────────────────────────────────────────
const ALLOWED_TAGS = ["cold","refined","intense","wealthy","mysterious","sharp","dominant","serious","composed","warm","friendly","soft","loyal","natural","light","charismatic","dark","dramatic","bright","energetic","determined","active","charming","colorful","calculated","glamorous","focused","minimal","regal","calm","majestic","gentle","passionate"];
const ALLOWED_WORLD_VIBES = ["elite world","romance arc","redemption arc","corporate romance","rivals-to-lovers","found family","slice of life","coming-of-age","revenge arc","mystery thriller","political drama","crime thriller","detective duo","campus romance","crime empire","historical romance","time-slip drama","royal court","medical romance","cyber thriller"];

// ─── 헬퍼 ────────────────────────────────────────────────────────────────────
function cleanJson(text = "") {
  return text.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/\s*```$/i,"").trim();
}
function normalizeArr(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(v => typeof v === "string").map(v => v.toLowerCase().trim());
}
function safeNum(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : fallback;
}
function pickByTags(tags, worldVibe) {
  let best = CHARACTERS[0], bestScore = -1;
  for (const c of CHARACTERS) {
    let score = 0;
    for (const tag of c.tags) { if (tags.includes(tag)) score += 2; }
    if (c.worldVibes.includes(worldVibe)) score += 4;
    if (score > bestScore) { bestScore = score; best = c; }
  }
  return best;
}
function pickRandom() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}
function buildResponse(imageUrl, character, extra = {}) {
  return {
    imageUrl,
    characterId: character.id,
    imageFile: character.imageFile,
    celebs: character.celebs,
    ko: character.ko,
    en: character.en,
    ja: character.ja,
    zh: character.zh,
    es: character.es,
    matchScore: extra.matchScore ?? Math.floor(Math.random() * 15 + 78),
    charisma: extra.charisma ?? Math.floor(Math.random() * 15 + 72),
    plotArmor: extra.plotArmor ?? Math.floor(Math.random() * 15 + 68),
    dramaPotential: extra.dramaPotential ?? Math.floor(Math.random() * 15 + 74),
    caption: extra.caption ?? "",
    tags: extra.tags ?? [],
    worldVibe: extra.worldVibe ?? "",
    analysisMethod: extra.analysisMethod ?? "random",
  };
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.post("/upload", (req, res) => {
  const imageUrl = req.body?.imageUrl;
  if (!imageUrl || typeof imageUrl !== "string") return res.status(400).json({ error: "Valid imageUrl required" });
  if (!images.includes(imageUrl)) images.push(imageUrl);
  res.json({ message: "Saved!", imageUrl, totalImages: images.length });
});

app.get("/images", (req, res) => res.json({ count: images.length, images }));

app.post("/rate", async (req, res) => {
  const imageUrl = req.body?.imageUrl;
  if (!imageUrl || typeof imageUrl !== "string") return res.status(400).json({ error: "Valid imageUrl required" });

  // ── Groq로 이미지 분석 시도 ──────────────────────────────────────────────
  if (process.env.GROQ_API_KEY) {
    try {
      console.log("🤖 Groq AI 분석 시도 중...");

      const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this person's outfit, expression, posture, and overall vibe for a K-Drama character matching app.
Do NOT identify the person. Return ONLY valid JSON, no markdown, no explanation:
{"caption":"string","tags":["string"],"worldVibe":"string","matchScore":0,"charisma":0,"plotArmor":0,"dramaPotential":0}

caption: one witty punchy English sentence about their K-Drama energy.
Allowed tags (pick 3-5): ${JSON.stringify(ALLOWED_TAGS)}
Allowed worldVibe (pick 1): ${JSON.stringify(ALLOWED_WORLD_VIBES)}
All scores: integers 60-99.`,
              },
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
      });

      const raw = response.choices?.[0]?.message?.content || "";
      const cleaned = cleanJson(raw);

      let parsed;
      try { parsed = JSON.parse(cleaned); }
      catch { throw new Error("JSON parse failed: " + raw); }

      const tags = normalizeArr(parsed.tags);
      const worldVibe = typeof parsed.worldVibe === "string"
        ? parsed.worldVibe.toLowerCase().trim()
        : "romance arc";
      const character = pickByTags(tags, worldVibe);

      console.log("✅ Groq 분석 성공 →", character.id);
      return res.json(buildResponse(imageUrl, character, {
        matchScore: safeNum(parsed.matchScore, 80),
        charisma: safeNum(parsed.charisma, 75),
        plotArmor: safeNum(parsed.plotArmor, 70),
        dramaPotential: safeNum(parsed.dramaPotential, 82),
        caption: typeof parsed.caption === "string" ? parsed.caption : "",
        tags,
        worldVibe,
        analysisMethod: "groq",
      }));

    } catch (err) {
      console.warn("⚠️ Groq 분석 실패:", err.message, "→ 랜덤 매칭으로 폴백");
    }
  } else {
    console.log("ℹ️ GROQ_API_KEY 없음 → 랜덤 매칭");
  }

  // ── 폴백: 랜덤 매칭 ─────────────────────────────────────────────────────
  const character = pickRandom();
  console.log("🎲 랜덤 매칭 →", character.id);
  return res.json(buildResponse(imageUrl, character, { analysisMethod: "random" }));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));