import { getAttachmentTypeByCode, type AttachmentAxis, type Lang } from "@/data/attachment-types";

export type DuoPairContent = {
  title: string;
  summary: string;
  conflict: string;
  tip: string;
};

export type DuoPairKey =
  | "anxious-anxious"
  | "anxious-avoidant"
  | "anxious-disorganized"
  | "anxious-secure"
  | "avoidant-avoidant"
  | "avoidant-disorganized"
  | "avoidant-secure"
  | "disorganized-disorganized"
  | "disorganized-secure"
  | "secure-secure";

export type DuoPair = { base: number } & Record<Lang, DuoPairContent>;

// Compatibility content for every unordered pair of primary attachment axes.
// Keys are the two axis names sorted alphabetically and joined with "-".
export const DUO_PAIRS: Record<DuoPairKey, DuoPair> = {
  "secure-secure": {
    base: 90,
    ko: {
      title: "서로의 안전기지",
      summary: "두 사람 모두 친밀함과 독립성 사이의 균형을 편안하게 유지하는 조합입니다. 상대의 애정을 의심하지 않기 때문에 감정을 솔직하게 표현하고, 서로를 탐색과 성장의 안전기지로 삼을 수 있습니다.",
      conflict: "갈등이 크게 번지지는 않지만, 서로 괜찮을 거라 믿고 작은 불만을 미뤄두다가 거리감이 생기는 경우가 있습니다.",
      tip: "한 달에 한 번, 관계에서 좋았던 점과 바라는 점을 한 가지씩 나누는 시간을 정해 보세요.",
    },
    en: {
      title: "Each Other's Safe Haven",
      summary: "Both partners comfortably balance closeness and independence. Because neither doubts the other's affection, feelings are expressed openly and each person becomes a secure base for the other's growth.",
      conflict: "Conflicts rarely escalate, but trusting that things will be fine can lead both to postpone small complaints until a quiet distance forms.",
      tip: "Set aside time once a month to share one thing you appreciated and one thing you'd like in the relationship.",
    },
    ja: {
      title: "互いの安全基地",
      summary: "二人とも親密さと自立のバランスを無理なく保てる組み合わせです。相手の愛情を疑わないため気持ちを素直に表現でき、互いを探索と成長のための安全基地にすることができます。",
      conflict: "対立が大きくなることは少ないものの、互いに大丈夫だろうと小さな不満を先送りし、気づかないうちに距離が生まれることがあります。",
      tip: "月に一度、関係の中で良かったことと望むことを一つずつ伝え合う時間を決めてみましょう。",
    },
    zh: {
      title: "彼此的安全基地",
      summary: "两人都能自在地在亲密与独立之间保持平衡。因为不怀疑对方的爱意，双方可以坦率表达情感，并把彼此当作探索与成长的安全基地。",
      conflict: "冲突很少升级，但双方都相信“没关系”，可能会把小的不满一再搁置，久而久之产生距离感。",
      tip: "每月固定一次，各自分享一件在关系中感到满意的事和一件希望改进的事。",
    },
    es: {
      title: "Refugio seguro mutuo",
      summary: "Ambos equilibran con naturalidad la cercanía y la independencia. Como ninguno duda del afecto del otro, expresan sus emociones con franqueza y se convierten en una base segura para el crecimiento mutuo.",
      conflict: "Los conflictos rara vez escalan, pero confiar en que todo irá bien puede llevar a posponer pequeñas quejas hasta que surge cierta distancia.",
      tip: "Reserven un momento al mes para compartir una cosa que valoraron y una cosa que desean en la relación.",
    },
  },
  "anxious-secure": {
    base: 80,
    ko: {
      title: "불안을 품어주는 품",
      summary: "안정형 파트너의 일관된 반응이 불안형 파트너의 걱정을 완충해 주는 조합입니다. 예측 가능한 애정 표현이 쌓일수록 불안형은 확인 행동을 줄이고 관계에 안심하게 됩니다.",
      conflict: "불안형이 연락이나 애정 표현의 빈도에 민감해질 때, 안정형이 이를 과한 요구로 느끼며 피로감을 보이는 패턴이 나타날 수 있습니다.",
      tip: "연락이 늦어질 때는 '지금 바빠서 저녁에 연락할게'처럼 짧게라도 미리 알려 주세요. 불안형은 걱정을 비난이 아닌 '나는 ~가 불안해'라는 문장으로 전해 보세요.",
    },
    en: {
      title: "A Calm Harbor for Worry",
      summary: "The secure partner's consistent responsiveness buffers the anxious partner's worries. As predictable expressions of affection accumulate, the anxious partner seeks reassurance less often and settles into the relationship.",
      conflict: "When the anxious partner grows sensitive to how often they hear from the other, the secure partner may experience it as excessive demand and show signs of fatigue.",
      tip: "When you'll be slow to reply, send a short heads-up like \"Busy now, I'll text tonight.\" The anxious partner can share worries as \"I feel anxious when...\" rather than as blame.",
    },
    ja: {
      title: "不安を包み込む存在",
      summary: "安定型パートナーの一貫した反応が、不安型パートナーの心配を和らげる組み合わせです。予測できる愛情表現が積み重なるほど、不安型は確認行動を減らし、関係に安心できるようになります。",
      conflict: "不安型が連絡や愛情表現の頻度に敏感になると、安定型がそれを過度な要求と感じて疲れを見せるパターンが生じることがあります。",
      tip: "返信が遅れるときは「今忙しいから夜に連絡するね」と短くても先に伝えましょう。不安型は心配を責める形ではなく「私は〜が不安」という言葉で伝えてみてください。",
    },
    zh: {
      title: "包容不安的港湾",
      summary: "安全型伴侣始终如一的回应，能缓冲焦虑型伴侣的担忧。随着可预期的爱意表达不断积累，焦虑型会减少确认行为，并在关系中逐渐安心。",
      conflict: "当焦虑型对联系频率或爱意表达变得敏感时，安全型可能将其视为过多的要求，从而表现出疲惫。",
      tip: "回复会晚时，哪怕简短也先告知一声，例如“现在有点忙，晚上联系你”。焦虑型可以用“我对……感到不安”的方式表达担忧，而不是责备。",
    },
    es: {
      title: "Un puerto para la inquietud",
      summary: "La respuesta constante de la pareja segura amortigua las preocupaciones de la pareja ansiosa. A medida que se acumulan muestras de afecto predecibles, la persona ansiosa busca menos confirmación y se siente tranquila en la relación.",
      conflict: "Cuando la persona ansiosa se vuelve sensible a la frecuencia del contacto, la persona segura puede vivirlo como una exigencia excesiva y mostrar cansancio.",
      tip: "Si vas a tardar en responder, avisa brevemente: \"Estoy ocupado/a, te escribo esta noche\". La persona ansiosa puede expresar su inquietud como \"Me siento inseguro/a cuando...\" en lugar de un reproche.",
    },
  },
  "avoidant-secure": {
    base: 78,
    ko: {
      title: "기다려주는 여유",
      summary: "안정형 파트너가 회피형의 독립 욕구를 위협으로 받아들이지 않기 때문에, 회피형이 천천히 마음을 열 수 있는 조합입니다. 거리를 존중받는 경험이 쌓이면 회피형도 친밀함을 덜 부담스럽게 느끼게 됩니다.",
      conflict: "안정형이 깊은 대화를 원할 때 회피형이 화제를 돌리거나 혼자만의 시간으로 물러나면서, 안정형이 점차 외로움을 느끼는 패턴이 반복될 수 있습니다.",
      tip: "중요한 대화는 '오늘 저녁 30분 정도 이야기할 수 있을까?'처럼 시간과 범위를 정해 제안해 보세요. 회피형은 혼자 있고 싶을 때 이유와 돌아올 시점을 함께 알려 주세요.",
    },
    en: {
      title: "The Patience to Wait",
      summary: "Because the secure partner doesn't treat the avoidant partner's need for independence as a threat, the avoidant partner can open up at their own pace. As respected space accumulates, closeness starts to feel less burdensome.",
      conflict: "When the secure partner wants a deeper conversation, the avoidant partner may change the subject or retreat into alone time, leaving the secure partner gradually feeling lonely.",
      tip: "Propose important talks with a clear scope, like \"Could we talk for about 30 minutes tonight?\" The avoidant partner can share why they need space and when they'll come back.",
    },
    ja: {
      title: "待ってくれる余裕",
      summary: "安定型パートナーが回避型の自立欲求を脅威と受け取らないため、回避型がゆっくりと心を開ける組み合わせです。距離を尊重される経験が重なると、回避型も親密さを負担に感じにくくなります。",
      conflict: "安定型が深い話を望むとき、回避型が話題を変えたり一人の時間に引きこもったりして、安定型が次第に寂しさを感じるパターンが繰り返されることがあります。",
      tip: "大事な話は「今夜30分くらい話せる？」のように時間と範囲を決めて提案してみましょう。回避型は一人になりたいとき、その理由と戻るタイミングを伝えてください。",
    },
    zh: {
      title: "愿意等待的从容",
      summary: "安全型伴侣不会把回避型的独立需求视为威胁，因此回避型可以按自己的节奏慢慢敞开心扉。被尊重空间的经验越多，回避型就越不会觉得亲密是一种负担。",
      conflict: "当安全型想深入交流时，回避型可能转移话题或退回独处，导致安全型逐渐感到孤单，这一模式可能反复出现。",
      tip: "提出重要谈话时，明确时间与范围，例如“今晚能聊30分钟左右吗？”。回避型在需要独处时，请说明原因以及何时回来。",
    },
    es: {
      title: "La calma de saber esperar",
      summary: "Como la pareja segura no percibe la necesidad de independencia de la evitativa como una amenaza, esta puede abrirse a su propio ritmo. Cuantas más veces se respeta su espacio, menos pesada le resulta la cercanía.",
      conflict: "Cuando la persona segura quiere una conversación profunda, la evitativa puede cambiar de tema o retirarse a su tiempo a solas, y la segura empieza a sentirse sola.",
      tip: "Propongan las conversaciones importantes con un marco claro: \"¿Podemos hablar unos 30 minutos esta noche?\". La persona evitativa puede explicar por qué necesita espacio y cuándo volverá.",
    },
  },
  "disorganized-secure": {
    base: 72,
    ko: {
      title: "흔들림을 잡아주는 닻",
      summary: "가까워지고 싶은 마음과 두려움이 공존하는 혼란형에게, 안정형의 일관성은 관계를 다시 믿을 수 있게 하는 경험이 됩니다. 시간이 걸리더라도 예측 가능한 반응이 반복되면 혼란형의 감정 기복이 점차 완만해집니다.",
      conflict: "혼란형이 다가왔다가 갑자기 밀어내는 모습을 보일 때, 안정형이 이유를 몰라 당황하고 같은 대화가 여러 번 반복될 수 있습니다.",
      tip: "감정이 격해질 때 쓸 '잠깐 멈춤' 신호를 미리 정해 두고, 20분 뒤에 다시 이야기하기로 약속해 보세요.",
    },
    en: {
      title: "An Anchor in the Waves",
      summary: "For a disorganized partner who wants closeness yet fears it, the secure partner's consistency becomes an experience that makes trust possible again. Even if it takes time, repeated predictable responses gradually soften the disorganized partner's emotional swings.",
      conflict: "When the disorganized partner draws close and then suddenly pushes away, the secure partner may feel confused, and the same conversation can repeat several times.",
      tip: "Agree in advance on a \"pause\" signal for heated moments, and promise to return to the conversation after 20 minutes.",
    },
    ja: {
      title: "揺れを支える錨",
      summary: "近づきたい気持ちと恐れが共存する混乱型にとって、安定型の一貫性は関係を再び信じられるようになる経験となります。時間はかかっても、予測可能な反応が繰り返されることで混乱型の感情の起伏は徐々に穏やかになります。",
      conflict: "混乱型が近づいたかと思えば急に突き放すとき、安定型が理由が分からず戸惑い、同じ話し合いが何度も繰り返されることがあります。",
      tip: "感情が高ぶったときの「ちょっと休憩」の合図を前もって決め、20分後に話を再開する約束をしてみましょう。",
    },
    zh: {
      title: "稳住摇摆的锚",
      summary: "对于既渴望亲近又害怕亲近的混乱型来说，安全型的一致性是让人重新相信关系的经历。即使需要时间，可预期的回应不断重复，混乱型的情绪起伏也会逐渐趋于平缓。",
      conflict: "当混乱型靠近后又突然推开对方时，安全型可能因不明原因而困惑，同样的对话也可能反复多次。",
      tip: "事先约定一个情绪激动时使用的“暂停”信号，并约好20分钟后再继续谈。",
    },
    es: {
      title: "Un ancla en la marea",
      summary: "Para una persona desorganizada, que desea cercanía pero también la teme, la constancia de la pareja segura es una experiencia que le permite volver a confiar. Aunque lleve tiempo, las respuestas predecibles y repetidas suavizan poco a poco sus altibajos emocionales.",
      conflict: "Cuando la persona desorganizada se acerca y de pronto se aleja, la persona segura puede desconcertarse y la misma conversación puede repetirse varias veces.",
      tip: "Acuerden de antemano una señal de \"pausa\" para los momentos tensos y comprométanse a retomar la conversación 20 minutos después.",
    },
  },
  "anxious-anxious": {
    base: 64,
    ko: {
      title: "깊이 공감하는 두 마음",
      summary: "두 사람 모두 친밀함을 중요하게 여겨 애정 표현이 풍부하고 서로의 감정에 깊이 공감하는 조합입니다. 다만 두 사람의 불안이 동시에 높아지면 서로를 진정시켜 줄 사람이 없어 감정이 증폭되기 쉽습니다.",
      conflict: "한쪽의 서운함이 다른 쪽의 불안을 자극해, 서로 확인을 요구하며 감정이 점점 커지는 패턴이 반복될 수 있습니다.",
      tip: "불안할 때 상대에게 바로 묻기 전에 스스로를 진정시킬 방법(산책, 메모하기 등)을 하나씩 정해 두고, 진정된 뒤에 이야기해 보세요.",
    },
    en: {
      title: "Two Deeply Attuned Hearts",
      summary: "Both partners value closeness, so affection flows freely and each deeply empathizes with the other's feelings. However, when both partners' anxiety rises at once, no one is there to steady things, and emotions can easily amplify.",
      conflict: "One partner's hurt can trigger the other's anxiety, leading both to seek reassurance at the same time while emotions escalate.",
      tip: "Each choose one way to calm yourself (a walk, writing it down) before asking the other for reassurance, and talk once you've settled.",
    },
    ja: {
      title: "深く共感し合う二つの心",
      summary: "二人とも親密さを大切にするため愛情表現が豊かで、互いの気持ちに深く共感できる組み合わせです。ただし二人の不安が同時に高まると、落ち着かせる役がいないため感情が増幅しやすくなります。",
      conflict: "一方の寂しさがもう一方の不安を刺激し、互いに確認を求め合いながら感情が大きくなるパターンが繰り返されることがあります。",
      tip: "不安なときは相手にすぐ確認する前に、自分を落ち着かせる方法（散歩、メモを書くなど）をそれぞれ決めておき、落ち着いてから話してみましょう。",
    },
    zh: {
      title: "深度共情的两颗心",
      summary: "两人都重视亲密，因此爱意表达丰富，也能深刻体会彼此的感受。但当两人的焦虑同时升高时，没有人能让局面平静下来，情绪容易被放大。",
      conflict: "一方的失落会触发另一方的不安，双方同时寻求确认，情绪逐渐升级，这一模式可能反复出现。",
      tip: "各自约定一种让自己平静下来的方法（散步、写下来等），在向对方确认之前先使用它，平静之后再沟通。",
    },
    es: {
      title: "Dos corazones muy sintonizados",
      summary: "Ambos valoran la cercanía, por lo que el afecto fluye con facilidad y se comprenden profundamente. Sin embargo, cuando la ansiedad de los dos sube a la vez, nadie ayuda a calmar la situación y las emociones tienden a amplificarse.",
      conflict: "La decepción de uno puede activar la ansiedad del otro, y ambos buscan confirmación al mismo tiempo mientras las emociones se intensifican.",
      tip: "Elijan cada uno una forma de calmarse (un paseo, escribir lo que sienten) antes de pedir confirmación al otro, y hablen cuando estén más tranquilos.",
    },
  },
  "avoidant-avoidant": {
    base: 62,
    ko: {
      title: "존중 속의 평행선",
      summary: "두 사람 모두 개인 공간과 자율성을 중시해 서로에게 부담을 주지 않는 편안한 조합입니다. 다만 감정을 드러내는 일이 적어, 시간이 지나며 정서적 연결이 약해질 수 있습니다.",
      conflict: "갈등이 생기면 두 사람 모두 대화를 피하고 각자의 시간으로 물러나, 문제가 해결되지 않은 채 쌓이는 패턴이 반복될 수 있습니다.",
      tip: "일주일에 한 번, 짧게라도 '이번 주에 느낀 감정 한 가지'를 서로 말하는 시간을 만들어 보세요.",
    },
    en: {
      title: "Parallel Lines of Respect",
      summary: "Both partners value personal space and autonomy, making this a comfortable match where neither feels pressured. However, because feelings are seldom expressed, the emotional connection can weaken over time.",
      conflict: "When conflict arises, both tend to avoid the conversation and retreat into their own time, so unresolved issues quietly pile up.",
      tip: "Once a week, take a few minutes to each share one feeling you had that week.",
    },
    ja: {
      title: "尊重し合う平行線",
      summary: "二人とも個人の空間と自律性を重視するため、互いに負担をかけない気楽な組み合わせです。ただし感情を表に出すことが少ないため、時間とともに情緒的なつながりが弱まることがあります。",
      conflict: "対立が起きると二人とも話し合いを避けてそれぞれの時間に引きこもり、問題が解決されないまま積み重なるパターンが繰り返されることがあります。",
      tip: "週に一度、短くても「今週感じた気持ちを一つ」伝え合う時間を作ってみましょう。",
    },
    zh: {
      title: "相互尊重的平行线",
      summary: "两人都重视个人空间与自主性，彼此不会给对方压力，相处轻松自在。但由于很少表露情感，情感连结可能会随着时间推移而减弱。",
      conflict: "出现冲突时，两人都倾向回避沟通、各自退回独处，问题未解决便不断累积，这一模式可能反复出现。",
      tip: "每周安排一次简短的时间，各自分享“这周感受到的一种情绪”。",
    },
    es: {
      title: "Paralelas con respeto",
      summary: "Ambos valoran el espacio personal y la autonomía, por lo que es una combinación cómoda en la que nadie se siente presionado. Sin embargo, al expresar pocas emociones, el vínculo emocional puede debilitarse con el tiempo.",
      conflict: "Cuando surge un conflicto, ambos tienden a evitar la conversación y a refugiarse en su propio tiempo, y los problemas sin resolver se acumulan.",
      tip: "Una vez por semana, dediquen unos minutos a compartir cada uno una emoción que sintieron esa semana.",
    },
  },
  "anxious-avoidant": {
    base: 55,
    ko: {
      title: "다가감과 물러섬의 반복",
      summary: "불안형은 가까워지려 할수록, 회피형은 거리를 두려 할수록 서로의 애착 반응을 자극하는 조합입니다. 서로에게 강하게 끌리기 쉽지만, 각자의 패턴을 이해하고 조율하는 노력이 관계의 안정에 큰 차이를 만듭니다.",
      conflict: "불안형이 연락과 확인을 늘리면 회피형은 부담을 느껴 물러나고, 그 거리감이 다시 불안형의 추격을 키우는 추격–회피 사이클이 반복될 수 있습니다.",
      tip: "회피형은 거리가 필요할 때 '1시간만 쉬고 다시 이야기하자'처럼 돌아올 시점을 말해 주고, 불안형은 그 시간 동안 연락을 기다리는 연습을 해 보세요.",
    },
    en: {
      title: "The Dance of Pursuit and Retreat",
      summary: "The more the anxious partner seeks closeness and the more the avoidant partner seeks distance, the more each triggers the other's attachment responses. The pull between them can be strong, and understanding and adjusting to each other's patterns makes a real difference in the relationship's stability.",
      conflict: "As the anxious partner reaches out more, the avoidant partner feels pressured and withdraws, and that distance fuels further pursuit, creating a pursue-withdraw cycle.",
      tip: "When the avoidant partner needs space, they can name a return time, like \"Let's take an hour and talk again.\" The anxious partner can practice waiting through that time without reaching out.",
    },
    ja: {
      title: "近づきと離れの繰り返し",
      summary: "不安型が近づこうとするほど、回避型が距離を取ろうとするほど、互いの愛着反応を刺激し合う組み合わせです。強く惹かれ合いやすい一方で、それぞれのパターンを理解して歩み寄る努力が関係の安定に大きな違いをもたらします。",
      conflict: "不安型が連絡や確認を増やすと回避型は負担を感じて距離を取り、その距離がさらに不安型の追いかけを強める「追跡―回避」のサイクルが繰り返されることがあります。",
      tip: "回避型は距離が必要なとき「1時間休んでからまた話そう」と戻るタイミングを伝え、不安型はその間連絡を待つ練習をしてみましょう。",
    },
    zh: {
      title: "靠近与退后的循环",
      summary: "焦虑型越想靠近，回避型越想保持距离，双方的依恋反应会相互触发。两人往往彼此强烈吸引，而理解并调整各自的模式，会对关系的稳定带来很大差别。",
      conflict: "焦虑型增加联系和确认时，回避型会感到压力而后退，这种距离感又进一步加剧焦虑型的追逐，形成“追逐—回避”循环。",
      tip: "回避型需要空间时，可以说明何时回来，例如“我们休息一小时再聊”；焦虑型则练习在这段时间里耐心等待，不去催促联系。",
    },
    es: {
      title: "Entre acercarse y alejarse",
      summary: "Cuanto más busca cercanía la persona ansiosa y más distancia la evitativa, más se activan mutuamente sus respuestas de apego. La atracción entre ambos suele ser intensa, y comprender y ajustar los patrones de cada uno marca una gran diferencia en la estabilidad de la relación.",
      conflict: "Cuando la persona ansiosa aumenta el contacto, la evitativa se siente presionada y se aleja, y esa distancia alimenta aún más la búsqueda, creando un ciclo de persecución y retirada.",
      tip: "Cuando la persona evitativa necesite espacio, puede indicar cuándo volverá: \"Tomemos una hora y hablamos de nuevo\". La persona ansiosa puede practicar esperar ese tiempo sin escribir.",
    },
  },
  "anxious-disorganized": {
    base: 52,
    ko: {
      title: "같은 상처를 이해하는 사이",
      summary: "두 사람 모두 관계에서 버려짐에 대한 두려움을 느끼기 쉬워, 서로의 불안을 누구보다 잘 이해하는 조합입니다. 다만 혼란형이 다가왔다 물러서는 모습이 불안형의 걱정을 자극해 감정 기복이 커질 수 있습니다.",
      conflict: "불안형이 확신을 구할 때 혼란형이 압박을 느껴 갑자기 거리를 두고, 그 모습이 불안형을 더 불안하게 만드는 패턴이 반복될 수 있습니다.",
      tip: "감정이 흔들릴 때 바로 결론 내리지 말고, '오늘 느낀 것'과 '바라는 것'을 한 문장씩 적어 차분할 때 나눠 보세요.",
    },
    en: {
      title: "Sharing the Same Old Wounds",
      summary: "Both partners are prone to fearing abandonment, so they understand each other's anxiety better than most. However, the disorganized partner's approach-and-retreat pattern can trigger the anxious partner's worries and intensify emotional swings.",
      conflict: "When the anxious partner seeks reassurance, the disorganized partner may feel pressured and suddenly pull away, which leaves the anxious partner even more unsettled.",
      tip: "When emotions waver, avoid drawing conclusions right away. Each write one sentence on what you felt and one on what you want, and share them when you're calm.",
    },
    ja: {
      title: "同じ傷を分かり合う二人",
      summary: "二人とも関係の中で見捨てられる不安を感じやすく、互いの不安を誰よりも理解できる組み合わせです。ただし混乱型の近づいては離れる様子が不安型の心配を刺激し、感情の起伏が大きくなることがあります。",
      conflict: "不安型が確信を求めると混乱型がプレッシャーを感じて急に距離を取り、その姿が不安型をさらに不安にさせるパターンが繰り返されることがあります。",
      tip: "気持ちが揺れたときはすぐに結論を出さず、「今日感じたこと」と「望むこと」を一文ずつ書き、落ち着いたときに伝え合ってみましょう。",
    },
    zh: {
      title: "懂得同样伤痛的两人",
      summary: "两人都容易在关系中害怕被抛弃，因此比任何人都更能理解彼此的不安。但混乱型时近时远的表现，可能触发焦虑型的担忧，使情绪起伏加大。",
      conflict: "焦虑型寻求确定感时，混乱型可能感到压力而突然拉开距离，这又让焦虑型更加不安，这一模式可能反复出现。",
      tip: "情绪波动时不要急于下结论，各自写下一句“今天的感受”和一句“我的期待”，等平静后再分享。",
    },
    es: {
      title: "Dos que entienden la misma herida",
      summary: "Ambos tienden a temer el abandono, por lo que comprenden la ansiedad del otro mejor que nadie. Sin embargo, el patrón de acercamiento y retirada de la persona desorganizada puede activar las preocupaciones de la ansiosa e intensificar los altibajos emocionales.",
      conflict: "Cuando la persona ansiosa busca seguridad, la desorganizada puede sentirse presionada y alejarse de repente, lo que inquieta aún más a la ansiosa.",
      tip: "Cuando las emociones se agiten, eviten sacar conclusiones de inmediato. Escriban cada uno una frase sobre lo que sintieron y otra sobre lo que desean, y compártanlas con calma.",
    },
  },
  "avoidant-disorganized": {
    base: 52,
    ko: {
      title: "조심스러운 거리 두기",
      summary: "두 사람 모두 친밀함에 어느 정도 경계심을 가지고 있어, 서로의 거리를 존중하는 데 익숙한 조합입니다. 다만 혼란형이 가까워지길 원할 때 회피형이 물러서면, 혼란형의 상처와 혼란이 커질 수 있습니다.",
      conflict: "갈등 상황에서 회피형은 침묵으로, 혼란형은 다가갔다 물러서기를 반복하며 대응해, 서로의 의도를 오해하는 패턴이 생기기 쉽습니다.",
      tip: "갈등 후 하루 안에 '아까 내가 그렇게 반응한 이유는 ~였어'라고 짧게 설명하는 습관을 함께 만들어 보세요.",
    },
    en: {
      title: "A Careful Kind of Distance",
      summary: "Both partners hold some wariness toward closeness, so they're used to respecting each other's space. However, when the disorganized partner wants to come closer and the avoidant partner withdraws, the disorganized partner's hurt and confusion can grow.",
      conflict: "In conflict, the avoidant partner tends to go silent while the disorganized partner alternates between approaching and retreating, making it easy to misread each other's intentions.",
      tip: "Build a habit of briefly explaining yourself within a day of a conflict, such as \"The reason I reacted that way earlier was...\"",
    },
    ja: {
      title: "慎重な距離の取り方",
      summary: "二人とも親密さにある程度の警戒心を持っているため、互いの距離を尊重することに慣れている組み合わせです。ただし混乱型が近づきたいときに回避型が離れると、混乱型の傷つきや混乱が大きくなることがあります。",
      conflict: "対立の場面で回避型は沈黙で、混乱型は近づいては離れることで対応し、互いの意図を誤解するパターンが生じやすくなります。",
      tip: "対立のあと一日以内に「さっきああ反応したのは〜だったから」と短く説明する習慣を一緒に作ってみましょう。",
    },
    zh: {
      title: "小心翼翼的距离",
      summary: "两人都对亲密抱有一定的戒心，因此习惯于尊重彼此的距离。但当混乱型想要靠近而回避型选择后退时，混乱型的受伤感与困惑可能会加深。",
      conflict: "冲突时，回避型倾向沉默，混乱型则在靠近与退后之间反复，容易误解彼此的意图。",
      tip: "一起养成在冲突后一天内简短解释的习惯，例如“刚才我那样反应，是因为……”。",
    },
    es: {
      title: "Una distancia cuidadosa",
      summary: "Ambos mantienen cierta cautela ante la cercanía, por lo que están acostumbrados a respetar el espacio del otro. Sin embargo, cuando la persona desorganizada quiere acercarse y la evitativa se retira, pueden crecer la herida y la confusión de la primera.",
      conflict: "En los conflictos, la persona evitativa tiende al silencio mientras la desorganizada alterna entre acercarse y alejarse, lo que facilita malinterpretar las intenciones del otro.",
      tip: "Creen juntos el hábito de explicarse brevemente dentro del día siguiente a un conflicto: \"Reaccioné así antes porque...\".",
    },
  },
  "disorganized-disorganized": {
    base: 48,
    ko: {
      title: "함께 배워가는 신뢰",
      summary: "두 사람 모두 친밀함을 원하면서도 두려워하는 마음을 함께 가지고 있어, 서로의 복잡한 감정을 깊이 이해할 수 있는 조합입니다. 감정 기복이 겹치면 관계가 불안정해지기 쉽지만, 함께 안정감을 쌓아가는 경험은 두 사람 모두에게 큰 회복이 될 수 있습니다.",
      conflict: "한 사람이 다가갈 때 다른 사람이 물러서고, 그 반대도 일어나면서 관계의 온도가 자주 크게 바뀌는 패턴이 반복될 수 있습니다.",
      tip: "매일 같은 시간에 짧은 안부를 주고받는 작은 루틴을 정해, 감정과 상관없이 유지되는 연결고리를 만들어 보세요.",
    },
    en: {
      title: "Learning to Trust Together",
      summary: "Both partners want closeness yet fear it, so they can deeply understand each other's complicated feelings. Overlapping emotional swings can make the relationship unstable, but building security together can be profoundly healing for both.",
      conflict: "As one approaches the other withdraws, and vice versa, so the emotional temperature of the relationship often shifts sharply.",
      tip: "Set a small routine of checking in at the same time each day, creating a connection that holds regardless of mood.",
    },
    ja: {
      title: "共に育む信頼",
      summary: "二人とも親密さを求めながらも恐れる気持ちを抱えているため、互いの複雑な感情を深く理解できる組み合わせです。感情の起伏が重なると関係が不安定になりやすいものの、共に安心感を築いていく経験は二人にとって大きな回復になり得ます。",
      conflict: "一方が近づくともう一方が離れ、その逆も起こることで、関係の温度が頻繁に大きく変わるパターンが繰り返されることがあります。",
      tip: "毎日同じ時間に短い声かけを交わす小さな習慣を決め、気分に関係なく続くつながりを作ってみましょう。",
    },
    zh: {
      title: "一起学习信任",
      summary: "两人都既渴望亲密又害怕亲密，因此能深刻理解彼此复杂的情感。情绪起伏重叠时关系容易不稳定，但一起建立安全感的经历，对双方都可能是很大的疗愈。",
      conflict: "一方靠近时另一方后退，反之亦然，关系的温度常常大幅变化，这一模式可能反复出现。",
      tip: "约定每天在固定时间简短问候的小习惯，建立一条不受情绪影响的连结。",
    },
    es: {
      title: "Aprender a confiar juntos",
      summary: "Ambos desean la cercanía y a la vez la temen, por lo que pueden comprender a fondo los sentimientos complejos del otro. Los altibajos compartidos pueden volver inestable la relación, pero construir seguridad juntos puede ser profundamente reparador para los dos.",
      conflict: "Cuando uno se acerca el otro se aleja, y viceversa, por lo que la temperatura emocional de la relación cambia con frecuencia y de forma brusca.",
      tip: "Establezcan una pequeña rutina de saludarse cada día a la misma hora, creando un vínculo que se mantenga sin importar el estado de ánimo.",
    },
  },
};

