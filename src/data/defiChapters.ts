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
      "Master the fundamentals of Decentralized Finance and understand how Arbitrum enhances the DeFi ecosystem",
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
        type: "hands-on",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "bridge-assets",
        title: "Bridging Assets to Arbitrum",
        type: "hands-on",
        status: "available",
        estimatedTime: "20 min",
      },
      {
        id: "smart-contract-interaction",
        title: "Basic Smart Contract Interaction",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "40 min",
      },
      {
        id: "send-tokens-challenge",
        title: "Send Tokens on Arbitrum",
        type: "challenge",
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
      "Learn how AMMs work, explore major DEXs on Arbitrum, and master token swapping and liquidity provision",
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
        title: "Swapping Tokens on DEXs",
        type: "hands-on",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "liquidity-provision",
        title: "Providing Liquidity",
        type: "hands-on",
        status: "available",
        estimatedTime: "45 min",
      },
      {
        id: "uniswap-smart-contracts",
        title: "Interacting with Uniswap Contracts",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "50 min",
      },
      {
        id: "arbitrage-challenge",
        title: "Execute an Arbitrage Trade",
        type: "challenge",
        status: "coming-soon",
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
      "Understand yield farming, vault mechanics, and automated strategies for maximizing DeFi returns",
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
        title: "Depositing into Vaults",
        type: "hands-on",
        status: "available",
        estimatedTime: "35 min",
      },
      {
        id: "yield-monitoring",
        title: "Monitoring Vault Performance",
        type: "hands-on",
        status: "available",
        estimatedTime: "25 min",
      },
      {
        id: "vault-smart-contracts",
        title: "Vault Smart Contract Deep Dive",
        type: "code-walkthrough",
        status: "coming-soon",
        estimatedTime: "60 min",
      },
      {
        id: "vault-simulator",
        title: "Vault Strategy Simulator",
        type: "challenge",
        status: "coming-soon",
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
    capstoneProject: {
      title: "Build a Yield Optimizer",
      description:
        "Create a smart contract that automatically finds the best yield opportunities across different protocols",
      requirements: [
        "Compare yields across multiple protocols",
        "Implement automatic rebalancing",
        "Add fee calculation",
        "Create a simple UI",
      ],
    },
  },
  {
    id: "risks-security",
    title: "Risks & Security in DeFi",
    description:
      "Learn to identify and mitigate DeFi risks, understand security best practices, and analyze smart contract vulnerabilities",
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
        title: "Analyzing Smart Contracts for Vulnerabilities",
        type: "hands-on",
        status: "available",
        estimatedTime: "50 min",
      },
      {
        id: "defi-hack-case-studies",
        title: "Case Studies: Major DeFi Hacks",
        type: "hands-on",
        status: "available",
        estimatedTime: "45 min",
      },
      {
        id: "secure-coding-practices",
        title: "Implementing Security Best Practices",
        type: "code-walkthrough",
        status: "coming-soon",
        estimatedTime: "60 min",
      },
      {
        id: "vulnerability-hunt",
        title: "Find the Vulnerability",
        type: "challenge",
        status: "coming-soon",
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
      "Explore how artificial intelligence enhances DeFi through automated trading, portfolio management, and predictive analytics",
    icon: "🤖",
    level: "Advanced",
    duration: "4-6 hours",
    status: "coming-soon",
    badge: {
      title: "AI DeFi Pioneer",
      description: "Mastered AI-DeFi Integration",
      image: "/badges/ai-defi-pioneer.png",
    },
    sections: [
      {
        id: "ai-in-defi-overview",
        title: "AI Applications in DeFi",
        type: "theory",
        status: "coming-soon",
        estimatedTime: "35 min",
      },
      {
        id: "portfolio-management-ai",
        title: "AI-Powered Portfolio Management",
        type: "theory",
        status: "coming-soon",
        estimatedTime: "40 min",
      },
      {
        id: "predictive-trading",
        title: "Predictive Trading & Liquidation Protection",
        type: "theory",
        status: "coming-soon",
        estimatedTime: "45 min",
      },
      {
        id: "ai-tools-practice",
        title: "Using AI Tools for DeFi Analysis",
        type: "hands-on",
        status: "coming-soon",
        estimatedTime: "60 min",
      },
      {
        id: "price-prediction-model",
        title: "Building a Price Prediction Model",
        type: "code-walkthrough",
        status: "coming-soon",
        estimatedTime: "90 min",
      },
      {
        id: "trading-bot-challenge",
        title: "Build a Simple Trading Bot",
        type: "challenge",
        status: "coming-soon",
        estimatedTime: "120 min",
      },
      {
        id: "ai-defi-quiz",
        title: "AI in DeFi Quiz",
        type: "quiz",
        status: "coming-soon",
        estimatedTime: "20 min",
      },
    ],
  },
  {
    id: "build-defi-app",
    title: "Build Your First DeFi App",
    description:
      "Put everything together by building and deploying a complete DeFi application on Arbitrum",
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
      {
        id: "development-environment",
        title: "Setting Up Development Environment",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "solidity-defi-basics",
        title: "Solidity for DeFi Development",
        type: "theory",
        status: "available",
        estimatedTime: "45 min",
      },
      {
        id: "smart-contract-deployment",
        title: "Deploying to Arbitrum Testnet",
        type: "hands-on",
        status: "available",
        estimatedTime: "40 min",
      },
      {
        id: "frontend-integration",
        title: "Building the Frontend Interface",
        type: "hands-on",
        status: "available",
        estimatedTime: "90 min",
      },
      {
        id: "contract-interaction",
        title: "Smart Contract & Frontend Integration",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "75 min",
      },
      {
        id: "dex-integration",
        title: "Integrating with DEX Protocols",
        type: "code-walkthrough",
        status: "coming-soon",
        estimatedTime: "60 min",
      },
      {
        id: "capstone-project",
        title: "Capstone: Build Your DeFi dApp",
        type: "challenge",
        status: "available",
        estimatedTime: "180 min",
      },
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
};
