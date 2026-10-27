import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ADSENSE_CLIENT, HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, SITE_URL, pageMetadata } from "@/lib/site";
import SiteFooter from "@/components/SiteFooter";
import HtmlLangSync from "@/components/HtmlLangSync";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const base = pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" });

export const metadata: Metadata = {
  ...base,
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: `%s · ${SITE_NAME}` },
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* AdSense 사이트 확인은 원본 HTML <head>의 <script> 태그를 본다. next/script는
            preload 링크만 남기고 하이드레이션 뒤에 주입해서 확인이 실패하므로 일반 태그로 둔다. */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <SiteFooter />
        <HtmlLangSync />
      </body>
    </html>
  );
}
