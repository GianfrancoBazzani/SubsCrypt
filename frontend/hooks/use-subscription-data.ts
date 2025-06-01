"use client"

import { useEffect, useState } from "react"
import { createPublicClient, http, decodeEventLog } from "viem"
import { sepolia } from "viem/chains"
import marketplaceAbi from "@/abi/SubsCryptMarketplace.json"
import { ETHER_ADDRESS } from "@/lib/constants"

// Add types for the service offer and account data
interface ServiceOffer {
  serviceProvider: `0x${string}`
  paymentRecipient: `0x${string}`
  paymentAsset: `0x${string}`
  assetChainId: bigint
  servicePrice: bigint
  paymentInterval: bigint
}

interface AccountData {
  account: `0x${string}`
  serviceId: bigint
  serviceOffer: ServiceOffer | null
}

export function useSubscriptionsData() {
  const [accounts, setAccounts] = useState<AccountData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const client = createPublicClient({
    chain: sepolia,
    transport: http(),
  })

  const contractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`
  
  async function fetchAccountData() {
    try {
      setIsLoading(true)
      setError(null)

      // Get all AccountInitialized events
      const logs = await client.getLogs({
        address: contractAddress,
        event: {
          type: 'event',
          name: 'AccountInitialized',
          inputs: [
            { type: 'uint256', name: 'serviceId', indexed: true },
            { type: 'address', name: 'account', indexed: true }
          ]
        },
        fromBlock: BigInt(8450277),
        toBlock: 'latest'
      })

      // Process all events and fetch corresponding service data
      const accountDataPromises = logs.map(async (log) => {
        const { args } = decodeEventLog({
          abi: marketplaceAbi,
          data: log.data,
          topics: log.topics,
          eventName: 'AccountInitialized'
        })

        if (!args || args.length < 2) {
          throw new Error('Missing event data')
        }
        const [, accountFromEvent] = args as [bigint, `0x${string}`];

        // Get service ID from accountToServices mapping
        const serviceId = await client.readContract({
          address: contractAddress,
          abi: marketplaceAbi,
          functionName: 'accountToServices',
          args: [accountFromEvent]
        }) as bigint
        // Get service offer from serviceOffers mapping
        const serviceOffer = await client.readContract({
          address: contractAddress,
          abi: marketplaceAbi,
          functionName: 'serviceOffers',
          args: [serviceId]
        }) as ServiceOffer

        return {
          account: accountFromEvent,
          serviceId,
          serviceOffer: serviceOffer.paymentRecipient.toLowerCase() === ETHER_ADDRESS.toLowerCase() ? null : serviceOffer
        }
      })

      const accountData = await Promise.all(accountDataPromises)
      setAccounts(accountData)
      
    } catch (err) {
      console.error('Error fetching account data:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch account data'))
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAccountData()
  }, [contractAddress])

  const refresh = () => {
    setIsLoading(true)
    setAccounts([])
    fetchAccountData()
    // Re-run the effect
    // Note: The effect will automatically run again when isLoading changes
  }

  return {
    accounts,
    isLoading,
    error,
    refresh
  }
}
