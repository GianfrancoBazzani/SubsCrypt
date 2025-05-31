"use client"

import { useState, useEffect, useCallback } from "react"
import { useReadContract } from "wagmi"
import { formatUnits, zeroAddress } from "viem"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Eye, Ban, RefreshCw } from "lucide-react"
import { SUBSCRYPT_MARKETPLACE_ABI, SUBSCRYPT_MARKETPLACE_ADDRESS, PAYMENT_INTERVAL_LABELS } from "@/lib/contract"
import { toast } from "sonner"
import { ETHER_ADDRESS } from "@/lib/constants"

// ERC20 ABI for getting token symbol and decimals
const ERC20_ABI = [
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
] as const

interface ServiceOffer {
    id: number
    serviceProvider: string
    paymentRecipient: string
    paymentAsset: string
    assetChainId: bigint
    servicePrice: bigint
    paymentInterval: number
    tokenSymbol: string
    tokenDecimals: number
}

export function SubscriptionsList() {
    const [services, setServices] = useState<ServiceOffer[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    // Read contract functions
    const { data: serviceCount } = useReadContract({
        address: SUBSCRYPT_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: SUBSCRYPT_MARKETPLACE_ABI,
        functionName: "serviceCount",
    })

    const fetchServiceData = useCallback(async (serviceId: number) => {
        try {
            const { data: serviceData } = await useReadContract({
                address: SUBSCRYPT_MARKETPLACE_ADDRESS as `0x${string}`,
                abi: SUBSCRYPT_MARKETPLACE_ABI,
                functionName: "serviceOffers",
                args: [BigInt(serviceId)],
            })

            if (!serviceData) return null

            const [serviceProvider, paymentRecipient, paymentAsset, assetChainId, servicePrice, paymentInterval] = serviceData

            // Get token symbol and decimals
            let tokenSymbol = "ETH"
            let tokenDecimals = 18

            // If not ETH (address(0)), try to get symbol and decimals from token contract
            if (paymentAsset.toLowerCase() !== ETHER_ADDRESS.toLowerCase()) {
                try {
                    const { data: symbol } = await useReadContract({
                        address: paymentAsset,
                        abi: ERC20_ABI,
                        functionName: "symbol",
                    })

                    const { data: decimals } = await useReadContract({
                        address: paymentAsset,
                        abi: ERC20_ABI,
                        functionName: "decimals",
                    })

                    if (symbol) tokenSymbol = symbol as string
                    if (decimals) tokenDecimals = Number(decimals)
                } catch (error) {
                    console.error(`Error fetching token info for ${paymentAsset}:`, error)
                }
            }

            return {
                id: serviceId,
                serviceProvider,
                paymentRecipient,
                paymentAsset,
                assetChainId,
                servicePrice,
                paymentInterval: Number(paymentInterval),
                tokenSymbol,
                tokenDecimals,
            }
        } catch (error) {
            console.error(`Error fetching service #${serviceId}:`, error)
            return null
        }
    }, [])

    const loadServices = useCallback(async () => {
        if (!serviceCount) return

        setIsLoading(true)
        try {
            const count = Number(serviceCount)
            const servicePromises = []

            for (let i = 1; i <= count; i++) {
                servicePromises.push(fetchServiceData(i))
            }

            const results = await Promise.all(servicePromises)
            const validServices = results.filter(service => service !== null)
            setServices(validServices)
        } catch (error) {
            console.error("Error loading services:", error)
            toast.error("Failed to load subscriptions")
        } finally {
            setIsLoading(false)
        }
    }, [serviceCount, fetchServiceData])

    useEffect(() => {
        loadServices()
    }, [loadServices])

    const handleRefresh = () => {
        loadServices()
    }

    const filteredServices = services.filter(
        (service) =>
            service.serviceProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.paymentRecipient.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold mb-2">Subscriptions</h2>
                <p className="text-muted-foreground">Manage all platform subscriptions</p>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Search & Filter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search by address..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Subscriptions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Subscriptions</CardTitle>
                    <CardDescription>Total subscriptions: {filteredServices.filter(s => s.paymentRecipient !== zeroAddress).length && 0}</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                            Loading subscriptions...
                        </div>
                    ) : filteredServices.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {services.length === 0 ? "No subscriptions found" : "No results match your search"}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredServices.filter(s => s.paymentRecipient !== zeroAddress).map((service) => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Subscription #{service.id}</span>
                                            <Badge variant={service.paymentInterval === 2 ? "default" : "secondary"}>
                                                {PAYMENT_INTERVAL_LABELS[service.paymentInterval as keyof typeof PAYMENT_INTERVAL_LABELS]}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <p className="text-muted-foreground">
                                                <span className="font-medium">Provider:</span>{" "}
                                                <span className="font-mono">{formatAddress(service.serviceProvider)}</span>
                                            </p>
                                            <p className="text-muted-foreground">
                                                <span className="font-medium">Recipient:</span>{" "}
                                                <span className="font-mono">{formatAddress(service.paymentRecipient)}</span>
                                            </p>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Chain ID: {service.assetChainId.toString()} • Asset:{" "}
                                            {service.paymentAsset.toLowerCase() === ETHER_ADDRESS.toLowerCase()
                                                ? "Native Token"
                                                : formatAddress(service.paymentAsset)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold">
                                            {formatUnits(service.servicePrice, service.tokenDecimals)} {service.tokenSymbol}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => window.open(`https://etherscan.io/address/${service.serviceProvider}`, "_blank")}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Ban className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
