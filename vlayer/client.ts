import { env } from 'bun'
import { mnemonicToAccount, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'


if (!env.MEMONIC_SEPOLIA) {
  throw new Error("No private key was specified")
}

const account = mnemonicToAccount(env.MEMONIC_SEPOLIA);

export const client = createWalletClient({
  account: account,
  chain: sepolia, 
  transport: http(),
}) 

