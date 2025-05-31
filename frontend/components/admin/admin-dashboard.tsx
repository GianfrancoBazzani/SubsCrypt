"use client"

import { useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Settings, DollarSign, UserCheck, AlertCircle } from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"
import { AnalyticsOverview } from "./analytics-overview"
import { SubscriptionsList } from "./subscriptions-list"
import { SystemSettings } from "./system-settings"
import { ManageServices } from "./manage-services"

export function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("subscriptions")

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
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
                                <p className="text-muted-foreground">Monitor your SubsCrypt platform performance</p>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">1,234</div>
                                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">987</div>
                                        <p className="text-xs text-muted-foreground">+8% from last month</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">$45,231</div>
                                        <p className="text-xs text-muted-foreground">+15% from last month</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
                                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">23</div>
                                        <p className="text-xs text-muted-foreground">-5% from last month</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <AnalyticsOverview />
                        </div>
                    )}

                    {activeTab === "subscriptions" && <SubscriptionsList />}
                    {activeTab === "analytics" && <AnalyticsOverview />}
                    {activeTab === "settings" && <SystemSettings />}
                    {activeTab === "services" && <ManageServices />}
                </main>
            </div>
        </div>
    )
}
