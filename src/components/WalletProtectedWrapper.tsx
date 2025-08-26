"use client";

import React, { useEffect } from "react";
import { useWalletProtection } from "@/hooks/useWalletProtection";
import ConnectWallet from "./ConnectWallet";
import GitHubConnect from "./GitHubConnect";
import { motion } from "framer-motion";
import { FiShield, FiWifi, FiGithub, FiCheckCircle } from "react-icons/fi";

interface WalletProtectedWrapperProps {
  children: React.ReactNode;
}

export default function WalletProtectedWrapper({
  children,
}: WalletProtectedWrapperProps) {
  const {
    isWalletConnected,
    /* isGitHubConnected, */
    /* isFullyAuthenticated, */
    githubUsername,
    isReady,
    isLoading,
    address,
    refreshAuthStatus
  } = useWalletProtection();

  // Capture GitHub params after OAuth and store them locally, then refresh auth status
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const ghUser = url.searchParams.get("github_username");
    if (ghUser) {
      if (!localStorage.getItem("github_username")) {
        localStorage.setItem("github_username", ghUser);
      }
      refreshAuthStatus();
    }
  }, [refreshAuthStatus]);

  // When wallet is connected and API reports a GitHub username, store it locally if missing
  useEffect(() => {
    if (!isWalletConnected) return;
    if (!githubUsername) return;
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("github_username")) {
      localStorage.setItem("github_username", githubUsername);
    }
  }, [isWalletConnected, githubUsername]);


  // Show loading state while Privy is initializing
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading state while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  // If wallet is not connected, show wallet connection prompt
  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-[#0D1221] p-8 rounded-2xl shadow-2xl border border-gray-700">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FiShield className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-4">Wallet Required</h1>

            <p className="text-gray-300 mb-6 leading-relaxed">Connect your wallet to access content.</p>

            <div className="space-y-4 w-full mx-auto">
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${isWalletConnected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className="text-white">Wallet Connection</span>
                </div>
                {isWalletConnected ? (
                  <FiCheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <ConnectWallet />
                )}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400 mt-6">
              <FiWifi className="w-4 h-4" />
              <span>Secure • Fast • Easy</span>
            </div>

            <div className="text-xs text-gray-500 mt-4"></div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-400 text-sm">
              New to crypto wallets?{" "}
              <a
                href="https://ethereum.org/en/wallets/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Learn more
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // If fully authenticated, render the protected content
  return <>{children}</>;
} 