"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UseWalletProtectionOptions {
  redirectTo?: string;
  autoRedirect?: boolean;
}

interface AuthStatus {
  walletConnected: boolean;
  githubConnected: boolean;
  githubUsername: string | null;
  fullyAuthenticated: boolean;
}

export function useWalletProtection(options: UseWalletProtectionOptions = {}) {
  const { redirectTo = "/", autoRedirect = false } = options;
  const { authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheckedAddress, setLastCheckedAddress] = useState<string | null>(null);

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

    // Also accept Privy embedded wallets if we have an address and are connected
    const hasPrivyWallet = address && isConnected && authenticated;

    return authenticated && (realWallet || hasPrivyWallet);
  };

  const checkAuthStatus = async () => {
    // Don't check if we're not ready or not authenticated
    if (!ready || !authenticated) {
      setAuthStatus({
        walletConnected: false,
        githubConnected: false,
        githubUsername: null,
        fullyAuthenticated: false
      });
      setIsLoading(false);
      return;
    }

    if (!isWalletConnected() || !address) {
      setAuthStatus({
        walletConnected: false,
        githubConnected: false,
        githubUsername: null,
        fullyAuthenticated: false
      });
      setIsLoading(false);
      return;
    }

    // Don't make API call if we've already checked this address recently
    if (lastCheckedAddress === address && authStatus) {
      setIsLoading(false);
      return;
    }

    try {
      // For now, we'll skip the token verification in the hook
      // The actual verification will happen in the API route
      // We'll make a simple API call to check the status

      // Check authentication status from API
      const response = await fetch("/api/auth/status", {
        headers: {
          "x-wallet-address": address
        }
      });

      if (response.ok) {
        const status = await response.json();
        setAuthStatus(status);
        setLastCheckedAddress(address);
      } else {
        // If API call fails, assume wallet is connected but GitHub is not
        setAuthStatus({
          walletConnected: true,
          githubConnected: false,
          githubUsername: null,
          fullyAuthenticated: false
        });
        setLastCheckedAddress(address);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthStatus({
        walletConnected: true,
        githubConnected: false,
        githubUsername: null,
        fullyAuthenticated: false
      });
      setLastCheckedAddress(address);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ready) {
      // Add a small delay to prevent rapid API calls during navigation
      const timer = setTimeout(() => {
        checkAuthStatus();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [ready, authenticated, address, isConnected]);

  useEffect(() => {
    if (autoRedirect && !isLoading && authStatus && !authStatus.fullyAuthenticated) {
      router.push(redirectTo);
    }
  }, [autoRedirect, isLoading, authStatus, redirectTo, router]);

  const isReady = ready && !isLoading;

  return {
    isWalletConnected: isWalletConnected(),
    isGitHubConnected: authStatus?.githubConnected || false,
    isFullyAuthenticated: authStatus?.fullyAuthenticated || false,
    githubUsername: authStatus?.githubUsername || null,
    isReady,
    isLoading,
    authenticated,
    user,
    wallets,
    address,
    authStatus,
    refreshAuthStatus: () => {
      setLastCheckedAddress(null); // Reset cache to force fresh check
      checkAuthStatus();
    },
    requireConnection: () => {
      if (!isWalletConnected()) {
        throw new Error("Wallet connection required for this action");
      }
      if (!authStatus?.fullyAuthenticated) {
        throw new Error("Both wallet and GitHub connection required for this action");
      }
    },
  };
} 