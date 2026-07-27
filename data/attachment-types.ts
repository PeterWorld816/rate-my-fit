export type AttachmentAxis = "secure" | "anxious" | "avoidant" | "disorganized";
export type Lang = "ko" | "en" | "ja" | "zh" | "es";

export type MatchInfo = { code: string; reason: string };
export type SimilarFigure = { name: string; description: string };

export type AttachmentTypeLangContent = {
  name: string;
  catchphrase: string;
  strengths: [string, string, string];
  weaknesses: [string, string, string];
  bestMatch: MatchInfo;
  worstMatch: MatchInfo;
  similarFigures: SimilarFigure[];
};

export type AttachmentType = {
  code: string;
  primaryAxis: AttachmentAxis;
  secondaryAxis: AttachmentAxis | null;
  ko: AttachmentTypeLangContent;
  en: AttachmentTypeLangContent;
  ja: AttachmentTypeLangContent;
  zh: AttachmentTypeLangContent;
  es: AttachmentTypeLangContent;
};

// Per-axis identity shared across the whole UI. Hybrid types blend
// primaryAxis -> secondaryAxis; pure types use their own axis for both ends
// of every gradient. Kept as data (not per-type fields) so the 16 types
// never drift out of sync with each other.
//
// Two color tiers per axis:
// - colorFrom/colorTo: saturated, used for small vivid elements (badges,
//   percent-bar fills) that need to pop regardless of page background.
// - bgFrom/bgTo: light, airy tones for full-page result-screen backgrounds.
//   avoidant's bg intentionally stays bright blue, not navy, per design brief.
// - textAccent: a darker shade of the same hue, tuned for ~4.5:1 contrast
//   against its own bgFrom/bgTo so headings/links stay readable on the tint.
export const AXIS_META: Record<
  AttachmentAxis,
  {
    emoji: string;
    colorFrom: string;
    colorTo: string;
    bgFrom: string;
    bgTo: string;
    textAccent: string;
    label: Record<Lang, string>;
  }
> = {
  secure: {
    emoji: "🌊",
    colorFrom: "#2dd4bf",
    colorTo: "#14b8a6",
    bgFrom: "#e3fdf6",
    bgTo: "#b8f3e6",
    textAccent: "#0f766e",
    label: { ko: "안정형", en: "Secure", ja: "安定型", zh: "安全型", es: "Seguro" },
  },
  anxious: {
    emoji: "💗",
    colorFrom: "#fb7185",
    colorTo: "#e11d48",
    bgFrom: "#ffedf2",
    bgTo: "#ffd0dc",
    textAccent: "#be123c",
    label: { ko: "불안형", en: "Anxious", ja: "不安型", zh: "焦虑型", es: "Ansioso" },
  },
  avoidant: {
    emoji: "🖤",
    colorFrom: "#60a5fa",
    colorTo: "#1e3a8a",
    bgFrom: "#eaf2ff",
    bgTo: "#c3ddff",
    textAccent: "#1d4ed8",
    label: { ko: "회피형", en: "Avoidant", ja: "回避型", zh: "回避型", es: "Evitativo" },
  },
  disorganized: {
    emoji: "🌪️",
    colorFrom: "#a78bfa",
    colorTo: "#6d28d9",
    bgFrom: "#f4eeff",
    bgTo: "#ddd0fd",
    textAccent: "#6d28d9",
    label: { ko: "혼란형", en: "Disorganized", ja: "混乱型", zh: "混乱型", es: "Desorganizado" },
  },
};

// Neutral theme for the home page and quiz — bright/white, brand-purple
// accents only, no axis color yet. The type color "burst" is reserved for
// the result screens (tension → release, per the design brief).
export const NEUTRAL_THEME = {
  bgFrom: "#ffffff",
  bgTo: "#f4f3f9",
  text: "#18181b",
  textMuted: "rgba(24,24,27,0.62)",
  textFaint: "rgba(24,24,27,0.4)",
  cardBg: "#ffffff",
  cardBorder: "rgba(24,24,27,0.08)",
};

