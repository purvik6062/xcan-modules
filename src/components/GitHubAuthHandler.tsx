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

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#050b1f] via-[#0a1430] to-[#102247] px-4 py-10"
      >
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
          <div className="absolute -top-8 right-8 h-44 w-44 rounded-full bg-cyan-500/25 blur-3xl" />
          <div className="absolute bottom-6 left-8 h-36 w-36 rounded-full bg-indigo-500/30 blur-3xl" />
        </div>

        <div className="relative z-[1] w-full max-w-md rounded-2xl border border-[#22335c] bg-[#0d1730]/85 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-300" aria-hidden />
            </div>
            <div className="">
              <p className="truncate text-sm font-semibold tracking-wide text-slate-100 sm:text-base">
                Preparing your learning workspace
              </p>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Checking wallet and GitHub session...
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-slate-800/90">
              <div className="h-full w-2/5 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
              <div className="mb-2 h-2.5 w-2/5 animate-pulse rounded-full bg-slate-700/80" />
              <div className="mb-2 h-2.5 w-full animate-pulse rounded-full bg-slate-800/80" />
              <div className="h-2.5 w-4/5 animate-pulse rounded-full bg-slate-800/70" />
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-slate-500 sm:text-xs">
            This takes a moment and works consistently across all challenge pages.
          </p>
        </div>
      </div>
    );
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
