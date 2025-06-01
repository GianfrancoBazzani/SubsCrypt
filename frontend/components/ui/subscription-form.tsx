"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { walletClient } from '@/lib/client'
import { sepolia } from "viem/chains"
import { encodeAbiParameters, parseAbiParameters } from "viem"
import SendAuthorizationEmailButton from "@/components/ui/send_email"
import { generatePrivateKey } from "viem/accounts"

interface SubscriptionFormProps {
    serviceId: number
    onClose: () => void
}

export function SubscriptionForm({ serviceId, onClose }: SubscriptionFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [authorizationTuple, setAuthorizationTuple] = useState<string>("")
    const [isSubscribed, setIsSubscribed] = useState(false)

    const client = walletClient()
    const authorization = async () => {
        try {
            return await client.signAuthorization({
                account: client.account,
                contractAddress: process.env.NEXT_PUBLIC_DELEGATOR_ADDRESS as `0x${string}` | undefined,
                chainId: sepolia.id,
                nonce: 0,
            })
        } catch (err) {
            console.error('Authorization error:', err)
            throw err
        }
    }

    useEffect(() => {
        const generateAuthorizationTuple = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const auth = await authorization()
                const encodedAuthorizationTuple = encodeAbiParameters(
                    parseAbiParameters(
                        'uint256 chainId, address contractAddress, uint256 nonce, bytes32 r, bytes32 s, uint8 yParity'
                    ),
                    [BigInt(auth.chainId), auth.address, BigInt(auth.nonce), auth.r, auth.s, auth.yParity ?? 0]
                )

                setAuthorizationTuple(encodedAuthorizationTuple)
            } catch (err) {
                setError('Failed to generate authorization. Please try again.')
                console.error('Authorization generation error:', err)
            } finally {
                setIsLoading(false)
            }
        }

        generateAuthorizationTuple()
    }, [])

    const handleEmailSent = () => {
        localStorage.setItem('subscribed', 'true')
        setIsSubscribed(true)
        onClose()
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Complete Your Subscription</CardTitle>
                <CardDescription>Review and confirm your subscription details</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}
                    {authorizationTuple && !isSubscribed ? (
                        <div onClick={handleEmailSent}>
                            <SendAuthorizationEmailButton
                                authorizationTuple={authorizationTuple}
                                serviceID={serviceId.toString()}
                                salt={generatePrivateKey()}
                            />
                        </div>
                    ) : (
                        <Button
                            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                            disabled={isLoading || isSubscribed}
                        >
                            {isLoading ? "Generating Authorization..." : isSubscribed ? "Already Subscribed" : "Preparing Subscription..."}
                        </Button>
                    )}
                    <p className="text-xs text-muted-foreground text-center">
                        By creating a subscription, you agree to the Terms of Service and Privacy Policy
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
