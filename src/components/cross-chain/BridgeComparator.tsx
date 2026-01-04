"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Helper component to render logo (image or emoji)
const BridgeLogo = ({ logo, name, size = "md" }: { logo: string; name: string; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-14 h-14" };
  const textSizes = { sm: "text-xl", md: "text-3xl", lg: "text-5xl" };

  if (logo.startsWith("/")) {
    // It's an image path
    return (
      <Image
        src={logo}
        alt={`${name} logo`}
        width={size === "lg" ? 56 : size === "md" ? 40 : 24}
        height={size === "lg" ? 56 : size === "md" ? 40 : 24}
        className={`${sizeClasses[size]} rounded-lg object-cover`}
      />
    );
  }
  // It's an emoji
  return <span className={textSizes[size]}>{logo}</span>;
};

// Type definitions following clean code principles
interface BridgeInfo {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  architecture: BridgeArchitectureType;
  supportedChains: string[];
  security: SecurityDetails;
  useCases: string[];
  pros: string[];
  cons: string[];
}

type BridgeArchitectureType = "Lock-Mint" | "Burn-Release" | "Liquidity Pool" | "Relay";

interface SecurityDetails {
  auditStatus: AuditStatus;
  auditors: string[];
  insurance: string;
}

type AuditStatus = "Audited" | "Multiple Audits" | "Pending" | "Internal";

// Bridge comparison database
const BRIDGES: Record<string, BridgeInfo> = {
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum Bridge",
    description: "Official canonical bridge for Ethereum ↔ Arbitrum transfers",
    logo: "/arbitrum.jpeg",
    website: "bridge.arbitrum.io",
    architecture: "Lock-Mint",
    supportedChains: ["Ethereum", "Arbitrum One", "Arbitrum Nova"],
    security: {
      auditStatus: "Multiple Audits",
      auditors: ["Trail of Bits", "OpenZeppelin", "Certora"],
      insurance: "Secured by Arbitrum rollup security model",
    },
    useCases: ["General transfers", "Contract deployment", "dApp interactions"],
    pros: [
      "Official canonical bridge",
      "No bridge fees (only gas)",
      "Highest security guarantees",
      "Supports all ERC-20 tokens",
    ],
    cons: [
      "7-day withdrawal period to L1",
      "Slower than third-party bridges",
      "Limited to Ethereum/Arbitrum ecosystem",
    ],
  },
  stargate: {
    id: "stargate",
    name: "Stargate Finance",
    description: "LayerZero-powered omnichain liquidity protocol",
    logo: "/stargate.png",
    website: "stargate.finance",
    architecture: "Liquidity Pool",
    supportedChains: [
      "Ethereum",
      "Arbitrum",
      "Optimism",
      "Polygon",
      "Avalanche",
      "Base",
      "BNB Chain",
    ],
    security: {
      auditStatus: "Multiple Audits",
      auditors: ["Zellic", "Ottersec", "Quantstamp"],
      insurance: "Protocol insurance pool",
    },
    useCases: ["Stablecoin transfers", "Liquidity provision", "Cross-chain swaps"],
    pros: [
      "Fast transfers (~1 min)",
      "Native asset swaps",
      "Deep liquidity pools",
      "Wide chain support",
    ],
    cons: ["Liquidity-dependent", "Slippage on large amounts", "Limited token support"],
  },
  across: {
    id: "across",
    name: "Across Protocol",
    description: "Intent-based bridge secured by UMA's Optimistic Oracle",
    logo: "/across.png",
    website: "across.to",
    architecture: "Relay",
    supportedChains: [
      "Ethereum",
      "Arbitrum",
      "Optimism",
      "Polygon",
      "Base",
      "zkSync",
    ],
    security: {
      auditStatus: "Multiple Audits",
      auditors: ["OpenZeppelin", "Spearbit"],
      insurance: "UMA Optimistic Oracle dispute resolution",
    },
    useCases: ["Fast token transfers", "Intent-based bridging", "Capital-efficient swaps"],
    pros: [
      "Very fast (<60 seconds)",
      "Intent-based architecture",
      "Competitive pricing",
      "Simple user experience",
    ],
    cons: [
      "Relayer network dependent",
      "Limited to supported assets",
      "Newer protocol",
    ],
  },
  connext: {
    id: "connext",
    name: "Connext(Everclear)",
    description: "Modular cross-chain liquidity and messaging protocol",
    logo: "/connext_everclear.jpg",
    website: "everclear.org",
    architecture: "Relay",
    supportedChains: [
      "Ethereum",
      "Arbitrum",
      "Optimism",
      "Polygon",
      "Gnosis",
      "BNB Chain",
    ],
    security: {
      auditStatus: "Audited",
      auditors: ["Spearbit"],
      insurance: "Decentralized security model",
    },
    useCases: ["Cross-chain messaging", "Liquidity transfers", "dApp integrations"],
    pros: [
      "Powerful messaging layer",
      "Modular architecture",
      "Developer-friendly SDK",
      "Netting for efficiency",
    ],
    cons: [
      "Complex integration",
      "Liquidity dependent",
      "Rebranded (was Connext)",
    ],
  },
  layerzero: {
    id: "layerzero",
    name: "LayerZero",
    description: "Omnichain interoperability protocol with ultra-light nodes",
    logo: "/layerzero.png",
    website: "layerzero.network",
    architecture: "Relay",
    supportedChains: [
      "Ethereum",
      "Arbitrum",
      "Optimism",
      "Polygon",
      "Avalanche",
      "Base",
      "Solana",
    ],
    security: {
      auditStatus: "Multiple Audits",
      auditors: ["Zellic", "ChainSecurity", "Paladin"],
      insurance: "Configurable security stack",
    },
    useCases: ["Omnichain tokens (OFT)", "Cross-chain messaging", "NFT transfers"],
    pros: [
      "Extensive chain support",
      "Customizable security",
      "OFT token standard",
      "Strong ecosystem",
    ],
    cons: [
      "Oracle/DVN dependency",
      "Complex for developers",
      "Configuration overhead",
    ],
  },
  wormhole: {
    id: "wormhole",
    name: "Wormhole",
    description: "Guardian-secured cross-chain messaging protocol",
    logo: "/wormhole.jpg",
    website: "wormhole.com",
    architecture: "Relay",
    supportedChains: [
      "Ethereum",
      "Solana",
      "Polygon",
      "Avalanche",
      "Arbitrum",
      "Base",
      "Sui",
    ],
    security: {
      auditStatus: "Multiple Audits",
      auditors: ["Trail of Bits", "Neodyme", "Halborn", "CertiK"],
      insurance: "19 Guardian validator network",
    },
    useCases: ["Multi-chain tokens", "NFT bridging", "Cross-chain messaging"],
    pros: [
      "Solana + EVM support",
      "Strong Guardian security",
      "Established protocol",
      "29+ completed audits",
    ],
    cons: [
      "2022 security incident (resolved)",
      "Guardian trust assumptions",
      "Variable finality times",
    ],
  },
};

