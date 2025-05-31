"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export function SystemSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold mb-2">System Settings</h2>
                <p className="text-muted-foreground">Configure platform settings and preferences</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Platform Configuration</CardTitle>
                        <CardDescription>General platform settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="platform-name">Platform Name</Label>
                            <Input id="platform-name" defaultValue="SubsCrypt" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="support-email">Support Email</Label>
                            <Input id="support-email" type="email" defaultValue="support@subscrypt.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="max-subscriptions">Max Subscriptions Per User</Label>
                            <Input id="max-subscriptions" type="number" defaultValue="10" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Settings</CardTitle>
                        <CardDescription>Configure payment processing options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Enable Automatic Payments</Label>
                                <p className="text-sm text-muted-foreground">Allow automatic recurring payments</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Multi-chain Support</Label>
                                <p className="text-sm text-muted-foreground">Enable payments across multiple blockchains</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="grid gap-2">
                            <Label htmlFor="gas-limit">Default Gas Limit</Label>
                            <Input id="gas-limit" defaultValue="21000" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>Configure security and privacy options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Require Email Verification</Label>
                                <p className="text-sm text-muted-foreground">Require users to verify their email addresses</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Enable ZK Proofs</Label>
                                <p className="text-sm text-muted-foreground">Use zero-knowledge proofs for privacy</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="grid gap-2">
                            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                            <Input id="session-timeout" type="number" defaultValue="30" />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end space-x-4">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    )
}
