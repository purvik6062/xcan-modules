"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Type definitions following clean code principles
interface BlockchainNetwork {
  id: string;
  name: string;
  emoji: string;
  color: string;
  tvl: number; // in billions USD
  dailyVolume: number;
  transactionCount: number;
  avgBlockTime: number; // in seconds
  gasToken: string;
}

interface BridgeConnection {
  id: string;
  sourceNetworkId: string;
  destinationNetworkId: string;
  tvlBridged: number;
  bridgeType: BridgeType;
  securityScore: number; // 0-100
  averageTime: number; // seconds
}

type BridgeType = "lock-mint" | "burn-release" | "liquidity-pool" | "relay";
type DisplayMode = "map" | "data" | "flow";

// Blockchain networks database
const NETWORKS: Record<string, BlockchainNetwork> = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    emoji: "⟠",
    color: "from-purple-600 to-purple-400",
    tvl: 45.2,
    dailyVolume: 12.5,
    transactionCount: 1200000,
    avgBlockTime: 12,
    gasToken: "ETH",
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum",
    emoji: "🔵",
    color: "from-blue-600 to-blue-400",
    tvl: 8.3,
    dailyVolume: 3.2,
    transactionCount: 450000,
    avgBlockTime: 0.25,
    gasToken: "ETH",
  },
  optimism: {
    id: "optimism",
    name: "Optimism",
    emoji: "🔴",
    color: "from-red-600 to-red-400",
    tvl: 6.1,
    dailyVolume: 2.8,
    transactionCount: 380000,
    avgBlockTime: 2,
    gasToken: "ETH",
  },
  polygon: {
    id: "polygon",
    name: "Polygon",
    emoji: "🟣",
    color: "from-indigo-600 to-indigo-400",
    tvl: 3.9,
    dailyVolume: 1.5,
    transactionCount: 250000,
    avgBlockTime: 2,
    gasToken: "MATIC",
  },
  avalanche: {
    id: "avalanche",
    name: "Avalanche",
    emoji: "🏔️",
    color: "from-red-700 to-red-400",
    tvl: 2.7,
    dailyVolume: 0.9,
    transactionCount: 180000,
    avgBlockTime: 2,
    gasToken: "AVAX",
  },
  base: {
    id: "base",
    name: "Base",
    emoji: "🔷",
    color: "from-blue-700 to-blue-500",
    tvl: 1.8,
    dailyVolume: 0.6,
    transactionCount: 120000,
    avgBlockTime: 2,
    gasToken: "ETH",
  },
};

// Bridge connections database
const BRIDGE_CONNECTIONS: BridgeConnection[] = [
  {
    id: "eth-arb",
    sourceNetworkId: "ethereum",
    destinationNetworkId: "arbitrum",
    tvlBridged: 2.1,
    bridgeType: "lock-mint",
    securityScore: 95,
    averageTime: 10,
  },
  {
    id: "eth-opt",
    sourceNetworkId: "ethereum",
    destinationNetworkId: "optimism",
    tvlBridged: 1.8,
    bridgeType: "lock-mint",
    securityScore: 93,
    averageTime: 8,
  },
  {
    id: "eth-poly",
    sourceNetworkId: "ethereum",
    destinationNetworkId: "polygon",
    tvlBridged: 0.9,
    bridgeType: "liquidity-pool",
    securityScore: 88,
    averageTime: 15,
  },
  {
    id: "eth-avax",
    sourceNetworkId: "ethereum",
    destinationNetworkId: "avalanche",
    tvlBridged: 0.5,
    bridgeType: "relay",
    securityScore: 90,
    averageTime: 20,
  },
  {
    id: "arb-opt",
    sourceNetworkId: "arbitrum",
    destinationNetworkId: "optimism",
    tvlBridged: 0.3,
    bridgeType: "liquidity-pool",
    securityScore: 87,
    averageTime: 25,
  },
  {
    id: "poly-avax",
    sourceNetworkId: "polygon",
    destinationNetworkId: "avalanche",
    tvlBridged: 0.2,
    bridgeType: "liquidity-pool",
    securityScore: 82,
    averageTime: 30,
  },
];

// Bridge type helper function
const getBridgeTypeLabel = (type: BridgeType): string => {
  const labels: Record<BridgeType, string> = {
    "lock-mint": "Lock-Mint",
    "burn-release": "Burn-Release",
    "liquidity-pool": "Liquidity Pool",
    relay: "Relay",
  };
  return labels[type];
};

