"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/data/attachment-types";

export type AttachmentAxis = "secure" | "anxious" | "avoidant" | "disorganized";

const LANG_CODES: Lang[] = ["ko", "en", "ja", "zh", "es"];

type LocalizedText = Record<Lang, string>;
type Option = { label: LocalizedText; axis: AttachmentAxis };
type Question = { question: LocalizedText; options: Option[] };

const AXIS_CODE: Record<AttachmentAxis, string> = {
  secure: "S",
  anxious: "A",
  avoidant: "V",
  disorganized: "D",
};

const UI: Record<Lang, { badge: string; home: string; back: string }> = {
  ko: { badge: "💕 내 연애 유형 테스트", home: "홈", back: "이전" },
  en: { badge: "💕 My Attachment Style Test", home: "Home", back: "Back" },
  ja: { badge: "💕 恋愛タイプ診断", home: "ホーム", back: "戻る" },
  zh: { badge: "💕 恋爱类型测试", home: "主页", back: "上一步" },
  es: { badge: "💕 Test de Estilo de Apego", home: "Inicio", back: "Atrás" },
};

// Questions 1-12 keep their original K-Drama-era wording (the scenarios read
// fine for a relationship quiz too) but every option is remapped to one of
// the 4 attachment axes below — the old personality tags (warm/cold/etc.)
// don't feed into attachment scoring, so they were dropped. Questions 13-20
// are new. Original brief only supplied 8 old + 8 new = 16; questions 17-20
// fill out the stated 20-question total in the same scenario/axis-order style.
const QUESTIONS: Question[] = [
  {
    question: {
      ko: "소개팅에서 상대가 먼저 말을 걸었을 때, 당신은?",
      en: "When someone approaches you first on a first date, you...",
      ja: "合コンで相手が先に話しかけてきたら、あなたは?",
      zh: "相亲时对方先开口搭话，你会?",
      es: "Si en una primera cita la otra persona te habla primero, tú...",
    },
    options: [
      { label: { ko: "부드럽게 웃으며 대화를 이어간다", en: "Smile warmly and keep the conversation going", ja: "優しく笑いながら会話を続ける", zh: "温柔地笑着继续聊下去", es: "Sonríes con calidez y sigues la conversación" }, axis: "secure" },
      { label: { ko: "짧고 시크하게 대답한다", en: "Answer briefly and coolly", ja: "短くクールに答える", zh: "简短高冷地回答", es: "Respondes corto y con actitud fría" }, axis: "avoidant" },
      { label: { ko: "재치있는 농담으로 분위기를 주도한다", en: "Take charge of the mood with witty jokes", ja: "気の利いたジョークで雰囲気を主導する", zh: "用机智的玩笑主导气氛", es: "Tomas el control del ambiente con bromas ingeniosas" }, axis: "anxious" },
      { label: { ko: "말없이 상대를 관찰한다", en: "Silently observe the other person", ja: "無言で相手を観察する", zh: "默默地观察对方", es: "Observas a la otra persona en silencio" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "친구가 힘든 일을 겪고 있을 때 당신은?",
      en: "When a friend is going through a hard time, you...",
      ja: "友達が辛いことを経験している時、あなたは?",
      zh: "朋友遇到困难的时候，你会?",
      es: "Cuando un amigo está pasando por un mal momento, tú...",
    },
    options: [
      { label: { ko: "말없이 옆에서 챙겨준다", en: "Quietly stay by their side and look after them", ja: "無言でそばにいて気にかける", zh: "默默陪在身边照顾对方", es: "Te quedas a su lado en silencio y lo cuidas" }, axis: "secure" },
      { label: { ko: "바로 해결책을 제시한다", en: "Offer a solution right away", ja: "すぐに解決策を提示する", zh: "马上提出解决方案", es: "Ofreces una solución de inmediato" }, axis: "avoidant" },
      { label: { ko: "분위기를 밝게 바꿔준다", en: "Try to lighten the mood", ja: "雰囲気を明るく変えてあげる", zh: "努力让气氛变得轻松", es: "Intentas alegrar el ambiente" }, axis: "anxious" },
      { label: { ko: "조용히 지켜보다 결정적일 때 나선다", en: "Watch quietly, then step in at the decisive moment", ja: "静かに見守り、決定的な時に動く", zh: "安静地观察，在关键时刻出手", es: "Observas en silencio y actúas en el momento decisivo" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "나를 화나게 하는 사람이 있다면?",
      en: "If someone makes you angry?",
      ja: "自分を怒らせる人がいたら?",
      zh: "如果有人惹你生气?",
      es: "¿Si alguien te hace enojar?",
    },
    options: [
      { label: { ko: "화내지 않고 조용히 기억해둔다", en: "Don't get angry, just quietly remember it", ja: "怒らずに静かに覚えておく", zh: "不生气，默默记在心里", es: "No te enojas, solo lo recuerdas en silencio" }, axis: "avoidant" },
      { label: { ko: "바로 맞서서 할 말은 한다", en: "Confront them right away and say what needs to be said", ja: "すぐに向き合って言うべきことは言う", zh: "马上正面回应，该说的都说", es: "Los enfrentas de inmediato y dices lo que hay que decir" }, axis: "secure" },
      { label: { ko: "그냥 웃으며 넘어간다", en: "Just laugh it off", ja: "ただ笑って流す", zh: "笑笑就过去了", es: "Simplemente te ríes y lo dejas pasar" }, axis: "disorganized" },
      { label: { ko: "감정을 숨기지 않고 표현한다", en: "Express your feelings without hiding them", ja: "感情を隠さずに表現する", zh: "毫不掩饰地表达情绪", es: "Expresas tus sentimientos sin ocultarlos" }, axis: "anxious" },
    ],
  },
  {
    question: {
      ko: "이상적인 주말은?",
      en: "Your ideal weekend?",
      ja: "理想の週末は?",
      zh: "理想的周末是?",
      es: "¿Tu fin de semana ideal?",
    },
    options: [
      { label: { ko: "집에서 혼자 정비하는 날", en: "A day alone at home to recharge", ja: "家で一人で整える日", zh: "一个人在家整理调整的一天", es: "Un día solo en casa para recargar energías" }, axis: "avoidant" },
      { label: { ko: "새로운 걸 도전하는 날", en: "A day to try something new", ja: "新しいことに挑戦する日", zh: "尝试新事物的一天", es: "Un día para probar algo nuevo" }, axis: "disorganized" },
      { label: { ko: "사람들과 화려하게 노는 날", en: "A day out having a glamorous time with people", ja: "みんなと華やかに遊ぶ日", zh: "和大家热闹地玩耍的一天", es: "Un día de fiesta y diversión con gente" }, axis: "anxious" },
      { label: { ko: "조용한 카페에서 책 읽는 날", en: "A day reading a book at a quiet café", ja: "静かなカフェで本を読む日", zh: "在安静的咖啡厅看书的一天", es: "Un día leyendo un libro en un café tranquilo" }, axis: "secure" },
    ],
  },
  {
    question: {
      ko: "당신의 옷장 스타일은?",
      en: "Your closet style?",
      ja: "あなたのクローゼットのスタイルは?",
      zh: "你的衣橱风格是?",
      es: "¿El estilo de tu armario?",
    },
    options: [
      { label: { ko: "올 블랙, 미니멀", en: "All black, minimal", ja: "オールブラック、ミニマル", zh: "全黑极简风", es: "Todo negro, minimalista" }, axis: "avoidant" },
      { label: { ko: "파스텔톤의 부드러운 옷", en: "Soft pastel-toned clothes", ja: "パステルトーンの柔らかい服", zh: "柔和的马卡龙色系服装", es: "Ropa suave en tonos pastel" }, axis: "secure" },
      { label: { ko: "포인트 있는 화려한 룩", en: "A glamorous look with statement pieces", ja: "ポイントのある華やかなルック", zh: "带亮点的华丽造型", es: "Un look llamativo con piezas statement" }, axis: "anxious" },
      { label: { ko: "편안한 캐주얼", en: "Comfortable casual wear", ja: "楽なカジュアル", zh: "舒适的休闲风", es: "Ropa casual y cómoda" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "조직(회사·학교)에서 당신의 포지션은?",
      en: "Your position in a group (work/school)?",
      ja: "組織(会社・学校)でのあなたのポジションは?",
      zh: "在团体（公司/学校）中你的角色是?",
      es: "¿Tu posición en un grupo (trabajo/escuela)?",
    },
    options: [
      { label: { ko: "있는 듯 없는 듯 조용히 일 잘함", en: "Quietly gets things done, barely noticed", ja: "いるようでいない、静かに仕事ができる人", zh: "存在感不强却把事情做得很好", es: "Pasa casi desapercibido pero hace bien su trabajo" }, axis: "avoidant" },
      { label: { ko: "눈에 띄는 리더", en: "A leader who stands out", ja: "目立つリーダー", zh: "引人注目的领导者", es: "Un líder que destaca" }, axis: "secure" },
      { label: { ko: "분위기 메이커", en: "The mood maker", ja: "ムードメーカー", zh: "气氛担当", es: "El alma de la fiesta" }, axis: "anxious" },
      { label: { ko: "무슨 생각 하는지 모르겠는 사람", en: "The one nobody can quite read", ja: "何を考えているかわからない人", zh: "让人猜不透在想什么的人", es: "La persona que nadie logra descifrar" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "좋아하는 사람이 생기면 당신은?",
      en: "When you develop feelings for someone, you...",
      ja: "好きな人ができたら、あなたは?",
      zh: "有喜欢的人时，你会?",
      es: "Cuando te gusta alguien, tú...",
    },
    options: [
      { label: { ko: "티 안 내고 몰래 챙긴다", en: "Quietly look out for them without showing it", ja: "そぶりを見せずにこっそり気にかける", zh: "不动声色地默默照顾对方", es: "Los cuidas en secreto sin que se note" }, axis: "avoidant" },
      { label: { ko: "직진한다", en: "Go straight for it", ja: "直進する", zh: "直接表白，直球出击", es: "Vas directo al grano" }, axis: "secure" },
      { label: { ko: "오히려 퉁명스럽게 군다", en: "Act unusually blunt instead", ja: "むしろぶっきらぼうに振る舞う", zh: "反而表现得很生硬", es: "En vez de eso, actúas de forma brusca" }, axis: "disorganized" },
      { label: { ko: "계획적으로 조금씩 다가간다", en: "Approach carefully, step by step, with a plan", ja: "計画的に少しずつ近づく", zh: "有计划地一点点靠近", es: "Te acercas poco a poco con un plan" }, axis: "anxious" },
    ],
  },
  {
    question: {
      ko: "당신의 인생이 드라마라면, 장르는?",
      en: "If your life were a drama, what genre would it be?",
      ja: "あなたの人生がドラマなら、ジャンルは?",
      zh: "如果你的人生是一部剧，会是什么类型?",
      es: "¿Si tu vida fuera una serie, qué género sería?",
    },
    options: [
      { label: { ko: "재벌가 로맨스", en: "A wealthy-family romance", ja: "財閥家ロマンス", zh: "豪门爱情剧", es: "Un romance de familia adinerada" }, axis: "anxious" },
      { label: { ko: "시원한 복수극", en: "A satisfying revenge story", ja: "スカッとする復讐劇", zh: "痛快的复仇剧", es: "Una historia de venganza satisfactoria" }, axis: "avoidant" },
      { label: { ko: "잔잔한 힐링 일상물", en: "A calm, healing slice-of-life", ja: "穏やかな癒し系日常もの", zh: "温馨治愈的日常剧", es: "Una serie tranquila y reconfortante del día a día" }, axis: "secure" },
      { label: { ko: "풋풋한 캠퍼스 성장물", en: "A fresh, awkward campus coming-of-age story", ja: "初々しいキャンパス成長もの", zh: "青涩的校园成长剧", es: "Una historia de crecimiento universitario" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "애인이 갑자기 연락이 뜸해지면?",
      en: "If your partner suddenly starts texting less?",
      ja: "恋人が急に連絡少なくなったら?",
      zh: "如果恋人突然联系变少了?",
      es: "¿Si tu pareja de repente empieza a escribirte menos?",
    },
    options: [
      { label: { ko: "무슨 일 있나 계속 확인하고 싶음", en: "Want to keep checking if something's wrong", ja: "何かあったのか確認し続けたくなる", zh: "很想不断确认是不是出了什么事", es: "Quieres seguir comprobando si algo anda mal" }, axis: "anxious" },
      { label: { ko: "그러려니 하고 기다림", en: "Assume it's fine and just wait", ja: "そんなものだと思って待つ", zh: "觉得没什么，安心等待", es: "Asumes que está bien y simplemente esperas" }, axis: "secure" },
      { label: { ko: "오히려 나도 편함", en: "Honestly, it's a relief", ja: "むしろ自分も気楽", zh: "反而自己也觉得轻松", es: "En realidad, te sientes aliviado también" }, axis: "avoidant" },
      { label: { ko: "신경 쓰이는데 티 안 내다가 폭발함", en: "It bothers you, but you hide it until you explode", ja: "気になるのに我慢して爆発する", zh: "在意却憋着，最后突然爆发", es: "Te molesta, lo ocultas, y luego explotas" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "새로 만난 사람이 급속도로 애정표현을 하면?",
      en: "If someone you just met showers you with affection right away?",
      ja: "新しく出会った人が急速に愛情表現をしてきたら?",
      zh: "如果新认识的人迅速表达爱意?",
      es: "¿Si alguien que acabas de conocer te muestra mucho cariño de golpe?",
    },
    options: [
      { label: { ko: "좋으면서도 진심인지 계속 의심함", en: "You like it, but keep doubting if it's genuine", ja: "嬉しいのに本気か疑い続ける", zh: "开心的同时又一直怀疑是不是真心", es: "Te gusta, pero sigues dudando si es sincero" }, axis: "anxious" },
      { label: { ko: "자연스럽게 받아들임", en: "Accept it naturally", ja: "自然に受け入れる", zh: "自然而然地接受", es: "Lo aceptas con naturalidad" }, axis: "secure" },
      { label: { ko: "부담스러워서 거리 둠", en: "It feels like too much, so you keep your distance", ja: "負担に感じて距離を置く", zh: "觉得有压力，保持距离", es: "Te resulta abrumador y guardas distancia" }, axis: "avoidant" },
      { label: { ko: "확 끌렸다가 무서워서 밀어냄", en: "Get strongly drawn in, then push them away out of fear", ja: "強く惹かれたのに怖くなって突き放す", zh: "被强烈吸引却又害怕而推开对方", es: "Te sientes muy atraído y luego los alejas por miedo" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "이별 후 새로운 사람 만나기까지 걸리는 시간은?",
      en: "How long does it take you to date again after a breakup?",
      ja: "別れた後、新しい人に会うまでの時間は?",
      zh: "分手后到重新开始恋爱需要多久?",
      es: "¿Cuánto tardas en volver a salir con alguien tras una ruptura?",
    },
    options: [
      { label: { ko: "오래 걸림, 계속 전 연애 생각남", en: "A long time — you keep thinking about the ex", ja: "長くかかる、ずっと前の恋愛を思い出す", zh: "需要很久，总是想起上一段感情", es: "Mucho tiempo — sigues pensando en tu ex" }, axis: "anxious" },
      { label: { ko: "슬퍼도 적당히 정리되면", en: "Sad for a while, but once it settles, you move on", ja: "悲しくても適度に整理がついたら", zh: "难过一阵，情绪整理好就重新开始", es: "Triste, pero en cuanto lo superas, sigues adelante" }, axis: "secure" },
      { label: { ko: "빨리 넘어감", en: "You get over it quickly", ja: "すぐに乗り越える", zh: "很快就翻篇", es: "Lo superas rápido" }, axis: "avoidant" },
      { label: { ko: "빨리 만나는데 자꾸 비교하게 됨", en: "You date again quickly, but keep comparing", ja: "すぐに会うけどつい比較してしまう", zh: "很快开始新恋情却总忍不住比较", es: "Sales rápido con alguien, pero no dejas de comparar" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "애인이 이성 친구와 친하게 지내는 걸 보면?",
      en: "If your partner is close with a friend of the opposite sex?",
      ja: "恋人が異性の友達と仲良くしているのを見たら?",
      zh: "看到恋人和异性朋友关系很好?",
      es: "¿Si tu pareja es muy cercana con un amigo/a del sexo opuesto?",
    },
    options: [
      { label: { ko: "계속 신경 쓰이고 물어보고 싶음", en: "It keeps bothering you and you want to ask about it", ja: "ずっと気になって聞きたくなる", zh: "一直很在意，想问个清楚", es: "Te sigue molestando y quieres preguntar al respecto" }, axis: "anxious" },
      { label: { ko: "믿고 넘어감", en: "Trust them and let it go", ja: "信じて流す", zh: "选择相信，不多想", es: "Confías y lo dejas pasar" }, axis: "secure" },
      { label: { ko: "딱히 신경 안 씀", en: "Don't really care", ja: "特に気にしない", zh: "并不怎么在意", es: "No te importa demasiado" }, axis: "avoidant" },
      { label: { ko: "겉으론 쿨한 척, 속으론 복잡함", en: "Act cool on the outside, but it's complicated inside", ja: "表向きはクールなふり、内心は複雑", zh: "表面装作无所谓，内心却很复杂", es: "Por fuera actúas tranquilo, mientras por dentro es complicado" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "애인에게 서운한 게 생기면 표현하는 방식은?",
      en: "When you feel hurt by your partner, how do you express it?",
      ja: "恋人に不満ができたら、どう表現する?",
      zh: "对恋人感到委屈时，你会怎么表达?",
      es: "Cuando te sientes dolido por tu pareja, ¿cómo lo expresas?",
    },
    options: [
      { label: { ko: "바로 티 내고 확인받고 싶어함", en: "Show it right away and want reassurance", ja: "すぐに態度に出して確認してほしくなる", zh: "马上表现出来，想得到安抚确认", es: "Lo muestras enseguida y buscas que te reafirmen" }, axis: "anxious" },
      { label: { ko: "차분히 대화로 풀려고 함", en: "Try to resolve it calmly through conversation", ja: "落ち着いて対話で解決しようとする", zh: "努力冷静地通过对话解决", es: "Intentas resolverlo con calma hablando" }, axis: "secure" },
      { label: { ko: "그냥 넘기거나 혼자 삭힘", en: "Just let it go or bottle it up alone", ja: "そのまま流すか一人で抱え込む", zh: "干脆放过或者一个人默默消化", es: "Simplemente lo dejas pasar o te lo guardas solo" }, axis: "avoidant" },
      { label: { ko: "참다가 갑자기 크게 터트림", en: "Hold it in, then suddenly blow up", ja: "我慢して急に大きく爆発する", zh: "忍着忍着突然大爆发", es: "Lo aguantas y de repente estallas" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "연애할 때 상대에게 가장 바라는 것은?",
      en: "What do you want most from a partner in a relationship?",
      ja: "恋愛中、相手に最も望むことは?",
      zh: "恋爱中你最希望对方给你的是?",
      es: "¿Qué es lo que más deseas de tu pareja en una relación?",
    },
    options: [
      { label: { ko: "끊임없는 확인과 애정표현", en: "Constant reassurance and affection", ja: "絶え間ない確認と愛情表現", zh: "不断的确认与爱意表达", es: "Reafirmación constante y muestras de cariño" }, axis: "anxious" },
      { label: { ko: "신뢰와 안정적인 소통", en: "Trust and steady communication", ja: "信頼と安定したコミュニケーション", zh: "信任与稳定的沟通", es: "Confianza y comunicación estable" }, axis: "secure" },
      { label: { ko: "각자의 공간과 자유", en: "Personal space and freedom", ja: "それぞれの空間と自由", zh: "各自的空间与自由", es: "Espacio y libertad individual" }, axis: "avoidant" },
      { label: { ko: "그때그때 다름, 나도 잘 모름", en: "It varies — even you're not sure", ja: "その時々で違う、自分でもよくわからない", zh: "每次都不一样，自己也说不清", es: "Depende del momento — ni tú mismo lo sabes" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "\"우리 앞으로 어떻게 할까\" 미래 얘기가 나오면?",
      en: "When the \"what are we\" future talk comes up?",
      ja: "「これから私たちどうする?」という将来の話が出たら?",
      zh: "当聊到\"我们以后怎么办\"这种未来话题时?",
      es: "¿Cuando surge la conversación sobre qué seremos en el futuro?",
    },
    options: [
      { label: { ko: "설레면서도 불안한 확인을 계속함", en: "Excited but keeps anxiously seeking reassurance", ja: "ときめきながらも不安な確認を続ける", zh: "既心动又不安，一直想确认", es: "Emocionado, pero sigue buscando reafirmación con ansiedad" }, axis: "anxious" },
      { label: { ko: "편하게 같이 계획함", en: "Comfortably make plans together", ja: "気楽に一緒に計画する", zh: "轻松自在地一起规划", es: "Planean juntos con tranquilidad" }, axis: "secure" },
      { label: { ko: "부담스러워서 화제 돌림", en: "Feels like pressure, so you change the subject", ja: "負担に感じて話題を変える", zh: "感到有压力，转移话题", es: "Se siente pesado, así que cambias de tema" }, axis: "avoidant" },
      { label: { ko: "하고 싶은데 갑자기 겁이 남", en: "Wants to, but suddenly gets scared", ja: "したいのに急に怖くなる", zh: "想聊却又突然感到害怕", es: "Quieres hacerlo, pero de repente te da miedo" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "애인이 \"사랑해\"라고 자주 말해주길 바라는가?",
      en: "Do you want your partner to say \"I love you\" often?",
      ja: "恋人に「愛してる」とよく言ってほしいか?",
      zh: "希望恋人经常对你说\"我爱你\"吗?",
      es: "¿Quieres que tu pareja te diga te amo seguido?",
    },
    options: [
      { label: { ko: "그렇다, 자주 들어야 안심됨", en: "Yes — hearing it often makes you feel secure", ja: "そう、頻繁に聞かないと安心できない", zh: "是的，经常听到才会安心", es: "Sí — escucharlo seguido te da seguridad" }, axis: "anxious" },
      { label: { ko: "가끔이어도 진심이면 충분함", en: "Even occasionally is enough if it's sincere", ja: "たまにでも本気なら十分", zh: "偶尔说也没关系，只要是真心的就够了", es: "Aunque sea de vez en cuando, basta si es sincero" }, axis: "secure" },
      { label: { ko: "말보다 행동으로 보여주는 게 편함", en: "More comfortable showing it through actions than words", ja: "言葉より行動で示す方が楽", zh: "比起说，更习惯用行动表达", es: "Te resulta más cómodo demostrarlo con acciones que con palabras" }, axis: "avoidant" },
      { label: { ko: "듣고 싶은데 막상 들으면 어색함", en: "Want to hear it, but it feels awkward when you actually do", ja: "聞きたいのに実際に聞くと気まずい", zh: "想听却又在真听到时觉得尴尬", es: "Quieres oírlo, pero cuando lo escuchas te resulta incómodo" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "데이트 약속을 잡을 때 당신은?",
      en: "When making a date plan, you...",
      ja: "デートの約束をする時、あなたは?",
      zh: "约会安排时间时，你会?",
      es: "Al organizar una cita, tú...",
    },
    options: [
      { label: { ko: "자꾸 확인 문자를 보내게 됨", en: "Keep sending texts to confirm", ja: "つい確認のメッセージを送ってしまう", zh: "总是忍不住发消息再三确认", es: "No dejas de enviar mensajes para confirmar" }, axis: "anxious" },
      { label: { ko: "편하게 정하고 기다림", en: "Set it casually and wait", ja: "気楽に決めて待つ", zh: "轻松定好然后等待", es: "Lo acuerdas con calma y esperas" }, axis: "secure" },
      { label: { ko: "너무 빡빡한 계획은 부담스러움", en: "A too-tight schedule feels like a burden", ja: "あまりに詰まった計画は負担", zh: "太紧凑的计划让人有压力", es: "Un plan demasiado apretado se siente pesado" }, axis: "avoidant" },
      { label: { ko: "정했다가 갑자기 취소하고 싶어짐", en: "Set a plan, then suddenly want to cancel", ja: "決めたのに急にキャンセルしたくなる", zh: "定好了却突然想取消", es: "Lo planeas y de repente quieres cancelarlo" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "애인과 싸운 후 화해하는 방식은?",
      en: "How do you make up after a fight with your partner?",
      ja: "恋人と喧嘩した後、仲直りする方法は?",
      zh: "和恋人吵架后，你和好的方式是?",
      es: "¿Cómo te reconcilias con tu pareja después de una pelea?",
    },
    options: [
      { label: { ko: "빨리 풀고 싶어서 계속 먼저 연락함", en: "Want to resolve it fast, so you keep reaching out first", ja: "早く解決したくて何度も先に連絡する", zh: "很想快点和好，不断主动联系", es: "Quieres resolverlo rápido, así que sigues contactando primero" }, axis: "anxious" },
      { label: { ko: "시간을 갖고 차분히 대화로 푼다", en: "Take some time, then resolve it calmly through talking", ja: "時間を置いて落ち着いて対話で解決する", zh: "先冷静一下，再通过对话解决", es: "Te tomas un tiempo y lo resuelves hablando con calma" }, axis: "secure" },
      { label: { ko: "먼저 연락하기보다 기다리는 편", en: "Prefer to wait rather than reach out first", ja: "先に連絡するより待つ方", zh: "比起先联系，更倾向于等待", es: "Prefieres esperar antes que contactar primero" }, axis: "avoidant" },
      { label: { ko: "화해하고 싶다가도 자존심에 더 멀어짐", en: "Want to make up, but pride pushes you further apart", ja: "仲直りしたいのにプライドでさらに遠ざかる", zh: "想和好却因为自尊心变得更疏远", es: "Quieres reconciliarte, pero el orgullo te aleja aún más" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "연애 초반, 상대의 마음을 확신하기까지?",
      en: "Early in a relationship, how long until you're sure of their feelings?",
      ja: "恋愛初期、相手の気持ちを確信するまで?",
      zh: "恋爱初期，要多久才能确定对方的心意?",
      es: "Al inicio de una relación, ¿cuánto tardas en confiar en los sentimientos del otro?",
    },
    options: [
      { label: { ko: "계속 신호를 확인해야 안심됨", en: "Need to keep checking for signs to feel at ease", ja: "ずっとサインを確認しないと安心できない", zh: "需要不断确认信号才会安心", es: "Necesitas revisar señales constantemente para sentirte tranquilo" }, axis: "anxious" },
      { label: { ko: "자연스럽게 시간이 지나면 믿게 됨", en: "Naturally comes to trust it as time passes", ja: "自然と時間が経てば信じられる", zh: "时间一长自然就会相信", es: "Con el tiempo, confías de forma natural" }, axis: "secure" },
      { label: { ko: "확신 없어도 크게 신경 안 씀", en: "Doesn't bother you much even without certainty", ja: "確信がなくてもあまり気にしない", zh: "即使没有确定感也不太在意", es: "No te importa demasiado aunque no haya certeza" }, axis: "avoidant" },
      { label: { ko: "확신했다가도 다시 의심이 스멀스멀", en: "Feel sure, then doubt creeps back in", ja: "確信したのにまた疑いがじわじわ来る", zh: "确信了却又慢慢开始怀疑", es: "Te sientes seguro, pero la duda vuelve a aparecer poco a poco" }, axis: "disorganized" },
    ],
  },
  {
    question: {
      ko: "애인이 없을 때 당신의 상태는?",
      en: "How do you feel when you're single?",
      ja: "恋人がいない時のあなたの状態は?",
      zh: "没有恋人的时候，你的状态是?",
      es: "¿Cómo te sientes cuando estás soltero/a?",
    },
    options: [
      { label: { ko: "외로움을 많이 느끼고 빨리 채우고 싶음", en: "Feel very lonely and want to fill the gap quickly", ja: "寂しさを強く感じてすぐに埋めたくなる", zh: "很容易感到孤独，想赶快找人填补", es: "Te sientes muy solo y quieres llenar el vacío rápido" }, axis: "anxious" },
      { label: { ko: "혼자여도 나름 만족하며 지냄", en: "Content on your own", ja: "一人でもそれなりに満足して過ごす", zh: "一个人也过得挺满足", es: "Estás bien contigo mismo, aunque estés solo" }, axis: "secure" },
      { label: { ko: "오히려 자유롭고 편함", en: "Actually feels free and comfortable", ja: "むしろ自由で気楽", zh: "反而觉得自由自在", es: "En realidad se siente libre y cómodo" }, axis: "avoidant" },
      { label: { ko: "외롭다가도 막상 생기면 부담스러워함", en: "Feel lonely, but once you have someone, it feels like too much", ja: "寂しいのに実際に恋人ができると負担に感じる", zh: "孤独的同时，真有对象了又觉得有压力", es: "Te sientes solo, pero en cuanto tienes pareja, se siente abrumador" }, axis: "disorganized" },
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
  const [lang, setLang] = useState<Lang>("ko");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && LANG_CODES.includes(saved)) setLang(saved);
  }, []);

  const ui = UI[lang];
  const total = QUESTIONS.length;
  const question = QUESTIONS[step];

  const selectOption = (option: Option, index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    setTimeout(() => {
      const next = [...answers, option];
      if (step + 1 < total) {
        setAnswers(next);
        setDirection("forward");
        setStep(step + 1);
        setSelectedIndex(null);
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
    setSelectedIndex(null);
    setAnswers(answers.slice(0, -1));
    setDirection("back");
    setStep(step - 1);
  };

  return (
    <main style={styles.root}>
      <div style={{ ...styles.glow, top: -100, left: -60, background: "rgba(124,58,237,0.18)" }} />
      <div style={{ ...styles.glow, bottom: -80, right: -40, background: "rgba(236,72,153,0.14)" }} />

      <div style={styles.container}>
        <button className="tap-btn" style={styles.backBtn} onClick={goBack}>← {step === 0 ? ui.home : ui.back}</button>

        <div style={styles.progressWrap}>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${((step + 1) / total) * 100}%` }} />
          </div>
          <p style={styles.progressLabel}>{step + 1} / {total}</p>
        </div>

        <div key={step} className={direction === "forward" ? "quiz-step-forward" : "quiz-step-back"} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={styles.header}>
            <div style={styles.labelPill}>{ui.badge}</div>
            <h1 style={styles.question}>{question.question[lang]}</h1>
          </div>

          <div style={styles.optionsWrap}>
            {question.options.map((opt, i) => (
              <button
                key={i}
                className="tap-btn"
                style={{
                  ...styles.optionBtn,
                  ...(selectedIndex === i ? styles.optionBtnSelected : null),
                  opacity: selectedIndex !== null && selectedIndex !== i ? 0.4 : 1,
                }}
                onClick={() => selectOption(opt, i)}
                disabled={selectedIndex !== null}
              >
                {opt.label[lang]}
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
