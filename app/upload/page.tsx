"use client";

import { useState } from "react";

export default function UploadPage() {
  const [image, setImage] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "rate-my-fit"); // preset 이름

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dyam727kd/image/upload", // 👈 cloud name 넣기
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    console.log("이미지 URL:", data.secure_url);
    alert("업로드 성공!");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Upload Your Outfit 📸</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-64 h-64 object-cover rounded-xl"
        />
      )}

      <button
        onClick={handleUpload}
        className="px-6 py-3 bg-black text-white rounded-xl"
      >
        Upload to Cloudinary
      </button>
    </main>
  );
}