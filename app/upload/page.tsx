"use client";

import { useEffect, useState } from "react";

export default function UploadPage() {
  const [image, setImage] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("ratingResult");
  }, []);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("사진을 먼저 선택해주세요.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "rate-my-fit");

      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/dyam727kd/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryData.secure_url) {
        console.error("Cloudinary 응답:", cloudinaryData);
        alert("이미지 업로드에 실패했습니다.");
        return;
      }

      const imageUrl = cloudinaryData.secure_url;

      const analyzeRes = await fetch("http://localhost:5000/analyze-fit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        console.error("AI 분석 실패:", analyzeData);
        alert("AI 분석 중 에러가 발생했습니다.");
        return;
      }

      const finalResult = {
        imageUrl,
        fashionScore: analyzeData.fashionScore,
        flexScore: analyzeData.presentationScore,
        summary: analyzeData.summary,
        comment: analyzeData.comment,
        tips: analyzeData.tips,
        tags: analyzeData.tags,
      };

      localStorage.setItem("ratingResult", JSON.stringify(finalResult));
      window.location.href = "/rate";
    } catch (error) {
      console.error("Upload error:", error);
      alert("업로드 또는 분석 중 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mb-6">
        <button
          onClick={() => {
            localStorage.removeItem("ratingResult");
            window.location.href = "/upload";
          }}
          className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-medium transition"
        >
          ← Home
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-2">🔥 Rate My Fit</h1>
      <p className="text-gray-400 mb-8">
        Upload your outfit and get rated instantly
      </p>

      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 text-sm"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-xl mb-4"
          />
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Analyzing with AI..." : "Upload Outfit"}
        </button>
      </div>
    </main>
  );
}