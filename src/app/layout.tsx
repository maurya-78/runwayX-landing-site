import type { Metadata } from "next";
import { Inter, Instrument_Serif, Caveat } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Elegant italic for accent words in headlines
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument" });
// Handwritten notes around the mockups
const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "RunwayX: The financial operating system for startups",
  description:
    "Track expenses, monitor burn rate, estimate runway, manage your team and get AI-powered financial insights. Built for founders.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${hand.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
