import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IURIS | Campus Intelligence & Security",
    template: "%s | IURIS",
  },
  description:
    "IURIS (Islamic University Real-Time Intelligence for Surveillance) is an AI-assisted campus security and intelligent video surveillance platform under active development.",
  applicationName: "IURIS",
  keywords: [
    "IURIS",
    "Islamic University",
    "Campus Security",
    "Intelligent Video Surveillance",
    "Artificial Intelligence",
    "Computer Vision",
  ],
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
