import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Inter, Lora } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FirebaseAnalyticsBootstrap from "../src/firebase/FirebaseAnalyticsBootstrap";
import MixpanelBootstrap from "../src/analytics/MixpanelBootstrap";
import { androidPackage, appName, iosAppStoreId, webBaseUrl } from "../src/urls";
import { THEME_STORAGE_KEY } from "../src/theme/theme";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const body = Lora({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(webBaseUrl),
  title: "Guia Brechó - Garimpe com Propósito",
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

const themeInitScript = `
  (() => {
    try {
      const stored = window.localStorage.getItem("${THEME_STORAGE_KEY}");
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const theme = stored ? (stored === "dark" ? "dark" : "light") : systemPreference;
      const root = document.documentElement;
      root.classList.toggle("dark", theme === "dark");
    } catch {
      // fallback
    }
  })();
`;

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-stone-800 dark:text-stone-200 font-sans transition-colors duration-300">
        <FirebaseAnalyticsBootstrap />
        <MixpanelBootstrap />
        {children}
        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}
