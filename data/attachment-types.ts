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
  // Mood-matched reuse of an existing public/characters/*.png portrait.
  // Only 14 unique portrait files exist (several data/characters.ts entries
  // already share one file), so 2 of these 16 assignments necessarily reuse
  // a portrait already used elsewhere; see the imageFile comment on those.
  imageFile: string;
  ko: AttachmentTypeLangContent;
  en: AttachmentTypeLangContent;
  ja: AttachmentTypeLangContent;
  zh: AttachmentTypeLangContent;
  es: AttachmentTypeLangContent;
};

// Per-axis identity (emoji mascot + gradient color) shared across the whole
// UI. Hybrid types blend primaryAxis -> secondaryAxis; pure types use their
// own axis for both ends of the gradient. Kept as data (not per-type fields)
// so the 16 types never drift out of sync with each other.
export const AXIS_META: Record<
  AttachmentAxis,
  { emoji: string; colorFrom: string; colorTo: string; label: Record<Lang, string> }
> = {
  secure: {
    emoji: "🌊",
    colorFrom: "#2dd4bf",
    colorTo: "#14b8a6",
    label: { ko: "안정형", en: "Secure", ja: "安定型", zh: "安全型", es: "Seguro" },
  },
  anxious: {
    emoji: "💗",
    colorFrom: "#fb7185",
    colorTo: "#e11d48",
    label: { ko: "불안형", en: "Anxious", ja: "不安型", zh: "焦虑型", es: "Ansioso" },
  },
  avoidant: {
    emoji: "🖤",
    colorFrom: "#60a5fa",
    colorTo: "#1e3a8a",
    label: { ko: "회피형", en: "Avoidant", ja: "回避型", zh: "回避型", es: "Evitativo" },
  },
  disorganized: {
    emoji: "🌪️",
    colorFrom: "#a78bfa",
    colorTo: "#6d28d9",
    label: { ko: "혼란형", en: "Disorganized", ja: "混乱型", zh: "混乱型", es: "Desorganizado" },
  },
};

