"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

  const isWalletConnected = () => {
    if (!ready) return false;

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

  const isReady = ready;
  // const isConnected = isWalletConnected();

  useEffect(() => {
    if (autoRedirect && isReady && !isConnected) {
      router.push(redirectTo);
    }
  }, [autoRedirect, isReady, isConnected, redirectTo, router]);

  return {
    isWalletConnected: isConnected,
    isReady,
    authenticated,
    user,
    wallets,
    address,
    requireConnection: () => {
      if (!isConnected) {
        throw new Error("Wallet connection required for this action");
      }
    },
  };
} 