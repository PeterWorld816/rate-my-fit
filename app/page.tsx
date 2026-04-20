"use client";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-violet-100 to-cyan-100 text-slate-800 flex items-center justify-center px-4 py-10">
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

      <div className="relative z-10 w-full max-w-4xl rounded-[36px] bg-white/65 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-8 md:p-12 border border-white/70">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full text-sm font-semibold text-violet-700 shadow-sm mb-5">
            ✨ Cute Character Lab
          </div>

          <div className="text-6xl md:text-7xl mb-4">🪄</div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500">
            Rate My Fit
            <br />
            Digital Monster Vibe Test
          </h1>

          <p className="text-slate-600 text-base md:text-xl leading-8 max-w-2xl mx-auto mb-8">
            사진 한 장만 올리면
            <br className="hidden md:block" />
            너의 착장 분위기를 귀엽고 신비한 디지털 몬스터 캐릭터 타입으로 분석해줘
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="bg-pink-50 text-pink-600 px-4 py-2 rounded-full font-semibold text-sm shadow-sm border border-pink-100">
              💖 Cute
            </span>
            <span className="bg-violet-50 text-violet-600 px-4 py-2 rounded-full font-semibold text-sm shadow-sm border border-violet-100">
              ⚡ Vibe
            </span>
            <span className="bg-cyan-50 text-cyan-600 px-4 py-2 rounded-full font-semibold text-sm shadow-sm border border-cyan-100">
              🌈 Character
            </span>
            <span className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-full font-semibold text-sm shadow-sm border border-yellow-100">
              ✨ Fun Test
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-10 text-left">
            <div className="bg-white/80 rounded-[28px] p-5 border border-white shadow-sm">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-bold text-lg mb-2 text-violet-700">1. Upload</h3>
              <p className="text-slate-600 leading-7 text-sm">
                사진 한 장을 업로드하면 미리보기를 확인할 수 있어요.
              </p>
            </div>

            <div className="bg-white/80 rounded-[28px] p-5 border border-white shadow-sm">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="font-bold text-lg mb-2 text-violet-700">2. Analyze</h3>
              <p className="text-slate-600 leading-7 text-sm">
                스타일 분위기를 바탕으로 캐릭터 타입과 점수를 보여줘요.
              </p>
            </div>

            <div className="bg-white/80 rounded-[28px] p-5 border border-white shadow-sm">
              <div className="text-3xl mb-3">🌟</div>
              <h3 className="font-bold text-lg mb-2 text-violet-700">3. Share</h3>
              <p className="text-slate-600 leading-7 text-sm">
                결과 문구를 복사해서 친구들이랑 재미로 공유할 수 있어요.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                localStorage.removeItem("ratingResult");
                window.location.href = "/upload";
              }}
              className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition"
            >
              Start Your Test ✨
            </button>

            <button
              onClick={() => {
                window.location.href = "/rate";
              }}
              className="bg-white hover:bg-pink-50 text-slate-700 px-8 py-4 rounded-full font-bold text-lg shadow-md transition"
            >
              View Last Result
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}