import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Lexend, Space_Grotesk } from "next/font/google";
import { ADSENSE_CLIENT_ID } from "../src/ads/config";
import { androidPackage, appName, iosAppStoreId, webBaseUrl } from "../src/urls";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Lexend({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL(webBaseUrl),
  title: "Guia Brechó",
  description: "Guia Brechó. Descubra brechós, conteúdos e dicas de consumo consciente.",
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "Guia Brechó",
    description: "Descubra brechós, conteúdos e dicas de consumo consciente.",
    siteName: "Guia Brechó"
  },
  twitter: {
    card: "summary_large_image",
    title: "Guia Brechó",
    description: "Descubra brechós, conteúdos e dicas de consumo consciente."
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION
  },
  appLinks: {
    ios: {
      url: webBaseUrl,
      app_store_id: iosAppStoreId,
      app_name: appName
    },
    android: {
      package: androidPackage,
      url: webBaseUrl,
      app_name: appName
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const adSenseSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>
        <Script
          id="adsense-script"
          src={adSenseSrc}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        {children}
      </body>
    </html>
  );
}
