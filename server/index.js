const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ⭐ 메모리 저장소
let images = [];

// ⭐ 이미지 저장
app.post('/upload', (req, res) => {
  const { imageUrl } = req.body;

  console.log("받은 URL:", imageUrl);

  images.push(imageUrl);

  res.json({ message: "Saved!" });
});

// ⭐ 이미지 목록 가져오기 (이게 지금 없던거)
app.get('/images', (req, res) => {
  res.json(images);
});

// ⭐ 점수 API
app.post('/rate', (req, res) => {
  const randomScore = Math.floor(Math.random() * 101);
  res.json({ score: randomScore });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});