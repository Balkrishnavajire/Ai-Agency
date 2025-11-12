# AI Agency Website

A futuristic, dynamic website for an AI consultant business that provides AI agent services for small businesses.

## Features

- 🚀 **Modern Tech Stack**: Built with Next.js 14, React, TypeScript, and Tailwind CSS
- ✨ **Futuristic Design**: Neon effects, glass morphism, and smooth animations
- 🎨 **Dynamic Animations**: Powered by Framer Motion for engaging user experience
- 📱 **Fully Responsive**: Works beautifully on all devices
- ⚡ **Performance Optimized**: Fast loading and smooth interactions
- 📧 **Consultation Booking**: Automated email notifications and calendar invites
- 💳 **Payment Integration**: Razorpay (automatic) + UPI/Bank Transfer (manual, 100% free) for ₹1000 consultation fee
- 🤖 **AI-Themed**: Neural networks, circuit patterns, and data streams

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Resend API key and email (see `SETUP.md` for details)
   - Add your Razorpay API keys (see `RAZORPAY_SETUP.md` for details)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

### Consultation Booking Setup

To enable email notifications and calendar invites for consultation bookings, see [SETUP.md](./SETUP.md) for detailed instructions.

### Payment Integration Setup

**Option 1: Manual Payment (100% Free - 0% Fees)**
- See [MANUAL_PAYMENT_SETUP.md](./MANUAL_PAYMENT_SETUP.md) for UPI/Bank Transfer setup
- No API keys needed, works immediately
- You receive full ₹1,000 (no transaction fees)

**Option 2: Automatic Payment (2% Fees)**
- See [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md) for Razorpay setup
- Requires API keys
- You receive ₹980 (₹20 transaction fee)

**Option 3: Cheaper Gateways**
- See [PAYMENT_OPTIONS.md](./PAYMENT_OPTIONS.md) for comparison of payment gateways
- PayU (1.5%), PayKun (1.75%), Cashfree (1.75%) available

The website supports both options - customers can choose!

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Lucide React**: Beautiful icon library
- **Resend**: Email delivery service
- **ical-generator**: Calendar invite generation
- **Razorpay**: Payment gateway for Indian Rupees

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main landing page
│   └── globals.css    # Global styles
├── package.json        # Dependencies
├── tailwind.config.js  # Tailwind configuration
└── tsconfig.json      # TypeScript configuration
```

## Customization

- Update colors in `tailwind.config.js` to match your brand
- Modify content in `app/page.tsx` to reflect your services
- Adjust animations and effects as needed

## License

This project is private and proprietary.

