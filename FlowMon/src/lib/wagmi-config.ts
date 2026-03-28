// ============================================================
// FlowMon — Wagmi + RainbowKit Configuration
// Monad Testnet as primary.
// ============================================================

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monadTestnet } from "./monad";

export const wagmiConfig = getDefaultConfig({
  appName: "FlowMon",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "flowmon-monad-2025",
  chains: [monadTestnet],
  ssr: true,
});
