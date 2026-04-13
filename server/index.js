const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

let images = [];

// 업로드 저장
app.post('/upload', (req, res) => {
  console.log('UPLOAD req.body:', req.body);

  const imageUrl = req.body?.imageUrl;

  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl is missing in /upload' });
  }

  console.log('받은 URL:', imageUrl);

  images.push(imageUrl);

  res.json({ message: 'Saved!', imageUrl });
});

// 업로드된 이미지 목록
app.get('/images', (req, res) => {
  res.json(images);
});

// 몬스터 애니 감성 캐릭터 타입 분석
app.post('/rate', (req, res) => {
  console.log('RATE req.body:', req.body);

  const imageUrl = req.body?.imageUrl;

  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl missing' });
  }

  const fashionScore = Math.floor(Math.random() * 41) + 60;
  const flexScore = Math.floor(Math.random() * 101);
  const charisma = Math.floor(Math.random() * 101);
  const evolution = Math.floor(Math.random() * 101);

  let character = {};

  if (flexScore > 88) {
    character = {
      name: "💀 궁극체 폭주형",
      summary: "평소엔 평범해 보여도, 한 번 각 잡히면 통제 불가 상태로 진화하는 타입.",
      traits: ["폭주 모드 ON", "최종진화 직전", "보스급 존재감"],
      vibeHint: "디지털 몬스터 세계관에서 후반부에 갑자기 판 뒤집는 타입",
    };
  } else if (fashionScore > 85 && charisma > 75) {
    character = {
      name: "🦅 고독한 최강자형",
      summary: "굳이 나서지 않아도 이미 분위기를 지배하고 있는 캐릭터.",
      traits: ["혼자서 다 함", "말보다 포스", "은근 팬 많음"],
      vibeHint: "혼자 다니는데도 최강 포지션인 전설체 감성",
    };
  } else if (flexScore > 70 && fashionScore > 75) {
    character = {
      name: "😎 인기 인싸형",
      summary: "등장만 해도 분위기 살아나는, 주인공 옆 필수 캐릭터.",
      traits: ["파티 중심", "스타성 있음", "사진빨 잘 받음"],
      vibeHint: "초반부터 인기 많은 파트너 몬스터 느낌",
    };
  } else if (fashionScore > 82 && flexScore < 45) {
    character = {
      name: "🧊 냉정한 라이벌형",
      summary: "처음엔 차가운데, 끝까지 보면 제일 매력적인 라이벌 타입.",
      traits: ["말수 적음", "실력으로 증명", "후반부 떡상"],
      vibeHint: "주인공보다 더 인기 많아지는 라이벌 진화체 감성",
    };
  } else if (flexScore > 55 && charisma > 55) {
    character = {
      name: "🐺 다크 빌런형",
      summary: "위험한데 계속 보게 되는, 매력 있는 악역 느낌.",
      traits: ["어둠의 기운", "강렬한 인상", "주인공보다 인기 많을 수도"],
      vibeHint: "검은 진화 루트 타는 타락형 몬스터 감성",
    };
  } else if (charisma > 78) {
    character = {
      name: "🐲 전설의 수호자형",
      summary: "쉽게 안 움직이지만, 한 번 나서면 판을 뒤집는 존재.",
      traits: ["묵직한 포스", "신뢰감", "최종 카드 느낌"],
      vibeHint: "평소엔 안 보이다가 결정적 순간에 나오는 수호신 타입",
    };
  } else if (evolution > 85) {
    character = {
      name: "🌱 초반 약캐 성장형",
      summary: "지금은 평범하지만, 나중에 미친 듯이 진화할 가능성 있는 타입.",
      traits: ["숨겨진 잠재력", "성장형 캐릭터", "반전 있음"],
      vibeHint: "초기엔 귀엽고 약한데 최종진화가 미친 타입",
    };
  } else if (flexScore < 28) {
    character = {
      name: "🐰 힐링 마스코트형",
      summary: "존재 자체로 분위기를 편하게 만드는 귀여운 캐릭터.",
      traits: ["무해함", "귀여움", "팀 분위기 담당"],
      vibeHint: "주인공 옆에서 계속 응원해주는 파트너 감성",
    };
  } else if (charisma > 62) {
    character = {
      name: "🧠 천재 전략가형",
      summary: "힘보다 머리로 싸우는 타입. 생각보다 훨씬 위험함.",
      traits: ["계산 빠름", "계획형", "뒤에서 다 설계함"],
      vibeHint: "전투력보다 전술로 이기는 브레인형 몬스터 감성",
    };
  } else if (flexScore > 42) {
    character = {
      name: "🐍 수상한 트릭스터형",
      summary: "뭘 할지 몰라서 더 무서운, 예측불가 캐릭터.",
      traits: ["변수 덩어리", "장난기 있음", "상황 뒤집기 전문가"],
      vibeHint: "적인지 아군인지 끝까지 헷갈리는 교란형 느낌",
    };
  } else if (charisma < 40 && evolution > 60) {
    character = {
      name: "🔥 진화형 파워업 캐릭터",
      summary: "싸울수록 강해지는, 전형적인 성장형 주인공 타입.",
      traits: ["점점 강해짐", "위기 → 각성", "마지막에 터짐"],
      vibeHint: "진화 컷씬이 제일 멋있는 정석 주인공 몬스터 감성",
    };
  } else {
    character = {
      name: "⚡ 번개 마스코트형",
      summary: "작고 귀여운데, 존재감은 절대 무시 못 하는 타입.",
      traits: ["빠름", "활발함", "파트너 몬스터 감성"],
      vibeHint: "귀여운데 은근 에이스인 전기 마스코트 계열 느낌",
    };
  }

  res.json({
    imageUrl,
    characterType: character.name,
    summary: character.summary,
    traits: character.traits,
    vibeHint: character.vibeHint,
    fashionScore,
    flexScore,
    charisma,
    evolution,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});