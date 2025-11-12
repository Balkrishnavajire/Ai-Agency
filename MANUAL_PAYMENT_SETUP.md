# Manual Payment Setup (100% Free - 0% Fees)

This guide will help you set up the **completely free** manual payment option using UPI or Bank Transfer.

## Why Manual Payment?

- ✅ **0% transaction fees** - You receive the full ₹1,000
- ✅ **No payment gateway setup required**
- ✅ **No API keys needed**
- ✅ **Works immediately**

## Setup Steps

### 1. Update Your Payment Details

Open `app/page.tsx` and find the `paymentDetails` object (around line 50-58):

```typescript
const paymentDetails = {
  upiId: 'your-upi-id@paytm', // UPDATE THIS
  bankName: 'Your Bank Name', // UPDATE THIS
  accountNumber: '1234567890', // UPDATE THIS
  ifscCode: 'BANK0001234', // UPDATE THIS
  accountHolderName: 'AI Agency', // UPDATE THIS
  phoneNumber: '+91 1234567890', // UPDATE THIS (optional)
}
```

### 2. Replace with Your Actual Details

**For UPI ID:**
- Format: `yourname@paytm`, `yourname@ybl`, `yourname@upi`, etc.
- Examples: `aiagency@paytm`, `yourname@ybl`, `business@upi`
- You can get this from your UPI app (PhonePe, GPay, Paytm, etc.)

**For Bank Details:**
- Bank Name: Your bank's full name (e.g., "State Bank of India")
- Account Number: Your bank account number
- IFSC Code: Your bank's IFSC code (e.g., "SBIN0001234")
- Account Holder Name: Name as it appears on your bank account

### 3. Example Configuration

```typescript
const paymentDetails = {
  upiId: 'aiagency@paytm',
  bankName: 'State Bank of India',
  accountNumber: '123456789012',
  ifscCode: 'SBIN0001234',
  accountHolderName: 'AI Agency Private Limited',
  phoneNumber: '+91 9876543210',
}
```

### 4. How It Works

1. Customer books consultation
2. Customer sees payment options:
   - **Automatic** (Razorpay) - 2% fee, you receive ₹980
   - **Manual (UPI)** - 0% fee, you receive ₹1,000 ✅
3. If customer chooses manual:
   - They see your UPI ID and bank details
   - They can copy UPI ID with one click
   - They make payment via their UPI app
   - They reply to confirmation email with payment proof
4. You manually verify payment and confirm consultation

## Payment Verification

When a customer chooses manual payment:
1. They receive confirmation email with consultation details
2. They make payment via UPI/Bank Transfer
3. They reply to the email with:
   - Payment screenshot
   - Transaction ID
   - Payment reference
4. You verify payment in your bank/UPI app
5. You confirm the consultation

## Tips

- **UPI ID**: Make it easy to remember (e.g., `aiagency@paytm`)
- **Payment Reference**: Ask customers to include their name in payment notes
- **Verification**: Check payments daily and confirm consultations promptly
- **Communication**: Reply to customer emails quickly after payment verification

## Advantages

✅ **100% Free** - No transaction fees  
✅ **Full Amount** - Receive ₹1,000 instead of ₹980  
✅ **No Setup** - Works immediately  
✅ **Simple** - No API keys or gateway configuration  
✅ **Trusted** - Customers are familiar with UPI payments  

## Disadvantages

⚠️ **Manual Verification** - You need to check payments manually  
⚠️ **Time Required** - Takes a few minutes per payment to verify  
⚠️ **No Auto-Confirmation** - Can't automatically confirm consultations  

## Recommendation

For **small volume** (1-10 consultations/month): Use **Manual Payment** (0% fees)  
For **high volume** (10+ consultations/month): Use **Automatic Payment** (2% fees, saves time)

You can offer both options and let customers choose!

