import { PrivyClientConfig } from "@privy-io/react-auth";
import { arbitrumSepolia } from "wagmi/chains";

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
  },
  loginMethods: ["wallet"],
  defaultChain: arbitrumSepolia,
  supportedChains: [arbitrumSepolia],
  appearance: {
    theme: "dark",
    accentColor: "#0066FF",
    logo: "https://speedrun-stylus.vercel.app/favicon.ico",
  },
};
