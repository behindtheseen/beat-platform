"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, ShoppingCart, CreditCard, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
      <div className="container py-20 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Browse our beats and add some to your cart!</p>
        <Link href="/">
          <Button className="mt-6">Browse Beats</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.id}-${item.licenseType}`}>
              <CardContent className="p-4 flex items-center gap-4">
                {item.cover_url ? (
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No cover</span>
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.bpm} BPM • {item.key}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {item.licenseType === "exclusive" ? "Exclusive License" : "Basic License"}
                  </Badge>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    ${item.licenseType === "exclusive" 
                      ? (item.exclusive_price || item.price * 3) 
                      : item.price}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeItem(item.id, item.licenseType)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button variant="outline" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {items.length} item{items.length !== 1 ? "s" : ""} in cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total().toFixed(2)}</span>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Select Payment Method</p>
                
                <Button
                  variant={paymentMethod === "paypal" ? "default" : "outline"}
                  className="w-full justify-start gap-2"
                  onClick={() => setPaymentMethod("paypal")}
                >
                  <CreditCard className="h-4 w-4" />
                  PayPal
                </Button>

                <Button
                  variant={paymentMethod === "crypto" ? "default" : "outline"}
                  className="w-full justify-start gap-2"
                  onClick={() => setPaymentMethod("crypto")}
                >
                  <Wallet className="h-4 w-4" />
                  Cryptocurrency
                </Button>
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={!paymentMethod || isProcessing}
                onClick={handleCheckout}
              >
                {isProcessing ? "Processing..." : "Proceed to Checkout"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By completing this purchase, you agree to our Terms of Service
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
