"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Analyzing your vibe...");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const LOADING_MSGS = [
    "Analyzing your vibe...",
    "Scanning for plot armor...",
    "Checking charisma levels...",
    "Casting your role...",
    "Almost ready for your close-up...",
  ];

  useEffect(() => {
    localStorage.removeItem("ratingResult");
  }, []);

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const iv = setInterval(() => {
      i = (i + 1) % LOADING_MSGS.length;
      setLoadingMsg(LOADING_MSGS[i]);
    }, 1800);
    return () => clearInterval(iv);
  }, [loading]);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!image) {
      alert("먼저 사진을 선택해줘!");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "rate-my-fit");

      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/dyam727kd/image/upload",
        { method: "POST", body: formData }
      );
      const cloudinaryData = await cloudinaryRes.json();
      const imageUrl = cloudinaryData.secure_url;

      await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      const rateRes = await fetch("http://localhost:5000/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const rateData = await rateRes.json();

      localStorage.setItem("ratingResult", JSON.stringify(rateData));
      if (fileInputRef.current) fileInputRef.current.value = "";
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
    <main style={styles.root}>
      {/* bg glows */}
      <div style={{ ...styles.glow, top: -100, left: -60, background: "rgba(124,58,237,0.18)" }} />
      <div style={{ ...styles.glow, bottom: -80, right: -40, background: "rgba(236,72,153,0.14)" }} />

      <div style={styles.container}>
        {/* back */}
        <button
          style={styles.backBtn}
          onClick={() => { localStorage.removeItem("ratingResult"); clearPhoto(); router.push("/"); }}
        >
          ← Home
        </button>

        {/* header */}
        <div style={styles.header}>
          <div style={styles.labelPill}>🎬 K-Drama Role Test</div>
          <h1 style={styles.title}>Find Your<br />K-Drama Role</h1>
          <p style={styles.sub}>사진 한 장으로 당신의 드라마 캐릭터를 찾아드립니다</p>
        </div>

        {/* upload card */}
        <div style={styles.uploadCard}>
          {/* preview / dropzone */}
          {preview ? (
            <div style={styles.previewWrap}>
              <img src={preview} alt="Preview" style={styles.previewImg} />
              <div style={styles.readyBadge}>READY ✨</div>
            </div>
          ) : (
            <label htmlFor="file-input" style={styles.dropzone}>
              <div style={styles.dropIcon}>🎭</div>
              <p style={styles.dropTitle}>사진을 올려줘</p>
              <p style={styles.dropSub}>한 명이 잘 보이는 사진일수록 정확해요</p>
            </label>
          )}

          {/* hidden file input */}
          <input
            id="file-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            onClick={(e) => { e.currentTarget.value = ""; }}
            style={{ display: "none" }}
          />

          {/* action buttons */}
          <div style={styles.btnRow}>
            {!preview ? (
              <label htmlFor="file-input" style={{ ...styles.primaryBtn, display: "inline-block", textAlign: "center", cursor: "pointer" }}>
                Choose Photo
              </label>
            ) : (
              <>
                <button
                  style={styles.primaryBtn}
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? loadingMsg : "Find My Role ✨"}
                </button>
                <button
                  style={styles.ghostBtn}
                  onClick={clearPhoto}
                  disabled={loading}
                >
                  Clear
                </button>
              </>
            )}
          </div>

          {/* tip */}
          <div style={styles.tipBox}>
            <span style={styles.tipIcon}>💡</span>
            <span style={styles.tipText}>얼굴이 잘 보이고 조명이 좋은 사진이 제일 잘 나와요</span>
          </div>
        </div>

        {/* role preview pills */}
        <div style={styles.rolesWrap}>
          <p style={styles.rolesLabel}>어떤 역할이 나올까?</p>
          <div style={styles.rolesPillRow}>
            {["👑 Chaebol Heir", "🗡️ Mafia Boss", "🎭 Secret Villain", "☀️ Sunshine Lead", "🔍 Rookie Detective", "🏰 Joseon Prince", "👸 Revenge Queen", "🌸 Campus Heartthrob"].map((r) => (
              <span key={r} style={styles.rolePill}>{r}</span>
            ))}
          </div>
        </div>
      </div>

      {/* loading overlay */}
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingCard}>
            <div style={styles.spinner} />
            <p style={styles.loadingMsg}>{loadingMsg}</p>
            <p style={styles.loadingHint}>AI가 당신의 드라마 역할을 분석 중이에요</p>
          </div>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#08080f",
    color: "#fff",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    padding: "40px 16px 80px",
    position: "relative",
    overflowX: "hidden",
  },
  glow: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    filter: "blur(100px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: 480,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 24,
  },
  backBtn: {
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 999,
    color: "rgba(255,255,255,0.6)",
    padding: "8px 18px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  header: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  labelPill: {
    background: "rgba(124,58,237,0.15)",
    border: "1px solid rgba(124,58,237,0.3)",
    borderRadius: 999,
    color: "#a78bfa",
    fontSize: 12,
    letterSpacing: "1.5px",
    padding: "6px 16px",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: "-1px",
    margin: 0,
  },
  sub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
    margin: 0,
  },
  uploadCard: {
    width: "100%",
    background: "#0f0f1a",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 24,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  dropzone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    border: "1.5px dashed rgba(124,58,237,0.35)",
    borderRadius: 16,
    cursor: "pointer",
    gap: 8,
    background: "rgba(124,58,237,0.04)",
  },
  dropIcon: { fontSize: 40 },
  dropTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "rgba(255,255,255,0.7)",
    margin: 0,
  },
  dropSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    margin: 0,
  },
  previewWrap: { position: "relative" },
  previewImg: {
    width: "100%",
    aspectRatio: "1",
    objectFit: "cover",
    borderRadius: 16,
    display: "block",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  readyBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    background: "#fbbf24",
    color: "#78350f",
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 999,
  },
  btnRow: {
    display: "flex",
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    border: "none",
    borderRadius: 999,
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    padding: "14px 24px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  ghostBtn: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 999,
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    fontWeight: 500,
    padding: "14px 20px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  tipBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: "10px 14px",
  },
  tipIcon: { fontSize: 14, flexShrink: 0 },
  tipText: { fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 },
  rolesWrap: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  rolesLabel: {
    fontSize: 11,
    letterSpacing: "2px",
    color: "rgba(255,255,255,0.25)",
    textTransform: "uppercase",
    margin: 0,
  },
  rolesPillRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  rolePill: {
    fontSize: 12,
    padding: "6px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.03)",
  },
  loadingOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(8,8,15,0.85)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  loadingCard: {
    background: "#0f0f1a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: "48px 40px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  spinner: {
    width: 48,
    height: 48,
    border: "3px solid rgba(124,58,237,0.2)",
    borderTop: "3px solid #a78bfa",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  loadingMsg: {
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
    color: "#fff",
  },
  loadingHint: {
    fontSize: 13,
    color: "rgba(255,255,255,0.35)",
    margin: 0,
  },
};