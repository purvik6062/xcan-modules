"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Type definitions
interface BridgeSimulationState {
  currentStep: SimulationStep;
  progress: number;
  isPlaying: boolean;
  hasError: boolean;
  errorMessage: string;
}

type SimulationStep = "idle" | "step1" | "step2" | "step3" | "complete";
type TokenMechanism = "lock-mint" | "burn-release" | "liquidity-pool";
type ValidationArchitecture = "light-client" | "external-validators" | "optimistic" | "zk-proofs";

interface Chain {
  name: string;
  logo: string;
  color: string;
  fullName: string;
}


// Chains - Only Ethereum and Arbitrum
const AVAILABLE_CHAINS: Record<string, Chain> = {
  ethereum: {
    name: "Ethereum",
    logo: "/ethereum.jpeg",
    color: "from-purple-600 to-purple-400",
    fullName: "Ethereum Mainnet"
  },
  arbitrum: {
    name: "Arbitrum",
    logo: "/arbitrum.jpeg",
    color: "from-blue-600 to-blue-400",
    fullName: "Arbitrum One"
  },
};

// Token Transfer Mechanisms
const TOKEN_MECHANISMS: Record<
  TokenMechanism,
  {
    name: string;
    description: string;
    pros: string[];
    cons: string[];
    steps: { title: string; description: string; icon: string }[];
    usedBy: string[];
  }
> = {
  "lock-mint": {
    name: "Lock-Mint",
    description: "Original tokens locked on source chain, wrapped tokens minted on destination",
    pros: [
      "Simple to implement and understand",
      "Transparent 1:1 collateralization",
      "Works with any token",
    ],
    cons: [
      "Creates wrapped tokens (not native)",
      "Smart contract risk on both chains",
      "Liquidity fragmentation",
    ],
    steps: [
      {
        title: "Lock Tokens",
        description: "User's tokens are locked in a smart contract vault on source chain",
        icon: "🔒"
      },
      {
        title: "Verify & Relay",
        description: "Bridge validators verify lock and relay proof to destination",
        icon: "📡"
      },
      {
        title: "Mint Wrapped",
        description: "Equivalent wrapped tokens minted on destination chain",
        icon: "✨"
      },
    ],
    usedBy: ["Wormhole Portal", "Polygon PoS Bridge", "Arbitrum Bridge"],
  },
  "burn-release": {
    name: "Burn-Mint (hTokens)",
    description: "Tokens burned on source chain, equivalent minted on destination via liquidity pools",
    pros: [
      "Fast transfers via Bonders",
      "Capital efficient with AMMs",
      "Native assets on destination",
    ],
    cons: [
      "Requires liquidity providers",
      "Slippage on large amounts",
      "More complex architecture",
    ],
    steps: [
      {
        title: "Burn hTokens",
        description: "hTokens (bridge tokens) are burned on source rollup",
        icon: "🔥"
      },
      {
        title: "Bonder Fronts",
        description: "Bonder provides immediate liquidity on destination",
        icon: "⚡"
      },
      {
        title: "Receive Native",
        description: "User receives native tokens, Bonder reimbursed later",
        icon: "💎"
      },
    ],
    usedBy: ["Hop Protocol", "Circle CCTP", "Across Protocol"],
  },
  "liquidity-pool": {
    name: "Liquidity Pool (AMM)",
    description: "Decentralized pools on chains enable native asset swaps with unified liquidity",
    pros: [
      "Native assets on both chains",
      "No wrapped tokens needed",
      "Single-sided liquidity possible",
    ],
    cons: [
      "Requires deep liquidity",
      "Slippage on large swaps",
      "Impermanent loss for LPs",
    ],
    steps: [
      {
        title: "Deposit to Pool",
        description: "User deposits tokens into source chain liquidity pool",
        icon: "💰"
      },
      {
        title: "Cross-Chain Message",
        description: "Bridge protocol coordinates swap across chains",
        icon: "🔄"
      },
      {
        title: "Receive from Pool",
        description: "User receives native tokens from destination pool",
        icon: "🎁"
      },
    ],
    usedBy: ["Stargate Finance", "THORChain", "Synapse Protocol"],
  },
};

