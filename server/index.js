const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/analyze-fit", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl 필요" });
    }

    console.log("이미지 URL:", imageUrl);

    // 1️⃣ 이미지 다운로드
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    // 2️⃣ HuggingFace 무료 API 호출
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: imageBuffer,
      }
    );

    const hfData = await hfResponse.json();

    console.log("HF 결과:", hfData);

    const caption =
      hfData?.[0]?.generated_text || "이미지 분석 실패";

    // 3️⃣ 결과 생성
    const result = {
      fashionScore: Math.floor(Math.random() * 20) + 75,
      presentationScore: Math.floor(Math.random() * 20) + 70,
      summary: caption,
      comment: `이 스타일은 "${caption}" 느낌입니다.`,
      tips: [
        "색상 대비를 조금 더 주면 좋습니다.",
        "액세서리를 추가해보세요.",
        "핏을 조금 더 정리하면 더 좋아집니다.",
      ],
      tags: ["Casual", "Simple", "Test"],
    };

    res.json(result);
  } catch (err) {
    console.error("HF 에러:", err);
    res.status(500).json({
      error: "HuggingFace 실패",
      details: err.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});