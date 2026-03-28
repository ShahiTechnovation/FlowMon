"use client";

import { useState } from "react";
import Link from "next/link";
import { AGENT_REGISTRY, CATEGORY_COLORS } from "@/data/agent-registry";

/* ── Navbar ────────────────────────────────────────────────── */
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4" style={{ background: "var(--bg-base)", borderBottom: "1px solid #836EF918" }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--purple-primary)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
        </div>
        <span className="font-heading text-[14px]" style={{ color: "var(--purple-primary)" }}>FLOWMON</span>
      </div>
      <div className="flex items-center gap-4">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[13px] transition-colors" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains), monospace" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
          GitHub
        </a>
        <Link href="/app" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-[13px] font-medium transition-colors" style={{ background: "var(--purple-primary)", color: "var(--bg-base)", fontFamily: "var(--font-jetbrains), monospace" }} onMouseEnter={e => (e.currentTarget.style.background = "#9d88fb")} onMouseLeave={e => (e.currentTarget.style.background = "var(--purple-primary)")}>
          Launch App →
        </Link>
      </div>
    </nav>
  );
}

/* ── Hero ──────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6" style={{ minHeight: "calc(100vh - 64px)" }}>
      <p className="text-[11px] tracking-[3px] mb-8" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains), monospace", letterSpacing: "3px" }}>
        {"//"} MONAD NATIVE · VISUAL MULTI-AGENT ORCHESTRATION
      </p>

      <h1 className="font-heading text-[44px] leading-[1.3] mb-6" style={{ color: "var(--purple-primary)" }}>
        FLOWMON
      </h1>

      <p className="text-[15px] leading-relaxed max-w-[520px] mb-10" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-jetbrains), monospace" }}>
        Drag. Wire. Execute. 48 production agents across DeFi, identity, and governance — running in parallel on Monad.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/app" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-[13px] font-medium transition-colors" style={{ background: "var(--purple-primary)", color: "var(--bg-base)", fontFamily: "var(--font-jetbrains), monospace" }} onMouseEnter={e => (e.currentTarget.style.background = "#9d88fb")} onMouseLeave={e => (e.currentTarget.style.background = "var(--purple-primary)")}>
          Launch App →
        </Link>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-[13px] font-medium transition-colors" style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--purple-border)", fontFamily: "var(--font-jetbrains), monospace" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple-primary)"; e.currentTarget.style.color = "var(--text-primary)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--purple-border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
          GitHub ↗
        </a>
      </div>

      <p className="text-[12px] mt-8" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains), monospace" }}>
        No glue code. No boilerplate. Real API calls. Real data.
      </p>
    </section>
  );
}

/* ── Install Command Strip ─────────────────────────────────── */
function CommandStrip() {
  const [activeTab, setActiveTab] = useState(0);
  const commands = [
    "npx flowmon list-agents",
    'npx flowmon build "yield optimizer with Lido and Uniswap"',
  ];
  const tabs = ["All Agents", "Tell your Agent"];

  return (
    <section className="flex flex-col items-center px-6 mt-12">
      <div className="flex gap-0">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className="px-5 py-2.5 text-[12px] transition-colors"
            style={{
              color: activeTab === i ? "var(--purple-primary)" : "var(--text-muted)",
              borderBottom: activeTab === i ? "2px solid var(--purple-primary)" : "2px solid transparent",
              background: "transparent",
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4 px-6 py-4 rounded-md max-w-[640px] w-full" style={{ background: "var(--bg-surface)", border: "1px solid var(--purple-border)" }}>
        <code className="text-[14px]" style={{ color: "var(--text-code)", fontFamily: "var(--font-jetbrains), monospace" }}>
          {commands[activeTab]}<span className="cursor-blink" />
        </code>
      </div>
    </section>
  );
}

/* ── Works With Strip ──────────────────────────────────────── */
function WorksWith() {
  const protocols = ["Monad", "Uniswap", "Lido", "Chainlink", "ENS", "MetaMask", "Venice.ai", "Base", "Bankr"];

  return (
    <section className="flex flex-col items-center px-6 mt-16">
      <p className="text-[11px] tracking-[2px] mb-6" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains), monospace" }}>
        WORKS WITH
      </p>
      <div className="flex items-center gap-6 flex-wrap justify-center">
        {protocols.map((p) => (
          <span
            key={p}
            className="text-[12px] transition-all cursor-default"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains), monospace", opacity: 0.5 }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            {p}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ── Feature Grid ──────────────────────────────────────────── */
const FEATURES = [
  { icon: "⚡", title: "Parallel Execution", body: "Independent agents fire simultaneously — Kahn's algorithm, Promise.all(). Built for Monad's parallel EVM." },
  { icon: "🔌", title: "48 Live Agents", body: "Every agent hits a real external API. Chainlink prices. Lido APR. Uniswap quotes. Zero mock data." },
  { icon: "🤖", title: "Agent X", body: 'Type "build me a yield optimizer" — Agent X wires the full pipeline on the canvas automatically.' },
  { icon: "🟣", title: "Monad Native", body: "MON balance, Monad TX executor, contract reader — five agents purpose-built for the Monad testnet." },
  { icon: "🔗", title: "AMP Protocol", body: "Standardized JSON envelopes. One agent's output is the next agent's input. No glue code ever." },
  { icon: "💾", title: "Pipeline Saves", body: "Name and save any pipeline. Auto-restored on reload. Share via export. Build once, run forever." },
  { icon: "🔍", title: "Real-time Logs", body: "Execution trace with timestamps, parallel groups color-coded, error messages surfaced immediately." },
  { icon: "🔑", title: "No Lock-in", body: "MIT license. Self-host. Add your own agents. Publish to the community registry." },
];

function FeatureGrid() {
  return (
    <section className="flex flex-col items-center px-6 mt-24">
      <p className="text-[11px] tracking-[3px] mb-10" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains), monospace" }}>
        {"//"} WHY FLOWMON
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[920px] w-full">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="p-6 rounded-[10px] transition-all"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--purple-border)" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--purple-primary)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--purple-border)")}
          >
            <span className="text-[20px] block mb-3">{f.icon}</span>
            <h3 className="text-[14px] font-medium mb-2" style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains), monospace" }}>{f.title}</h3>
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-jetbrains), monospace" }}>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── How It Works ──────────────────────────────────────────── */
const STEPS = [
  { num: "01", title: "Drag agents", body: "Pick from 48 protocol agents in the sidebar. Drag onto the visual canvas." },
  { num: "02", title: "Wire them", body: "Draw connections to define data flow. Outputs become inputs automatically via AMP." },
  { num: "03", title: "Execute", body: "Hit Run. Parallel groups fire simultaneously. Watch live data stream in real-time." },
];

function HowItWorks() {
  return (
    <section className="flex flex-col items-center px-6 mt-24">
      <p className="text-[11px] tracking-[3px] mb-10" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains), monospace" }}>
        {"//"} HOW IT WORKS
      </p>
      <div className="flex flex-col md:flex-row items-stretch gap-4 max-w-[820px] w-full">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1 gap-4">
            <div className="flex-1 p-6 rounded-[10px]" style={{ background: "var(--bg-surface)", border: "1px solid var(--purple-border)" }}>
              <span className="font-heading text-[12px] block mb-3" style={{ color: "var(--purple-primary)" }}>{s.num}</span>
              <h3 className="text-[14px] font-medium mb-2" style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains), monospace" }}>{s.title}</h3>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-jetbrains), monospace" }}>{s.body}</p>
            </div>
            {i < STEPS.length - 1 && (
              <span className="hidden md:block text-[16px]" style={{ color: "var(--text-muted)" }}>→</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Agent Preview Strip ───────────────────────────────────── */
const PREVIEW_AGENTS = [
  "chainlink-price-oracle", "lido-staker", "uniswap-pool-quoter", "ens-name-resolver",
  "venice-private-reasoner", "monad-balance-checker", "snapshot-dao-voter", "bankr-agent-wallet",
  "metamask-delegation", "monad-gas-estimator",
];

function AgentPreview() {
  const agents = PREVIEW_AGENTS.map((id) => AGENT_REGISTRY.find((a) => a.id === id)).filter(Boolean);

  return (
    <section className="flex flex-col items-center px-6 mt-24">
      <p className="text-[11px] tracking-[3px] mb-10 text-center" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains), monospace" }}>
        {"//"} 48 AGENTS. 23 PROTOCOLS. 0 MOCK RESPONSES.
      </p>
      <div className="flex gap-3 overflow-x-auto pb-4 max-w-full w-full px-2" style={{ scrollbarWidth: "none" }}>
        {agents.map((agent) => {
          if (!agent) return null;
          const catColor = CATEGORY_COLORS[agent.category] ?? "var(--purple-primary)";
          const isLive = agent.status === "live";

          return (
            <div
              key={agent.id}
              className="flex-shrink-0 p-3 px-4 rounded-md min-w-[190px]"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--purple-border)" }}
            >
              <span className="text-[10px] tracking-[2px] block mb-1.5" style={{ color: catColor, fontFamily: "var(--font-jetbrains), monospace" }}>
                {agent.category.toUpperCase()}
              </span>
              <span className="text-[13px] font-medium block mb-1.5" style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains), monospace" }}>
                {agent.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="w-[6px] h-[6px] rounded-full inline-block" style={{ background: isLive ? "var(--green-live)" : "var(--amber-stub)" }} />
                <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains), monospace" }}>
                  {agent.sponsor}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── CTA ───────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="flex flex-col items-center text-center px-6 py-16 mt-24" style={{ background: "var(--bg-surface)", borderTop: "1px solid #836EF918", borderBottom: "1px solid #836EF918" }}>
      <h2 className="font-heading text-[22px] mb-5" style={{ color: "var(--purple-primary)" }}>SHIP YOUR PIPELINE</h2>
      <p className="text-[14px] leading-relaxed max-w-[420px] mb-8" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-jetbrains), monospace" }}>
        Everything you need to orchestrate Web3 agents. No backend. No infrastructure. No glue code.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/app" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-[13px] font-medium transition-colors" style={{ background: "var(--purple-primary)", color: "var(--bg-base)", fontFamily: "var(--font-jetbrains), monospace" }} onMouseEnter={e => (e.currentTarget.style.background = "#9d88fb")} onMouseLeave={e => (e.currentTarget.style.background = "var(--purple-primary)")}>
          Launch App →
        </Link>
        <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-[13px] font-medium transition-colors" style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--purple-border)", fontFamily: "var(--font-jetbrains), monospace" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple-primary)"; e.currentTarget.style.color = "var(--text-primary)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--purple-border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
          Read the Docs
        </a>
      </div>
      <p className="text-[11px] mt-6" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains), monospace" }}>
        MIT License · Built for Monad Blitz Hackathon · Monad Testnet
      </p>
    </section>
  );
}

/* ── Footer ────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="flex items-center justify-between px-6 py-5" style={{ borderTop: "1px solid #836EF918" }}>
      <span className="text-[13px] font-medium" style={{ color: "var(--purple-primary)", fontFamily: "var(--font-jetbrains), monospace" }}>FLOWMON</span>
      <div className="flex items-center gap-4">
        {["MIT License", "Browse Agents", "GitHub", "Contribute"].map((link) => (
          <a
            key={link}
            href="#"
            className="text-[12px] transition-colors"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains), monospace" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--purple-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            {link}
          </a>
        ))}
      </div>
      <span className="text-[11px] hidden md:block" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains), monospace" }}>Anonymous download tracking</span>
    </footer>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <CommandStrip />
      <WorksWith />
      <FeatureGrid />
      <HowItWorks />
      <AgentPreview />
      <CTA />
      <Footer />
    </div>
  );
}
