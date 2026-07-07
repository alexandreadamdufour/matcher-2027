import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnswersProvider } from "@/lib/answers-store";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "matcher-2027 — Comparateur de programmes",
  description:
    "Comparez vos positions à celles de candidats fictifs sur 30 thèses de la présidentielle 2027. MVP, données de test.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AnswersProvider>
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </AnswersProvider>
      </body>
    </html>
  );
}
