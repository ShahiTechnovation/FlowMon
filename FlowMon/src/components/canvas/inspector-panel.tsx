"use client";

import { X, RotateCw } from "lucide-react";
import { useFlowStore } from "@/store/flow-store";
import { AGENT_REGISTRY } from "@/data/agent-registry";

export default function InspectorPanel() {
  const { nodes, selectedNodeId, inspectorOpen, setInspectorOpen, updateNodeParameter, removeNode, retryNode } = useFlowStore();

  if (!inspectorOpen || !selectedNodeId) return null;

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const { agentId, agentName, executionStatus, executionResult, executionError, parameterValues } = node.data;
  const agentDef = AGENT_REGISTRY.find((a) => a.id === agentId);
  const params = agentDef?.parameters ?? [];

  const inputStyle: React.CSSProperties = {
    background: "var(--bg-surface)", border: "1px solid var(--purple-border)", borderRadius: "6px",
    padding: "8px 12px", fontSize: "13px", color: "var(--text-primary)", outline: "none",
    fontFamily: "var(--font-jetbrains), monospace", width: "100%",
  };

  return (
    <div className="w-[280px] flex flex-col flex-shrink-0 overflow-hidden" style={{ background: "var(--bg-surface)", borderLeft: "1px solid #836EF918", fontFamily: "var(--font-jetbrains), monospace" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #836EF918" }}>
        <span className="text-[13px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{agentName as string}</span>
        <button onClick={() => setInspectorOpen(false)} style={{ color: "var(--text-muted)" }}><X size={14} /></button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Parameters */}
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #836EF918" }}>
          <span className="text-[10px] font-semibold tracking-[1px]" style={{ color: "var(--text-muted)" }}>PARAMETERS</span>
          <div className="mt-3 space-y-3">
            {params.map((param) => (
              <div key={param.name}>
                <label className="text-[11px] mb-1 block" style={{ color: "var(--text-secondary)" }}>{param.label}</label>
                {param.type === "select" ? (
                  <select value={(parameterValues as Record<string, string>)[param.name] ?? param.defaultValue}
                    onChange={(e) => updateNodeParameter(selectedNodeId, param.name, e.target.value)} style={inputStyle}>
                    {param.options?.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                  </select>
                ) : param.type === "textarea" ? (
                  <textarea value={(parameterValues as Record<string, string>)[param.name] ?? param.defaultValue}
                    onChange={(e) => updateNodeParameter(selectedNodeId, param.name, e.target.value)} rows={3} style={{ ...inputStyle, resize: "none" }} />
                ) : (
                  <input type={param.type === "number" ? "number" : "text"}
                    value={(parameterValues as Record<string, string>)[param.name] ?? param.defaultValue}
                    onChange={(e) => updateNodeParameter(selectedNodeId, param.name, e.target.value)}
                    style={inputStyle} placeholder={param.description} />
                )}
                <p className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>{param.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        {(executionResult || executionError) && (
          <div className="px-4 py-3" style={{ borderBottom: "1px solid #836EF918" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold tracking-[1px]" style={{ color: "var(--text-muted)" }}>RESULT</span>
              {(executionStatus === "error" || executionStatus === "timeout") && (
                <button onClick={() => retryNode(selectedNodeId)} className="flex items-center gap-1 text-[10px] transition-colors" style={{ color: "var(--purple-primary)" }}>
                  <RotateCw size={10} /> Retry
                </button>
              )}
            </div>
            {executionError && (
              <div className="rounded-md p-2 mb-2" style={{ background: "#f8717115", border: "1px solid #f8717140" }}>
                <p className="text-[10px]" style={{ color: "var(--red-error)" }}>{executionError as string}</p>
              </div>
            )}
            {executionResult && (
              <pre className="rounded-md p-2 text-[10px] overflow-auto max-h-48 whitespace-pre-wrap" style={{ background: "var(--bg-base)", border: "1px solid var(--purple-border)", color: "var(--text-code)" }}>
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid #836EF918" }}>
        <button onClick={() => removeNode(selectedNodeId)} className="w-full text-[11px] py-1.5 rounded-md transition-colors" style={{ color: "var(--red-error)", border: "1px solid #f8717140" }}>
          Remove Agent
        </button>
      </div>
    </div>
  );
}