// Validation/Security Architectures
const VALIDATION_ARCHITECTURES: Record<
  ValidationArchitecture,
  {
    name: string;
    description: string;
    trustModel: string;
    securityLevel: string;
    pros: string[];
    cons: string[];
    examples: string[];
  }
> = {
  "light-client": {
    name: "Light Client / Relay",
    description: "Cryptographic proofs verify source chain state on destination - truly trustless",
    trustModel: "Trustless - relies on cryptographic proofs",
    securityLevel: "Highest",
    pros: [
      "Most secure - no trust assumptions",
      "Truly decentralized verification",
      "No validator collusion risk",
    ],
    cons: [
      "Complex implementation",
      "High gas costs for verification",
      "Limited chain compatibility",
    ],
    examples: ["IBC (Cosmos)", "Rainbow Bridge (NEAR)", "Snowbridge (Polkadot)"],
  },
  "external-validators": {
    name: "External Validators (Multisig)",
    description: "Trusted validator set watches and approves cross-chain transactions",
    trustModel: "Trust-based - depends on validator honesty",
    securityLevel: "Medium",
    pros: [
      "Simpler to implement",
      "Lower gas costs",
      "Works with any chain",
    ],
    cons: [
      "Centralization risk",
      "Validator collusion possible",
      "Single point of failure",
    ],
    examples: ["Wormhole Guardians", "Axelar Network", "LayerZero DVNs"],
  },
  "optimistic": {
    name: "Optimistic Verification",
    description: "Transactions assumed valid unless fraud proof submitted during challenge period",
    trustModel: "Trust but verify - requires active watchers",
    securityLevel: "Medium-High",
    pros: [
      "Lower verification costs",
      "Good security with active watchers",
      "More decentralized than multisig",
    ],
    cons: [
      "Requires fraud monitoring",
      "Challenge period delays (hours)",
      "Fraud proof complexity",
    ],
    examples: ["Across Protocol (UMA)", "Connext", "Hyperlane ISM"],
  },
  "zk-proofs": {
    name: "Zero-Knowledge Proofs",
    description: "ZK proofs verify cross-chain state efficiently - trustless and scalable",
    trustModel: "Trustless - cryptographic verification",
    securityLevel: "Very High",
    pros: [
      "Trustless like light clients",
      "More efficient verification",
      "Can batch multiple transactions",
    ],
    cons: [
      "Cutting edge technology",
      "Complex proof generation",
      "Higher computational cost",
    ],
    examples: ["zkBridge (Polyhedra)", "Succinct Labs", "Lagrange"],
  },
};


