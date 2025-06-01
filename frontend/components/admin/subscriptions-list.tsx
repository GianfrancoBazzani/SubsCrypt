"use client"

import { useState } from "react"
import { formatUnits } from "viem"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Search, Eye, Ban, MoreHorizontal } from "lucide-react"
import { PAYMENT_INTERVAL_LABELS } from "@/lib/contract"
import { useSubscriptionsData } from "@/hooks/use-subscription-data"
import { ETHER_ADDRESS } from "@/lib/constants"

export function SubscriptionsList() {
    const [searchTerm, setSearchTerm] = useState("")
    const { accounts, isLoading, error, refresh } = useSubscriptionsData()

    const filteredAccounts = accounts.filter(
        (account) =>
            account.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.serviceOffer?.serviceProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.serviceOffer?.paymentRecipient.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold mb-2">Active Subscriptions</h2>
                <p className="text-muted-foreground">View and manage all active subscriptions</p>
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
                        <Button variant="outline" onClick={refresh} disabled={isLoading}>
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
                    <CardDescription>Total active subscriptions: {filteredAccounts.length}</CardDescription>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className="text-center py-8 text-red-500">
                            Error loading subscriptions: {error.message}
                        </div>
                    ) : isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                            Loading subscriptions...
                        </div>
                    ) : filteredAccounts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {accounts.length === 0 ? "No active subscriptions found" : "No results match your search"}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAccounts.map((account) => (
                                account.serviceOffer && (
                                    <div
                                        key={account.account}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Account {formatAddress(account.account)}</span>
                                                <Badge variant={Number(account.serviceOffer.paymentInterval) === 2 ? "default" : "secondary"}>
                                                    {PAYMENT_INTERVAL_LABELS[Number(account.serviceOffer.paymentInterval) as keyof typeof PAYMENT_INTERVAL_LABELS]}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                <p className="text-muted-foreground">
                                                    <span className="font-medium">Provider:</span>{" "}
                                                    <span className="font-mono">{formatAddress(account.serviceOffer.serviceProvider)}</span>
                                                </p>
                                                <p className="text-muted-foreground">
                                                    <span className="font-medium">Recipient:</span>{" "}
                                                    <span className="font-mono">{formatAddress(account.serviceOffer.paymentRecipient)}</span>
                                                </p>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Chain ID: {account.serviceOffer.assetChainId.toString()} • Asset:{" "}
                                                {account.serviceOffer.paymentAsset.toLowerCase() === ETHER_ADDRESS.toLowerCase()
                                                    ? "Native Token"
                                                    : formatAddress(account.serviceOffer.paymentAsset)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold">
                                                {formatUnits(account.serviceOffer.servicePrice, 18)} ETH
                                            </span>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => window.open(`https://eth-sepolia.blockscout.com/address/${account.account}`, "_blank")}
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
                                )
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
