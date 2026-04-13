"use client";

import { useEffect, useRef, useState } from "react";

export default function UploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.removeItem("ratingResult");
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearPhoto = () => {
    setImage(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("먼저 사진을 선택해주세요.");
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
      const imageUrl = cloudinaryData.secure_url;

      await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      const rateRes = await fetch("http://localhost:5000/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      const rateData = await rateRes.json();

      localStorage.setItem("ratingResult", JSON.stringify(rateData));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setImage(null);
      setPreview(null);

      window.location.href = "/rate";
    } catch (error) {
      console.error("Upload error:", error);
      alert("업로드 중 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-indigo-950 text-white flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl mb-6">
        <button
          onClick={() => {
            localStorage.removeItem("ratingResult");
            clearPhoto();
            window.location.href = "/upload";
          }}
          className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-medium transition"
        >
          ← Home
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center">
          ⚔️ Digital Monster Vibe Test
        </h1>
        <p className="text-gray-300 text-center mb-8">
          사진 한 장 업로드하고 너의 디지털 몬스터 감성 캐릭터 타입을 확인해봐
        </p>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onClick={(e) => {
              e.currentTarget.value = "";
            }}
            onChange={handleImageChange}
            className="mb-4 block w-full text-sm"
          />

          {!preview && (
            <div className="w-full h-72 rounded-2xl border border-dashed border-white/20 flex items-center justify-center text-gray-400 mb-4">
              사진을 올리면 여기에 미리보기가 보여요
            </div>
          )}

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-72 object-cover rounded-2xl mb-4 border border-white/10"
            />
          )}

          <p className="text-sm text-gray-400 mb-4">
            한 명이 잘 보이는 사진일수록 결과가 더 자연스럽게 느껴져요.
          </p>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze My Type"}
            </button>

            <button
              onClick={clearPhoto}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              Clear Photo
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}