"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { walletClient } from '@/lib/client'
import { sepolia } from "viem/chains"
import { encodeAbiParameters, parseAbiParameters, formatEther } from "viem"
import { PAYMENT_INTERVAL_LABELS } from "@/lib/contract"
import SendAuthorizationEmailButton from "@/components/ui/send_email"
import { generatePrivateKey } from "viem/accounts"
import { useServiceData } from "@/hooks/use-service-data"
import { ETHER_ADDRESS } from "@/lib/constants"

interface ServiceOffer {
    id: number
    serviceProvider: string
    paymentRecipient: string
    paymentAsset: string
    assetChainId: bigint
    servicePrice: bigint
    paymentInterval: bigint
}

interface SubscriptionModalProps {
    isOpen: boolean
    onClose: () => void
    service: ServiceOffer
}

export function SubscriptionModal({ isOpen, onClose, service }: SubscriptionModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(() => {
        // @todo Check localStorage when component mounts
        /* if (typeof window !== 'undefined') {
            return localStorage.getItem('subscribed') === 'true';
        } */
        return false;
    });

    const [authorizationTuple, setAuthorizationTuple] = useState<string>("");
    const { services, isLoading: isLoadingServiceData, serviceCount, refresh } = useServiceData();

    const client = walletClient();
    const authorization = async () => {
        try {
            return await client.signAuthorization({
                account: client.account,
                contractAddress: process.env.NEXT_PUBLIC_DELEGATOR_ADDRESS as `0x${string}` | undefined, // mock address
                chainId: sepolia.id, // testnet
                nonce: 0, // EOA is always fresh generated
            });
        } catch (err) {
            console.error('Authorization error:', err);
            throw err;
        }
    }

    useEffect(() => {
        const generateAuthorizationTuple = async () => {
            if (!isOpen) return;

            setIsLoading(true);
            setError(null);
            try {
                const auth = await authorization();
                let encodedAuthorizationTuple = encodeAbiParameters(
                    parseAbiParameters(
                        'uint256 chainId, address contractAddress, uint256 nonce, bytes32 r, bytes32 s, uint8 yParity'
                    ),
                    [BigInt(auth.chainId), auth.address, BigInt(auth.nonce), auth.r, auth.s, auth.yParity ?? 0]
                );

                setAuthorizationTuple(encodedAuthorizationTuple);
            } catch (err) {
                setError('Failed to generate authorization. Please try again.');
                console.error('Authorization generation error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        generateAuthorizationTuple();
    }, [isOpen]);

    const handleEmailSent = () => {
        localStorage.setItem('subscribed', 'true');
        setIsSubscribed(true);
        onClose();
    };

    // Handle click on the backdrop (outside the modal)
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <Card className="w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>
                <CardHeader>
                    <CardTitle className="text-2xl">Start Your Subscription</CardTitle>
                    <CardDescription>Review and confirm your subscription details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="service">Service Provider</Label>
                                <Input disabled id="service" value={service.serviceProvider} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="paymentRecipient">Payment Recipient</Label>
                                <Input disabled id="paymentRecipient" value={service.paymentRecipient} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Payment Amount ({PAYMENT_INTERVAL_LABELS[Number(service.paymentInterval) as keyof typeof PAYMENT_INTERVAL_LABELS]})</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Ξ</span>
                                    <Input disabled id="amount" type="text" className="pl-7" value={formatEther(service.servicePrice)} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="chain">Network</Label>
                                <Input disabled id="chain" value="Sepolia Testnet" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}
                    {authorizationTuple && !isSubscribed ? (
                        <div onClick={handleEmailSent}>
                            <SendAuthorizationEmailButton
                                authorizationTuple={authorizationTuple}
                                serviceID={service.id.toString()}
                                salt={generatePrivateKey()} // random 32 bytes
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
                </CardFooter>
            </Card>
        </div>
    )
}
