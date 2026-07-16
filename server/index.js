require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const PORT = 5000;
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

let images = [];

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── 캐릭터 풀 (성별 구분) ───────────────────────────────────────────────────
const CHARACTERS = [

  // ══════════ 남자 캐릭터 ══════════

  {
    id: "dex",
    gender: "m",
    imageFile: "dex.png",
    celebs: [{ name: "덱스", work: "솔로지옥" }],
    tags: ["charismatic", "dark", "intense", "mysterious", "dominant", "sharp", "passionate", "energetic"],
    worldVibes: ["crime empire", "romance arc", "rivals-to-lovers"],
    ko: { name: "👑 위험한데 끌리는 남자", quote: "나한테 빠지면 책임 못 져.", summary: "위험한 거 알면서도 계속 보게 되는 타입. 눈빛 하나로 분위기 장악.", traits: ["위험한 매력", "눈빛 치트키", "끌리면 이미 늦음"], shareText: "나 위험한데 끌리는 남자 나왔어😈 조심해 너는?" },
    en: { name: "👑 Dangerous But Irresistible", quote: "I warned you not to fall for me.", summary: "You know he's trouble but you can't stop watching.", traits: ["Deadly charisma", "Eye contact cheat code", "Too late once hooked"], shareText: "I got Dangerous But Irresistible 😈 consider yourself warned." },
    ja: { name: "👑 危険なのに惹かれる男", quote: "俺に落ちても責任取れないぞ。", summary: "危険とわかっていても目が離せないタイプ。", traits: ["危険な魅力", "眼差しチートコード", "惹かれたらもう手遅れ"], shareText: "危険なのに惹かれる男が出た😈 あなたは？" },
    zh: { name: "👑 危险却让人着迷的男人", quote: "爱上我，我可不负责。", summary: "明知危险却无法停止凝视。", traits: ["致命魅力", "眼神作弊码", "着迷了就已经晚了"], shareText: "我得到了危险却让人着迷的男人😈 你呢？" },
    es: { name: "👑 Peligroso Pero Irresistible", quote: "Te advertí que no te enamoraras.", summary: "Sabes que es problema pero no puedes dejar de mirarlo.", traits: ["Carisma mortal", "Trampa visual", "Ya es tarde"], shareText: "Salí Peligroso Pero Irresistible 😈 ¿y tú?" },
  },
  {
    id: "rich",
    gender: "m",
    imageFile: "rich.png",
    celebs: [{ name: "김우빈", work: "상속자들" }, { name: "이민호", work: "꽃보다 남자" }],
    tags: ["cold", "wealthy", "intense", "sharp", "dominant", "refined", "mysterious", "serious"],
    worldVibes: ["elite world", "romance arc", "rivals-to-lovers"],
    ko: { name: "😤 싸가지 없는데 츤데레", quote: "내가 왜 신경 써. 그냥... 지나가다 봤어.", summary: "처음엔 진짜 별로인데 알고 보면 다 챙겨주고 있었음.", traits: ["표면은 싸가지", "속은 다 챙겨줌", "재수없음 = 매력"], shareText: "나 싸가지 없는데 츤데레 나왔어😤 너는?" },
    en: { name: "😤 Rude But Secretly Caring", quote: "It's not like I was worried about you.", summary: "Acts unbearable at first but has been looking out for you the whole time.", traits: ["Rude on surface", "Secretly caring", "Rudeness IS the charm"], shareText: "I got Rude But Secretly Caring 😤 tsundere confirmed." },
    ja: { name: "😤 態度悪いけどツンデレ", quote: "別に心配してたわけじゃないし。", summary: "最初は最悪に見えるけど、実はずっと気にかけていた。", traits: ["表面は態度悪い", "実は全員の世話", "態度悪さ=魅力"], shareText: "態度悪いけどツンデレが出た😤 あなたは？" },
    zh: { name: "😤 没礼貌但闷骚", quote: "又不是在担心你。", summary: "一开始真的很讨厌，但其实一直都在默默照顾你。", traits: ["表面没礼貌", "默默照顾", "没礼貌=魅力"], shareText: "我得到了没礼貌但闷骚😤 你呢？" },
    es: { name: "😤 Grosero Pero Protector", quote: "No es que estuviera preocupado por ti.", summary: "Parece insoportable al principio pero ha estado cuidándote.", traits: ["Grosero exterior", "Secretamente cuida", "La grosería ES el encanto"], shareText: "Salí Grosero Pero Protector 😤 ¿y tú?" },
  },
  {
    id: "ceo",
    gender: "m",
    imageFile: "ceo.png",
    celebs: [{ name: "공유", work: "도깨비" }, { name: "박서준", work: "김비서가 왜 그럴까" }],
    tags: ["cold", "dominant", "refined", "serious", "sharp", "composed", "wealthy", "calm", "focused"],
    worldVibes: ["corporate romance", "elite world", "rivals-to-lovers"],
    ko: { name: "🧊 포옹이 필요한 CEO", quote: "회의실에서 제일 무섭지만 집 가면 고양이한테 반말 들음.", summary: "회의실에선 공포의 대상인데 사실 그냥 많이 외로운 타입.", traits: ["회의실 공포의 대상", "집에선 고양이 집사", "연봉 높고 친구 없음"], shareText: "나 포옹이 필요한 CEO 나왔어🧊 너는?" },
    en: { name: "🧊 CEO Who Needs A Hug", quote: "Terrifying in meetings. Gets bossed by his cat at home.", summary: "Terrifying in boardrooms. Gets talked down to by their cat. Just lonely.", traits: ["Office villain", "Cat's servant", "High salary zero friends"], shareText: "I got CEO Who Needs A Hug 🧊 honestly same." },
    ja: { name: "🧊 ハグが必要なCEO", quote: "会議室では最恐。家では猫に見下される。", summary: "会議室では最恐だが、家では猫に見下される。実はただ孤独。", traits: ["職場の恐怖", "家では猫の下僕", "高給友達ゼロ"], shareText: "ハグが必要なCEOが出た🧊 あなたは？" },
    zh: { name: "🧊 需要拥抱的CEO", quote: "会议室最可怕，回家却被猫看不起。", summary: "在会议室最可怕，回家却被猫看不起。其实只是很孤独。", traits: ["办公室恐怖", "猫的仆人", "高薪无朋友"], shareText: "我得到了需要拥抱的CEO🧊 你呢？" },
    es: { name: "🧊 CEO Que Necesita Un Abrazo", quote: "Aterrador en reuniones. Su gato le manda en casa.", summary: "Aterrador en reuniones pero su gato le habla mal. Solo está solo.", traits: ["Villano de oficina", "Sirviente del gato", "Sueldo alto cero amigos"], shareText: "Salí CEO Que Necesita Un Abrazo 🧊 ¿y tú?" },
  },
  {
    id: "first_sight",
    gender: "m",
    imageFile: "first_sight.png",
    celebs: [{ name: "차은우", work: "아스달 연대기" }, { name: "박보검", work: "응답하라 1988" }],
    tags: ["warm", "charming", "bright", "natural", "friendly", "light", "mysterious", "gentle", "calm"],
    worldVibes: ["romance arc", "slice of life", "coming-of-age", "campus romance"],
    ko: { name: "👀 한번 더 보게 되는 사람", quote: "어? 저 사람 원래 저랬나?", summary: "처음엔 그냥 지나쳤는데 어느 순간 계속 눈이 가는 타입.", traits: ["처음엔 평범해 보임", "알수록 매력 상승", "계속 눈이 감"], shareText: "나 한번 더 보게 되는 사람 나왔어👀 처음엔 몰랐지? 너는?" },
    en: { name: "👀 Makes You Look Twice", quote: "Wait, was that person always like that?", summary: "Overlooked at first but suddenly you can't stop looking.", traits: ["Ordinary at first", "More attractive over time", "Can't stop looking"], shareText: "I got Makes You Look Twice 👀 you didn't notice at first." },
    ja: { name: "👀 二度見してしまう人", quote: "あれ、あの人ってもともとあんな感じだっけ？", summary: "最初は素通りしたのにいつの間にかずっと目が行くタイプ。", traits: ["最初は普通", "知るほど魅力UP", "ずっと目が行く"], shareText: "二度見してしまう人が出た👀 あなたは？" },
    zh: { name: "👀 让人多看一眼的人", quote: "咦？那个人原来这样吗？", summary: "一开始忽略了，但不知什么时候一直在看的类型。", traits: ["一开始普通", "越了解越有魅力", "一直在看"], shareText: "我得到了让人多看一眼的人👀 你呢？" },
    es: { name: "👀 Te Hace Mirar Dos Veces", quote: "Espera, ¿esa persona siempre fue así?", summary: "Pasado por alto al principio pero no puedes dejar de mirar.", traits: ["Ordinario al principio", "Más atractivo con tiempo", "No puedes dejar de mirar"], shareText: "Salí Te Hace Mirar Dos Veces 👀 ¿y tú?" },
  },
  {
    id: "quietly_scary",
    gender: "m",
    imageFile: "quietly_scary.png",
    celebs: [{ name: "송중기", work: "빈센조" }],
    tags: ["dark", "calm", "dominant", "intense", "composed", "charismatic", "focused", "mysterious", "sharp"],
    worldVibes: ["crime empire", "revenge arc", "political drama"],
    ko: { name: "🤫 조용히 무서운 남자", quote: "화 안 냈어. 그냥 기억해뒀어.", summary: "소리 안 지르고 웃으면서 제일 무서운 타입. 적으로 만들면 안 됨.", traits: ["웃을 때가 제일 무서움", "기억력 = 무기", "적으로 만들지 말 것"], shareText: "나 조용히 무서운 남자 나왔어🤫 웃고있을 때 조심해 너는?" },
    en: { name: "🤫 Quietly Terrifying", quote: "I didn't get mad. I just made a note of it.", summary: "Never raises his voice. Smiles while planning your downfall.", traits: ["Smiling = most dangerous", "Memory is the weapon", "Do not make an enemy"], shareText: "I got Quietly Terrifying 🤫 I'm smiling right now." },
    ja: { name: "🤫 静かに怖い男", quote: "怒らなかったよ。ただ覚えておいただけ。", summary: "声を上げず、笑いながら一番怖いタイプ。敵に回してはいけない。", traits: ["笑う時が一番怖い", "記憶力=武器", "敵にするな"], shareText: "静かに怖い男が出た🤫 今笑ってるよ。あなたは？" },
    zh: { name: "🤫 安静但可怕的男人", quote: "我没生气。只是记住了。", summary: "不提高声音，笑着策划你的覆灭。最可怕的类型。", traits: ["笑的时候最危险", "记忆力=武器", "别树敌"], shareText: "我得到了安静但可怕的男人🤫 我现在在笑。你呢？" },
    es: { name: "🤫 Tranquilo Pero Aterrador", quote: "No me enojé. Solo lo anoté.", summary: "Nunca levanta la voz. Sonríe mientras planea tu caída.", traits: ["Sonreír = más peligroso", "La memoria es el arma", "No lo hagas tu enemigo"], shareText: "Salí Tranquilo Pero Aterrador 🤫 estoy sonriendo ahora mismo. ¿y tú?" },
  },
  {
    id: "passion_straight",
    gender: "m",
    imageFile: "passion_straight.png",
    celebs: [{ name: "박서준", work: "이태원 클라쓰" }],
    tags: ["determined", "energetic", "passionate", "active", "warm", "bright", "loyal", "intense"],
    worldVibes: ["coming-of-age", "romance arc", "redemption arc"],
    ko: { name: "🔥 열정만렙 직진형", quote: "포기하는 거 몰라. 그게 내 답이야.", summary: "가난하고 힘들어도 직진만 함. 열정이 무기. 결국엔 이기는 타입.", traits: ["포기 = 없는 단어", "열정이 무기", "결국엔 이김"], shareText: "나 열정만렙 직진형 나왔어🔥 포기 모름 너는?" },
    en: { name: "🔥 Maximum Passion Straight Shot", quote: "I don't know how to give up. That's my answer.", summary: "Poor, beaten down, doesn't matter — always charges straight ahead.", traits: ["Giving up doesn't exist", "Passion is the weapon", "Wins in the end always"], shareText: "I got Maximum Passion Straight Shot 🔥 I don't know how to give up." },
    ja: { name: "🔥 情熱MAX一直線型", quote: "諦めるって知らないんだよ。それが俺の答えだ。", summary: "貧しくても辛くても一直線に進む。情熱が武器。", traits: ["諦め=存在しない言葉", "情熱が武器", "最終的には勝つ"], shareText: "情熱MAX一直線型が出た🔥 あなたは？" },
    zh: { name: "🔥 热情满级直线型", quote: "我不知道什么叫放弃。这就是我的答案。", summary: "再穷再难也只会一路直冲。热情是武器，最终总会赢。", traits: ["放弃=不存在的词", "热情是武器", "最终总会赢"], shareText: "我得到了热情满级直线型🔥 你呢？" },
    es: { name: "🔥 Pasión Máxima Directo", quote: "No sé cómo rendirme. Esa es mi respuesta.", summary: "Pobre, golpeado, no importa — siempre va directo.", traits: ["Rendirse no existe", "La pasión es el arma", "Siempre gana al final"], shareText: "Salí Pasión Máxima Directo 🔥 no sé rendirme. ¿y tú?" },
  },
  {
    id: "office_worker",
    gender: "m",
    imageFile: "office_worker.png",
    celebs: [{ name: "임시완", work: "미생" }],
    tags: ["serious", "focused", "composed", "natural", "minimal", "loyal", "calm", "determined"],
    worldVibes: ["slice of life", "corporate romance", "coming-of-age"],
    ko: { name: "💼 현실 직장인상", quote: "퇴근이 제일 좋아. 근데 야근이 제일 많아.", summary: "드라마틱하진 않지만 가장 공감되는 타입. 현실 직장인 그 자체.", traits: ["공감 100%", "야근 전문가", "퇴근이 꿈"], shareText: "나 현실 직장인상 나왔어💼 공감되면 공유해 너는?" },
    en: { name: "💼 The Real Office Worker", quote: "I love leaving work. But I'm always last to leave.", summary: "Not dramatic but the most relatable. The real office worker.", traits: ["100% relatable", "Overtime specialist", "Dreams of leaving on time"], shareText: "I got The Real Office Worker 💼 painfully relatable." },
    ja: { name: "💼 リアル会社員", quote: "退勤が一番好き。でも残業が一番多い。", summary: "ドラマチックではないが一番共感できるタイプ。", traits: ["共感100%", "残業専門家", "退勤が夢"], shareText: "リアル会社員が出た💼 あなたは？" },
    zh: { name: "💼 现实职场人", quote: "最喜欢下班。但加班最多。", summary: "不戏剧化但最有共鸣的类型。现实职场人本身。", traits: ["共鸣100%", "加班专家", "下班是梦想"], shareText: "我得到了现实职场人💼 你呢？" },
    es: { name: "💼 El Trabajador Real", quote: "Me encanta salir del trabajo. Pero siempre salgo último.", summary: "No dramático pero el más identificable.", traits: ["100% identificable", "Especialista en horas extra", "Sueña con salir a tiempo"], shareText: "Salí El Trabajador Real 💼 dolorosamente identificable. ¿y tú?" },
  },

  // ══════════ 여자 캐릭터 ══════════

  {
    id: "revenge_women",
    gender: "f",
    imageFile: "revenge_women.png",
    celebs: [{ name: "송혜교", work: "더 글로리" }, { name: "김소연", work: "펜트하우스" }],
    tags: ["intense", "glamorous", "dominant", "dramatic", "sharp", "charismatic", "calculated", "dark", "focused"],
    worldVibes: ["revenge arc", "elite world", "political drama", "mystery thriller"],
    ko: { name: "😊 웃는데 무서운 여자", quote: "다 기억하고 있어. 하나도 빠짐없이.", summary: "항상 웃고 있는데 그게 제일 무서운 타입. 웃음 뒤에 10년 계획이 있음.", traits: ["웃음 = 경보", "기억력 = 무기", "10년 계획 있음"], shareText: "나 웃는데 무서운 여자 나왔어😊 다 기억하고 있어 너는?" },
    en: { name: "😊 Smiling But Terrifying", quote: "I remember everything. Every single thing.", summary: "Always smiling — and that's exactly what makes her terrifying.", traits: ["Smile = warning", "Memory is weapon", "10-year plan"], shareText: "I got Smiling But Terrifying 😊 I remember everything." },
    ja: { name: "😊 笑ってるけど怖い女", quote: "全部覚えてるよ。一つ残らず。", summary: "いつも笑っているのに、それが一番怖いタイプ。", traits: ["笑顔=警報", "記憶力=武器", "10年計画"], shareText: "笑ってるけど怖い女が出た😊 あなたは？" },
    zh: { name: "😊 笑着但很可怕的女人", quote: "我全都记得。一件不落。", summary: "总是在笑——但这正是她最可怕的地方。", traits: ["笑容=警报", "记忆=武器", "10年计划"], shareText: "我得到了笑着但很可怕的女人😊 你呢？" },
    es: { name: "😊 Sonriendo Pero Aterradora", quote: "Recuerdo todo. Absolutamente todo.", summary: "Siempre sonriendo — y eso es lo que la hace aterradora.", traits: ["Sonrisa = alarma", "Memoria = arma", "Plan 10 años"], shareText: "Salí Sonriendo Pero Aterradora 😊 ¿y tú?" },
  },
  {
    id: "smiling_scary",
    gender: "f",
    imageFile: "smiling_scary.png",
    celebs: [{ name: "송혜교", work: "더 글로리" }],
    tags: ["calculated", "charismatic", "intense", "dark", "glamorous", "sharp", "dominant", "mysterious"],
    worldVibes: ["revenge arc", "mystery thriller", "political drama"],
    ko: { name: "🌹 10년 준비한 복수", quote: "기다렸어. 이 순간을.", summary: "무시당하고 상처받았지만 10년 동안 준비했음. 지금은 달라짐.", traits: ["10년 준비", "완벽한 계획", "돌아왔을 때 분위기 달라짐"], shareText: "나 10년 준비한 복수 나왔어🌹 기다렸어 너는?" },
    en: { name: "🌹 10 Years In The Making", quote: "I've been waiting. For this moment.", summary: "Was hurt and dismissed but prepared for 10 years. Now everything is different.", traits: ["10 years of planning", "Perfect plan", "Returned completely changed"], shareText: "I got 10 Years In The Making 🌹 I've been waiting." },
    ja: { name: "🌹 10年間準備した復讐", quote: "待っていた。この瞬間を。", summary: "見下されて傷つけられたが10年間準備していた。今は違う。", traits: ["10年の準備", "完璧な計画", "戻ってきた時雰囲気が違う"], shareText: "10年間準備した復讐が出た🌹 あなたは？" },
    zh: { name: "🌹 准备了10年的复仇", quote: "等了。这一刻。", summary: "被忽视被伤害但准备了10年。现在不同了。", traits: ["准备了10年", "完美的计划", "回来时气场完全不同"], shareText: "我得到了准备了10年的复仇🌹 你呢？" },
    es: { name: "🌹 10 Años Preparándose", quote: "Esperé. Este momento.", summary: "Fue ignorada y herida pero se preparó 10 años. Ahora todo es diferente.", traits: ["10 años de preparación", "Plan perfecto", "Volvió completamente cambiada"], shareText: "Salí 10 Años Preparándose 🌹 esperé este momento. ¿y tú?" },
  },
  {
    id: "cold_lover",
    gender: "f",
    imageFile: "cold_lover.png",
    celebs: [{ name: "김지원", work: "눈물의 여왕" }],
    tags: ["cold", "refined", "composed", "loyal", "intense", "glamorous", "mysterious", "serious", "dominant"],
    worldVibes: ["romance arc", "elite world", "rivals-to-lovers"],
    ko: { name: "🧊 차가운데 사랑 깊은 여자", quote: "좋아한다고 한 적 없어. 그냥 네가 옆에 있으면 돼.", summary: "차갑게 굴지만 사실 제일 깊이 사랑하고 있는 타입.", traits: ["차가운 겉모습", "가장 깊은 사랑", "표현이 서툶"], shareText: "나 차가운데 사랑 깊은 여자 나왔어🧊 너는?" },
    en: { name: "🧊 Cold But Loves Deepest", quote: "I never said I liked you. I just need you near.", summary: "Acts cold but is actually loving the deepest.", traits: ["Cold exterior", "Deepest love of all", "Bad at expressing it"], shareText: "I got Cold But Loves Deepest 🧊 just stay near me." },
    ja: { name: "🧊 冷たいけど一番愛してる女", quote: "好きって言ったことない。ただ隣にいてくれればいい。", summary: "冷たく振る舞うけど実は一番深く愛しているタイプ。", traits: ["冷たい外見", "一番深い愛", "表現が苦手"], shareText: "冷たいけど一番愛してる女が出た🧊 あなたは？" },
    zh: { name: "🧊 冷漠但爱得最深的女人", quote: "没说过喜欢你。只是你在我身边就好了。", summary: "表现冷漠，但其实爱得最深。", traits: ["冷漠外表", "最深的爱", "不擅长表达"], shareText: "我得到了冷漠但爱得最深的女人🧊 你呢？" },
    es: { name: "🧊 Fría Pero Ama Más Profundo", quote: "Nunca dije que me gustaras. Solo necesito que estés cerca.", summary: "Actúa fría pero en realidad ama más profundo.", traits: ["Exterior frío", "El amor más profundo", "Mala expresándolo"], shareText: "Salí Fría Pero Ama Más Profundo 🧊 solo quédate cerca. ¿y tú?" },
  },
  {
    id: "perfectionist",
    gender: "f",
    imageFile: "perfectionist.png",
    celebs: [{ name: "박민영", work: "김비서가 왜 그럴까" }],
    tags: ["refined", "composed", "dominant", "sharp", "glamorous", "focused", "serious", "charismatic", "calculated"],
    worldVibes: ["corporate romance", "elite world", "romance arc"],
    ko: { name: "📋 완벽주의 여신형", quote: "실수는 없어. 계획에 없었던 거야.", summary: "모든 걸 완벽하게 해내는데 그게 자연스러운 타입.", traits: ["실수 = 없음", "완벽 = 기본값", "기준 높지만 충족"], shareText: "나 완벽주의 여신형 나왔어📋 너는?" },
    en: { name: "📋 Perfectionist Goddess", quote: "There are no mistakes. Just unplanned outcomes.", summary: "Does everything perfectly and makes it look effortless.", traits: ["Mistakes = nonexistent", "Perfection = default", "High standards met"], shareText: "I got Perfectionist Goddess 📋 no mistakes, just unplanned outcomes." },
    ja: { name: "📋 完璧主義女神型", quote: "失敗はない。計画になかっただけ。", summary: "全てを完璧にこなすのが当然のタイプ。", traits: ["失敗=なし", "完璧=デフォルト値", "基準高くて充足"], shareText: "完璧主義女神型が出た📋 あなたは？" },
    zh: { name: "📋 完美主义女神型", quote: "没有失误。只是不在计划之内。", summary: "把一切做得完美且看起来毫不费力。", traits: ["失误=不存在", "完美=默认值", "标准高但能达到"], shareText: "我得到了完美主义女神型📋 你呢？" },
    es: { name: "📋 Diosa Perfeccionista", quote: "No hay errores. Solo resultados no planificados.", summary: "Hace todo perfectamente y lo hace ver sin esfuerzo.", traits: ["Errores = inexistentes", "Perfección = por defecto", "Estándares altos cumplidos"], shareText: "Salí Diosa Perfeccionista 📋 no hay errores. ¿y tú?" },
  },
  {
    id: "untouchable",
    gender: "f",
    imageFile: "untouchable.png",
    celebs: [{ name: "한소희", work: "내 이름은" }],
    tags: ["intense", "determined", "cold", "sharp", "mysterious", "dark", "dominant", "passionate"],
    worldVibes: ["revenge arc", "crime thriller", "mystery thriller"],
    ko: { name: "⚡ 건들면 끝나는 여자", quote: "한 번만 더 해봐.", summary: "조용할 때는 진짜 조용한데 건들면 뭔가 일어남. 경고 한 번만 하는 타입.", traits: ["평소엔 조용함", "건들면 뭔가 일어남", "경고 한 번뿐"], shareText: "나 건들면 끝나는 여자 나왔어⚡ 한 번만 더 해봐 너는?" },
    en: { name: "⚡ Touch Me And It's Over", quote: "Try that one more time.", summary: "Quiet until something happens. Then something happens.", traits: ["Quiet by default", "Push her and see", "One warning only"], shareText: "I got Touch Me And It's Over ⚡ try that one more time." },
    ja: { name: "⚡ 手を出したら終わる女", quote: "もう一回やってみて。", summary: "普段は本当に静かだけど手を出すと何かが起きる。", traits: ["普段は静か", "手を出すと何かが起きる", "警告は一回だけ"], shareText: "手を出したら終わる女が出た⚡ あなたは？" },
    zh: { name: "⚡ 惹我就完了的女人", quote: "再试一次看看。", summary: "平时真的很安静，但惹了她就会发生点什么。", traits: ["平时很安静", "惹了就会发生什么", "只警告一次"], shareText: "我得到了惹我就完了的女人⚡ 你呢？" },
    es: { name: "⚡ Tócame Y Se Acabó", quote: "Inténtalo una vez más.", summary: "Tranquila hasta que pasa algo. Entonces pasa algo.", traits: ["Tranquila por defecto", "Provócala y verás", "Solo una advertencia"], shareText: "Salí Tócame Y Se Acabó ⚡ inténtalo una vez más. ¿y tú?" },
  },
  {
    id: "alien_charm",
    gender: "f",
    imageFile: "alien_charm.png",
    celebs: [{ name: "전지현", work: "별에서 온 그대" }],
    tags: ["charismatic", "colorful", "dramatic", "energetic", "mysterious", "glamorous", "bright", "passionate"],
    worldVibes: ["romance arc", "slice of life", "coming-of-age"],
    ko: { name: "👽 도라이 매력형", quote: "나 원래 이래. 싫으면 나가.", summary: "예측불가 행동이 전부 매력이 되어버리는 타입. 평범함을 거부.", traits: ["예측불가 = 매력", "평범함 거부", "본인만의 세계관"], shareText: "나 도라이 매력형 나왔어👽 원래 이래 너는?" },
    en: { name: "👽 Unpredictably Charismatic", quote: "I've always been like this. Leave if you don't like it.", summary: "Every unpredictable action becomes charming somehow.", traits: ["Unpredictable = charming", "Refuses ordinary", "Has their own world"], shareText: "I got Unpredictably Charismatic 👽 always been like this." },
    ja: { name: "👽 予測不能な魅力型", quote: "もともとこうなんだよ。嫌なら出てって。", summary: "予測不能な行動が全て魅力になってしまうタイプ。", traits: ["予測不能=魅力", "普通を拒否", "自分だけの世界観"], shareText: "予測不能な魅力型が出た👽 あなたは？" },
    zh: { name: "👽 不可预测的魅力型", quote: "我一直都这样。不喜欢就出去。", summary: "所有不可预测的行为都成了魅力的类型。", traits: ["不可预测=魅力", "拒绝平凡", "拥有自己的世界观"], shareText: "我得到了不可预测的魅力型👽 你呢？" },
    es: { name: "👽 Carismáticamente Impredecible", quote: "Siempre he sido así. Sal si no te gusta.", summary: "Cada acción impredecible se vuelve encantadora.", traits: ["Impredecible = encantador", "Se niega a ser ordinaria", "Tiene su propio mundo"], shareText: "Salí Carismáticamente Impredecible 👽 siempre he sido así. ¿y tú?" },
  },
  {
    id: "pretty_attitude",
    gender: "f",
    imageFile: "pretty_attitude.png",
    celebs: [{ name: "아이유", work: "호텔 델루나" }],
    tags: ["glamorous", "charismatic", "dramatic", "dominant", "sharp", "mysterious", "intense", "colorful"],
    worldVibes: ["romance arc", "elite world", "slice of life"],
    ko: { name: "🌙 예쁜데 성격 있는 여자", quote: "예쁘다고 만만하게 보면 안 되지.", summary: "외모는 완벽한데 성격도 장난 아닌 타입. 예쁜 게 무기이자 갑옷.", traits: ["외모 = 완벽", "성격도 장난 아님", "예쁜 게 갑옷"], shareText: "나 예쁜데 성격 있는 여자 나왔어🌙 만만하게 보지 마 너는?" },
    en: { name: "🌙 Pretty With An Attitude", quote: "Don't mistake my looks for weakness.", summary: "Perfect looks but the personality matches. Beauty is both weapon and armor.", traits: ["Looks = perfect", "Personality = fierce", "Beauty is the armor"], shareText: "I got Pretty With An Attitude 🌙 don't mistake my looks." },
    ja: { name: "🌙 綺麗だけど性格もある女", quote: "可愛いからって舐めないでよ。", summary: "外見は完璧だが性格も半端ない。可愛さが武器であり鎧。", traits: ["外見=完璧", "性格も半端ない", "可愛さが鎧"], shareText: "綺麗だけど性格もある女が出た🌙 あなたは？" },
    zh: { name: "🌙 漂亮但有个性的女人", quote: "别因为我漂亮就小看我。", summary: "外貌完美但个性也不含糊。美丽既是武器也是盔甲。", traits: ["外貌=完美", "个性也不含糊", "美丽是盔甲"], shareText: "我得到了漂亮但有个性的女人🌙 你呢？" },
    es: { name: "🌙 Bonita Con Actitud", quote: "No confundas mi apariencia con debilidad.", summary: "Apariencia perfecta pero la personalidad está a la altura.", traits: ["Apariencia = perfecta", "Personalidad = feroz", "La belleza es la armadura"], shareText: "Salí Bonita Con Actitud 🌙 no confundas mi apariencia. ¿y tú?" },
  },

  // ── 신규 7개: 기존 이미지 활용 ───────────────────────────────────────────
  {
    id: "secretary_perfectionist",
    imageFile: "김비서 박민영형 (완벽주의 여신).png",
    celebs: [{ name: "박민영", work: "김비서가 왜 그럴까" }],
    tags: ["refined", "composed", "sharp", "focused", "minimal", "determined", "glamorous"],
    worldVibes: ["corporate romance", "elite world", "romance arc"],
    ko: { name: "💼 완벽주의 비서", quote: "제가 못 하는 건 없어요. 단지 하기 싫을 뿐.", summary: "모든 것을 완벽하게 해내면서도 속으로 '이게 맞나?' 하는 타입.", traits: ["멀티태스킹 신", "완벽주의자", "속으론 딴 생각"], shareText: "나 완벽주의 비서 나왔어💼 못 하는 건 없음 너는?" },
    en: { name: "💼 The Perfectionist Assistant", quote: "There's nothing I can't do. I just choose not to.", summary: "Does everything flawlessly while secretly questioning all of it.", traits: ["Multitasking god", "Perfectionist", "Secretly over it"], shareText: "I got The Perfectionist Assistant 💼 nothing I can't do." },
    ja: { name: "💼 完璧主義のアシスタント", quote: "できないことなんてない。ただやりたくないだけ。", summary: "すべてを完璧にこなしながら、内心では違うことを考えているタイプ。", traits: ["マルチタスクの神", "完璧主義", "心の中では諦め気味"], shareText: "完璧主義のアシスタントが出た💼 あなたは？" },
    zh: { name: "💼 完美主义助理", quote: "没有我做不到的事，只是不想做而已。", summary: "把一切都做得完美，但内心却在怀疑这一切。", traits: ["多任务之神", "完美主义", "内心已放弃"], shareText: "我得到了完美主义助理💼 你呢？" },
    es: { name: "💼 La Asistente Perfeccionista", quote: "No hay nada que no pueda hacer. Solo elijo no hacerlo.", summary: "Lo hace todo sin fallas mientras secretamente lo cuestiona todo.", traits: ["Dios del multitasking", "Perfeccionista", "Secretamente harta"], shareText: "Salí La Asistente Perfeccionista 💼 ¿y tú?" },
  },
  {
    id: "dont_mess",
    imageFile: "내이름 한소희형 (건들면 끝남).png",
    celebs: [{ name: "한소희", work: "마이 네임" }, { name: "전지현", work: "도둑들" }],
    tags: ["intense", "dominant", "dark", "determined", "charismatic", "sharp", "passionate"],
    worldVibes: ["revenge arc", "crime thriller", "redemption arc"],
    ko: { name: "🔥 건들면 끝나는 여자", quote: "한 번만 더 해봐. 한 번만.", summary: "겉으로는 조용한데 건드리면 진짜 끝나는 타입. 눈빛에 경고문 달려 있음.", traits: ["경고 눈빛", "건드리면 즉시 반격", "조용할수록 위험"], shareText: "나 건들면 끝나는 여자 나왔어🔥 한 번만 더 해봐 너는?" },
    en: { name: "🔥 Don't Even Try It", quote: "Go ahead. Try me. One more time.", summary: "Quiet on the surface but terrifying when provoked. Warning label in her eyes.", traits: ["Warning-eye stare", "Instant retaliation", "Quieter = more dangerous"], shareText: "I got Don't Even Try It 🔥 go ahead, try me." },
    ja: { name: "🔥 触れたら終わる女", quote: "もう一度やってみて。一度だけ。", summary: "外見は静かだが、触れたら本当に終わるタイプ。眼差しに警告文がある。", traits: ["警告の眼差し", "即反撃", "静かなほど危険"], shareText: "触れたら終わる女が出た🔥 あなたは？" },
    zh: { name: "🔥 别惹我的女人", quote: "再来一次试试。就一次。", summary: "表面安静，但一旦惹怒就真的会结束。眼神里带着警告。", traits: ["警告眼神", "即刻反击", "越安静越危险"], shareText: "我得到了别惹我的女人🔥 你呢？" },
    es: { name: "🔥 No La Provoques", quote: "Hazlo otra vez. Solo una vez más.", summary: "Tranquila en la superficie pero aterradora cuando la provocan.", traits: ["Mirada de advertencia", "Represalia inmediata", "Más callada = más peligrosa"], shareText: "Salí No La Provoques 🔥 ¿y tú?" },
  },
  {
    id: "cold_deep_love",
    imageFile: "눈물의여왕 김지원형 (차가운데 사랑 깊음).png",
    celebs: [{ name: "김지원", work: "눈물의 여왕" }, { name: "김태희", work: "마이프린세스" }],
    tags: ["cold", "refined", "composed", "intense", "dominant", "gentle"],
    worldVibes: ["elite world", "romance arc", "corporate romance"],
    ko: { name: "🥶 차갑지만 사랑은 깊은 사람", quote: "티 안 내는 거야. 아예 없는 게 아니라.", summary: "표정은 항상 냉정한데 뒤에서 몰래 다 챙기고 있는 타입.", traits: ["냉정한 표정", "뒤에서 몰래 챙김", "사랑 표현 서툼"], shareText: "나 차갑지만 사랑은 깊은 사람 나왔어🥶 티만 안 낼 뿐 너는?" },
    en: { name: "🥶 Cold Outside Warm Inside", quote: "I don't show it. Doesn't mean it's not there.", summary: "Always composed — but secretly takes care of everyone when they're not looking.", traits: ["Poker face", "Secret caretaker", "Bad at expressing love"], shareText: "I got Cold Outside Warm Inside 🥶 it's there, just hidden." },
    ja: { name: "🥶 冷たいけど愛は深い人", quote: "表に出さないだけ。ないわけじゃない。", summary: "表情はいつも冷静だが、陰でひそかに全員の面倒を見ている。", traits: ["ポーカーフェイス", "陰で気遣う", "愛の表現が苦手"], shareText: "冷たいけど愛は深い人が出た🥶 あなたは？" },
    zh: { name: "🥶 外冷内热的人", quote: "只是不表现出来，不代表没有。", summary: "表情总是冷静，但背地里悄悄照顾着所有人。", traits: ["扑克脸", "背后默默照顾", "不擅表达爱意"], shareText: "我得到了外冷内热的人🥶 你呢？" },
    es: { name: "🥶 Frío Por Fuera Cálido Por Dentro", quote: "No lo muestro. Eso no significa que no esté ahí.", summary: "Siempre sereno pero secretamente cuida de todos cuando nadie mira.", traits: ["Cara de póker", "Cuidador secreto", "Malo expresando amor"], shareText: "Salí Frío Por Fuera Cálido Por Dentro 🥶 ¿y tú?" },
  },
  {
    id: "graceful_avenger",
    imageFile: "더글로리 송혜교형 (웃는데 무서움).png",
    celebs: [{ name: "송혜교", work: "더 글로리" }],
    tags: ["calculated", "glamorous", "dark", "composed", "sharp", "charismatic", "focused"],
    worldVibes: ["revenge arc", "mystery thriller", "political drama"],
    ko: { name: "🌹 우아한 복수자", quote: "기다렸어. 이 순간을 오래.", summary: "아무도 모르는 사이 완벽한 복수를 준비해 온 타입. 우아함이 곧 무기.", traits: ["우아함 = 무기", "오래 기다렸음", "완벽한 계획"], shareText: "나 우아한 복수자 나왔어🌹 오래 기다렸어 너는?" },
    en: { name: "🌹 The Graceful Avenger", quote: "I've been waiting. A very long time.", summary: "Has been quietly preparing perfect revenge while everyone else moved on.", traits: ["Elegance as weapon", "Waited a long time", "Perfect plan"], shareText: "I got The Graceful Avenger 🌹 I've been waiting." },
    ja: { name: "🌹 優雅な復讐者", quote: "待ってたよ。この瞬間をずっと。", summary: "誰も気づかないうちに完璧な復讐を準備してきたタイプ。", traits: ["優雅さ=武器", "長く待った", "完璧な計画"], shareText: "優雅な復讐者が出た🌹 あなたは？" },
    zh: { name: "🌹 优雅的复仇者", quote: "我等了很久，这一刻。", summary: "在所有人都遗忘的时候，悄悄准备着完美的复仇。", traits: ["优雅是武器", "等待已久", "完美计划"], shareText: "我得到了优雅的复仇者🌹 你呢？" },
    es: { name: "🌹 La Vengadora Elegante", quote: "He estado esperando. Mucho tiempo.", summary: "Ha estado preparando la venganza perfecta mientras todos seguían adelante.", traits: ["Elegancia como arma", "Esperó mucho tiempo", "Plan perfecto"], shareText: "Salí La Vengadora Elegante 🌹 ¿y tú?" },
  },
  {
    id: "realistic_worker",
    imageFile: "미생 임시완형 (현실 직장인상).png",
    celebs: [{ name: "임시완", work: "미생" }, { name: "이제훈", work: "파이터" }],
    tags: ["determined", "focused", "serious", "minimal", "calm", "gentle", "natural"],
    worldVibes: ["slice of life", "corporate romance", "coming-of-age"],
    ko: { name: "📋 현실 직장인", quote: "오늘도 살아남았다. 내일도 살아남을 것이다.", summary: "화려하진 않지만 묵묵히 버티는 타입. 가장 현실적인 K-드라마 주인공.", traits: ["조용한 생존력", "묵묵히 버팀", "퇴근이 유일한 낙"], shareText: "나 현실 직장인 나왔어📋 오늘도 살아남았다 너는?" },
    en: { name: "📋 The Real Office Survivor", quote: "Survived today. Will survive tomorrow.", summary: "Not glamorous but endures quietly. The most realistic K-drama lead.", traits: ["Silent endurance", "Quietly persists", "Lives for clocking out"], shareText: "I got The Real Office Survivor 📋 I'm still here." },
    ja: { name: "📋 現実の会社員", quote: "今日も生き延びた。明日も生き延びる。", summary: "華やかではないが、黙々と耐え続けるタイプ。最もリアルなKドラマ主人公。", traits: ["静かな生存力", "黙々と耐える", "退勤が唯一の楽しみ"], shareText: "現実の会社員が出た📋 あなたは？" },
    zh: { name: "📋 现实职场人", quote: "今天也活下来了。明天也会活下去。", summary: "不华丽，但默默坚持。最真实的K剧主角。", traits: ["默默的生存力", "默默坚持", "下班是唯一快乐"], shareText: "我得到了现实职场人📋 你呢？" },
    es: { name: "📋 El Superviviente de Oficina", quote: "Sobreviví hoy. Sobreviviré mañana.", summary: "No glamoroso pero aguanta en silencio. El protagonista más realista.", traits: ["Resistencia silenciosa", "Persiste callado", "Vive para salir del trabajo"], shareText: "Salí El Superviviente de Oficina 📋 ¿y tú?" },
  },
  {
    id: "quiet_terror",
    imageFile: "빈센조 송중기형 (조용히 무서움).png",
    celebs: [{ name: "송중기", work: "빈센조" }, { name: "이준기", work: "악의 꽃" }],
    tags: ["dark", "composed", "minimal", "calculated", "dominant", "charismatic", "calm"],
    worldVibes: ["crime empire", "crime thriller", "revenge arc"],
    ko: { name: "🕴️ 조용히 무서운 남자", quote: "화 안 냈어. 근데... 잊지 않을 거야.", summary: "소리 지르지 않아서 더 무서운 타입. 조용할수록 더 위험.", traits: ["침묵 = 공포", "기억력 = 형벌", "화 안 냄 = 더 무서움"], shareText: "나 조용히 무서운 남자 나왔어🕴️ 화 안 냈어 너는?" },
    en: { name: "🕴️ Quietly Terrifying", quote: "I'm not angry. But I won't forget.", summary: "Scarier because he doesn't raise his voice. The quieter, the more dangerous.", traits: ["Silence = terror", "Memory = punishment", "No anger = scarier"], shareText: "I got Quietly Terrifying 🕴️ I'm not angry, but I remember." },
    ja: { name: "🕴️ 静かに恐ろしい男", quote: "怒ってない。でも…忘れないから。", summary: "声を荒げないから余計怖いタイプ。静かなほどもっと危険。", traits: ["沈黙=恐怖", "記憶力=刑罰", "怒らない=より怖い"], shareText: "静かに恐ろしい男が出た🕴️ あなたは？" },
    zh: { name: "🕴️ 悄悄可怕的男人", quote: "我没有生气。但是……我不会忘记。", summary: "因为不提高嗓门所以更可怕。越安静越危险。", traits: ["沉默=恐怖", "记忆=惩罚", "不生气=更可怕"], shareText: "我得到了悄悄可怕的男人🕴️ 你呢？" },
    es: { name: "🕴️ Silenciosamente Aterrador", quote: "No estoy enojado. Pero no lo olvidaré.", summary: "Más aterrador porque no levanta la voz. Cuanto más callado, más peligroso.", traits: ["Silencio = terror", "Memoria = castigo", "Sin enojo = más aterrador"], shareText: "Salí Silenciosamente Aterrador 🕴️ ¿y tú?" },
  },
  {
    id: "straight_passion",
    imageFile: "이태원클라쓰 박서준형 (직진 열정형).png",
    celebs: [{ name: "박서준", work: "이태원 클라쓰" }, { name: "이준호", work: "2PM" }],
    tags: ["passionate", "determined", "energetic", "active", "warm", "bright", "charismatic"],
    worldVibes: ["redemption arc", "slice of life", "romance arc"],
    ko: { name: "🏃 직진 열정형", quote: "포기? 그게 뭔데.", summary: "논리가 없어도 열정 하나로 밀어붙이는 타입. 눈에 불꽃이 꺼지지 않음.", traits: ["포기 모르는 타입", "열정 = 전략", "눈에 불꽃 있음"], shareText: "나 직진 열정형 나왔어🏃 포기? 그게 뭔데 너는?" },
    en: { name: "🏃 The Unstoppable Dreamer", quote: "Give up? What does that even mean?", summary: "Runs on passion even without a plan. The fire in their eyes never goes out.", traits: ["Doesn't know quit", "Passion = strategy", "Fire in the eyes"], shareText: "I got The Unstoppable Dreamer 🏃 giving up isn't in my dictionary." },
    ja: { name: "🏃 一直線の情熱型", quote: "諦める？それって何？", summary: "論理がなくても情熱だけで突き進むタイプ。目の炎が消えない。", traits: ["諦めを知らない", "情熱=戦略", "目に炎"], shareText: "一直線の情熱型が出た🏃 あなたは？" },
    zh: { name: "🏃 直冲热情型", quote: "放弃？那是什么？", summary: "没有计划也能靠热情一路冲到底。眼中的火焰永不熄灭。", traits: ["不知放弃", "热情=策略", "眼中有火"], shareText: "我得到了直冲热情型🏃 你呢？" },
    es: { name: "🏃 El Soñador Imparable", quote: "¿Rendirse? ¿Eso qué es?", summary: "Funciona con pasión aunque no tenga plan. El fuego en sus ojos nunca se apaga.", traits: ["No conoce rendirse", "Pasión = estrategia", "Fuego en los ojos"], shareText: "Salí El Soñador Imparable 🏃 ¿y tú?" },
  },

  // ── 신규 8개: 추가 아키타입 ────────────────────────────────────────────────
  {
    id: "second_lead",
    imageFile: "first_sight.png",
    celebs: [{ name: "옹성우", work: "18 어게인" }, { name: "정해인", work: "밥 잘 사주는 예쁜 누나" }],
    tags: ["warm", "loyal", "gentle", "soft", "calm", "natural", "charming"],
    worldVibes: ["romance arc", "slice of life", "campus romance"],
    ko: { name: "💔 2번 주인공 (진짜 좋은 남자)", quote: "괜찮아. 네가 행복하면 돼.", summary: "항상 옆에 있었는데 끝까지 주인공 못 된 타입. 근데 진짜 제일 좋은 남자임.", traits: ["항상 옆에 있었음", "진짜 좋은 남자", "선택 못 받아서 슬픔"], shareText: "나 2번 주인공 나왔어💔 진짜 좋은 남자인데 너는?" },
    en: { name: "💔 Second Lead (The Good One)", quote: "It's okay. As long as you're happy.", summary: "Was always there but never got chosen. Actually the best option.", traits: ["Always there", "Actually the best guy", "Passed over unfairly"], shareText: "I got Second Lead 💔 I was the right choice the whole time." },
    ja: { name: "💔 2番主人公（本当にいい男）", quote: "大丈夫。君が幸せならいい。", summary: "ずっとそばにいたのに、最後まで選ばれなかったタイプ。本当は一番いい男なのに。", traits: ["ずっとそこにいた", "本当にいい男", "選ばれなくて切ない"], shareText: "2番主人公が出た💔 あなたは？" },
    zh: { name: "💔 第二男主（真正的好男人）", quote: "没关系。只要你幸福就好。", summary: "一直都在，却始终没被选择。其实是最好的选项。", traits: ["一直在旁边", "真正的好男人", "被辜负了"], shareText: "我得到了第二男主💔 你呢？" },
    es: { name: "💔 El Segundo Protagonista (El Bueno)", quote: "Está bien. Con que seas feliz.", summary: "Siempre estuvo ahí pero nunca fue elegido. En realidad la mejor opción.", traits: ["Siempre estuvo ahí", "En realidad el mejor", "Pasado por alto injustamente"], shareText: "Salí El Segundo Protagonista 💔 ¿y tú?" },
  },
  {
    id: "healing_type",
    imageFile: "first_sight.png",
    celebs: [{ name: "이도현", work: "청춘기록" }, { name: "서강준", work: "당신이 잠든 사이에" }],
    tags: ["warm", "gentle", "soft", "friendly", "natural", "light", "calm"],
    worldVibes: ["medical romance", "slice of life", "romance arc"],
    ko: { name: "🌿 힐링 그 자체", quote: "옆에 있으면 그냥... 숨이 쉬어져.", summary: "말 안 해도 편안한 타입. 존재 자체가 힐링. 드라마에서 가장 필요한 사람.", traits: ["존재 = 힐링", "말 없이도 편함", "드라마 쉼표 역할"], shareText: "나 힐링 그 자체 나왔어🌿 옆에 있으면 숨이 쉬어져 너는?" },
    en: { name: "🌿 Pure Healing Energy", quote: "Something about you just... lets me breathe.", summary: "Calming without even trying. Their existence is the healing. Drama's emotional reset button.", traits: ["Existence = healing", "Effortlessly calming", "Emotional reset button"], shareText: "I got Pure Healing Energy 🌿 just being here helps." },
    ja: { name: "🌿 ヒーリングそのもの", quote: "そばにいると、なんか…息ができる。", summary: "何も言わなくても落ち着くタイプ。存在自体がヒーリング。", traits: ["存在=ヒーリング", "無言でも落ち着く", "ドラマの休憩役"], shareText: "ヒーリングそのものが出た🌿 あなたは？" },
    zh: { name: "🌿 治愈本身", quote: "在你身边，就能……呼吸了。", summary: "不用说话就让人平静的类型。存在本身就是治愈。", traits: ["存在=治愈", "无声中也平静", "剧情的喘息时刻"], shareText: "我得到了治愈本身🌿 你呢？" },
    es: { name: "🌿 Energía Sanadora Pura", quote: "Algo en ti simplemente... me deja respirar.", summary: "Calmante sin esfuerzo. Su existencia es la sanación. El botón de reinicio emocional.", traits: ["Existencia = sanación", "Calmante sin esfuerzo", "Botón de reinicio emocional"], shareText: "Salí Energía Sanadora Pura 🌿 ¿y tú?" },
  },
  {
    id: "innocent_plotter",
    imageFile: "revenge_women.png",
    celebs: [{ name: "수지", work: "사랑의 불시착" }, { name: "아이유", work: "호텔 델루나" }],
    tags: ["calculated", "bright", "charming", "light", "focused", "mysterious", "dramatic"],
    worldVibes: ["political drama", "rivals-to-lovers", "mystery thriller"],
    ko: { name: "🐰 귀여운데 사실 다 알고 있음", quote: "어머, 그랬어요? 저는 몰랐어요~ (다 알고 있었음)", summary: "해맑은 척하지만 사실 모든 걸 파악하고 있는 타입. 가장 무서운 유형.", traits: ["해맑음 = 위장", "다 파악하고 있음", "순진한 척 최고수"], shareText: "나 귀여운데 사실 다 알고 있음 나왔어🐰 나 다 알고 있어 너는?" },
    en: { name: "🐰 Cute But Knows Everything", quote: "Oh really? I had no idea~ (Knew the whole time)", summary: "Acts innocent but has clocked everything. Actually the most dangerous type.", traits: ["Innocence = disguise", "Knows everything", "Master of acting naive"], shareText: "I got Cute But Knows Everything 🐰 I knew the whole time." },
    ja: { name: "🐰 かわいいけど全部わかってる", quote: "あら、そうなの？知らなかった〜（全部知ってた）", summary: "無邪気なふりをしているが、実は全部把握しているタイプ。最も怖い。", traits: ["無邪気=偽装", "全部把握済み", "無知なふりの達人"], shareText: "かわいいけど全部わかってるが出た🐰 あなたは？" },
    zh: { name: "🐰 可爱但其实什么都知道", quote: "哎呀，是吗？我不知道呀~（其实全知道）", summary: "装作天真，但其实对一切了如指掌。其实是最危险的类型。", traits: ["天真=伪装", "什么都知道", "装傻装到极致"], shareText: "我得到了可爱但其实什么都知道🐰 你呢？" },
    es: { name: "🐰 Adorable Pero Todo Lo Sabe", quote: "¿En serio? No tenía ni idea~ (Lo sabía todo el tiempo)", summary: "Actúa inocente pero lo ha calculado todo. El tipo más peligroso.", traits: ["Inocencia = disfraz", "Sabe todo", "Maestro del despiste"], shareText: "Salí Adorable Pero Todo Lo Sabe 🐰 ¿y tú?" },
  },
  {
    id: "stoic_guardian",
    imageFile: "rich.png",
    celebs: [{ name: "지창욱", work: "악인전" }, { name: "김래원", work: "보스를 지켜라" }],
    tags: ["serious", "dominant", "calm", "focused", "sharp", "loyal", "composed"],
    worldVibes: ["crime thriller", "crime empire", "found family"],
    ko: { name: "🛡️ 말없이 지키는 사람", quote: "말 안 해도 알잖아. 내가 여기 있다는 거.", summary: "소리 없이 옆에 있어주는 타입. 위기 순간에 항상 먼저 나타남.", traits: ["말 없는 수호자", "위기에 먼저 나타남", "신뢰 자체"], shareText: "나 말없이 지키는 사람 나왔어🛡️ 내가 여기 있어 너는?" },
    en: { name: "🛡️ The Silent Guardian", quote: "You know without me saying. I'm here.", summary: "Protects without announcement. Always appears first in a crisis.", traits: ["Silent protector", "Appears first in crisis", "Embodies trust"], shareText: "I got The Silent Guardian 🛡️ I'm right here." },
    ja: { name: "🛡️ 無言で守る人", quote: "言わなくてもわかるでしょ。俺はここにいる。", summary: "静かに傍にいてくれるタイプ。危機の瞬間には必ず最初に現れる。", traits: ["無言の守護者", "危機に真っ先に登場", "信頼そのもの"], shareText: "無言で守る人が出た🛡️ あなたは？" },
    zh: { name: "🛡️ 默默守护的人", quote: "不用说你也知道。我在这里。", summary: "悄悄陪在身边的类型。危机时刻总是第一个出现。", traits: ["无声守护者", "危机时最先出现", "信赖本身"], shareText: "我得到了默默守护的人🛡️ 你呢？" },
    es: { name: "🛡️ El Guardián Silencioso", quote: "Lo sabes sin que lo diga. Estoy aquí.", summary: "Protege sin anunciarlo. Siempre aparece primero en una crisis.", traits: ["Protector silencioso", "Primero en la crisis", "Encarna la confianza"], shareText: "Salí El Guardián Silencioso 🛡️ ¿y tú?" },
  },
  {
    id: "chaotic_wild",
    imageFile: "dex.png",
    celebs: [{ name: "김범", work: "청소년 재판" }, { name: "송강", work: "나의 해방일지" }],
    tags: ["energetic", "colorful", "dramatic", "bright", "charismatic", "active", "passionate"],
    worldVibes: ["coming-of-age", "campus romance", "slice of life"],
    ko: { name: "🌪️ 예측 불가 에너지 폭탄", quote: "인생은 계획대로 되는 게 아니잖아!", summary: "어디 튈지 모르는 타입. 주변을 항상 설레게 하거나 피곤하게 함.", traits: ["예측 불가", "주변 설레게 함", "또는 피곤하게 함"], shareText: "나 예측 불가 에너지 폭탄 나왔어🌪️ 내가 어디 튈지 몰라 너는?" },
    en: { name: "🌪️ Unpredictable Energy Bomb", quote: "Life doesn't go according to plan anyway!", summary: "Nobody knows where this one's headed. Either thrilling or exhausting.", traits: ["Totally unpredictable", "Either thrilling", "Or exhausting"], shareText: "I got Unpredictable Energy Bomb 🌪️ nobody knows what I'll do next." },
    ja: { name: "🌪️ 予測不能エネルギー爆弾", quote: "人生って計画通りにいかないじゃない！", summary: "どこへ飛んでいくかわからないタイプ。周りをワクワクさせるか疲れさせるか。", traits: ["予測不能", "周りをワクワクさせる", "または疲れさせる"], shareText: "予測不能エネルギー爆弾が出た🌪️ あなたは？" },
    zh: { name: "🌪️ 不可预测的能量炸弹", quote: "人生本来就不按计划走嘛！", summary: "不知道会飞到哪里的类型。让周围的人时而兴奋，时而疲惫。", traits: ["完全不可预测", "让人兴奋", "或者让人疲惫"], shareText: "我得到了不可预测的能量炸弹🌪️ 你呢？" },
    es: { name: "🌪️ Bomba de Energía Impredecible", quote: "¡La vida no va según el plan de todos modos!", summary: "Nadie sabe hacia dónde va este. O emocionante o agotador.", traits: ["Totalmente impredecible", "O emocionante", "O agotador"], shareText: "Salí Bomba de Energía Impredecible 🌪️ ¿y tú?" },
  },
  {
    id: "historical_noble",
    imageFile: "ceo.png",
    celebs: [{ name: "이준기", work: "달의 연인" }, { name: "유아인", work: "육룡이 나르샤" }],
    tags: ["regal", "majestic", "composed", "calm", "refined", "serious", "intense"],
    worldVibes: ["historical romance", "royal court", "political drama"],
    ko: { name: "🏯 시대를 잘못 타고난 귀족", quote: "이 시대는 나를 담기에 좁다.", summary: "현대에 태어났지만 고전 드라마 주인공 기운을 발산하는 타입.", traits: ["시대착오적 귀족미", "고전 드라마 주인공", "품격 자체"], shareText: "나 시대를 잘못 타고난 귀족 나왔어🏯 이 시대는 나를 담기에 좁아 너는?" },
    en: { name: "🏯 Noble Born in the Wrong Era", quote: "This era is too small to contain me.", summary: "Born in the modern world but radiates historical drama protagonist energy.", traits: ["Anachronistic nobility", "Historical drama lead", "Grace personified"], shareText: "I got Noble Born in the Wrong Era 🏯 this era can't contain me." },
    ja: { name: "🏯 時代を間違えて生まれた貴族", quote: "この時代は私を収めるには狭すぎる。", summary: "現代に生まれながら、時代劇の主人公のオーラを放つタイプ。", traits: ["時代錯誤の貴族美", "時代劇の主人公", "気品そのもの"], shareText: "時代を間違えて生まれた貴族が出た🏯 あなたは？" },
    zh: { name: "🏯 生错时代的贵族", quote: "这个时代太小，容不下我。", summary: "生于现代，却散发着古装剧主角的气场。", traits: ["时代错位的贵族气质", "古装剧主角", "气度本身"], shareText: "我得到了生错时代的贵族🏯 你呢？" },
    es: { name: "🏯 Noble Nacido en la Era Equivocada", quote: "Esta era es demasiado pequeña para contenerme.", summary: "Nacido en el mundo moderno pero irradia energía de protagonista de drama histórico.", traits: ["Nobleza anacrónica", "Protagonista histórico", "Gracia personificada"], shareText: "Salí Noble Nacido en la Era Equivocada 🏯 ¿y tú?" },
  },
  {
    id: "genius_disaster",
    imageFile: "ceo.png",
    celebs: [{ name: "주지훈", work: "의사요한" }, { name: "조승우", work: "비밀의 숲" }],
    tags: ["sharp", "focused", "composed", "minimal", "light", "determined", "mysterious"],
    worldVibes: ["medical romance", "detective duo", "corporate romance"],
    ko: { name: "🧠 천재인데 사회생활 0점", quote: "제 IQ가 문제가 아니에요. 당신들 이해력이 문제예요.", summary: "해당 분야 최고 천재인데 밥 먹는 걸 까먹는 타입.", traits: ["분야 최고 천재", "생활력 제로", "밥 먹는 걸 까먹음"], shareText: "나 천재인데 사회생활 0점 나왔어🧠 당신들 이해력이 문제예요 너는?" },
    en: { name: "🧠 Genius, Zero Social Skills", quote: "My IQ isn't the problem. Your comprehension is.", summary: "Best in their field but forgets to eat. Social interaction is a foreign language.", traits: ["Field's top genius", "Life skills: zero", "Forgets to eat"], shareText: "I got Genius, Zero Social Skills 🧠 your comprehension is the problem." },
    ja: { name: "🧠 天才だけど社会性ゼロ", quote: "私のIQが問題じゃない。あなたたちの理解力が問題。", summary: "その分野のトップ天才だが、ご飯を食べるのを忘れるタイプ。", traits: ["分野トップの天才", "生活力ゼロ", "ご飯を忘れる"], shareText: "天才だけど社会性ゼロが出た🧠 あなたは？" },
    zh: { name: "🧠 天才但社交零分", quote: "不是我的智商有问题，是你们的理解力有问题。", summary: "该领域最顶尖的天才，但会忘记吃饭。社交是另一个星球的语言。", traits: ["领域顶尖天才", "生活能力零", "忘记吃饭"], shareText: "我得到了天才但社交零分🧠 你呢？" },
    es: { name: "🧠 Genio, Cero Habilidades Sociales", quote: "Mi CI no es el problema. Tu comprensión sí.", summary: "El mejor en su campo pero se olvida de comer. La interacción social es un idioma extranjero.", traits: ["Genio de su campo", "Habilidades de vida: cero", "Se olvida de comer"], shareText: "Salí Genio, Cero Habilidades Sociales 🧠 ¿y tú?" },
  },
  {
    id: "neighborhood_hero",
    imageFile: "first_sight.png",
    celebs: [{ name: "유연석", work: "응급남녀" }, { name: "고경표", work: "응답하라 1988" }],
    tags: ["warm", "loyal", "natural", "friendly", "gentle", "bright", "active"],
    worldVibes: ["slice of life", "found family", "coming-of-age"],
    ko: { name: "🏘️ 동네 영웅", quote: "내가 할게. 어디 가지 마.", summary: "아무도 시키지 않았는데 제일 먼저 나타나서 도와주는 타입.", traits: ["항상 제일 먼저 나타남", "아무도 안 시켰음", "진짜 좋은 사람"], shareText: "나 동네 영웅 나왔어🏘️ 내가 할게 너는?" },
    en: { name: "🏘️ The Neighborhood Hero", quote: "I've got it. Don't go anywhere.", summary: "Showed up first without anyone asking. The genuinely good person.", traits: ["Always shows up first", "Nobody asked them to", "Actually a great person"], shareText: "I got The Neighborhood Hero 🏘️ I've got it, don't worry." },
    ja: { name: "🏘️ 近所のヒーロー", quote: "俺がやる。どこにも行かないで。", summary: "誰も頼んでいないのに一番先に現れて助けてくれるタイプ。", traits: ["いつも真っ先に現れる", "頼まれていない", "本当にいい人"], shareText: "近所のヒーローが出た🏘️ あなたは？" },
    zh: { name: "🏘️ 街区英雄", quote: "我来。你别走。", summary: "没有人叫他，却第一个出现帮忙的类型。真正的好人。", traits: ["总是第一个出现", "没人叫他", "真正的好人"], shareText: "我得到了街区英雄🏘️ 你呢？" },
    es: { name: "🏘️ El Héroe del Barrio", quote: "Yo me encargo. No te vayas.", summary: "Apareció primero sin que nadie pidiera. La persona genuinamente buena.", traits: ["Siempre aparece primero", "Nadie lo pidió", "Realmente buena persona"], shareText: "Salí El Héroe del Barrio 🏘️ ¿y tú?" },
  },
];

