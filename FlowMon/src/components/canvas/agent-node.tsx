"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import {
  Cpu, Shuffle, Flame, BrainCircuit, ShieldHalf, Sigma,
  Orbit, PlugZap, Dna, Activity, Dices, Gauge, Telescope,
  CircuitBoard, Hash, CandlestickChart, Sliders, GitCommitHorizontal,
  Vault, Radar, Route, Hexagon, Binary, Fuel, Milestone, Triangle,
  Target, Blocks, Aperture, Swords, Satellite, Wrench, GlobeLock,
  Variable, Magnet, Biohazard, RadioTower, TrendingUpDown,
  Zap, Coins, SendHorizontal, FileSearch, Box, AlertCircle,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CanvasNodeData } from "@/types";
import { CATEGORY_COLORS } from "@/data/agent-registry";

type IconComponent = React.FC<LucideProps>;

const ICON_MAP: Record<string, IconComponent> = {
  Cpu, Shuffle, Flame, BrainCircuit, ShieldHalf, Sigma,
  Orbit, PlugZap, Dna, Activity, Dices, Gauge, Telescope,
  CircuitBoard, Hash, CandlestickChart, Sliders, GitCommitHorizontal,
  Vault, Radar, Route, Hexagon, Binary, Fuel, Milestone, Triangle,
  Target, Blocks, Aperture, Swords, Satellite, Wrench, GlobeLock,
  Variable, Magnet, Biohazard, RadioTower, TrendingUpDown,
  Zap, Coins, SendHorizontal, FileSearch,
} as Record<string, IconComponent>;

const STATUS_STYLES: Record<string, { border: string; dot: string }> = {
  idle: { border: "border-[#2d2450]", dot: "bg-[#5d4f8a]" },
  running: { border: "border-[#836EF9] monad-pulse", dot: "bg-[#836EF9] animate-pulse" },
  success: { border: "border-emerald-500", dot: "bg-emerald-500" },
  error: { border: "border-red-500", dot: "bg-red-500" },
  timeout: { border: "border-amber-500", dot: "bg-amber-500" },
};

type AgentFlowNode = Node<CanvasNodeData>;

function AgentNode({ data, selected }: NodeProps<AgentFlowNode>) {
  const IconComp = (ICON_MAP[data.iconKey as string] ?? Box) as IconComponent;
  const categoryColor = CATEGORY_COLORS[data.category as string] ?? "#836EF9";
  const execStatus = (data.executionStatus as string) ?? "idle";
  const styles = STATUS_STYLES[execStatus] ?? STATUS_STYLES.idle;
  const hasError = execStatus === "error" && data.executionError;

  return (
    <div
      className={cn(
        "bg-[#1a1230] border rounded-lg w-[210px] cursor-pointer select-none",
        "transition-all duration-200 backdrop-blur-sm",
        styles.border,
        selected && "ring-1 ring-[#836EF9] ring-offset-0 ring-offset-transparent",
      )}
      style={{
        boxShadow: execStatus === "running"
          ? "0 0 20px rgba(131, 110, 249, 0.2)"
          : "0 2px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-[3px] rounded-t-lg w-full"
        style={{ backgroundColor: categoryColor }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#2d2450]">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0"
          style={{ backgroundColor: `${categoryColor}20` }}
        >
          <IconComp size={14} color={categoryColor} />
        </div>
        <span className="text-[12px] font-medium text-[#f0ecf9] truncate flex-1">
          {data.agentName as string}
        </span>
        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", styles.dot)} />
      </div>

      {/* Sponsor */}
      <div className="px-3 py-1.5 flex items-center justify-between">
        <span className="text-[10px] text-[#5d4f8a] uppercase tracking-wide">
          {data.sponsor as string}
        </span>
        {(data.groupIndex as number | undefined) !== undefined && execStatus === "running" && (
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#836EF9]/20 text-[#836EF9] uppercase tracking-wider">
            G{((data.groupIndex as number) + 1)}
          </span>
        )}
      </div>

      {/* Error detail */}
      {hasError && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-1 bg-red-500/10 border border-red-700/30 rounded px-2 py-1">
            <AlertCircle size={10} className="text-red-400 flex-shrink-0" />
            <span className="text-[9px] text-red-400 truncate">
              {data.executionError as string}
            </span>
          </div>
        </div>
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-[#5d4f8a] !border-[#2d2450] !border hover:!bg-[#836EF9] transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-[#5d4f8a] !border-[#2d2450] !border hover:!bg-[#836EF9] transition-colors"
      />
    </div>
  );
}

export default memo(AgentNode);
