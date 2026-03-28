// ============================================================
// FlowMon — Activity Store
// Real-time transaction lifecycle tracker.
// Tracks: preparing → awaiting_signature → pending → confirmed/failed
// ============================================================

import { create } from "zustand";

export type TxPhase =
  | "preparing"
  | "awaiting_signature"
  | "pending"
  | "confirmed"
  | "failed"
  | "cancelled";

export interface TimelineStep {
  phase: TxPhase;
  timestamp: Date;
  detail?: string;
}

export interface TrackedTransaction {
  id: string;
  phase: TxPhase;
  agentName: string;
  agentId: string;
  action: string;
  chainId: number;
  chainName: string;
  to?: string;
  from?: string;
  valueEth?: string;
  txHash?: string;
  explorerUrl?: string;
  blockNumber?: number;
  gasUsed?: string;
  errorMessage?: string;
  createdAt: Date;
  timeline: TimelineStep[];
}

interface ActivityStore {
  transactions: TrackedTransaction[];
  isActivityOpen: boolean;

  toggleActivity: () => void;
  clearActivity: () => void;

  trackTransaction: (opts: {
    agentName: string;
    agentId: string;
    action: string;
    chainId: number;
    chainName: string;
    to?: string;
    from?: string;
    valueEth?: string;
  }) => string;

  updatePhase: (id: string, phase: TxPhase, detail?: string) => void;
  setTxHash: (id: string, txHash: string, explorerUrl: string) => void;
  confirmTransaction: (id: string, info: { blockNumber: number; gasUsed: string }) => void;
  failTransaction: (id: string, errorMessage: string) => void;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  transactions: [],
  isActivityOpen: false,

  toggleActivity: () => set((s) => ({ isActivityOpen: !s.isActivityOpen })),
  clearActivity: () => set({ transactions: [] }),

  trackTransaction: (opts) => {
    const id = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const tx: TrackedTransaction = {
      id,
      phase: "preparing",
      agentName: opts.agentName,
      agentId: opts.agentId,
      action: opts.action,
      chainId: opts.chainId,
      chainName: opts.chainName,
      to: opts.to,
      from: opts.from,
      valueEth: opts.valueEth,
      createdAt: new Date(),
      timeline: [{ phase: "preparing", timestamp: new Date() }],
    };
    set((s) => ({ transactions: [tx, ...s.transactions] }));
    return id;
  },

  updatePhase: (id, phase, detail) => {
    set((s) => ({
      transactions: s.transactions.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              phase,
              timeline: [...tx.timeline, { phase, timestamp: new Date(), detail }],
            }
          : tx
      ),
    }));
  },

  setTxHash: (id, txHash, explorerUrl) => {
    set((s) => ({
      transactions: s.transactions.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              txHash,
              explorerUrl,
              phase: "pending" as TxPhase,
              timeline: [...tx.timeline, { phase: "pending" as TxPhase, timestamp: new Date(), detail: `Hash: ${txHash.slice(0, 14)}…` }],
            }
          : tx
      ),
    }));
  },

  confirmTransaction: (id, info) => {
    set((s) => ({
      transactions: s.transactions.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              phase: "confirmed" as TxPhase,
              blockNumber: info.blockNumber,
              gasUsed: info.gasUsed,
              timeline: [...tx.timeline, { phase: "confirmed" as TxPhase, timestamp: new Date(), detail: `Block #${info.blockNumber}` }],
            }
          : tx
      ),
    }));
  },

  failTransaction: (id, errorMessage) => {
    set((s) => ({
      transactions: s.transactions.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              phase: "failed" as TxPhase,
              errorMessage,
              timeline: [...tx.timeline, { phase: "failed" as TxPhase, timestamp: new Date(), detail: errorMessage }],
            }
          : tx
      ),
    }));
  },
}));
