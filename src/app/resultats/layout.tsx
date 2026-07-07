import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vos résultats",
  description:
    "Votre classement d'affinité, radar comparatif et repondération par thème.",
};

export default function ResultatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
