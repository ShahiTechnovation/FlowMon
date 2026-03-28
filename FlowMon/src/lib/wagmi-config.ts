// ============================================================
// FlowMon — Wagmi + RainbowKit Configuration
// Monad Testnet as primary, Base as secondary.
// ============================================================

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";
import { monadTestnet } from "./monad";

export const wagmiConfig = getDefaultConfig({
  appName: "FlowMon",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "flowmon-monad-2025",
  chains: [monadTestnet, base],
  ssr: true,
});
