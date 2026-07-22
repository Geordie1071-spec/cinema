import type { Metadata } from "next";
import AboutSections from "@/components/AboutSections";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "About Us — Citadel Cinema",
  description:
    "Gozo's home of cinema — in the heart of Victoria, a few metres from Independence Square.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <AboutSections />
    </PageShell>
  );
}
