import type { Metadata } from "next";
import { Anton, Noto_Serif_JP, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const body = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });
// CJK fonts have no Latin-style subsets; Google serves only the glyphs used via unicode-range
const kanji = Noto_Serif_JP({ variable: "--font-kanji", weight: "900", preload: false });

export const metadata: Metadata = {
  title: "RYŌIKI — Gojo, Sukuna & Toji | A Jujutsu Kaisen fan archive",
  description:
    "An unofficial fan site for Jujutsu Kaisen lovers: Satoru Gojo, Ryomen Sukuna and Toji Fushiguro — techniques, domains and fights. Press the button. Expand the domain.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${kanji.variable}`}>
      <body>{children}</body>
    </html>
  );
}
