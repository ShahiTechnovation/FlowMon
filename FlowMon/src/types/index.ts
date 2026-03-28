// ============================================================
// FlowMon — Core Type Definitions
// Monad-native. Parallel-first. Zero `any`.
// ============================================================

export type AgentCategory =
  | "core"
  | "defi"
  | "ai"
  | "oracle"
  | "identity"
  | "auth"
  | "trust"
  | "chain"
  | "governance"
  | "payments"
  | "nft";

export type AgentStatus = "live" | "stub" | "degraded";
export type NodeExecutionStatus = "idle" | "running" | "success" | "error" | "timeout";
export type FlowExecutionStatus = "idle" | "running" | "completed" | "error";

export interface AgentParameter {
  name: string;
  label: string;
  defaultValue: string;
  description: string;
  type: "text" | "number" | "boolean" | "select" | "textarea";
  options?: string[];
  required?: boolean;
}

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  sponsor: string;
  version: string;
  iconKey: string;
  parameters: AgentParameter[];
  tags: string[];
  endpointUrl?: string;
  status: AgentStatus;
  isCustom?: boolean;
}

export interface CanvasNodeData extends Record<string, unknown> {
  agentId: string;
  agentName: string;
  category: AgentCategory;
  iconKey: string;
  sponsor: string;
  parameterValues: Record<string, string>;
  executionStatus: NodeExecutionStatus;
  executionResult?: Record<string, unknown>;
  executionError?: string;
  label: string;
  groupIndex?: number;
}

export interface AmpMessage {
  ampVersion: "1.0";
  flowId: string;
  step: number;
  fromAgent: { id: string; ensName?: string };
  toAgent: { id: string; ensName?: string };
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface AmpResponse {
  success: boolean;
  agentId: string;
  outputs: Record<string, unknown>;
  error?: string;
  metadata: {
    executionTimeMs: number;
    source: string;
    cached: boolean;
  };
}

export interface ExecutionLogEntry {
  id: string;
  timestamp: Date;
  agentName: string;
  message: string;
  level: "info" | "success" | "error" | "warn";
  groupIndex?: number;
  data?: Record<string, unknown>;
}

/** A group of nodeIds that can execute concurrently */
export type ExecutionGroup = string[];

export interface SavedPipeline {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  nodes: unknown[];
  edges: unknown[];
}

export interface AgentExecuteRequest {
  agentId: string;
  agentName: string;
  parameterValues: Record<string, string>;
  upstreamResult?: Record<string, unknown>;
  endpointUrl?: string;
  flowId: string;
  stepNumber: number;
}

export interface AgentExecuteResponse {
  success: boolean;
  agentId: string;
  result?: Record<string, unknown>;
  error?: string;
  executionTimeMs: number;
  source: string;
}

export interface AgentXRequest {
  prompt: string;
}

export interface AgentXResponse {
  success: boolean;
  nodes: Array<{ agentId: string; position: { x: number; y: number } }>;
  edges: Array<{ source: string; target: string }>;
  error?: string;
}
