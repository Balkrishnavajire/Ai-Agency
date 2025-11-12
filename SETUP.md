# Consultation Booking Setup Guide

This guide will help you set up email notifications and calendar integration for consultation bookings.

## Prerequisites

1. A Resend account (free tier available at https://resend.com)
2. Your email address

## Setup Steps

### 1. Get Resend API Key

1. Go to https://resend.com and sign up for a free account
2. Navigate to API Keys section
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project:

```bash
# Resend API Key
RESEND_API_KEY=re_your_actual_api_key_here

# Your email address where you want to receive consultation notifications
YOUR_EMAIL=your-email@example.com
```

**Important:** Never commit `.env.local` to git. It's already in `.gitignore`.

### 3. Verify Your Email Domain (Optional but Recommended)

For production use, you should verify your domain in Resend:
1. Go to Resend Dashboard → Domains
2. Add your domain
3. Add the DNS records provided
4. Update the `from` email in `app/api/consultation/route.ts` to use your verified domain

For testing, you can use `onboarding@resend.dev` (already configured).

### 4. Update Email From Address (Optional)

If you've verified your domain, update the `from` field in `app/api/consultation/route.ts`:

```typescript
from: 'AI Agency <noreply@yourdomain.com>',
```

### 5. Test the Integration

1. Start your development server: `npm run dev`
2. Fill out the consultation form on your website
3. Check your email for the notification
4. Check the client's email for their confirmation

## How It Works

1. **Time Slot Selection**: The system automatically finds the next available slot between 9 AM - 8 PM (Monday-Friday)
2. **Meeting Duration**: 30 minutes
3. **Emails Sent**:
   - **To You**: Notification with client details and meeting time
   - **To Client**: Confirmation email with meeting details and calendar invite (.ics file)
4. **Calendar Invite**: The client receives a `.ics` file they can add to their calendar

## Business Hours

- **Start**: 9:00 AM
- **End**: 8:00 PM
- **Days**: Monday - Friday (weekends are skipped)
- **Duration**: 30 minutes per meeting

## Customization

You can customize the business hours in `app/api/consultation/route.ts`:

```typescript
const BUSINESS_START_HOUR = 9  // Change to your preferred start time
const BUSINESS_END_HOUR = 20   // Change to your preferred end time
const MEETING_DURATION_MINUTES = 30  // Change meeting duration
```

## Troubleshooting

### Emails not sending?
- Check that `RESEND_API_KEY` is set correctly in `.env.local`
- Verify your Resend account is active
- Check Resend dashboard for any errors

### Calendar invite not working?
- The `.ics` file is attached to the email
- Most email clients (Gmail, Outlook, Apple Mail) will recognize it automatically
- Client can click to add to their calendar

### Need to check your actual calendar?
Currently, the system finds the next available slot without checking your actual calendar. To integrate with Google Calendar:

1. Set up Google Calendar API
2. Add calendar checking logic to find truly available slots
3. Create events directly in your calendar

Would you like me to add Google Calendar integration? Let me know!

