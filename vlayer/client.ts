import { env } from 'bun'
import { createWalletClient, http } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'


if (!env.MEMONIC_SEPOLIA) {
  throw new Error("No private key was specified")
}

export const account = mnemonicToAccount(env.MEMONIC_SEPOLIA);

export const client = createWalletClient({
  account: account,
  chain: sepolia, 
  transport: http(),
}) 

