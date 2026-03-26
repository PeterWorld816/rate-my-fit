import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// ⭐⭐⭐ 이거 꼭 있어야 함
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('🔥 Backend running!');
});

app.post('/rate', (req, res) => {
  const randomScore = Math.floor(Math.random() * 101);

  res.json({
    score: randomScore
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});