export default function NetworkVisualizer() {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("map");
  const [filterSecurityScore, setFilterSecurityScore] = useState<number>(0);

  // Filter bridges based on security score
  const filteredBridges = BRIDGE_CONNECTIONS.filter(
    (bridge) => bridge.securityScore >= filterSecurityScore
  );

  // Calculate position for network nodes (circular layout)
  const getNetworkPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 150;
    const centerX = 250;
    const centerY = 250;

    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const networks = Object.values(NETWORKS);

  return (
    <div className="w-full min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🌐 Cross-Chain Network Map
          </h1>
          <p className="text-gray-400 text-lg">
            Explore blockchain networks and their bridge connections
          </p>
        </motion.div>

        {/* Display Mode Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {["map", "data", "flow"].map((mode) => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDisplayMode(mode as DisplayMode)}
              className={`px-6 py-2 rounded-full transition-all font-medium ${
                displayMode === mode
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
              }`}
            >
              {mode === "map" && "🗺️ Network Map"}
              {mode === "data" && "📊 Data View"}
              {mode === "flow" && "💧 TVL Flow"}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Visualizations */}
          <div className="lg:col-span-3">
            {displayMode === "map" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800 rounded-2xl p-8 border border-gray-700 relative h-[600px]"
              >
                <svg
                  className="w-full h-full absolute inset-0"
                  viewBox="0 0 500 500"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3, 0 6" fill="#60a5fa" opacity="0.6" />
                    </marker>
                  </defs>

                  {/* Bridge Connections */}
                  {filteredBridges.map((bridge) => {
                    const sourceNet = Object.values(NETWORKS).find(
                      (n) => n.id === bridge.sourceNetworkId
                    );
                    const destNet = Object.values(NETWORKS).find(
                      (n) => n.id === bridge.destinationNetworkId
                    );

                    if (!sourceNet || !destNet) return null;

                    const sourceIdx = networks.findIndex((n) => n.id === sourceNet.id);
                    const destIdx = networks.findIndex((n) => n.id === destNet.id);

                    const sourcePos = getNetworkPosition(sourceIdx, networks.length);
                    const destPos = getNetworkPosition(destIdx, networks.length);

                    return (
                      <g key={bridge.id}>
                        {/* Connection Line */}
                        <line
                          x1={sourcePos.x}
                          y1={sourcePos.y}
                          x2={destPos.x}
                          y2={destPos.y}
                          stroke="#3b82f6"
                          strokeWidth="2"
                          opacity="0.4"
                          markerEnd="url(#arrowhead)"
                        />

                        {/* TVL Label on Line */}
                        <text
                          x={(sourcePos.x + destPos.x) / 2}
                          y={(sourcePos.y + destPos.y) / 2 - 5}
                          textAnchor="middle"
                          className="text-xs fill-blue-300"
                          opacity="0.7"
                        >
                          ${bridge.tvlBridged.toFixed(1)}B
                        </text>
                      </g>
                    );
                  })}

                  {/* Network Nodes */}
                  {networks.map((network, index) => {
                    const pos = getNetworkPosition(index, networks.length);
                    const isSelected = selectedNetwork === network.id;

                    return (
                      <g key={network.id}>
                        {/* Node Circle */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isSelected ? 30 : 25}
                          className={`transition-all cursor-pointer ${
                            isSelected
                              ? "fill-blue-500 filter drop-shadow-lg"
                              : "fill-gray-700 hover:fill-gray-600"
                          }`}
                          onClick={() =>
                            setSelectedNetwork(
                              selectedNetwork === network.id ? null : network.id
                            )
                          }
                        />

                        {/* Node Label */}
                        <text
                          x={pos.x}
                          y={pos.y + 50}
                          textAnchor="middle"
                          className="text-sm fill-white font-semibold cursor-pointer hover:fill-blue-300"
                          onClick={() =>
                            setSelectedNetwork(
                              selectedNetwork === network.id ? null : network.id
                            )
                          }
                        >
                          {network.emoji} {network.name}
                        </text>

                        {/* TVL on Node */}
                        <text
                          x={pos.x}
                          y={pos.y + 7}
                          textAnchor="middle"
                          className="text-xs fill-white font-bold"
                        >
                          ${network.tvl.toFixed(1)}B
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </motion.div>
            )}

            {displayMode === "data" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {networks.map((network) => (
                  <motion.div
                    key={network.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedNetwork(network.id)}
                    className={`bg-gray-800 rounded-lg p-6 border-2 cursor-pointer transition-all ${
                      selectedNetwork === network.id
                        ? "border-blue-500 bg-gray-700"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{network.emoji}</span>
                        <h3 className="text-xl font-bold text-white">{network.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-400">
                          ${network.tvl.toFixed(1)}B
                        </p>
                        <p className="text-xs text-gray-400">TVL</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-700/50 rounded p-3">
                        <p className="text-xs text-gray-400 mb-1">Daily Volume</p>
                        <p className="text-lg font-semibold text-white">
                          ${network.dailyVolume.toFixed(1)}B
                        </p>
                      </div>
                      <div className="bg-gray-700/50 rounded p-3">
                        <p className="text-xs text-gray-400 mb-1">Transactions</p>
                        <p className="text-lg font-semibold text-white">
                          {(network.transactionCount / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="bg-gray-700/50 rounded p-3">
                        <p className="text-xs text-gray-400 mb-1">Block Time</p>
                        <p className="text-lg font-semibold text-white">
                          {network.avgBlockTime}s
                        </p>
                      </div>
                      <div className="bg-gray-700/50 rounded p-3">
                        <p className="text-xs text-gray-400 mb-1">Gas Token</p>
                        <p className="text-lg font-semibold text-white">
                          {network.gasToken}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {displayMode === "flow" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800 rounded-2xl p-8 border border-gray-700"
              >
                <h2 className="text-xl font-bold text-white mb-6">💧 TVL Distribution</h2>

                <div className="space-y-4">
                  {filteredBridges
                    .sort((a, b) => b.tvlBridged - a.tvlBridged)
                    .map((bridge) => {
                      const sourceNet = Object.values(NETWORKS).find(
                        (n) => n.id === bridge.sourceNetworkId
                      );
                      const destNet = Object.values(NETWORKS).find(
                        (n) => n.id === bridge.destinationNetworkId
                      );

                      if (!sourceNet || !destNet) return null;

                      const maxTVL = Math.max(...filteredBridges.map((b) => b.tvlBridged));
                      const percentage = (bridge.tvlBridged / maxTVL) * 100;

                      return (
                        <motion.div
                          key={bridge.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span>{sourceNet.emoji}</span>
                              <span className="text-white font-semibold">
                                {sourceNet.name}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span>{destNet.emoji}</span>
                              <span className="text-white font-semibold">
                                {destNet.name}
                              </span>
                            </div>
                            <span className="text-blue-400 font-bold">
                              ${bridge.tvlBridged.toFixed(2)}B
                            </span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {getBridgeTypeLabel(bridge.bridgeType)} • Security: {bridge.securityScore}%
                          </p>
                        </motion.div>
                      );
                    })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Details & Filters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 h-fit"
          >
            <h2 className="text-lg font-bold text-white mb-6">🔧 Controls</h2>

            {/* Security Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Min Security Score
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filterSecurityScore}
                  onChange={(e) => setFilterSecurityScore(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Low Risk</span>
                  <span className={`font-semibold ${
                    filterSecurityScore >= 80 ? "text-green-400" :
                    filterSecurityScore >= 60 ? "text-yellow-400" :
                    "text-red-400"
                  }`}>
                    {filterSecurityScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Network Details */}
            {selectedNetwork && (
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-white font-semibold mb-4">Network Details</h3>
                {(() => {
                  const net = Object.values(NETWORKS).find((n) => n.id === selectedNetwork);
                  if (!net) return null;

                  const connectedBridges = filteredBridges.filter(
                    (b) =>
                      b.sourceNetworkId === net.id || b.destinationNetworkId === net.id
                  );

                  return (
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Total TVL</p>
                        <p className="text-white font-bold">${net.tvl.toFixed(1)}B</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Connected Bridges</p>
                        <p className="text-white font-bold">{connectedBridges.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Daily Volume</p>
                        <p className="text-white font-bold">${net.dailyVolume.toFixed(1)}B</p>
                      </div>
                      <div className="border-t border-gray-700 pt-4">
                        <p className="text-gray-400 mb-2 font-semibold">Connected To:</p>
                        <div className="space-y-2">
                          {connectedBridges.map((bridge) => {
                            const connectedId =
                              bridge.sourceNetworkId === net.id
                                ? bridge.destinationNetworkId
                                : bridge.sourceNetworkId;
                            const connectedNet = Object.values(NETWORKS).find(
                              (n) => n.id === connectedId
                            );

                            return (
                              <div
                                key={bridge.id}
                                className="bg-gray-700 rounded p-2 text-xs"
                              >
                                <p className="text-blue-300 font-semibold mb-1">
                                  {connectedNet?.emoji} {connectedNet?.name}
                                </p>
                                <p className="text-gray-400">
                                  TVL: ${bridge.tvlBridged.toFixed(1)}B
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </motion.div>
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Total TVL</p>
            <p className="text-3xl font-bold">
              ${networks.reduce((sum, n) => sum + n.tvl, 0).toFixed(1)}B
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Daily Volume</p>
            <p className="text-3xl font-bold">
              ${networks.reduce((sum, n) => sum + n.dailyVolume, 0).toFixed(1)}B
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-400 rounded-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Active Bridges</p>
            <p className="text-3xl font-bold">{filteredBridges.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Bridged TVL</p>
            <p className="text-3xl font-bold">
              ${filteredBridges.reduce((sum, b) => sum + b.tvlBridged, 0).toFixed(1)}B
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

