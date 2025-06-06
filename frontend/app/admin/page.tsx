"use client"

import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

const ADMIN_ADDRESSES = [
    process.env.NEXT_PUBLIC_ADMIN_ADDRESSES,
]

export default function AdminPage() {
    const { address, isConnected } = useAccount()

    const isAdmin = isConnected && address && ADMIN_ADDRESSES.includes(address)

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl">Admin Access</CardTitle>
                        <CardDescription>Connect your wallet to access the admin dashboard</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ConnectButton />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
                        <CardDescription>Your wallet address is not authorized to access the admin dashboard</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ConnectButton />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <AdminDashboard />
}
