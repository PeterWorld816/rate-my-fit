import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ADSENSE_CLIENT, SITE_NAME, SITE_URL, pageMetadata } from "@/lib/site";
import AdSenseScript from "@/components/AdSenseScript";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "내 연애 유형 테스트 | 애착유형 검사";
const DESCRIPTION =
  "애착이론 기반 20개 질문으로 알아보는 나의 연애 유형. 안정형·불안형·회피형·혼란형, 16가지 유형 중 나는 뭘까?";

const base = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/" });

export const metadata: Metadata = {
  ...base,
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s · ${SITE_NAME}` },
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
      <body className="min-h-full flex flex-col">
        {children}
        <SiteFooter />
        <AdSenseScript />
      </body>
    </html>
  );
}
