"use client";

import { useEffect, useState } from "react";

type RatingResult = {
  imageUrl?: string;
  characterType?: string;
  summary?: string;
  traits?: string[];
  vibeHint?: string;
  fashionScore?: number;
  flexScore?: number;
  charisma?: number;
  evolution?: number;
};

export default function RatePage() {
  const [result, setResult] = useState<RatingResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ratingResult");
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse ratingResult:", error);
        localStorage.removeItem("ratingResult");
      }
    }
  }, []);

  if (!result || !result.imageUrl) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No result found</h1>
          <p className="text-gray-400 mb-6">Please upload an image first.</p>
          <button
            onClick={() => {
              localStorage.removeItem("ratingResult");
              window.location.href = "/upload";
            }}
            className="inline-block bg-white text-black px-5 py-3 rounded-xl font-semibold"
          >
            Go to Upload
          </button>
        </div>
      </main>
    );
  }

  const traits = Array.isArray(result.traits) ? result.traits : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-indigo-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto mb-4">
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

      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-10 border border-white/10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center">
          ⚔️ Your Digital Monster Type
        </h1>
        <p className="text-center text-gray-300 mb-8">
          사진 한 장으로 분석한 너의 디지털 몬스터 감성 캐릭터
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <img
              src={result.imageUrl}
              alt="Uploaded"
              className="w-full rounded-2xl object-cover max-h-[620px] border border-white/10"
            />
          </div>

          <div>
            <div className="bg-white/10 rounded-2xl p-5 mb-5 border border-white/10">
              <p className="text-gray-300 text-sm mb-2">Character Type</p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                {result.characterType ?? "Unknown Type"}
              </h2>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl p-5 mb-5 border border-white/10">
              <h3 className="text-xl font-semibold mb-2">Summary</h3>
              <p className="text-gray-100 leading-7 text-lg">
                {result.summary ?? "No summary available."}
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 mb-5 border border-white/10">
              <h3 className="text-xl font-semibold mb-2">Retro Anime Vibe</h3>
              <p className="text-gray-200 leading-7">
                {result.vibeHint ?? "추억의 디지털 몬스터 세계관 감성"}
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 mb-5 border border-white/10">
              <h3 className="text-xl font-semibold mb-3">Traits</h3>
              {traits.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {traits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-black text-sm font-semibold px-3 py-2 rounded-full"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No traits available.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                <p className="text-gray-300 text-sm mb-2">Style Power</p>
                <p className="text-3xl font-bold">{result.fashionScore ?? "-"}</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                <p className="text-gray-300 text-sm mb-2">Monster Aura</p>
                <p className="text-3xl font-bold">{result.flexScore ?? "-"}</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                <p className="text-gray-300 text-sm mb-2">Charisma</p>
                <p className="text-3xl font-bold">{result.charisma ?? "-"}</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                <p className="text-gray-300 text-sm mb-2">Evolution Potential</p>
                <p className="text-3xl font-bold">{result.evolution ?? "-"}</p>
              </div>
            </div>

            <div className="bg-indigo-500/10 rounded-2xl p-5 mb-6 border border-indigo-400/20">
              <p className="text-sm text-indigo-200 mb-2">Share Caption</p>
              <p className="text-lg font-medium leading-7">
                나는 <span className="font-bold">{result.characterType}</span> 나옴.  
                이거 완전 추억의 디지털 몬스터 감성 테스트네.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => {
                  localStorage.removeItem("ratingResult");
                  window.location.href = "/upload";
                }}
                className="inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
              >
                Try Another Photo
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `나는 ${result.characterType} 나옴. 완전 추억의 디지털 몬스터 감성 테스트!`
                  );
                  alert("결과 문구가 복사됐어요.");
                }}
                className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Copy Result
              </button>

              <button
                onClick={() => {
                  window.history.back();
                }}
                className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}