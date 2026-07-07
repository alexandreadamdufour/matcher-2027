import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le test",
  description:
    "Répondez à 30 thèses (ou 15 en version express) et comparez vos positions à celles de 4 candidats fictifs.",
};

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
