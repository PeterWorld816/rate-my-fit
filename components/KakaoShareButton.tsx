"use client";

import { useState } from "react";
import Script from "next/script";

// Kakao JavaScript SDK share button. Renders nothing unless
// NEXT_PUBLIC_KAKAO_JS_KEY is set (see README for issuing the key and
// registering the site domain in the Kakao developer console).
const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";

type KakaoSdk = {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (settings: {
      objectType: "feed";
      content: {
        title: string;
        description: string;
        imageUrl: string;
        link: { mobileWebUrl: string; webUrl: string };
      };
      buttons?: { title: string; link: { mobileWebUrl: string; webUrl: string } }[];
    }) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

export default function KakaoShareButton({
  title,
  description,
  imageUrl,
  url,
  buttonTitle,
  label,
  style,
}: {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  buttonTitle: string;
  label: string;
  style?: React.CSSProperties;
}) {
  const [ready, setReady] = useState(false);
  if (!KAKAO_JS_KEY) return null;

  const share = () => {
    const kakao = window.Kakao;
    if (!kakao) return;
    const link = { mobileWebUrl: url, webUrl: url };
    kakao.Share.sendDefault({
      objectType: "feed",
      content: { title, description, imageUrl, link },
      buttons: [{ title: buttonTitle, link }],
    });
  };

  return (
    <>
      <Script
        src={KAKAO_SDK_URL}
        strategy="lazyOnload"
        onReady={() => {
          if (window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY);
          setReady(!!window.Kakao);
        }}
      />
      <button
        onClick={share}
        disabled={!ready}
        className="tap-btn"
        style={{
          background: "#FEE500",
          border: "none",
          borderRadius: 999,
          color: "rgba(0,0,0,0.85)",
          fontSize: 15,
          fontWeight: 800,
          padding: "14px 20px",
          cursor: ready ? "pointer" : "default",
          opacity: ready ? 1 : 0.6,
          ...style,
        }}
      >
        {label}
      </button>
    </>
  );
}
