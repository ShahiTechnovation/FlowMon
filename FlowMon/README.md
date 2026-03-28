<div align="center">
  <img src="public/images/logo.png" alt="FlowMon Logo" width="200"/>
</div>

# FlowMon

FlowMon is a Monad-native multi-agent orchestrator with a professional, dark-themed UI. The platform enables users to build DeFi yield pipelines (e.g., Lido staking, Uniswap swaps) through an intuitive canvas interface powered by AI agents.

## Features

- **DeFi Yield Pipeline Builder:** Drag-and-drop canvas interface for orchestrating multi-step DeFi transactions on the Monad network.
- **Venice AI Integration:** Embedded AI agents to generate strategies, analyze portfolios, and assist with complex flows.
- **Monad-Native Aesthetics:** Features a professional dark mode design system, stylized with 'Press Start 2P' and 'JetBrains Mono' typography.
- **Web3 Ready:** Fully integrated with `wagmi`, `viem`, and RainbowKit for seamless wallet connectivity.
- **Multi-Agent Orchestration:** Coordinate different specialized agents seamlessly behind the scenes.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (v4)
- **Web3 Interaction:** wagmi, viem, RainbowKit
- **Canvas/Node UI:** React Flow (`@xyflow/react`)
- **State Management:** Zustand
- **AI Integration:** Venice AI API (Primary), Gemini (Fallback)

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- `pnpm` (installed via `npm install -g pnpm` or `corepack enable pnpm`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd FlowMon
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.local.example` file to create your local environment setting:
   ```bash
   cp .env.local.example .env.local
   ```
   *Essential keys to configure for full functionality include:*
   - `VENICE_API_KEY`: Required for the primary Venice AI agent experience.
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Required for RainbowKit wallet connections.

4. **Run the Development Server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to explore the platform.

## Deployment

FlowMon is optimized for zero-config deployments on **Vercel**.

1. Connect your repository to Vercel.
2. Vercel will automatically detect the Next.js framework.
3. Add the necessary Environment Variables from your `.env.local`.
4. Click **Deploy**.
