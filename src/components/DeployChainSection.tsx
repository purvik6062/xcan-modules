"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWalletProtection } from "../hooks/useWalletProtection";

interface DeployChainSectionProps {
  onComplete: () => void;
}

interface DeploymentProgress {
  status: string;
  progress: number;
  currentStep: string;
  chainAddress?: string;
  log: string;
}

const DEPLOYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  deploying_orbit: "Deploying Orbit Chain",
  orbit_deployed: "Orbit Chain Deployed",
  failed: "Deployment Failed",
};

const BACKEND_API_URL = process.env.NEXT_PUBLIC_DEPLOYMENT_API_URL || "http://localhost:3001";

export default function DeployChainSection({ onComplete }: DeployChainSectionProps) {
  const { address, isReady } = useWalletProtection();
  const [chainName, setChainName] = useState("");
  const [chainId, setChainId] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentId, setDeploymentId] = useState("");
  const [progress, setProgress] = useState<DeploymentProgress | null>(null);
  const [error, setError] = useState("");
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);

  const generateDeploymentId = () => {
    return `orbit-deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const startDeployment = async () => {
    if (!address || !isReady) {
      setError("Please connect your wallet first");
      return;
    }

    if (!chainName || !chainId) {
      setError("Please fill in all required fields");
      return;
    }

    const chainIdNum = parseInt(chainId);
    if (isNaN(chainIdNum) || chainIdNum < 1000) {
      setError("Chain ID must be a number greater than or equal to 1000");
      return;
    }

    setError("");
    setIsDeploying(true);
    const newDeploymentId = generateDeploymentId();
    setDeploymentId(newDeploymentId);

    try {
      const deploymentRequest = {
        deployment_id: newDeploymentId,
        chain_name: chainName,
        chain_id: chainIdNum,
        owner_address: address,
        user_address: address,
      };

      console.log("[DeployChain] Starting deployment:", deploymentRequest);

      const response = await fetch(`${BACKEND_API_URL}/deploy-chain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deploymentRequest),
      });

      const result = await response.json();
      console.log("[DeployChain] Deployment response:", result);

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "Deployment failed");
      }

      // Start polling for status
      pollDeploymentStatus(newDeploymentId);
    } catch (err) {
      console.error("[DeployChain] Deployment error:", err);
      setError(err instanceof Error ? err.message : "Failed to start deployment");
      setIsDeploying(false);
    }
  };

  const pollDeploymentStatus = async (depId: string) => {
    const maxAttempts = 60; // Poll for up to 5 minutes (60 * 5 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/deployment-status/${depId}`);
        const result = await response.json();

        console.log("[DeployChain] Status poll:", result);

        if (result.progress) {
          setProgress(result.progress);

          if (result.progress.status === "orbit_deployed") {
            setIsDeploying(false);
            setDeploymentSuccess(true);
            onComplete();
            return;
          }

          if (result.progress.status === "failed") {
            setError(result.progress.log || "Deployment failed");
            setIsDeploying(false);
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts && isDeploying) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else if (attempts >= maxAttempts) {
          setError("Deployment timeout - please check deployment status manually");
          setIsDeploying(false);
        }
      } catch (err) {
        console.error("[DeployChain] Status poll error:", err);
        attempts++;
        if (attempts < maxAttempts && isDeploying) {
          setTimeout(poll, 5000);
        }
      }
    };

    poll();
  };

  const resetForm = () => {
    setChainName("");
    setChainId("");
    setDeploymentId("");
    setProgress(null);
    setError("");
    setDeploymentSuccess(false);
    setIsDeploying(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          🚀 Deploy Your Own Orbit Chain
        </h2>
        <p className="text-gray-300 text-lg">
          Deploy your own custom Arbitrum Orbit chain with just a few clicks. This will create
          a Layer 3 blockchain with your specified configuration.
        </p>
      </div>

      {!deploymentSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-2xl shadow-xl p-8"
        >
          {/* Deployment Form */}
          {!isDeploying ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="chainName" className="block text-sm font-medium text-gray-300 mb-2">
                  Chain Name *
                </label>
                <input
                  id="chainName"
                  type="text"
                  value={chainName}
                  onChange={(e) => setChainName(e.target.value)}
                  placeholder="e.g., My Awesome Orbit Chain"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={isDeploying}
                />
              </div>

              <div>
                <label htmlFor="chainId" className="block text-sm font-medium text-gray-300 mb-2">
                  Chain ID *
                </label>
                <input
                  id="chainId"
                  type="number"
                  value={chainId}
                  onChange={(e) => setChainId(e.target.value)}
                  placeholder="e.g., 121212 (must be ≥ 1000)"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={isDeploying}
                  min="1000"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Choose a unique chain ID greater than or equal to 1000
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>
                  <span>Connected Wallet</span>
                </h4>
                <p className="text-sm text-blue-300">
                  Owner Address: <code className="bg-blue-800 px-2 py-1 rounded">{address || "Not connected"}</code>
                </p>
                <p className="text-xs text-blue-400 mt-1">
                  This address will be set as the chain owner and user address for the deployment
                </p>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                  <p className="text-red-300 text-sm">❌ {error}</p>
                </div>
              )}

              <button
                onClick={startDeployment}
                disabled={!address || !chainName || !chainId || isDeploying}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {!address ? (
                  <>🔒 Connect Wallet First</>
                ) : (
                  <>🚀 Deploy Orbit Chain</>
                )}
              </button>

              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-200 mb-2">⚠️ Important Notes:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-300">
                  <li>Deployment typically takes 2-5 minutes to complete</li>
                  <li>Make sure your chain ID is unique and not used by other networks</li>
                  <li>The deployment will use the connected wallet address as the chain owner</li>
                  <li>You'll receive real-time updates on the deployment progress</li>
                </ul>
              </div>
            </div>
          ) : (
            // Deployment Progress
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mb-4"></div>
                <h3 className="text-xl font-bold text-white mb-2">Deploying Your Chain...</h3>
                <p className="text-gray-400">Deployment ID: {deploymentId}</p>
              </div>

              {progress && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">{progress.currentStep}</span>
                      <span className="text-emerald-400">{progress.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Status:</h4>
                    <p className="text-emerald-400 text-sm">
                      {DEPLOYMENT_STATUS_LABELS[progress.status] || progress.status}
                    </p>
                  </div>

                  {progress.log && (
                    <div className="bg-slate-900 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Log:</h4>
                      <pre className="text-xs text-gray-400 whitespace-pre-wrap overflow-x-auto">
                        {progress.log}
                      </pre>
                    </div>
                  )}

                  {progress.chainAddress && (
                    <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-200 mb-2">✅ Chain Address:</h4>
                      <code className="text-sm text-emerald-300 break-all">
                        {progress.chainAddress}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      ) : (
        // Success State
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold mb-4">Deployment Successful!</h3>
          <p className="text-lg mb-6">
            Congratulations! Your Orbit chain "{chainName}" has been successfully deployed.
          </p>
          
          {progress?.chainAddress && (
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2">Chain Details:</h4>
              <div className="text-left space-y-2 text-sm">
                <p><strong>Chain Name:</strong> {chainName}</p>
                <p><strong>Chain ID:</strong> {chainId}</p>
                <p><strong>Chain Address:</strong> <code className="bg-black/20 px-2 py-1 rounded break-all">{progress.chainAddress}</code></p>
                <p><strong>Owner Address:</strong> <code className="bg-black/20 px-2 py-1 rounded break-all">{address}</code></p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={resetForm}
              className="w-full bg-white text-emerald-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Deploy Another Chain
            </button>
            <p className="text-sm opacity-90">
              Your chain is now live and ready to use! 🚀
            </p>
          </div>
        </motion.div>
      )}

      {/* Information Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6">
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <span>📚</span>
            <span>What Happens During Deployment?</span>
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Chain configuration is prepared with your parameters</li>
            <li>• Core contracts are deployed to the parent chain</li>
            <li>• Rollup infrastructure is initialized</li>
            <li>• Chain ownership is transferred to your address</li>
          </ul>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <span>🔧</span>
            <span>Next Steps</span>
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Set up your chain's RPC endpoint</li>
            <li>• Configure batch posters and validators</li>
            <li>• Add your chain to wallet networks</li>
            <li>• Start building your ecosystem!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

