"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, ShoppingCart, CreditCard, Wallet, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart"

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, clearCart, total } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "crypto" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (!paymentMethod) return
    setIsProcessing(true)
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            title: item.title,
            price: item.licenseType === 'exclusive' 
              ? (item.exclusive_price || item.price * 3) 
              : item.price,
            licenseType: item.licenseType,
          })),
          paymentMethod,
        }),
      })

      const data = await response.json()
      
      if (paymentMethod === "paypal" && data.orderId) {
        window.location.href = data.redirectUrl
      } else if (paymentMethod === "crypto" && data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        router.push("/profile/me?success=true")
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-zinc-900 mb-6">
            <ShoppingCart className="h-12 w-12 text-zinc-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
          <p className="text-zinc-400 mb-6">Browse our beats and add some to your cart!</p>
          <Link href="/">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Browse Beats
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="container max-w-6xl">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.id}-${item.licenseType}`} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 flex items-center gap-4">
                  {item.cover_url ? (
                    <img
                      src={item.cover_url}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-zinc-800 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-zinc-500">No cover</span>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.title}</h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      {item.bpm} BPM • {item.key}
                    </p>
                    <Badge variant="outline" className="mt-2 border-zinc-700 text-zinc-300">
                      {item.licenseType === "exclusive" ? "Exclusive License" : "Basic License"}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-white text-lg">
                      ${item.licenseType === "exclusive" 
                        ? (item.exclusive_price || item.price * 3) 
                        : item.price}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-2"
                      onClick={() => removeItem(item.id, item.licenseType)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={clearCart} className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800">
                Clear Cart
              </Button>
              <Link href="/">
                <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <Card className="bg-zinc-900 border-zinc-800 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-zinc-400">
                  <span>Items</span>
                  <span>{items.length}</span>
                </div>

                <Separator className="bg-zinc-800" />

                <div className="flex justify-between font-bold text-xl text-white">
                  <span>Total</span>
                  <span>${total().toFixed(2)}</span>
                </div>

                <Separator className="bg-zinc-800" />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-zinc-300">Select Payment Method</p>
                  
                  <Button
                    variant={paymentMethod === "paypal" ? "default" : "outline"}
                    className={`w-full justify-start gap-3 ${
                      paymentMethod === "paypal" 
                        ? "bg-purple-600 hover:bg-purple-700" 
                        : "border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <CreditCard className="h-5 w-5" />
                    PayPal
                  </Button>

                  <Button
                    variant={paymentMethod === "crypto" ? "default" : "outline"}
                    className={`w-full justify-start gap-3 ${
                      paymentMethod === "crypto" 
                        ? "bg-purple-600 hover:bg-purple-700" 
                        : "border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                    onClick={() => setPaymentMethod("crypto")}
                  >
                    <Wallet className="h-5 w-5" />
                    Cryptocurrency
                  </Button>
                </div>

                <Button
                  className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                  disabled={!paymentMethod || isProcessing}
                  onClick={handleCheckout}
                >
                  {isProcessing ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-zinc-500 text-center">
                  Secure payment powered by PayPal & Crypto
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
