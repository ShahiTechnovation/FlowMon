"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronDown, Send, Loader2, Bot } from "lucide-react";
import { useFlowStore } from "@/store/flow-store";
import { AGENT_REGISTRY } from "@/data/agent-registry";
import { generateId } from "@/lib/utils";
import type { CanvasNodeData } from "@/types";
import type { Node } from "@xyflow/react";

interface ChatMessage { id: string; role: "user" | "assistant"; content: string; }

export default function AgentXPanel() {
  const { isAgentXOpen, setAgentXOpen } = useFlowStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSubmit = useCallback(async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;
    setMessages((prev) => [...prev, { id: generateId("msg"), role: "user", content: prompt }]);
    setInput(""); setLoading(true);

    try {
      const response = await fetch("/api/agent-x", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await response.json();

      if (data.success && data.nodes && data.edges) {
        const store = useFlowStore.getState();
        for (const nodeSpec of data.nodes as Array<{ agentId: string; position: { x: number; y: number } }>) {
          const agentDef = AGENT_REGISTRY.find((a) => a.id === nodeSpec.agentId);
          if (agentDef) store.addAgentToCanvas(agentDef, nodeSpec.position);
        }
        setTimeout(() => {
          const cs = useFlowStore.getState();
          const nodeMap = new Map<string, string>();
          for (const n of cs.nodes) { const nd = n.data as CanvasNodeData; if (!nodeMap.has(nd.agentId)) nodeMap.set(nd.agentId, n.id); }
          for (const edgeSpec of data.edges as Array<{ source: string; target: string }>) {
            const s = nodeMap.get(edgeSpec.source); const t = nodeMap.get(edgeSpec.target);
            if (s && t) cs.onConnect({ source: s, target: t, sourceHandle: null, targetHandle: null });
          }
        }, 200);
        setMessages((prev) => [...prev, { id: generateId("msg"), role: "assistant", content: `✓ Pipeline created with ${(data.nodes as unknown[]).length} agent(s) and ${(data.edges as unknown[]).length} connection(s).` }]);
      } else {
        setMessages((prev) => [...prev, { id: generateId("msg"), role: "assistant", content: data.error || "Couldn't build that pipeline. Try being more specific." }]);
      }
    } catch { setMessages((prev) => [...prev, { id: generateId("msg"), role: "assistant", content: "Connection error." }]); }
    finally { setLoading(false); }
  }, [input, loading]);

  if (!isAgentXOpen) return null;

  return (
    <div className="fixed bottom-0 left-[240px] right-0 z-50 flex flex-col" style={{ maxHeight: "320px", background: "var(--bg-surface)", borderTop: "1px solid #836EF918", fontFamily: "var(--font-jetbrains), monospace" }}>
      <div className="flex items-center px-4 py-2 flex-shrink-0" style={{ borderBottom: "1px solid #836EF918" }}>
        <Bot size={14} style={{ color: "var(--purple-primary)" }} className="mr-2" />
        <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>Agent X</span>
        <span className="ml-2 text-[10px]" style={{ color: "var(--text-muted)" }}>NL → pipeline</span>
        <div className="flex-1" />
        <button onClick={() => setAgentXOpen(false)} style={{ color: "var(--text-muted)" }}><ChevronDown size={14} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[120px]">
        {messages.length === 0 && (
          <div className="text-[11px] text-center py-4" style={{ color: "var(--text-muted)" }}>
            Try: &ldquo;Build a yield optimizer using Chainlink, Lido, and Venice AI&rdquo;
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[80%] rounded-md px-3 py-2 text-[11px]" style={{
              background: msg.role === "user" ? "var(--purple-glow)" : "var(--bg-base)",
              border: `1px solid ${msg.role === "user" ? "var(--purple-border)" : "#836EF918"}`,
              color: msg.role === "user" ? "var(--text-primary)" : "var(--text-secondary)",
            }}>{msg.content}</div>
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

      <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid #836EF918" }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ background: "var(--bg-base)", border: "1px solid var(--purple-border)" }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Describe the pipeline…"
            className="flex-1 bg-transparent text-[12px] outline-none"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains), monospace" }} disabled={loading} />
          <button onClick={handleSubmit} disabled={loading || !input.trim()} className="transition-colors" style={{ color: loading || !input.trim() ? "var(--text-muted)" : "var(--purple-primary)" }}>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
