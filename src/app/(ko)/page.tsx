import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { alternatesFor } from "@/lib/metadata";

export const metadata: Metadata = {
  alternates: alternatesFor("/", "ko"),
};

export default function Home() {
  return <HomePage locale="ko" />;
}
