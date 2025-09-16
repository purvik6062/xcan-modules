export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  status: "available" | "coming-soon";
  sections: Section[];
  badge?: {
    title: string;
    description: string;
    image: string;
  };
  capstoneProject?: {
    title: string;
    description: string;
    requirements: string[];
  };
}

export interface Section {
  id: string;
  title: string;
  type: "theory" | "hands-on" | "code-walkthrough" | "challenge" | "quiz";
  status: "available" | "coming-soon";
  content?: any;
  estimatedTime: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  requirements: string[];
  hints: string[];
  solution?: string;
}

export const defiChapters: Chapter[] = [
  {
    id: "intro-to-defi",
    title: "Introduction to DeFi",
    description:
      "Foundations: what DeFi is, TradFi vs DeFi, Arbitrum’s role, wallet setup, bridging, basic contract interactions, and a fundamentals quiz.",
    icon: "🎓",
    level: "Beginner",
    duration: "2-3 hours",
    status: "available",
    badge: {
      title: "DeFi Pioneer",
      description: "Completed Introduction to DeFi",
      image: "/badges/defi-pioneer.png",
    },
    sections: [
      {
        id: "what-is-defi",
        title: "What is DeFi?",
        type: "theory",
        status: "available",
        estimatedTime: "15 min",
      },
      {
        id: "centralized-vs-decentralized",
        title: "Centralized vs Decentralized Finance",
        type: "theory",
        status: "available",
        estimatedTime: "20 min",
      },
      {
        id: "arbitrum-in-defi",
        title: "Arbitrum's Role in DeFi",
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
      },
      {
        id: "setup-wallet",
        title: "Setting up MetaMask & Connecting to Arbitrum",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "bridge-assets",
        title: "Bridging Assets to Arbitrum",
        type: "theory",
        status: "available",
        estimatedTime: "20 min",
      },
      {
        id: "smart-contract-interaction",
        title: "Basic Smart Contract Interaction",
        type: "theory",
        status: "available",
        estimatedTime: "40 min",
      },
      {
        id: "send-tokens-example",
        title: "Token Transfer Code Examples",
        type: "theory",
        status: "available",
        estimatedTime: "15 min",
      },
      {
        id: "defi-basics-quiz",
        title: "DeFi Fundamentals Quiz",
        type: "quiz",
        status: "available",
        estimatedTime: "10 min",
      },
    ],
  },
  {
    id: "decentralized-exchanges",
    title: "Decentralized Exchanges (DEXs)",
    description:
      "DEXs: AMMs vs order books, Uniswap & SushiSwap, Arbitrum‑native GMX and Camelot, swapping mechanics, LPing, Uniswap integrations, arbitrage, and a DEX quiz.",
    icon: "🔄",
    level: "Beginner",
    duration: "3-4 hours",
    status: "available",
    badge: {
      title: "DEX Master",
      description: "Mastered Decentralized Exchanges",
      image: "/badges/dex-master.png",
    },
    sections: [
      {
        id: "amm-vs-orderbook",
        title: "AMMs vs Order Books",
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
      },
      {
        id: "uniswap-sushiswap",
        title: "Uniswap & SushiSwap on Arbitrum",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "arbitrum-native-dexs",
        title: "Arbitrum-Native DEXs: GMX & Camelot",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
      },
      {
        id: "token-swapping",
        title: "Token Swapping Concepts & Code",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "liquidity-provision",
        title: "Liquidity Provision Concepts & Code",
        type: "theory",
        status: "available",
        estimatedTime: "45 min",
      },
      {
        id: "uniswap-smart-contracts",
        title: "Uniswap Contract Integration Examples",
        type: "theory",
        status: "available",
        estimatedTime: "50 min",
      },
      {
        id: "arbitrage-challenge",
        title: "Understanding AMM Arbitrage",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "dex-mastery-quiz",
        title: "DEX Knowledge Quiz",
        type: "quiz",
        status: "available",
        estimatedTime: "15 min",
      },
    ],
  },
  {
    id: "vaults-yield-aggregation",
    title: "Vaults & Yield Aggregation",
    description:
      "Vaults: concepts and types, automated yield strategies, Arbitrum platforms (Yearn, Beefy), deposits/withdrawals, performance monitoring, simulator concepts, and a yield quiz.",
    icon: "🏛️",
    level: "Intermediate",
    duration: "4-5 hours",
    status: "available",
    badge: {
      title: "Yield Farmer",
      description: "Mastered Yield Aggregation",
      image: "/badges/yield-farmer.png",
    },
    sections: [
      {
        id: "what-are-vaults",
        title: "Understanding Yield Vaults",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "yield-strategies",
        title: "Automated Yield Strategies",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
      },
      {
        id: "arbitrum-vault-platforms",
        title: "Yearn, Beefy & Enzyme on Arbitrum",
        type: "theory",
        status: "available",
        estimatedTime: "40 min",
      },
      {
        id: "vault-deposits",
        title: "Vault Deposit Concepts & Code",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
      },
      {
        id: "yield-monitoring",
        title: "Vault Performance Monitoring Concepts",
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
      },
      {
        id: "vault-smart-contracts",
        title: "Vault Smart Contract Deep Dive",
        type: "theory",
        status: "available",
        estimatedTime: "60 min",
      },
      {
        id: "vault-simulator",
        title: "Vault Strategy Simulator (Concept)",
        type: "theory",
        status: "available",
        estimatedTime: "45 min",
      },
      {
        id: "yield-farming-quiz",
        title: "Yield Farming Quiz",
        type: "quiz",
        status: "available",
        estimatedTime: "12 min",
      },
    ],
  },
  {
    id: "risks-security",
    title: "Risks & Security in DeFi",
    description:
      "Security: impermanent loss, common DeFi risks, audits, vulnerability analysis, major hack case studies, secure coding, methodology, and a security quiz.",
    icon: "🛡️",
    level: "Intermediate",
    duration: "3-4 hours",
    status: "available",
    badge: {
      title: "Security Expert",
      description: "Mastered DeFi Security",
      image: "/badges/security-expert.png",
    },
    sections: [
      {
        id: "impermanent-loss",
        title: "Understanding Impermanent Loss",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "common-defi-risks",
        title: "Common DeFi Risks & Attacks",
        type: "theory",
        status: "available",
        estimatedTime: "40 min",
      },
      {
        id: "smart-contract-audits",
        title: "Smart Contract Audits & Best Practices",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
      },
      {
        id: "contract-analysis",
        title: "Smart Contract Vulnerability Analysis",
        type: "theory",
        status: "available",
        estimatedTime: "50 min",
      },
      {
        id: "defi-hack-case-studies",
        title: "Case Studies: Major DeFi Hacks",
        type: "theory",
        status: "available",
        estimatedTime: "45 min",
      },
      {
        id: "secure-coding-practices",
        title: "Implementing Security Best Practices",
        type: "theory",
        status: "available",
        estimatedTime: "60 min",
      },
      {
        id: "vulnerability-hunt",
        title: "Finding Vulnerabilities (Methodology)",
        type: "theory",
        status: "available",
        estimatedTime: "40 min",
      },
      {
        id: "security-quiz",
        title: "DeFi Security Quiz",
        type: "quiz",
        status: "available",
        estimatedTime: "15 min",
      },
    ],
  },
  {
    id: "ai-defi",
    title: "AI & DeFi Integration",
    description:
      "AI x DeFi: applications, portfolio management, predictive trading, tools and workflows, modeling best practices, bot architecture and safety, plus an AI‑DeFi quiz.",
    icon: "🤖",
    level: "Advanced",
    duration: "4-6 hours",
    status: "available",
    badge: {
      title: "AI DeFi Pioneer",
      description: "Mastered AI-DeFi Integration",
      image: "/badges/ai-defi-pioneer.png",
    },
    sections: [
      { id: "ai-in-defi-overview", title: "AI Applications in DeFi", type: "theory", status: "available", estimatedTime: "45 min" },
      { id: "portfolio-management-ai", title: "AI-Powered Portfolio Management", type: "theory", status: "available", estimatedTime: "55 min" },
      { id: "predictive-trading", title: "Predictive Trading & Liquidation Protection", type: "theory", status: "available", estimatedTime: "60 min" },
      { id: "ai-tools-practice", title: "Using AI Tools for DeFi Analysis", type: "theory", status: "available", estimatedTime: "40 min" },
      { id: "price-prediction-model", title: "Building a Price Prediction Model", type: "theory", status: "available", estimatedTime: "60 min" },
      { id: "trading-bot-challenge", title: "Trading Bots: Architecture & Limits", type: "theory", status: "available", estimatedTime: "45 min" },
      { id: "ai-defi-quiz", title: "AI & DeFi Mastery Quiz", type: "quiz", status: "available", estimatedTime: "25 min" },
    ],
  },
  {
    id: "build-defi-app",
    title: "Build Your First DeFi App",
    description:
      "dApp assembly: environment setup, Solidity patterns, deployment concepts, frontend integration, contract interaction flows, DEX integration concepts, and a build quiz.",
    icon: "🚀",
    level: "Advanced",
    duration: "6-8 hours",
    status: "available",
    badge: {
      title: "DeFi Builder",
      description: "Built and deployed a DeFi application",
      image: "/badges/defi-builder.png",
    },
    sections: [
      { id: "development-environment", title: "Setting Up Development Environment", type: "theory", status: "available", estimatedTime: "30 min" },
      { id: "solidity-defi-basics", title: "Solidity for DeFi Development", type: "theory", status: "available", estimatedTime: "45 min" },
      { id: "smart-contract-deployment", title: "Deployment Concepts & Code Examples", type: "theory", status: "available", estimatedTime: "40 min" },
      { id: "frontend-integration", title: "Frontend Integration Concepts & Code", type: "theory", status: "available", estimatedTime: "60 min" },
      { id: "contract-interaction", title: "Smart Contract & Frontend Integration", type: "theory", status: "available", estimatedTime: "45 min" },
      { id: "dex-integration", title: "Integrating with DEX Protocols (Concept)", type: "theory", status: "available", estimatedTime: "45 min" },
      { id: "capstone-project", title: "Capstone: Putting It All Together", type: "theory", status: "coming-soon", estimatedTime: "25 min" },
      { id: "build-defi-app-quiz", title: "Build dApp Mastery Quiz", type: "quiz", status: "available", estimatedTime: "25 min" },
    ],
    capstoneProject: {
      title: "Complete DeFi Application",
      description:
        "Build and deploy a fully functional DeFi application that demonstrates mastery of all learned concepts",
      requirements: [
        "Smart contract with multiple DeFi integrations",
        "Modern React/Next.js frontend",
        "Wallet connection and transaction handling",
        "Integration with at least 2 DeFi protocols",
        "Deployment to Arbitrum testnet",
        "Documentation and README",
      ],
    },
  },
];

