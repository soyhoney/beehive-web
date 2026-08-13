import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import QuoteWizard from "@/components/QuoteWizard";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Get a quote for interpretation, translation, escort trips, or training. We'll respond within 1–2 business days.",
  alternates: {
    canonical: "/en/quote/",
    languages: { ko: "/quote/", en: "/en/quote/" },
  },
};

export default function EnQuotePage() {
  return (
    <>
      <TopBar locale="en" />
      <main>
        <QuoteWizard locale="en" />
      </main>
    </>
  );
}
