# How to Check if Emails are Being Received

## 1. Check Your Terminal/Console Logs

When someone submits the consultation form, you'll see logs in your terminal:

```
📧 Sending notification email to: your-email@example.com
✅ Owner email sent. ID: abc123...
📧 Sending confirmation email to client: client@example.com
✅ Client email sent. ID: xyz789...
```

**If you see these logs**, the emails are being sent successfully.

## 2. Check Resend Dashboard (Best Way)

1. Go to https://resend.com
2. Log in to your account
3. Click on **"Emails"** in the sidebar
4. You'll see:
   - All sent emails
   - Delivery status (Delivered, Bounced, Failed, etc.)
   - When they were sent
   - Recipient email addresses
   - Email IDs for tracking

**Status meanings:**
- ✅ **Delivered**: Email reached the recipient's inbox
- ⚠️ **Pending**: Email is being processed
- ❌ **Bounced**: Email address doesn't exist or is invalid
- ❌ **Failed**: There was an error sending

## 3. Check Your Email Inbox

- Check your inbox (the email you set in `YOUR_EMAIL`)
- Check spam/junk folder (sometimes emails end up there)
- Look for subject: "New Consultation Booking: [Client Name]"

## 4. Check Client's Email

- The client should receive an email with subject: "Your Consultation is Scheduled - AI Agency"
- They should also receive a calendar invite (.ics file) attached

## 5. Common Issues & Solutions

### No emails in Resend dashboard?
- Check that `RESEND_API_KEY` is correct in `.env.local`
- Restart your development server after updating `.env.local`
- Check terminal for error messages

### Emails show as "Failed" in Resend?
- Verify your Resend API key is active
- Check if you've exceeded your free tier limits
- Make sure email addresses are valid

### Emails sent but not received?
- Check spam/junk folders
- Verify email addresses are correct
- Check Resend dashboard for delivery status
- Some email providers may delay delivery

### Testing in Development

To test without submitting the form, you can:

1. **Check the API directly:**
   ```bash
   curl -X POST http://localhost:3000/api/consultation \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "phone": "1234567890",
       "company": "Test Company",
       "message": "Test message"
     }'
   ```

2. **Check terminal logs** for the email sending process

3. **Check Resend dashboard** to see if emails appear

## 6. Enable Email Logging

The API already includes console logging. To see more details:

1. Make sure your terminal is open when running `npm run dev`
2. Watch the terminal when someone submits the form
3. You'll see real-time logs of email sending

## Quick Checklist

- [ ] Resend API key is set in `.env.local`
- [ ] Your email is set in `.env.local`
- [ ] Development server restarted after updating `.env.local`
- [ ] Checked Resend dashboard at https://resend.com/emails
- [ ] Checked your email inbox (and spam folder)
- [ ] Checked terminal logs for any errors

## Need Help?

If emails aren't being sent:
1. Check terminal for error messages
2. Check Resend dashboard for delivery status
3. Verify your API key is correct
4. Make sure you're not on a free tier limit

