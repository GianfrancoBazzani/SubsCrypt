import { env } from 'bun'
import { createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

 
export const client = createPublicClient({ 
  chain: sepolia, 
  transport: http(), 
}) 

if (!env.PRIVATE_KEY_SEPOLIA) {
  throw new Error("No private key was specified")
}

export const account = privateKeyToAccount(`0x${env.PRIVATE_KEY_SEPOLIA}`)
