"use client";

import { ReactFlowProvider } from "@xyflow/react";
import Providers from "../providers";
import RegistrySidebar from "@/components/registry/registry-sidebar";
import FlowCanvas from "@/components/canvas/flow-canvas";
import InspectorPanel from "@/components/canvas/inspector-panel";
import Toolbar from "@/components/canvas/toolbar";
import ExecutionLog from "@/components/canvas/execution-log";
import AgentXPanel from "@/components/agent-x/agent-x-panel";
import PipelineSaveModal from "@/components/ui/pipeline-save-modal";

export default function CanvasPage() {
  return (
    <Providers>
      <ReactFlowProvider>
        <div className="flex h-screen w-screen flex-col overflow-hidden" style={{ background: "var(--bg-base)" }}>
          <Toolbar />
          <div className="flex flex-1 overflow-hidden">
            <RegistrySidebar />
            <main className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <FlowCanvas />
              </div>
              <ExecutionLog />
            </main>
            <InspectorPanel />
          </div>
          <AgentXPanel />
          <PipelineSaveModal />
        </div>
      </ReactFlowProvider>
    </Providers>
  );
}
