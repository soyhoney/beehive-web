import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Beehive Corporation · Interpretation, Translation, International Events",
  description:
    "Beyond language and cultural boundaries — we drive communication and execution. Interpretation, translation, international conference planning, on-site and online events, documentation, and English training.",
  alternates: {
    canonical: "/en/",
    languages: {
      ko: "/",
      en: "/en/",
    },
  },
  openGraph: {
    title: "Beehive Corporation",
    description: "Interpretation, translation, international events — beyond language and cultural boundaries.",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Beehive Corporation" }],
  },
};

export default function EnHome() {
  return <HomePage locale="en" />;
}
