import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ADSENSE_CLIENT, HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, SITE_URL, pageMetadata } from "@/lib/site";
import AdSenseScript from "@/components/AdSenseScript";
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
      <body className="min-h-full flex flex-col">
        {children}
        <SiteFooter />
        <HtmlLangSync />
        <AdSenseScript />
      </body>
    </html>
  );
}
