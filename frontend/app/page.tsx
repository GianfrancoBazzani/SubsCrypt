"use client"

import { Shield, Zap, Lock, Globe, Mail, CreditCard, ArrowRight, CheckCircle, Users, Code, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <Link href="/subscriptions">
              <Button>Start Subscription</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="outline" className="mb-4">
            ETH Global Prague 2025 🏆
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Private On-Chain Subscription Payments
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            SubsCrypt leverages EIP-7702 and Vlayer ZK-proofs to create the first truly private, decentralized
            subscription payment system. Pay for services without revealing your identity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/subscriptions">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                Start Subscription <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Revolutionary Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Combining cutting-edge blockchain technology with privacy-first design
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-violet-600" />
                </div>
                <CardTitle>Hidden Email Identity</CardTitle>
                <CardDescription>
                  Authenticate with your email while keeping your identity hidden on-chain using Vlayer Email Proof
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>P2P Privacy Payments</CardTitle>
                <CardDescription>
                  Ephemeral payment EOAs funded through privacy-preserving protocols ensure complete anonymity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Non-Interactive Payments</CardTitle>
                <CardDescription>
                  EIP-7702 enables automatic recurring payments with just one initial signature
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Multi-Chain Support</CardTitle>
                <CardDescription>
                  Seamless cross-chain payments with 1inch Fusion+ integration for optimal liquidity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Liquid Streaming</CardTitle>
                <CardDescription>
                  Service providers can pull accrued payments in real-time based on usage duration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Key className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>No Key Management</CardTitle>
                <CardDescription>
                  Users don&apos;t need to manage private keys - email authentication handles fund recovery
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How SubsCrypt Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple 9-step process that revolutionizes subscription payments
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Payment Initiation",
                  description: "User clicks the payment button to start the subscription process",
                },
                {
                  step: 2,
                  title: "Subscription ID Generation",
                  description: "App backend generates a random seed representing a unique subscription ID",
                },
                {
                  step: 3,
                  title: "EOA Key Generation",
                  description: "User generates a &apos;payment&apos; EOA private key in the frontend",
                },
                {
                  step: 4,
                  title: "Authorization Signing",
                  description: "User signs the authorization tuple that sets up delegation smart contracts",
                },
                {
                  step: 5,
                  title: "Email Transmission",
                  description: "User sends the authorization tuple through email to the service backend",
                },
                {
                  step: 6,
                  title: "On-Chain Delegation",
                  description: "Service backend submits the transaction with delegation and email proof verification",
                },
                {
                  step: 7,
                  title: "Private Funding",
                  description: "Payment EOA is funded using privacy-preserving protocols",
                },
                {
                  step: 8,
                  title: "Automated Payments",
                  description: "Service provider can now pull funds periodically based on service duration",
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  {index < 8 && <div className="w-px h-16 bg-gradient-to-b from-violet-600 to-purple-600 ml-6" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">System Architecture</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive view of SubsCrypt&apos;s innovative architecture
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-violet-600" />
                    User Frontend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Ephemeral EOA generation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Email authentication
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Authorization signing
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2 text-blue-600" />
                    On-Chain Components
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      SubsCrypt delegation contracts
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      1inch Fusion+ integration
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Multi-chain service accounts
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Built With Cutting-Edge Technology</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              "EIP-7702",
              "Vlayer ZK-Proofs",
              "1inch Fusion+",
              "Ethereum",
              "Zero-Knowledge Proofs",
              "Smart Contracts",
            ].map((tech, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Private Subscriptions?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join the future of privacy-preserving payments. Set up your first private subscription in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/subscriptions">
              <Button size="lg" variant="secondary" className="bg-white text-violet-600 hover:bg-gray-100">
                Start Your Subscription
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-violet-600 hover:bg-white hover:text-violet-600"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SubsCrypt</span>
            </div>
            <div className="text-sm text-muted-foreground">© 2025 SubsCrypt. Built for ETH Global Prague 2025.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
