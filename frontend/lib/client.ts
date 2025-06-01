import { createWalletClient, http } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
 
export const walletClient = () => createWalletClient({
  account: privateKeyToAccount(generatePrivateKey()),
  chain: sepolia,
  transport: http(),
})