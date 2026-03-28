import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "FlowMon — Monad-Native Multi-Agent Orchestrator",
  description:
    "Visual multi-agent orchestration with parallel execution. 48 agents, 23+ protocols, Monad-native. Drag. Wire. Ship.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "FlowMon — Monad-Native Multi-Agent Orchestrator",
    description: "48 agents, parallel execution, Monad-native. Built for 10k TPS.",
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
      <body className={`${pressStart.variable} ${jetbrains.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
