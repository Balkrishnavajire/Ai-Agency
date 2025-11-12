# Razorpay Payment Integration Setup Guide

This guide will help you set up Razorpay payment gateway to receive ₹1000 consultation fees.

## Prerequisites

1. A Razorpay account (free to sign up at https://razorpay.com)
2. Business verification documents (for production use)

## Setup Steps

### 1. Create Razorpay Account

1. Go to https://razorpay.com and sign up for a free account
2. Complete your business profile
3. For testing, you can use test mode without verification

### 2. Get Your API Keys

1. Log in to your Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Key** (for testing) or use **Live Keys** (for production)
4. Copy your **Key ID** and **Key Secret**

**Important:**
- **Test Keys** start with `rzp_test_` (for development/testing)
- **Live Keys** start with `rzp_live_` (for production)
- Never share your Key Secret publicly

### 3. Configure Environment Variables

Add your Razorpay keys to `.env.local`:

```bash
# Razorpay Payment Gateway
# Get your keys from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret_here
```

**For Production:**
- Replace test keys with live keys
- Ensure your business is verified in Razorpay
- Update the keys in your production environment

### 4. Test the Integration

1. Start your development server: `npm run dev`
2. Fill out the consultation form
3. After booking, you'll see the payment section
4. Click "Pay ₹1,000" to test the payment flow
5. Use Razorpay test cards for testing (see below)

### 5. Test Cards (Test Mode Only)

Razorpay provides test cards for testing payments:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

**More test cards:** https://razorpay.com/docs/payments/test-cards/

## How It Works

1. **User Books Consultation**: Fills out the form and submits
2. **Consultation Scheduled**: System finds next available slot and sends emails
3. **Payment Section Appears**: User sees payment button with consultation details
4. **Razorpay Checkout**: User clicks payment button → Razorpay checkout opens
5. **Payment Processing**: User completes payment via Razorpay
6. **Payment Verification**: Backend verifies payment signature
7. **Success**: User receives confirmation, emails are sent

## Payment Flow

```
User → Book Consultation → Payment Button → Razorpay Checkout → Payment Success → Confirmation
```

## Security Features

- ✅ Payment signature verification on backend
- ✅ Secure API keys stored in environment variables
- ✅ Payment verification before confirmation
- ✅ No sensitive data stored in frontend

## Fees

**What's FREE:**
- ✅ Account signup and setup
- ✅ No monthly subscription fees
- ✅ No setup fees
- ✅ No hidden charges

**What's NOT free:**
- ⚠️ **2% transaction fee** per payment (standard rate for payment gateways)

**Example:**
- Customer pays: ₹1,000
- You receive: ₹980 (₹20 goes to Razorpay as transaction fee)

**Note:** This 2% fee is standard across all payment gateways (Stripe, PayPal, etc.). 

**💡 Cheaper Alternative:** You can use **Manual Payment (UPI/Bank Transfer)** which is **100% free** with **0% fees**! See `MANUAL_PAYMENT_SETUP.md` for details. The website now supports both automatic (Razorpay) and manual (UPI) payment options.

## Troubleshooting

### Payment Not Working

1. **Check API Keys**: Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set correctly
2. **Check Console**: Look for errors in browser console and server logs
3. **Test Mode**: Make sure you're using test keys in development
4. **Network Issues**: Check if Razorpay script is loading (check Network tab)

### Payment Verification Failed

- Ensure your Key Secret is correct
- Check server logs for verification errors
- Make sure payment data is being sent correctly

### Common Errors

**"Payment gateway not configured"**
- Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env.local`
- Restart your development server

**"Invalid payment signature"**
- Check if Key Secret matches your Key ID
- Ensure you're using the correct keys (test vs live)

## Production Checklist

Before going live:

- [ ] Switch to Live API Keys
- [ ] Complete business verification in Razorpay
- [ ] Test payment flow thoroughly
- [ ] Set up webhook for payment notifications (optional)
- [ ] Configure email notifications in Razorpay dashboard
- [ ] Test with real payment methods
- [ ] Set up proper error handling and logging

## Support

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/
- Test Cards: https://razorpay.com/docs/payments/test-cards/

## Next Steps

1. Complete Razorpay account setup
2. Add API keys to `.env.local`
3. Test the payment flow
4. Switch to live keys when ready for production

