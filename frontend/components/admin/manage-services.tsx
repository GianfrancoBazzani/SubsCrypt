"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, formatEther, zeroAddress } from "viem"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, RefreshCw, ExternalLink } from "lucide-react"
import {
    SUBSCRYPT_MARKETPLACE_ABI,
    SUBSCRYPT_MARKETPLACE_ADDRESS,
    PAYMENT_INTERVALS,
    PAYMENT_INTERVAL_LABELS,
} from "@/lib/contract"
import { toast } from "sonner"
import { sepolia } from "viem/chains"

interface ServiceOffer {
    serviceProvider: string
    paymentRecipient: string
    paymentAsset: string
    assetChainId: bigint
    servicePrice: bigint
    paymentInterval: bigint
}

export function ManageServices() {
    const { address } = useAccount()
    const [formData, setFormData] = useState({
        serviceProvider: "",
        paymentRecipient: "",
        paymentAsset: "",
        assetChainId: sepolia.id.toString(),
        servicePrice: "",
        paymentInterval: PAYMENT_INTERVALS.MONTHLY.toString(),
    })
    const [services, setServices] = useState<(ServiceOffer & { id: number })[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [serviceCount, setServiceCount] = useState<bigint | undefined>(undefined)

    // Write contract functions
    const { writeContract, data: hash, isPending } = useWriteContract()

    // Wait for transaction confirmation
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    const fetchServiceData = useCallback(async (serviceId: number) => {
        const { data: serviceData } = useReadContract({
            address: SUBSCRYPT_MARKETPLACE_ADDRESS as `0x${string}`,
            abi: SUBSCRYPT_MARKETPLACE_ABI,
            functionName: "serviceOffers",
            args: [BigInt(serviceId)],
        })
        return serviceData
    }, [])

    const fetchServiceCount = useCallback(async () => {
        const { data } = useReadContract({
            address: SUBSCRYPT_MARKETPLACE_ADDRESS as `0x${string}`,
            abi: SUBSCRYPT_MARKETPLACE_ABI,
            functionName: "serviceCount",
        })
        return data
    }, [])

    // Load services when component mounts or service count changes
    useEffect(() => {
        const loadInitialData = async () => {
            const count = await fetchServiceCount()
            if (count) {
                setServiceCount(count as bigint)
                loadServices(count as bigint)
            }
        }

        loadInitialData()
    }, [fetchServiceCount])

    // Handle transaction success
    useEffect(() => {
        if (isConfirmed) {
            toast.success("Transaction confirmed!")
            const updateServiceData = async () => {
                const count = await fetchServiceCount()
                if (count) {
                    setServiceCount(count as bigint)
                    loadServices(count as bigint)
                }
            }
            updateServiceData()
        }
    }, [isConfirmed, fetchServiceCount])

    const loadServices = async (count: bigint) => {
        if (!count) return

        setIsLoading(true)
        const loadedServices: (ServiceOffer & { id: number })[] = []

        try {
            for (let i = 1; i <= Number(count); i++) {
                const serviceData = await fetchServiceData(i)

                if (serviceData) {
                    const [serviceProvider, paymentRecipient, paymentAsset, assetChainId, servicePrice, paymentInterval] =
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
            toast.error("Failed to load services")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleRegisterService = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!address) {
            toast.error("Please connect your wallet")
            return
        }

        try {
            const serviceOffer = {
                serviceProvider: ((formData.serviceProvider || address) as `0x${string}`),
                paymentRecipient: ((formData.paymentRecipient || address) as `0x${string}`),
                paymentAsset: (formData.paymentAsset as `0x${string}`),
                assetChainId: BigInt(formData.assetChainId),
                servicePrice: parseEther(formData.servicePrice),
                paymentInterval: BigInt(formData.paymentInterval),
            }

            writeContract({
                address: SUBSCRYPT_MARKETPLACE_ADDRESS as `0x${string}`,
                abi: SUBSCRYPT_MARKETPLACE_ABI,
                functionName: "registerService",
                args: [serviceOffer],
            })

            toast.success("Service registration transaction submitted!")
        } catch (error) {
            console.error("Error registering service:", error)
            toast.error("Failed to register service")
        }
    }

    const handleUnregisterService = async (serviceId: number) => {
        try {
            writeContract({
                address: SUBSCRYPT_MARKETPLACE_ADDRESS as `0x${string}`,
                abi: SUBSCRYPT_MARKETPLACE_ABI,
                functionName: "unregisterService",
                args: [BigInt(serviceId)],
            })

            toast.success("Service unregistration transaction submitted!")
        } catch (error) {
            console.error("Error unregistering service:", error)
            toast.error("Failed to unregister service")
        }
    }

    const handleRefreshServices = async () => {
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

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold mb-2">Manage Services</h2>
                <p className="text-muted-foreground">
                    Register new services and manage existing ones on the SubsCrypt marketplace
                </p>
            </div>

            {/* Register New Service */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Plus className="w-5 h-5 mr-2" />
                        Register New Service
                    </CardTitle>
                    <CardDescription>Add a new service to the SubsCrypt marketplace</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegisterService} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="serviceProvider">Service Provider Address</Label>
                                <Input
                                    id="serviceProvider"
                                    placeholder={address || "0x..."}
                                    value={formData.serviceProvider}
                                    onChange={(e) => handleInputChange("serviceProvider", e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Leave empty to use your connected wallet</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="paymentRecipient">Payment Recipient Address</Label>
                                <Input
                                    id="paymentRecipient"
                                    placeholder={address || "0x..."}
                                    value={formData.paymentRecipient}
                                    onChange={(e) => handleInputChange("paymentRecipient", e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Leave empty to use your connected wallet</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="paymentAsset">Payment Asset Address</Label>
                                <Input
                                    id="paymentAsset"
                                    placeholder="0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" // USDC sepolia
                                    value={formData.paymentAsset}
                                    onChange={(e) => handleInputChange("paymentAsset", e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Use 0x0 for ETH or token contract address</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="assetChainId">Asset Chain ID</Label>
                                <Select
                                    value={formData.assetChainId}
                                    onValueChange={(value) => handleInputChange("assetChainId", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={sepolia.id.toString()}>Ethereum Sepolia ({sepolia.id})</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="servicePrice">Service Price</Label>
                                <Input
                                    id="servicePrice"
                                    type="number"
                                    step="1"
                                    placeholder="1"
                                    value={formData.servicePrice}
                                    onChange={(e) => handleInputChange("servicePrice", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="paymentInterval">Payment Interval</Label>
                                <Select
                                    value={formData.paymentInterval}
                                    onValueChange={(value) => handleInputChange("paymentInterval", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={PAYMENT_INTERVALS.DAILY.toString()}>Daily</SelectItem>
                                        <SelectItem value={PAYMENT_INTERVALS.WEEKLY.toString()}>Weekly</SelectItem>
                                        <SelectItem value={PAYMENT_INTERVALS.MONTHLY.toString()}>Monthly</SelectItem>
                                        <SelectItem value={PAYMENT_INTERVALS.YEARLY.toString()}>Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                            disabled={isPending || isConfirming}
                        >
                            {isPending || isConfirming ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    {isPending ? "Confirming..." : "Processing..."}
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Register Service
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Existing Services */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Existing Services</CardTitle>
                            <CardDescription>Total services: {serviceCount ? Number(serviceCount) : 0}</CardDescription>
                        </div>
                        <Button variant="outline" onClick={handleRefreshServices} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                            Loading services...
                        </div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No services registered yet</div>
                    ) : (
                        <div className="space-y-4">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Service #{service.id}</span>
                                            <Badge variant="outline">
                                                {PAYMENT_INTERVAL_LABELS[Number(service.paymentInterval) as keyof typeof PAYMENT_INTERVAL_LABELS]}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                            <div>
                                                <span className="font-medium">Provider:</span>{" "}
                                                <span className="font-mono">{service.serviceProvider.slice(0, 10)}...</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Recipient:</span>{" "}
                                                <span className="font-mono">{service.paymentRecipient.slice(0, 10)}...</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Price:</span> {formatEther(service.servicePrice)} ETH
                                            </div>
                                            <div>
                                                <span className="font-medium">Chain ID:</span> {service.assetChainId.toString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => window.open(`https://etherscan.io/address/${service.serviceProvider}`, "_blank")}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleUnregisterService(service.id)}
                                            disabled={isPending || isConfirming}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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
