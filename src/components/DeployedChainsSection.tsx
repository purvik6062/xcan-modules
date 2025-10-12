"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DeployedChain {
    deploymentId: string;
    chainName: string;
    chainId: number;
    chainAddress: string;
    deploymentTxHash: string;
    rpcUrl: string;
    explorerUrl: string;
    status: string;
    createdAt: string;
    parentChainId: number;
}

interface DeployedChainsSectionProps {
    userAddress: string;
}

const CHAIN_ID_TO_NAME: Record<number, string> = {
    421614: "Arbitrum Sepolia",
    42161: "Arbitrum One",
    1: "Ethereum Mainnet",
};

export default function DeployedChainsSection({
    userAddress,
}: DeployedChainsSectionProps) {
    const [chains, setChains] = useState<DeployedChain[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingToMetaMask, setAddingToMetaMask] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeployedChains = async () => {
            if (!userAddress) return;

            try {
                setIsLoading(true);
                const response = await fetch(
                    `/api/deployed-chains?userAddress=${userAddress}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch deployed chains");
                }

                const data = await response.json();
                setChains(data.chains || []);
            } catch (err) {
                console.error("Error fetching deployed chains:", err);
                setError("Failed to load deployed chains");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeployedChains();
    }, [userAddress]);

    const addToMetaMask = async (chain: DeployedChain) => {
        // Check if MetaMask is available
        if (!window.ethereum) {
            alert("MetaMask is not installed. Please install MetaMask to continue.");
            return;
        }

        setAddingToMetaMask(chain.deploymentId);

        try {
            // Convert chainId to hexadecimal
            const chainIdHex = `0x${chain.chainId.toString(16)}`;

            const networkData = {
                chainId: chainIdHex,
                chainName: chain.chainName,
                nativeCurrency: {
                    name: "MTK",
                    symbol: "MTK",
                    decimals: 18,
                },
                rpcUrls: [chain.rpcUrl],
                blockExplorerUrls: [chain.explorerUrl],
            };

            await (window.ethereum as any).request({
                method: "wallet_addEthereumChain",
                params: [networkData],
            });

            console.log("Chain added to MetaMask successfully");
        } catch (err: any) {
            console.error("Error adding chain to MetaMask:", err);

            if (err.code === 4001) {
                // User rejected the request
                alert("You rejected the request to add the network to MetaMask");
            } else {
                alert(`Failed to add network to MetaMask: ${err.message}`);
            }
        } finally {
            setAddingToMetaMask(null);
        }
    };

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const shortenTxHash = (hash: string) => {
        return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "orbit_deployed":
                return "bg-green-900/30 text-green-400 border-green-500/30";
            case "deploying":
                return "bg-yellow-900/30 text-yellow-400 border-yellow-500/30";
            case "failed":
                return "bg-red-900/30 text-red-400 border-red-500/30";
            default:
                return "bg-gray-900/30 text-gray-400 border-gray-500/30";
        }
    };

    if (isLoading) {
        return (
            <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                    🚀 Your Deployed Chains
                </h2>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                    🚀 Your Deployed Chains
                </h2>
                <div className="text-center py-8">
                    <p className="text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    if (chains.length === 0) {
        return (
            <div className="bg-slate-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                    🚀 Your Deployed Chains
                </h2>
                <div className="text-center py-8">
                    <p className="text-gray-400">
                        You haven't deployed any chains yet. Complete the Orbit challenges to deploy your first chain!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="bg-slate-800 rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                    🚀 Your Deployed Chains
                </h2>
                <div className="bg-emerald-900/30 text-emerald-400 px-4 py-2 rounded-lg font-semibold">
                    {chains.length} {chains.length === 1 ? "Chain" : "Chains"}
                </div>
            </div>

            <div className="space-y-4">
                {chains.map((chain, index) => (
                    <motion.div
                        key={chain.deploymentId}
                        className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/60 hover:border-emerald-500/40 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1 space-y-3">
                                {/* Chain Name and Status */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="text-xl font-bold text-white">
                                        {chain.chainName}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
                                            chain.status
                                        )}`}
                                    >
                                        {chain.status.replace("_", " ").toUpperCase()}
                                    </span>
                                </div>

                                {/* Chain Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-400">Deployment ID:</span>
                                        <p className="text-gray-200 font-mono break-all">
                                            {chain.deploymentId}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Chain ID:</span>
                                        <p className="text-gray-200 font-mono">{chain.chainId}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Chain Address:</span>
                                        <p className="text-gray-200 font-mono">
                                            {shortenAddress(chain.chainAddress)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Parent Chain:</span>
                                        <p className="text-gray-200">
                                            {CHAIN_ID_TO_NAME[chain.parentChainId] || `Chain ${chain.parentChainId}`}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Transaction Hash:</span>
                                        <a
                                            href={`https://sepolia.arbiscan.io/tx/${chain.deploymentTxHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
                                        >
                                            {shortenTxHash(chain.deploymentTxHash)}
                                            <svg
                                                className="w-3 h-3"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Deployed:</span>
                                        <p className="text-gray-200">
                                            {new Date(chain.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* RPC and Explorer URLs */}
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                                        <span className="text-gray-400 text-xs">RPC:</span>
                                        <code className="text-emerald-400 text-xs font-mono">
                                            {chain.rpcUrl}
                                        </code>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                                        <span className="text-gray-400 text-xs">Explorer:</span>
                                        <code className="text-teal-400 text-xs font-mono">
                                            {chain.explorerUrl}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
