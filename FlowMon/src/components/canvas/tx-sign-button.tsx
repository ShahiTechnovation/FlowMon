"use client";

// ============================================================
// FlowMon — TransactionSignButton
// Sign, submit & track on-chain transactions.
// Full lifecycle: preparing → awaiting_signature → pending → confirmed/failed
// Monad-native with Base fallback.
// ============================================================

import { useState, useCallback } from "react";
import { useSendTransaction, useWaitForTransactionReceipt, useAccount, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { monadTestnet } from "@/lib/monad";
import {
  Send, CheckCircle2, AlertCircle, ExternalLink, Loader2,
  ArrowUpRight, XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useActivityStore } from "@/store/activity-store";
import { useFlowStore } from "@/store/flow-store";

interface TransactionSignButtonProps {
  transaction: {
    to?: string;
    data?: string;
    value?: string;
    gasLimit?: string | number;
    chainId?: number;
  };
  label?: string;
  agentName?: string;
  agentId?: string;
  actionDescription?: string;
}

export default function TransactionSignButton({
  transaction,
  label = "Sign & Submit",
  agentName = "Agent",
  agentId = "unknown",
  actionDescription,
}: TransactionSignButtonProps) {
  const { isConnected, address, chainId: currentChainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { sendTransaction, isPending: isSigning } = useSendTransaction();
  const {
    trackTransaction, updatePhase, setTxHash: setTxHashActivity,
    confirmTransaction, failTransaction,
  } = useActivityStore();

  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [receiptHandled, setReceiptHandled] = useState(false);

  const targetChainId = transaction.chainId || monadTestnet.id;
  const needsChainSwitch = currentChainId !== targetChainId;
  const chainName = targetChainId === monadTestnet.id ? "Monad Testnet" : targetChainId === base.id ? "Base" : `Chain ${targetChainId}`;
  const explorerBase = targetChainId === monadTestnet.id
    ? "https://testnet.monadexplorer.com"
    : "https://basescan.org";

  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
  });

  const handleReceipt = useCallback(() => {
    if (!receipt || !trackingId || receiptHandled) return;
    setReceiptHandled(true);

    if (receipt.status === "success") {
      confirmTransaction(trackingId, {
        blockNumber: Number(receipt.blockNumber),
        gasUsed: receipt.gasUsed.toString(),
      });
      const store = useFlowStore.getState();
      useFlowStore.setState({
        executionLog: [...store.executionLog, {
          id: `tx_${Date.now()}`,
          timestamp: new Date(),
          agentName,
          message: `✅ Transaction confirmed in block #${receipt.blockNumber} · Gas: ${receipt.gasUsed.toString()}`,
          level: "success" as const,
        }],
        isLogVisible: true,
      });
    } else {
      failTransaction(trackingId, "Transaction reverted on-chain");
      const store = useFlowStore.getState();
      useFlowStore.setState({
        executionLog: [...store.executionLog, {
          id: `tx_${Date.now()}`,
          timestamp: new Date(),
          agentName,
          message: `❌ Transaction reverted on-chain`,
          level: "error" as const,
        }],
        isLogVisible: true,
      });
    }
  }, [receipt, trackingId, receiptHandled, agentName, confirmTransaction, failTransaction]);

  // Fire receipt handler when receipt arrives
  if (receipt && trackingId && !receiptHandled) {
    handleReceipt();
  }

  const actionLabel = actionDescription || `${agentName} transaction`;
  let valueEth: string | undefined;
  try {
    if (transaction.value) {
      valueEth = (Number(BigInt(transaction.value)) / 1e18).toFixed(6);
    }
  } catch {
    valueEth = transaction.value;
  }

  const handleSign = async () => {
    setError(null);
    setTxHash(null);
    setReceiptHandled(false);

    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    const tId = trackTransaction({
      agentName,
      agentId,
      action: actionLabel,
      chainId: targetChainId,
      chainName,
      to: transaction.to,
      from: address,
      valueEth,
    });
    setTrackingId(tId);

    useFlowStore.setState((s) => ({
      executionLog: [...s.executionLog, {
        id: `tx_${Date.now()}`,
        timestamp: new Date(),
        agentName,
        message: `🔐 Preparing transaction → ${transaction.to?.slice(0, 10)}…${valueEth ? ` · ${valueEth} MON` : ""}`,
        level: "info" as const,
      }],
      isLogVisible: true,
    }));

    try {
      if (needsChainSwitch) {
        updatePhase(tId, "preparing", `Switching to ${chainName}…`);
        switchChain({ chainId: targetChainId });
        await new Promise((r) => setTimeout(r, 1500));
      }

      updatePhase(tId, "awaiting_signature", "Waiting for wallet confirmation…");
      useFlowStore.setState((s) => ({
        executionLog: [...s.executionLog, {
          id: `tx_${Date.now()}_sign`,
          timestamp: new Date(),
          agentName,
          message: `✍️ Awaiting wallet signature…`,
          level: "info" as const,
        }],
      }));

      sendTransaction(
        {
          to: transaction.to as `0x${string}`,
          data: (transaction.data as `0x${string}`) || undefined,
          value: transaction.value ? BigInt(transaction.value) : undefined,
        },
        {
          onSuccess: (hash) => {
            setTxHash(hash as `0x${string}`);
            const explorerUrl = `${explorerBase}/tx/${hash}`;
            setTxHashActivity(tId, hash, explorerUrl);

            useFlowStore.setState((s) => ({
              executionLog: [...s.executionLog, {
                id: `tx_${Date.now()}_sub`,
                timestamp: new Date(),
                agentName,
                message: `📤 Transaction submitted! Hash: ${hash.slice(0, 14)}…`,
                level: "info" as const,
              }],
            }));
          },
          onError: (err) => {
            const msg = err.message?.includes("User rejected")
              ? "User rejected the transaction"
              : (err.message?.slice(0, 120) || "Transaction failed");
            setError(msg);
            failTransaction(tId, msg);

            useFlowStore.setState((s) => ({
              executionLog: [...s.executionLog, {
                id: `tx_${Date.now()}_fail`,
                timestamp: new Date(),
                agentName,
                message: `❌ ${msg}`,
                level: "error" as const,
              }],
              isLogVisible: true,
            }));
          },
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      setError(msg.slice(0, 120));
      failTransaction(tId, msg);
    }
  };

  // ── Not connected
  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-[11px] rounded-md px-3 py-2 mt-2" style={{ color: "#fbbf24", background: "#fbbf2410", border: "1px solid #fbbf2430" }}>
        <AlertCircle size={12} />
        Connect wallet in toolbar to sign transactions
      </div>
    );
  }

  // ── Confirmed
  if (receipt) {
    const isSuccess = receipt.status === "success";
    return (
      <div className="mt-2 space-y-2">
        <div
          className="flex items-center gap-2 text-[11px] rounded-md px-3 py-2.5"
          style={{
            color: isSuccess ? "var(--green-live)" : "var(--red-error)",
            background: isSuccess ? "#4ade8010" : "#f8717110",
            border: `1px solid ${isSuccess ? "#4ade8030" : "#f8717130"}`,
          }}
        >
          {isSuccess ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          <div className="flex-1">
            <p className="font-medium">{isSuccess ? "Transaction confirmed!" : "Transaction reverted"}</p>
            <p className="text-[10px] opacity-70 mt-0.5">
              Block #{Number(receipt.blockNumber).toLocaleString()} · Gas: {receipt.gasUsed.toLocaleString()}
            </p>
          </div>
        </div>
        <a
          href={`${explorerBase}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] transition-colors"
          style={{ color: "var(--purple-primary)" }}
        >
          <ExternalLink size={11} />
          View on {chainName} Explorer
        </a>
        <p className="text-[10px] font-mono break-all" style={{ color: "var(--text-muted)" }}>{txHash}</p>
      </div>
    );
  }

  // ── Confirming (submitted, waiting for block)
  if (txHash && isConfirming) {
    return (
      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2 text-[11px] rounded-md px-3 py-2.5" style={{ color: "var(--purple-primary)", background: "var(--purple-glow)", border: "1px solid var(--purple-border)" }}>
          <Loader2 size={12} className="animate-spin" />
          <div className="flex-1">
            <p className="font-medium">Waiting for confirmation…</p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>Transaction is in the mempool</p>
          </div>
        </div>
        <a
          href={`${explorerBase}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] transition-colors"
          style={{ color: "var(--purple-primary)" }}
        >
          <ExternalLink size={11} />
          Track on {chainName} Explorer
        </a>
        <p className="text-[10px] font-mono break-all" style={{ color: "var(--text-muted)" }}>{txHash}</p>
      </div>
    );
  }

  // ── Error
  if (error) {
    return (
      <div className="mt-2 space-y-2">
        <div className="flex items-start gap-2 text-[11px] rounded-md px-3 py-2" style={{ color: "var(--red-error)", background: "#f8717110", border: "1px solid #f8717130" }}>
          <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
          <span className="break-words">{error}</span>
        </div>
        <button
          onClick={handleSign}
          className="flex items-center gap-2 px-3 py-1.5 text-[11px] rounded-md transition-colors"
          style={{ color: "var(--text-secondary)", background: "var(--bg-surface)", border: "1px solid var(--purple-border)" }}
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Ready to sign
  return (
    <div className="mt-2 space-y-2">
      {needsChainSwitch && (
        <div className="flex items-center gap-2 text-[10px] rounded px-2 py-1.5" style={{ color: "#fbbf24", background: "#fbbf2408", border: "1px solid #fbbf2420" }}>
          <AlertCircle size={10} />
          Will switch to {chainName}
        </div>
      )}

      {/* Transaction summary */}
      <div className="rounded-md px-3 py-2 space-y-1" style={{ background: "var(--bg-base)", border: "1px solid var(--purple-border)" }}>
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-secondary)" }}>
          <ArrowUpRight size={10} />
          <span className="font-medium">{actionLabel}</span>
        </div>
        {valueEth && (
          <p className="text-[11px] font-mono" style={{ color: "var(--text-code)" }}>
            {valueEth} MON
          </p>
        )}
        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          To: {transaction.to?.slice(0, 8)}…{transaction.to?.slice(-6)} · {chainName}
        </p>
      </div>

      <button
        onClick={handleSign}
        disabled={isSigning}
        className={cn(
          "flex items-center gap-2 px-4 py-2 text-[12px] font-medium rounded-md transition-colors w-full justify-center",
          isSigning ? "cursor-not-allowed opacity-50" : ""
        )}
        style={{
          background: isSigning ? "var(--bg-elevated)" : "var(--purple-primary)",
          color: isSigning ? "var(--text-muted)" : "var(--bg-base)",
          border: isSigning ? "1px solid var(--purple-border)" : "none",
        }}
      >
        {isSigning ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            Confirm in wallet…
          </>
        ) : (
          <>
            <Send size={12} />
            {label}
          </>
        )}
      </button>
    </div>
  );
}
