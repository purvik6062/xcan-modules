"use client";

import { useState, useEffect, useCallback } from "react";
import { useWalletProtection } from "@/hooks/useWalletProtection";

interface GitHubAuthHandlerProps {
  onAuthComplete?: (githubUsername: string) => void;
  onAuthError?: (error: string) => void;
  children: (props: {
    isAuthenticating: boolean;
    githubUsername: string | null;
    hasGithub: boolean;
    triggerAuth: () => Promise<void>;
  }) => React.ReactNode;
}

export default function GitHubAuthHandler({
  onAuthComplete,
  onAuthError,
  children,
}: GitHubAuthHandlerProps) {
  const { address } = useWalletProtection();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [hasGithub, setHasGithub] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has GitHub username on mount
  useEffect(() => {
    const checkGitHubStatus = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/github/check-username?wallet_address=${address}`
        );
        const data = await response.json();

        if (response.ok) {
          setHasGithub(data.hasGithub);
          setGithubUsername(data.githubUsername);
        } else {
          console.error("Failed to check GitHub status:", data.error);
        }
      } catch (error) {
        console.error("Error checking GitHub status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkGitHubStatus();
  }, [address]);

  // Handle GitHub authentication flow
  const triggerAuth = useCallback(async () => {
    if (!address) {
      onAuthError?.("Wallet not connected");
      return;
    }

    if (hasGithub && githubUsername) {
      // User already has GitHub connected, just call the callback
      onAuthComplete?.(githubUsername);
      return;
    }

    setIsAuthenticating(true);

    try {
      const returnTo = encodeURIComponent(window.location.href);
      const response = await fetch(
        `/api/auth/github?wallet_address=${address}&return_to=${returnTo}`
      );
      const data = await response.json();

      if (data.authUrl) {
        // Redirect to GitHub OAuth
        window.location.href = data.authUrl;
      } else {
        throw new Error("Failed to get GitHub auth URL");
      }
    } catch (error) {
      console.error("Failed to initiate GitHub OAuth:", error);
      onAuthError?.(error instanceof Error ? error.message : "Authentication failed");
      setIsAuthenticating(false);
    }
  }, [address, hasGithub, githubUsername, onAuthComplete, onAuthError]);

  // Handle GitHub callback parameters
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const ghUser = url.searchParams.get("github_username");
    const ghId = url.searchParams.get("github_id");

    if (ghUser && address) {
      // Store GitHub username in database
      const storeUsername = async () => {
        try {
          const response = await fetch("/api/github/store-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              walletAddress: address,
              githubUsername: ghUser,
            }),
          });

          if (response.ok) {
            setGithubUsername(ghUser);
            setHasGithub(true);
            onAuthComplete?.(ghUser);

            // Clean up URL parameters
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("github_username");
            newUrl.searchParams.delete("github_id");
            window.history.replaceState({}, "", newUrl.toString());
          } else {
            throw new Error("Failed to store GitHub username");
          }
        } catch (error) {
          console.error("Error storing GitHub username:", error);
          onAuthError?.(error instanceof Error ? error.message : "Failed to store GitHub username");
        } finally {
          setIsAuthenticating(false);
        }
      };

      storeUsername();
    }
  }, [address, onAuthComplete, onAuthError]);

  // Don't render children while loading initial state
  if (isLoading) {
    return null;
  }

  return (
    <>
      {children({
        isAuthenticating,
        githubUsername,
        hasGithub,
        triggerAuth,
      })}
    </>
  );
}
