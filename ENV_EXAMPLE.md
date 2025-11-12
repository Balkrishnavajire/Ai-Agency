# Environment Variables Example

Add these to your `.env.local` file:

```bash
# Resend API Key for sending emails
# Get your API key from https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here

# Your email address where you want to receive consultation notifications
YOUR_EMAIL=your-email@example.com

# Razorpay Payment Gateway
# Get your keys from https://dashboard.razorpay.com/app/keys
# For testing, use test keys (start with rzp_test_)
# For production, use live keys (start with rzp_live_)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret_here

# Google Calendar Integration (Optional)
# Follow instructions in GOOGLE_CALENDAR_SETUP.md to set these up
# GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
# GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
# GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
```

## Quick Setup

1. Copy the above content
2. Create or edit `.env.local` in the root directory
3. Replace placeholder values with your actual keys
4. Restart your development server: `npm run dev`

## Important Notes

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Use test keys for development
- Switch to live keys only for production
- Keep your keys secure and never share them publicly