export const ATTACHMENT_TYPES: AttachmentType[] = [
  // ── 4 pure types ──
  {
    code: "S",
    primaryAxis: "secure",
    secondaryAxis: null,
    ko: {
      name: "완전 안정형", catchphrase: "청량 그 자체",
      strengths: ["안정적인 정서 표현", "대화로 갈등을 푸는 능력", "믿고 기다려주는 여유"],
      weaknesses: ["무던해서 신호를 못 챔", "밀당이 없어 심심하다는 말 들음", "속마음을 잘 안 드러냄"],
      bestMatch: { code: "A", reason: "불안한 A를 편안하게 만들어주는 든든한 존재" },
      worstMatch: { code: "D", reason: "예측불가능한 패턴에 지치기 쉬운 조합" },
      similarFigures: [
        { name: "리오넬 메시", description: "화려하지 않아도 꾸준하고 담담한 에너지가 닮았어요" },
        { name: "BTS 진", description: "편안하고 안정적인 무드가 닮았어요" },
      ],
    },
    en: {
      name: "Pure Secure", catchphrase: "Pure Refreshing Energy",
      strengths: ["Steady emotional expression", "Resolves conflict by talking", "Patient, trusting nature"],
      weaknesses: ["Misses subtle emotional cues", "Called \"boring\", no push-pull", "Rarely shows what's underneath"],
      bestMatch: { code: "A", reason: "Steadies Anxious's worries with calm reassurance" },
      worstMatch: { code: "D", reason: "Wears thin trying to keep up with unpredictable swings" },
      similarFigures: [
        { name: "Lionel Messi", description: "Shares that steady, unshowy energy that just keeps delivering" },
        { name: "Jin (BTS)", description: "Has that same comfortable, grounded mood" },
      ],
    },
    ja: {
      name: "完全安定型", catchphrase: "清涼感そのもの",
      strengths: ["安定した感情表現", "対話で対立を解決する力", "信じて待てる余裕"],
      weaknesses: ["淡々としすぎてサインを見逃す", "駆け引きがなくてつまらないと言われる", "本音をあまり出さない"],
      bestMatch: { code: "A", reason: "不安なAを安心させてくれる頼れる存在" },
      worstMatch: { code: "D", reason: "予測不能なパターンに疲れやすい組み合わせ" },
      similarFigures: [
        { name: "リオネル・メッシ", description: "派手じゃなくても淡々と積み重ねるエネルギーが似ています" },
        { name: "ジン（BTS）", description: "落ち着いて安定したムードが似ています" },
      ],
    },
    zh: {
      name: "完全安全型", catchphrase: "清爽感本身",
      strengths: ["情绪表达稳定", "用对话化解矛盾的能力", "愿意信任并等待的余裕"],
      weaknesses: ["太淡定容易错过信号", "没有拉锯战被说无趣", "不太表露真心"],
      bestMatch: { code: "A", reason: "能让焦虑的A安心下来的可靠存在" },
      worstMatch: { code: "D", reason: "容易被对方不可预测的模式搞疲惫" },
      similarFigures: [
        { name: "利昂内尔·梅西", description: "不张扬却稳定持久的能量很相似" },
        { name: "BTS金硕珍(Jin)", description: "舒适安定的气质很相似" },
      ],
    },
    es: {
      name: "Seguro Puro", catchphrase: "Pura Energía Refrescante",
      strengths: ["Expresión emocional estable", "Resuelve conflictos hablando", "Paciente y confiado por naturaleza"],
      weaknesses: ["Se le escapan señales sutiles", "Le dicen \"aburrido\", sin juegos", "Rara vez muestra lo que siente"],
      bestMatch: { code: "A", reason: "Calma las preocupaciones de Ansioso con seguridad" },
      worstMatch: { code: "D", reason: "Se agota tratando de seguir los cambios impredecibles" },
      similarFigures: [
        { name: "Lionel Messi", description: "Comparte esa energía constante y sin estridencias que nunca falla" },
        { name: "Jin (BTS)", description: "Tiene ese mismo ambiente cómodo y estable" },
      ],
    },
  },
  {
    code: "A",
    primaryAxis: "anxious",
    secondaryAxis: null,
    ko: {
      name: "완전 불안형", catchphrase: "감정 그 자체",
      strengths: ["솔직하고 풍부한 감정 표현", "연애에 진심으로 몰입", "관계에 대한 애정과 노력"],
      weaknesses: ["확인받고 싶은 마음이 큼", "작은 신호에도 불안해짐", "혼자만의 생각에 잘 빠짐"],
      bestMatch: { code: "S", reason: "S의 확신이 불안을 편안하게 가라앉혀줌" },
      worstMatch: { code: "V", reason: "밀어내는 V 때문에 불안이 폭발하는 전형적 밀당지옥" },
      similarFigures: [
        { name: "아리아나 그란데", description: "감정을 솔직하게 표현하는 열정적인 에너지가 닮았어요" },
        { name: "정국(BTS)", description: "무대 위에서 폭발적으로 몰입하는 열정이 닮았어요" },
      ],
    },
    en: {
      name: "Pure Anxious", catchphrase: "Pure Emotion",
      strengths: ["Honest, rich emotional expression", "Fully invests in relationships", "Deep care and effort for the bond"],
      weaknesses: ["Craves constant reassurance", "Small signals spiral into worry", "Overthinks alone easily"],
      bestMatch: { code: "S", reason: "Secure's certainty settles the anxiety" },
      worstMatch: { code: "V", reason: "The classic chase-and-withdraw hell with Avoidant" },
      similarFigures: [
        { name: "Ariana Grande", description: "Shares that passionate energy of wearing every emotion openly" },
        { name: "Jungkook (BTS)", description: "Has that same explosive, all-in passion on stage" },
      ],
    },
    ja: {
      name: "完全不安型", catchphrase: "感情そのもの",
      strengths: ["正直で豊かな感情表現", "恋愛に本気で没頭する", "関係への愛情と努力"],
      weaknesses: ["確認してもらいたい気持ちが強い", "小さなサインにも不安になる", "一人で考え込みやすい"],
      bestMatch: { code: "S", reason: "Sの確信が不安を優しく鎮めてくれる" },
      worstMatch: { code: "V", reason: "突き放すVのせいで不安が爆発する典型的な駆け引き地獄" },
      similarFigures: [
        { name: "アリアナ・グランデ", description: "感情を素直に表現する情熱的なエネルギーが似ています" },
        { name: "ジョングク（BTS）", description: "ステージで爆発的に没入する情熱が似ています" },
      ],
    },
    zh: {
      name: "完全焦虑型", catchphrase: "情绪本身",
      strengths: ["坦率而丰富的情绪表达", "全心投入恋爱关系", "对关系充满爱与努力"],
      weaknesses: ["很需要被确认和安抚", "小小信号也会引发不安", "容易一个人胡思乱想"],
      bestMatch: { code: "S", reason: "S的笃定能让焦虑安稳下来" },
      worstMatch: { code: "V", reason: "被V推开导致焦虑爆发的经典拉锯战" },
      similarFigures: [
        { name: "亚莉安娜·格兰德", description: "坦率表达情绪的热情能量很相似" },
        { name: "BTS田柾国(Jungkook)", description: "舞台上爆发式投入的热情很相似" },
      ],
    },
    es: {
      name: "Ansioso Puro", catchphrase: "Pura Emoción",
      strengths: ["Expresión emocional honesta y rica", "Se entrega por completo a la relación", "Cuida y se esfuerza profundamente por el vínculo"],
      weaknesses: ["Necesita reafirmación constante", "Pequeñas señales lo hacen espiralar", "Piensa demasiado a solas"],
      bestMatch: { code: "S", reason: "La certeza de Seguro calma la ansiedad" },
      worstMatch: { code: "V", reason: "El clásico infierno de perseguir y ser rechazado por Evitativo" },
      similarFigures: [
        { name: "Ariana Grande", description: "Comparte esa energía apasionada de mostrar cada emoción sin filtro" },
        { name: "Jungkook (BTS)", description: "Tiene esa misma pasión explosiva y total sobre el escenario" },
      ],
    },
  },
  {
    code: "V",
    primaryAxis: "avoidant",
    secondaryAxis: null,
    ko: {
      name: "완전 회피형", catchphrase: "시크 그 자체",
      strengths: ["감정에 휘둘리지 않는 침착함", "자기 공간을 지키는 독립성", "위기에서 냉정한 판단력"],
      weaknesses: ["말보다 거리두기가 먼저 나옴", "다가오는 상대를 부담스러워함", "속마음 표현에 서툶"],
      bestMatch: { code: "S", reason: "S의 인내심만이 마음을 여는 열쇠" },
      worstMatch: { code: "A", reason: "끊임없이 확인받고 싶어하는 A가 숨막히게 느껴짐" },
      similarFigures: [
        { name: "제니(BLACKPINK)", description: "시크하고 쿨한 무드가 닮았어요" },
        { name: "크리스틴 스튜어트", description: "무심한 듯 시크한 이미지가 닮았어요" },
      ],
    },
    en: {
      name: "Pure Avoidant", catchphrase: "Pure Chic Energy",
      strengths: ["Composed, not swayed by emotion", "Independent, protects own space", "Cool-headed judgment in a crisis"],
      weaknesses: ["Distance comes before words", "Feels burdened when someone gets close", "Struggles to voice what's underneath"],
      bestMatch: { code: "S", reason: "Only Secure's patience can unlock this heart" },
      worstMatch: { code: "A", reason: "Anxious's constant need for reassurance feels suffocating" },
      similarFigures: [
        { name: "Jennie (BLACKPINK)", description: "Shares that chic, cool-headed mood" },
        { name: "Kristen Stewart", description: "Has that same effortlessly detached, chic image" },
      ],
    },
    ja: {
      name: "完全回避型", catchphrase: "クールそのもの",
      strengths: ["感情に振り回されない冷静さ", "自分の空間を守る独立心", "危機での冷静な判断力"],
      weaknesses: ["言葉より先に距離を置く", "近づいてくる相手を負担に感じる", "本音を表現するのが苦手"],
      bestMatch: { code: "S", reason: "Sの忍耐力だけが心を開く鍵" },
      worstMatch: { code: "A", reason: "絶えず確認したがるAが息苦しく感じる" },
      similarFigures: [
        { name: "ジェニー（BLACKPINK）", description: "シックでクールなムードが似ています" },
        { name: "クリステン・スチュワート", description: "無関心に見えてシックなイメージが似ています" },
      ],
    },
    zh: {
      name: "完全回避型", catchphrase: "高冷本身",
      strengths: ["不被情绪左右的沉着", "守护个人空间的独立性", "危机中冷静的判断力"],
      weaknesses: ["比起说话更先拉开距离", "对靠近的对象感到有负担", "不擅长表达真心"],
      bestMatch: { code: "S", reason: "只有S的耐心才能打开这颗心" },
      worstMatch: { code: "A", reason: "总要确认的A让人感到窒息" },
      similarFigures: [
        { name: "Jennie（BLACKPINK）", description: "高冷酷帅的气质很相似" },
        { name: "克里斯汀·斯图尔特", description: "看似漠然却很高冷的形象很相似" },
      ],
    },
    es: {
      name: "Evitativo Puro", catchphrase: "Puro Estilo Frío",
      strengths: ["Sereno, no se deja llevar por la emoción", "Independiente, protege su espacio", "Juicio frío en una crisis"],
      weaknesses: ["La distancia llega antes que las palabras", "Se siente agobiado cuando alguien se acerca", "Le cuesta decir lo que siente"],
      bestMatch: { code: "S", reason: "Solo la paciencia de Seguro puede abrir este corazón" },
      worstMatch: { code: "A", reason: "La necesidad constante de reafirmación de Ansioso resulta asfixiante" },
      similarFigures: [
        { name: "Jennie (BLACKPINK)", description: "Comparte ese estilo chic y de sangre fría" },
        { name: "Kristen Stewart", description: "Tiene esa misma imagen distante y elegante sin esfuerzo" },
      ],
    },
  },
  {
    code: "D",
    primaryAxis: "disorganized",
    secondaryAxis: null,
    ko: {
      name: "완전 혼란형", catchphrase: "예측불가 그 자체",
      strengths: ["감정에 솔직하고 열정적임", "순간순간 최선을 다해 몰입", "의외의 매력으로 관계에 활력"],
      weaknesses: ["감정 기복이 심한 편", "다가가고 싶다가도 두려워짐", "본인도 왜 그런지 설명 못할 때 있음"],
      bestMatch: { code: "S", reason: "어떤 혼란도 다 받아주는 S만이 유일한 안식처" },
      worstMatch: { code: "D", reason: "혼란+혼란은 서로 감당 못 하는 조합" },
      similarFigures: [
        { name: "엘링 홀란드", description: "경기장 안팎의 반전 매력, 예측불가한 에너지가 닮았어요" },
        { name: "리한나", description: "자유분방하고 예측 불가능한 개성이 닮았어요" },
      ],
    },
    en: {
      name: "Pure Disorganized", catchphrase: "Pure Unpredictable Energy",
      strengths: ["Honest, passionate emotion", "Fully present in each moment", "Unexpected charm energizes the relationship"],
      weaknesses: ["Prone to heavy mood swings", "Wants closeness, then gets scared of it", "Can't always explain their own reactions"],
      bestMatch: { code: "S", reason: "Only Secure can hold every kind of chaos" },
      worstMatch: { code: "D", reason: "Chaos plus chaos — neither can handle the other" },
      similarFigures: [
        { name: "Erling Haaland", description: "Shares that on-and-off-the-pitch surprise factor, unpredictable energy" },
        { name: "Rihanna", description: "Has that same free-spirited, impossible-to-predict personality" },
      ],
    },
    ja: {
      name: "完全混乱型", catchphrase: "予測不可そのもの",
      strengths: ["感情に正直で情熱的", "その瞬間ごとに全力で没頭する", "意外な魅力が関係に活気を与える"],
      weaknesses: ["感情の起伏が激しい方", "近づきたいのに怖くなる", "自分でも理由が説明できない時がある"],
      bestMatch: { code: "S", reason: "どんな混乱も受け止めてくれるSだけが唯一の安らぎ" },
      worstMatch: { code: "D", reason: "混乱+混乱はお互い手に負えない組み合わせ" },
      similarFigures: [
        { name: "アーリング・ハーランド", description: "ピッチの内外でのギャップ萌え、予測不能なエネルギーが似ています" },
        { name: "リアーナ", description: "自由奔放で予測不能な個性が似ています" },
      ],
    },
    zh: {
      name: "完全混乱型", catchphrase: "不可预测本身",
      strengths: ["情感真实而热烈", "每个瞬间都全情投入", "意想不到的魅力为关系注入活力"],
      weaknesses: ["情绪起伏比较大", "想靠近却又害怕", "有时连自己都说不清为什么"],
      bestMatch: { code: "S", reason: "只有能包容一切混乱的S才是唯一的港湾" },
      worstMatch: { code: "D", reason: "混乱+混乱=谁都无法承受对方" },
      similarFigures: [
        { name: "埃尔林·哈兰德", description: "赛场内外反差萌、不可预测的能量很相似" },
        { name: "蕾哈娜", description: "自由奔放、难以预测的个性很相似" },
      ],
    },
    es: {
      name: "Desorganizado Puro", catchphrase: "Pura Energía Impredecible",
      strengths: ["Emoción honesta y apasionada", "Totalmente presente en cada momento", "Un encanto inesperado que energiza la relación"],
      weaknesses: ["Propenso a cambios de humor fuertes", "Quiere cercanía y luego le teme", "No siempre puede explicar sus propias reacciones"],
      bestMatch: { code: "S", reason: "Solo Seguro puede sostener todo tipo de caos" },
      worstMatch: { code: "D", reason: "Caos más caos: ninguno puede con el otro" },
      similarFigures: [
        { name: "Erling Haaland", description: "Comparte esa sorpresa dentro y fuera de la cancha, energía impredecible" },
        { name: "Rihanna", description: "Tiene esa misma personalidad libre e imposible de predecir" },
      ],
    },
  },

  // ── 12 hybrid types ──
  {
    code: "S+A",
    primaryAxis: "secure",
    secondaryAxis: "anxious",
    ko: {
      name: "평소엔 쿨, 위기땐 소심", catchphrase: "안정적인데 가끔 불안 터짐",
      strengths: ["평소엔 안정적인 리더십", "위기에도 대화로 풀려는 의지", "자기 불안을 자각하는 성장형"],
      weaknesses: ["가끔 갑자기 확인받고 싶어함", "스트레스 받으면 감정기복", "평소와 위기 때 갭이 큼"],
      bestMatch: { code: "V+S", reason: "겉으론 시크해도 결국 다 챙겨주는 든든함이 위기 순간을 받쳐줌" },
      worstMatch: { code: "A+D", reason: "안 그래도 가끔 불안한데 상대 감정기복까지 겹치면 둘 다 무너짐" },
      similarFigures: [
        { name: "시몬 바일스", description: "압도적인 실력에도 가끔 부담을 드러내는 모습이 닮았어요" },
        { name: "웬디(Red Velvet)", description: "안정적인 무대 매너에 가끔 보이는 여린 모습이 닮았어요" },
      ],
    },
    en: {
      name: "Cool Until Crisis Hits", catchphrase: "Secure With Occasional Anxiety Bursts",
      strengths: ["Steady leadership most of the time", "Still tries to talk things out in a crisis", "Self-aware about its own anxious streak"],
      weaknesses: ["Suddenly needs reassurance out of nowhere", "Mood dips under real stress", "Big gap between calm-mode and crisis-mode"],
      bestMatch: { code: "V+S", reason: "Chic on the outside but takes care of everything — steadies the crisis moments" },
      worstMatch: { code: "A+D", reason: "Already anxious sometimes; add their mood swings and both collapse" },
      similarFigures: [
        { name: "Simone Biles", description: "Shares that mix of overwhelming skill with occasional visible pressure" },
        { name: "Wendy (Red Velvet)", description: "Has that same steady stage presence with rare glimpses of vulnerability" },
      ],
    },
    ja: {
      name: "普段はクール、危機には小心", catchphrase: "安定してるのに時々不安が爆発",
      strengths: ["普段は安定したリーダーシップ", "危機でも対話で解決しようとする意志", "自分の不安を自覚する成長型"],
      weaknesses: ["急に確認してほしくなる時がある", "ストレスを受けると感情が揺れる", "普段と危機の時のギャップが大きい"],
      bestMatch: { code: "V+S", reason: "クールに見えて結局全部世話するV+Sが危機の瞬間を支えてくれる" },
      worstMatch: { code: "A+D", reason: "ただでさえ時々不安なのに相手の感情の起伏まで重なると二人とも崩れる" },
      similarFigures: [
        { name: "シモーネ・バイルズ", description: "圧倒的な実力の中で時々見せるプレッシャーが似ています" },
        { name: "ウェンディ（Red Velvet）", description: "安定したステージマナーに時々見える繊細さが似ています" },
      ],
    },
    zh: {
      name: "平时冷静，危机时小心翼翼", catchphrase: "安全型但偶尔焦虑爆发",
      strengths: ["平时保持稳定的领导力", "危机中依然想用对话解决", "能察觉自己焦虑倾向的成长型"],
      weaknesses: ["偶尔会突然想要被确认", "压力大时情绪会波动", "平时和危机时反差很大"],
      bestMatch: { code: "V+S", reason: "表面高冷却把一切都照顾好，能撑住危机时刻" },
      worstMatch: { code: "A+D", reason: "本来就偶尔焦虑，再加上对方情绪起伏，两人都会崩溃" },
      similarFigures: [
        { name: "西蒙娜·拜尔斯", description: "实力惊人却偶尔流露压力的样子很相似" },
        { name: "Wendy（Red Velvet）", description: "稳定的舞台风范中偶尔流露的柔软很相似" },
      ],
    },
    es: {
      name: "Tranquilo Hasta Que Llega La Crisis", catchphrase: "Seguro Con Estallidos De Ansiedad",
      strengths: ["Liderazgo estable la mayor parte del tiempo", "Aun en crisis intenta resolver hablando", "Consciente de su propia vena ansiosa"],
      weaknesses: ["De repente necesita reafirmación sin razón", "El ánimo baja bajo estrés real", "Gran diferencia entre su modo calma y su modo crisis"],
      bestMatch: { code: "V+S", reason: "Frío por fuera pero cuida de todo, sostiene los momentos de crisis" },
      worstMatch: { code: "A+D", reason: "Ya ansioso a veces; sumar los cambios de humor del otro hunde a ambos" },
      similarFigures: [
        { name: "Simone Biles", description: "Comparte esa mezcla de habilidad abrumadora con presión ocasional visible" },
        { name: "Wendy (Red Velvet)", description: "Tiene esa misma presencia escénica estable con destellos raros de vulnerabilidad" },
      ],
    },
  },
  {
    code: "S+V",
    primaryAxis: "secure",
    secondaryAxis: "avoidant",
    ko: {
      name: "다정한 밀당러", catchphrase: "안정적인데 은근 선 지킴",
      strengths: ["다정하지만 할 말은 함", "무리한 요구를 안 함", "서로의 공간을 존중함"],
      weaknesses: ["은근한 선긋기가 서운함으로 느껴짐", "다정함과 거리두기 신호가 헷갈림", "어디까지 다가가야 할지 스스로도 헷갈림"],
      bestMatch: { code: "A+S", reason: "티 안 내려는 노력이 여유로운 페이스와 잘 맞음" },
      worstMatch: { code: "A+V", reason: "둘 다 선을 그어서 아무도 먼저 다가가지 않음" },
      similarFigures: [
        { name: "슈가(BTS)", description: "다정한 팬서비스와 자기만의 공간을 지키는 무드가 공존해요" },
        { name: "로저 페더러", description: "정중하고 다정하지만 사생활은 확실히 지키는 무드가 닮았어요" },
      ],
    },
    en: {
      name: "The Warm Push-Puller", catchphrase: "Secure But Quietly Keeps Boundaries",
      strengths: ["Warm, but still says what needs saying", "Doesn't ask for more than is reasonable", "Respects both people's space"],
      weaknesses: ["Quiet boundary-setting can read as coldness", "Warmth and distance signals get mixed up", "Even they aren't sure how close is close enough"],
      bestMatch: { code: "A+S", reason: "Their effort to stay composed matches this type's easy pace" },
      worstMatch: { code: "A+V", reason: "Both draw lines, so neither one ever makes the first move" },
      similarFigures: [
        { name: "Suga (BTS)", description: "Balances warm fan service with clearly guarding personal space" },
        { name: "Roger Federer", description: "Shares that courteous warmth paired with firmly guarded privacy" },
      ],
    },
    ja: {
      name: "優しい駆け引き上手", catchphrase: "安定してるのにさりげなく線引き",
      strengths: ["優しいけど言うべきことは言う", "無理な要求をしない", "お互いの空間を尊重する"],
      weaknesses: ["さりげない線引きが寂しさに感じられる", "優しさと距離のサインが紛らわしい", "自分でもどこまで近づくべきか迷う"],
      bestMatch: { code: "A+S", reason: "隠そうとする努力が余裕あるペースとよく合う" },
      worstMatch: { code: "A+V", reason: "お互い線を引くので誰も先に近づかない" },
      similarFigures: [
        { name: "シュガ（BTS）", description: "温かいファンサービスと自分だけの空間を守るムードが共存しています" },
        { name: "ロジャー・フェデラー", description: "礼儀正しく温かいのにプライベートはしっかり守るムードが似ています" },
      ],
    },
    zh: {
      name: "温柔的欲擒故纵者", catchphrase: "安全型但默默划清界限",
      strengths: ["温柔但该说的都会说", "不会提出过分的要求", "尊重彼此的空间"],
      weaknesses: ["默默划界限容易让人觉得委屈", "温柔和保持距离的信号容易混淆", "自己也不确定该靠近到什么程度"],
      bestMatch: { code: "A+S", reason: "对方努力不表露的样子和从容的节奏很契合" },
      worstMatch: { code: "A+V", reason: "两人都在划界限，谁都不会先靠近" },
      similarFigures: [
        { name: "Suga（BTS）", description: "温暖的粉丝服务与坚守个人空间的态度并存" },
        { name: "罗杰·费德勒", description: "礼貌温和却坚定守护隐私的气质很相似" },
      ],
    },
    es: {
      name: "El Seductor Cariñoso", catchphrase: "Seguro Pero Marca Límites Sutilmente",
      strengths: ["Cariñoso, pero dice lo que hay que decir", "No pide más de lo razonable", "Respeta el espacio de ambos"],
      weaknesses: ["Marcar límites en silencio puede leerse como frialdad", "Se confunden las señales de calidez y distancia", "Ni siquiera ellos saben cuánta cercanía es suficiente"],
      bestMatch: { code: "A+S", reason: "Su esfuerzo por mantener la calma combina con este ritmo relajado" },
      worstMatch: { code: "A+V", reason: "Ambos marcan límites, así que ninguno da el primer paso" },
      similarFigures: [
        { name: "Suga (BTS)", description: "Combina un trato cálido con los fans con un espacio personal bien protegido" },
        { name: "Roger Federer", description: "Comparte esa calidez cortés junto con una privacidad firmemente resguardada" },
      ],
    },
  },
  {
    code: "S+D",
    primaryAxis: "secure",
    secondaryAxis: "disorganized",
    ko: {
      name: "예측 가능한 4차원", catchphrase: "안정적인데 가끔 종잡을 수 없음",
      strengths: ["큰 위기엔 안 흔들리는 기본기", "엉뚱한 매력으로 관계에 활력", "즉흥성과 안정감의 밸런스"],
      weaknesses: ["가끔 나오는 4차원 모먼트", "예측불가한 부분에 신뢰 쌓기 오래 걸림", "본인도 설명 못 하는 순간 있음"],
      bestMatch: { code: "D+S", reason: "서로의 혼란을 이해하며 함께 안정을 찾아가는 조합" },
      worstMatch: { code: "V+D", reason: "4차원 모먼트에 상대가 칼같이 선을 그어버려 상처받음" },
      similarFigures: [
        { name: "뷔(BTS)", description: "안정적인 무드에 가끔 4차원적인 매력이 섞여있어요" },
        { name: "지드래곤", description: "안정된 카리스마 속 독특하고 예측불가한 감각이 공존해요" },
      ],
    },
    en: {
      name: "Predictably Quirky", catchphrase: "Secure With Occasional Wild Cards",
      strengths: ["Rock-solid fundamentals in a real crisis", "Quirky charm keeps the relationship lively", "A balance of spontaneity and stability"],
      weaknesses: ["Occasional out-of-nowhere quirky moments", "The unpredictable streak makes trust slow to build", "Can't always explain their own randomness"],
      bestMatch: { code: "D+S", reason: "Both understand each other's chaos while growing toward stability together" },
      worstMatch: { code: "V+D", reason: "A quirky moment meets a sharp, sudden cutoff — it stings" },
      similarFigures: [
        { name: "V (BTS)", description: "Has a steady mood mixed with occasional quirky, offbeat charm" },
        { name: "G-Dragon", description: "Blends grounded charisma with a distinctly unpredictable sense of style" },
      ],
    },
    ja: {
      name: "予測できる4次元", catchphrase: "安定してるのに時々つかめない",
      strengths: ["大きな危機には揺るがない基本", "変わった魅力が関係に活気を与える", "即興性と安定感のバランス"],
      weaknesses: ["時々出る4次元な瞬間", "予測できない部分で信頼を築くのに時間がかかる", "自分でも説明できない時がある"],
      bestMatch: { code: "D+S", reason: "お互いの混乱を理解しながら共に安定を探していく組み合わせ" },
      worstMatch: { code: "V+D", reason: "4次元な瞬間に相手がバッサリ線を引いて傷つく" },
      similarFigures: [
        { name: "ヴィ（BTS）", description: "安定したムードに時々4次元的な魅力が混ざっています" },
        { name: "ジードラゴン", description: "安定したカリスマの中に独特で予測不能な感覚が共存しています" },
      ],
    },
    zh: {
      name: "可预测的四次元", catchphrase: "安全型但偶尔让人捉摸不透",
      strengths: ["大危机中不会动摇的基本功", "特别的魅力为关系注入活力", "即兴与稳定感的平衡"],
      weaknesses: ["偶尔冒出的四次元瞬间", "难以预测的部分让信任建立较慢", "有时自己也解释不清"],
      bestMatch: { code: "D+S", reason: "理解彼此的混乱，一起走向安定的组合" },
      worstMatch: { code: "V+D", reason: "四次元瞬间遇上对方突然的果断划界，容易受伤" },
      similarFigures: [
        { name: "V（BTS）", description: "稳定的气质中偶尔混入四次元的魅力" },
        { name: "权志龙(G-Dragon)", description: "稳定的气场中带着独特难以预测的风格感" },
      ],
    },
    es: {
      name: "Impredeciblemente Predecible", catchphrase: "Seguro Con Sorpresas Ocasionales",
      strengths: ["Bases sólidas en una crisis real", "Su encanto excéntrico mantiene viva la relación", "Equilibrio entre espontaneidad y estabilidad"],
      weaknesses: ["Momentos excéntricos que salen de la nada", "La racha impredecible hace lenta la confianza", "No siempre puede explicar su propia rareza"],
      bestMatch: { code: "D+S", reason: "Ambos entienden el caos del otro mientras crecen juntos hacia la estabilidad" },
      worstMatch: { code: "V+D", reason: "Un momento excéntrico choca con un corte seco y repentino — duele" },
      similarFigures: [
        { name: "V (BTS)", description: "Tiene un ánimo estable mezclado con un encanto excéntrico ocasional" },
        { name: "G-Dragon", description: "Combina un carisma sólido con un sentido de estilo distintivamente impredecible" },
      ],
    },
  },
  {
    code: "A+S",
    primaryAxis: "anxious",
    secondaryAxis: "secure",
    ko: {
      name: "속으론 폭풍, 겉으론 담담", catchphrase: "불안한데 티 안 내려고 노력함",
      strengths: ["감정을 조절하려는 노력", "겉으로는 신뢰감을 줌", "끊임없이 자기 감정을 성찰함"],
      weaknesses: ["속마음을 숨기다 오해가 쌓임", "혼자 삭히다 갑자기 터짐", "힘든 티를 안 내서 상대가 눈치 못 챔"],
      bestMatch: { code: "S+V", reason: "다정하면서도 안정적인 페이스가 속마음을 천천히 풀어줌" },
      worstMatch: { code: "V+A", reason: "둘 다 속마음을 숨기기만 해서 진짜 대화가 안 됨" },
      similarFigures: [
        { name: "아델", description: "담담해 보여도 노래에 깊은 감정을 담는 무드가 닮았어요" },
        { name: "나오미 오사카", description: "차분해 보이지만 내면의 감정이 깊은 무드가 닮았어요" },
      ],
    },
    en: {
      name: "Storm Inside, Calm Outside", catchphrase: "Anxious But Trying Not To Show It",
      strengths: ["Actively works to regulate their emotions", "Comes across as trustworthy on the surface", "Constantly reflects on their own feelings"],
      weaknesses: ["Hiding what's inside builds up misunderstandings", "Bottles it up until it suddenly bursts", "Hides the struggle so well the partner misses it"],
      bestMatch: { code: "S+V", reason: "A warm, steady pace slowly unwinds what's held inside" },
      worstMatch: { code: "V+A", reason: "Both hide their true feelings, so real conversation never happens" },
      similarFigures: [
        { name: "Adele", description: "Looks composed, yet pours deep emotion into every song" },
        { name: "Naomi Osaka", description: "Appears calm, but carries deep feeling underneath" },
      ],
    },
    ja: {
      name: "内側は嵐、外側は平然", catchphrase: "不安なのに隠そうと努力する",
      strengths: ["感情をコントロールしようとする努力", "表面上は信頼感を与える", "絶えず自分の感情を振り返る"],
      weaknesses: ["本音を隠して誤解が積もる", "一人で抱え込んで急に爆発する", "辛さを見せないので相手が気づかない"],
      bestMatch: { code: "S+V", reason: "優しくて安定したペースが本音をゆっくり解きほぐしてくれる" },
      worstMatch: { code: "V+A", reason: "お互い本音を隠すだけで本当の会話ができない" },
      similarFigures: [
        { name: "アデル", description: "落ち着いて見えても歌に深い感情を込めるムードが似ています" },
        { name: "大坂なおみ", description: "冷静に見えても内面の感情が深いムードが似ています" },
      ],
    },
    zh: {
      name: "内心风暴，外表平静", catchphrase: "焦虑但努力不表现出来",
      strengths: ["努力调节自己的情绪", "表面上给人可靠的感觉", "不断反思自己的情绪"],
      weaknesses: ["藏起真心导致误会积累", "独自忍耐直到突然爆发", "不表现出辛苦让对方察觉不到"],
      bestMatch: { code: "S+V", reason: "温柔又稳定的节奏能慢慢解开内心" },
      worstMatch: { code: "V+A", reason: "两人都只藏着真心，无法真正沟通" },
      similarFigures: [
        { name: "阿黛尔", description: "看似平静却在歌声中倾注深沉情感的气质很相似" },
        { name: "大坂直美", description: "看似冷静内心情感却很深的气质很相似" },
      ],
    },
    es: {
      name: "Tormenta Por Dentro, Calma Por Fuera", catchphrase: "Ansioso Pero Tratando De No Mostrarlo",
      strengths: ["Trabaja activamente para regular sus emociones", "Da una impresión de confianza en la superficie", "Reflexiona constantemente sobre sus propios sentimientos"],
      weaknesses: ["Ocultar lo que siente acumula malentendidos", "Lo guarda todo hasta que estalla de repente", "Oculta tan bien su lucha que la pareja no lo nota"],
      bestMatch: { code: "S+V", reason: "Un ritmo cálido y estable desenreda poco a poco lo que guarda dentro" },
      worstMatch: { code: "V+A", reason: "Ambos ocultan sus verdaderos sentimientos, así que nunca hay una conversación real" },
      similarFigures: [
        { name: "Adele", description: "Se ve serena, pero vuelca una emoción profunda en cada canción" },
        { name: "Naomi Osaka", description: "Parece tranquila, pero guarda un sentir profundo por dentro" },
      ],
    },
  },
  {
    code: "A+V",
    primaryAxis: "anxious",
    secondaryAxis: "avoidant",
    ko: {
      name: "궁금한데 도망감", catchphrase: "불안한데 다가가지도 못함",
      strengths: ["상대를 세심하게 관찰함", "신중하게 다가가서 상처를 줄임", "마음을 열면 깊게 애정을 줌"],
      weaknesses: ["다가가고 싶은데 동시에 도망감", "막상 다가오면 부담스러워함", "확신이 없으면 계속 제자리"],
      bestMatch: { code: "S", reason: "흔들리지 않는 S의 페이스가 접근-회피 패턴을 안정적으로 받아줌" },
      worstMatch: { code: "D+V", reason: "둘 다 다가가다 도망가는 패턴이라 서로 지쳐서 관계가 증발함" },
      similarFigures: [
        { name: "빌리 아일리시", description: "다가가고 싶은 호기심과 신중하게 거리 두는 태도가 공존해요" },
        { name: "프랭크 오션", description: "신비롭고 조심스러운 무드가 닮았어요" },
      ],
    },
    en: {
      name: "Curious But Runs Away", catchphrase: "Anxious But Can't Even Approach",
      strengths: ["Pays close, careful attention to the other person", "Approaches carefully to avoid getting hurt", "Loves deeply once the heart opens up"],
      weaknesses: ["Wants to get closer while running away at the same time", "Feels overwhelmed the moment someone actually gets close", "Stays stuck without certainty"],
      bestMatch: { code: "S", reason: "Secure's unshaken pace steadily holds this approach-avoid pattern" },
      worstMatch: { code: "D+V", reason: "Both approach then flee — they wear each other out until the bond evaporates" },
      similarFigures: [
        { name: "Billie Eilish", description: "Balances a curious pull toward closeness with careful distance" },
        { name: "Frank Ocean", description: "Shares that mysterious, guarded mood" },
      ],
    },
    ja: {
      name: "気になるのに逃げる", catchphrase: "不安なのに近づけもしない",
      strengths: ["相手を細やかに観察する", "慎重に近づいて傷を減らす", "心を開けば深く愛情を注ぐ"],
      weaknesses: ["近づきたいのに同時に逃げてしまう", "実際に近づかれると負担に感じる", "確信がないとずっと足踏みする"],
      bestMatch: { code: "S", reason: "揺るがないSのペースが接近回避パターンを安定して受け止めてくれる" },
      worstMatch: { code: "D+V", reason: "お互い近づいては逃げるパターンで疲れて関係が消えてしまう" },
      similarFigures: [
        { name: "ビリー・アイリッシュ", description: "近づきたい好奇心と慎重に距離を置く態度が共存しています" },
        { name: "フランク・オーシャン", description: "神秘的で慎重なムードが似ています" },
      ],
    },
    zh: {
      name: "好奇却逃跑", catchphrase: "焦虑却连靠近都做不到",
      strengths: ["细腻地观察对方", "谨慎靠近以减少受伤", "一旦敞开心扉就爱得很深"],
      weaknesses: ["想靠近又同时想逃跑", "对方真的靠近时又觉得有负担", "没有把握就一直原地踏步"],
      bestMatch: { code: "S", reason: "S稳定不动摇的节奏能安稳地接住这种接近-回避模式" },
      worstMatch: { code: "D+V", reason: "两人都是靠近又逃跑，彼此疲惫，关系最终消散" },
      similarFigures: [
        { name: "比莉·艾利什", description: "想靠近的好奇心与谨慎保持距离的态度并存" },
        { name: "弗兰克·海洋", description: "神秘又谨慎的气质很相似" },
      ],
    },
    es: {
      name: "Curioso Pero Huye", catchphrase: "Ansioso Pero No Puede Ni Acercarse",
      strengths: ["Observa a la otra persona con mucha atención", "Se acerca con cuidado para evitar salir herido", "Ama profundamente una vez que abre el corazón"],
      weaknesses: ["Quiere acercarse mientras huye al mismo tiempo", "Se siente abrumado en cuanto alguien realmente se acerca", "Se queda estancado sin certeza"],
      bestMatch: { code: "S", reason: "El ritmo firme de Seguro sostiene con estabilidad este patrón de acercarse y huir" },
      worstMatch: { code: "D+V", reason: "Ambos se acercan y huyen — se agotan mutuamente hasta que el vínculo se evapora" },
      similarFigures: [
        { name: "Billie Eilish", description: "Combina la curiosidad de acercarse con una distancia cuidadosa" },
        { name: "Frank Ocean", description: "Comparte ese aire misterioso y reservado" },
      ],
    },
  },
  {
    code: "A+D",
    primaryAxis: "anxious",
    secondaryAxis: "disorganized",
    ko: {
      name: "롤러코스터 그 자체", catchphrase: "불안하고 감정 기복 심함",
      strengths: ["솔직하고 풍부한 감정 표현", "연애에 진심으로 몰입", "순간의 감정에 최선을 다함"],
      weaknesses: ["감정 기복이 관계를 불안정하게 함", "확인 욕구와 예측불가함이 동시에 나타남", "상대가 페이스 맞추기 힘들어함"],
      bestMatch: { code: "S", reason: "무슨 일이 있어도 흔들리지 않는 S가 유일하게 다 받아줄 수 있음" },
      worstMatch: { code: "V", reason: "감정 기복을 V는 부담스러워하며 거리를 둬서 최악의 궁합" },
      similarFigures: [
        { name: "케이티 페리", description: "감정 기복이 크고 화려한 텐션이 롤러코스터 같아요" },
        { name: "데미 로바토", description: "솔직하고 기복 있는 감정 표현이 닮았어요" },
      ],
    },
    en: {
      name: "The Rollercoaster Itself", catchphrase: "Anxious With Heavy Mood Swings",
      strengths: ["Honest, rich emotional expression", "Fully invests in love", "Gives every moment their full feeling"],
      weaknesses: ["Mood swings destabilize the relationship", "Need for reassurance and unpredictability show up together", "Hard for a partner to keep pace with"],
      bestMatch: { code: "S", reason: "Secure, unshaken no matter what, is the only one who can hold it all" },
      worstMatch: { code: "V", reason: "Avoidant finds the mood swings overwhelming and pulls away — the worst match" },
      similarFigures: [
        { name: "Katy Perry", description: "Has that big, glamorous rollercoaster of mood swings" },
        { name: "Demi Lovato", description: "Shares that same honest, up-and-down emotional expression" },
      ],
    },
    ja: {
      name: "ジェットコースターそのもの", catchphrase: "不安で感情の起伏が激しい",
      strengths: ["正直で豊かな感情表現", "恋愛に本気で没頭する", "その瞬間の感情に全力を注ぐ"],
      weaknesses: ["感情の起伏が関係を不安定にする", "確認欲求と予測不能さが同時に出る", "相手がペースを合わせるのが大変"],
      bestMatch: { code: "S", reason: "何があっても揺るがないSだけが全部受け止めてくれる" },
      worstMatch: { code: "V", reason: "感情の起伏をVは負担に感じて距離を置く最悪の相性" },
      similarFigures: [
        { name: "ケイティ・ペリー", description: "感情の起伏が大きく華やかなテンションがジェットコースターのようです" },
        { name: "デミ・ロヴァート", description: "正直で起伏のある感情表現が似ています" },
      ],
    },
    zh: {
      name: "过山车本车", catchphrase: "焦虑且情绪起伏很大",
      strengths: ["坦率而丰富的情绪表达", "全心投入恋爱", "对每个瞬间的情绪都全力以赴"],
      weaknesses: ["情绪起伏让关系变得不稳定", "被确认的需求和不可预测同时出现", "对方很难跟上节奏"],
      bestMatch: { code: "S", reason: "无论发生什么都不动摇的S是唯一能全部接住的人" },
      worstMatch: { code: "V", reason: "V会因情绪起伏感到负担而拉开距离，是最差的组合" },
      similarFigures: [
        { name: "凯蒂·佩里", description: "情绪起伏大又华丽的张力像过山车一样" },
        { name: "黛米·洛瓦托", description: "坦率又起伏不定的情感表达很相似" },
      ],
    },
    es: {
      name: "La Montaña Rusa Misma", catchphrase: "Ansioso Con Cambios De Humor Fuertes",
      strengths: ["Expresión emocional honesta y rica", "Se entrega por completo al amor", "Da todo su sentir a cada momento"],
      weaknesses: ["Los cambios de humor desestabilizan la relación", "La necesidad de reafirmación y lo impredecible aparecen juntos", "Es difícil para la pareja seguirle el ritmo"],
      bestMatch: { code: "S", reason: "Seguro, inquebrantable pase lo que pase, es el único que puede sostenerlo todo" },
      worstMatch: { code: "V", reason: "Evitativo encuentra abrumadores los cambios de humor y se aleja — la peor combinación" },
      similarFigures: [
        { name: "Katy Perry", description: "Tiene esa gran montaña rusa de cambios de humor llenos de brillo" },
        { name: "Demi Lovato", description: "Comparte esa misma expresión emocional honesta y cambiante" },
      ],
    },
  },
  {
    code: "V+S",
    primaryAxis: "avoidant",
    secondaryAxis: "secure",
    ko: {
      name: "츤데레의 정석", catchphrase: "시크한데 결국 다 챙겨줌",
      strengths: ["표현은 서툴어도 행동으로 챙김", "은근히 두터운 신뢰", "위기 상황에서 의외로 든든함"],
      weaknesses: ["마음을 말로 표현 안 해서 오해받음", "챙겨주면서 티 안 내 고마움을 몰라줄 때 있음", "다가가는 데 시간이 오래 걸림"],
      bestMatch: { code: "S+A", reason: "든든하게 챙겨주는 무드가 위기 때 흔들리는 상대를 잡아줌" },
      worstMatch: { code: "A", reason: "끊임없는 확인을 원하는 A에게 무뚝뚝함이 답답하게 느껴짐" },
      similarFigures: [
        { name: "즐라탄 이브라히모비치", description: "거침없고 시크한 태도 속에 은근히 팀을 챙기는 리더십이 닮았어요" },
        { name: "RM(BTS)", description: "무뚝뚝해 보여도 팀을 이끄는 다정한 리더십이 닮았어요" },
      ],
    },
    en: {
      name: "Textbook Tsundere", catchphrase: "Chic But Ends Up Taking Care of Everything",
      strengths: ["Awkward with words but takes care of things through action", "Quietly deep, solid trust", "Surprisingly dependable in a real crisis"],
      weaknesses: ["Gets misread because feelings aren't said out loud", "Cares without showing it, so the effort goes unnoticed", "Takes a long time to actually open up"],
      bestMatch: { code: "S+A", reason: "That dependable, taking-care-of-everything energy steadies a partner shaken by crisis" },
      worstMatch: { code: "A", reason: "The bluntness feels frustrating to Anxious, who craves constant reassurance" },
      similarFigures: [
        { name: "Zlatan Ibrahimović", description: "Has that bold, cool exterior hiding a leader who quietly looks out for the team" },
        { name: "RM (BTS)", description: "Shares that gruff surface hiding a warm, guiding leadership" },
      ],
    },
    ja: {
      name: "ツンデレの教科書", catchphrase: "クールなのに結局全部世話する",
      strengths: ["表現は不器用でも行動で世話をする", "さりげなく厚い信頼", "危機の状況で意外と頼れる"],
      weaknesses: ["気持ちを言葉にしないので誤解される", "世話をしても素振りを見せず感謝されないことがある", "近づくのに時間がかかる"],
      bestMatch: { code: "S+A", reason: "頼もしく世話をするムードが危機の時に揺れる相手を支えてくれる" },
      worstMatch: { code: "A", reason: "絶えず確認を求めるAにはぶっきらぼうさがもどかしく感じられる" },
      similarFigures: [
        { name: "ズラタン・イブラヒモビッチ", description: "大胆でクールな態度の中にさりげなくチームを気にかけるリーダーシップが似ています" },
        { name: "RM（BTS）", description: "ぶっきらぼうに見えてもチームを導く温かいリーダーシップが似ています" },
      ],
    },
    zh: {
      name: "傲娇教科书", catchphrase: "高冷但最后全都照顾到",
      strengths: ["表达笨拙但用行动照顾对方", "默默积累的深厚信任", "危机时刻意外地可靠"],
      weaknesses: ["因不把心意说出口而被误会", "照顾对方却不表现出来，容易不被感激", "需要很长时间才能真正靠近"],
      bestMatch: { code: "S+A", reason: "可靠又照顾一切的气质能撑住危机时动摇的对方" },
      worstMatch: { code: "A", reason: "对渴望不断确认的A来说，冷淡的态度让人很憋闷" },
      similarFigures: [
        { name: "兹拉坦·伊布拉希莫维奇", description: "强势高冷的态度中带着默默照顾团队的领导力很相似" },
        { name: "RM（BTS）", description: "看似生硬却带领团队的温暖领导力很相似" },
      ],
    },
    es: {
      name: "El Tsundere De Manual", catchphrase: "Frío Pero Termina Cuidando Todo",
      strengths: ["Torpe con las palabras pero cuida con acciones", "Confianza sólida y silenciosa", "Sorprendentemente confiable en una crisis real"],
      weaknesses: ["Lo malinterpretan porque no dice lo que siente en voz alta", "Cuida sin demostrarlo, así que el esfuerzo pasa desapercibido", "Tarda mucho en realmente abrirse"],
      bestMatch: { code: "S+A", reason: "Esa energía confiable de cuidar todo estabiliza a una pareja sacudida por la crisis" },
      worstMatch: { code: "A", reason: "La brusquedad resulta frustrante para Ansioso, que anhela reafirmación constante" },
      similarFigures: [
        { name: "Zlatan Ibrahimović", description: "Tiene ese exterior audaz y frío que esconde a un líder que cuida al equipo en silencio" },
        { name: "RM (BTS)", description: "Comparte esa superficie ruda que esconde un liderazgo cálido y orientador" },
      ],
    },
  },
  {
    code: "V+A",
    primaryAxis: "avoidant",
    secondaryAxis: "anxious",
    ko: {
      name: "무심한 척 다 봄", catchphrase: "시크한데 은근 신경 씀",
      strengths: ["무심한 척하면서도 세심하게 챙김", "상대의 감정 변화를 잘 알아챔", "걱정을 티 내지 않아 부담을 안 줌"],
      weaknesses: ["신경 쓰는 티를 안 내 무심하다는 오해", "자기도 불안한데 이중으로 힘듦", "먼저 다가가는 게 어색함"],
      bestMatch: { code: "S", reason: "무심한 척하는 진심을 알아채고 편하게 이끌어주는 S" },
      worstMatch: { code: "A+S", reason: "둘 다 속마음을 숨기기만 해서 서로의 진심을 영영 모를 수도" },
      similarFigures: [
        { name: "로제(BLACKPINK)", description: "겉으론 쿨한데 은근히 다정하고 세심한 무드가 닮았어요" },
        { name: "르브론 제임스", description: "무심해 보여도 주변을 세심히 챙기는 스타일이 닮았어요" },
      ],
    },
    en: {
      name: "Acts Indifferent, Notices Everything", catchphrase: "Chic But Secretly Cares",
      strengths: ["Acts indifferent but quietly pays close attention", "Picks up on the other person's emotional shifts fast", "Worries without showing it, so it never feels heavy"],
      weaknesses: ["Reads as indifferent because the caring stays hidden", "Anxious underneath too, so it's a double weight to carry", "Feels awkward making the first move"],
      bestMatch: { code: "S", reason: "Secure notices the real feelings behind the indifferent act and leads gently" },
      worstMatch: { code: "A+S", reason: "Both hide what they really feel, so they may never truly know each other" },
      similarFigures: [
        { name: "Rosé (BLACKPINK)", description: "Looks cool on the surface but is quietly warm and attentive" },
        { name: "LeBron James", description: "Seems detached, but quietly looks out for everyone around him" },
      ],
    },
    ja: {
      name: "無関心なふりで全部見てる", catchphrase: "クールなのにさりげなく気にする",
      strengths: ["無関心なふりをしながらも細やかに気にかける", "相手の感情の変化によく気づく", "心配を見せないので負担を与えない"],
      weaknesses: ["気にかけている素振りを見せず無関心だと誤解される", "自分も不安なのに二重に大変", "先に近づくのが気まずい"],
      bestMatch: { code: "S", reason: "無関心なふりの本心に気づき、優しく導いてくれるS" },
      worstMatch: { code: "A+S", reason: "お互い本音を隠すだけで永遠に相手の本心を知らないかもしれない" },
      similarFigures: [
        { name: "ロゼ（BLACKPINK）", description: "表向きはクールだけどさりげなく優しく細やかなムードが似ています" },
        { name: "レブロン・ジェームズ", description: "無関心に見えても周りを細やかに気にかけるスタイルが似ています" },
      ],
    },
    zh: {
      name: "装作无所谓其实都看在眼里", catchphrase: "高冷但暗自在意",
      strengths: ["装作无所谓却默默细心照顾", "很快察觉对方情绪的变化", "担心也不表现出来，不给对方压力"],
      weaknesses: ["不表现在意会被误以为冷漠", "自己也焦虑，等于双重辛苦", "很难先主动靠近"],
      bestMatch: { code: "S", reason: "S能察觉这份装无所谓背后的真心，并温柔地引导" },
      worstMatch: { code: "A+S", reason: "两人都只是隐藏真心，可能永远不了解彼此的真实想法" },
      similarFigures: [
        { name: "Rosé（BLACKPINK）", description: "表面高冷却默默温柔细心的气质很相似" },
        { name: "勒布朗·詹姆斯", description: "看似淡然却细心照顾身边人的风格很相似" },
      ],
    },
    es: {
      name: "Finge Indiferencia Pero Nota Todo", catchphrase: "Frío Pero Secretamente Le Importa",
      strengths: ["Finge indiferencia pero presta atención en silencio", "Detecta rápido los cambios emocionales del otro", "Se preocupa sin demostrarlo, así nunca resulta pesado"],
      weaknesses: ["Parece indiferente porque el cariño queda oculto", "También está ansioso por dentro, así que carga el doble", "Le resulta incómodo dar el primer paso"],
      bestMatch: { code: "S", reason: "Seguro nota los sentimientos reales detrás de la indiferencia fingida y guía con suavidad" },
      worstMatch: { code: "A+S", reason: "Ambos ocultan lo que realmente sienten, así que puede que nunca se conozcan de verdad" },
      similarFigures: [
        { name: "Rosé (BLACKPINK)", description: "Se ve fría por fuera, pero es cálida y atenta en silencio" },
        { name: "LeBron James", description: "Parece distante, pero cuida en silencio de quienes lo rodean" },
      ],
    },
  },
  {
    code: "V+D",
    primaryAxis: "avoidant",
    secondaryAxis: "disorganized",
    ko: {
      name: "선 넘으면 칼같음", catchphrase: "시크한데 가끔 확 밀어냄",
      strengths: ["자기 기준이 명확함", "아닌 건 아니라고 확실히 표현", "할 말은 하는 솔직함"],
      weaknesses: ["갑자기 확 밀어내서 상대가 상처받음", "평소와 폭발 사이 온도차가 큼", "왜 화났는지 설명을 잘 안 함"],
      bestMatch: { code: "S+D", reason: "예측불가한 순간에도 흔들리지 않는 기본기가 편하게 만들어줌" },
      worstMatch: { code: "A+D", reason: "감정 기복 심한 상대를 갑자기 확 밀어내면 관계가 파국으로" },
      similarFigures: [
        { name: "태연(소녀시대)", description: "평소엔 쿨하고 담담한데 선을 넘으면 확실하게 끊어내는 단호함이 닮았어요" },
        { name: "세리나 윌리엄스", description: "평소엔 차분하지만 코트 위에서 확실한 승부욕을 드러내는 무드가 닮았어요" },
      ],
    },
    en: {
      name: "Cuts You Off The Moment You Cross The Line", catchphrase: "Chic With Sudden Sharp Pushback",
      strengths: ["Has clear personal standards", "Says no clearly when it's a no", "Speaks up honestly when it matters"],
      weaknesses: ["Suddenly pushes back hard, and it stings", "Big gap in temperature between calm mode and the outburst", "Rarely explains why they got upset"],
      bestMatch: { code: "S+D", reason: "Unshaken fundamentals even in unpredictable moments make this easy to be around" },
      worstMatch: { code: "A+D", reason: "A sudden hard pushback against someone already mood-swinging ends in disaster" },
      similarFigures: [
        { name: "Taeyeon (Girls' Generation)", description: "Usually cool and composed, but draws a hard line the moment someone crosses it" },
        { name: "Serena Williams", description: "Usually calm, but shows fierce competitive fire the moment it counts" },
      ],
    },
    ja: {
      name: "一線を越えたら容赦ない", catchphrase: "クールなのに時々突き放す",
      strengths: ["自分の基準が明確", "違うことははっきり表現する", "言うべきことは言う正直さ"],
      weaknesses: ["急に突き放して相手が傷つく", "普段と爆発の間の温度差が大きい", "なぜ怒ったのかあまり説明しない"],
      bestMatch: { code: "S+D", reason: "予測できない瞬間にも揺るがない基本が居心地を良くしてくれる" },
      worstMatch: { code: "A+D", reason: "感情の起伏が激しい相手を急に突き放すと関係が破局に" },
      similarFigures: [
        { name: "テヨン（少女時代）", description: "普段はクールで淡々としているけど一線を越えたら確実に切る決断力が似ています" },
        { name: "セリーナ・ウィリアムズ", description: "普段は落ち着いているけどコートの上では確かな勝負根性を見せるムードが似ています" },
      ],
    },
    zh: {
      name: "越界就翻脸", catchphrase: "高冷但偶尔狠狠推开",
      strengths: ["自己的标准很明确", "不行的事情会明确表达", "该说的话都会说的坦率"],
      weaknesses: ["突然狠狠推开会让对方受伤", "平时和爆发之间温差很大", "很少解释自己为什么生气"],
      bestMatch: { code: "S+D", reason: "在不可预测的瞬间也不动摇的基本功让人很自在" },
      worstMatch: { code: "A+D", reason: "对情绪起伏大的对方突然狠推，关系容易走向破裂" },
      similarFigures: [
        { name: "太妍（少女时代）", description: "平时高冷淡定，一旦越界就果断切割的决绝很相似" },
        { name: "塞雷娜·威廉姆斯", description: "平时沉稳，赛场上展现强烈胜负欲的气质很相似" },
      ],
    },
    es: {
      name: "Corta Todo Si Cruzas La Línea", catchphrase: "Frío Con Rechazos Repentinos",
      strengths: ["Tiene estándares personales claros", "Dice que no con claridad cuando es no", "Habla con honestidad cuando de verdad importa"],
      weaknesses: ["De repente rechaza con fuerza, y eso duele", "Gran diferencia de temperatura entre su calma y el estallido", "Rara vez explica por qué se molestó"],
      bestMatch: { code: "S+D", reason: "Bases firmes incluso en momentos impredecibles hacen que sea fácil estar cerca" },
      worstMatch: { code: "A+D", reason: "Un rechazo repentino contra alguien ya voluble termina en desastre" },
      similarFigures: [
        { name: "Taeyeon (Girls' Generation)", description: "Normalmente fría y serena, pero traza una línea firme si alguien la cruza" },
        { name: "Serena Williams", description: "Normalmente tranquila, pero muestra un fuego competitivo feroz cuando importa" },
      ],
    },
  },
  {
    code: "D+S",
    primaryAxis: "disorganized",
    secondaryAxis: "secure",
    ko: {
      name: "성장형 혼란러", catchphrase: "혼란스러운데 안정 찾아가는 중",
      strengths: ["혼란 속에서도 안정을 향해 노력함", "자기 성장 의지가 강함", "시행착오를 두려워하지 않음"],
      weaknesses: ["아직 패턴이 안 잡혀 예측하기 어려움", "좋아지다가도 예전 패턴으로 돌아감", "상대가 인내심을 가져야 함"],
      bestMatch: { code: "S", reason: "흔들리지 않는 S 옆에서 가장 빠르게 안정을 찾아감" },
      worstMatch: { code: "D+V", reason: "둘 다 불안정해서 서로 성장을 돕기보다 함께 흔들림" },
      similarFigures: [
        { name: "셀레나 고메즈", description: "힘든 시간을 겪으면서도 점점 단단해지는 모습이 닮았어요" },
        { name: "노박 조코비치", description: "기복 있던 초반에서 점점 안정을 찾아간 무드가 닮았어요" },
      ],
    },
    en: {
      name: "The Growing Chaos Type", catchphrase: "Disorganized But Finding Stability",
      strengths: ["Keeps working toward stability even amid the chaos", "Strong drive for self-growth", "Not afraid of trial and error"],
      weaknesses: ["Pattern isn't set yet, hard to predict", "Slips back into old habits even while improving", "Needs a patient partner"],
      bestMatch: { code: "S", reason: "Finds stability fastest right next to an unshaken Secure" },
      worstMatch: { code: "D+V", reason: "Both unstable — they shake together instead of helping each other grow" },
      similarFigures: [
        { name: "Selena Gomez", description: "Shares that journey of getting steadily stronger through hard times" },
        { name: "Novak Djokovic", description: "Has that same arc of finding stability after an early rocky start" },
      ],
    },
    ja: {
      name: "成長型カオスさん", catchphrase: "混乱してるけど安定を探し中",
      strengths: ["混乱の中でも安定に向けて努力する", "自己成長への意志が強い", "試行錯誤を恐れない"],
      weaknesses: ["まだパターンが定まらず予測しにくい", "良くなってきても以前のパターンに戻ることがある", "相手に忍耐が必要"],
      bestMatch: { code: "S", reason: "揺るがないSのそばで一番早く安定を見つけていく" },
      worstMatch: { code: "D+V", reason: "お互い不安定で成長を助け合うより一緒に揺れてしまう" },
      similarFigures: [
        { name: "セレーナ・ゴメス", description: "辛い時期を経ながらも徐々に強くなっていく姿が似ています" },
        { name: "ノバク・ジョコビッチ", description: "起伏のあった初期から徐々に安定を見つけていったムードが似ています" },
      ],
    },
    zh: {
      name: "成长型混乱者", catchphrase: "混乱但正在寻找安定",
      strengths: ["即使在混乱中也努力寻求安定", "自我成长的意志很强", "不害怕试错"],
      weaknesses: ["模式还未固定，难以预测", "变好的过程中偶尔又回到旧模式", "对方需要有耐心"],
      bestMatch: { code: "S", reason: "在不动摇的S身边最快找到安定" },
      worstMatch: { code: "D+V", reason: "两人都不稳定，与其互相帮助成长不如说是一起动摇" },
      similarFigures: [
        { name: "赛琳娜·戈麦斯", description: "经历艰难时期却逐渐变得坚强的样子很相似" },
        { name: "诺瓦克·德约科维奇", description: "从起伏的初期逐渐找到稳定的气质很相似" },
      ],
    },
    es: {
      name: "El Tipo Caótico En Crecimiento", catchphrase: "Desorganizado Pero Buscando Estabilidad",
      strengths: ["Sigue trabajando hacia la estabilidad incluso en medio del caos", "Fuerte impulso de crecimiento personal", "No le teme al ensayo y error"],
      weaknesses: ["El patrón aún no está fijo, difícil de predecir", "Vuelve a viejos hábitos incluso mientras mejora", "Necesita una pareja paciente"],
      bestMatch: { code: "S", reason: "Encuentra estabilidad más rápido junto a un Seguro inquebrantable" },
      worstMatch: { code: "D+V", reason: "Ambos inestables — se tambalean juntos en vez de ayudarse a crecer" },
      similarFigures: [
        { name: "Selena Gomez", description: "Comparte ese camino de volverse más fuerte a través de tiempos difíciles" },
        { name: "Novak Djokovic", description: "Tiene ese mismo arco de encontrar estabilidad tras un comienzo inestable" },
      ],
    },
  },
  {
    code: "D+A",
    primaryAxis: "disorganized",
    secondaryAxis: "anxious",
    ko: {
      name: "감정 소용돌이", catchphrase: "혼란스럽고 불안까지",
      strengths: ["감정에 솔직하고 열정적임", "사랑에 최선을 다해 몰입함", "힘든 순간도 감정을 숨기지 않고 나눔"],
      weaknesses: ["예측불가함과 불안이 겹쳐 기복이 매우 심함", "확인받고 싶을수록 더 혼란스러워짐", "상대가 페이스 맞추기 가장 힘든 유형"],
      bestMatch: { code: "S", reason: "어떤 소용돌이도 다 받아주는 S만이 유일한 안식처" },
      worstMatch: { code: "V+D", reason: "안 그래도 불안한데 상대까지 예측불가로 사라지면 완전히 무너짐" },
      similarFigures: [
        { name: "라나 델 레이", description: "깊고 복잡하게 뒤섞인 감정선이 닮았어요" },
        { name: "할시", description: "솔직하고 기복 큰 감정 표현 에너지가 닮았어요" },
      ],
    },
    en: {
      name: "Emotional Whirlwind", catchphrase: "Disorganized And Anxious Together",
      strengths: ["Honest, passionate emotion", "Fully invests in love", "Shares hard moments openly instead of hiding them"],
      weaknesses: ["Unpredictability and anxiety overlap into heavy swings", "The more reassurance is wanted, the more chaotic it gets", "The hardest type for a partner to keep pace with"],
      bestMatch: { code: "S", reason: "Secure is the only true refuge that can hold any whirlwind" },
      worstMatch: { code: "V+D", reason: "Already anxious, and a partner who vanishes unpredictably breaks it completely" },
      similarFigures: [
        { name: "Lana Del Rey", description: "Shares that deep, tangled mix of emotional undertones" },
        { name: "Halsey", description: "Has that same raw, up-and-down emotional expression" },
      ],
    },
    ja: {
      name: "感情の渦", catchphrase: "混乱してて不安まである",
      strengths: ["感情に正直で情熱的", "恋に全力で没頭する", "辛い瞬間も感情を隠さず分かち合う"],
      weaknesses: ["予測不能さと不安が重なり起伏が非常に激しい", "確認したいほどさらに混乱する", "相手が一番ペースを合わせにくいタイプ"],
      bestMatch: { code: "S", reason: "どんな渦も受け止めてくれるSだけが唯一の安らぎ" },
      worstMatch: { code: "V+D", reason: "ただでさえ不安なのに相手まで予測不能に消えると完全に崩れる" },
      similarFigures: [
        { name: "ラナ・デル・レイ", description: "深く複雑に入り混じった感情線が似ています" },
        { name: "ハルシー", description: "正直で起伏の大きい感情表現エネルギーが似ています" },
      ],
    },
    zh: {
      name: "情绪漩涡", catchphrase: "混乱又焦虑",
      strengths: ["情感真实而热烈", "全心投入爱情", "艰难时刻也不隐藏情绪，愿意分享"],
      weaknesses: ["不可预测和焦虑叠加，起伏非常剧烈", "越想被确认反而越混乱", "对方最难跟上节奏的类型"],
      bestMatch: { code: "S", reason: "能包容任何漩涡的S是唯一真正的港湾" },
      worstMatch: { code: "V+D", reason: "本就焦虑，若对方还不可预测地消失，会彻底崩溃" },
      similarFigures: [
        { name: "拉娜·德雷", description: "深沉复杂交织的情感线很相似" },
        { name: "Halsey", description: "坦率又起伏很大的情感表达能量很相似" },
      ],
    },
    es: {
      name: "Torbellino Emocional", catchphrase: "Desorganizado Y Ansioso A La Vez",
      strengths: ["Emoción honesta y apasionada", "Se entrega por completo al amor", "Comparte los momentos difíciles abiertamente en vez de ocultarlos"],
      weaknesses: ["Lo impredecible y la ansiedad se solapan en cambios fuertes", "Cuanta más reafirmación quiere, más caótico se vuelve", "El tipo más difícil de seguir para una pareja"],
      bestMatch: { code: "S", reason: "Seguro es el único refugio real que puede sostener cualquier torbellino" },
      worstMatch: { code: "V+D", reason: "Ya ansioso, y una pareja que desaparece de forma impredecible lo rompe por completo" },
      similarFigures: [
        { name: "Lana Del Rey", description: "Comparte esa mezcla profunda y compleja de matices emocionales" },
        { name: "Halsey", description: "Tiene esa misma expresión emocional cruda y cambiante" },
      ],
    },
  },
  {
    code: "D+V",
    primaryAxis: "disorganized",
    secondaryAxis: "avoidant",
    ko: {
      name: "다가왔다 사라지는 신기루", catchphrase: "혼란스러운데 결국 도망침",
      strengths: ["처음 다가올 땐 매력적이고 강렬함", "관계에 대한 갈망은 진심임", "패턴을 깨달으면 크게 성장할 잠재력"],
      weaknesses: ["결국 도망가서 관계가 오래가기 힘듦", "다가가고 싶은 마음과 두려움이 충돌함", "신뢰를 쌓기 어려운 신기루 같은 존재감"],
      bestMatch: { code: "S", reason: "도망쳐도 자리를 지켜주는 S만이 유일하게 붙잡아둘 수 있음" },
      worstMatch: { code: "A+V", reason: "둘 다 도망가는 유형이라 서로 다가가지 못하고 관계가 신기루처럼 사라짐" },
      similarFigures: [
        { name: "자인 말릭", description: "화려하게 등장했다가 갑자기 대중 앞에서 자취를 감추는 신비로운 무드가 닮았어요" },
        { name: "위켄드(The Weeknd)", description: "몽환적으로 등장했다 사라지는 이미지가 닮았어요" },
      ],
    },
    en: {
      name: "The Mirage That Disappears", catchphrase: "Disorganized But Ends Up Running Away",
      strengths: ["Intensely charming when first getting close", "The longing for connection is genuine", "Big growth potential once the pattern is recognized"],
      weaknesses: ["Ends up running, so the relationship struggles to last", "The wish to get close collides with fear", "A mirage-like presence that's hard to build trust with"],
      bestMatch: { code: "S", reason: "Only Secure, staying put even through the running away, can hold on" },
      worstMatch: { code: "A+V", reason: "Both types run — neither can approach, and the bond vanishes like a mirage" },
      similarFigures: [
        { name: "Zayn Malik", description: "Shares that pattern of a dazzling entrance followed by suddenly stepping out of the spotlight" },
        { name: "The Weeknd", description: "Has that same dreamlike, appear-then-vanish image" },
      ],
    },
    ja: {
      name: "現れては消える蜃気楼", catchphrase: "混乱してて結局逃げる",
      strengths: ["最初近づく時は魅力的で強烈", "関係への渇望は本物", "パターンに気づけば大きく成長する可能性"],
      weaknesses: ["結局逃げてしまい関係が長続きしにくい", "近づきたい気持ちと恐れがぶつかる", "信頼を築きにくい蜃気楼のような存在感"],
      bestMatch: { code: "S", reason: "逃げても居続けてくれるSだけが唯一つなぎとめられる" },
      worstMatch: { code: "A+V", reason: "お互い逃げるタイプで近づけず関係が蜃気楼のように消える" },
      similarFigures: [
        { name: "ゼイン・マリク", description: "華やかに登場した後、急に公の場から姿を消す神秘的なムードが似ています" },
        { name: "ザ・ウィークエンド", description: "夢のように現れては消えるイメージが似ています" },
      ],
    },
    zh: {
      name: "忽隐忽现的海市蜃楼", catchphrase: "混乱但最终选择逃跑",
      strengths: ["初次靠近时充满魅力且强烈", "对关系的渴望是真实的", "一旦意识到自己的模式就有很大成长潜力"],
      weaknesses: ["最终选择逃跑，关系难以长久", "想靠近的心情与恐惧相互冲突", "如海市蜃楼般难以建立信任"],
      bestMatch: { code: "S", reason: "只有即使对方逃跑也坚守原地的S才能留住TA" },
      worstMatch: { code: "A+V", reason: "两人都是逃跑型，谁都无法靠近，关系像海市蜃楼一样消失" },
      similarFigures: [
        { name: "泽恩·马利克", description: "华丽登场后突然从公众视野消失的神秘气质很相似" },
        { name: "The Weeknd", description: "梦幻般忽隐忽现的形象很相似" },
      ],
    },
    es: {
      name: "El Espejismo Que Desaparece", catchphrase: "Desorganizado Que Termina Huyendo",
      strengths: ["Intensamente encantador al principio del acercamiento", "El anhelo de conexión es genuino", "Gran potencial de crecimiento una vez que reconoce su propio patrón"],
      weaknesses: ["Termina huyendo, así que la relación batalla para durar", "El deseo de acercarse choca con el miedo", "Una presencia como espejismo, difícil de construir confianza"],
      bestMatch: { code: "S", reason: "Solo Seguro, que se queda incluso cuando el otro huye, puede retenerlo" },
      worstMatch: { code: "A+V", reason: "Ambos huyen — ninguno puede acercarse, y el vínculo desaparece como un espejismo" },
      similarFigures: [
        { name: "Zayn Malik", description: "Comparte ese patrón de una entrada deslumbrante seguida de una salida repentina del foco" },
        { name: "The Weeknd", description: "Tiene esa misma imagen onírica de aparecer y desaparecer" },
      ],
    },
  },
];

export function getAttachmentTypeByCode(code: string): AttachmentType | undefined {
  return ATTACHMENT_TYPES.find((t) => t.code === code);
}
