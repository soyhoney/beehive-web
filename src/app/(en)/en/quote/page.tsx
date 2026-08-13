import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import QuoteWizard from "@/components/QuoteWizard";
import { alternatesFor } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Get a quote for interpretation, translation, escort trips, or training. We'll respond within 1–2 business days.",
  alternates: alternatesFor("/quote/", "en"),
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
