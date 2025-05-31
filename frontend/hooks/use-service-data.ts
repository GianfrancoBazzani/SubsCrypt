import { useState, useEffect } from "react"
import { readContract } from "viem/actions"
import { walletClient } from "@/lib/client"
import { SUBSCRYPT_MARKETPLACE_ABI, SUBSCRYPT_MARKETPLACE_ADDRESS } from "@/lib/contract"
import { zeroAddress } from "viem"

interface ServiceOffer {
    serviceProvider: string
    paymentRecipient: string
    paymentAsset: string
    assetChainId: bigint
    servicePrice: bigint
    paymentInterval: bigint
}

export function useServiceData() {
    const [services, setServices] = useState<(ServiceOffer & { id: number })[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [serviceCount, setServiceCount] = useState<bigint | undefined>(undefined)

    const fetchServiceData = async (serviceId: number) => {
        const serviceData = await readContract(
            walletClient(),
            {
                address: SUBSCRYPT_MARKETPLACE_ADDRESS as `0x${string}`,
                abi: SUBSCRYPT_MARKETPLACE_ABI,
                functionName: "serviceOffers",
                args: [BigInt(serviceId)],
            })
        return serviceData
    }

    const fetchServiceCount = async () => {
        const data = await readContract(
            walletClient(),
            {
                address: SUBSCRYPT_MARKETPLACE_ADDRESS as `0x${string}`,
                abi: SUBSCRYPT_MARKETPLACE_ABI,
                functionName: "serviceCount",
            })

        return data
    }

    const loadServices = async (count: bigint) => {
        if (!count) return

        setIsLoading(true)
        const loadedServices: (ServiceOffer & { id: number })[] = []

        try {
            for (let i = 1; i <= Number(count); i++) {
                const serviceData = await fetchServiceData(i)
                const [, paymentRecipient, , , ,] = serviceData

                if (paymentRecipient !== zeroAddress) {
                    const [serviceProvider, , paymentAsset, assetChainId, servicePrice, paymentInterval] =
                        serviceData
                    loadedServices.push({
                        id: i,
                        serviceProvider,
                        paymentRecipient,
                        paymentAsset,
                        assetChainId,
                        servicePrice,
                        paymentInterval,
                    })
                }
            }
            setServices(loadedServices)
        } catch (error) {
            console.error("Error loading services:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const refresh = async () => {
        setIsLoading(true)
        try {
            const count = await fetchServiceCount()
            if (count) {
                setServiceCount(count as bigint)
                await loadServices(count as bigint)
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Load initial data
    useEffect(() => {
        refresh()
    }, [])

    return {
        services,
        isLoading,
        serviceCount,
        refresh
    }
}
