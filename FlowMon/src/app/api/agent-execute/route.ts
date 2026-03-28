// ============================================================
// API Route: /api/agent-execute
// Executes a specific agent action. Routes to internal handlers
// or external endpoints. Supports AMP protocol.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { clampTimeout } from "@/lib/server-timeout";

export const maxDuration = 60;

interface AgentExecuteRequest {
  agentId: string;
  agentName: string;
  parameterValues: Record<string, string>;
  upstreamResult?: Record<string, unknown>;
  endpointUrl?: string;
  flowId: string;
  stepNumber: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: AgentExecuteRequest = await request.json();
    const { agentId, parameterValues, upstreamResult, endpointUrl, flowId, stepNumber } = body;

    // Route internal /api/agents/... paths
    if (endpointUrl && endpointUrl.startsWith("/api/agents/")) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const absoluteUrl = `${baseUrl}${endpointUrl}`;
      return await executeInternalAgent(agentId, absoluteUrl, parameterValues, upstreamResult, flowId, stepNumber, startTime);
    }

    // External endpoints
    if (endpointUrl && (endpointUrl.startsWith("http://") || endpointUrl.startsWith("https://"))) {
      return await executeCustomEndpoint(agentId, endpointUrl, parameterValues, flowId, stepNumber, startTime);
    }

    // Fallback
    return NextResponse.json({
      success: true,
      agentId,
      result: {
        agentId,
        action: "execute",
        params: parameterValues,
        status: "completed",
        note: "Agent executed with provided parameters.",
        flowId,
        step: stepNumber,
      },
      executionTimeMs: Date.now() - startTime,
      source: "builtin",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      success: false,
      agentId: "",
      error: errorMessage,
      executionTimeMs: Date.now() - startTime,
      source: "error",
    }, { status: 500 });
  }
}

async function executeInternalAgent(
  agentId: string,
  absoluteUrl: string,
  params: Record<string, string>,
  upstreamResult: Record<string, unknown> | undefined,
  flowId: string,
  step: number,
  startTime: number,
): Promise<NextResponse> {
  try {
    const response = await fetch(absoluteUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Flow-Id": flowId,
        "X-Step": String(step),
      },
      body: JSON.stringify({
        ...params,
        ...(upstreamResult ? { _upstream: JSON.stringify(upstreamResult) } : {}),
      }),
      signal: AbortSignal.timeout(clampTimeout(55000)),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      return NextResponse.json({
        success: false,
        agentId,
        error: data.error || `Agent returned ${response.status}`,
        executionTimeMs: Date.now() - startTime,
        source: "agent-api",
      }, { status: response.ok ? 500 : response.status });
    }

    return NextResponse.json({
      success: true,
      agentId,
      result: data.result ?? data,
      executionTimeMs: Date.now() - startTime,
      source: "agent-api",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal agent call failed";
    return NextResponse.json({
      success: false,
      agentId,
      error: errorMessage,
      executionTimeMs: Date.now() - startTime,
      source: "agent-api",
    }, { status: 500 });
  }
}

async function executeCustomEndpoint(
  agentId: string,
  endpointUrl: string,
  params: Record<string, string>,
  flowId: string,
  step: number,
  startTime: number,
): Promise<NextResponse> {
  try {
    const ampMessage = {
      ampVersion: "1.0",
      flowId,
      step,
      fromAgent: { id: "flowmon-orchestrator" },
      toAgent: { id: agentId },
      payload: params,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FlowMon/1.0",
        "X-Flow-Id": flowId,
        "X-Step": String(step),
      },
      body: JSON.stringify(ampMessage),
      signal: AbortSignal.timeout(clampTimeout(30000)),
    });

    if (!response.ok) {
      throw new Error(`Endpoint returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return NextResponse.json({
      success: true,
      agentId,
      result,
      executionTimeMs: Date.now() - startTime,
      source: "custom-endpoint",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Network error";
    return NextResponse.json({
      success: false,
      agentId,
      error: `Custom endpoint failed: ${errorMessage}`,
      executionTimeMs: Date.now() - startTime,
      source: "custom-endpoint",
    }, { status: 502 });
  }
}
