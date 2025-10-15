"use client";

import React from "react";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PrivyClientConfig } from "@privy-io/react-auth";
import { PrivyProvider } from "@privy-io/react-auth";
import { http } from "viem";
import { arbitrum, arbitrumSepolia } from "viem/chains";
import { createConfig, WagmiProvider } from "wagmi";
import { PrivyAuthHandler } from "./PrivyAuthHandler";

interface Web3ProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
}

// Wagmi configuration
const wagmiConfig = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

// Privy configuration
const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: true,
  },
  loginMethods: ["wallet"],
  appearance: {
    showWalletLoginFirst: true,
  },
  defaultChain: arbitrumSepolia,
  supportedChains: [arbitrumSepolia, arbitrum],
};

const queryClient = new QueryClient();

export default function Providers({ children }: Web3ProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
        config={privyConfig}
      >
        <QueryClientProvider client={queryClient}>
          <PrivyAuthHandler />
          <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
            {children}
          </WagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </ThemeProvider>
  );
}