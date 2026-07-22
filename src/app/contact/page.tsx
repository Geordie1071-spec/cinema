import type { Metadata } from "next";
import AppChrome from "@/components/AppChrome";
import ContactContent from "@/components/ContactContent";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Contact Us — Citadel Cinema",
  description:
    "Get in touch with Citadel Cinema in Victoria, Gozo — screenings, accessibility, and more.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <AppChrome>
        <ContactContent />
      </AppChrome>
    </PageShell>
  );
}
