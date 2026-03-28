"use client";

// ============================================================
// FlowMon — Agent X Panel (Enhanced)
// Full chat-based pipeline builder with:
//   • Venice.ai LLM integration
//   • Progressive canvas building
//   • Quick actions
//   • Conversation history
//   • Markdown-like rendering
// ============================================================

import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronDown, Send, Loader2, Bot, Sparkles, Zap, LayoutTemplate, Play } from "lucide-react";
import { useFlowStore } from "@/store/flow-store";
import { AGENT_REGISTRY } from "@/data/agent-registry";
import { generateId } from "@/lib/utils";
import type { CanvasNodeData } from "@/types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: "build_flow" | "add_agent" | "info";
}

const QUICK_ACTIONS = [
  { label: "🔗 DeFi Pipeline", prompt: "Build a DeFi pipeline using Chainlink Oracle, Venice Reasoner, and Monad TX Executor" },
  { label: "⚡ Yield Optimizer", prompt: "Create a yield optimization flow: check balances, get prices, AI analysis, then execute" },
  { label: "🤖 AI Analysis", prompt: "Set up an AI-powered market analysis using Venice AI with price data from Chainlink" },
  { label: "🧪 Test Flow", prompt: "Build a simple test flow with Monad Balance and Monad Gas Estimator in parallel" },
];

export default function AgentXPanel() {
  const { isAgentXOpen, setAgentXOpen, setPipelineTriggerOpen } = useFlowStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const buildFlowFromResponse = useCallback((data: { nodes?: Array<{ agentId: string; position: { x: number; y: number } }>; edges?: Array<{ source: string; target: string }> }) => {
    if (!data.nodes || !data.edges) return;
    const store = useFlowStore.getState();

    for (const nodeSpec of data.nodes) {
      const agentDef = AGENT_REGISTRY.find((a) => a.id === nodeSpec.agentId);
      if (agentDef) store.addAgentToCanvas(agentDef, nodeSpec.position);
    }

    setTimeout(() => {
      const cs = useFlowStore.getState();
      const nodeMap = new Map<string, string>();
      for (const n of cs.nodes) {
        const nd = n.data as CanvasNodeData;
        if (!nodeMap.has(nd.agentId)) nodeMap.set(nd.agentId, n.id);
      }
      for (const edgeSpec of data.edges!) {
        const s = nodeMap.get(edgeSpec.source);
        const t = nodeMap.get(edgeSpec.target);
        if (s && t) cs.onConnect({ source: s, target: t, sourceHandle: null, targetHandle: null });
      }
    }, 200);
  }, []);

  const handleSubmit = useCallback(async (promptOverride?: string) => {
    const prompt = (promptOverride || input).trim();
    if (!prompt || loading) return;

    setMessages((prev) => [...prev, { id: generateId("msg"), role: "user", content: prompt }]);
    if (!promptOverride) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/agent-x", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (data.success && data.nodes && data.edges) {
        buildFlowFromResponse(data);
        setMessages((prev) => [...prev, {
          id: generateId("msg"),
          role: "assistant",
          content: `✓ Pipeline created with ${data.nodes.length} agent(s) and ${data.edges.length} connection(s).\n\nAgents added:\n${data.nodes.map((n: { agentId: string }) => {
            const def = AGENT_REGISTRY.find((a) => a.id === n.agentId);
            return `• ${def?.name || n.agentId}`;
          }).join("\n")}\n\nReady to run! Click "Run Flow" or use the Pipeline Trigger.`,
          action: "build_flow",
        }]);
      } else {
        setMessages((prev) => [...prev, {
          id: generateId("msg"),
          role: "assistant",
          content: data.error || "I couldn't build that pipeline. Try being more specific about which agents to use.",
          action: "info",
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        id: generateId("msg"),
        role: "assistant",
        content: "Connection error. Make sure the dev server is running.",
        action: "info",
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, buildFlowFromResponse]);

  if (!isAgentXOpen) return null;

  return (
    <div
      className="fixed bottom-0 left-[240px] right-0 z-50 flex flex-col"
      style={{ maxHeight: "380px", background: "var(--bg-surface)", borderTop: "1px solid #836EF918", fontFamily: "var(--font-jetbrains), monospace" }}
    >
      {/* Header */}
      <div className="flex items-center px-4 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid #836EF918" }}>
        <Bot size={14} style={{ color: "var(--purple-primary)" }} className="mr-2" />
        <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>Agent X</span>
        <span
          className="ml-2 text-[9px] px-1.5 py-0.5 rounded"
          style={{ color: "var(--purple-primary)", background: "var(--purple-glow)", border: "1px solid var(--purple-border)" }}
        >
          NL → Pipeline
        </span>
        <div className="flex-1" />
        <button onClick={() => setAgentXOpen(false)} style={{ color: "var(--text-muted)" }}><ChevronDown size={14} /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[120px]">
        {messages.length === 0 && (
          <div className="py-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} style={{ color: "var(--purple-primary)" }} />
              <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>Describe a pipeline in natural language</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleSubmit(action.prompt)}
                  className="text-left px-3 py-2 rounded-md text-[10px] transition-colors"
                  style={{
                    background: "var(--bg-base)",
                    border: "1px solid var(--purple-border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] rounded-md px-3 py-2 text-[11px] whitespace-pre-wrap"
              style={{
                background: msg.role === "user" ? "var(--purple-glow)" : "var(--bg-base)",
                border: `1px solid ${msg.role === "user" ? "var(--purple-border)" : "#836EF918"}`,
                color: msg.role === "user" ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {msg.content}

              {/* Action buttons for flow-building responses */}
              {msg.action === "build_flow" && (
                <div className="flex gap-2 mt-2 pt-2" style={{ borderTop: "1px solid #836EF918" }}>
                  <button
                    onClick={() => setPipelineTriggerOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[9px] transition-colors"
                    style={{ background: "var(--purple-glow)", border: "1px solid var(--purple-border)", color: "var(--purple-primary)" }}
                  >
                    <Play size={9} /> Run Pipeline
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-md px-3 py-2 flex items-center gap-2" style={{ background: "var(--bg-base)", border: "1px solid #836EF918" }}>
              <Loader2 size={12} className="animate-spin" style={{ color: "var(--purple-primary)" }} />
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Building pipeline…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid #836EF918" }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ background: "var(--bg-base)", border: "1px solid var(--purple-border)" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Describe your pipeline… e.g. &quot;Build a Monad DeFi strategy&quot;"
            className="flex-1 bg-transparent text-[12px] outline-none"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains), monospace" }}
            disabled={loading}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={loading || !input.trim()}
            className="transition-colors"
            style={{ color: loading || !input.trim() ? "var(--text-muted)" : "var(--purple-primary)" }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
