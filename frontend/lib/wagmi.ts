import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { sepolia } from "wagmi/chains"

console.log({foo: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID});

export const config = getDefaultConfig({
  appName: "SubsCrypt Admin",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [sepolia],
  ssr: true,
})
