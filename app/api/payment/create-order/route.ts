import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Initialize Razorpay (lazy initialization to avoid build-time errors)
function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  
  if (!keyId || !keySecret) {
    return null
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

export async function POST(request: NextRequest) {
  try {
    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { amount, currency = 'INR', consultationId, customerName, customerEmail, customerPhone } = body

    // Validate required fields
    if (!amount || !consultationId || !customerEmail) {
      return NextResponse.json(
        { error: 'Amount, consultation ID, and customer email are required' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise (multiply by 100)
      currency: currency,
      receipt: `consultation_${consultationId}_${Date.now()}`,
      notes: {
        consultationId: consultationId,
        customerName: customerName || '',
        customerEmail: customerEmail,
        customerPhone: customerPhone || '',
      },
    }

    const razorpay = getRazorpayInstance()
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      )
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // Send key_id to frontend for Razorpay checkout
    })
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    )
  }
}

