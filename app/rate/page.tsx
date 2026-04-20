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
  caption?: string;
  tags?: string[];
  worldVibe?: string;
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
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-violet-100 to-cyan-100 text-slate-800 px-4 flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl" />
          <div className="absolute top-24 right-16 w-52 h-52 bg-violet-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/4 w-60 h-60 bg-cyan-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-44 h-44 bg-yellow-200/40 rounded-full blur-3xl" />
          <div className="absolute top-20 left-[18%] text-3xl opacity-60">✨</div>
          <div className="absolute top-40 right-[22%] text-2xl opacity-60">🌟</div>
          <div className="absolute bottom-32 left-[12%] text-3xl opacity-60">💫</div>
        </div>

        <div className="relative z-10 w-full max-w-xl rounded-[32px] bg-white/70 backdrop-blur-xl border border-white/70 shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-8 text-center">
          <div className="text-5xl mb-4">🫧</div>
          <h1 className="text-3xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500">
            No result found
          </h1>
          <p className="text-slate-600 mb-6">
            아직 결과가 없어요. 먼저 사진을 업로드해줘!
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("ratingResult");
              window.location.href = "/upload";
            }}
            className="inline-block bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition"
          >
            Go to Upload ✨
          </button>
        </div>
      </main>
    );
  }

  const traits = Array.isArray(result.traits) ? result.traits : [];
  const tags = Array.isArray(result.tags) ? result.tags : [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-violet-100 to-cyan-100 text-slate-800 px-4 py-8">
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

      <div className="relative z-10 max-w-4xl mx-auto mb-4">
        <button
          onClick={() => {
            localStorage.removeItem("ratingResult");
            window.location.href = "/";
          }}
          className="inline-block bg-white/70 hover:bg-white text-slate-700 px-4 py-2 rounded-full font-semibold shadow-md transition"
        >
          ← Home
        </button>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto rounded-[32px] bg-white/65 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-6 md:p-10 border border-white/70">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full text-sm font-semibold text-violet-700 shadow-sm mb-4">
            🌈 Cute Character Result
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500">
            Your Digital Monster Type
          </h1>

          <p className="text-slate-600 text-base md:text-lg">
            사진 한 장으로 분석한
            <br className="hidden md:block" />
            너의 귀엽고 신비한 디지털 몬스터 감성 캐릭터
          </p>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-3 -right-3 bg-yellow-300 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow">
              RARE ✨
            </div>
            <img
              src={result.imageUrl}
              alt="Uploaded"
              className="w-full aspect-square object-cover rounded-[30px] border-4 border-white shadow-xl"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white/80 rounded-[28px] p-6 border border-white shadow-sm text-center">
            <p className="text-violet-700 text-sm font-semibold mb-2">
              Character Type
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-slate-800">
              {result.characterType ?? "Unknown Type"}
            </h2>
          </div>

          <div className="bg-gradient-to-r from-pink-100 via-violet-100 to-cyan-100 rounded-[28px] p-6 border border-white shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-violet-700">Summary ✨</h3>
            <p className="text-slate-700 leading-7 text-base md:text-lg">
              {result.summary ?? "No summary available."}
            </p>
          </div>

          <div className="bg-white/80 rounded-[28px] p-6 border border-white shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-violet-700">
              Retro Anime Vibe 🌟
            </h3>
            <p className="text-slate-700 leading-7">
              {result.vibeHint ?? "추억의 디지털 몬스터 세계관 감성"}
            </p>
          </div>

          <div className="bg-white/80 rounded-[28px] p-6 border border-white shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-violet-700">Traits 🫧</h3>
            {traits.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {traits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No traits available.</p>
            )}
          </div>

          <div className="bg-white/80 rounded-[28px] p-6 border border-white shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-violet-700">AI Caption 📝</h3>
            <p className="text-slate-700 leading-7">
              {result.caption || "No caption available."}
            </p>
          </div>

          <div className="bg-white/80 rounded-[28px] p-6 border border-white shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-violet-700">AI Tags 🏷️</h3>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-white text-slate-700 text-sm font-bold px-4 py-2 rounded-full border border-violet-100 shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No tags available.</p>
            )}
          </div>

          <div className="bg-white/80 rounded-[28px] p-6 border border-white shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-violet-700">World Vibe 🌍</h3>
            <p className="text-slate-700 leading-7">
              {result.worldVibe || "monster partner adventure"}
            </p>
          </div>

          <div className="bg-white/80 rounded-[28px] p-6 border border-white shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-violet-700">
              Style Archetype 🎭
            </h3>
            <p className="text-slate-700 leading-7">
              {tags.includes("clean") && tags.includes("minimal")
                ? "깔끔하고 편안한 메인 캐릭터 에너지"
                : tags.includes("dark") && tags.includes("edgy")
                ? "차갑고 강한 라이벌/빌런 에너지"
                : tags.includes("cute") && tags.includes("soft")
                ? "친근하고 힐링되는 파트너 캐릭터 에너지"
                : tags.includes("sporty") && tags.includes("energetic")
                ? "활동적이고 밝은 성장형 주인공 에너지"
                : "부드럽고 자연스러운 캐릭터형 에너지"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-pink-50 rounded-[24px] p-5 border border-pink-100 shadow-sm text-center">
              <p className="text-pink-500 text-sm font-semibold mb-2">Style Power</p>
              <p className="text-3xl font-extrabold text-slate-800">
                {result.fashionScore ?? "-"}
              </p>
            </div>

            <div className="bg-violet-50 rounded-[24px] p-5 border border-violet-100 shadow-sm text-center">
              <p className="text-violet-500 text-sm font-semibold mb-2">Monster Aura</p>
              <p className="text-3xl font-extrabold text-slate-800">
                {result.flexScore ?? "-"}
              </p>
            </div>

            <div className="bg-cyan-50 rounded-[24px] p-5 border border-cyan-100 shadow-sm text-center">
              <p className="text-cyan-500 text-sm font-semibold mb-2">Charisma</p>
              <p className="text-3xl font-extrabold text-slate-800">
                {result.charisma ?? "-"}
              </p>
            </div>

            <div className="bg-yellow-50 rounded-[24px] p-5 border border-yellow-100 shadow-sm text-center">
              <p className="text-yellow-600 text-sm font-semibold mb-2">
                Evolution
              </p>
              <p className="text-3xl font-extrabold text-slate-800">
                {result.evolution ?? "-"}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-fuchsia-100 via-violet-100 to-cyan-100 rounded-[28px] p-6 border border-white shadow-sm">
            <p className="text-sm font-semibold text-violet-700 mb-2">Share Caption</p>
            <p className="text-lg font-medium leading-7 text-slate-700">
              나는 <span className="font-extrabold">{result.characterType}</span> 나옴.
              AI 태그는 <span className="font-bold">{tags.join(", ") || "none"}</span> 이고,
              world vibe는{" "}
              <span className="font-bold">
                {result.worldVibe || "monster partner adventure"}
              </span>
              야.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap justify-center pt-2">
            <button
              onClick={() => {
                localStorage.removeItem("ratingResult");
                window.location.href = "/upload";
              }}
              className="inline-block bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition"
            >
              Try Another Photo ✨
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `나는 ${result.characterType} 나옴! AI tags는 ${
                    tags.join(", ") || "none"
                  }, world vibe는 ${
                    result.worldVibe || "monster partner adventure"
                  }`
                );
                alert("결과 문구가 복사됐어요.");
              }}
              className="inline-block bg-white hover:bg-pink-50 text-slate-700 px-6 py-3 rounded-full font-bold shadow-md transition"
            >
              Copy Result
            </button>

            <button
              onClick={() => {
                window.history.back();
              }}
              className="inline-block bg-white hover:bg-pink-50 text-slate-700 px-6 py-3 rounded-full font-bold shadow-md transition"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}