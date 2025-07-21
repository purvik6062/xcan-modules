"use client";

import React from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import ConnectWallet from "./ConnectWallet";
import { motion } from "framer-motion";
import { FiShield, FiWifi } from "react-icons/fi";

interface WalletProtectedWrapperProps {
  children: React.ReactNode;
}

export default function WalletProtectedWrapper({
  children,
}: WalletProtectedWrapperProps) {
  const { authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();
  const { address, isConnected } = useAccount();

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing wallet connection...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and has a wallet connected
  const hasWalletConnected = () => {
    // Check for social login (Google/Farcaster)
    const hasSocialLogin = user?.google || user?.farcaster;
    if (hasSocialLogin) return true;

    // Check for real wallet connection (not just embedded wallet)
    const realWallet = wallets.find(
      (wallet) =>
        wallet.address === address && wallet.walletClientType !== "privy"
    );

    return authenticated && isConnected && realWallet;
  };

  // If not connected, show connection prompt
  if (!hasWalletConnected()) {
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

            <h1 className="text-2xl font-bold text-white mb-4">
              Wallet Required
            </h1>

            <p className="text-gray-300 mb-6 leading-relaxed">
              To access the learning modules and challenges, you need to connect your wallet.
              This ensures a secure and personalized learning experience.
            </p>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400 mb-6">
              <FiWifi className="w-4 h-4" />
              <span>Secure • Fast • Easy</span>
            </div>

            <div className="space-y-4 w-full mx-auto">
              <ConnectWallet />

              <div className="text-xs text-gray-500">
                <p>
                  By connecting your wallet, you agree to our terms of service.
                  Your wallet is only used for authentication and progress tracking.
                </p>
              </div>
            </div>
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

  // If connected, render the protected content
  return <>{children}</>;
} 