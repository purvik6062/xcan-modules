"use client";

import { useWalletProtection } from "@/hooks/useWalletProtection";
import { FiCheckCircle, FiXCircle, FiGithub, FiShield } from "react-icons/fi";

export default function AuthStatus() {
  const {
    isWalletConnected,
    isGitHubConnected,
    isFullyAuthenticated,
    githubUsername,
    isLoading
  } = useWalletProtection();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        <span className="text-sm">Checking...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Wallet Status */}
      <div className="flex items-center space-x-1">
        <FiShield className={`w-4 h-4 ${isWalletConnected ? 'text-green-500' : 'text-red-500'}`} />
        <span className={`text-sm ${isWalletConnected ? 'text-green-500' : 'text-red-500'}`}>
          Wallet
        </span>
        {isWalletConnected ? (
          <FiCheckCircle className="w-3 h-3 text-green-500" />
        ) : (
          <FiXCircle className="w-3 h-3 text-red-500" />
        )}
      </div>

      {/* GitHub Status */}
      <div className="flex items-center space-x-1">
        <FiGithub className={`w-4 h-4 ${isGitHubConnected ? 'text-green-500' : 'text-red-500'}`} />
        <span className={`text-sm ${isGitHubConnected ? 'text-green-500' : 'text-red-500'}`}>
          GitHub
        </span>
        {isGitHubConnected ? (
          <FiCheckCircle className="w-3 h-3 text-green-500" />
        ) : (
          <FiXCircle className="w-3 h-3 text-red-500" />
        )}
      </div>

      {/* GitHub Username */}
      {isGitHubConnected && githubUsername && (
        <span className="text-sm text-gray-300">@{githubUsername}</span>
      )}

      {/* Overall Status */}
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${isFullyAuthenticated
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
        }`}>
        {isFullyAuthenticated ? 'Authenticated' : 'Incomplete'}
      </div>
    </div>
  );
} 