"use client";

// ============================================================
// FlowMon — Wallet Sync Provider
// Syncs wagmi connected wallet address to the flow store.
// ============================================================

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useFlowStore } from "@/store/flow-store";

export default function WalletSyncProvider() {
  const { address, isConnected } = useAccount();
  const setConnectedAddress = useFlowStore((s) => s.setConnectedAddress);

  useEffect(() => {
    setConnectedAddress(isConnected && address ? address : null);
  }, [address, isConnected, setConnectedAddress]);

  return null;
}
