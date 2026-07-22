import type { Metadata } from "next";
import { Big_Shoulders, Sora } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Citadel Cinema",
  description:
    "Citadel Cinema — Gozo's home of cinema, in the heart of Victoria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bigShoulders.variable} ${sora.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
