"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface UseWalletProtectionOptions {
  redirectTo?: string;
  autoRedirect?: boolean;
}

export function useWalletProtection(options: UseWalletProtectionOptions = {}) {
  const { redirectTo = "/", autoRedirect = false } = options;
  const { authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isWalletConnected = useCallback(() => {
    if (!ready) return false;

    // Check for real wallet connection (external wallets)
    const realWallet = wallets.find(
      (wallet) =>
        wallet.address === address && wallet.walletClientType !== "privy"
    );

    // Also accept Privy embedded wallets if we have an address and are connected
    const hasPrivyWallet = address && isConnected && authenticated;

    return authenticated && (realWallet || hasPrivyWallet);
  }, [ready, wallets, address, isConnected, authenticated]);

  // Handle loading state for wallet connection
  useEffect(() => {
    if (ready && authenticated && !isWalletConnected()) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [ready, authenticated, isWalletConnected]);

  // Auto redirect if enabled and wallet is not connected
  useEffect(() => {
    if (autoRedirect && ready && !isLoading && !isWalletConnected()) {
      router.push(redirectTo);
    }
  }, [autoRedirect, ready, isLoading, isWalletConnected, redirectTo, router]);

  return {
    isWalletConnected: isWalletConnected(),
    isReady: ready,
    isLoading,
    authenticated,
    user,
    wallets,
    address,
    requireConnection: () => {
      if (!isWalletConnected()) {
        throw new Error("Wallet connection required for this action");
      }
    },
  };
}