export const DUO_TIERS: Record<Lang, { high: string; good: string; effort: string; learn: string }> = {
  ko: {
    high: "안정적인 조합",
    good: "잘 맞춰갈 수 있는 조합",
    effort: "서로 노력이 필요한 조합",
    learn: "서로를 많이 배워야 하는 조합",
  },
  en: {
    high: "A naturally steady match",
    good: "A match that grows well together",
    effort: "A match that takes conscious effort",
    learn: "A match with a lot to learn from each other",
  },
  ja: {
    high: "安定した組み合わせ",
    good: "うまく歩み寄れる組み合わせ",
    effort: "互いの努力が必要な組み合わせ",
    learn: "互いに多くを学び合う組み合わせ",
  },
  zh: {
    high: "稳定的组合",
    good: "能够彼此磨合的组合",
    effort: "需要双方努力的组合",
    learn: "需要彼此多多学习的组合",
  },
  es: {
    high: "Una combinación naturalmente estable",
    good: "Una combinación que crece bien junta",
    effort: "Una combinación que requiere esfuerzo consciente",
    learn: "Una combinación con mucho que aprender mutuamente",
  },
};

function pairKey(x: AttachmentAxis, y: AttachmentAxis): DuoPairKey {
  return [x, y].sort().join("-") as DuoPairKey;
}

