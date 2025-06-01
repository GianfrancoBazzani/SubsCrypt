"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, Package } from "lucide-react"

interface AdminSidebarProps {
    activeTab: string
    setActiveTab: (tab: string) => void
}

const sidebarItems = [
    {
        id: "services",
        label: "Manage Services",
        icon: Package,
    },
    {
        id: "subscriptions",
        label: "Subscriptions",
        icon: Users,
    }
]

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
    return (
        <aside className="w-64 border-r bg-muted/50 p-6">
            <nav className="space-y-2">
                {sidebarItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Button
                            key={item.id}
                            variant={activeTab === item.id ? "default" : "ghost"}
                            className={cn(
                                "w-full justify-start",
                                activeTab === item.id && "bg-gradient-to-r from-violet-600 to-purple-600 text-white",
                            )}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Button>
                    )
                })}
            </nav>
        </aside>
    )
}
