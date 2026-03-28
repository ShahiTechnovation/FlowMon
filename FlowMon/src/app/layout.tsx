import type { Metadata } from "next";
import { DM_Serif_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
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
      <body className={`${dmSerif.variable} ${inter.variable} ${jetbrains.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