export default function BridgeSimulator() {
  // Configuration
  const [sourceChain] = useState<Chain>(AVAILABLE_CHAINS.ethereum);
  const [destinationChain] = useState<Chain>(AVAILABLE_CHAINS.arbitrum);
  const [tokenAmount] = useState<number>(1);
  const [tokenMechanism, setTokenMechanism] = useState<TokenMechanism>("lock-mint");
  const [validationArch, setValidationArch] = useState<ValidationArchitecture>("light-client");

  const [simulationState, setSimulationState] = useState<BridgeSimulationState>({
    currentStep: "idle",
    progress: 0,
    isPlaying: false,
    hasError: false,
    errorMessage: "",
  });

  useEffect(() => {
    if (!simulationState.isPlaying) return;

    const stepDuration = 100; // 10x speed
    const interval = setInterval(() => {
      setSimulationState((prev) => {
        let nextStep: SimulationStep = prev.currentStep;
        let nextProgress = prev.progress + 1;

        if (nextProgress >= 100) {
          nextProgress = 100;
          nextStep = "complete";
        } else if (nextProgress < 33) {
          nextStep = "step1";
        } else if (nextProgress < 66) {
          nextStep = "step2";
        } else {
          nextStep = "step3";
        }

        return {
          ...prev,
          currentStep: nextStep,
          progress: nextProgress,
          isPlaying: nextProgress < 100,
        };
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [simulationState.isPlaying]);

  const handleStartSimulation = () => {
    setSimulationState({
      currentStep: "step1",
      progress: 0,
      isPlaying: true,
      hasError: false,
      errorMessage: "",
    });
  };

  const handleResetSimulation = () => {
    setSimulationState({
      currentStep: "idle",
      progress: 0,
      isPlaying: false,
      hasError: false,
      errorMessage: "",
    });
  };

  const getCurrentStepInfo = () => {
    const steps = TOKEN_MECHANISMS[tokenMechanism].steps;
    if (simulationState.currentStep === "idle") return null;
    if (simulationState.currentStep === "complete") return steps[2];
    if (simulationState.currentStep === "step1") return steps[0];
    if (simulationState.currentStep === "step2") return steps[1];
    return steps[2];
  };

  const getStepColor = (step: SimulationStep): string => {
    const colors: Record<SimulationStep, string> = {
      idle: "from-gray-500 to-gray-600",
      step1: "from-yellow-500 to-orange-500",
      step2: "from-blue-500 to-cyan-500",
      step3: "from-green-500 to-emerald-500",
      complete: "from-green-600 to-emerald-600",
    };
    return colors[step];
  };

  const currentStepInfo = getCurrentStepInfo();
  const mechanismInfo = TOKEN_MECHANISMS[tokenMechanism];
  const validationInfo = VALIDATION_ARCHITECTURES[validationArch];

  return (
    <div className="w-full bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Main Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Token Mechanism Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            <h2 className="text-xl font-bold text-white mb-4">Layer 1: Token Transfer Mechanism</h2>
            <select
              value={tokenMechanism}
              onChange={(e) => setTokenMechanism(e.target.value as TokenMechanism)}
              disabled={simulationState.isPlaying}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 mb-4 text-lg font-semibold"
            >
              {Object.entries(TOKEN_MECHANISMS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
            <p className="text-gray-300 text-sm mb-4">{mechanismInfo.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-green-400 text-xs font-semibold mb-2">Pros</p>
                <ul className="space-y-1">
                  {mechanismInfo.pros.map((pro, idx) => (
                    <li key={idx} className="text-gray-300 text-xs flex items-start gap-1">
                      <span className="text-green-400">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-red-400 text-xs font-semibold mb-2">Cons</p>
                <ul className="space-y-1">
                  {mechanismInfo.cons.map((con, idx) => (
                    <li key={idx} className="text-gray-300 text-xs flex items-start gap-1">
                      <span className="text-red-400">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Used by:</p>
              <div className="flex flex-wrap gap-2">
                {mechanismInfo.usedBy.map((protocol, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-xs text-blue-300">
                    {protocol}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Validation Architecture Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            <h2 className="text-xl font-bold text-white mb-4">Layer 2: Validation Architecture</h2>
            <select
              value={validationArch}
              onChange={(e) => setValidationArch(e.target.value as ValidationArchitecture)}
              disabled={simulationState.isPlaying}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 mb-4 text-lg font-semibold"
            >
              {Object.entries(VALIDATION_ARCHITECTURES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
            <p className="text-gray-300 text-sm mb-3">{validationInfo.description}</p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Trust Model</p>
                <p className="text-sm text-gray-200 font-semibold">{validationInfo.trustModel}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Security Level</p>
                <p className={`text-sm font-bold ${validationInfo.securityLevel === "Highest" || validationInfo.securityLevel === "Very High"
                  ? "text-green-400"
                  : validationInfo.securityLevel === "Medium-High"
                    ? "text-yellow-400"
                    : "text-orange-400"
                  }`}>
                  {validationInfo.securityLevel}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-green-400 text-xs font-semibold mb-2">Pros</p>
                <ul className="space-y-1">
                  {validationInfo.pros.slice(0, 2).map((pro, idx) => (
                    <li key={idx} className="text-gray-300 text-xs flex items-start gap-1">
                      <span className="text-green-400">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-red-400 text-xs font-semibold mb-2">Cons</p>
                <ul className="space-y-1">
                  {validationInfo.cons.slice(0, 2).map((con, idx) => (
                    <li key={idx} className="text-gray-300 text-xs flex items-start gap-1">
                      <span className="text-red-400">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Examples:</p>
              <div className="flex flex-wrap gap-2">
                {validationInfo.examples.slice(0, 3).map((example, idx) => (
                  <span key={idx} className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded text-xs text-purple-300">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bridge Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl p-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Bridge Transfer Visualization</h2>

          {/* Chain to Chain Animation */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              {/* Source Chain */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-24 h-24 rounded-full border-4 border-purple-500 overflow-hidden shadow-2xl">
                  <Image src={sourceChain.logo} alt={sourceChain.name} fill className="object-cover" />
                </div>
                <p className="text-white font-bold mt-3 text-lg">{sourceChain.name}</p>
                <p className="text-gray-400 text-sm">{tokenAmount} ETH</p>
              </motion.div>

              {/* Transfer Progress */}
              <div className="flex-1 mx-8">
                <div className="relative">
                  <div className="h-4 bg-gray-700 rounded-full overflow-hidden border-2 border-gray-600">
                    <motion.div
                      animate={{ width: `${simulationState.progress}%` }}
                      transition={{ duration: 0.1 }}
                      className={`h-full bg-gradient-to-r ${getStepColor(simulationState.currentStep)}`}
                    />
                  </div>
                  <AnimatePresence>
                    {simulationState.isPlaying && (
                      <motion.div
                        initial={{ left: "0%" }}
                        animate={{ left: `${simulationState.progress}%` }}
                        className="absolute -top-2 transform -translate-x-1/2"
                      >
                        <div className="text-3xl">
                          {currentStepInfo?.icon || "🔄"}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="text-center text-white font-bold mt-3 text-lg">
                  {simulationState.progress}%
                </p>
                {currentStepInfo && (
                  <p className="text-center text-gray-300 text-sm mt-1">
                    {currentStepInfo.description}
                  </p>
                )}
              </div>

              {/* Destination Chain */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: simulationState.progress === 100 ? 1.1 : 1 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-24 h-24 rounded-full border-4 border-blue-500 overflow-hidden shadow-2xl">
                  <Image src={destinationChain.logo} alt={destinationChain.name} fill className="object-cover" />
                </div>
                <p className="text-white font-bold mt-3 text-lg">{destinationChain.name}</p>
                <p className="text-gray-400 text-sm">
                  {simulationState.progress === 100 ? `${tokenAmount} ETH` : "Waiting..."}
                </p>
              </motion.div>
            </div>

            {/* Current Step Info */}
            {currentStepInfo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-lg p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{currentStepInfo.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xl mb-2">{currentStepInfo.title}</h3>
                    <p className="text-gray-300">{currentStepInfo.description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Step-by-Step Process */}
          <div className="bg-gray-700/30 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-4 text-lg">
              {mechanismInfo.name} Process
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mechanismInfo.steps.map((step, idx) => {
                const isActive =
                  (simulationState.currentStep === "step1" && idx === 0) ||
                  (simulationState.currentStep === "step2" && idx === 1) ||
                  (simulationState.currentStep === "step3" && idx === 2) ||
                  (simulationState.currentStep === "complete" && idx === 2);
                const isComplete =
                  (simulationState.progress > 33 && idx === 0) ||
                  (simulationState.progress > 66 && idx === 1) ||
                  (simulationState.progress === 100 && idx === 2);

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 transition-all ${isActive
                      ? "bg-blue-600/20 border-blue-500"
                      : isComplete
                        ? "bg-green-600/20 border-green-500"
                        : "bg-gray-700/50 border-gray-600"
                      }`}
                  >
                    <div className="text-3xl mb-2">{step.icon}</div>
                    <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                    <p className="text-gray-300 text-xs">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartSimulation}
              disabled={simulationState.isPlaying}
              className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-bold text-lg transition-all disabled:cursor-not-allowed shadow-lg"
            >
              {simulationState.isPlaying ? "Simulation Running..." : "Start Bridge Transfer"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetSimulation}
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all shadow-lg"
            >
              Reset
            </motion.button>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {simulationState.hasError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg"
              >
                <p className="text-red-300 font-semibold">{simulationState.errorMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


        {/* Educational Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Understanding Bridge Architecture</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4">Token Transfer Layer</h3>
              <p className="text-gray-300 mb-4">
                This layer determines how tokens physically move between chains. Different mechanisms offer trade-offs between UX, capital efficiency, and complexity.
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-semibold mb-1">Lock-Mint</p>
                  <p className="text-gray-300 text-sm">Original locked, wrapped minted (most common)</p>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-semibold mb-1">Burn-Release</p>
                  <p className="text-gray-300 text-sm">Tokens burned, native released (better UX)</p>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-semibold mb-1">Liquidity Pool</p>
                  <p className="text-gray-300 text-sm">Cross-chain swaps (fully decentralized)</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-purple-400 mb-4">Validation Layer</h3>
              <p className="text-gray-300 mb-4">
                This layer determines how cross-chain messages are verified. Security ranges from trustless cryptographic proofs to trusted validator sets.
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-semibold mb-1">Light Client</p>
                  <p className="text-gray-300 text-sm">Cryptographic proofs (most secure, expensive)</p>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-semibold mb-1">ZK Proofs</p>
                  <p className="text-gray-300 text-sm">Efficient verification (cutting edge)</p>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-semibold mb-1">Optimistic</p>
                  <p className="text-gray-300 text-sm">Assume valid + fraud proofs (balanced)</p>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-semibold mb-1">External Validators</p>
                  <p className="text-gray-300 text-sm">Trusted multisig (simple, centralized)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Security Spectrum */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900 rounded-2xl p-8 border border-gray-700"
          >
            <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🛡️</span>
              Security Spectrum
            </h4>

            {/* Visual Spectrum Bar */}
            <div className="relative mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-bold text-sm flex items-center gap-1">
                  <span>🔒</span> Most Secure
                </span>
                <span className="text-red-400 font-bold text-sm flex items-center gap-1">
                  Least Secure <span>⚠️</span>
                </span>
              </div>
              <div className="h-4 rounded-full overflow-hidden bg-gray-700 shadow-inner">
                <div className="h-full w-full bg-gradient-to-r from-green-500 via-emerald-400 via-yellow-400 via-orange-400 to-red-500" />
              </div>
            </div>

            {/* Security Levels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Light Client */}
              <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-4 hover:border-green-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔐</span>
                  <span className="text-green-400 font-bold">Light Client</span>
                </div>
                <p className="text-gray-300 text-xs mb-2">Cryptographic proofs verify state</p>
                <div className="flex items-center gap-1">
                  <span className="text-green-400">●</span>
                  <span className="text-green-400">●</span>
                  <span className="text-green-400">●</span>
                  <span className="text-green-400">●</span>
                  <span className="text-green-400">●</span>
                </div>
                <p className="text-green-400 text-xs mt-1 font-semibold">Trustless</p>
              </div>

              {/* ZK Proofs */}
              <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-xl p-4 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚡</span>
                  <span className="text-emerald-400 font-bold">ZK Proofs</span>
                </div>
                <p className="text-gray-300 text-xs mb-2">Zero-knowledge verification</p>
                <div className="flex items-center gap-1">
                  <span className="text-emerald-400">●</span>
                  <span className="text-emerald-400">●</span>
                  <span className="text-emerald-400">●</span>
                  <span className="text-emerald-400">●</span>
                  <span className="text-gray-600">●</span>
                </div>
                <p className="text-emerald-400 text-xs mt-1 font-semibold">Very High</p>
              </div>

              {/* Optimistic */}
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4 hover:border-yellow-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⏳</span>
                  <span className="text-yellow-400 font-bold">Optimistic</span>
                </div>
                <p className="text-gray-300 text-xs mb-2">Fraud proofs with challenge period</p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">●</span>
                  <span className="text-yellow-400">●</span>
                  <span className="text-yellow-400">●</span>
                  <span className="text-gray-600">●</span>
                  <span className="text-gray-600">●</span>
                </div>
                <p className="text-yellow-400 text-xs mt-1 font-semibold">Medium-High</p>
              </div>

              {/* External Validators */}
              <div className="bg-orange-900/20 border border-orange-600/30 rounded-xl p-4 hover:border-orange-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👥</span>
                  <span className="text-orange-400 font-bold">Validators</span>
                </div>
                <p className="text-gray-300 text-xs mb-2">Trusted multisig committee</p>
                <div className="flex items-center gap-1">
                  <span className="text-orange-400">●</span>
                  <span className="text-orange-400">●</span>
                  <span className="text-gray-600">●</span>
                  <span className="text-gray-600">●</span>
                  <span className="text-gray-600">●</span>
                </div>
                <p className="text-orange-400 text-xs mt-1 font-semibold">Medium</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm mt-6 text-center">
              Higher security typically means higher costs and longer confirmation times.
              Choose based on your specific use case and risk tolerance.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

