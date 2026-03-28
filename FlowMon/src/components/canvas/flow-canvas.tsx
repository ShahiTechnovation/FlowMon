"use client";

import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  type NodeTypes,
} from "@xyflow/react";
import { useFlowStore } from "@/store/flow-store";
import AgentNode from "./agent-node";
import type { CanvasNodeData, AgentDefinition } from "@/types";
import type { Node } from "@xyflow/react";

const NODE_TYPES: NodeTypes = {
  agentNode: AgentNode,
};

function EmptyCanvasState({ onLoadDemo }: { onLoadDemo: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
      <div className="pointer-events-auto flex flex-col items-center gap-5 max-w-xs text-center">
        <div className="w-16 h-16 rounded-xl border border-[#2d2450] bg-[#1a1230] flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#836EF9" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[#f0ecf9] mb-1">Start building your flow</p>
          <p className="text-[12px] text-[#5d4f8a] leading-relaxed">
            Drag agents from the sidebar, wire them together, then hit&nbsp;
            <span className="text-[#836EF9] font-medium">Run Flow</span>.
            <br />
            Independent nodes execute in <span className="text-[#836EF9] font-medium">parallel</span>.
          </p>
        </div>
        <button
          onClick={onLoadDemo}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#836EF9]/15 hover:bg-[#836EF9]/25 border border-[#836EF9]/30 text-[#836EF9] text-[12px] font-medium rounded-lg transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="7" x="3" y="3" rx="1" /><rect width="9" height="7" x="3" y="14" rx="1" /><rect width="5" height="7" x="16" y="14" rx="1" /></svg>
          Load Monad demo flow
        </button>
      </div>
    </div>
  );
}

export default function FlowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    addAgentToCanvas,
    loadDemoFlow,
    loadAutoSave,
    runFlow,
    stopFlow,
  } = useFlowStore();

  const { screenToFlowPosition } = useReactFlow();

  // Load autosave on mount
  useEffect(() => {
    loadAutoSave();
  }, [loadAutoSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        runFlow();
      } else if (e.key === "Escape") {
        stopFlow();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runFlow, stopFlow]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const agentJson = event.dataTransfer.getData("agent");
      if (!agentJson) return;
      try {
        const agent = JSON.parse(agentJson) as AgentDefinition;
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        addAgentToCanvas(agent, position);
      } catch {
        // ignore malformed drag data
      }
    },
    [screenToFlowPosition, addAgentToCanvas]
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<CanvasNodeData>) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div
      className="flex-1 h-full relative"
      style={{ backgroundColor: "var(--monad-bg)" }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {nodes.length === 0 && <EmptyCanvasState onLoadDemo={loadDemoFlow} />}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { stroke: "#836EF9", strokeWidth: 1.5, opacity: 0.5 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#2d2450"
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor="#836EF9"
          maskColor="rgba(13,8,32,0.7)"
        />
      </ReactFlow>
    </div>
  );
}