function tierFor(score: number, lang: Lang): string {
  const t = DUO_TIERS[lang];
  if (score >= 85) return t.high;
  if (score >= 70) return t.good;
  if (score >= 55) return t.effort;
  return t.learn;
}

export function computeDuo(aCode: string, bCode: string, lang: Lang) {
  const a = getAttachmentTypeByCode(aCode);
  const b = getAttachmentTypeByCode(bCode);
  if (!a || !b) return null;

  const entry = DUO_PAIRS[pairKey(a.primaryAxis, b.primaryAxis)];
  let score = entry.base;
  if (a.ko.bestMatch.code === bCode || b.ko.bestMatch.code === aCode) score += 6;
  if (a.ko.worstMatch.code === bCode || b.ko.worstMatch.code === aCode) score -= 6;
  if (a.secondaryAxis === "secure" || b.secondaryAxis === "secure") score += 3;
  score = Math.min(97, Math.max(45, score));

  return { score, tier: tierFor(score, lang), pair: entry[lang], a, b };
}

// Keeps Hangul, Latin letters, digits, spaces, Japanese kana and CJK ideographs.
const NICKNAME_DISALLOWED = /[^\p{Script=Hangul}A-Za-z0-9 \p{Script=Hiragana}\p{Script=Katakana}ー\p{Script=Han}]/gu;

export function sanitizeNickname(raw: string | null): string {
  if (raw === null) return "";
  const cleaned = raw.trim().replace(NICKNAME_DISALLOWED, "");
  return Array.from(cleaned).slice(0, 10).join("").trim();
}
