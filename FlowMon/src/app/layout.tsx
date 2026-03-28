import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "FlowMon — Monad-Native Multi-Agent Orchestrator",
  description:
    "Visual multi-agent orchestration with parallel execution. 48 agents, 23+ protocols, Monad-native. Drag. Wire. Ship.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "FlowMon — Monad-Native Multi-Agent Orchestrator",
    description:
      "Visual multi-agent orchestration with parallel execution. 48 agents, 23+ protocols, zero code.",
    url: siteUrl,
    siteName: "FlowMon",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowMon — Monad-Native Multi-Agent Orchestrator",
    description: "48 agents, parallel execution, Monad-native. Built for 10k TPS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
