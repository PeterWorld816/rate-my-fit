"use client";

import { useEffect, useState } from "react";

export default function RatePage() {
  const [images, setImages] = useState<string[]>([]);
  const [scores, setScores] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetch("http://localhost:5000/images")
      .then((res) => res.json())
      .then((data) => setImages(data));
  }, []);

  const handleRate = async (index: number) => {
    const res = await fetch("http://localhost:5000/rate", {
      method: "POST",
    });

    const data = await res.json();

    setScores((prev) => ({
      ...prev,
      [index]: data.score,
    }));
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      
      <h1 className="text-3xl font-bold mb-6 text-center">
        🔥 Community Ratings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-2xl overflow-hidden shadow-lg"
          >
            <img src={img} className="w-full h-72 object-cover" />

            <div className="p-4 text-center">
              <button
                onClick={() => handleRate(index)}
                className="px-6 py-2 bg-white text-black rounded-full hover:scale-105 transition"
              >
                Rate 🔥
              </button>

              {scores[index] !== undefined && (
                <p className="mt-3 text-xl font-semibold">
                  Score: {scores[index]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}