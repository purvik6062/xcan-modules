"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

interface GitHubConnectProps {
  walletAddress: string;
  onConnectionSuccess?: () => void;
  className?: string;
}

export default function GitHubConnect({
  walletAddress,
  onConnectionSuccess,
  className = ""
}: GitHubConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);

  const handleGitHubConnect = async () => {
    if (!walletAddress) {
      toast.error("Wallet address is required");
      return;
    }

    setIsConnecting(true);
    try {
      const response = await fetch(`/api/auth/github?wallet_address=${walletAddress}`);
      const data = await response.json();

      if (data.authUrl) {
        // Redirect to GitHub OAuth in the same window
        window.location.href = data.authUrl;
      } else {
        throw new Error("Failed to get GitHub auth URL");
      }
    } catch (error) {
      console.error("GitHub connection error:", error);
      setIsConnecting(false);
      toast.error("Failed to connect GitHub. Please try again.");
    }
  };

  const checkConnectionStatus = async () => {
    try {
      // This would need to be implemented based on your authentication flow
      // For now, we'll simulate a successful connection
      setTimeout(() => {
        setIsConnected(true);
        setGithubUsername("example-user");
        onConnectionSuccess?.();
      }, 1000);
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  };

  if (isConnected && githubUsername) {
    return (
      <div className={`flex items-center space-x-2 text-green-400 ${className}`}>
        <FiCheckCircle className="w-5 h-5" />
        <span className="text-sm">Connected as @{githubUsername}</span>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGitHubConnect}
      disabled={isConnecting}
      className={`flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span>{isConnecting ? "Connecting..." : "Connect"}</span>
      <FiGithub className="w-5 h-5" />
      {isConnecting && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      )}
    </motion.button>
  );
} 