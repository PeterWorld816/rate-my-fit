"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
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

      router.push("/rate");
    } catch (error) {
      console.error("Upload error:", error);
      alert("업로드 중 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-violet-100 to-cyan-100 text-slate-800 flex flex-col items-center justify-center px-4 py-10">
      {/* background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl" />
        <div className="absolute top-24 right-16 w-52 h-52 bg-violet-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-60 h-60 bg-cyan-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-44 h-44 bg-yellow-200/40 rounded-full blur-3xl" />

        <div className="absolute top-20 left-[18%] text-3xl opacity-60">✨</div>
        <div className="absolute top-40 right-[22%] text-2xl opacity-60">🌟</div>
        <div className="absolute bottom-32 left-[12%] text-3xl opacity-60">💫</div>
        <div className="absolute bottom-24 right-[15%] text-2xl opacity-60">🫧</div>
        <div className="absolute top-1/2 left-[8%] text-2xl opacity-50">⭐</div>
        <div className="absolute top-1/3 right-[10%] text-3xl opacity-50">☁️</div>
      </div>

      <div className="relative z-10 w-full max-w-3xl mb-6">
 <button
  onClick={() => {
    localStorage.removeItem("ratingResult");
    clearPhoto();
    router.push("/");
  }}
          className="inline-block bg-white/70 hover:bg-white text-slate-700 px-4 py-2 rounded-full font-semibold shadow-md transition"
        >
          ← Home
        </button>
      </div>

      <div className="relative z-10 w-full max-w-3xl rounded-[32px] bg-white/65 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-8 md:p-10 border border-white/70">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full text-sm font-semibold text-violet-700 shadow-sm mb-4">
            ✨ Cute Character Lab
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500">
            Digital Monster Vibe Test
          </h1>

          <p className="text-slate-600 text-base md:text-lg">
            사진 한 장 업로드하고
            <br className="hidden md:block" />
            너만의 귀엽고 신비한 캐릭터 타입을 확인해봐
          </p>
        </div>

        <div className="rounded-[28px] bg-gradient-to-br from-white/80 to-pink-50/80 p-6 border border-white shadow-inner">
          <label className="block text-sm font-bold text-violet-700 mb-3">
            📸 캐릭터 소환용 사진 업로드
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onClick={(e) => {
              e.currentTarget.value = "";
            }}
            onChange={handleImageChange}
            className="mb-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-violet-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-600"
          />

          {!preview && (
            <div className="w-full h-72 rounded-[28px] border-2 border-dashed border-violet-300 bg-gradient-to-br from-pink-100 via-white to-cyan-100 flex flex-col items-center justify-center text-slate-500 mb-4 shadow-inner">
              <div className="text-5xl mb-3">🪄</div>
              <p className="font-semibold text-lg">사진을 올리면 미리보기가 나타나요</p>
              <p className="text-sm mt-2 text-slate-400">
                귀엽고 반짝이는 캐릭터 분석이 시작돼요
              </p>
            </div>
          )}

          {preview && (
            <div className="relative mb-4">
              <div className="absolute -top-3 -right-3 bg-yellow-300 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                READY ✨
              </div>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-72 object-cover rounded-[28px] border-4 border-white shadow-lg"
              />
            </div>
          )}

          <div className="rounded-2xl bg-violet-50/80 border border-violet-100 px-4 py-3 mb-5">
            <p className="text-sm text-slate-600">
              💡 팁: 한 명이 잘 보이는 사진일수록 결과가 더 자연스럽고 재미있게 나와요.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Analyzing..." : "Analyze My Type ✨"}
            </button>

            <button
              onClick={clearPhoto}
              disabled={loading}
              className="bg-white hover:bg-pink-50 text-slate-700 px-6 py-3 rounded-full font-bold shadow-md transition disabled:opacity-50"
            >
              Clear Photo
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}