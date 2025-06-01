"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useServiceData } from "@/hooks/use-service-data"
import { formatEther, zeroAddress } from "viem"
import { RefreshCw, Lock } from "lucide-react"
import { PAYMENT_INTERVAL_LABELS } from "@/lib/contract"
import { SubscriptionModal } from "@/components/ui/subsription-modal"
import { walletClient } from "@/lib/client"

export default function SubscriptionsPage() {
    const { services, isLoading, serviceCount, refresh } = useServiceData()
    const [selectedService, setSelectedService] = useState<number | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const client = walletClient()
    const networkName = client.chain.name

    const handleSubscribeClick = (serviceId: number) => {
        setSelectedService(serviceId)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedService(null)
    }

    const selectedServiceData = selectedService ? services.find(s => s.id === selectedService) : null

    return (
        <>
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">SubsCrypt</span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                            How It Works
                        </a>
                        <a href="#architecture" className="text-muted-foreground hover:text-foreground transition-colors">
                            Architecture
                        </a>
                        <Button onClick={() => setIsModalOpen(true)}>Start Subscription</Button>
                    </nav>
                </div>
            </header>

            <div className="container mx-auto py-10 space-y-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Available Subscriptions</h1>
                    <p className="text-muted-foreground">
                        Browse and subscribe to services available on the SubsCrypt marketplace
                    </p>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">
                        Available services: {serviceCount ? services.filter(s => s.serviceProvider !== zeroAddress).length : "0"}
                    </p>
                    <Button variant="outline" onClick={refresh} disabled={isLoading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                        Loading available services...
                    </div>
                ) : services.length === 0 ? (
                    <Card>
                        <CardContent className="py-10">
                            <div className="text-center text-muted-foreground">
                                No services available at the moment
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <Card key={service.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>Service #{service.id}</CardTitle>
                                            <CardDescription>
                                                {formatEther(service.servicePrice)} ETH / {" "}
                                                {PAYMENT_INTERVAL_LABELS[Number(service.paymentInterval) as keyof typeof PAYMENT_INTERVAL_LABELS]}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline">
                                            {PAYMENT_INTERVAL_LABELS[Number(service.paymentInterval) as keyof typeof PAYMENT_INTERVAL_LABELS]}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Provider</p>
                                                <p className="font-mono">{service.serviceProvider.slice(0, 10)}...</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Recipient</p>
                                                <p className="font-mono">{service.paymentRecipient.slice(0, 10)}...</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Asset</p>
                                                <p>ETH</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Network</p>
                                                <p>{networkName}</p>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                                            onClick={() => handleSubscribeClick(service.id)}
                                        >
                                            Subscribe Now
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {selectedServiceData && (
                <SubscriptionModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    service={selectedServiceData}
                />
            )}
        </>
    )
}
