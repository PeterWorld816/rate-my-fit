export type AttachmentAxis = "secure" | "anxious" | "avoidant" | "disorganized";
export type Lang = "ko" | "en" | "ja" | "zh" | "es";

export type MatchInfo = { code: string; reason: string };

export type AttachmentTypeLangContent = {
  name: string;
  catchphrase: string;
  strengths: [string, string, string];
  weaknesses: [string, string, string];
  bestMatch: MatchInfo;
  worstMatch: MatchInfo;
  // 이 유형이 연애에서 보이는 전형적인 순간 (2~3문장 상황 묘사)
  scene: string;
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
      scene: "데이트 끝나고 '잘 들어가~ 도착하면 말해줘' 보내고 바로 씻으러 감. 답장이 30분 뒤에 와도 '오 왔네' 하고 자연스럽게 이어서 수다 떪.",
    },
    en: {
      name: "Pure Secure", catchphrase: "Pure Refreshing Energy",
      strengths: ["Steady emotional expression", "Resolves conflict by talking", "Patient, trusting nature"],
      weaknesses: ["Misses subtle emotional cues", "Called \"boring\", no push-pull", "Rarely shows what's underneath"],
      bestMatch: { code: "A", reason: "Steadies Anxious's worries with calm reassurance" },
      worstMatch: { code: "D", reason: "Wears thin trying to keep up with unpredictable swings" },
      scene: "After a date, texts \"Get home safe~ let me know when you're back\" and hops in the shower. If the reply comes 30 minutes later, it's just \"oh hey!\" and the chat picks right back up.",
    },
    ja: {
      name: "完全安定型", catchphrase: "清涼感そのもの",
      strengths: ["安定した感情表現", "対話で対立を解決する力", "信じて待てる余裕"],
      weaknesses: ["淡々としすぎてサインを見逃す", "駆け引きがなくてつまらないと言われる", "本音をあまり出さない"],
      bestMatch: { code: "A", reason: "不安なAを安心させてくれる頼れる存在" },
      worstMatch: { code: "D", reason: "予測不能なパターンに疲れやすい組み合わせ" },
      scene: "デートの後「気をつけて帰ってね〜着いたら教えて」と送ってそのままお風呂へ。返信が30分後に来ても「お、来た」と自然に会話を続ける。",
    },
    zh: {
      name: "完全安全型", catchphrase: "清爽感本身",
      strengths: ["情绪表达稳定", "用对话化解矛盾的能力", "愿意信任并等待的余裕"],
      weaknesses: ["太淡定容易错过信号", "没有拉锯战被说无趣", "不太表露真心"],
      bestMatch: { code: "A", reason: "能让焦虑的A安心下来的可靠存在" },
      worstMatch: { code: "D", reason: "容易被对方不可预测的模式搞疲惫" },
      scene: "约会结束后发一句\"路上小心~到家说一声\"就去洗澡了。就算30分钟后才收到回复，也只是\"哦回来啦\"，自然地继续聊天。",
    },
    es: {
      name: "Seguro Puro", catchphrase: "Pura Energía Refrescante",
      strengths: ["Expresión emocional estable", "Resuelve conflictos hablando", "Paciente y confiado por naturaleza"],
      weaknesses: ["Se le escapan señales sutiles", "Le dicen \"aburrido\", sin juegos", "Rara vez muestra lo que siente"],
      bestMatch: { code: "A", reason: "Calma las preocupaciones de Ansioso con seguridad" },
      worstMatch: { code: "D", reason: "Se agota tratando de seguir los cambios impredecibles" },
      scene: "Después de una cita escribe \"¡Llega bien~ avísame cuando estés en casa!\" y se mete a la ducha. Si la respuesta llega 30 minutos después, solo piensa \"ah, ya llegó\" y la charla sigue como si nada.",
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
      scene: "데이트 끝나고 '잘 들어가~' 보낸 뒤 답장 오기 전까지 씻지도 못하고 폰만 봄. 1이 사라졌는데 답이 없으면 방금 보낸 메시지를 세 번쯤 다시 읽어봄.",
    },
    en: {
      name: "Pure Anxious", catchphrase: "Pure Emotion",
      strengths: ["Honest, rich emotional expression", "Fully invests in relationships", "Deep care and effort for the bond"],
      weaknesses: ["Craves constant reassurance", "Small signals spiral into worry", "Overthinks alone easily"],
      bestMatch: { code: "S", reason: "Secure's certainty settles the anxiety" },
      worstMatch: { code: "V", reason: "The classic chase-and-withdraw hell with Avoidant" },
      scene: "After a date, texts \"Get home safe~\" and then can't even shower — just stares at the phone until the reply comes. If it shows \"Read\" with no answer, rereads their own last message about three times.",
    },
    ja: {
      name: "完全不安型", catchphrase: "感情そのもの",
      strengths: ["正直で豊かな感情表現", "恋愛に本気で没頭する", "関係への愛情と努力"],
      weaknesses: ["確認してもらいたい気持ちが強い", "小さなサインにも不安になる", "一人で考え込みやすい"],
      bestMatch: { code: "S", reason: "Sの確信が不安を優しく鎮めてくれる" },
      worstMatch: { code: "V", reason: "突き放すVのせいで不安が爆発する典型的な駆け引き地獄" },
      scene: "デートの後「気をつけて帰ってね〜」と送ったら、返信が来るまでお風呂にも入れずスマホを見つめる。既読がついたのに返事がないと、さっきのメッセージを3回くらい読み返す。",
    },
    zh: {
      name: "完全焦虑型", catchphrase: "情绪本身",
      strengths: ["坦率而丰富的情绪表达", "全心投入恋爱关系", "对关系充满爱与努力"],
      weaknesses: ["很需要被确认和安抚", "小小信号也会引发不安", "容易一个人胡思乱想"],
      bestMatch: { code: "S", reason: "S的笃定能让焦虑安稳下来" },
      worstMatch: { code: "V", reason: "被V推开导致焦虑爆发的经典拉锯战" },
      scene: "约会结束后发了\"路上小心~\"，在收到回复之前连澡都不洗，一直盯着手机。显示已读却没回，就把自己刚发的消息反复看上三遍。",
    },
    es: {
      name: "Ansioso Puro", catchphrase: "Pura Emoción",
      strengths: ["Expresión emocional honesta y rica", "Se entrega por completo a la relación", "Cuida y se esfuerza profundamente por el vínculo"],
      weaknesses: ["Necesita reafirmación constante", "Pequeñas señales lo hacen espiralar", "Piensa demasiado a solas"],
      bestMatch: { code: "S", reason: "La certeza de Seguro calma la ansiedad" },
      worstMatch: { code: "V", reason: "El clásico infierno de perseguir y ser rechazado por Evitativo" },
      scene: "Después de una cita escribe \"¡Llega bien~!\" y no puede ni ducharse: se queda mirando el celular hasta que llegue la respuesta. Si aparece el doble check azul sin respuesta, relee su último mensaje unas tres veces.",
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
      scene: "연인이 '이번 주말에 우리 부모님이랑 밥 먹을래?' 하자 '아… 그 주말 좀 바쁠 수도' 하고 화제를 돌림. 집에 와서 '내가 너무했나' 싶어 상대가 좋아하는 디저트 기프티콘을 말없이 보냄.",
    },
    en: {
      name: "Pure Avoidant", catchphrase: "Pure Chic Energy",
      strengths: ["Composed, not swayed by emotion", "Independent, protects own space", "Cool-headed judgment in a crisis"],
      weaknesses: ["Distance comes before words", "Feels burdened when someone gets close", "Struggles to voice what's underneath"],
      bestMatch: { code: "S", reason: "Only Secure's patience can unlock this heart" },
      worstMatch: { code: "A", reason: "Anxious's constant need for reassurance feels suffocating" },
      scene: "When their partner asks \"Want to have dinner with my parents this weekend?\" they say \"Ah… I might be busy that weekend\" and change the subject. Back home, they wonder if they were too cold and silently send a gift card for their partner's favorite dessert.",
    },
    ja: {
      name: "完全回避型", catchphrase: "クールそのもの",
      strengths: ["感情に振り回されない冷静さ", "自分の空間を守る独立心", "危機での冷静な判断力"],
      weaknesses: ["言葉より先に距離を置く", "近づいてくる相手を負担に感じる", "本音を表現するのが苦手"],
      bestMatch: { code: "S", reason: "Sの忍耐力だけが心を開く鍵" },
      worstMatch: { code: "A", reason: "絶えず確認したがるAが息苦しく感じる" },
      scene: "恋人に「今週末、うちの親とご飯行かない?」と言われ、「あー…その週末ちょっと忙しいかも」と話題を変える。家に帰って「冷たすぎたかな」と思い、相手の好きなスイーツのギフトを黙って送る。",
    },
    zh: {
      name: "完全回避型", catchphrase: "高冷本身",
      strengths: ["不被情绪左右的沉着", "守护个人空间的独立性", "危机中冷静的判断力"],
      weaknesses: ["比起说话更先拉开距离", "对靠近的对象感到有负担", "不擅长表达真心"],
      bestMatch: { code: "S", reason: "只有S的耐心才能打开这颗心" },
      worstMatch: { code: "A", reason: "总要确认的A让人感到窒息" },
      scene: "恋人问\"这周末要不要和我爸妈吃个饭？\"，回答\"啊……那周末可能有点忙\"就转移了话题。回家后又觉得\"是不是太过分了\"，默默给对方发了一张最爱甜品的电子券。",
    },
    es: {
      name: "Evitativo Puro", catchphrase: "Puro Estilo Frío",
      strengths: ["Sereno, no se deja llevar por la emoción", "Independiente, protege su espacio", "Juicio frío en una crisis"],
      weaknesses: ["La distancia llega antes que las palabras", "Se siente agobiado cuando alguien se acerca", "Le cuesta decir lo que siente"],
      bestMatch: { code: "S", reason: "Solo la paciencia de Seguro puede abrir este corazón" },
      worstMatch: { code: "A", reason: "La necesidad constante de reafirmación de Ansioso resulta asfixiante" },
      scene: "Cuando su pareja le pregunta \"¿Quieres cenar con mis papás este finde?\", responde \"Ah… puede que esté ocupado/a ese fin de semana\" y cambia de tema. Ya en casa se pregunta si fue demasiado frío/a y, sin decir nada, le manda una tarjeta de regalo de su postre favorito.",
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
      scene: "새벽 1시에 '보고 싶다'고 보냈다가 1분 만에 메시지 삭제. 다음 날엔 아무 일 없던 척 '어제 일찍 잤어'라고 함.",
    },
    en: {
      name: "Pure Disorganized", catchphrase: "Pure Unpredictable Energy",
      strengths: ["Honest, passionate emotion", "Fully present in each moment", "Unexpected charm energizes the relationship"],
      weaknesses: ["Prone to heavy mood swings", "Wants closeness, then gets scared of it", "Can't always explain their own reactions"],
      bestMatch: { code: "S", reason: "Only Secure can hold every kind of chaos" },
      worstMatch: { code: "D", reason: "Chaos plus chaos — neither can handle the other" },
      scene: "Texts \"I miss you\" at 1am, then unsends it a minute later. The next day, acts like nothing happened: \"I went to bed early last night.\"",
    },
    ja: {
      name: "完全混乱型", catchphrase: "予測不可そのもの",
      strengths: ["感情に正直で情熱的", "その瞬間ごとに全力で没頭する", "意外な魅力が関係に活気を与える"],
      weaknesses: ["感情の起伏が激しい方", "近づきたいのに怖くなる", "自分でも理由が説明できない時がある"],
      bestMatch: { code: "S", reason: "どんな混乱も受け止めてくれるSだけが唯一の安らぎ" },
      worstMatch: { code: "D", reason: "混乱+混乱はお互い手に負えない組み合わせ" },
      scene: "深夜1時に「会いたい」と送って、1分後に送信取消。次の日は何事もなかったように「昨日は早く寝ちゃった」と言う。",
    },
    zh: {
      name: "完全混乱型", catchphrase: "不可预测本身",
      strengths: ["情感真实而热烈", "每个瞬间都全情投入", "意想不到的魅力为关系注入活力"],
      weaknesses: ["情绪起伏比较大", "想靠近却又害怕", "有时连自己都说不清为什么"],
      bestMatch: { code: "S", reason: "只有能包容一切混乱的S才是唯一的港湾" },
      worstMatch: { code: "D", reason: "混乱+混乱=谁都无法承受对方" },
      scene: "凌晨1点发了句\"想你了\"，一分钟后又撤回。第二天装作什么都没发生：\"我昨天睡得早。\"",
    },
    es: {
      name: "Desorganizado Puro", catchphrase: "Pura Energía Impredecible",
      strengths: ["Emoción honesta y apasionada", "Totalmente presente en cada momento", "Un encanto inesperado que energiza la relación"],
      weaknesses: ["Propenso a cambios de humor fuertes", "Quiere cercanía y luego le teme", "No siempre puede explicar sus propias reacciones"],
      bestMatch: { code: "S", reason: "Solo Seguro puede sostener todo tipo de caos" },
      worstMatch: { code: "D", reason: "Caos más caos: ninguno puede con el otro" },
      scene: "Manda \"te extraño\" a la 1 de la mañana y lo borra un minuto después. Al día siguiente actúa como si nada: \"anoche me dormí temprano\".",
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
      scene: "평소엔 답장이 늦어도 신경 안 쓰는데, 회사에서 크게 깨진 날엔 유독 '오늘 나 좀 위로해줘'가 튀어나옴. 상대가 바로 전화해주면 금세 원래 모드로 돌아옴.",
    },
    en: {
      name: "Cool Until Crisis Hits", catchphrase: "Secure With Occasional Anxiety Bursts",
      strengths: ["Steady leadership most of the time", "Still tries to talk things out in a crisis", "Self-aware about its own anxious streak"],
      weaknesses: ["Suddenly needs reassurance out of nowhere", "Mood dips under real stress", "Big gap between calm-mode and crisis-mode"],
      bestMatch: { code: "V+S", reason: "Chic on the outside but takes care of everything — steadies the crisis moments" },
      worstMatch: { code: "A+D", reason: "Already anxious sometimes; add their mood swings and both collapse" },
      scene: "Normally doesn't care if replies are slow, but on a day they got chewed out at work, \"Can you cheer me up today?\" slips out. If their partner calls right away, they're back to their usual self in no time.",
    },
    ja: {
      name: "普段はクール、危機には小心", catchphrase: "安定してるのに時々不安が爆発",
      strengths: ["普段は安定したリーダーシップ", "危機でも対話で解決しようとする意志", "自分の不安を自覚する成長型"],
      weaknesses: ["急に確認してほしくなる時がある", "ストレスを受けると感情が揺れる", "普段と危機の時のギャップが大きい"],
      bestMatch: { code: "V+S", reason: "クールに見えて結局全部世話するV+Sが危機の瞬間を支えてくれる" },
      worstMatch: { code: "A+D", reason: "ただでさえ時々不安なのに相手の感情の起伏まで重なると二人とも崩れる" },
      scene: "普段は返信が遅くても気にしないのに、職場でこっぴどく叱られた日だけは「今日はちょっと慰めて」と言ってしまう。相手がすぐ電話してくれると、あっという間にいつもの調子に戻る。",
    },
    zh: {
      name: "平时冷静，危机时小心翼翼", catchphrase: "安全型但偶尔焦虑爆发",
      strengths: ["平时保持稳定的领导力", "危机中依然想用对话解决", "能察觉自己焦虑倾向的成长型"],
      weaknesses: ["偶尔会突然想要被确认", "压力大时情绪会波动", "平时和危机时反差很大"],
      bestMatch: { code: "V+S", reason: "表面高冷却把一切都照顾好，能撑住危机时刻" },
      worstMatch: { code: "A+D", reason: "本来就偶尔焦虑，再加上对方情绪起伏，两人都会崩溃" },
      scene: "平时回复慢也不在意，可在公司挨了一顿狠批的那天，就会忍不住说\"今天安慰我一下嘛\"。对方马上打来电话的话，很快就恢复原样。",
    },
    es: {
      name: "Tranquilo Hasta Que Llega La Crisis", catchphrase: "Seguro Con Estallidos De Ansiedad",
      strengths: ["Liderazgo estable la mayor parte del tiempo", "Aun en crisis intenta resolver hablando", "Consciente de su propia vena ansiosa"],
      weaknesses: ["De repente necesita reafirmación sin razón", "El ánimo baja bajo estrés real", "Gran diferencia entre su modo calma y su modo crisis"],
      bestMatch: { code: "V+S", reason: "Frío por fuera pero cuida de todo, sostiene los momentos de crisis" },
      worstMatch: { code: "A+D", reason: "Ya ansioso a veces; sumar los cambios de humor del otro hunde a ambos" },
      scene: "Normalmente no le importa si tardan en responder, pero el día que le regañan fuerte en el trabajo se le escapa un \"¿me consientes un poco hoy?\". Si su pareja le llama enseguida, vuelve a su modo normal en nada.",
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
      scene: "기념일 이벤트도 챙기고 누구보다 다정하지만, '오늘 너희 집에서 자고 가도 돼?'엔 '내일 일찍 나가야 해서~' 하고 웃으며 선을 그음. 혼자 보내는 일요일 오후만큼은 양보 못 함.",
    },
    en: {
      name: "The Warm Push-Puller", catchphrase: "Secure But Quietly Keeps Boundaries",
      strengths: ["Warm, but still says what needs saying", "Doesn't ask for more than is reasonable", "Respects both people's space"],
      weaknesses: ["Quiet boundary-setting can read as coldness", "Warmth and distance signals get mixed up", "Even they aren't sure how close is close enough"],
      bestMatch: { code: "A+S", reason: "Their effort to stay composed matches this type's easy pace" },
      worstMatch: { code: "A+V", reason: "Both draw lines, so neither one ever makes the first move" },
      scene: "Plans anniversary surprises and is sweet as can be — but to \"Can I stay over tonight?\" they smile and say \"I've got an early start tomorrow~.\" Their solo Sunday afternoon is non-negotiable.",
    },
    ja: {
      name: "優しい駆け引き上手", catchphrase: "安定してるのにさりげなく線引き",
      strengths: ["優しいけど言うべきことは言う", "無理な要求をしない", "お互いの空間を尊重する"],
      weaknesses: ["さりげない線引きが寂しさに感じられる", "優しさと距離のサインが紛らわしい", "自分でもどこまで近づくべきか迷う"],
      bestMatch: { code: "A+S", reason: "隠そうとする努力が余裕あるペースとよく合う" },
      worstMatch: { code: "A+V", reason: "お互い線を引くので誰も先に近づかない" },
      scene: "記念日のサプライズも用意して優しく接するけど、「今日泊まっていっていい?」には「明日朝早いから〜」と笑って線を引く。一人で過ごす日曜の午後だけは譲れない。",
    },
    zh: {
      name: "温柔的欲擒故纵者", catchphrase: "安全型但默默划清界限",
      strengths: ["温柔但该说的都会说", "不会提出过分的要求", "尊重彼此的空间"],
      weaknesses: ["默默划界限容易让人觉得委屈", "温柔和保持距离的信号容易混淆", "自己也不确定该靠近到什么程度"],
      bestMatch: { code: "A+S", reason: "对方努力不表露的样子和从容的节奏很契合" },
      worstMatch: { code: "A+V", reason: "两人都在划界限，谁都不会先靠近" },
      scene: "纪念日惊喜照样准备，对人也很温柔，但面对\"今晚能住你家吗？\"却笑着说\"明天要早起呢~\"，划清界限。一个人的周日下午绝不让步。",
    },
    es: {
      name: "El Seductor Cariñoso", catchphrase: "Seguro Pero Marca Límites Sutilmente",
      strengths: ["Cariñoso, pero dice lo que hay que decir", "No pide más de lo razonable", "Respeta el espacio de ambos"],
      weaknesses: ["Marcar límites en silencio puede leerse como frialdad", "Se confunden las señales de calidez y distancia", "Ni siquiera ellos saben cuánta cercanía es suficiente"],
      bestMatch: { code: "A+S", reason: "Su esfuerzo por mantener la calma combina con este ritmo relajado" },
      worstMatch: { code: "A+V", reason: "Ambos marcan límites, así que ninguno da el primer paso" },
      scene: "Prepara sorpresas de aniversario y es de lo más tierno/a, pero ante \"¿me puedo quedar a dormir hoy?\" sonríe y dice \"mañana madrugo~\". Su domingo por la tarde a solas no se negocia.",
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
      scene: "평소엔 누구보다 차분한데 가끔 밤 10시에 '우리 지금 바다 보러 갈래?'를 꺼냄. 상대가 당황하면 '아님 말고~' 하고 다시 평온해짐.",
    },
    en: {
      name: "Predictably Quirky", catchphrase: "Secure With Occasional Wild Cards",
      strengths: ["Rock-solid fundamentals in a real crisis", "Quirky charm keeps the relationship lively", "A balance of spontaneity and stability"],
      weaknesses: ["Occasional out-of-nowhere quirky moments", "The unpredictable streak makes trust slow to build", "Can't always explain their own randomness"],
      bestMatch: { code: "D+S", reason: "Both understand each other's chaos while growing toward stability together" },
      worstMatch: { code: "V+D", reason: "A quirky moment meets a sharp, sudden cutoff — it stings" },
      scene: "Calmer than anyone most days, then at 10pm suddenly suggests \"Wanna drive to the beach right now?\" If their partner looks thrown, it's \"Never mind then~\" and they're serene again.",
    },
    ja: {
      name: "予測できる4次元", catchphrase: "安定してるのに時々つかめない",
      strengths: ["大きな危機には揺るがない基本", "変わった魅力が関係に活気を与える", "即興性と安定感のバランス"],
      weaknesses: ["時々出る4次元な瞬間", "予測できない部分で信頼を築くのに時間がかかる", "自分でも説明できない時がある"],
      bestMatch: { code: "D+S", reason: "お互いの混乱を理解しながら共に安定を探していく組み合わせ" },
      worstMatch: { code: "V+D", reason: "4次元な瞬間に相手がバッサリ線を引いて傷つく" },
      scene: "普段は誰よりも落ち着いているのに、夜10時に突然「今から海見に行かない?」と言い出す。相手が戸惑うと「じゃあいいや〜」とまた穏やかに戻る。",
    },
    zh: {
      name: "可预测的四次元", catchphrase: "安全型但偶尔让人捉摸不透",
      strengths: ["大危机中不会动摇的基本功", "特别的魅力为关系注入活力", "即兴与稳定感的平衡"],
      weaknesses: ["偶尔冒出的四次元瞬间", "难以预测的部分让信任建立较慢", "有时自己也解释不清"],
      bestMatch: { code: "D+S", reason: "理解彼此的混乱，一起走向安定的组合" },
      worstMatch: { code: "V+D", reason: "四次元瞬间遇上对方突然的果断划界，容易受伤" },
      scene: "平时比谁都淡定，却会在晚上10点突然提议\"我们现在去看海吧？\"。对方一愣，就\"不去也行~\"，又恢复平静。",
    },
    es: {
      name: "Impredeciblemente Predecible", catchphrase: "Seguro Con Sorpresas Ocasionales",
      strengths: ["Bases sólidas en una crisis real", "Su encanto excéntrico mantiene viva la relación", "Equilibrio entre espontaneidad y estabilidad"],
      weaknesses: ["Momentos excéntricos que salen de la nada", "La racha impredecible hace lenta la confianza", "No siempre puede explicar su propia rareza"],
      bestMatch: { code: "D+S", reason: "Ambos entienden el caos del otro mientras crecen juntos hacia la estabilidad" },
      worstMatch: { code: "V+D", reason: "Un momento excéntrico choca con un corte seco y repentino — duele" },
      scene: "Más tranquilo/a que nadie la mayoría de los días, pero a las 10 de la noche suelta \"¿y si vamos a ver el mar ahora mismo?\". Si su pareja se desconcierta, dice \"bueno, si no, no pasa nada~\" y vuelve a la calma.",
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
      scene: "연인 인스타 스토리에 모르는 이성이 태그된 걸 보고 심장이 쿵. 그래도 '오 재밌었겠다ㅎㅎ' 하고 쿨하게 답장한 뒤, 이불 속에서 그 계정을 조용히 구경함.",
    },
    en: {
      name: "Storm Inside, Calm Outside", catchphrase: "Anxious But Trying Not To Show It",
      strengths: ["Actively works to regulate their emotions", "Comes across as trustworthy on the surface", "Constantly reflects on their own feelings"],
      weaknesses: ["Hiding what's inside builds up misunderstandings", "Bottles it up until it suddenly bursts", "Hides the struggle so well the partner misses it"],
      bestMatch: { code: "S+V", reason: "A warm, steady pace slowly unwinds what's held inside" },
      worstMatch: { code: "V+A", reason: "Both hide their true feelings, so real conversation never happens" },
      scene: "Sees an unfamiliar person tagged in their partner's Instagram story and their heart drops. Still replies coolly \"Looks fun haha,\" then quietly scrolls through that account under the blanket.",
    },
    ja: {
      name: "内側は嵐、外側は平然", catchphrase: "不安なのに隠そうと努力する",
      strengths: ["感情をコントロールしようとする努力", "表面上は信頼感を与える", "絶えず自分の感情を振り返る"],
      weaknesses: ["本音を隠して誤解が積もる", "一人で抱え込んで急に爆発する", "辛さを見せないので相手が気づかない"],
      bestMatch: { code: "S+V", reason: "優しくて安定したペースが本音をゆっくり解きほぐしてくれる" },
      worstMatch: { code: "V+A", reason: "お互い本音を隠すだけで本当の会話ができない" },
      scene: "恋人のインスタのストーリーに知らない異性がタグ付けされているのを見て心臓がドキッ。それでも「楽しそう〜笑」とクールに返して、布団の中でそのアカウントをこっそり眺める。",
    },
    zh: {
      name: "内心风暴，外表平静", catchphrase: "焦虑但努力不表现出来",
      strengths: ["努力调节自己的情绪", "表面上给人可靠的感觉", "不断反思自己的情绪"],
      weaknesses: ["藏起真心导致误会积累", "独自忍耐直到突然爆发", "不表现出辛苦让对方察觉不到"],
      bestMatch: { code: "S+V", reason: "温柔又稳定的节奏能慢慢解开内心" },
      worstMatch: { code: "V+A", reason: "两人都只藏着真心，无法真正沟通" },
      scene: "看到恋人的Instagram快拍里标记了一个陌生异性，心里咯噔一下。却还是很酷地回了句\"看起来好好玩哈哈\"，然后躲在被窝里悄悄翻那个账号。",
    },
    es: {
      name: "Tormenta Por Dentro, Calma Por Fuera", catchphrase: "Ansioso Pero Tratando De No Mostrarlo",
      strengths: ["Trabaja activamente para regular sus emociones", "Da una impresión de confianza en la superficie", "Reflexiona constantemente sobre sus propios sentimientos"],
      weaknesses: ["Ocultar lo que siente acumula malentendidos", "Lo guarda todo hasta que estalla de repente", "Oculta tan bien su lucha que la pareja no lo nota"],
      bestMatch: { code: "S+V", reason: "Un ritmo cálido y estable desenreda poco a poco lo que guarda dentro" },
      worstMatch: { code: "V+A", reason: "Ambos ocultan sus verdaderos sentimientos, así que nunca hay una conversación real" },
      scene: "Ve que en la historia de Instagram de su pareja etiquetaron a alguien que no conoce y se le encoge el corazón. Aun así responde tranquilo/a \"¡qué divertido jaja!\" y luego revisa esa cuenta en silencio bajo las cobijas.",
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
      scene: "썸 상대의 카톡은 오자마자 확인해놓고 일부러 1시간 기다렸다 답장함. 그 1시간 동안 답장 문장을 다섯 번 고쳐 씀.",
    },
    en: {
      name: "Curious But Runs Away", catchphrase: "Anxious But Can't Even Approach",
      strengths: ["Pays close, careful attention to the other person", "Approaches carefully to avoid getting hurt", "Loves deeply once the heart opens up"],
      weaknesses: ["Wants to get closer while running away at the same time", "Feels overwhelmed the moment someone actually gets close", "Stays stuck without certainty"],
      bestMatch: { code: "S", reason: "Secure's unshaken pace steadily holds this approach-avoid pattern" },
      worstMatch: { code: "D+V", reason: "Both approach then flee — they wear each other out until the bond evaporates" },
      scene: "Opens their crush's message the second it arrives, then deliberately waits an hour to reply. During that hour, rewrites the reply five times.",
    },
    ja: {
      name: "気になるのに逃げる", catchphrase: "不安なのに近づけもしない",
      strengths: ["相手を細やかに観察する", "慎重に近づいて傷を減らす", "心を開けば深く愛情を注ぐ"],
      weaknesses: ["近づきたいのに同時に逃げてしまう", "実際に近づかれると負担に感じる", "確信がないとずっと足踏みする"],
      bestMatch: { code: "S", reason: "揺るがないSのペースが接近回避パターンを安定して受け止めてくれる" },
      worstMatch: { code: "D+V", reason: "お互い近づいては逃げるパターンで疲れて関係が消えてしまう" },
      scene: "気になる人からのLINEは届いた瞬間に確認するのに、わざと1時間待ってから返信する。その1時間で返信文を5回書き直す。",
    },
    zh: {
      name: "好奇却逃跑", catchphrase: "焦虑却连靠近都做不到",
      strengths: ["细腻地观察对方", "谨慎靠近以减少受伤", "一旦敞开心扉就爱得很深"],
      weaknesses: ["想靠近又同时想逃跑", "对方真的靠近时又觉得有负担", "没有把握就一直原地踏步"],
      bestMatch: { code: "S", reason: "S稳定不动摇的节奏能安稳地接住这种接近-回避模式" },
      worstMatch: { code: "D+V", reason: "两人都是靠近又逃跑，彼此疲惫，关系最终消散" },
      scene: "暧昧对象的消息一到就立刻点开看了，却故意等一个小时才回。那一个小时里把回复改了五遍。",
    },
    es: {
      name: "Curioso Pero Huye", catchphrase: "Ansioso Pero No Puede Ni Acercarse",
      strengths: ["Observa a la otra persona con mucha atención", "Se acerca con cuidado para evitar salir herido", "Ama profundamente una vez que abre el corazón"],
      weaknesses: ["Quiere acercarse mientras huye al mismo tiempo", "Se siente abrumado en cuanto alguien realmente se acerca", "Se queda estancado sin certeza"],
      bestMatch: { code: "S", reason: "El ritmo firme de Seguro sostiene con estabilidad este patrón de acercarse y huir" },
      worstMatch: { code: "D+V", reason: "Ambos se acercan y huyen — se agotan mutuamente hasta que el vínculo se evapora" },
      scene: "Abre el mensaje de su crush en cuanto llega, pero espera a propósito una hora para responder. Durante esa hora reescribe la respuesta cinco veces.",
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
      scene: "답장이 늦자 '바빠?' '많이 바쁜가 보네' '아니다 됐어'를 연달아 보냄. 30분 뒤 상대가 '회의 끝났어!' 하면 언제 그랬냐는 듯 하트 이모티콘 폭탄.",
    },
    en: {
      name: "The Rollercoaster Itself", catchphrase: "Anxious With Heavy Mood Swings",
      strengths: ["Honest, rich emotional expression", "Fully invests in love", "Gives every moment their full feeling"],
      weaknesses: ["Mood swings destabilize the relationship", "Need for reassurance and unpredictability show up together", "Hard for a partner to keep pace with"],
      bestMatch: { code: "S", reason: "Secure, unshaken no matter what, is the only one who can hold it all" },
      worstMatch: { code: "V", reason: "Avoidant finds the mood swings overwhelming and pulls away — the worst match" },
      scene: "When a reply is slow, fires off \"busy?\" \"guess you're really busy\" \"never mind\" in a row. Thirty minutes later their partner says \"Just got out of a meeting!\" and suddenly it's a flood of heart emojis like nothing happened.",
    },
    ja: {
      name: "ジェットコースターそのもの", catchphrase: "不安で感情の起伏が激しい",
      strengths: ["正直で豊かな感情表現", "恋愛に本気で没頭する", "その瞬間の感情に全力を注ぐ"],
      weaknesses: ["感情の起伏が関係を不安定にする", "確認欲求と予測不能さが同時に出る", "相手がペースを合わせるのが大変"],
      bestMatch: { code: "S", reason: "何があっても揺るがないSだけが全部受け止めてくれる" },
      worstMatch: { code: "V", reason: "感情の起伏をVは負担に感じて距離を置く最悪の相性" },
      scene: "返信が遅いと「忙しい?」「すごく忙しいんだね」「やっぱいいや」と連投。30分後に相手が「会議終わった!」と言えば、何事もなかったかのようにハートのスタンプ連打。",
    },
    zh: {
      name: "过山车本车", catchphrase: "焦虑且情绪起伏很大",
      strengths: ["坦率而丰富的情绪表达", "全心投入恋爱", "对每个瞬间的情绪都全力以赴"],
      weaknesses: ["情绪起伏让关系变得不稳定", "被确认的需求和不可预测同时出现", "对方很难跟上节奏"],
      bestMatch: { code: "S", reason: "无论发生什么都不动摇的S是唯一能全部接住的人" },
      worstMatch: { code: "V", reason: "V会因情绪起伏感到负担而拉开距离，是最差的组合" },
      scene: "回复一慢就连发\"在忙？\"\"看来很忙啊\"\"算了没事\"。30分钟后对方说\"刚开完会！\"，又像什么都没发生过一样狂发爱心表情。",
    },
    es: {
      name: "La Montaña Rusa Misma", catchphrase: "Ansioso Con Cambios De Humor Fuertes",
      strengths: ["Expresión emocional honesta y rica", "Se entrega por completo al amor", "Da todo su sentir a cada momento"],
      weaknesses: ["Los cambios de humor desestabilizan la relación", "La necesidad de reafirmación y lo impredecible aparecen juntos", "Es difícil para la pareja seguirle el ritmo"],
      bestMatch: { code: "S", reason: "Seguro, inquebrantable pase lo que pase, es el único que puede sostenerlo todo" },
      worstMatch: { code: "V", reason: "Evitativo encuentra abrumadores los cambios de humor y se aleja — la peor combinación" },
      scene: "Cuando tardan en responder, manda seguido \"¿ocupado/a?\" \"ya veo que muy ocupado/a\" \"olvídalo\". Media hora después su pareja escribe \"¡acabo de salir de una reunión!\" y de pronto llueven emojis de corazones como si nada.",
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
      scene: "연인이 아프다고 하자 '약 먹고 자' 한 줄 답장. 그리고 30분 뒤 죽, 이온음료, 해열제가 든 봉지를 문고리에 걸어두고 감.",
    },
    en: {
      name: "Textbook Tsundere", catchphrase: "Chic But Ends Up Taking Care of Everything",
      strengths: ["Awkward with words but takes care of things through action", "Quietly deep, solid trust", "Surprisingly dependable in a real crisis"],
      weaknesses: ["Gets misread because feelings aren't said out loud", "Cares without showing it, so the effort goes unnoticed", "Takes a long time to actually open up"],
      bestMatch: { code: "S+A", reason: "That dependable, taking-care-of-everything energy steadies a partner shaken by crisis" },
      worstMatch: { code: "A", reason: "The bluntness feels frustrating to Anxious, who craves constant reassurance" },
      scene: "When their partner says they're sick, the reply is just \"Take some meds and sleep.\" Thirty minutes later, a bag with soup, a sports drink and fever reducers is hanging on their partner's doorknob.",
    },
    ja: {
      name: "ツンデレの教科書", catchphrase: "クールなのに結局全部世話する",
      strengths: ["表現は不器用でも行動で世話をする", "さりげなく厚い信頼", "危機の状況で意外と頼れる"],
      weaknesses: ["気持ちを言葉にしないので誤解される", "世話をしても素振りを見せず感謝されないことがある", "近づくのに時間がかかる"],
      bestMatch: { code: "S+A", reason: "頼もしく世話をするムードが危機の時に揺れる相手を支えてくれる" },
      worstMatch: { code: "A", reason: "絶えず確認を求めるAにはぶっきらぼうさがもどかしく感じられる" },
      scene: "恋人が具合悪いと言うと「薬飲んで寝な」と一行だけ返信。そして30分後、おかゆとスポーツドリンクと解熱剤が入った袋をドアノブにかけて帰る。",
    },
    zh: {
      name: "傲娇教科书", catchphrase: "高冷但最后全都照顾到",
      strengths: ["表达笨拙但用行动照顾对方", "默默积累的深厚信任", "危机时刻意外地可靠"],
      weaknesses: ["因不把心意说出口而被误会", "照顾对方却不表现出来，容易不被感激", "需要很长时间才能真正靠近"],
      bestMatch: { code: "S+A", reason: "可靠又照顾一切的气质能撑住危机时动摇的对方" },
      worstMatch: { code: "A", reason: "对渴望不断确认的A来说，冷淡的态度让人很憋闷" },
      scene: "恋人说身体不舒服，只回了一句\"吃药睡觉\"。30分钟后，装着粥、运动饮料和退烧药的袋子已经挂在对方家门把手上了。",
    },
    es: {
      name: "El Tsundere De Manual", catchphrase: "Frío Pero Termina Cuidando Todo",
      strengths: ["Torpe con las palabras pero cuida con acciones", "Confianza sólida y silenciosa", "Sorprendentemente confiable en una crisis real"],
      weaknesses: ["Lo malinterpretan porque no dice lo que siente en voz alta", "Cuida sin demostrarlo, así que el esfuerzo pasa desapercibido", "Tarda mucho en realmente abrirse"],
      bestMatch: { code: "S+A", reason: "Esa energía confiable de cuidar todo estabiliza a una pareja sacudida por la crisis" },
      worstMatch: { code: "A", reason: "La brusquedad resulta frustrante para Ansioso, que anhela reafirmación constante" },
      scene: "Cuando su pareja dice que está enferma, responde solo \"tómate algo y duerme\". Media hora después hay una bolsa con sopa, bebida isotónica y antifebriles colgada en su puerta.",
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
      scene: "읽씹하는 것처럼 보이지만 사실 상대 프사 변경, 상태메시지, 스토리까지 다 확인하고 있음. 친구가 '걔 요즘 어때?' 물으면 '몰라 관심 없어' 해놓고 근황을 줄줄 읊음.",
    },
    en: {
      name: "Acts Indifferent, Notices Everything", catchphrase: "Chic But Secretly Cares",
      strengths: ["Acts indifferent but quietly pays close attention", "Picks up on the other person's emotional shifts fast", "Worries without showing it, so it never feels heavy"],
      weaknesses: ["Reads as indifferent because the caring stays hidden", "Anxious underneath too, so it's a double weight to carry", "Feels awkward making the first move"],
      bestMatch: { code: "S", reason: "Secure notices the real feelings behind the indifferent act and leads gently" },
      worstMatch: { code: "A+S", reason: "Both hide what they really feel, so they may never truly know each other" },
      scene: "Looks like they're leaving people on read, but actually tracks every profile picture change, status update and story. When a friend asks \"How's that person doing?\" they say \"No idea, don't care\" — then rattle off every recent update.",
    },
    ja: {
      name: "無関心なふりで全部見てる", catchphrase: "クールなのにさりげなく気にする",
      strengths: ["無関心なふりをしながらも細やかに気にかける", "相手の感情の変化によく気づく", "心配を見せないので負担を与えない"],
      weaknesses: ["気にかけている素振りを見せず無関心だと誤解される", "自分も不安なのに二重に大変", "先に近づくのが気まずい"],
      bestMatch: { code: "S", reason: "無関心なふりの本心に気づき、優しく導いてくれるS" },
      worstMatch: { code: "A+S", reason: "お互い本音を隠すだけで永遠に相手の本心を知らないかもしれない" },
      scene: "既読スルーしているように見えて、実は相手のプロフィール画像の変更、ステータスメッセージ、ストーリーまで全部チェックしている。友達に「あの人最近どう?」と聞かれると「知らない、興味ないし」と言いつつ近況をすらすら話す。",
    },
    zh: {
      name: "装作无所谓其实都看在眼里", catchphrase: "高冷但暗自在意",
      strengths: ["装作无所谓却默默细心照顾", "很快察觉对方情绪的变化", "担心也不表现出来，不给对方压力"],
      weaknesses: ["不表现在意会被误以为冷漠", "自己也焦虑，等于双重辛苦", "很难先主动靠近"],
      bestMatch: { code: "S", reason: "S能察觉这份装无所谓背后的真心，并温柔地引导" },
      worstMatch: { code: "A+S", reason: "两人都只是隐藏真心，可能永远不了解彼此的真实想法" },
      scene: "看起来像是已读不回，其实对方换头像、改签名、发动态全都看在眼里。朋友问\"那人最近怎么样？\"，嘴上说\"不知道，没兴趣\"，却把近况说得一清二楚。",
    },
    es: {
      name: "Finge Indiferencia Pero Nota Todo", catchphrase: "Frío Pero Secretamente Le Importa",
      strengths: ["Finge indiferencia pero presta atención en silencio", "Detecta rápido los cambios emocionales del otro", "Se preocupa sin demostrarlo, así nunca resulta pesado"],
      weaknesses: ["Parece indiferente porque el cariño queda oculto", "También está ansioso por dentro, así que carga el doble", "Le resulta incómodo dar el primer paso"],
      bestMatch: { code: "S", reason: "Seguro nota los sentimientos reales detrás de la indiferencia fingida y guía con suavidad" },
      worstMatch: { code: "A+S", reason: "Ambos ocultan lo que realmente sienten, así que puede que nunca se conozcan de verdad" },
      scene: "Parece que deja a todos en visto, pero en realidad revisa cada cambio de foto de perfil, estado e historia. Si un amigo pregunta \"¿y cómo está esa persona?\", dice \"ni idea, no me importa\"… y luego cuenta todas sus novedades.",
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
      scene: "잘 지내다가도 상대가 '우리 이제 같이 여행 계획 세울까?' 하는 순간 갑자기 숨이 턱 막힘. 그날부터 답장이 짧아지다가 결국 '우리 생각할 시간을 좀 갖자'를 보냄.",
    },
    en: {
      name: "Cuts You Off The Moment You Cross The Line", catchphrase: "Chic With Sudden Sharp Pushback",
      strengths: ["Has clear personal standards", "Says no clearly when it's a no", "Speaks up honestly when it matters"],
      weaknesses: ["Suddenly pushes back hard, and it stings", "Big gap in temperature between calm mode and the outburst", "Rarely explains why they got upset"],
      bestMatch: { code: "S+D", reason: "Unshaken fundamentals even in unpredictable moments make this easy to be around" },
      worstMatch: { code: "A+D", reason: "A sudden hard pushback against someone already mood-swinging ends in disaster" },
      scene: "Things are going great, until their partner says \"Should we start planning a trip together?\" and suddenly they can't breathe. From that day the replies get shorter, until finally: \"I think we need some time to think.\"",
    },
    ja: {
      name: "一線を越えたら容赦ない", catchphrase: "クールなのに時々突き放す",
      strengths: ["自分の基準が明確", "違うことははっきり表現する", "言うべきことは言う正直さ"],
      weaknesses: ["急に突き放して相手が傷つく", "普段と爆発の間の温度差が大きい", "なぜ怒ったのかあまり説明しない"],
      bestMatch: { code: "S+D", reason: "予測できない瞬間にも揺るがない基本が居心地を良くしてくれる" },
      worstMatch: { code: "A+D", reason: "感情の起伏が激しい相手を急に突き放すと関係が破局に" },
      scene: "うまくいっていたのに、恋人が「そろそろ一緒に旅行の計画立てない?」と言った瞬間、急に息苦しくなる。その日から返信が短くなり、最後には「ちょっと考える時間がほしい」と送る。",
    },
    zh: {
      name: "越界就翻脸", catchphrase: "高冷但偶尔狠狠推开",
      strengths: ["自己的标准很明确", "不行的事情会明确表达", "该说的话都会说的坦率"],
      weaknesses: ["突然狠狠推开会让对方受伤", "平时和爆发之间温差很大", "很少解释自己为什么生气"],
      bestMatch: { code: "S+D", reason: "在不可预测的瞬间也不动摇的基本功让人很自在" },
      worstMatch: { code: "A+D", reason: "对情绪起伏大的对方突然狠推，关系容易走向破裂" },
      scene: "本来相处得很好，可恋人一说\"我们要不要一起计划旅行？\"，就突然喘不过气来。从那天起回复越来越短，最后发来一句\"我们给彼此一点时间想想吧\"。",
    },
    es: {
      name: "Corta Todo Si Cruzas La Línea", catchphrase: "Frío Con Rechazos Repentinos",
      strengths: ["Tiene estándares personales claros", "Dice que no con claridad cuando es no", "Habla con honestidad cuando de verdad importa"],
      weaknesses: ["De repente rechaza con fuerza, y eso duele", "Gran diferencia de temperatura entre su calma y el estallido", "Rara vez explica por qué se molestó"],
      bestMatch: { code: "S+D", reason: "Bases firmes incluso en momentos impredecibles hacen que sea fácil estar cerca" },
      worstMatch: { code: "A+D", reason: "Un rechazo repentino contra alguien ya voluble termina en desastre" },
      scene: "Todo va bien hasta que su pareja dice \"¿empezamos a planear un viaje juntos?\" y de repente siente que le falta el aire. Desde ese día las respuestas son cada vez más cortas, hasta que llega un \"creo que necesitamos tiempo para pensar\".",
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
      scene: "예전 같으면 서운한 순간 차단부터 눌렀을 텐데, 요즘은 폰을 내려놓고 산책부터 다녀옴. 돌아와서 '아까 그 말 좀 서운했어'라고 보내는 데 성공하고 혼자 뿌듯해함.",
    },
    en: {
      name: "The Growing Chaos Type", catchphrase: "Disorganized But Finding Stability",
      strengths: ["Keeps working toward stability even amid the chaos", "Strong drive for self-growth", "Not afraid of trial and error"],
      weaknesses: ["Pattern isn't set yet, hard to predict", "Slips back into old habits even while improving", "Needs a patient partner"],
      bestMatch: { code: "S", reason: "Finds stability fastest right next to an unshaken Secure" },
      worstMatch: { code: "D+V", reason: "Both unstable — they shake together instead of helping each other grow" },
      scene: "In the past they'd have hit block the moment they felt hurt — these days they put the phone down and go for a walk first. Back home, they manage to text \"What you said earlier kind of hurt,\" and feel quietly proud of themselves.",
    },
    ja: {
      name: "成長型カオスさん", catchphrase: "混乱してるけど安定を探し中",
      strengths: ["混乱の中でも安定に向けて努力する", "自己成長への意志が強い", "試行錯誤を恐れない"],
      weaknesses: ["まだパターンが定まらず予測しにくい", "良くなってきても以前のパターンに戻ることがある", "相手に忍耐が必要"],
      bestMatch: { code: "S", reason: "揺るがないSのそばで一番早く安定を見つけていく" },
      worstMatch: { code: "D+V", reason: "お互い不安定で成長を助け合うより一緒に揺れてしまう" },
      scene: "昔なら寂しい瞬間にすぐブロックしていたのに、最近はスマホを置いてまず散歩に出る。帰ってきて「さっきの言葉、ちょっと寂しかった」と送れた自分を、ちょっと誇らしく思う。",
    },
    zh: {
      name: "成长型混乱者", catchphrase: "混乱但正在寻找安定",
      strengths: ["即使在混乱中也努力寻求安定", "自我成长的意志很强", "不害怕试错"],
      weaknesses: ["模式还未固定，难以预测", "变好的过程中偶尔又回到旧模式", "对方需要有耐心"],
      bestMatch: { code: "S", reason: "在不动摇的S身边最快找到安定" },
      worstMatch: { code: "D+V", reason: "两人都不稳定，与其互相帮助成长不如说是一起动摇" },
      scene: "以前一委屈就直接拉黑，最近却会先放下手机出去散个步。回来后成功发出\"刚才那句话让我有点难过\"，暗暗为自己感到骄傲。",
    },
    es: {
      name: "El Tipo Caótico En Crecimiento", catchphrase: "Desorganizado Pero Buscando Estabilidad",
      strengths: ["Sigue trabajando hacia la estabilidad incluso en medio del caos", "Fuerte impulso de crecimiento personal", "No le teme al ensayo y error"],
      weaknesses: ["El patrón aún no está fijo, difícil de predecir", "Vuelve a viejos hábitos incluso mientras mejora", "Necesita una pareja paciente"],
      bestMatch: { code: "S", reason: "Encuentra estabilidad más rápido junto a un Seguro inquebrantable" },
      worstMatch: { code: "D+V", reason: "Ambos inestables — se tambalean juntos en vez de ayudarse a crecer" },
      scene: "Antes, al primer dolor, le daba a bloquear; ahora deja el celular y sale a caminar primero. Al volver logra escribir \"lo que dijiste hace rato me dolió un poco\" y se siente orgulloso/a de sí mismo/a.",
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
      scene: "'나 사랑해?'라고 물어서 '응'이라는 대답을 듣고도 '진짜? 얼마나?'를 또 묻게 됨. 그러다 갑자기 '어차피 너도 떠날 거잖아'로 혼자 결론 내리고 울컥함.",
    },
    en: {
      name: "Emotional Whirlwind", catchphrase: "Disorganized And Anxious Together",
      strengths: ["Honest, passionate emotion", "Fully invests in love", "Shares hard moments openly instead of hiding them"],
      weaknesses: ["Unpredictability and anxiety overlap into heavy swings", "The more reassurance is wanted, the more chaotic it gets", "The hardest type for a partner to keep pace with"],
      bestMatch: { code: "S", reason: "Secure is the only true refuge that can hold any whirlwind" },
      worstMatch: { code: "V+D", reason: "Already anxious, and a partner who vanishes unpredictably breaks it completely" },
      scene: "Asks \"Do you love me?\", hears \"Yes,\" and still has to ask \"Really? How much?\" Then out of nowhere decides \"You're going to leave me anyway\" and tears up.",
    },
    ja: {
      name: "感情の渦", catchphrase: "混乱してて不安まである",
      strengths: ["感情に正直で情熱的", "恋に全力で没頭する", "辛い瞬間も感情を隠さず分かち合う"],
      weaknesses: ["予測不能さと不安が重なり起伏が非常に激しい", "確認したいほどさらに混乱する", "相手が一番ペースを合わせにくいタイプ"],
      bestMatch: { code: "S", reason: "どんな渦も受け止めてくれるSだけが唯一の安らぎ" },
      worstMatch: { code: "V+D", reason: "ただでさえ不安なのに相手まで予測不能に消えると完全に崩れる" },
      scene: "「私のこと好き?」と聞いて「うん」と言われても、「本当に? どれくらい?」とまた聞いてしまう。そして急に「どうせあなたもいなくなるんでしょ」と一人で結論を出して涙ぐむ。",
    },
    zh: {
      name: "情绪漩涡", catchphrase: "混乱又焦虑",
      strengths: ["情感真实而热烈", "全心投入爱情", "艰难时刻也不隐藏情绪，愿意分享"],
      weaknesses: ["不可预测和焦虑叠加，起伏非常剧烈", "越想被确认反而越混乱", "对方最难跟上节奏的类型"],
      bestMatch: { code: "S", reason: "能包容任何漩涡的S是唯一真正的港湾" },
      worstMatch: { code: "V+D", reason: "本就焦虑，若对方还不可预测地消失，会彻底崩溃" },
      scene: "问\"你爱我吗？\"，听到\"爱\"之后还是忍不住再问\"真的吗？有多爱？\"。然后突然自己得出结论\"反正你也会离开的\"，眼眶一下就红了。",
    },
    es: {
      name: "Torbellino Emocional", catchphrase: "Desorganizado Y Ansioso A La Vez",
      strengths: ["Emoción honesta y apasionada", "Se entrega por completo al amor", "Comparte los momentos difíciles abiertamente en vez de ocultarlos"],
      weaknesses: ["Lo impredecible y la ansiedad se solapan en cambios fuertes", "Cuanta más reafirmación quiere, más caótico se vuelve", "El tipo más difícil de seguir para una pareja"],
      bestMatch: { code: "S", reason: "Seguro es el único refugio real que puede sostener cualquier torbellino" },
      worstMatch: { code: "V+D", reason: "Ya ansioso, y una pareja que desaparece de forma impredecible lo rompe por completo" },
      scene: "Pregunta \"¿me quieres?\", escucha \"sí\" y aun así tiene que preguntar \"¿de verdad? ¿cuánto?\". Y de la nada concluye \"igual te vas a ir\" y se le llenan los ojos de lágrimas.",
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
      scene: "소개팅 후 세 번째 데이트까지는 누구보다 설레게 연락함. 상대가 '우리 사귈래?' 하는 순간 다음 날부터 연락이 뚝 끊기고, 몇 주 뒤 '잘 지내?'가 다시 옴.",
    },
    en: {
      name: "The Mirage That Disappears", catchphrase: "Disorganized But Ends Up Running Away",
      strengths: ["Intensely charming when first getting close", "The longing for connection is genuine", "Big growth potential once the pattern is recognized"],
      weaknesses: ["Ends up running, so the relationship struggles to last", "The wish to get close collides with fear", "A mirage-like presence that's hard to build trust with"],
      bestMatch: { code: "S", reason: "Only Secure, staying put even through the running away, can hold on" },
      worstMatch: { code: "A+V", reason: "Both types run — neither can approach, and the bond vanishes like a mirage" },
      scene: "Texts more excitedly than anyone through the first three dates. The moment the other person asks \"Want to make it official?\" the messages stop — and a few weeks later, a \"Hey, how've you been?\" shows up.",
    },
    ja: {
      name: "現れては消える蜃気楼", catchphrase: "混乱してて結局逃げる",
      strengths: ["最初近づく時は魅力的で強烈", "関係への渇望は本物", "パターンに気づけば大きく成長する可能性"],
      weaknesses: ["結局逃げてしまい関係が長続きしにくい", "近づきたい気持ちと恐れがぶつかる", "信頼を築きにくい蜃気楼のような存在感"],
      bestMatch: { code: "S", reason: "逃げても居続けてくれるSだけが唯一つなぎとめられる" },
      worstMatch: { code: "A+V", reason: "お互い逃げるタイプで近づけず関係が蜃気楼のように消える" },
      scene: "最初の3回のデートまでは誰よりもときめく連絡をくれる。相手が「付き合おうか?」と言った瞬間、次の日から連絡が途絶え、数週間後にまた「元気?」が届く。",
    },
    zh: {
      name: "忽隐忽现的海市蜃楼", catchphrase: "混乱但最终选择逃跑",
      strengths: ["初次靠近时充满魅力且强烈", "对关系的渴望是真实的", "一旦意识到自己的模式就有很大成长潜力"],
      weaknesses: ["最终选择逃跑，关系难以长久", "想靠近的心情与恐惧相互冲突", "如海市蜃楼般难以建立信任"],
      bestMatch: { code: "S", reason: "只有即使对方逃跑也坚守原地的S才能留住TA" },
      worstMatch: { code: "A+V", reason: "两人都是逃跑型，谁都无法靠近，关系像海市蜃楼一样消失" },
      scene: "前三次约会时比谁都热情地联系。对方一说\"我们在一起吧？\"，第二天开始就音讯全无，几周后又来一句\"最近好吗？\"。",
    },
    es: {
      name: "El Espejismo Que Desaparece", catchphrase: "Desorganizado Que Termina Huyendo",
      strengths: ["Intensamente encantador al principio del acercamiento", "El anhelo de conexión es genuino", "Gran potencial de crecimiento una vez que reconoce su propio patrón"],
      weaknesses: ["Termina huyendo, así que la relación batalla para durar", "El deseo de acercarse choca con el miedo", "Una presencia como espejismo, difícil de construir confianza"],
      bestMatch: { code: "S", reason: "Solo Seguro, que se queda incluso cuando el otro huye, puede retenerlo" },
      worstMatch: { code: "A+V", reason: "Ambos huyen — ninguno puede acercarse, y el vínculo desaparece como un espejismo" },
      scene: "Durante las tres primeras citas escribe con más ilusión que nadie. En cuanto la otra persona pregunta \"¿y si lo hacemos oficial?\", los mensajes se cortan… y unas semanas después llega un \"¡hola! ¿cómo has estado?\".",
    },
  },
];

export function getAttachmentTypeByCode(code: string): AttachmentType | undefined {
  return ATTACHMENT_TYPES.find((t) => t.code === code);
}
