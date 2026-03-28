"use client";

// ============================================================
// FlowMon — Activity Panel
// Real-time transaction tracker sidebar.
// Shows full lifecycle: preparing → signing → pending → confirmed/failed
// ============================================================

import { X, Trash2, ExternalLink, Loader2, CheckCircle2, XCircle, Clock, Send, ShieldCheck, Zap } from "lucide-react";
import { useActivityStore, type TxPhase } from "@/store/activity-store";
import { formatTimestamp } from "@/lib/utils";

const PHASE_CONFIG: Record<TxPhase, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  preparing:          { label: "Preparing",   color: "var(--text-muted)",    bg: "#5a587a15", border: "#5a587a40", icon: Clock },
  awaiting_signature: { label: "Awaiting Sig", color: "#fbbf24",            bg: "#fbbf2415", border: "#fbbf2440", icon: ShieldCheck },
  pending:            { label: "Pending",     color: "var(--purple-primary)", bg: "var(--purple-glow)", border: "var(--purple-border)", icon: Loader2 },
  confirmed:          { label: "Confirmed",   color: "var(--green-live)",    bg: "#4ade8015", border: "#4ade8040", icon: CheckCircle2 },
  failed:             { label: "Failed",      color: "var(--red-error)",     bg: "#f8717115", border: "#f8717140", icon: XCircle },
  cancelled:          { label: "Cancelled",   color: "var(--text-muted)",    bg: "#5a587a15", border: "#5a587a40", icon: XCircle },
};

function TimelineRow({ phase, timestamp, detail }: { phase: TxPhase; timestamp: Date; detail?: string }) {
  const cfg = PHASE_CONFIG[phase];
  const Icon = cfg.icon;
  return (
    <div className="flex items-start gap-2 py-1">
      <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
        <Icon size={10} style={{ color: cfg.color }} className={phase === "pending" ? "animate-spin" : ""} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px]" style={{ color: cfg.color }}>{cfg.label}</span>
        {detail && <span className="text-[9px] ml-1.5" style={{ color: "var(--text-muted)" }}>{detail}</span>}
      </div>
      <span className="text-[9px] flex-shrink-0" style={{ color: "var(--text-muted)" }}>{formatTimestamp(timestamp)}</span>
    </div>
  );
}

export default function ActivityPanel() {
  const { transactions, isActivityOpen, toggleActivity, clearActivity } = useActivityStore();

  if (!isActivityOpen) return null;

  const pendingCount = transactions.filter((t) => t.phase === "pending" || t.phase === "awaiting_signature" || t.phase === "preparing").length;

  return (
    <div
      className="w-[300px] flex flex-col flex-shrink-0 overflow-hidden"
      style={{ background: "var(--bg-surface)", borderLeft: "1px solid #836EF918", fontFamily: "var(--font-jetbrains), monospace" }}
    >
      {/* Header */}
      <div className="flex items-center px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #836EF918" }}>
        <Zap size={13} style={{ color: "var(--purple-primary)" }} className="mr-2" />
        <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>Activity</span>
        {pendingCount > 0 && (
          <span
            className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
            style={{ background: "var(--purple-glow)", color: "var(--purple-primary)", border: "1px solid var(--purple-border)" }}
          >
            {pendingCount}
          </span>
        )}
        <div className="flex-1" />
        <button onClick={clearActivity} className="p-1 rounded transition-colors mr-1" style={{ color: "var(--text-muted)" }} title="Clear">
          <Trash2 size={12} />
        </button>
        <button onClick={toggleActivity} className="p-1 rounded transition-colors" style={{ color: "var(--text-muted)" }} title="Close">
          <X size={14} />
        </button>
      </div>

      {/* Transaction list */}
      <div className="flex-1 overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center" style={{ color: "var(--text-muted)" }}>
            <Send size={20} className="mb-3 opacity-40" />
            <p className="text-[11px]">No transactions yet.</p>
            <p className="text-[10px] mt-1 opacity-60">Transactions will appear here when agents execute on-chain actions.</p>
          </div>
        ) : (
          transactions.map((tx) => {
            const cfg = PHASE_CONFIG[tx.phase];
            const Icon = cfg.icon;
            return (
              <div
                key={tx.id}
                className="px-4 py-3 transition-colors hover:bg-[#1a1a2e30]"
                style={{ borderBottom: "1px solid #836EF908" }}
              >
                {/* Header row */}
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon size={12} style={{ color: cfg.color }} className={tx.phase === "pending" ? "animate-spin" : ""} />
                  <span className="text-[11px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{tx.agentName}</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>

                {/* Action */}
                <p className="text-[10px] truncate mb-1.5" style={{ color: "var(--text-secondary)" }}>{tx.action}</p>

                {/* Value + Chain */}
                <div className="flex items-center gap-2 mb-2">
                  {tx.valueEth && (
                    <span className="text-[10px] font-mono" style={{ color: "var(--text-code)" }}>{tx.valueEth} MON</span>
                  )}
                  <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>{tx.chainName}</span>
                  {tx.to && (
                    <span className="text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>
                      → {tx.to.slice(0, 8)}…{tx.to.slice(-4)}
                    </span>
                  )}
                </div>

                {/* Timeline */}
                <div className="space-y-0" style={{ borderLeft: "1px solid #836EF918", paddingLeft: "8px", marginLeft: "4px" }}>
                  {tx.timeline.map((step, i) => (
                    <TimelineRow key={i} phase={step.phase} timestamp={step.timestamp} detail={step.detail} />
                  ))}
                </div>

                {/* Block info */}
                {tx.phase === "confirmed" && tx.blockNumber && (
                  <div className="mt-2 text-[10px] flex items-center gap-2" style={{ color: "var(--green-live)" }}>
                    <CheckCircle2 size={10} />
                    Block #{tx.blockNumber.toLocaleString()}
                    {tx.gasUsed && <span style={{ color: "var(--text-muted)" }}>· Gas: {Number(tx.gasUsed).toLocaleString()}</span>}
                  </div>
                )}

                {/* Error */}
                {tx.phase === "failed" && tx.errorMessage && (
                  <div className="mt-2 text-[10px] rounded-md px-2 py-1.5" style={{ background: "#f8717110", border: "1px solid #f8717130", color: "var(--red-error)" }}>
                    {tx.errorMessage}
                  </div>
                )}

                {/* Explorer link */}
                {tx.explorerUrl && (
                  <a
                    href={tx.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1; mt-2 text-[10px] transition-colors"
                    style={{ color: "var(--purple-primary)", gap: "4px", marginTop: "6px", display: "flex", alignItems: "center" }}
                  >
                    <ExternalLink size={10} />
                    View on Explorer
                  </a>
                )}

                {/* TX hash */}
                {tx.txHash && (
                  <p className="text-[9px] font-mono mt-1 break-all" style={{ color: "var(--text-muted)" }}>{tx.txHash}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
