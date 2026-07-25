"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NEUTRAL_THEME, type Lang } from "@/data/attachment-types";
import LanguageSwitcher, { getStoredLang } from "@/components/LanguageSwitcher";

export type AttachmentAxis = "secure" | "anxious" | "avoidant" | "disorganized";
// "neutral" (the N tag from the v3 question set) never contributes to
// S/A/V/D scoring — it only feeds the hidden-result check.
type AnswerAxis = AttachmentAxis | "neutral";

type LocalizedText = Record<Lang, string>;
type Option = { label: LocalizedText; axis: AnswerAxis };
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

// 20-question set from attachment-questions-v3.md — each question has 5
// options tagged S(secure)/A(anxious)/V(avoidant)/D(disorganized)/N(neutral).
// N never contributes to axis scoring; it only feeds the hidden-result path
// in scoreAnswers. Q11-20 carry extra weight for tie-breaking (see below).
const QUESTIONS: Question[] = [
  {
    question: {
      ko: "소개팅 상대가 \"10분 늦을 것 같아요ㅠㅠ\"라고 연락했다. 기다리는 동안 나는?",
      en: "Your blind date texts, \"I might be 10 min late, sorry 😭\" While you wait, you...",
      ja: "合コン相手から「10分くらい遅れそうです…泣」と連絡が来た。待っている間、あなたは?",
      zh: "相亲对象发来消息\"可能要迟到10分钟了(´；ω；`)\"。等待的这段时间，你会?",
      es: "Tu cita a ciegas te escribe: \"Creo que llegaré 10 min tarde, perdón 😭\" Mientras esperas, tú...",
    },
    options: [
      { label: { ko: "\"천천히 오세요~\" 보내고 먼저 자리 잡고 여유롭게 기다린다", en: "Text back \"Take your time~\", grab a seat, and wait it out with zero stress", ja: "「ゆっくりでいいよ〜」と返して、先に席を取って余裕で待つ", zh: "回一句\"慢慢来~\"，先找位置坐好，从容地等", es: "Respondes \"tranquilo/a, sin prisa~\", buscas mesa y esperas relajado/a" }, axis: "secure" },
      { label: { ko: "혹시 나오기 싫어서 그러는 건 아닐까, 계속 신경 쓰인다", en: "Can't stop wondering if they're secretly trying to bail on you", ja: "もしかして会いたくなくてそうしてるのかもと、ずっと気になる", zh: "会不会是不想出来才这样的啊，一直忍不住多想", es: "No puedes dejar de pensar si en realidad no quiere venir" }, axis: "anxious" },
      { label: { ko: "답장은 \"네\" 한 글자. 늦으면 늦는 거지, 별 감흥 없다", en: "Reply with just \"Ok.\" Late is late — no big feelings about it", ja: "返信は「了解」の一言。遅れるなら遅れるでいい、特に何も感じない", zh: "只回一个\"嗯\"字。迟到就迟到呗，没什么特别感觉", es: "Respondes solo \"ok\". Si llega tarde, llega tarde — no te afecta mucho" }, axis: "avoidant" },
      { label: { ko: "설렘과 \"그냥 집에 갈까\" 사이를 벌써 세 번쯤 오갔다", en: "Have already swung between butterflies and \"should I just go home\" three times", ja: "ときめきと「もう帰ろうかな」の間をもう3回くらい行き来している", zh: "心动和\"要不干脆回家算了\"之间已经反复了三次", es: "Ya pasaste tres veces entre la emoción y \"mejor me voy a casa\"" }, axis: "disorganized" },
      { label: { ko: "폰 보면서 별생각 없이 기다림", en: "Just wait while scrolling your phone, not thinking much of it", ja: "スマホを見ながら特に何も考えず待つ", zh: "看着手机，没什么特别想法地等着", es: "Esperas mirando el celular, sin pensar mucho en nada" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "썸 타는 사람이 6시간째 답장이 없다. 나의 속마음은?",
      en: "The person you're \"talking to\" hasn't texted back in 6 hours. What's going on in your head?",
      ja: "気になっている人から6時間も返信がない。本音は?",
      zh: "暧昧对象已经6个小时没回消息了。你的内心os是?",
      es: "Llevas 6 horas sin recibir respuesta de esa persona con la que tienes algo. ¿Qué piensas de verdad?",
    },
    options: [
      { label: { ko: "바쁜가 보다 하고 내 할 일 한다. 정 궁금하면 그냥 전화하면 되고", en: "They're probably busy — you go about your day. If you really want to know, you can just call", ja: "忙しいんだろうなと思って自分のことをする。気になったら電話すればいいし", zh: "大概是在忙吧，继续做自己的事。真想知道的话打个电话就好", es: "Debe estar ocupado/a, sigues con lo tuyo. Si de verdad quieres saber, simplemente llamas" }, axis: "secure" },
      { label: { ko: "6시간 동안 대화창을 12번쯤 다시 읽었다", en: "You've reread the chat about 12 times in those 6 hours", ja: "6時間の間に会話画面を12回くらい読み返した", zh: "这6个小时里把聊天记录翻来覆去看了大概12遍", es: "En esas 6 horas releíste el chat como 12 veces" }, axis: "anxious" },
      { label: { ko: "서운하지만 절대 티 안 낸다. 나도 하루 정도 잠수 탈까 생각 중", en: "It stings, but you'd never show it. Half-thinking about going quiet for a day yourself", ja: "寂しいけど絶対に態度に出さない。自分も1日くらい既読無視しようか考え中", zh: "有点失落但绝对不表现出来。甚至在考虑要不要自己也消失一天", es: "Te duele, pero jamás lo demuestras. Hasta piensas en desaparecer tú también por un día" }, axis: "avoidant" },
      { label: { ko: "신경 안 쓰려고 폰을 엎어놨는데 1분마다 다시 뒤집어 보고 있다", en: "Flipped your phone face-down to stop checking it, then flip it back over every minute", ja: "気にしないようにスマホを伏せたのに、1分おきにまたひっくり返して見ている", zh: "为了不去在意把手机扣在桌上，结果每隔一分钟又忍不住翻过来看", es: "Pusiste el celular boca abajo para no pensarlo, pero lo volteas cada minuto para mirarlo" }, axis: "disorganized" },
      { label: { ko: "답장이 안 온 것도 몰랐다", en: "Didn't even notice they hadn't replied", ja: "返信が来てないことにも気づいてなかった", zh: "根本没注意到对方还没回消息", es: "Ni siquiera notaste que no te había respondido" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "좋아하는 사람이 생겼다. 나의 첫 행동은?",
      en: "You've caught feelings for someone. Your first move?",
      ja: "好きな人ができた。あなたの最初の行動は?",
      zh: "有了喜欢的人。你的第一反应是?",
      es: "Te empezó a gustar alguien. ¿Tu primera reacción?",
    },
    options: [
      { label: { ko: "티를 낸다. 아니, 대놓고 말한다. \"나 너한테 관심 있어\"", en: "Make it obvious. Actually, just say it outright: \"I'm into you\"", ja: "態度に出す。いや、はっきり言う。「私、あなたに興味あるんだけど」", zh: "表现出来。不，直接说出口：\"我对你有意思\"", es: "Lo dejas ver claramente. Es más, se lo dices directo: \"me gustas\"" }, axis: "secure" },
      { label: { ko: "그 사람의 SNS 3년 치를 정독하고, 좋아하는 것들을 조용히 외운다", en: "Read three years deep into their social media and quietly memorize everything they like", ja: "その人のSNSを3年分読み込んで、好きなものをこっそり全部覚える", zh: "把对方三年份的社交媒体都仔细看完，默默记住对方喜欢的东西", es: "Lees a fondo 3 años de sus redes sociales y memorizas en silencio todo lo que le gusta" }, axis: "anxious" },
      { label: { ko: "오히려 더 퉁명스럽게 대한다. 근데 그 사람 앞에서만 자꾸 챙겨주게 됨", en: "Act even blunter than usual — but somehow you're always looking out for them", ja: "むしろもっとぶっきらぼうに接する。でもなぜかその人の前でだけ世話を焼いてしまう", zh: "反而表现得更生硬。但不知为何只有在对方面前会不自觉地照顾对方", es: "Actúas incluso más brusco de lo normal, pero solo con esa persona terminas cuidando cada detalle" }, axis: "avoidant" },
      { label: { ko: "확 다가갔다가, 다음 날엔 식은 척한다. 나도 내 마음을 모르겠다", en: "Go all in one day, act cold the next. Even you don't know your own heart", ja: "グッと近づいたと思ったら、次の日には冷めたふりをする。自分の気持ちすらわからない", zh: "猛地靠近，第二天又装作冷淡。连自己的心意都搞不清楚", es: "Te acercas de golpe un día, al siguiente actúas frío. Ni tú mismo entiendes lo que sientes" }, axis: "disorganized" },
      { label: { ko: "좋아하는 감정인지 확신이 없어서 그냥 지켜본다", en: "Not even sure if it's a crush, so you just watch and wait", ja: "好きという感情なのか確信が持てなくて、とりあえず様子を見る", zh: "不确定这是不是喜欢的感觉，所以就先观察着", es: "No estás seguro si es que te gusta, así que solo observas" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "연인에게 \"우리 얘기 좀 해\"라는 카톡이 왔다. 나의 반응은?",
      en: "Your partner texts \"we need to talk.\" Your reaction?",
      ja: "恋人から「ちょっと話がある」というLINEが来た。あなたの反応は?",
      zh: "恋人发来消息说\"我们聊聊吧\"。你的反应是?",
      es: "Tu pareja te escribe \"tenemos que hablar\". ¿Tu reacción?",
    },
    options: [
      { label: { ko: "바로 전화 걸어서 \"무슨 일이야, 지금 말해\" — 미루는 게 더 싫다", en: "Call them right away — \"What's up, tell me now.\" Waiting is worse", ja: "すぐ電話をかけて「何かあったの、今言って」— 先延ばしにされる方が嫌だ", zh: "立刻打电话过去：\"怎么了，现在说吧\"——拖延更让人难受", es: "La llamas de inmediato: \"¿qué pasó? dime ahora\" — esperar es peor" }, axis: "secure" },
      { label: { ko: "심장이 내려앉는다. 내가 뭘 잘못했는지 하루 종일 복기한다", en: "Your stomach drops. You spend the whole day replaying what you might've done wrong", ja: "心臓が落ちる。自分が何を間違えたのか一日中振り返る", zh: "心一下子沉下去。一整天都在反复回想自己是不是哪里做错了", es: "Se te cae el estómago. Pasas todo el día repasando qué pudiste haber hecho mal" }, axis: "anxious" },
      { label: { ko: "\"그래\" 하고 최대한 감정을 지운 채 마음의 방어벽부터 세운다", en: "Reply \"ok\" and immediately build up your emotional walls", ja: "「うん」と返し、できるだけ感情を消して先に心の防御壁を作る", zh: "回一句\"好\"，然后尽量收起情绪，先在心里筑起防线", es: "Respondes \"ok\" y de inmediato levantas tus defensas emocionales" }, axis: "avoidant" },
      { label: { ko: "최악의 시나리오를 상상하다가 \"차라리 내가 먼저 끝내?\"까지 간다", en: "Imagine every worst-case scenario, until you're thinking \"should I just end it first?\"", ja: "最悪のシナリオを想像しているうちに「いっそ自分から別れを切り出す?」まで行く", zh: "想着想着就想到了最坏的情况，甚至想\"要不我先提分手？\"", es: "Imaginas el peor escenario posible hasta llegar a pensar \"¿mejor termino yo primero?\"" }, axis: "disorganized" },
      { label: { ko: "무슨 얘긴지 들어봐야 아니까 일단 기다린다", en: "You won't know until you hear it, so you just wait", ja: "何の話か聞いてみないとわからないので、とりあえず待つ", zh: "不听怎么知道是什么事，先等着再说", es: "No sabrás de qué se trata hasta escucharlo, así que solo esperas" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "친한 친구가 내 짝사랑 상대를 좋아한다고 고백해왔다. 나는?",
      en: "A close friend confesses they like the person you've been crushing on. You...",
      ja: "親しい友達が、自分の片思いの相手を好きだと打ち明けてきた。あなたは?",
      zh: "好朋友向你坦白说喜欢你暗恋的人。你会?",
      es: "Tu mejor amigo/a te confiesa que le gusta la persona que a ti te gusta en secreto. Tú...",
    },
    options: [
      { label: { ko: "솔직하게 말한다. \"미안, 사실 나도 그 사람 좋아해\" — 정정당당하게", en: "Say it straight: \"Sorry, but I actually like them too\" — fair and square", ja: "正直に言う。「ごめん、実は私もその人が好きなんだ」— 正々堂々と", zh: "坦诚地说：\"对不起，其实我也喜欢那个人\"——光明正大地说出来", es: "Lo dices con honestidad: \"perdón, pero en realidad a mí también me gusta\" — con toda franqueza" }, axis: "secure" },
      { label: { ko: "내 마음을 숨기고 친구를 응원한다. 그리고 혼자 아파한다", en: "Hide how you feel, cheer your friend on, and quietly hurt on your own", ja: "自分の気持ちを隠して友達を応援する。そして一人で傷つく", zh: "隐藏自己的心意，支持朋友。然后一个人默默难过", es: "Ocultas lo que sientes, apoyas a tu amigo/a, y sufres a solas en silencio" }, axis: "anxious" },
      { label: { ko: "아무 말 안 하고 조용히 그 사람과 거리를 둔다", en: "Say nothing, and quietly put some distance between you and your crush", ja: "何も言わずに、静かにその人と距離を置く", zh: "什么都不说，默默和那个人保持距离", es: "No dices nada, solo te alejas en silencio de esa persona" }, axis: "avoidant" },
      { label: { ko: "응원한다고 해놓고 그날 밤 후회한다. 마음이 하루에도 몇 번씩 뒤집힌다", en: "Tell your friend you support them, then regret it that same night. Your feelings flip several times a day", ja: "応援すると言っておいて、その夜後悔する。気持ちが一日に何度も変わる", zh: "嘴上说着支持，当晚就后悔了。心情一天能反复好几次", es: "Le dices que lo apoyas y esa misma noche te arrepientes. Tus sentimientos cambian varias veces al día" }, axis: "disorganized" },
      { label: { ko: "둘 다 잘됐으면 좋겠다. 진심으로", en: "Genuinely hope it works out for both of them", ja: "二人とも上手くいってほしいと、心から思う", zh: "真心希望他们两个都能顺利", es: "De verdad deseas que a los dos les vaya bien" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "연인과 크게 싸운 날 밤, 나는?",
      en: "The night after a huge fight with your partner, you...",
      ja: "恋人と大喧嘩した日の夜、あなたは?",
      zh: "和恋人大吵一架的那晚，你会?",
      es: "La noche después de una gran pelea con tu pareja, tú...",
    },
    options: [
      { label: { ko: "그날 안에 끝장을 본다. 화해든 결론이든, 넘기고는 못 잔다", en: "Settle it before the day ends — makeup or breakup, you can't sleep on it unresolved", ja: "その日のうちに決着をつける。仲直りでも結論でも、うやむやのまま寝られない", zh: "当天必须搞清楚。和好也好、说清楚也罢，没解决就没法睡", es: "Lo resuelves antes de que acabe el día — reconciliación o ruptura, no puedes dormir sin cerrarlo" }, axis: "secure" },
      { label: { ko: "미안하다고 먼저 연락한다. 내 잘못이 아니어도, 관계가 깨질까 봐", en: "Text an apology first, even if it wasn't your fault, because you're scared the relationship might break", ja: "自分が悪くなくても、関係が壊れるのが怖くて先に謝る連絡をする", zh: "就算不是自己的错，也会先联系道歉，因为害怕关系就此破裂", es: "Escribes pidiendo perdón primero, aunque no sea tu culpa, por miedo a que la relación se rompa" }, axis: "anxious" },
      { label: { ko: "연락 안 하고 혼자 새벽 산책. 이어폰 꽂고 감정을 삭인다", en: "Don't reach out, go for a solo walk at dawn instead, earbuds in, working through it alone", ja: "連絡はせず、一人で明け方の散歩に行く。イヤホンをつけて感情を鎮める", zh: "不联系，一个人去凌晨散步，戴上耳机让情绪慢慢平复", es: "No contactas, sales a caminar solo/a de madrugada con audífonos puestos para procesarlo" }, axis: "avoidant" },
      { label: { ko: "이별 문자를 쓰다 지웠다 반복하다가 결국 새벽에 \"자?\" 하나 보낸다", en: "Write and delete a breakup text over and over, then finally send just \"you up?\" at 4am", ja: "別れのメッセージを書いては消してを繰り返し、結局明け方に「起きてる?」とだけ送る", zh: "反复写了又删分手短信，最后凌晨发了一句\"睡了吗？\"", es: "Escribes y borras un mensaje de ruptura una y otra vez, y al final solo mandas \"¿despierto/a?\" al amanecer" }, axis: "disorganized" },
      { label: { ko: "일단 잔다. 자고 일어나면 서로 괜찮아져 있는 경우가 많더라", en: "Just go to sleep — things are usually fine again after you both wake up", ja: "とりあえず寝る。寝て起きたらお互い落ち着いていることが多い", zh: "先睡觉再说。睡一觉起来往往彼此就都没事了", es: "Simplemente te duermes — casi siempre al despertar ya está todo bien entre ambos" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "회사(학교)에서 부당한 일을 당하는 동료를 봤다. 나는?",
      en: "You see a coworker (or classmate) being treated unfairly. You...",
      ja: "会社(学校)で不当な扱いを受けている同僚を見た。あなたは?",
      zh: "在公司(学校)看到同事受到不公平对待。你会?",
      es: "Ves a un compañero de trabajo (o clase) siendo tratado injustamente. Tú...",
    },
    options: [
      { label: { ko: "그 자리에서 나선다. \"잠깐만요, 그건 아니죠\"", en: "Step in right there — \"Hold on, that's not okay\"", ja: "その場で介入する。「ちょっと待ってください、それは違いますよ」", zh: "当场站出来：\"等一下，这样不对吧\"", es: "Intervienes ahí mismo: \"espera, eso no está bien\"" }, axis: "secure" },
      { label: { ko: "당장은 못 나서도, 나중에 그 동료를 찾아가 편이 되어준다", en: "Can't speak up in the moment, but find that person later to be on their side", ja: "その場では言えなくても、後でその同僚を訪ねて味方になる", zh: "当下没能站出来，但之后会去找那位同事表示支持", es: "No puedes decir nada en el momento, pero luego buscas a esa persona para apoyarla" }, axis: "anxious" },
      { label: { ko: "조용히 증거를 모은다. 나설 때는 확실하게 이길 때", en: "Quietly gather evidence — you only step in when you're sure you'll win", ja: "静かに証拠を集める。動くときは確実に勝てるときだけ", zh: "默默收集证据。要出手就要出手在能赢的时候", es: "Reúnes pruebas en silencio — solo intervienes cuando estás seguro de ganar" }, axis: "avoidant" },
      { label: { ko: "나서고 싶은 마음과 엮이기 싫은 마음이 싸우다가 타이밍을 놓친다", en: "Torn between wanting to help and not wanting to get involved, until the moment passes", ja: "助けたい気持ちと関わりたくない気持ちがせめぎ合い、タイミングを逃す", zh: "想站出来的心情和不想牵扯进去的心情互相拉扯，结果错过了时机", es: "Te debates entre las ganas de ayudar y no querer meterte, hasta que se pasa el momento" }, axis: "disorganized" },
      { label: { ko: "상황을 좀 더 지켜본다. 섣불리 끼어들 문제가 아닐 수도", en: "Watch a bit longer — it might not be your place to jump in", ja: "もう少し状況を見守る。軽々しく口を出す問題ではないかもしれない", zh: "再观察一下情况。也许不是能贸然介入的事", es: "Observas un poco más la situación — puede que no sea algo en lo que debas meterte a la ligera" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "단체 모임에서 나의 포지션은?",
      en: "Your role at a group gathering?",
      ja: "集まりでのあなたのポジションは?",
      zh: "在团体聚会中你的角色是?",
      es: "¿Cuál es tu rol en las reuniones de grupo?",
    },
    options: [
      { label: { ko: "자연스럽게 메뉴, 장소, 일정이 나를 중심으로 정해진다", en: "Menu, place, schedule — it all naturally ends up revolving around you", ja: "自然とメニューや場所、日程があなた中心で決まる", zh: "菜单、地点、时间自然而然都以你为中心来定", es: "El menú, el lugar, el horario — todo termina girando naturalmente en torno a ti" }, axis: "secure" },
      { label: { ko: "다들 나랑 있는 거 재밌나? 눈치 보며 리액션에 최선을 다한다", en: "\"Are they having fun with me?\" — you watch everyone's mood and react your hardest", ja: "みんな自分といて楽しいかな?と顔色をうかがいながらリアクションに全力を尽くす", zh: "大家跟我在一起开心吗？一边看眼色一边拼命做出反应", es: "\"¿Se están divirtiendo conmigo?\" — observas el ambiente y reaccionas dando lo máximo" }, axis: "anxious" },
      { label: { ko: "잘 안 나간다. 나가도 한두 명이랑만 깊은 얘기", en: "Rarely show up. Even when you do, you only go deep with one or two people", ja: "あまり参加しない。参加しても一人二人と深い話をするだけ", zh: "不太出去参加。就算去了也只和一两个人深聊", es: "Casi no vas. Y cuando vas, solo tienes conversaciones profundas con una o dos personas" }, axis: "avoidant" },
      { label: { ko: "텐션 최고로 놀다가, 집 가는 길에 급격한 현타가 온다", en: "Party at max energy, then hit a sudden wave of emptiness on the way home", ja: "テンション最高で遊んだ後、帰り道に急に虚しさが押し寄せる", zh: "玩到情绪最高涨，回家路上却突然涌上一阵空虚", es: "Te diviertes al máximo, y luego te llega una ola repentina de vacío de camino a casa" }, axis: "disorganized" },
      { label: { ko: "그날 컨디션 따라 다르다. 어떤 날은 인싸, 어떤 날은 벽", en: "Depends on your mood that day — sometimes the life of the party, sometimes a wallflower", ja: "その日の調子次第。ある日は輪の中心、ある日は壁の花", zh: "看当天状态而定。有的时候是气氛担当，有的时候像个隐形人", es: "Depende de tu ánimo ese día — a veces el alma de la fiesta, a veces una pared" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "연인 입에서 전 애인 이야기가 나왔다. 나는?",
      en: "Your partner brings up their ex. You...",
      ja: "恋人の口から元恋人の話が出た。あなたは?",
      zh: "恋人提到了前任的话题。你会?",
      es: "Tu pareja menciona a su ex. Tú...",
    },
    options: [
      { label: { ko: "편하게 듣는다. 궁금한 건 그냥 물어보고", en: "Listen easily — and just ask if something's on your mind", ja: "気楽に聞く。気になることはただ聞いてみる", zh: "轻松地听着，好奇的地方就直接问", es: "Escuchas con calma — y si tienes curiosidad, simplemente preguntas" }, axis: "secure" },
      { label: { ko: "웃으며 넘기지만 그날 밤 그 사람 전 연애를 상상하며 뒤척인다", en: "Laugh it off in the moment, but toss and turn that night imagining their past relationship", ja: "笑って流すけど、その夜は相手の過去の恋愛を想像して寝返りを打つ", zh: "当场笑着带过，但那天晚上却想着对方的过去辗转难眠", es: "Te ríes en el momento, pero esa noche das vueltas en la cama imaginando su relación pasada" }, axis: "anxious" },
      { label: { ko: "표정 변화 없음. 근데 그 이름, 잊지 않는다", en: "No change in expression — but you never forget that name", ja: "表情は変わらない。でもその名前は忘れない", zh: "表情毫无变化。但那个名字，你不会忘记", es: "Tu expresión no cambia — pero nunca olvidas ese nombre" }, axis: "avoidant" },
      { label: { ko: "그땐 아무렇지 않았는데, 며칠 뒤에 갑자기 그 얘기로 서운함이 터진다", en: "Felt totally fine at the time, but a few days later the hurt suddenly bursts out over it", ja: "その時は何ともなかったのに、数日後に急にその話で寂しさが爆発する", zh: "当时明明没什么感觉，几天后却突然因为这件事委屈爆发", es: "En el momento no sentiste nada, pero unos días después ese tema te hace estallar de dolor" }, axis: "disorganized" },
      { label: { ko: "과거는 과거일 뿐. 딱히 감흥이 없다", en: "The past is the past — you honestly don't feel much about it", ja: "過去は過去。特に何も感じない", zh: "过去就是过去，确实没什么特别的感觉", es: "El pasado es pasado — la verdad no sientes gran cosa" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "연인이 기념일을 깜빡했다. 나의 대처는?",
      en: "Your partner forgot your anniversary. How do you handle it?",
      ja: "恋人が記念日を忘れていた。あなたの対処法は?",
      zh: "恋人忘记了纪念日。你的应对方式是?",
      es: "Tu pareja olvidó su aniversario. ¿Cómo lo manejas?",
    },
    options: [
      { label: { ko: "바로 말한다. \"너 오늘 무슨 날인지 알아?\" 섭섭함은 즉시 정산", en: "Say it right away — \"Do you know what today is?\" Hurt feelings get settled on the spot", ja: "すぐに言う。「今日が何の日か知ってる?」寂しさはその場で精算する", zh: "立刻说出来：\"你知道今天是什么日子吗？\"委屈当场清算", es: "Lo dices de inmediato: \"¿sabes qué día es hoy?\" — el dolor se resuelve ahí mismo" }, axis: "secure" },
      { label: { ko: "서운하지만 말 못 하고, \"바빴구나~\" 하며 혼자 삭인다", en: "Feel hurt but can't say it, mutter \"guess you were busy~\" and swallow it alone", ja: "寂しいけど言えなくて、「忙しかったんだね〜」と一人で飲み込む", zh: "委屈却说不出口，\"是太忙了吧～\"，一个人默默消化", es: "Te duele pero no lo dices, murmuras \"supongo que estabas ocupado/a~\" y te lo tragas solo/a" }, axis: "anxious" },
      { label: { ko: "\"그런 거 안 챙겨도 돼\" 해놓고 정작 나는 다 준비해놨다", en: "Say \"you don't have to do anything special,\" while secretly having prepared everything yourself", ja: "「そんなの気にしなくていいよ」と言っておきながら、実は自分は全部準備していた", zh: "嘴上说\"不用特意准备也没关系\"，其实自己早就全都准备好了", es: "Dices \"no hace falta que prepares nada especial\", mientras en secreto ya lo tenías todo listo" }, axis: "avoidant" },
      { label: { ko: "괜찮다고 해놓고, 그날 밤부터 답장이 눈에 띄게 싸늘해진다", en: "Say it's fine, then your texts turn noticeably cold starting that night", ja: "大丈夫だと言っておきながら、その夜から返信が目に見えて冷たくなる", zh: "嘴上说没关系，可从那晚起回消息明显变冷淡", es: "Dices que está bien, pero desde esa noche tus respuestas se vuelven notablemente frías" }, axis: "disorganized" },
      { label: { ko: "사실 나도 깜빡했다", en: "Honestly, you forgot too", ja: "実は自分も忘れていた", zh: "其实自己也忘了", es: "La verdad, tú también lo olvidaste" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "새벽 2시, 좋아하는 사람에게 \"자? 나 좀 힘들어\"라고 연락이 왔다. 나는?",
      en: "2am, and the person you like texts, \"you up? I'm not doing great.\" You...",
      ja: "深夜2時、好きな人から「起きてる? ちょっとつらくて」と連絡が来た。あなたは?",
      zh: "凌晨2点，喜欢的人发来消息\"睡了吗？我有点难受\"。你会?",
      es: "Son las 2am y la persona que te gusta te escribe: \"¿despierto/a? no la estoy pasando bien\". Tú...",
    },
    options: [
      { label: { ko: "\"지금 나갈게. 어디야\" — 위로는 얼굴 보고 하는 것", en: "\"On my way now. Where are you\" — comfort is best given in person", ja: "「今から行くよ。どこにいるの」— 慰めは顔を見てするもの", zh: "\"我现在就过去，你在哪\"——安慰要当面才算数", es: "\"Voy para allá ahora. ¿Dónde estás?\" — el consuelo se da en persona" }, axis: "secure" },
      { label: { ko: "자다가도 벌떡. 통화 버튼 누르는 데 3초 안 걸린다", en: "Bolt awake instantly. Takes under 3 seconds to hit the call button", ja: "寝ていてもガバッと起きる。通話ボタンを押すのに3秒もかからない", zh: "睡着了也会猛地惊醒，按下拨号键不到3秒", es: "Te despiertas de golpe. No tardas ni 3 segundos en presionar el botón de llamada" }, axis: "anxious" },
      { label: { ko: "\"무슨 일인데\" 무뚝뚝하게 답하면서 이미 옷 입는 중", en: "Reply bluntly, \"what's wrong,\" while already getting dressed", ja: "「どうしたの」とぶっきらぼうに答えながら、もう服を着替えている", zh: "嘴上冷淡地回\"怎么了\"，身体却已经在穿衣服了", es: "Respondes cortante \"¿qué pasó?\" mientras ya te estás vistiendo" }, axis: "avoidant" },
      { label: { ko: "달려가고 싶은데 부담될까 봐, 답장을 썼다 지웠다만 반복한다", en: "Want to rush over but worry it'll feel like too much, so you write and delete replies over and over", ja: "駆けつけたいのに負担になるかもと思って、返信を書いては消してを繰り返す", zh: "想立刻冲过去又怕给对方压力，回复写了又删反复好几次", es: "Quieres ir corriendo pero temes que sea demasiado, así que escribes y borras la respuesta una y otra vez" }, axis: "disorganized" },
      { label: { ko: "아침에 확인했다... 미안함에 아침밥을 산다", en: "Saw it in the morning... and buy them breakfast out of guilt", ja: "朝に気づいた…申し訳なくて朝ごはんをおごる", zh: "早上才看到消息……愧疚之下请对方吃早饭", es: "Lo viste por la mañana... y le invitas el desayuno por la culpa" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "마음의 확신이 없는 상태에서 고백을 받았다. 나는?",
      en: "Someone confesses to you while you're not sure how you feel. You...",
      ja: "気持ちに確信が持てない状態で告白された。あなたは?",
      zh: "在还没有确定心意的状态下收到了告白。你会?",
      es: "Alguien se te confiesa cuando aún no tienes claro lo que sientes. Tú...",
    },
    options: [
      { label: { ko: "솔직하게 말한다. \"지금은 확신이 없어. 근데 알아가 보고 싶어\"", en: "Say it honestly: \"I'm not sure yet, but I'd like to get to know you\"", ja: "正直に言う。「今は確信がない。でも知っていきたい」", zh: "坦诚地说：\"现在还没有把握，但我想再多了解一下你\"", es: "Lo dices con honestidad: \"ahora mismo no estoy seguro/a, pero me gustaría conocerte más\"" }, axis: "secure" },
      { label: { ko: "거절 못 한다. 상대가 상처받는 게 내가 아픈 것보다 싫다", en: "Can't say no. Them getting hurt feels worse than you getting hurt", ja: "断れない。相手が傷つくことの方が自分が辛いより嫌だ", zh: "无法拒绝。比起自己受伤，更不想让对方受伤", es: "No puedes decir que no. Que la otra persona se lastime te duele más que lastimarte tú mismo/a" }, axis: "anxious" },
      { label: { ko: "생각할 시간을 달라고 한 뒤, 연락을 줄인다", en: "Ask for time to think, then quietly text less", ja: "考える時間が欲しいと言った後、連絡を減らす", zh: "说想要考虑一下时间，然后就减少联系", es: "Pides tiempo para pensarlo, y luego reduces el contacto poco a poco" }, axis: "avoidant" },
      { label: { ko: "그날은 좋다고 해놓고, 다음 날부터 도망가고 싶어진다", en: "Say yes in the moment, then want to run the very next day", ja: "その日はいいよと言っておいて、次の日から逃げたくなる", zh: "当下答应了，可从第二天开始就想逃跑", es: "Dices que sí en el momento, y desde el día siguiente quieres huir" }, axis: "disorganized" },
      { label: { ko: "어떻게 반응할지 정말 모르겠다. 닥쳐봐야 안다", en: "Genuinely don't know how you'll react — you'll only know once it happens", ja: "どう反応すればいいか本当にわからない。直面してみないとわからない", zh: "真的不知道该怎么反应。得真正面对了才会知道", es: "Realmente no sabes cómo vas a reaccionar — solo lo sabrás cuando pase" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "연인이 이성 친구와 새벽까지 연락하는 걸 알게 됐다. 나는?",
      en: "You find out your partner has been texting an opposite-sex friend until dawn. You...",
      ja: "恋人が異性の友達と明け方まで連絡していたことを知った。あなたは?",
      zh: "得知恋人和异性朋友聊天聊到了凌晨。你会?",
      es: "Descubres que tu pareja ha estado chateando hasta el amanecer con un amigo/a del sexo opuesto. Tú...",
    },
    options: [
      { label: { ko: "정면으로 묻는다. \"숨길 거 아니면 나한테 먼저 말했어야지\"", en: "Ask them straight up: \"If it's nothing to hide, you should've told me first\"", ja: "正面から聞く。「隠すことじゃないなら先に言ってくれればよかったのに」", zh: "正面问对方：\"又不是要瞒着我，应该先跟我说一声吧\"", es: "Preguntas directo: \"si no hay nada que ocultar, deberías habérmelo dicho tú primero\"" }, axis: "secure" },
      { label: { ko: "불안하지만 쿨한 척한다. 그리고 그 친구 SNS를 정독한다", en: "Feel anxious but act cool about it, then read that friend's social media closely", ja: "不安だけどクールなふりをする。そしてその友達のSNSを精読する", zh: "心里不安却装作淡定。然后仔仔细细地翻看那位朋友的社交媒体", es: "Te sientes ansioso/a pero actúas con calma, y luego revisas a fondo las redes de esa persona" }, axis: "anxious" },
      { label: { ko: "말은 안 한다. 대신 마음의 문을 조용히 한 칸 닫는다", en: "Say nothing — but quietly close one more door in your heart", ja: "何も言わない。代わりに心の扉を静かに一つ閉じる", zh: "什么都不说。只是默默地在心里又关上一道门", es: "No dices nada — pero en silencio cierras una puerta más en tu corazón" }, axis: "avoidant" },
      { label: { ko: "폭발했다가, 미안하다고 했다가, 또 서운해한다. 감정이 널뛴다", en: "Explode, then apologize, then feel hurt again. Your emotions swing wildly", ja: "爆発したかと思えば謝り、また寂しくなる。感情が乱高下する", zh: "一会儿爆发，一会儿道歉，一会儿又觉得委屈，情绪反复无常", es: "Explotas, luego pides perdón, luego vuelves a sentirte dolido/a. Tus emociones dan vueltas" }, axis: "disorganized" },
      { label: { ko: "연락 상대가 누군지도 관심 없었다", en: "You honestly didn't even care who they were texting", ja: "連絡相手が誰なのかにも興味がなかった", zh: "根本不关心联系的对象是谁", es: "Sinceramente ni te importaba con quién estaba chateando" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "이별 직후의 나와 가장 가까운 모습은?",
      en: "Which is closest to you right after a breakup?",
      ja: "別れた直後のあなたに一番近い姿は?",
      zh: "分手后最贴近你的状态是?",
      es: "¿Cuál se parece más a ti justo después de una ruptura?",
    },
    options: [
      { label: { ko: "힘들지만 질질 끌지 않는다. 끝난 건 끝난 것", en: "It's hard, but you don't drag it out. Over is over", ja: "つらいけどダラダラ引きずらない。終わったものは終わったこと", zh: "虽然难受，但不会拖泥带水。结束了就是结束了", es: "Es duro, pero no lo alargas. Lo que terminó, terminó" }, axis: "secure" },
      { label: { ko: "몇 달이 지나도 그 사람 프로필을 확인하는 나를 발견한다", en: "Months later, you catch yourself still checking their profile", ja: "何ヶ月経ってもその人のプロフィールを確認している自分に気づく", zh: "好几个月过去了，还是会发现自己在偷偷看对方的主页", es: "Meses después, te descubres todavía revisando su perfil" }, axis: "anxious" },
      { label: { ko: "아무렇지 않은 척 완벽하게 지내다가, 노래 하나에 무너진다", en: "Act perfectly fine, until one random song completely breaks you", ja: "何でもないふりを完璧にしていたのに、ある曲一つで崩れる", zh: "表面上完美地装作没事，却在听到某首歌时突然崩溃", es: "Actúas perfectamente bien, hasta que una canción cualquiera te destroza" }, axis: "avoidant" },
      { label: { ko: "재회하자고 연락했다가, 차단했다가, 다시 풀었다가를 반복한다", en: "Text about getting back together, then block them, then unblock — on repeat", ja: "よりを戻そうと連絡したかと思えばブロックし、また解除するのを繰り返す", zh: "联系对方说想复合，然后拉黑，接着又解除拉黑，反复循环", es: "Le escribes para volver, luego lo bloqueas, luego lo desbloqueas — una y otra vez" }, axis: "disorganized" },
      { label: { ko: "이별해본 적이 없거나, 기억이 잘 안 난다", en: "Never really been through a breakup, or you barely remember it", ja: "別れを経験したことがない、もしくはあまり覚えていない", zh: "没怎么经历过分手，或者已经不太记得了", es: "Nunca pasaste por una ruptura de verdad, o casi no lo recuerdas" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "짝사랑했던 사람의 결혼식 청첩장을 받았다. 나는?",
      en: "You get a wedding invitation from someone you used to have a crush on. You...",
      ja: "昔片思いしていた人の結婚式の招待状が届いた。あなたは?",
      zh: "收到了曾经暗恋过的人的结婚请柬。你会?",
      es: "Recibes la invitación de bodas de alguien que te gustó en secreto alguna vez. Tú...",
    },
    options: [
      { label: { ko: "간다. 과거는 과거고, 축하는 축하니까", en: "Go. The past is the past, and congratulations are congratulations", ja: "行く。過去は過去、お祝いはお祝いだから", zh: "去参加。过去归过去，祝福归祝福", es: "Vas. El pasado es pasado, y una felicitación es una felicitación" }, axis: "secure" },
      { label: { ko: "가서 제일 밝게 웃고, 돌아오는 길에 혼자 운다", en: "Go, smile the brightest of anyone there, then cry alone on the way home", ja: "行って一番明るく笑って、帰り道で一人で泣く", zh: "去了，笑得比谁都灿烂，回去的路上却一个人偷偷哭", es: "Vas, sonríes más que nadie, y lloras solo/a de camino a casa" }, axis: "anxious" },
      { label: { ko: "정중히 불참. 축의금만 보낸다", en: "Politely decline, and just send a gift", ja: "丁重に欠席する。ご祝儀だけ送る", zh: "礼貌地推辞不去，只随礼金", es: "Declinas cortésmente y solo envías un regalo" }, axis: "avoidant" },
      { label: { ko: "간다고 했다가 전날 밤 취소했다가, 결국 식장 앞까지 갔다가 돌아온다", en: "Say you'll go, cancel the night before, then end up at the venue's front door and turn back", ja: "行くと言っておいて前日の夜キャンセルし、結局式場の前まで行って引き返す", zh: "说要去，前一晚又取消，最后走到婚礼现场门口又转身回去", es: "Dices que irás, cancelas la noche anterior, y terminas yendo hasta la puerta del salón para luego regresar" }, axis: "disorganized" },
      { label: { ko: "짝사랑의 감정이 이미 다 정리돼서 아무렇지 않다", en: "Already fully over that crush, so it doesn't really faze you", ja: "片思いの気持ちはもう完全に整理がついていて何とも思わない", zh: "暗恋的心情早就整理清楚了，完全没什么感觉", es: "Ya superaste por completo ese amor no correspondido, así que no te afecta en nada" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "나의 약점이나 아픈 과거, 연인에게 언제 말하나?",
      en: "When do you tell a partner about your weaknesses or a painful past?",
      ja: "自分の弱みや辛い過去を、恋人にいつ話すか?",
      zh: "什么时候会跟恋人说自己的弱点或痛苦的过去?",
      es: "¿Cuándo le cuentas a tu pareja sobre tus debilidades o un pasado doloroso?",
    },
    options: [
      { label: { ko: "초반에 먼저 깐다. 이걸 받아들일 수 있는 사람인지가 중요하니까", en: "Early on, upfront — whether they can accept it matters most", ja: "最初に自分から明かす。これを受け入れられる人かどうかが大事だから", zh: "一开始就主动坦白。因为对方能不能接受这一点很重要", es: "Desde el principio, por adelantado — importa mucho si puede aceptarlo" }, axis: "secure" },
      { label: { ko: "상대가 실망할까 봐 최대한 미룬다. 완벽한 모습만 보여주고 싶다", en: "Put it off as long as possible, afraid they'll be disappointed. You want to show only your best side", ja: "相手ががっかりするのが怖くて、できるだけ先延ばしにする。完璧な姿だけ見せたい", zh: "害怕对方失望，尽量拖延。只想展示完美的一面", es: "Lo postergas lo más posible, por miedo a decepcionarlo/a. Quieres mostrar solo tu mejor versión" }, axis: "anxious" },
      { label: { ko: "말 안 한다. 들키기 전까지는. 그게 서로를 위한 거라 믿는다", en: "Don't tell them, not until they find out themselves. You believe it's better for both of you", ja: "言わない。バレるまでは。それがお互いのためだと信じている", zh: "不会说。直到被发现为止。相信这样对彼此都好", es: "No lo dices, no hasta que lo descubra por su cuenta. Crees que es mejor para ambos" }, axis: "avoidant" },
      { label: { ko: "어느 날 갑자기 다 쏟아냈다가, 다음 날 말한 걸 후회한다", en: "Suddenly spill everything one day, then regret saying it the next", ja: "ある日突然全部吐き出して、翌日話したことを後悔する", zh: "某天突然全都倾诉出来，第二天又后悔说出口了", es: "De repente un día lo sueltas todo, y al día siguiente te arrepientes de haberlo dicho" }, axis: "disorganized" },
      { label: { ko: "약점이라고 생각하는 게 딱히 없다", en: "You honestly don't think you have any real weaknesses", ja: "弱みだと思うものが特にない", zh: "并没有觉得自己有什么特别的弱点", es: "Honestamente no sientes que tengas debilidades reales" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "내가 사랑을 표현하는 방식과 가장 가까운 것은?",
      en: "Which is closest to how you express love?",
      ja: "自分の愛情表現の方法に一番近いものは?",
      zh: "最接近你表达爱意方式的是?",
      es: "¿Cuál se parece más a tu forma de expresar amor?",
    },
    options: [
      { label: { ko: "말로 한다. \"좋아해\", \"보고 싶어\" — 아낌없이, 자주", en: "With words. \"I like you,\" \"I miss you\" — freely, often", ja: "言葉で伝える。「好き」「会いたい」— 惜しみなく、頻繁に", zh: "用语言表达。\"喜欢你\"\"想你\"——毫不吝啬，经常说", es: "Con palabras. \"me gustas\", \"te extraño\" — sin reservas, a menudo" }, axis: "secure" },
      { label: { ko: "그 사람의 사소한 말을 다 기억했다가 나중에 이뤄준다", en: "Remember every small thing they say and quietly make it happen later", ja: "その人の些細な言葉を全部覚えておいて、後で叶えてあげる", zh: "把对方随口说的小事都记住，之后偷偷帮对方实现", es: "Recuerdas cada pequeño comentario suyo y luego, en secreto, lo haces realidad" }, axis: "anxious" },
      { label: { ko: "말은 못 하는데, 그 사람 주변의 모든 불편함을 미리 없애 놓는다", en: "Can't say it out loud, but you clear away every discomfort around them ahead of time", ja: "言葉にはできないけど、その人の周りの不便をあらかじめ全部取り除いておく", zh: "说不出口，但会提前把对方周围一切不方便的地方都清理掉", es: "No puedes decirlo en voz alta, pero eliminas de antemano cualquier incomodidad a su alrededor" }, axis: "avoidant" },
      { label: { ko: "확 뜨겁게 표현하다가 갑자기 연락이 뜸해진다. 나도 내 온도를 모르겠다", en: "Go from burning hot to suddenly texting less. Even you don't know your own temperature", ja: "熱く表現していたと思ったら急に連絡が減る。自分でも自分の温度がわからない", zh: "一会儿表达得很炽热，一会儿又突然联系变少。连自己的热度都搞不清楚", es: "Pasas de expresarte con mucha intensidad a de repente escribir menos. Ni tú sabes tu propia temperatura" }, axis: "disorganized" },
      { label: { ko: "표현이 서툴러서 나도 내 방식을 잘 모르겠다", en: "Bad at expressing it — honestly not even sure what your own style is", ja: "表現が下手で、自分のやり方すらよくわからない", zh: "不太擅长表达，自己也不太清楚自己的方式是什么", es: "Se te da mal expresarlo — sinceramente ni sabes cuál es tu propio estilo" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "연인이 갑자기 해외로 가게 됐다. 장거리 연애 위기, 나는?",
      en: "Your partner suddenly has to move abroad — a long-distance crisis. You...",
      ja: "恋人が急に海外に行くことになった。遠距離恋愛の危機、あなたは?",
      zh: "恋人突然要去国外，异地恋危机来了，你会?",
      es: "Tu pareja de repente tiene que irse al extranjero — crisis de relación a distancia. Tú...",
    },
    options: [
      { label: { ko: "\"그래서 우리 어떻게 할 건데\" 현실적인 플랜부터 짠다", en: "\"So what are we going to do about this\" — start with a realistic plan", ja: "「それで私たちどうする?」現実的なプランからまず立てる", zh: "\"那我们要怎么办\"——先制定现实可行的计划", es: "\"Entonces, ¿qué vamos a hacer?\" — empiezas con un plan realista" }, axis: "secure" },
      { label: { ko: "무조건 기다린다. 몇 년이든. 그게 나를 갉아먹더라도", en: "Wait no matter what, even for years, even if it wears you down", ja: "とにかく待つ。何年でも。それが自分をすり減らしても", zh: "无条件地等待。哪怕几年都愿意，就算这会消耗自己", es: "Esperas sin condiciones, aunque sean años, aunque te vaya desgastando" }, axis: "anxious" },
      { label: { ko: "상처받기 전에 내가 먼저 이별을 말한다", en: "Say goodbye first, before you can get hurt", ja: "傷つく前に自分から先に別れを告げる", zh: "在受伤之前，自己先提出分手", es: "Terminas la relación tú primero, antes de que te lastimen" }, axis: "avoidant" },
      { label: { ko: "기다린다고 했다가, 헤어지자고 했다가, 공항 가는 길에도 마음이 바뀐다", en: "Say you'll wait, then say let's break up, and your mind keeps changing even on the way to the airport", ja: "待つと言ったり、別れようと言ったり、空港へ向かう道でも気持ちが変わる", zh: "一会儿说会等，一会儿说分手吧，甚至去机场的路上心意还在变", es: "Dices que esperarás, luego que mejor terminen, y hasta de camino al aeropuerto sigues cambiando de opinión" }, axis: "disorganized" },
      { label: { ko: "닥치면 어떻게든 되지 않을까. 미리 걱정 안 함", en: "Figure it'll work itself out somehow — you don't worry about it in advance", ja: "そのときになれば何とかなるんじゃないか。前もって心配しない", zh: "到时候总会有办法的吧。不提前担心", es: "Cuando llegue el momento, algo se resolverá — no te preocupas de antemano" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "다툰 후, 나의 화해 방식은?",
      en: "After a fight, how do you make up?",
      ja: "喧嘩の後、あなたの仲直りの方法は?",
      zh: "吵架之后，你的和好方式是?",
      es: "Después de una pelea, ¿cómo te reconcilias?",
    },
    options: [
      { label: { ko: "마주 앉아 끝까지 대화한다. 뭐가 문제였는지 정리돼야 끝", en: "Sit face to face and talk it all the way through — it's not over until it's sorted out", ja: "向き合って最後まで話し合う。何が問題だったか整理がつかないと終わらない", zh: "面对面把话说到底。问题不理清楚就不算结束", es: "Se sientan cara a cara y hablan hasta el final — no termina hasta que quede claro cuál fue el problema" }, axis: "secure" },
      { label: { ko: "사실 화해랄 것도 없다. 싸움이 시작되기 전에 내가 먼저 숙이니까", en: "There's honestly not much to \"make up\" — you cave before the fight even really starts", ja: "実は仲直りというほどのこともない。喧嘩が始まる前に自分が先に折れるから", zh: "其实没什么好和好的。因为吵架还没真正开始，自己就已经先低头了", es: "Sinceramente no hay mucho que \"reconciliar\" — cedes antes de que la pelea realmente comience" }, axis: "anxious" },
      { label: { ko: "사과 대신 행동. 좋아하는 음식이 어느새 앞에 놓여 있다", en: "Actions instead of apologies — their favorite food just quietly shows up in front of them", ja: "謝罪の代わりに行動で示す。好きな食べ物がいつの間にか目の前に置かれている", zh: "用行动代替道歉。对方喜欢吃的东西不知不觉就摆在面前了", es: "Acciones en vez de disculpas — su comida favorita aparece frente a ellos sin decir nada" }, axis: "avoidant" },
      { label: { ko: "먼저 연락해놓고, 정작 만나면 또 쏘아붙인다", en: "Reach out first, then end up snapping at them again once you actually meet", ja: "先に連絡しておきながら、実際会うとまたきつく当たってしまう", zh: "先主动联系，可真见了面又忍不住说话带刺", es: "Contactas primero, pero al verse en persona terminas siendo cortante otra vez" }, axis: "disorganized" },
      { label: { ko: "시간이 해결해준다. 며칠 지나면 자연스럽게 풀려 있음", en: "Time handles it — after a few days, things are naturally fine again", ja: "時間が解決してくれる。数日経つと自然と仲直りしている", zh: "时间会解决一切。过几天自然而然就和好了", es: "El tiempo lo resuelve — después de unos días, todo se arregla de forma natural" }, axis: "neutral" },
    ],
  },
  {
    question: {
      ko: "내 인생이 드라마라면, 원하는 마지막 회 엔딩은?",
      en: "If your life were a drama, what final-episode ending would you want?",
      ja: "自分の人生がドラマなら、望む最終回のエンディングは?",
      zh: "如果人生是一部剧，你想要的最后一集结局是?",
      es: "Si tu vida fuera una serie, ¿qué final del último episodio querrías?",
    },
    options: [
      { label: { ko: "모든 걸 이루고 사랑하는 사람 손을 잡고 있는 엔딩", en: "The one where you've achieved everything, holding hands with the person you love", ja: "すべてを成し遂げて、愛する人の手を握っているエンディング", zh: "实现了一切，牵着心爱之人的手的结局", es: "Uno donde lo logras todo, tomado/a de la mano de la persona que amas" }, axis: "secure" },
      { label: { ko: "화려하지 않아도, 한 사람에게 전부였던 사람으로 기억되는 엔딩", en: "An ending where, even without fanfare, you're remembered as someone's everything", ja: "派手じゃなくても、ある一人にとって全てだった人として記憶されるエンディング", zh: "就算不华丽，也想成为被某个人视为全部而被记住的结局", es: "Un final donde, sin necesidad de brillo, te recuerdan como quien lo fue todo para alguien" }, axis: "anxious" },
      { label: { ko: "아무도 몰랐던 내 진심이 마지막에 밝혀지는 엔딩", en: "The one where your true feelings — the ones nobody ever knew about — finally come to light", ja: "誰も知らなかった自分の本心が最後に明かされるエンディング", zh: "谁都不知道的真心，在最后被揭开的结局", es: "Uno donde tu verdadero sentir, que nadie conocía, finalmente sale a la luz" }, axis: "avoidant" },
      { label: { ko: "울다가 웃다가, 마지막까지 장르를 예측할 수 없는 엔딩", en: "One that has you crying, then laughing, genre unpredictable right to the very last scene", ja: "泣いたり笑ったり、最後までジャンルが予測できないエンディング", zh: "哭着笑着，直到最后一刻都无法预测类型的结局", es: "Uno en el que lloras y ríes, con un género imposible de predecir hasta el final" }, axis: "disorganized" },
      { label: { ko: "열린 결말. 해석은 시청자에게", en: "An open ending — let the audience decide what it means", ja: "オープンエンディング。解釈は視聴者に委ねる", zh: "开放式结局。解读交给观众", es: "Un final abierto — que la audiencia decida qué significa" }, axis: "neutral" },
    ],
  },
];

export type AttachmentResult = {
  code: string;
  primaryType: AttachmentAxis | null;
  secondaryType: AttachmentAxis | null;
  primaryPercent: number;
  secondaryPercent: number | null;
  // true when 8+ answers were "neutral" — a separate hidden-result branch,
  // kept out of the existing 16-type data/UI per the v3 brief.
  hidden?: boolean;
};

const PURE_GAP = 5;
const HIDDEN_NEUTRAL_THRESHOLD = 8;
// Q11 onward (0-indexed 10) carry extra weight when the raw S/A/V/D tally
// ties for 1st place, so the tie can still resolve to a single type.
const LATE_QUESTION_START_INDEX = 10;
const LATE_QUESTION_WEIGHT = 1.5;

function countAxes(answers: Option[], weighted: boolean): Record<AttachmentAxis, number> {
  const counts: Record<AttachmentAxis, number> = { secure: 0, anxious: 0, avoidant: 0, disorganized: 0 };
  answers.forEach((a, i) => {
    if (a.axis === "neutral") return;
    counts[a.axis] += weighted && i >= LATE_QUESTION_START_INDEX ? LATE_QUESTION_WEIGHT : 1;
  });
  return counts;
}

function rankAxes(counts: Record<AttachmentAxis, number>): [AttachmentAxis, number][] {
  return (Object.entries(counts) as [AttachmentAxis, number][]).sort((a, b) => b[1] - a[1]);
}

function scoreAnswers(answers: Option[]): AttachmentResult {
  const neutralCount = answers.filter((a) => a.axis === "neutral").length;
  if (neutralCount >= HIDDEN_NEUTRAL_THRESHOLD) {
    return { code: "HIDDEN", primaryType: null, secondaryType: null, primaryPercent: 0, secondaryPercent: null, hidden: true };
  }

  const rawCounts = countAxes(answers, false);
  let ranked = rankAxes(rawCounts);
  // Tie for 1st place — recalculate with Q11-20 weighted 1.5x purely to break
  // the ordering. The gap/percent below still use the real (unweighted)
  // counts, so a genuine tie always reports as a combo type, never pure.
  if (ranked[0][1] === ranked[1][1]) {
    ranked = rankAxes(countAxes(answers, true));
  }

  const [primaryAxis] = ranked[0];
  const [secondaryAxis] = ranked[1];
  const primaryScore = rawCounts[primaryAxis];
  const secondaryScore = rawCounts[secondaryAxis];
  const isPure = primaryScore - secondaryScore >= PURE_GAP;

  const decidedTotal = answers.length - neutralCount;
  const primaryPercent = Math.round((primaryScore / decidedTotal) * 100);
  const secondaryPercent = Math.round((secondaryScore / decidedTotal) * 100);

  return {
    code: isPure ? AXIS_CODE[primaryAxis] : `${AXIS_CODE[primaryAxis]}+${AXIS_CODE[secondaryAxis]}`,
    primaryType: primaryAxis,
    secondaryType: isPure ? null : secondaryAxis,
    primaryPercent,
    secondaryPercent: isPure ? null : secondaryPercent,
  };
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function QuizPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("ko");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>(QUESTIONS[0].options);

  useEffect(() => {
    setLang(getStoredLang());
  }, []);

  // Randomize option order per question, client-side only (after mount) so
  // server and client render the same initial markup and hydration matches.
  useEffect(() => {
    setShuffledOptions(shuffle(QUESTIONS[step].options));
  }, [step]);

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
      <div style={{ ...styles.glow, top: -100, left: -60, background: "rgba(167,139,250,0.3)" }} />
      <div style={{ ...styles.glow, bottom: -80, right: -40, background: "rgba(244,114,182,0.25)" }} />

      <div style={styles.container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button className="tap-btn" style={styles.backBtn} onClick={goBack}>← {step === 0 ? ui.home : ui.back}</button>
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </div>

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
            {shuffledOptions.map((opt, i) => (
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
    background: `linear-gradient(180deg, ${NEUTRAL_THEME.bgFrom} 0%, ${NEUTRAL_THEME.bgTo} 100%)`,
    color: NEUTRAL_THEME.text,
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
    opacity: 0.5,
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
    background: NEUTRAL_THEME.cardBg,
    border: `1px solid ${NEUTRAL_THEME.cardBorder}`,
    borderRadius: 999,
    color: NEUTRAL_THEME.textMuted,
    padding: "8px 18px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 2px 10px rgba(24,24,27,0.06)",
  },
  progressWrap: { display: "flex", flexDirection: "column", gap: 8 },
  progressTrack: { height: 6, background: "rgba(124,58,237,0.1)", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg,#7c3aed,#ec4899)", borderRadius: 3, transition: "width 0.3s ease" },
  progressLabel: { fontSize: 12, color: NEUTRAL_THEME.textFaint, margin: 0, textAlign: "right" },
  header: { display: "flex", flexDirection: "column", gap: 12 },
  labelPill: {
    alignSelf: "flex-start",
    background: "rgba(124,58,237,0.1)",
    border: "1px solid rgba(124,58,237,0.25)",
    borderRadius: 999,
    color: "#7c3aed",
    fontSize: 12,
    letterSpacing: "1.5px",
    padding: "6px 16px",
    textTransform: "uppercase",
  },
  question: { fontSize: 26, fontWeight: 800, lineHeight: 1.35, letterSpacing: "-0.8px", margin: 0, color: NEUTRAL_THEME.text },
  optionsWrap: { display: "flex", flexDirection: "column", gap: 12 },
  optionBtn: {
    textAlign: "left",
    background: NEUTRAL_THEME.cardBg,
    border: `1px solid ${NEUTRAL_THEME.cardBorder}`,
    borderRadius: 16,
    color: "rgba(24,24,27,0.8)",
    fontSize: 15,
    fontWeight: 500,
    padding: "18px 20px",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 2px 10px rgba(24,24,27,0.05)",
    transition: "border-color 0.15s, background 0.15s, opacity 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease",
  },
  optionBtnSelected: {
    background: "rgba(124,58,237,0.1)",
    borderColor: "#a78bfa",
    color: "#18181b",
    transform: "scale(1.02)",
    boxShadow: "0 0 0 2px rgba(167,139,250,0.4), 0 8px 24px rgba(124,58,237,0.2)",
  },
};