export const ATTACHMENT_TYPES: AttachmentType[] = [
  // ── 4 pure types ──
  {
    code: "S",
    primaryAxis: "secure",
    secondaryAxis: null,
    imageFile: "first_sight.png",
    ko: {
      name: "완전 안정형", catchphrase: "청량 그 자체",
      strengths: ["안정적인 정서 표현", "대화로 갈등을 푸는 능력", "믿고 기다려주는 여유"],
      weaknesses: ["무던해서 신호를 못 챔", "밀당이 없어 심심하다는 말 들음", "속마음을 잘 안 드러냄"],
      bestMatch: { code: "A", reason: "불안한 A를 편안하게 만들어주는 든든한 존재" },
      worstMatch: { code: "D", reason: "예측불가능한 패턴에 지치기 쉬운 조합" },
      similarFigures: [
        { name: "이태원 클라쓰 박새로이", description: "흔들리지 않는 신념과 안정적인 태도로 유명한 캐릭터예요" },
        { name: "슬기로운 의사생활 이익준", description: "잔잔하고 편안한 리더십 무드가 닮았어요" },
      ],
    },
    en: {
      name: "Pure Secure", catchphrase: "Pure Refreshing Energy",
      strengths: ["Steady emotional expression", "Resolves conflict by talking", "Patient, trusting nature"],
      weaknesses: ["Misses subtle emotional cues", "Called \"boring\", no push-pull", "Rarely shows what's underneath"],
      bestMatch: { code: "A", reason: "Steadies Anxious's worries with calm reassurance" },
      worstMatch: { code: "D", reason: "Wears thin trying to keep up with unpredictable swings" },
      similarFigures: [
        { name: "Park Sae-ro-yi (Itaewon Class)", description: "Known for an unshakeable, grounded conviction" },
        { name: "Lee Ik-jun (Hospital Playlist)", description: "Has that same easygoing, steady leadership mood" },
      ],
    },
    ja: {
      name: "完全安定型", catchphrase: "清涼感そのもの",
      strengths: ["安定した感情表現", "対話で対立を解決する力", "信じて待てる余裕"],
      weaknesses: ["淡々としすぎてサインを見逃す", "駆け引きがなくてつまらないと言われる", "本音をあまり出さない"],
      bestMatch: { code: "A", reason: "不安なAを安心させてくれる頼れる存在" },
      worstMatch: { code: "D", reason: "予測不能なパターンに疲れやすい組み合わせ" },
      similarFigures: [
        { name: "パク・セロイ（梨泰院クラス）", description: "揺るがない信念と安定した態度で有名なキャラです" },
        { name: "イ・イクジュン（賢い医師生活）", description: "穏やかで安心感のあるリーダーシップが似ています" },
      ],
    },
    zh: {
      name: "完全安全型", catchphrase: "清爽感本身",
      strengths: ["情绪表达稳定", "用对话化解矛盾的能力", "愿意信任并等待的余裕"],
      weaknesses: ["太淡定容易错过信号", "没有拉锯战被说无趣", "不太表露真心"],
      bestMatch: { code: "A", reason: "能让焦虑的A安心下来的可靠存在" },
      worstMatch: { code: "D", reason: "容易被对方不可预测的模式搞疲惫" },
      similarFigures: [
        { name: "朴새로이（梨泰院Class）", description: "以坚定不移的信念和沉稳态度著称的角色" },
        { name: "李翊俊（machine机智医生生活）", description: "沉静安心的领导气质很相似" },
      ],
    },
    es: {
      name: "Seguro Puro", catchphrase: "Pura Energía Refrescante",
      strengths: ["Expresión emocional estable", "Resuelve conflictos hablando", "Paciente y confiado por naturaleza"],
      weaknesses: ["Se le escapan señales sutiles", "Le dicen \"aburrido\", sin juegos", "Rara vez muestra lo que siente"],
      bestMatch: { code: "A", reason: "Calma las preocupaciones de Ansioso con seguridad" },
      worstMatch: { code: "D", reason: "Se agota tratando de seguir los cambios impredecibles" },
      similarFigures: [
        { name: "Park Sae-ro-yi (Itaewon Class)", description: "Conocido por una convicción firme e inquebrantable" },
        { name: "Lee Ik-jun (Hospital Playlist)", description: "Tiene ese mismo liderazgo tranquilo y estable" },
      ],
    },
  },
  {
    code: "A",
    primaryAxis: "anxious",
    secondaryAxis: null,
    imageFile: "passion_straight.png",
    ko: {
      name: "완전 불안형", catchphrase: "감정 그 자체",
      strengths: ["솔직하고 풍부한 감정 표현", "연애에 진심으로 몰입", "관계에 대한 애정과 노력"],
      weaknesses: ["확인받고 싶은 마음이 큼", "작은 신호에도 불안해짐", "혼자만의 생각에 잘 빠짐"],
      bestMatch: { code: "S", reason: "S의 확신이 불안을 편안하게 가라앉혀줌" },
      worstMatch: { code: "V", reason: "밀어내는 V 때문에 불안이 폭발하는 전형적 밀당지옥" },
      similarFigures: [
        { name: "눈물의 여왕 홍해인", description: "사랑 앞에서 감정이 요동치는 무드가 비슷해요" },
        { name: "운명처럼 널 사랑해 정해준", description: "확인받고 싶어하는 애틋한 마음이 닮았어요" },
      ],
    },
    en: {
      name: "Pure Anxious", catchphrase: "Pure Emotion",
      strengths: ["Honest, rich emotional expression", "Fully invests in relationships", "Deep care and effort for the bond"],
      weaknesses: ["Craves constant reassurance", "Small signals spiral into worry", "Overthinks alone easily"],
      bestMatch: { code: "S", reason: "Secure's certainty settles the anxiety" },
      worstMatch: { code: "V", reason: "The classic chase-and-withdraw hell with Avoidant" },
      similarFigures: [
        { name: "Hong Hae-in (Queen of Tears)", description: "That same emotional turbulence when it comes to love" },
        { name: "Jung Hae-joon (Fated to Love You)", description: "Shares that yearning need for reassurance" },
      ],
    },
    ja: {
      name: "完全不安型", catchphrase: "感情そのもの",
      strengths: ["正直で豊かな感情表現", "恋愛に本気で没頭する", "関係への愛情と努力"],
      weaknesses: ["確認してもらいたい気持ちが強い", "小さなサインにも不安になる", "一人で考え込みやすい"],
      bestMatch: { code: "S", reason: "Sの確信が不安を優しく鎮めてくれる" },
      worstMatch: { code: "V", reason: "突き放すVのせいで不安が爆発する典型的な駆け引き地獄" },
      similarFigures: [
        { name: "ホン・ヘイン（涙の女王）", description: "恋の前で感情が揺れ動くムードが似ています" },
        { name: "チョン・ヘジュン（運命のように君を愛してる）", description: "確認してほしい切ない気持ちが似ています" },
      ],
    },
    zh: {
      name: "完全焦虑型", catchphrase: "情绪本身",
      strengths: ["坦率而丰富的情绪表达", "全心投入恋爱关系", "对关系充满爱与努力"],
      weaknesses: ["很需要被确认和安抚", "小小信号也会引发不安", "容易一个人胡思乱想"],
      bestMatch: { code: "S", reason: "S的笃定能让焦虑安稳下来" },
      worstMatch: { code: "V", reason: "被V推开导致焦虑爆发的经典拉锯战" },
      similarFigures: [
        { name: "洪海仁（眼泪女王）", description: "在爱情面前情绪波动的样子很相似" },
        { name: "郑海俊（命中注定我爱你）", description: "渴望被确认的心情很相似" },
      ],
    },
    es: {
      name: "Ansioso Puro", catchphrase: "Pura Emoción",
      strengths: ["Expresión emocional honesta y rica", "Se entrega por completo a la relación", "Cuida y se esfuerza profundamente por el vínculo"],
      weaknesses: ["Necesita reafirmación constante", "Pequeñas señales lo hacen espiralar", "Piensa demasiado a solas"],
      bestMatch: { code: "S", reason: "La certeza de Seguro calma la ansiedad" },
      worstMatch: { code: "V", reason: "El clásico infierno de perseguir y ser rechazado por Evitativo" },
      similarFigures: [
        { name: "Hong Hae-in (Queen of Tears)", description: "Esa misma turbulencia emocional frente al amor" },
        { name: "Jung Hae-joon (Fated to Love You)", description: "Comparte esa necesidad anhelante de reafirmación" },
      ],
    },
  },
  {
    code: "V",
    primaryAxis: "avoidant",
    secondaryAxis: null,
    imageFile: "quietly_scary.png",
    ko: {
      name: "완전 회피형", catchphrase: "시크 그 자체",
      strengths: ["감정에 휘둘리지 않는 침착함", "자기 공간을 지키는 독립성", "위기에서 냉정한 판단력"],
      weaknesses: ["말보다 거리두기가 먼저 나옴", "다가오는 상대를 부담스러워함", "속마음 표현에 서툶"],
      bestMatch: { code: "S", reason: "S의 인내심만이 마음을 여는 열쇠" },
      worstMatch: { code: "A", reason: "끊임없이 확인받고 싶어하는 A가 숨막히게 느껴짐" },
      similarFigures: [
        { name: "빈센조", description: "조용하고 시크한 무드 속 여유가 닮았어요" },
        { name: "더 글로리 문동은", description: "감정을 잘 드러내지 않는 냉정함이 비슷해요" },
      ],
    },
    en: {
      name: "Pure Avoidant", catchphrase: "Pure Chic Energy",
      strengths: ["Composed, not swayed by emotion", "Independent, protects own space", "Cool-headed judgment in a crisis"],
      weaknesses: ["Distance comes before words", "Feels burdened when someone gets close", "Struggles to voice what's underneath"],
      bestMatch: { code: "S", reason: "Only Secure's patience can unlock this heart" },
      worstMatch: { code: "A", reason: "Anxious's constant need for reassurance feels suffocating" },
      similarFigures: [
        { name: "Vincenzo Cassano (Vincenzo)", description: "Shares that quiet, chic composure" },
        { name: "Moon Dong-eun (The Glory)", description: "Has that same cool restraint in showing emotion" },
      ],
    },
    ja: {
      name: "完全回避型", catchphrase: "クールそのもの",
      strengths: ["感情に振り回されない冷静さ", "自分の空間を守る独立心", "危機での冷静な判断力"],
      weaknesses: ["言葉より先に距離を置く", "近づいてくる相手を負担に感じる", "本音を表現するのが苦手"],
      bestMatch: { code: "S", reason: "Sの忍耐力だけが心を開く鍵" },
      worstMatch: { code: "A", reason: "絶えず確認したがるAが息苦しく感じる" },
      similarFigures: [
        { name: "ヴィンセンゾ（ヴィンセンゾ）", description: "静かでクールな中の余裕が似ています" },
        { name: "ムン・ドンウン（ザ・グローリー）", description: "感情をあまり出さない冷静さが似ています" },
      ],
    },
    zh: {
      name: "完全回避型", catchphrase: "高冷本身",
      strengths: ["不被情绪左右的沉着", "守护个人空间的独立性", "危机中冷静的判断力"],
      weaknesses: ["比起说话更先拉开距离", "对靠近的对象感到有负担", "不擅长表达真心"],
      bestMatch: { code: "S", reason: "只有S的耐心才能打开这颗心" },
      worstMatch: { code: "A", reason: "总要确认的A让人感到窒息" },
      similarFigures: [
        { name: "文森佐（文森佐）", description: "安静高冷中的从容很相似" },
        { name: "文东恩（黑暗荣耀）", description: "不轻易流露情绪的冷静很相似" },
      ],
    },
    es: {
      name: "Evitativo Puro", catchphrase: "Puro Estilo Frío",
      strengths: ["Sereno, no se deja llevar por la emoción", "Independiente, protege su espacio", "Juicio frío en una crisis"],
      weaknesses: ["La distancia llega antes que las palabras", "Se siente agobiado cuando alguien se acerca", "Le cuesta decir lo que siente"],
      bestMatch: { code: "S", reason: "Solo la paciencia de Seguro puede abrir este corazón" },
      worstMatch: { code: "A", reason: "La necesidad constante de reafirmación de Ansioso resulta asfixiante" },
      similarFigures: [
        { name: "Vincenzo Cassano (Vincenzo)", description: "Comparte esa compostura tranquila y elegante" },
        { name: "Moon Dong-eun (The Glory)", description: "Tiene esa misma frialdad al mostrar emociones" },
      ],
    },
  },
  {
    code: "D",
    primaryAxis: "disorganized",
    secondaryAxis: null,
    imageFile: "alien_charm.png",
    ko: {
      name: "완전 혼란형", catchphrase: "예측불가 그 자체",
      strengths: ["감정에 솔직하고 열정적임", "순간순간 최선을 다해 몰입", "의외의 매력으로 관계에 활력"],
      weaknesses: ["감정 기복이 심한 편", "다가가고 싶다가도 두려워짐", "본인도 왜 그런지 설명 못할 때 있음"],
      bestMatch: { code: "S", reason: "어떤 혼란도 다 받아주는 S만이 유일한 안식처" },
      worstMatch: { code: "D", reason: "혼란+혼란은 서로 감당 못 하는 조합" },
      similarFigures: [
        { name: "나의 아저씨 이지안", description: "방어적이면서도 복잡한 내면이 닮았어요" },
        { name: "펜트하우스 심수련", description: "예측 못한 반전과 감정선이 닮았어요" },
      ],
    },
    en: {
      name: "Pure Disorganized", catchphrase: "Pure Unpredictable Energy",
      strengths: ["Honest, passionate emotion", "Fully present in each moment", "Unexpected charm energizes the relationship"],
      weaknesses: ["Prone to heavy mood swings", "Wants closeness, then gets scared of it", "Can't always explain their own reactions"],
      bestMatch: { code: "S", reason: "Only Secure can hold every kind of chaos" },
      worstMatch: { code: "D", reason: "Chaos plus chaos — neither can handle the other" },
      similarFigures: [
        { name: "Lee Ji-an (My Mister)", description: "Shares that guarded yet complicated inner world" },
        { name: "Shim Su-ryeon (The Penthouse)", description: "Has that same unpredictable emotional depth" },
      ],
    },
    ja: {
      name: "完全混乱型", catchphrase: "予測不可そのもの",
      strengths: ["感情に正直で情熱的", "その瞬間ごとに全力で没頭する", "意外な魅力が関係に活気を与える"],
      weaknesses: ["感情の起伏が激しい方", "近づきたいのに怖くなる", "自分でも理由が説明できない時がある"],
      bestMatch: { code: "S", reason: "どんな混乱も受け止めてくれるSだけが唯一の安らぎ" },
      worstMatch: { code: "D", reason: "混乱+混乱はお互い手に負えない組み合わせ" },
      similarFigures: [
        { name: "イ・ジアン（マイ・ミスター）", description: "防御的なのに複雑な内面が似ています" },
        { name: "シム・スリョン（ペントハウス）", description: "予測できない展開と感情線が似ています" },
      ],
    },
    zh: {
      name: "完全混乱型", catchphrase: "不可预测本身",
      strengths: ["情感真实而热烈", "每个瞬间都全情投入", "意想不到的魅力为关系注入活力"],
      weaknesses: ["情绪起伏比较大", "想靠近却又害怕", "有时连自己都说不清为什么"],
      bestMatch: { code: "S", reason: "只有能包容一切混乱的S才是唯一的港湾" },
      worstMatch: { code: "D", reason: "混乱+混乱=谁都无法承受对方" },
      similarFigures: [
        { name: "李知安（我的大叔）", description: "防御性又复杂的内心很相似" },
        { name: "沈秀莲（顶楼）", description: "意想不到的反转和情绪线很相似" },
      ],
    },
    es: {
      name: "Desorganizado Puro", catchphrase: "Pura Energía Impredecible",
      strengths: ["Emoción honesta y apasionada", "Totalmente presente en cada momento", "Un encanto inesperado que energiza la relación"],
      weaknesses: ["Propenso a cambios de humor fuertes", "Quiere cercanía y luego le teme", "No siempre puede explicar sus propias reacciones"],
      bestMatch: { code: "S", reason: "Solo Seguro puede sostener todo tipo de caos" },
      worstMatch: { code: "D", reason: "Caos más caos: ninguno puede con el otro" },
      similarFigures: [
        { name: "Lee Ji-an (My Mister)", description: "Comparte ese mundo interior complicado y a la defensiva" },
        { name: "Shim Su-ryeon (The Penthouse)", description: "Tiene esa misma profundidad emocional impredecible" },
      ],
    },
  },

  // ── 12 hybrid types ──
  {
    code: "S+A",
    primaryAxis: "secure",
    secondaryAxis: "anxious",
    imageFile: "office_worker.png",
    ko: {
      name: "평소엔 쿨, 위기땐 소심", catchphrase: "안정적인데 가끔 불안 터짐",
      strengths: ["평소엔 안정적인 리더십", "위기에도 대화로 풀려는 의지", "자기 불안을 자각하는 성장형"],
      weaknesses: ["가끔 갑자기 확인받고 싶어함", "스트레스 받으면 감정기복", "평소와 위기 때 갭이 큼"],
      bestMatch: { code: "V+S", reason: "겉으론 시크해도 결국 다 챙겨주는 든든함이 위기 순간을 받쳐줌" },
      worstMatch: { code: "A+D", reason: "안 그래도 가끔 불안한데 상대 감정기복까지 겹치면 둘 다 무너짐" },
      similarFigures: [
        { name: "김비서가 왜 그럴까 이영준", description: "평소엔 완벽한데 가끔 허당미가 터지는 무드예요" },
        { name: "이태원 클라쓰 박새로이", description: "단단하다가도 흔들리는 순간이 닮았어요" },
      ],
    },
    en: {
      name: "Cool Until Crisis Hits", catchphrase: "Secure With Occasional Anxiety Bursts",
      strengths: ["Steady leadership most of the time", "Still tries to talk things out in a crisis", "Self-aware about its own anxious streak"],
      weaknesses: ["Suddenly needs reassurance out of nowhere", "Mood dips under real stress", "Big gap between calm-mode and crisis-mode"],
      bestMatch: { code: "V+S", reason: "Chic on the outside but takes care of everything — steadies the crisis moments" },
      worstMatch: { code: "A+D", reason: "Already anxious sometimes; add their mood swings and both collapse" },
      similarFigures: [
        { name: "Lee Young-jun (What's Wrong with Secretary Kim)", description: "Perfect most days, occasionally shows a goofy crack" },
        { name: "Park Sae-ro-yi (Itaewon Class)", description: "Rock solid, with rare moments of wavering" },
      ],
    },
    ja: {
      name: "普段はクール、危機には小心", catchphrase: "安定してるのに時々不安が爆発",
      strengths: ["普段は安定したリーダーシップ", "危機でも対話で解決しようとする意志", "自分の不安を自覚する成長型"],
      weaknesses: ["急に確認してほしくなる時がある", "ストレスを受けると感情が揺れる", "普段と危機の時のギャップが大きい"],
      bestMatch: { code: "V+S", reason: "クールに見えて結局全部世話するV+Sが危機の瞬間を支えてくれる" },
      worstMatch: { code: "A+D", reason: "ただでさえ時々不安なのに相手の感情の起伏まで重なると二人とも崩れる" },
      similarFigures: [
        { name: "イ・ヨンジュン（キム秘書はいったい、なぜ？）", description: "普段は完璧だけど時々おっちょこちょいな面が出るムード" },
        { name: "パク・セロイ（梨泰院クラス）", description: "しっかりしてるのに揺れる瞬間が似ています" },
      ],
    },
    zh: {
      name: "平时冷静，危机时小心翼翼", catchphrase: "安全型但偶尔焦虑爆发",
      strengths: ["平时保持稳定的领导力", "危机中依然想用对话解决", "能察觉自己焦虑倾向的成长型"],
      weaknesses: ["偶尔会突然想要被确认", "压力大时情绪会波动", "平时和危机时反差很大"],
      bestMatch: { code: "V+S", reason: "表面高冷却把一切都照顾好，能撑住危机时刻" },
      worstMatch: { code: "A+D", reason: "本来就偶尔焦虑，再加上对方情绪起伏，两人都会崩溃" },
      similarFigures: [
        { name: "李英俊（金秘书为何那样）", description: "平时完美，偶尔露出呆萌一面的气质" },
        { name: "朴새로이（梨泰院Class）", description: "坚定中偶尔动摇的瞬间很相似" },
      ],
    },
    es: {
      name: "Tranquilo Hasta Que Llega La Crisis", catchphrase: "Seguro Con Estallidos De Ansiedad",
      strengths: ["Liderazgo estable la mayor parte del tiempo", "Aun en crisis intenta resolver hablando", "Consciente de su propia vena ansiosa"],
      weaknesses: ["De repente necesita reafirmación sin razón", "El ánimo baja bajo estrés real", "Gran diferencia entre su modo calma y su modo crisis"],
      bestMatch: { code: "V+S", reason: "Frío por fuera pero cuida de todo, sostiene los momentos de crisis" },
      worstMatch: { code: "A+D", reason: "Ya ansioso a veces; sumar los cambios de humor del otro hunde a ambos" },
      similarFigures: [
        { name: "Lee Young-jun (What's Wrong with Secretary Kim)", description: "Perfecto casi siempre, con grietas torpes ocasionales" },
        { name: "Park Sae-ro-yi (Itaewon Class)", description: "Sólido como roca, con raros momentos de duda" },
      ],
    },
  },
  {
    code: "S+V",
    primaryAxis: "secure",
    secondaryAxis: "avoidant",
    imageFile: "cold_lover.png",
    ko: {
      name: "다정한 밀당러", catchphrase: "안정적인데 은근 선 지킴",
      strengths: ["다정하지만 할 말은 함", "무리한 요구를 안 함", "서로의 공간을 존중함"],
      weaknesses: ["은근한 선긋기가 서운함으로 느껴짐", "다정함과 거리두기 신호가 헷갈림", "어디까지 다가가야 할지 스스로도 헷갈림"],
      bestMatch: { code: "A+S", reason: "티 안 내려는 노력이 여유로운 페이스와 잘 맞음" },
      worstMatch: { code: "A+V", reason: "둘 다 선을 그어서 아무도 먼저 다가가지 않음" },
      similarFigures: [
        { name: "도깨비 김신", description: "다정하지만 은근히 거리를 두는 무드가 닮았어요" },
        { name: "눈물의 여왕 백현우", description: "다정한데 할 말은 하는 밸런스가 비슷해요" },
      ],
    },
    en: {
      name: "The Warm Push-Puller", catchphrase: "Secure But Quietly Keeps Boundaries",
      strengths: ["Warm, but still says what needs saying", "Doesn't ask for more than is reasonable", "Respects both people's space"],
      weaknesses: ["Quiet boundary-setting can read as coldness", "Warmth and distance signals get mixed up", "Even they aren't sure how close is close enough"],
      bestMatch: { code: "A+S", reason: "Their effort to stay composed matches this type's easy pace" },
      worstMatch: { code: "A+V", reason: "Both draw lines, so neither one ever makes the first move" },
      similarFigures: [
        { name: "Kim Shin (Goblin)", description: "Warm, yet quietly keeps a little distance" },
        { name: "Baek Hyun-woo (Queen of Tears)", description: "Shares that balance of warmth with plain speaking" },
      ],
    },
    ja: {
      name: "優しい駆け引き上手", catchphrase: "安定してるのにさりげなく線引き",
      strengths: ["優しいけど言うべきことは言う", "無理な要求をしない", "お互いの空間を尊重する"],
      weaknesses: ["さりげない線引きが寂しさに感じられる", "優しさと距離のサインが紛らわしい", "自分でもどこまで近づくべきか迷う"],
      bestMatch: { code: "A+S", reason: "隠そうとする努力が余裕あるペースとよく合う" },
      worstMatch: { code: "A+V", reason: "お互い線を引くので誰も先に近づかない" },
      similarFigures: [
        { name: "キム・シン（トッケビ）", description: "優しいのにさりげなく距離を置くムードが似ています" },
        { name: "ペク・ヒョヌ（涙の女王）", description: "優しいのに言うべきことは言うバランスが似ています" },
      ],
    },
    zh: {
      name: "温柔的欲擒故纵者", catchphrase: "安全型但默默划清界限",
      strengths: ["温柔但该说的都会说", "不会提出过分的要求", "尊重彼此的空间"],
      weaknesses: ["默默划界限容易让人觉得委屈", "温柔和保持距离的信号容易混淆", "自己也不确定该靠近到什么程度"],
      bestMatch: { code: "A+S", reason: "对方努力不表露的样子和从容的节奏很契合" },
      worstMatch: { code: "A+V", reason: "两人都在划界限，谁都不会先靠近" },
      similarFigures: [
        { name: "金侁（鬼怪）", description: "温柔却又默默保持距离的气质很相似" },
        { name: "白玄祐（眼泪女王）", description: "温柔又该说就说的平衡感很相似" },
      ],
    },
    es: {
      name: "El Seductor Cariñoso", catchphrase: "Seguro Pero Marca Límites Sutilmente",
      strengths: ["Cariñoso, pero dice lo que hay que decir", "No pide más de lo razonable", "Respeta el espacio de ambos"],
      weaknesses: ["Marcar límites en silencio puede leerse como frialdad", "Se confunden las señales de calidez y distancia", "Ni siquiera ellos saben cuánta cercanía es suficiente"],
      bestMatch: { code: "A+S", reason: "Su esfuerzo por mantener la calma combina con este ritmo relajado" },
      worstMatch: { code: "A+V", reason: "Ambos marcan límites, así que ninguno da el primer paso" },
      similarFigures: [
        { name: "Kim Shin (Goblin)", description: "Cálido, pero guarda algo de distancia con sutileza" },
        { name: "Baek Hyun-woo (Queen of Tears)", description: "Comparte ese equilibrio entre calidez y franqueza" },
      ],
    },
  },
  {
    code: "S+D",
    primaryAxis: "secure",
    secondaryAxis: "disorganized",
    imageFile: "ceo.png",
    ko: {
      name: "예측 가능한 4차원", catchphrase: "안정적인데 가끔 종잡을 수 없음",
      strengths: ["큰 위기엔 안 흔들리는 기본기", "엉뚱한 매력으로 관계에 활력", "즉흥성과 안정감의 밸런스"],
      weaknesses: ["가끔 나오는 4차원 모먼트", "예측불가한 부분에 신뢰 쌓기 오래 걸림", "본인도 설명 못 하는 순간 있음"],
      bestMatch: { code: "D+S", reason: "서로의 혼란을 이해하며 함께 안정을 찾아가는 조합" },
      worstMatch: { code: "V+D", reason: "4차원 모먼트에 상대가 칼같이 선을 그어버려 상처받음" },
      similarFigures: [
        { name: "별에서 온 그대 도민준", description: "어딘가 4차원인데 든든한 무드가 닮았어요" },
        { name: "호텔 델루나 장만월", description: "엉뚱함과 카리스마가 공존하는 느낌이에요" },
      ],
    },
    en: {
      name: "Predictably Quirky", catchphrase: "Secure With Occasional Wild Cards",
      strengths: ["Rock-solid fundamentals in a real crisis", "Quirky charm keeps the relationship lively", "A balance of spontaneity and stability"],
      weaknesses: ["Occasional out-of-nowhere quirky moments", "The unpredictable streak makes trust slow to build", "Can't always explain their own randomness"],
      bestMatch: { code: "D+S", reason: "Both understand each other's chaos while growing toward stability together" },
      worstMatch: { code: "V+D", reason: "A quirky moment meets a sharp, sudden cutoff — it stings" },
      similarFigures: [
        { name: "Do Min-joon (My Love from the Star)", description: "Oddly quirky yet dependable at the same time" },
        { name: "Jang Man-wol (Hotel del Luna)", description: "That mix of eccentric charm and quiet charisma" },
      ],
    },
    ja: {
      name: "予測できる4次元", catchphrase: "安定してるのに時々つかめない",
      strengths: ["大きな危機には揺るがない基本", "変わった魅力が関係に活気を与える", "即興性と安定感のバランス"],
      weaknesses: ["時々出る4次元な瞬間", "予測できない部分で信頼を築くのに時間がかかる", "自分でも説明できない時がある"],
      bestMatch: { code: "D+S", reason: "お互いの混乱を理解しながら共に安定を探していく組み合わせ" },
      worstMatch: { code: "V+D", reason: "4次元な瞬間に相手がバッサリ線を引いて傷つく" },
      similarFigures: [
        { name: "ト・ミンジュン（星から来たあなた）", description: "どこか4次元だけど頼れるムードが似ています" },
        { name: "チャン・マンウォル（ホテルデルーナ）", description: "変わった魅力とカリスマが共存する感じです" },
      ],
    },
    zh: {
      name: "可预测的四次元", catchphrase: "安全型但偶尔让人捉摸不透",
      strengths: ["大危机中不会动摇的基本功", "特别的魅力为关系注入活力", "即兴与稳定感的平衡"],
      weaknesses: ["偶尔冒出的四次元瞬间", "难以预测的部分让信任建立较慢", "有时自己也解释不清"],
      bestMatch: { code: "D+S", reason: "理解彼此的混乱，一起走向安定的组合" },
      worstMatch: { code: "V+D", reason: "四次元瞬间遇上对方突然的果断划界，容易受伤" },
      similarFigures: [
        { name: "都敏俊（来自星星的你）", description: "有点四次元却很可靠的气质很相似" },
        { name: "张满月（酒店德露娜）", description: "古怪魅力与气场并存的感觉很相似" },
      ],
    },
    es: {
      name: "Impredeciblemente Predecible", catchphrase: "Seguro Con Sorpresas Ocasionales",
      strengths: ["Bases sólidas en una crisis real", "Su encanto excéntrico mantiene viva la relación", "Equilibrio entre espontaneidad y estabilidad"],
      weaknesses: ["Momentos excéntricos que salen de la nada", "La racha impredecible hace lenta la confianza", "No siempre puede explicar su propia rareza"],
      bestMatch: { code: "D+S", reason: "Ambos entienden el caos del otro mientras crecen juntos hacia la estabilidad" },
      worstMatch: { code: "V+D", reason: "Un momento excéntrico choca con un corte seco y repentino — duele" },
      similarFigures: [
        { name: "Do Min-joon (My Love from the Star)", description: "Raro de cierta forma pero confiable a la vez" },
        { name: "Jang Man-wol (Hotel del Luna)", description: "Esa mezcla de encanto excéntrico y carisma tranquilo" },
      ],
    },
  },
  {
    code: "A+S",
    primaryAxis: "anxious",
    secondaryAxis: "secure",
    imageFile: "untouchable.png",
    ko: {
      name: "속으론 폭풍, 겉으론 담담", catchphrase: "불안한데 티 안 내려고 노력함",
      strengths: ["감정을 조절하려는 노력", "겉으로는 신뢰감을 줌", "끊임없이 자기 감정을 성찰함"],
      weaknesses: ["속마음을 숨기다 오해가 쌓임", "혼자 삭히다 갑자기 터짐", "힘든 티를 안 내서 상대가 눈치 못 챔"],
      bestMatch: { code: "S+V", reason: "다정하면서도 안정적인 페이스가 속마음을 천천히 풀어줌" },
      worstMatch: { code: "V+A", reason: "둘 다 속마음을 숨기기만 해서 진짜 대화가 안 됨" },
      similarFigures: [
        { name: "나의 해방일지 염미정", description: "담담해 보이지만 속은 복잡한 무드가 닮았어요" },
        { name: "동백꽃 필 무렵 동백", description: "씩씩한 척하지만 속으로 애쓰는 느낌이 비슷해요" },
      ],
    },
    en: {
      name: "Storm Inside, Calm Outside", catchphrase: "Anxious But Trying Not To Show It",
      strengths: ["Actively works to regulate their emotions", "Comes across as trustworthy on the surface", "Constantly reflects on their own feelings"],
      weaknesses: ["Hiding what's inside builds up misunderstandings", "Bottles it up until it suddenly bursts", "Hides the struggle so well the partner misses it"],
      bestMatch: { code: "S+V", reason: "A warm, steady pace slowly unwinds what's held inside" },
      worstMatch: { code: "V+A", reason: "Both hide their true feelings, so real conversation never happens" },
      similarFigures: [
        { name: "Yeom Mi-jeong (My Liberation Notes)", description: "Looks composed, but there's a complicated world underneath" },
        { name: "Dongbaek (When the Camellia Blooms)", description: "Acts tough while quietly struggling inside" },
      ],
    },
    ja: {
      name: "内側は嵐、外側は平然", catchphrase: "不安なのに隠そうと努力する",
      strengths: ["感情をコントロールしようとする努力", "表面上は信頼感を与える", "絶えず自分の感情を振り返る"],
      weaknesses: ["本音を隠して誤解が積もる", "一人で抱え込んで急に爆発する", "辛さを見せないので相手が気づかない"],
      bestMatch: { code: "S+V", reason: "優しくて安定したペースが本音をゆっくり解きほぐしてくれる" },
      worstMatch: { code: "V+A", reason: "お互い本音を隠すだけで本当の会話ができない" },
      similarFigures: [
        { name: "ヨム・ミジョン（私の解放日誌）", description: "平然として見えても内側は複雑なムードが似ています" },
        { name: "トンベク（椿の花咲く頃）", description: "元気なふりをしながら内心頑張っている感じが似ています" },
      ],
    },
    zh: {
      name: "内心风暴，外表平静", catchphrase: "焦虑但努力不表现出来",
      strengths: ["努力调节自己的情绪", "表面上给人可靠的感觉", "不断反思自己的情绪"],
      weaknesses: ["藏起真心导致误会积累", "独自忍耐直到突然爆发", "不表现出辛苦让对方察觉不到"],
      bestMatch: { code: "S+V", reason: "温柔又稳定的节奏能慢慢解开内心" },
      worstMatch: { code: "V+A", reason: "两人都只藏着真心，无法真正沟通" },
      similarFigures: [
        { name: "廉美贞（我的解放日志）", description: "看似平静但内心复杂的气质很相似" },
        { name: "东柏（东柏花盛开时）", description: "假装坚强却在心里默默努力的感觉很相似" },
      ],
    },
    es: {
      name: "Tormenta Por Dentro, Calma Por Fuera", catchphrase: "Ansioso Pero Tratando De No Mostrarlo",
      strengths: ["Trabaja activamente para regular sus emociones", "Da una impresión de confianza en la superficie", "Reflexiona constantemente sobre sus propios sentimientos"],
      weaknesses: ["Ocultar lo que siente acumula malentendidos", "Lo guarda todo hasta que estalla de repente", "Oculta tan bien su lucha que la pareja no lo nota"],
      bestMatch: { code: "S+V", reason: "Un ritmo cálido y estable desenreda poco a poco lo que guarda dentro" },
      worstMatch: { code: "V+A", reason: "Ambos ocultan sus verdaderos sentimientos, así que nunca hay una conversación real" },
      similarFigures: [
        { name: "Yeom Mi-jeong (My Liberation Notes)", description: "Se ve serena, pero hay un mundo complicado debajo" },
        { name: "Dongbaek (When the Camellia Blooms)", description: "Actúa fuerte mientras lucha en silencio por dentro" },
      ],
    },
  },
  {
    code: "A+V",
    primaryAxis: "anxious",
    secondaryAxis: "avoidant",
    imageFile: "pretty_attitude.png",
    ko: {
      name: "궁금한데 도망감", catchphrase: "불안한데 다가가지도 못함",
      strengths: ["상대를 세심하게 관찰함", "신중하게 다가가서 상처를 줄임", "마음을 열면 깊게 애정을 줌"],
      weaknesses: ["다가가고 싶은데 동시에 도망감", "막상 다가오면 부담스러워함", "확신이 없으면 계속 제자리"],
      bestMatch: { code: "S", reason: "흔들리지 않는 S의 페이스가 접근-회피 패턴을 안정적으로 받아줌" },
      worstMatch: { code: "D+V", reason: "둘 다 다가가다 도망가는 패턴이라 서로 지쳐서 관계가 증발함" },
      similarFigures: [
        { name: "사랑의 불시착 윤세리", description: "다가가고 싶은데 조심스러워하는 무드가 닮았어요" },
        { name: "멜로가 체질 임진주", description: "마음은 있는데 표현이 조심스러운 느낌이에요" },
      ],
    },
    en: {
      name: "Curious But Runs Away", catchphrase: "Anxious But Can't Even Approach",
      strengths: ["Pays close, careful attention to the other person", "Approaches carefully to avoid getting hurt", "Loves deeply once the heart opens up"],
      weaknesses: ["Wants to get closer while running away at the same time", "Feels overwhelmed the moment someone actually gets close", "Stays stuck without certainty"],
      bestMatch: { code: "S", reason: "Secure's unshaken pace steadily holds this approach-avoid pattern" },
      worstMatch: { code: "D+V", reason: "Both approach then flee — they wear each other out until the bond evaporates" },
      similarFigures: [
        { name: "Yoon Se-ri (Crash Landing on You)", description: "Wants to get closer but stays cautious about it" },
        { name: "Lim Jin-joo (Melo Movie)", description: "Feels it deeply but is careful about showing it" },
      ],
    },
    ja: {
      name: "気になるのに逃げる", catchphrase: "不安なのに近づけもしない",
      strengths: ["相手を細やかに観察する", "慎重に近づいて傷を減らす", "心を開けば深く愛情を注ぐ"],
      weaknesses: ["近づきたいのに同時に逃げてしまう", "実際に近づかれると負担に感じる", "確信がないとずっと足踏みする"],
      bestMatch: { code: "S", reason: "揺るがないSのペースが接近回避パターンを安定して受け止めてくれる" },
      worstMatch: { code: "D+V", reason: "お互い近づいては逃げるパターンで疲れて関係が消えてしまう" },
      similarFigures: [
        { name: "ユン・セリ（愛の不時着）", description: "近づきたいのに慎重になるムードが似ています" },
        { name: "イム・ジンジュ（メロが体質）", description: "気持ちはあるのに表現に慎重な感じが似ています" },
      ],
    },
    zh: {
      name: "好奇却逃跑", catchphrase: "焦虑却连靠近都做不到",
      strengths: ["细腻地观察对方", "谨慎靠近以减少受伤", "一旦敞开心扉就爱得很深"],
      weaknesses: ["想靠近又同时想逃跑", "对方真的靠近时又觉得有负担", "没有把握就一直原地踏步"],
      bestMatch: { code: "S", reason: "S稳定不动摇的节奏能安稳地接住这种接近-回避模式" },
      worstMatch: { code: "D+V", reason: "两人都是靠近又逃跑，彼此疲惫，关系最终消散" },
      similarFigures: [
        { name: "尹世理（爱的迫降）", description: "想靠近却又小心翼翼的气质很相似" },
        { name: "林珍珠（Melo电影）", description: "心里有意却表达谨慎的感觉很相似" },
      ],
    },
    es: {
      name: "Curioso Pero Huye", catchphrase: "Ansioso Pero No Puede Ni Acercarse",
      strengths: ["Observa a la otra persona con mucha atención", "Se acerca con cuidado para evitar salir herido", "Ama profundamente una vez que abre el corazón"],
      weaknesses: ["Quiere acercarse mientras huye al mismo tiempo", "Se siente abrumado en cuanto alguien realmente se acerca", "Se queda estancado sin certeza"],
      bestMatch: { code: "S", reason: "El ritmo firme de Seguro sostiene con estabilidad este patrón de acercarse y huir" },
      worstMatch: { code: "D+V", reason: "Ambos se acercan y huyen — se agotan mutuamente hasta que el vínculo se evapora" },
      similarFigures: [
        { name: "Yoon Se-ri (Crash Landing on You)", description: "Quiere acercarse pero se mantiene cautelosa" },
        { name: "Lim Jin-joo (Melo Movie)", description: "Siente profundamente pero es cuidadosa al mostrarlo" },
      ],
    },
  },
  {
    code: "A+D",
    primaryAxis: "anxious",
    secondaryAxis: "disorganized",
    imageFile: "dex.png",
    ko: {
      name: "롤러코스터 그 자체", catchphrase: "불안하고 감정 기복 심함",
      strengths: ["솔직하고 풍부한 감정 표현", "연애에 진심으로 몰입", "순간의 감정에 최선을 다함"],
      weaknesses: ["감정 기복이 관계를 불안정하게 함", "확인 욕구와 예측불가함이 동시에 나타남", "상대가 페이스 맞추기 힘들어함"],
      bestMatch: { code: "S", reason: "무슨 일이 있어도 흔들리지 않는 S가 유일하게 다 받아줄 수 있음" },
      worstMatch: { code: "V", reason: "감정 기복을 V는 부담스러워하며 거리를 둬서 최악의 궁합" },
      similarFigures: [
        { name: "펜트하우스 천서진", description: "감정 기복과 극적인 전개가 닮았어요" },
        { name: "눈물의 여왕 홍해인", description: "롤러코스터 같은 감정선이 비슷해요" },
      ],
    },
    en: {
      name: "The Rollercoaster Itself", catchphrase: "Anxious With Heavy Mood Swings",
      strengths: ["Honest, rich emotional expression", "Fully invests in love", "Gives every moment their full feeling"],
      weaknesses: ["Mood swings destabilize the relationship", "Need for reassurance and unpredictability show up together", "Hard for a partner to keep pace with"],
      bestMatch: { code: "S", reason: "Secure, unshaken no matter what, is the only one who can hold it all" },
      worstMatch: { code: "V", reason: "Avoidant finds the mood swings overwhelming and pulls away — the worst match" },
      similarFigures: [
        { name: "Cheon Seo-jin (The Penthouse)", description: "Shares that mood-swinging, dramatic unfolding" },
        { name: "Hong Hae-in (Queen of Tears)", description: "That same rollercoaster emotional arc" },
      ],
    },
    ja: {
      name: "ジェットコースターそのもの", catchphrase: "不安で感情の起伏が激しい",
      strengths: ["正直で豊かな感情表現", "恋愛に本気で没頭する", "その瞬間の感情に全力を注ぐ"],
      weaknesses: ["感情の起伏が関係を不安定にする", "確認欲求と予測不能さが同時に出る", "相手がペースを合わせるのが大変"],
      bestMatch: { code: "S", reason: "何があっても揺るがないSだけが全部受け止めてくれる" },
      worstMatch: { code: "V", reason: "感情の起伏をVは負担に感じて距離を置く最悪の相性" },
      similarFigures: [
        { name: "チョン・ソジン（ペントハウス）", description: "感情の起伏とドラマチックな展開が似ています" },
        { name: "ホン・ヘイン（涙の女王）", description: "ジェットコースターのような感情線が似ています" },
      ],
    },
    zh: {
      name: "过山车本车", catchphrase: "焦虑且情绪起伏很大",
      strengths: ["坦率而丰富的情绪表达", "全心投入恋爱", "对每个瞬间的情绪都全力以赴"],
      weaknesses: ["情绪起伏让关系变得不稳定", "被确认的需求和不可预测同时出现", "对方很难跟上节奏"],
      bestMatch: { code: "S", reason: "无论发生什么都不动摇的S是唯一能全部接住的人" },
      worstMatch: { code: "V", reason: "V会因情绪起伏感到负担而拉开距离，是最差的组合" },
      similarFigures: [
        { name: "千瑞珍（顶楼）", description: "情绪起伏和戏剧化展开很相似" },
        { name: "洪海仁（眼泪女王）", description: "过山车般的情绪线很相似" },
      ],
    },
    es: {
      name: "La Montaña Rusa Misma", catchphrase: "Ansioso Con Cambios De Humor Fuertes",
      strengths: ["Expresión emocional honesta y rica", "Se entrega por completo al amor", "Da todo su sentir a cada momento"],
      weaknesses: ["Los cambios de humor desestabilizan la relación", "La necesidad de reafirmación y lo impredecible aparecen juntos", "Es difícil para la pareja seguirle el ritmo"],
      bestMatch: { code: "S", reason: "Seguro, inquebrantable pase lo que pase, es el único que puede sostenerlo todo" },
      worstMatch: { code: "V", reason: "Evitativo encuentra abrumadores los cambios de humor y se aleja — la peor combinación" },
      similarFigures: [
        { name: "Cheon Seo-jin (The Penthouse)", description: "Comparte ese desarrollo dramático y cambiante" },
        { name: "Hong Hae-in (Queen of Tears)", description: "Ese mismo arco emocional de montaña rusa" },
      ],
    },
  },
  {
    code: "V+S",
    primaryAxis: "avoidant",
    secondaryAxis: "secure",
    imageFile: "rich.png",
    ko: {
      name: "츤데레의 정석", catchphrase: "시크한데 결국 다 챙겨줌",
      strengths: ["표현은 서툴어도 행동으로 챙김", "은근히 두터운 신뢰", "위기 상황에서 의외로 든든함"],
      weaknesses: ["마음을 말로 표현 안 해서 오해받음", "챙겨주면서 티 안 내 고마움을 몰라줄 때 있음", "다가가는 데 시간이 오래 걸림"],
      bestMatch: { code: "S+A", reason: "든든하게 챙겨주는 무드가 위기 때 흔들리는 상대를 잡아줌" },
      worstMatch: { code: "A", reason: "끊임없는 확인을 원하는 A에게 무뚝뚝함이 답답하게 느껴짐" },
      similarFigures: [
        { name: "김비서가 왜 그럴까 이영준", description: "츤데레의 정석 같은 무드가 그대로 닮았어요" },
        { name: "태양의 후예 유시진", description: "무뚝뚝해도 결국 다 챙기는 느낌이 비슷해요" },
      ],
    },
    en: {
      name: "Textbook Tsundere", catchphrase: "Chic But Ends Up Taking Care of Everything",
      strengths: ["Awkward with words but takes care of things through action", "Quietly deep, solid trust", "Surprisingly dependable in a real crisis"],
      weaknesses: ["Gets misread because feelings aren't said out loud", "Cares without showing it, so the effort goes unnoticed", "Takes a long time to actually open up"],
      bestMatch: { code: "S+A", reason: "That dependable, taking-care-of-everything energy steadies a partner shaken by crisis" },
      worstMatch: { code: "A", reason: "The bluntness feels frustrating to Anxious, who craves constant reassurance" },
      similarFigures: [
        { name: "Lee Young-jun (What's Wrong with Secretary Kim)", description: "The textbook tsundere mood, almost exactly" },
        { name: "Yoo Si-jin (Descendants of the Sun)", description: "Gruff, but ends up taking care of everyone anyway" },
      ],
    },
    ja: {
      name: "ツンデレの教科書", catchphrase: "クールなのに結局全部世話する",
      strengths: ["表現は不器用でも行動で世話をする", "さりげなく厚い信頼", "危機の状況で意外と頼れる"],
      weaknesses: ["気持ちを言葉にしないので誤解される", "世話をしても素振りを見せず感謝されないことがある", "近づくのに時間がかかる"],
      bestMatch: { code: "S+A", reason: "頼もしく世話をするムードが危機の時に揺れる相手を支えてくれる" },
      worstMatch: { code: "A", reason: "絶えず確認を求めるAにはぶっきらぼうさがもどかしく感じられる" },
      similarFigures: [
        { name: "イ・ヨンジュン（キム秘書はいったい、なぜ？）", description: "ツンデレの教科書のようなムードがそのまま似ています" },
        { name: "ユ・シジン（太陽の末裔）", description: "ぶっきらぼうでも結局全部世話する感じが似ています" },
      ],
    },
    zh: {
      name: "傲娇教科书", catchphrase: "高冷但最后全都照顾到",
      strengths: ["表达笨拙但用行动照顾对方", "默默积累的深厚信任", "危机时刻意外地可靠"],
      weaknesses: ["因不把心意说出口而被误会", "照顾对方却不表现出来，容易不被感激", "需要很长时间才能真正靠近"],
      bestMatch: { code: "S+A", reason: "可靠又照顾一切的气质能撑住危机时动摇的对方" },
      worstMatch: { code: "A", reason: "对渴望不断确认的A来说，冷淡的态度让人很憋闷" },
      similarFigures: [
        { name: "李英俊（金秘书为何那样）", description: "傲娇教科书般的气质几乎一模一样" },
        { name: "刘时镇（太阳的后裔）", description: "嘴上冷淡却最终照顾所有人的感觉很相似" },
      ],
    },
    es: {
      name: "El Tsundere De Manual", catchphrase: "Frío Pero Termina Cuidando Todo",
      strengths: ["Torpe con las palabras pero cuida con acciones", "Confianza sólida y silenciosa", "Sorprendentemente confiable en una crisis real"],
      weaknesses: ["Lo malinterpretan porque no dice lo que siente en voz alta", "Cuida sin demostrarlo, así que el esfuerzo pasa desapercibido", "Tarda mucho en realmente abrirse"],
      bestMatch: { code: "S+A", reason: "Esa energía confiable de cuidar todo estabiliza a una pareja sacudida por la crisis" },
      worstMatch: { code: "A", reason: "La brusquedad resulta frustrante para Ansioso, que anhela reafirmación constante" },
      similarFigures: [
        { name: "Lee Young-jun (What's Wrong with Secretary Kim)", description: "El tsundere de manual, casi al pie de la letra" },
        { name: "Yoo Si-jin (Descendants of the Sun)", description: "Rudo, pero termina cuidando de todos igual" },
      ],
    },
  },
  {
    code: "V+A",
    primaryAxis: "avoidant",
    secondaryAxis: "anxious",
    imageFile: "revenge_women.png",
    ko: {
      name: "무심한 척 다 봄", catchphrase: "시크한데 은근 신경 씀",
      strengths: ["무심한 척하면서도 세심하게 챙김", "상대의 감정 변화를 잘 알아챔", "걱정을 티 내지 않아 부담을 안 줌"],
      weaknesses: ["신경 쓰는 티를 안 내 무심하다는 오해", "자기도 불안한데 이중으로 힘듦", "먼저 다가가는 게 어색함"],
      bestMatch: { code: "S", reason: "무심한 척하는 진심을 알아채고 편하게 이끌어주는 S" },
      worstMatch: { code: "A+S", reason: "둘 다 속마음을 숨기기만 해서 서로의 진심을 영영 모를 수도" },
      similarFigures: [
        { name: "도깨비 저승사자", description: "무심한 듯하지만 계속 신경 쓰는 무드가 닮았어요" },
        { name: "나의 아저씨 박동훈", description: "무뚝뚝해도 세심하게 챙기는 느낌이 비슷해요" },
      ],
    },
    en: {
      name: "Acts Indifferent, Notices Everything", catchphrase: "Chic But Secretly Cares",
      strengths: ["Acts indifferent but quietly pays close attention", "Picks up on the other person's emotional shifts fast", "Worries without showing it, so it never feels heavy"],
      weaknesses: ["Reads as indifferent because the caring stays hidden", "Anxious underneath too, so it's a double weight to carry", "Feels awkward making the first move"],
      bestMatch: { code: "S", reason: "Secure notices the real feelings behind the indifferent act and leads gently" },
      worstMatch: { code: "A+S", reason: "Both hide what they really feel, so they may never truly know each other" },
      similarFigures: [
        { name: "Grim Reaper (Goblin)", description: "Seems indifferent but is quietly paying attention the whole time" },
        { name: "Park Dong-hoon (My Mister)", description: "Gruff, yet notices the small things with care" },
      ],
    },
    ja: {
      name: "無関心なふりで全部見てる", catchphrase: "クールなのにさりげなく気にする",
      strengths: ["無関心なふりをしながらも細やかに気にかける", "相手の感情の変化によく気づく", "心配を見せないので負担を与えない"],
      weaknesses: ["気にかけている素振りを見せず無関心だと誤解される", "自分も不安なのに二重に大変", "先に近づくのが気まずい"],
      bestMatch: { code: "S", reason: "無関心なふりの本心に気づき、優しく導いてくれるS" },
      worstMatch: { code: "A+S", reason: "お互い本音を隠すだけで永遠に相手の本心を知らないかもしれない" },
      similarFigures: [
        { name: "死神（トッケビ）", description: "無関心そうでいてずっと気にかけているムードが似ています" },
        { name: "パク・ドンフン（マイ・ミスター）", description: "ぶっきらぼうでも細やかに気にかける感じが似ています" },
      ],
    },
    zh: {
      name: "装作无所谓其实都看在眼里", catchphrase: "高冷但暗自在意",
      strengths: ["装作无所谓却默默细心照顾", "很快察觉对方情绪的变化", "担心也不表现出来，不给对方压力"],
      weaknesses: ["不表现在意会被误以为冷漠", "自己也焦虑，等于双重辛苦", "很难先主动靠近"],
      bestMatch: { code: "S", reason: "S能察觉这份装无所谓背后的真心，并温柔地引导" },
      worstMatch: { code: "A+S", reason: "两人都只是隐藏真心，可能永远不了解彼此的真实想法" },
      similarFigures: [
        { name: "死神（鬼怪）", description: "看似无所谓却一直在意的气质很相似" },
        { name: "朴东勋（我的大叔）", description: "嘴上冷淡却细心照顾的感觉很相似" },
      ],
    },
    es: {
      name: "Finge Indiferencia Pero Nota Todo", catchphrase: "Frío Pero Secretamente Le Importa",
      strengths: ["Finge indiferencia pero presta atención en silencio", "Detecta rápido los cambios emocionales del otro", "Se preocupa sin demostrarlo, así nunca resulta pesado"],
      weaknesses: ["Parece indiferente porque el cariño queda oculto", "También está ansioso por dentro, así que carga el doble", "Le resulta incómodo dar el primer paso"],
      bestMatch: { code: "S", reason: "Seguro nota los sentimientos reales detrás de la indiferencia fingida y guía con suavidad" },
      worstMatch: { code: "A+S", reason: "Ambos ocultan lo que realmente sienten, así que puede que nunca se conozcan de verdad" },
      similarFigures: [
        { name: "Grim Reaper (Goblin)", description: "Parece indiferente pero está pendiente todo el tiempo" },
        { name: "Park Dong-hoon (My Mister)", description: "Rudo, pero nota los pequeños detalles con cuidado" },
      ],
    },
  },
  {
    code: "V+D",
    primaryAxis: "avoidant",
    secondaryAxis: "disorganized",
    imageFile: "smiling_scary.png",
    ko: {
      name: "선 넘으면 칼같음", catchphrase: "시크한데 가끔 확 밀어냄",
      strengths: ["자기 기준이 명확함", "아닌 건 아니라고 확실히 표현", "할 말은 하는 솔직함"],
      weaknesses: ["갑자기 확 밀어내서 상대가 상처받음", "평소와 폭발 사이 온도차가 큼", "왜 화났는지 설명을 잘 안 함"],
      bestMatch: { code: "S+D", reason: "예측불가한 순간에도 흔들리지 않는 기본기가 편하게 만들어줌" },
      worstMatch: { code: "A+D", reason: "감정 기복 심한 상대를 갑자기 확 밀어내면 관계가 파국으로" },
      similarFigures: [
        { name: "더 글로리 문동은", description: "평소엔 조용하다 선 넘으면 확실히 끊어내는 무드예요" },
        { name: "빈센조", description: "차갑다가도 확실하게 선을 긋는 느낌이 닮았어요" },
      ],
    },
    en: {
      name: "Cuts You Off The Moment You Cross The Line", catchphrase: "Chic With Sudden Sharp Pushback",
      strengths: ["Has clear personal standards", "Says no clearly when it's a no", "Speaks up honestly when it matters"],
      weaknesses: ["Suddenly pushes back hard, and it stings", "Big gap in temperature between calm mode and the outburst", "Rarely explains why they got upset"],
      bestMatch: { code: "S+D", reason: "Unshaken fundamentals even in unpredictable moments make this easy to be around" },
      worstMatch: { code: "A+D", reason: "A sudden hard pushback against someone already mood-swinging ends in disaster" },
      similarFigures: [
        { name: "Moon Dong-eun (The Glory)", description: "Quiet most of the time, but cuts off decisively once a line is crossed" },
        { name: "Vincenzo Cassano (Vincenzo)", description: "Cold, yet draws a firm line when it counts" },
      ],
    },
    ja: {
      name: "一線を越えたら容赦ない", catchphrase: "クールなのに時々突き放す",
      strengths: ["自分の基準が明確", "違うことははっきり表現する", "言うべきことは言う正直さ"],
      weaknesses: ["急に突き放して相手が傷つく", "普段と爆発の間の温度差が大きい", "なぜ怒ったのかあまり説明しない"],
      bestMatch: { code: "S+D", reason: "予測できない瞬間にも揺るがない基本が居心地を良くしてくれる" },
      worstMatch: { code: "A+D", reason: "感情の起伏が激しい相手を急に突き放すと関係が破局に" },
      similarFigures: [
        { name: "ムン・ドンウン（ザ・グローリー）", description: "普段は静かだが一線を越えるとはっきり切るムードです" },
        { name: "ヴィンセンゾ（ヴィンセンゾ）", description: "冷たいのにはっきり線を引く感じが似ています" },
      ],
    },
    zh: {
      name: "越界就翻脸", catchphrase: "高冷但偶尔狠狠推开",
      strengths: ["自己的标准很明确", "不行的事情会明确表达", "该说的话都会说的坦率"],
      weaknesses: ["突然狠狠推开会让对方受伤", "平时和爆发之间温差很大", "很少解释自己为什么生气"],
      bestMatch: { code: "S+D", reason: "在不可预测的瞬间也不动摇的基本功让人很自在" },
      worstMatch: { code: "A+D", reason: "对情绪起伏大的对方突然狠推，关系容易走向破裂" },
      similarFigures: [
        { name: "文东恩（黑暗荣耀）", description: "平时安静，一旦越界就果断切断的气质" },
        { name: "文森佐（文森佐）", description: "冷淡中又坚定划清界限的感觉很相似" },
      ],
    },
    es: {
      name: "Corta Todo Si Cruzas La Línea", catchphrase: "Frío Con Rechazos Repentinos",
      strengths: ["Tiene estándares personales claros", "Dice que no con claridad cuando es no", "Habla con honestidad cuando de verdad importa"],
      weaknesses: ["De repente rechaza con fuerza, y eso duele", "Gran diferencia de temperatura entre su calma y el estallido", "Rara vez explica por qué se molestó"],
      bestMatch: { code: "S+D", reason: "Bases firmes incluso en momentos impredecibles hacen que sea fácil estar cerca" },
      worstMatch: { code: "A+D", reason: "Un rechazo repentino contra alguien ya voluble termina en desastre" },
      similarFigures: [
        { name: "Moon Dong-eun (The Glory)", description: "Tranquila casi siempre, pero corta con decisión si cruzan la línea" },
        { name: "Vincenzo Cassano (Vincenzo)", description: "Frío, pero traza una línea firme cuando de verdad importa" },
      ],
    },
  },
  {
    code: "D+S",
    primaryAxis: "disorganized",
    secondaryAxis: "secure",
    // Reused from pure D — only 14 unique portraits exist for 16 types;
    // this pairing shares D's primary axis so the reuse tracks visually.
    imageFile: "alien_charm.png",
    ko: {
      name: "성장형 혼란러", catchphrase: "혼란스러운데 안정 찾아가는 중",
      strengths: ["혼란 속에서도 안정을 향해 노력함", "자기 성장 의지가 강함", "시행착오를 두려워하지 않음"],
      weaknesses: ["아직 패턴이 안 잡혀 예측하기 어려움", "좋아지다가도 예전 패턴으로 돌아감", "상대가 인내심을 가져야 함"],
      bestMatch: { code: "S", reason: "흔들리지 않는 S 옆에서 가장 빠르게 안정을 찾아감" },
      worstMatch: { code: "D+V", reason: "둘 다 불안정해서 서로 성장을 돕기보다 함께 흔들림" },
      similarFigures: [
        { name: "이태원 클라쓰 조이서", description: "좌충우돌하다가도 자기 자리를 찾아가는 무드예요" },
        { name: "동백꽃 필 무렵 동백", description: "흔들리면서도 조금씩 단단해지는 느낌이 닮았어요" },
      ],
    },
    en: {
      name: "The Growing Chaos Type", catchphrase: "Disorganized But Finding Stability",
      strengths: ["Keeps working toward stability even amid the chaos", "Strong drive for self-growth", "Not afraid of trial and error"],
      weaknesses: ["Pattern isn't set yet, hard to predict", "Slips back into old habits even while improving", "Needs a patient partner"],
      bestMatch: { code: "S", reason: "Finds stability fastest right next to an unshaken Secure" },
      worstMatch: { code: "D+V", reason: "Both unstable — they shake together instead of helping each other grow" },
      similarFigures: [
        { name: "Jo Yi-seo (Itaewon Class)", description: "Stumbles around but keeps finding her own footing" },
        { name: "Dongbaek (When the Camellia Blooms)", description: "Wavers, yet grows a little steadier each time" },
      ],
    },
    ja: {
      name: "成長型カオスさん", catchphrase: "混乱してるけど安定を探し中",
      strengths: ["混乱の中でも安定に向けて努力する", "自己成長への意志が強い", "試行錯誤を恐れない"],
      weaknesses: ["まだパターンが定まらず予測しにくい", "良くなってきても以前のパターンに戻ることがある", "相手に忍耐が必要"],
      bestMatch: { code: "S", reason: "揺るがないSのそばで一番早く安定を見つけていく" },
      worstMatch: { code: "D+V", reason: "お互い不安定で成長を助け合うより一緒に揺れてしまう" },
      similarFigures: [
        { name: "チョ・イソ（梨泰院クラス）", description: "右往左往しながらも自分の居場所を見つけていくムードです" },
        { name: "トンベク（椿の花咲く頃）", description: "揺れながらも少しずつ強くなっていく感じが似ています" },
      ],
    },
    zh: {
      name: "成长型混乱者", catchphrase: "混乱但正在寻找安定",
      strengths: ["即使在混乱中也努力寻求安定", "自我成长的意志很强", "不害怕试错"],
      weaknesses: ["模式还未固定，难以预测", "变好的过程中偶尔又回到旧模式", "对方需要有耐心"],
      bestMatch: { code: "S", reason: "在不动摇的S身边最快找到安定" },
      worstMatch: { code: "D+V", reason: "两人都不稳定，与其互相帮助成长不如说是一起动摇" },
      similarFigures: [
        { name: "赵伊瑞（梨泰院Class）", description: "跌跌撞撞却始终在寻找自己位置的气质" },
        { name: "东柏（东柏花盛开时）", description: "动摇中又一点点变坚强的感觉很相似" },
      ],
    },
    es: {
      name: "El Tipo Caótico En Crecimiento", catchphrase: "Desorganizado Pero Buscando Estabilidad",
      strengths: ["Sigue trabajando hacia la estabilidad incluso en medio del caos", "Fuerte impulso de crecimiento personal", "No le teme al ensayo y error"],
      weaknesses: ["El patrón aún no está fijo, difícil de predecir", "Vuelve a viejos hábitos incluso mientras mejora", "Necesita una pareja paciente"],
      bestMatch: { code: "S", reason: "Encuentra estabilidad más rápido junto a un Seguro inquebrantable" },
      worstMatch: { code: "D+V", reason: "Ambos inestables — se tambalean juntos en vez de ayudarse a crecer" },
      similarFigures: [
        { name: "Jo Yi-seo (Itaewon Class)", description: "Tropieza, pero siempre encuentra su propio equilibrio" },
        { name: "Dongbaek (When the Camellia Blooms)", description: "Se tambalea, pero se vuelve un poco más firme cada vez" },
      ],
    },
  },
  {
    code: "D+A",
    primaryAxis: "disorganized",
    secondaryAxis: "anxious",
    // Reused from A+D — same reason as D+S above; shares the intense/
    // unpredictable-pull vibe with its mirror hybrid.
    imageFile: "dex.png",
    ko: {
      name: "감정 소용돌이", catchphrase: "혼란스럽고 불안까지",
      strengths: ["감정에 솔직하고 열정적임", "사랑에 최선을 다해 몰입함", "힘든 순간도 감정을 숨기지 않고 나눔"],
      weaknesses: ["예측불가함과 불안이 겹쳐 기복이 매우 심함", "확인받고 싶을수록 더 혼란스러워짐", "상대가 페이스 맞추기 가장 힘든 유형"],
      bestMatch: { code: "S", reason: "어떤 소용돌이도 다 받아주는 S만이 유일한 안식처" },
      worstMatch: { code: "V+D", reason: "안 그래도 불안한데 상대까지 예측불가로 사라지면 완전히 무너짐" },
      similarFigures: [
        { name: "펜트하우스 심수련", description: "감정의 소용돌이 속에서도 몰입하는 무드가 닮았어요" },
        { name: "눈물의 여왕 홍해인", description: "불안과 열정이 뒤섞인 느낌이 비슷해요" },
      ],
    },
    en: {
      name: "Emotional Whirlwind", catchphrase: "Disorganized And Anxious Together",
      strengths: ["Honest, passionate emotion", "Fully invests in love", "Shares hard moments openly instead of hiding them"],
      weaknesses: ["Unpredictability and anxiety overlap into heavy swings", "The more reassurance is wanted, the more chaotic it gets", "The hardest type for a partner to keep pace with"],
      bestMatch: { code: "S", reason: "Secure is the only true refuge that can hold any whirlwind" },
      worstMatch: { code: "V+D", reason: "Already anxious, and a partner who vanishes unpredictably breaks it completely" },
      similarFigures: [
        { name: "Shim Su-ryeon (The Penthouse)", description: "Fully immersed even inside an emotional whirlwind" },
        { name: "Hong Hae-in (Queen of Tears)", description: "That same mix of anxiety and passion" },
      ],
    },
    ja: {
      name: "感情の渦", catchphrase: "混乱してて不安まである",
      strengths: ["感情に正直で情熱的", "恋に全力で没頭する", "辛い瞬間も感情を隠さず分かち合う"],
      weaknesses: ["予測不能さと不安が重なり起伏が非常に激しい", "確認したいほどさらに混乱する", "相手が一番ペースを合わせにくいタイプ"],
      bestMatch: { code: "S", reason: "どんな渦も受け止めてくれるSだけが唯一の安らぎ" },
      worstMatch: { code: "V+D", reason: "ただでさえ不安なのに相手まで予測不能に消えると完全に崩れる" },
      similarFigures: [
        { name: "シム・スリョン（ペントハウス）", description: "感情の渦の中でも没頭するムードが似ています" },
        { name: "ホン・ヘイン（涙の女王）", description: "不安と情熱が入り混じった感じが似ています" },
      ],
    },
    zh: {
      name: "情绪漩涡", catchphrase: "混乱又焦虑",
      strengths: ["情感真实而热烈", "全心投入爱情", "艰难时刻也不隐藏情绪，愿意分享"],
      weaknesses: ["不可预测和焦虑叠加，起伏非常剧烈", "越想被确认反而越混乱", "对方最难跟上节奏的类型"],
      bestMatch: { code: "S", reason: "能包容任何漩涡的S是唯一真正的港湾" },
      worstMatch: { code: "V+D", reason: "本就焦虑，若对方还不可预测地消失，会彻底崩溃" },
      similarFigures: [
        { name: "沈秀莲（顶楼）", description: "身处情绪漩涡中仍全情投入的气质很相似" },
        { name: "洪海仁（眼泪女王）", description: "焦虑与热情交织的感觉很相似" },
      ],
    },
    es: {
      name: "Torbellino Emocional", catchphrase: "Desorganizado Y Ansioso A La Vez",
      strengths: ["Emoción honesta y apasionada", "Se entrega por completo al amor", "Comparte los momentos difíciles abiertamente en vez de ocultarlos"],
      weaknesses: ["Lo impredecible y la ansiedad se solapan en cambios fuertes", "Cuanta más reafirmación quiere, más caótico se vuelve", "El tipo más difícil de seguir para una pareja"],
      bestMatch: { code: "S", reason: "Seguro es el único refugio real que puede sostener cualquier torbellino" },
      worstMatch: { code: "V+D", reason: "Ya ansioso, y una pareja que desaparece de forma impredecible lo rompe por completo" },
      similarFigures: [
        { name: "Shim Su-ryeon (The Penthouse)", description: "Totalmente inmersa incluso dentro de un torbellino emocional" },
        { name: "Hong Hae-in (Queen of Tears)", description: "Esa misma mezcla de ansiedad y pasión" },
      ],
    },
  },
  {
    code: "D+V",
    primaryAxis: "disorganized",
    secondaryAxis: "avoidant",
    // Weakest fit in the set: perfectionist.png reads as controlled/flawless,
    // not "appears then vanishes." Flagged for the user — no better unused
    // portrait exists among the 14 available files.
    imageFile: "perfectionist.png",
    ko: {
      name: "다가왔다 사라지는 신기루", catchphrase: "혼란스러운데 결국 도망침",
      strengths: ["처음 다가올 땐 매력적이고 강렬함", "관계에 대한 갈망은 진심임", "패턴을 깨달으면 크게 성장할 잠재력"],
      weaknesses: ["결국 도망가서 관계가 오래가기 힘듦", "다가가고 싶은 마음과 두려움이 충돌함", "신뢰를 쌓기 어려운 신기루 같은 존재감"],
      bestMatch: { code: "S", reason: "도망쳐도 자리를 지켜주는 S만이 유일하게 붙잡아둘 수 있음" },
      worstMatch: { code: "A+V", reason: "둘 다 도망가는 유형이라 서로 다가가지 못하고 관계가 신기루처럼 사라짐" },
      similarFigures: [
        { name: "나의 아저씨 이지안", description: "다가왔다 멀어지는 방어적인 무드가 닮았어요" },
        { name: "별에서 온 그대 도민준 (초반)", description: "강렬하게 끌리지만 거리를 두는 느낌이 비슷해요" },
      ],
    },
    en: {
      name: "The Mirage That Disappears", catchphrase: "Disorganized But Ends Up Running Away",
      strengths: ["Intensely charming when first getting close", "The longing for connection is genuine", "Big growth potential once the pattern is recognized"],
      weaknesses: ["Ends up running, so the relationship struggles to last", "The wish to get close collides with fear", "A mirage-like presence that's hard to build trust with"],
      bestMatch: { code: "S", reason: "Only Secure, staying put even through the running away, can hold on" },
      worstMatch: { code: "A+V", reason: "Both types run — neither can approach, and the bond vanishes like a mirage" },
      similarFigures: [
        { name: "Lee Ji-an (My Mister)", description: "That same guarded pull-close-then-pull-away mood" },
        { name: "Do Min-joon, early episodes (My Love from the Star)", description: "Intensely drawn in, yet keeping distance" },
      ],
    },
    ja: {
      name: "現れては消える蜃気楼", catchphrase: "混乱してて結局逃げる",
      strengths: ["最初近づく時は魅力的で強烈", "関係への渇望は本物", "パターンに気づけば大きく成長する可能性"],
      weaknesses: ["結局逃げてしまい関係が長続きしにくい", "近づきたい気持ちと恐れがぶつかる", "信頼を築きにくい蜃気楼のような存在感"],
      bestMatch: { code: "S", reason: "逃げても居続けてくれるSだけが唯一つなぎとめられる" },
      worstMatch: { code: "A+V", reason: "お互い逃げるタイプで近づけず関係が蜃気楼のように消える" },
      similarFigures: [
        { name: "イ・ジアン（マイ・ミスター）", description: "近づいては離れる防御的なムードが似ています" },
        { name: "ト・ミンジュン（星から来たあなた、序盤）", description: "強烈に惹かれつつも距離を置く感じが似ています" },
      ],
    },
    zh: {
      name: "忽隐忽现的海市蜃楼", catchphrase: "混乱但最终选择逃跑",
      strengths: ["初次靠近时充满魅力且强烈", "对关系的渴望是真实的", "一旦意识到自己的模式就有很大成长潜力"],
      weaknesses: ["最终选择逃跑，关系难以长久", "想靠近的心情与恐惧相互冲突", "如海市蜃楼般难以建立信任"],
      bestMatch: { code: "S", reason: "只有即使对方逃跑也坚守原地的S才能留住TA" },
      worstMatch: { code: "A+V", reason: "两人都是逃跑型，谁都无法靠近，关系像海市蜃楼一样消失" },
      similarFigures: [
        { name: "李知安（我的大叔）", description: "靠近又疏远的防御性气质很相似" },
        { name: "都敏俊·前期（来自星星的你）", description: "强烈被吸引却又保持距离的感觉很相似" },
      ],
    },
    es: {
      name: "El Espejismo Que Desaparece", catchphrase: "Desorganizado Que Termina Huyendo",
      strengths: ["Intensamente encantador al principio del acercamiento", "El anhelo de conexión es genuino", "Gran potencial de crecimiento una vez que reconoce su propio patrón"],
      weaknesses: ["Termina huyendo, así que la relación batalla para durar", "El deseo de acercarse choca con el miedo", "Una presencia como espejismo, difícil de construir confianza"],
      bestMatch: { code: "S", reason: "Solo Seguro, que se queda incluso cuando el otro huye, puede retenerlo" },
      worstMatch: { code: "A+V", reason: "Ambos huyen — ninguno puede acercarse, y el vínculo desaparece como un espejismo" },
      similarFigures: [
        { name: "Lee Ji-an (My Mister)", description: "Ese mismo vaivén defensivo de acercarse y alejarse" },
        { name: "Do Min-joon, primeros episodios (My Love from the Star)", description: "Intensamente atraído, pero manteniendo distancia" },
      ],
    },
  },
];

export function getAttachmentTypeByCode(code: string): AttachmentType | undefined {
  return ATTACHMENT_TYPES.find((t) => t.code === code);
}
