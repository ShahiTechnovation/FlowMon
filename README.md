# ⚡ FlowMon

> **Visual Multi-Agent Orchestration. Built for chains that execute in parallel. Deployed for chains that don't sleep.**

```
███████╗██╗      ██████╗ ██╗    ██╗    ███╗   ███╗ ██████╗ ███╗   ██╗
██╔════╝██║     ██╔═══██╗██║    ██║    ████╗ ████║██╔═══██╗████╗  ██║
█████╗  ██║     ██║   ██║██║ █╗ ██║    ██╔████╔██║██║   ██║██╔██╗ ██║
██╔══╝  ██║     ██║   ██║██║███╗██║    ██║╚██╔╝██║██║   ██║██║╚██╗██║
██║     ███████╗╚██████╔╝╚███╔███╔╝    ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║
╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝     ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
```

[![Monad](https://img.shields.io/badge/Monad-Native-836EF9?style=for-the-badge)](https://monad.xyz)
[![Agents](https://img.shields.io/badge/Agents-43-836EF9?style=for-the-badge)](./src/data/agent-registry.ts)
[![TPS](https://img.shields.io/badge/Built_For-10k_TPS-836EF9?style=for-the-badge)](https://monad.xyz)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?style=for-the-badge)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

---

## gm anon.

You're writing glue code between 7 different protocols. Again.

Your pipeline script failed at step 4. Again.

The junior dev doesn't know what the pipeline even does. Again.

**ser, this is not the way.**

Monad executes 10,000 transactions per second in parallel. Your agent orchestration shouldn't be a 400-line bash script running sequentially in a tmux session on a $5 VPS.

**FlowMon is the coordination layer Web3 never had. Drag. Wire. Ship. On-chain. Now.**

---

## what is this

FlowMon is a **visual multi-agent orchestration platform** where you drag protocol agents onto a canvas, wire them together, hit Run, and watch your entire Web3 pipeline execute with live data.

No SDK glue. No boilerplate. No imperative scripts that break when one API changes its schema.

Just nodes. Edges. Real execution. Real data.

```
[Chainlink Oracle] ──→ [Lido Vault Monitor] ──→ [Uniswap Quoter] ──→ [Base TX Executor]
      $2,148                   2.42% APR              route built            tx confirmed
```

**That whole thing? Built in 45 seconds. No code written.**

---

## why monad

Monad runs the EVM with **optimistic parallel execution**. Agents that don't depend on each other can fire simultaneously. Your pipeline doesn't wait for block N+1 when it doesn't have to.

Most orchestration platforms were designed for Ethereum mainnet — sequential, slow, expensive. FlowMon's execution engine is built with the same mental model as Monad's runtime:

- resolve the dependency graph
- execute everything that can run in parallel
- propagate outputs downstream only when they're ready
- never block unnecessarily

When you deploy on Monad, your FlowMon pipelines stop being "sequential scripts with API calls" and start being actual parallel compute graphs. That's the unlock.

```
Traditional pipeline:     ████░░░░░░░░░░░░░░░░░░░░  (one agent at a time, ser)
FlowMon on Monad:         ████████████████████████  (parallel where possible, ngmi if you stay sequential)
```

---

## 43 agents. 23 protocols. 0 mock responses.

Every agent in FlowMon hits a **real external endpoint**. No hardcoded return values. No fake data to impress judges.

| Category | Agents |
|---|---|
| DeFi | Uniswap v3/v4 Swap, Permit2 Approver, Pool Quoter, Lido Staker, Vault Monitor, Yield Treasury, Celo Stable Transfer, Bond Credit Issuer, Zyfai Intent Solver |
| Identity | SELF Protocol, ENS Resolver, ENS Agent Registrar, ERC-8004 Trust Verifier |
| Wallets & Payments | Bankr Wallet, Bankr Balance Checker, Bankr AI Agent, MoonPay Bridge, MoonPay Swap, MoonPay OpenWallet |
| Governance | Snapshot DAO Voter, Octant Impact Evaluator, Octant Grant Allocator |
| AI & Reasoning | Venice Private Reasoner, Venice Yield Strategist, Uniswap Strategy Advisor, Olas Mech Requester |
| Access Control | Lit Access Control, Lit PKP Signer, MetaMask Delegation, Delegate Scope, Sub-Delegation |
| Infrastructure | Base TX Executor, EigenCloud Verifiable Exec, Chainlink Price Oracle, Olas Agent Service |
| NFTs | SuperRare Lister, SuperRare Bidder |
| Analytics | Markee Campaign Tracker, Arkhai Data Verifier |
| Core | Orchestrator, Super Agent Composer |

Live data confirmed: ETH at $2,148.04. stETH APR at 2.42%. Bankr wallet balance at $154.85. This isn't a demo. It's live.

---

## architecture

```
┌─────────────────────────────── FlowMon ──────────────────────────────────┐
│                                                                            │
│   Registry Sidebar          Flow Canvas               Execution Engine     │
│   ─────────────────    ─────────────────────    ──────────────────────    │
│   43 agents             @xyflow/react nodes      Topological sort          │
│   search + filter        drag-and-drop            AMP message propagation  │
│   category tags          connect handles          Per-agent POST route      │
│                                                                            │
│   Inspector Panel           Execution Log          External APIs            │
│   ─────────────────    ─────────────────────    ──────────────────────    │
│   params editor             real-time trace        Chainlink  Lido          │
│   negotiate tab             data snippets          Uniswap    Snapshot      │
│   result viewer             error details          ENS        MetaMask      │
│                                                    Base       Bankr         │
│                                                    Venice.ai  Olas          │
└────────────────────────────────────────────────────────────────────────────┘
```

### the stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.1 |
| Runtime | React 19 |
| Types | TypeScript (strict, 0 errors) |
| Canvas | @xyflow/react |
| State | Zustand |
| Wallet | RainbowKit + wagmi + viem |
| AI | Venice.ai (llama-3.3-70b, zero retention) |
| Styling | Tailwind CSS v4 |
| Deploy | Vercel (Fluid Compute, 60s maxDuration) |

---

## AMP — Agent Message Protocol

Every agent speaks the same language. One agent's `outputs` become the next agent's `inputs`. No adapter code. No schema mapping. No glue.

**Request:**
```json
{
  "agentId": "chainlink-price-oracle",
  "inputs": { "fromUpstream": { "pair": "ETH/USD" } },
  "parameters": { "pair": "ETH/USD" },
  "context": { "flowId": "flow_abc123", "nodeId": "node_001" }
}
```

**Response:**
```json
{
  "success": true,
  "agentId": "chainlink-price-oracle",
  "outputs": { "price": 2148.04, "pair": "ETH/USD", "source": "Chainlink" },
  "metadata": { "executionTime": 312, "apiCallsMade": 1, "cached": false }
}
```

Node A's `price: 2148.04` flows directly into Node B's inputs. Zero glue code. This is the only sane way to build multi-agent systems.

---

## example pipelines

### yield optimizer (the classic)

```
[Chainlink Oracle]
ETH = $2,148
       ↓
[Lido Vault Monitor]
APR = 2.42%, vault healthy
       ↓
[Venice Yield Strategist]
→ COMPOUND (private inference, zero retention)
       ↓
[Bankr Yield Executor]
staking 0.1 ETH
       ↓
[Base TX Executor]
tx confirmed ✓
```

### identity-gated DAO grants

```
[SELF Identity] → sybil check passed
[Snapshot Voter] → 87% yes, quorum met
[ENS Resolver] → grantee.eth = 0x1234...
[Octant Allocator] → 500 cUSD allocated
[Celo Transfer] → sent ✓
```

### NFT acquisition agent

```
[Bankr Balance] → 0.072 ETH ($154.85)
[Chainlink Oracle] → ETH = $2,148
[SuperRare Lister] → Genesis #7, bid = 0.04 ETH
[SuperRare Bidder] → bid 0.05 ETH
[MetaMask Delegation] → EIP-7710 auth, gasless ✓
```

---

## run it locally

```bash
git clone https://github.com/leojay-net/agentflow
cd agentflow
pnpm install
```

Create `.env.local`:

```env
VENICE_API_KEY=your_key
BANKR_API_KEY=your_key
MOONPAY_SECRET_KEY=your_key
NEXT_PUBLIC_MOONPAY_API_KEY=your_key
LIT_PRIVATE_KEY=your_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Chainlink, Lido, Snapshot, ENS, Uniswap, SELF Protocol — all public endpoints. No key needed.

```bash
pnpm dev
# → http://localhost:3000
```

---

## API

```
POST /api/agents/[agentId]     → run any agent directly
POST /api/agent-execute        → flow execution router
POST /api/agents               → publish a flow as an agent
GET  /api/agents               → fetch community agents
```

```bash
# hit Chainlink live
curl -X POST http://localhost:3000/api/agents/chainlink-price-oracle \
  -H "Content-Type: application/json" \
  -d '{"inputs": {}, "parameters": {"pair": "ETH/USD"}}'

# → { "success": true, "outputs": { "price": 2148.04 } }
```

---

## project structure

```
src/
  app/
    api/
      agents/[agentId]/route.ts     ← 43 agent handlers
      agent-execute/route.ts        ← AMP propagation engine
    page.tsx                        ← canvas entry
  components/
    canvas/
      flow-canvas.tsx               ← @xyflow/react + drag-drop
      agent-node.tsx                ← node renderer
      inspector-panel.tsx           ← params + negotiate + result
      execution-log.tsx             ← real-time trace
    registry/
      registry-sidebar.tsx          ← searchable agent catalog
  data/
    agent-registry.ts               ← 43 agent definitions
  store/
    flow-store.ts                   ← Zustand: nodes, edges, execution state
  types/
    index.ts                        ← AMP types
```

---

## sponsor integrations

| Protocol | Agents | Live |
|---|---|---|
| Uniswap | 4 | Swap quote $2,147.08 |
| Lido | 3 | APR 2.42% |
| Chainlink | 1 | ETH $2,148 / BTC $70,405 |
| Bankr | 3 | $154.85 balance live |
| MetaMask | 3 | EIP-7710 delegation |
| Venice.ai | 2 | llama-3.3-70b, zero retention |
| MoonPay | 3 | Fiat bridge + swap + wallet |
| ENS | 2 | Name resolution live |
| SELF Protocol | 1 | Attestation flow live |
| Snapshot | 1 | DAO vote query live |
| Base | 1 | L2 TX execution |
| Lit Protocol | 2 | Access control + PKP |
| Olas | 2 | Agent deployment live |
| SuperRare | 2 | Listing + bidding live |
| EigenCloud | 1 | Verifiable compute |
| Octant | 2 | Impact scoring live |
| Celo | 1 | cUSD transfers live |
| ERC-8004 | 1 | Trust score verification |
| Zyfai | 1 | Intent routing |
| Arkhai | 1 | Data verification |
| Markee | 1 | Campaign tracking |
| Bond Protocol | 1 | Credit instruments |

---

## ngmi if you're still writing glue code. wagmi if you're on FlowMon.

---

*Built for Monad Blitz Hackathon. Powered by Monad energy. Deployed at the speed of parallel EVM.*

**MIT License**