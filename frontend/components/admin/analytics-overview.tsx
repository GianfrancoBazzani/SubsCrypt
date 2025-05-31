"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react"

export function AnalyticsOverview() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold mb-2">Analytics</h2>
                <p className="text-muted-foreground">Detailed insights into platform performance</p>
            </div>

            <Tabs defaultValue="revenue" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$124,563</div>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +12.5% from last month
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$45,231</div>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +8.2% from last month
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Revenue Per User</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$32.45</div>
                                <div className="flex items-center text-xs text-red-600">
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                    -2.1% from last month
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Chart</CardTitle>
                            <CardDescription>Monthly revenue over the past 12 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                                <p className="text-muted-foreground">Revenue chart would be displayed here</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">2,847</div>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +15.3% from last month
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,923</div>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +9.7% from last month
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">New Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">234</div>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    +22.1% from last month
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="subscriptions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription Metrics</CardTitle>
                            <CardDescription>Key subscription performance indicators</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                                <p className="text-muted-foreground">Subscription metrics would be displayed here</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
