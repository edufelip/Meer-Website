import "./globals.css";
import type { Metadata } from "next";
import { Lexend, Space_Grotesk } from "next/font/google";
import { androidPackage, appName, iosAppStoreId } from "../src/urls";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Lexend({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Guia Brechó",
  description: "Descubra brechós, salve favoritos e compartilhe achados com facilidade.",
  appLinks: {
    ios: {
      app_store_id: iosAppStoreId,
      app_name: appName
    },
    android: {
      package: androidPackage,
      app_name: appName
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