// Quiz questions for each chapter
export const quizQuestions: { [chapterId: string]: Quiz[] } = {
  "intro-to-defi": [
    {
      id: "q1",
      question: "What is the main advantage of DeFi over traditional finance?",
      options: [
        "Higher returns guaranteed",
        "No regulatory oversight",
        "Accessibility and transparency without intermediaries",
        "Faster transaction processing",
      ],
      correctAnswer: 2,
      explanation:
        "DeFi's main advantage is providing financial services without traditional intermediaries, increasing accessibility and transparency.",
    },
    {
      id: "q2",
      question: "Why is Arbitrum important for DeFi?",
      options: [
        "It's the only Layer 2 solution",
        "It reduces gas fees and increases transaction speed",
        "It provides better security than Ethereum",
        "It supports more programming languages",
      ],
      correctAnswer: 1,
      explanation:
        "Arbitrum is a Layer 2 scaling solution that significantly reduces gas fees and increases transaction throughput while maintaining Ethereum's security.",
    },
    {
      id: "q3",
      question:
        "What is the total value locked (TVL) in Arbitrum's DeFi ecosystem approximately?",
      options: [
        "$1.2 billion",
        "$2.5 billion",
        "$5.8 billion",
        "$10.3 billion",
      ],
      correctAnswer: 1,
      explanation:
        "Arbitrum has approximately $2.527 billion in total value locked, indicating a strong and active DeFi ecosystem.",
    },
  ],
  "decentralized-exchanges": [
    {
      id: "q1",
      question: "How do Automated Market Makers (AMMs) determine token prices?",
      options: [
        "Based on order book depth",
        "Using external price oracles",
        "Through mathematical formulas based on liquidity ratios",
        "Set by the platform administrators",
      ],
      correctAnswer: 2,
      explanation:
        "AMMs use mathematical formulas (like x*y=k) based on the ratio of tokens in liquidity pools to automatically determine prices.",
    },
    {
      id: "q2",
      question: "What makes GMX unique among DEXs on Arbitrum?",
      options: [
        "It only supports spot trading",
        "It offers perpetual futures trading with real asset backing",
        "It has the lowest fees",
        "It supports the most token pairs",
      ],
      correctAnswer: 1,
      explanation:
        "GMX is unique because it offers perpetual futures trading backed by a multi-asset pool, providing real asset backing for leveraged positions.",
    },
  ],
  "vaults-yield-aggregation": [
    {
      id: "q1",
      question: "What is the primary purpose of yield aggregation vaults?",
      options: [
        "To provide insurance for DeFi protocols",
        "To automatically optimize yields across multiple protocols",
        "To store tokens safely",
        "To provide leverage for trading",
      ],
      correctAnswer: 1,
      explanation:
        "Yield aggregation vaults automatically move funds between different protocols to maximize returns and compound yields efficiently.",
    },
  ],
  "risks-security": [
    {
      id: "q1",
      question: "What is impermanent loss?",
      options: [
        "Permanent loss of funds due to smart contract bugs",
        "Temporary reduction in value due to market volatility",
        "Loss relative to holding tokens versus providing liquidity when prices diverge",
        "Loss due to high gas fees",
      ],
      correctAnswer: 2,
      explanation:
        "Impermanent loss occurs when the price ratio of tokens in a liquidity pool changes, potentially resulting in less value than simply holding the tokens.",
    },
    {
      id: "q2",
      question: "Why are smart contract audits crucial in DeFi?",
      options: [
        "They guarantee no bugs exist",
        "They're required by regulations",
        "They help identify vulnerabilities before deployment",
        "They increase token prices",
      ],
      correctAnswer: 2,
      explanation:
        "Smart contract audits are crucial because they help identify potential vulnerabilities and security issues before contracts are deployed with real funds.",
    },
  ],
  "ai-defi": [
    {
      id: "q1",
      question: "Why is walk-forward validation preferred for time series?",
      options: [
        "It uses random shuffles",
        "It respects temporal ordering and avoids leakage",
        "It is faster",
        "It guarantees alpha",
      ],
      correctAnswer: 1,
      explanation:
        "Walk-forward validation preserves chronology to avoid look-ahead bias.",
    },
    {
      id: "q2",
      question: "Which feature is MOST relevant for liquidation risk?",
      options: [
        "Wallet avatar",
        "Orderbook imbalance",
        "Theme color",
        "Screen size",
      ],
      correctAnswer: 1,
      explanation:
        "Liquidity and imbalance metrics drive liquidation cascades.",
    },
    {
      id: "q3",
      question: "What does turnover control mitigate in backtests?",
      options: [
        "Fees and slippage amplification",
        "Coin inflation",
        "RPC errors",
        "MEV bundles",
      ],
      correctAnswer: 0,
      explanation:
        "High turnover inflates transaction costs and degrades live performance.",
    },
    {
      id: "q4",
      question: "Which validation pitfall is MOST dangerous in DeFi ML?",
      options: [
        "Shuffling time-series",
        "Splitting by address",
        "Using pandas",
        "GPU acceleration",
      ],
      correctAnswer: 0,
      explanation:
        "Random shuffles leak future data into the train set.",
    },
    {
      id: "q5",
      question: "Best practice to prevent model overfitting on oracle-based features?",
      options: [
        "Use future prices",
        "Use lagged features and strict t-1 windows",
        "Resample to 1 second always",
        "Drop all features",
      ],
      correctAnswer: 1,
      explanation:
        "Lagging features and strict horizons avoid peeking into the future.",
    },
    {
      id: "q6",
      question: "What is a safe assumption about AI trading bots?",
      options: [
        "They replace risk management",
        "They need explicit circuit breakers and limits",
        "They never incur fees",
        "They eliminate MEV",
      ],
      correctAnswer: 1,
      explanation:
        "Bots must implement hard limits and emergency stops.",
    },
  ],
  "build-defi-app": [
    {
      id: "q1",
      question: "Which config is REQUIRED to deploy to Arbitrum Sepolia?",
      options: [
        "RPC URL, chainId, and funded private key",
        "Only RPC URL",
        "Only chainId",
        "None; defaults work",
      ],
      correctAnswer: 0,
      explanation: "You must set RPC, correct chainId, and an account with funds.",
    },
    {
      id: "q2",
      question: "Safest approach for ERC-20 approvals in a swap UI?",
      options: [
        "Approve unlimited always",
        "Approve exact amount needed per action",
        "Never ask for approval",
        "Approve once per week",
      ],
      correctAnswer: 1,
      explanation: "Approving minimal amounts reduces exposure if a spender is compromised.",
    },
    {
      id: "q3",
      question: "Where should you apply slippage protection?",
      options: [
        "On the read-only balance call",
        "On the swap transaction via minAmountOut",
        "On wallet connect",
        "On EOA generation",
      ],
      correctAnswer: 1,
      explanation: "minAmountOut guards execution against price movement.",
    },
    {
      id: "q4",
      question: "A user is on Ethereum Mainnet, but your app targets Arbitrum. What do you do?",
      options: [
        "Proceed anyway",
        "Silently fail",
        "Show a prompt to switch network to Arbitrum",
        "Block the user",
      ],
      correctAnswer: 2,
      explanation: "Prompting a guided network switch is best practice.",
    },
    {
      id: "q5",
      question: "What UI state transitions are appropriate for a write action?",
      options: [
        "idle → approving → pending → success/error",
        "idle → success",
        "pending → idle only",
        "error → success → idle",
      ],
      correctAnswer: 0,
      explanation: "Explicit states reduce mistakes and improve UX.",
    },
    {
      id: "q6",
      question: "What is the safest way to handle stuck transactions?",
      options: [
        "Spam resubmits",
        "Increase gas without context",
        "Guide user to replace-with-higher-fee or reset nonce if needed",
        "Ignore it",
      ],
      correctAnswer: 2,
      explanation: "Replacing or resetting nonce under guidance is the safe approach.",
    },
  ],
};
