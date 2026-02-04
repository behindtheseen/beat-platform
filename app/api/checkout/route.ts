import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { items, paymentMethod } = await request.json()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orderTotal = items.reduce((sum: number, item: any) => sum + item.price, 0)

  if (paymentMethod === "paypal") {
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
    
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "PayPal not configured" },
        { status: 500 }
      )
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")
    
    const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })
    
    const { access_token } = await response.json()

    const orderResponse = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: orderTotal.toFixed(2),
          },
          description: `Beat purchase - ${items.length} item(s)`,
          custom_id: user.id,
        }],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/profile/me?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
        },
      }),
    })

    const orderData = await orderResponse.json()
    
    return NextResponse.json({
      orderId: orderData.id,
      redirectUrl: orderData.links?.find((link: any) => link.rel === "approve")?.href,
    })
  }

  if (paymentMethod === "crypto") {
    const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY
    
    if (!NOWPAYMENTS_API_KEY) {
      return NextResponse.json(
        { error: "Crypto payments not configured" },
        { status: 500 }
      )
    }

    const response = await fetch("https://nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "x-api-key": NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: orderTotal.toFixed(2),
        currency: "USD",
        pay_currency: "BTC,ETH,USDT",
        order_id: `order_${Date.now()}_${user.id}`,
        description: `Beat purchase - ${items.length} item(s)`,
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
      }),
    })

    const paymentData = await response.json()
    
    return NextResponse.json({
      paymentId: paymentData.payment_id,
      redirectUrl: paymentData.payment_url,
    })
  }

  return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
}
