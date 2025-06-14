// Comprehensive DeFi Glossary
// This module provides definitions for key DeFi terms used throughout the learning experience

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: "basic" | "intermediate" | "advanced";
  relatedTerms?: string[];
  examples?: string[];
}

export const defiGlossary: { [key: string]: GlossaryTerm } = {
  // Basic DeFi Terms
  DeFi: {
    term: "DeFi",
    definition:
      "Decentralized Finance - A financial ecosystem built on blockchain technology that eliminates traditional intermediaries like banks and brokers.",
    category: "basic",
    relatedTerms: ["Smart Contract", "Blockchain", "Cryptocurrency"],
    examples: ["Uniswap", "Aave", "Compound"],
  },

  "Smart Contract": {
    term: "Smart Contract",
    definition:
      "Self-executing contracts with terms directly written into code, running on blockchain networks without need for intermediaries.",
    category: "basic",
    relatedTerms: ["DeFi", "Blockchain", "Ethereum"],
    examples: ["Uniswap pools", "Lending protocols", "Yield farming contracts"],
  },

  Wallet: {
    term: "Wallet",
    definition:
      "A digital tool that stores cryptocurrency and enables interaction with blockchain applications. Can be hot (online) or cold (offline).",
    category: "basic",
    relatedTerms: ["Private Key", "Public Key", "Seed Phrase"],
    examples: ["MetaMask", "Hardware wallets", "Mobile wallets"],
  },

  Gas: {
    term: "Gas",
    definition:
      "The fee required to perform transactions or execute smart contracts on blockchain networks like Ethereum.",
    category: "basic",
    relatedTerms: ["Transaction", "Ethereum", "Layer 2"],
    examples: ["Transaction fees", "Contract deployment costs"],
  },

  "Layer 2": {
    term: "Layer 2",
    definition:
      "Scaling solutions built on top of blockchain networks to increase transaction speed and reduce costs while maintaining security.",
    category: "basic",
    relatedTerms: ["Arbitrum", "Optimism", "Polygon", "Scaling"],
    examples: ["Arbitrum One", "Optimism", "Polygon"],
  },

  // AMM and DEX Terms
  AMM: {
    term: "AMM",
    definition:
      "Automated Market Maker - A protocol that uses mathematical formulas to price assets and enable trading without traditional order books.",
    category: "intermediate",
    relatedTerms: ["Liquidity Pool", "DEX", "Slippage"],
    examples: ["Uniswap", "SushiSwap", "Curve"],
  },

  DEX: {
    term: "DEX",
    definition:
      "Decentralized Exchange - A peer-to-peer marketplace for cryptocurrency trading without centralized control.",
    category: "intermediate",
    relatedTerms: ["AMM", "Order Book", "Liquidity"],
    examples: ["Uniswap", "SushiSwap", "1inch"],
  },

  "Liquidity Pool": {
    term: "Liquidity Pool",
    definition:
      "A collection of tokens locked in a smart contract to facilitate trading and other DeFi operations.",
    category: "intermediate",
    relatedTerms: ["AMM", "Liquidity Provider", "Trading Pair"],
    examples: ["ETH/USDC pool", "DAI/USDT pool"],
  },

  "Liquidity Provider": {
    term: "Liquidity Provider",
    definition:
      "A user who deposits tokens into liquidity pools to enable trading and earn fees in return.",
    category: "intermediate",
    relatedTerms: ["Liquidity Pool", "LP Token", "Yield Farming"],
    examples: ["Uniswap LPs", "Curve LPs"],
  },

  "LP Token": {
    term: "LP Token",
    definition:
      "Liquidity Provider Token - A receipt token representing a user's share in a liquidity pool.",
    category: "intermediate",
    relatedTerms: ["Liquidity Provider", "Liquidity Pool", "Yield Farming"],
    examples: ["UNI-V2 tokens", "Curve LP tokens"],
  },

  "Impermanent Loss": {
    term: "Impermanent Loss",
    definition:
      "The temporary loss of funds experienced by liquidity providers due to volatility in trading pairs compared to holding the assets.",
    category: "intermediate",
    relatedTerms: ["Liquidity Provider", "AMM", "Volatility"],
    examples: ["50/50 pool price divergence", "Correlated asset pools"],
  },

  Slippage: {
    term: "Slippage",
    definition:
      "The difference between expected and actual price of a trade, usually due to market movement or low liquidity.",
    category: "intermediate",
    relatedTerms: ["AMM", "Liquidity", "Trading"],
    examples: ["High slippage on large trades", "Low slippage in deep pools"],
  },

  // Yield and Lending Terms
  "Yield Farming": {
    term: "Yield Farming",
    definition:
      "The practice of earning rewards by providing liquidity or staking tokens in DeFi protocols.",
    category: "intermediate",
    relatedTerms: ["Liquidity Mining", "Staking", "APY"],
    examples: ["Compound farming", "Uniswap LP farming"],
  },

  APY: {
    term: "APY",
    definition:
      "Annual Percentage Yield - The total return earned on an investment over one year, including compound interest.",
    category: "basic",
    relatedTerms: ["APR", "Yield", "Compound Interest"],
    examples: ["5% APY on staking", "Variable lending APY"],
  },

  Vault: {
    term: "Vault",
    definition:
      "An automated investment strategy that pools user funds and deploys them across multiple DeFi protocols to maximize returns.",
    category: "intermediate",
    relatedTerms: ["Yield Aggregator", "Strategy", "Auto-compound"],
    examples: ["Yearn vaults", "Beefy vaults"],
  },

  // Security Terms
  Audit: {
    term: "Audit",
    definition:
      "A security review of smart contract code to identify vulnerabilities and ensure safety.",
    category: "intermediate",
    relatedTerms: ["Security", "Smart Contract", "Bug Bounty"],
    examples: ["ConsenSys audits", "Trail of Bits audits"],
  },

  Oracle: {
    term: "Oracle",
    definition:
      "A service that provides external data to smart contracts, such as asset prices or market information.",
    category: "intermediate",
    relatedTerms: ["Price Feed", "Chainlink", "TWAP"],
    examples: ["Chainlink oracles", "Uniswap TWAP"],
  },

  Bridge: {
    term: "Bridge",
    definition:
      "A protocol that enables transfer of assets between different blockchain networks.",
    category: "intermediate",
    relatedTerms: ["Cross-chain", "Layer 2", "Interoperability"],
    examples: ["Arbitrum Bridge", "Polygon Bridge"],
  },
};

// Utility functions for glossary management
export function getTermDefinition(term: string): string | null {
  return defiGlossary[term]?.definition || null;
}

export function getChapterGlossary(chapterId: string): {
  [key: string]: GlossaryTerm;
} {
  // Define which terms are relevant for each chapter
  const chapterTerms: { [key: string]: string[] } = {
    "intro-to-defi": ["DeFi", "Smart Contract", "Wallet", "Gas", "Layer 2"],
    "decentralized-exchanges": [
      "AMM",
      "DEX",
      "Liquidity Pool",
      "Liquidity Provider",
      "LP Token",
      "Impermanent Loss",
      "Slippage",
    ],
    "vaults-yield-aggregation": ["Vault", "Yield Farming", "APY"],
    "risks-security": ["Audit", "Oracle", "Bridge"],
  };

  const terms = chapterTerms[chapterId] || [];
  const glossary: { [key: string]: GlossaryTerm } = {};

  terms.forEach((term) => {
    if (defiGlossary[term]) {
      glossary[term] = defiGlossary[term];
    }
  });

  return glossary;
}
