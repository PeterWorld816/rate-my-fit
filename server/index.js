const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

let images = [];

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

app.get('/images', (req, res) => {
  res.json(images);
});

app.post('/rate', (req, res) => {
  console.log('RATE req.body:', req.body);

  const imageUrl = req.body?.imageUrl;

  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl is missing in /rate' });
  }

  const fashionScore = Math.floor(Math.random() * 41) + 60;
  const flexScore = Math.floor(Math.random() * 101);

  let summary = '';
  let comment = '';
  let tips = [];
  let tags = [];

  if (fashionScore >= 80 && flexScore < 40) {
    summary = '센스 있으면서도 부담 없는 스타일이에요.';
    comment = '전체적으로 깔끔하고 자연스럽게 잘 꾸민 느낌입니다.';
    tips = [
      '지금처럼 심플한 포인트를 유지해보세요.',
      '신발이나 액세서리에만 작은 포인트를 주면 더 좋아요.',
    ];
    tags = ['깔끔함', '자연스러움', '호감형'];
  } else if (fashionScore >= 80 && flexScore >= 40) {
    summary = '공들인 스타일이 확실히 느껴져요.';
    comment = '눈에 띄는 포인트가 많아서 존재감이 강한 편입니다.';
    tips = [
      '포인트 아이템을 하나만 덜어내면 더 세련돼 보여요.',
      '전체 톤을 조금만 더 통일해보세요.',
    ];
    tags = ['트렌디', '꾸민 느낌', '존재감'];
  } else if (fashionScore < 80 && flexScore >= 60) {
    summary = '꾸민 의도는 보이지만 전체 밸런스는 조금 아쉬워요.';
    comment = '강한 포인트에 비해 전체 조화가 덜 맞는 느낌입니다.';
    tips = [
      '액세서리나 로고 포인트를 하나 줄여보세요.',
      '상의와 하의의 색 조합을 더 단순하게 가져가보세요.',
    ];
    tags = ['과감함', '시선집중', '보완필요'];
  } else {
    summary = '무난하고 편안한 스타일이에요.';
    comment = '전체적으로 안정적이지만 조금 더 포인트를 줄 수도 있어요.';
    tips = [
      '신발이나 가방에 포인트를 넣어보세요.',
      '색감 대비를 조금 더 주면 인상이 살아나요.',
    ];
    tags = ['무난함', '편안함', '심플'];
  }

  res.json({
    imageUrl,
    fashionScore,
    flexScore,
    summary,
    comment,
    tips,
    tags,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});