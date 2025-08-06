import { createConfig, http } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { metaMask, walletConnect, coinbaseWallet } from "wagmi/connectors";

const projectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
  "3a8170812b534d0ff9d794f19a901d64";

export const wagmiConfig = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    metaMask(),
    walletConnect({ projectId }),
    coinbaseWallet({ appName: "SpeedRun Stylus NFT Mint" }),
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
});

export { arbitrumSepolia as defaultChain };