// ─── 설정 ─────────────────────────────────────────────────────────────────────
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

// ─── 성별 고려 캐릭터 매칭 ───────────────────────────────────────────────────
function pickByTagsAndGender(tags, worldVibe, gender) {
  // 성별 필터링
  let pool = CHARACTERS;
  if (gender === "m") {
    pool = CHARACTERS.filter(c => c.gender === "m");
  } else if (gender === "f") {
    pool = CHARACTERS.filter(c => c.gender === "f");
  }
  // 풀이 비어있으면 전체 사용
  if (pool.length === 0) pool = CHARACTERS;

  let best = pool[0], bestScore = -1;
  for (const c of pool) {
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
    gender: character.gender,
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
                text: `Analyze this person's gender, outfit, expression, posture, and overall vibe for a K-Drama character matching app.
Do NOT identify the person. Return ONLY valid JSON, no markdown, no explanation:
{"gender":"string","caption":"string","tags":["string"],"worldVibe":"string","matchScore":0,"charisma":0,"plotArmor":0,"dramaPotential":0}

gender: "m" for male, "f" for female, "n" if unclear.
caption: one witty punchy English sentence about their K-Drama energy.
Allowed tags (pick 4-6): ${JSON.stringify(ALLOWED_TAGS)}
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
      catch { throw new Error("JSON parse failed: " + raw.slice(0, 200)); }

      const tags = normalizeArr(parsed.tags);
      const worldVibe = typeof parsed.worldVibe === "string" ? parsed.worldVibe.toLowerCase().trim() : "romance arc";
      const gender = typeof parsed.gender === "string" ? parsed.gender.toLowerCase().trim() : "n";
      const character = pickByTagsAndGender(tags, worldVibe, gender);

      console.log(`✅ Groq 분석 성공 → ${character.id} (성별: ${gender})`);
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

  const character = pickRandom();
  console.log("🎲 랜덤 매칭 →", character.id);
  return res.json(buildResponse(imageUrl, character, { analysisMethod: "random" }));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