export default function BridgeComparator() {
  const [selectedBridges, setSelectedBridges] = useState<string[]>([
    "arbitrum",
    "stargate",
  ]);
  const [viewMode, setViewMode] = useState<"comparison" | "detailed">("comparison");

  // Get bridge list alphabetically
  const allBridges = Object.values(BRIDGES).sort((a, b) => a.name.localeCompare(b.name));

  // Get selected bridge objects
  const comparingBridges = allBridges.filter((b) =>
    selectedBridges.includes(b.id)
  );

  const handleToggleBridge = (bridgeId: string) => {
    setSelectedBridges((prev) =>
      prev.includes(bridgeId)
        ? prev.filter((id) => id !== bridgeId)
        : [...prev, bridgeId]
    );
  };

  return (
    <div className="w-full bg-gray-900 py-8 px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-3">
            🌉 Bridge Comparison
          </h2>
          <p className="text-gray-400">
            Compare cross-chain bridges to find the best one for your needs
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          {/* View Mode */}
          <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
            {["comparison", "detailed"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as typeof viewMode)}
                className={`px-4 py-2 rounded transition-all font-medium text-sm ${viewMode === mode
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
                  }`}
              >
                {mode === "comparison" ? "📊 Comparison" : "📋 Details"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bridge Selection Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">📌 Select Bridges to Compare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBridges.map((bridge) => (
              <motion.button
                key={bridge.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggleBridge(bridge.id)}
                className={`p-4 rounded-lg transition-all border-2 text-left ${selectedBridges.includes(bridge.id)
                  ? "bg-blue-600/20 border-blue-500 bg-gradient-to-br from-blue-600/10 to-cyan-600/10"
                  : "bg-gray-800 border-gray-700 hover:border-gray-600"
                  }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BridgeLogo logo={bridge.logo} name={bridge.name} size="md" />
                    <div>
                      <h3 className="text-white font-bold">{bridge.name}</h3>
                      <p className="text-xs text-gray-400">{bridge.architecture}</p>
                    </div>
                  </div>
                  {selectedBridges.includes(bridge.id) && (
                    <span className="text-blue-400 text-xl">✓</span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {bridge.supportedChains.slice(0, 3).map((chain) => (
                      <span key={chain} className="px-2 py-0.5 bg-gray-700 rounded text-gray-300">
                        {chain}
                      </span>
                    ))}
                    {bridge.supportedChains.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-600 rounded text-gray-400">
                        +{bridge.supportedChains.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Comparison Views */}
        {viewMode === "comparison" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 rounded-2xl p-8 border border-gray-700 overflow-x-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6">📊 Detailed Comparison</h2>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                    Metric
                  </th>
                  {comparingBridges.map((bridge) => (
                    <th
                      key={bridge.id}
                      className="text-center py-4 px-4 text-white font-semibold"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <BridgeLogo logo={bridge.logo} name={bridge.name} size="sm" />
                        <span className="text-sm">{bridge.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Architecture */}
                <tr className="border-b border-gray-700 hover:bg-gray-700/30 transition-all">
                  <td className="py-3 px-4 text-gray-300 font-semibold">Architecture</td>
                  {comparingBridges.map((bridge) => (
                    <td
                      key={bridge.id}
                      className="text-center py-3 px-4 text-purple-300 font-semibold"
                    >
                      {bridge.architecture}
                    </td>
                  ))}
                </tr>

                {/* Supported Chains */}
                <tr className="border-b border-gray-700 hover:bg-gray-700/30 transition-all">
                  <td className="py-3 px-4 text-gray-300 font-semibold">Supported Chains</td>
                  {comparingBridges.map((bridge) => (
                    <td
                      key={bridge.id}
                      className="text-center py-3 px-4 text-gray-300 text-xs"
                    >
                      <div className="space-y-1">
                        {bridge.supportedChains.map((chain) => (
                          <div key={chain}>{chain}</div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Audit Status */}
                <tr className="hover:bg-gray-700/30 transition-all">
                  <td className="py-3 px-4 text-gray-300 font-semibold">Audit Status</td>
                  {comparingBridges.map((bridge) => (
                    <td
                      key={bridge.id}
                      className="text-center py-3 px-4"
                    >
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${bridge.security.auditStatus === "Multiple Audits"
                        ? "bg-green-900/30 text-green-300 border border-green-700"
                        : bridge.security.auditStatus === "Audited"
                          ? "bg-blue-900/30 text-blue-300 border border-blue-700"
                          : "bg-yellow-900/30 text-yellow-300 border border-yellow-700"
                        }`}>
                        {bridge.security.auditStatus}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Detailed View */}
        {viewMode === "detailed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {comparingBridges.map((bridge) => (
              <motion.div
                key={bridge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl p-8 border border-gray-700"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700">
                  <div className="flex items-center gap-4">
                    <BridgeLogo logo={bridge.logo} name={bridge.name} size="lg" />
                    <div>
                      <h2 className="text-3xl font-bold text-white">{bridge.name}</h2>
                      <p className="text-gray-400">{bridge.description}</p>
                    </div>
                  </div>
                  <a
                    href={`https://${bridge.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                  >
                    Visit →
                  </a>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Architecture</p>
                    <p className="text-xl font-bold text-purple-300">{bridge.architecture}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Supported Chains</p>
                    <p className="text-xl font-bold text-blue-300">{bridge.supportedChains.length} chains</p>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                      <span>✓</span> Pros
                    </h3>
                    <ul className="space-y-2">
                      {bridge.pros.map((pro, idx) => (
                        <li key={idx} className="text-gray-300 flex items-start gap-2">
                          <span className="text-green-400 flex-shrink-0">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                      <span>✗</span> Cons
                    </h3>
                    <ul className="space-y-2">
                      {bridge.cons.map((con, idx) => (
                        <li key={idx} className="text-gray-300 flex items-start gap-2">
                          <span className="text-red-400 flex-shrink-0">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Security */}
                <div className="mb-8 pb-8 border-b border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">🔐 Security Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-2">Audit Status</p>
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${bridge.security.auditStatus === "Multiple Audits"
                        ? "bg-green-900/30 text-green-300"
                        : "bg-blue-900/30 text-blue-300"
                        }`}>
                        {bridge.security.auditStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-2">Insurance</p>
                      <p className="text-white font-semibold text-sm">
                        {bridge.security.insurance}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm mb-2">Audited by:</p>
                    <div className="flex flex-wrap gap-2">
                      {bridge.security.auditors.map((auditor) => (
                        <span
                          key={auditor}
                          className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
                        >
                          {auditor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Use Cases */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">💡 Best For</h3>
                  <div className="flex flex-wrap gap-2">
                    {bridge.useCases.map((useCase) => (
                      <span
                        key={useCase}
                        className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-sm text-blue-300"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {selectedBridges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">Select bridges to compare</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

