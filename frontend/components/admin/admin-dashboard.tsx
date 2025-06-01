"use client"

import { useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Settings } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SubscriptionsList } from "@/components/admin/subscriptions-list"
import { ManageServices } from "@/components/admin/manage-services"

export function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("services")

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">SubsCrypt Admin</h1>
                            <p className="text-sm text-muted-foreground">Dashboard</p>
                        </div>
                    </div>
                    <ConnectButton />
                </div>
            </header>

            <div className="flex">
                <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {activeTab === "services" && <ManageServices />}
                    {activeTab === "subscriptions" && <SubscriptionsList />}
                </main>
            </div>
        </div>
    )
}
