import { base, mainnet } from "viem/chains"
import { http, createConfig } from "wagmi"
import { coinbaseWallet, metaMask, injected } from "wagmi/connectors"

export const config = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected(), // This detects MetaMask automatically
    metaMask({
      dappMetadata: {
        name: "Advanced Tetris",
        url: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
      },
    }),
    coinbaseWallet({
      appName: "Advanced Tetris",
      preference: "all", // Changed from smartWalletOnly to support more wallets
    }),
  ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
})
