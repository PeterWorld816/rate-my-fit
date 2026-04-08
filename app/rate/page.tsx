"use client";

import { useEffect, useState } from "react";

type RatingResult = {
  imageUrl: string;
  fashionScore: number;
  flexScore: number;
  summary: string;
  comment: string;
  tips: string[];
  tags: string[];
};

export default function RatePage() {
  const [result, setResult] = useState<RatingResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ratingResult");
    if (saved) {
      setResult(JSON.parse(saved));
    }
  }, []);

  if (!result) {
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white px-4 py-10">
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

      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-10">
        <h1 className="text-4xl font-bold mb-8 text-center">🔥 Your Style Result</h1>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <img
              src={result.imageUrl}
              alt="Uploaded outfit"
              className="w-full rounded-2xl object-cover max-h-[600px]"
            />
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-2xl p-5">
                <p className="text-gray-300 text-sm mb-2">Fashion Score</p>
                <p className="text-4xl font-bold">{result.fashionScore}</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5">
                <p className="text-gray-300 text-sm mb-2">Flex Score</p>
                <p className="text-4xl font-bold">{result.flexScore}</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 mb-4">
              <h2 className="text-xl font-semibold mb-2">Summary</h2>
              <p className="text-gray-200 leading-7">{result.summary}</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 mb-4">
              <h2 className="text-xl font-semibold mb-2">Comment</h2>
              <p className="text-gray-200 leading-7">{result.comment}</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 mb-4">
              <h2 className="text-xl font-semibold mb-2">Tips</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-200">
                {result.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 mb-6">
              <h2 className="text-xl font-semibold mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-white text-black text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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