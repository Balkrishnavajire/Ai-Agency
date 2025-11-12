# Client Email Not Received - Troubleshooting Guide

## Quick Checks

### 1. Check Terminal Logs
When the form is submitted, look for these logs in your terminal:

```
📧 Sending confirmation email to client: client@example.com
✅ Client email sent successfully!
📧 Email ID: abc123...
📧 Recipient: client@example.com
```

**If you see errors**, note the error message.

### 2. Check Resend Dashboard
1. Go to https://resend.com/emails
2. Look for the email sent to the client
3. Check the **Status**:
   - ✅ **Delivered** = Email reached the inbox (check spam folder)
   - ⚠️ **Pending** = Still being processed
   - ❌ **Bounced** = Email address invalid or blocked
   - ❌ **Failed** = There was an error

### 3. Common Issues

#### Issue: Email shows as "Delivered" but client didn't receive it
**Solutions:**
- Check client's **spam/junk folder**
- Ask client to check **promotions tab** (Gmail)
- Email might be delayed (can take a few minutes)
- Some email providers filter emails from `onboarding@resend.dev`

#### Issue: Email shows as "Bounced"
**Solutions:**
- Email address might be invalid
- Email domain might be blocking Resend
- Try a different email address

#### Issue: Email shows as "Failed"
**Solutions:**
- Check terminal for error message
- Verify Resend API key is correct
- Check if you've exceeded free tier limits (100 emails/day)

### 4. Resend Free Tier Limitations

With Resend's free tier using `onboarding@resend.dev`:
- ✅ You can send to any email address
- ⚠️ Some email providers may mark it as spam
- ⚠️ Some corporate emails may block it
- ✅ Best for testing and development

### 5. Improve Email Deliverability

To improve deliverability (recommended for production):

1. **Verify your domain in Resend:**
   - Go to Resend Dashboard → Domains
   - Add your domain
   - Add DNS records
   - Update the `from` field in `app/api/consultation/route.ts`:
     ```typescript
     from: 'AI Agency <noreply@yourdomain.com>',
     ```

2. **Use a professional email address:**
   - Instead of `onboarding@resend.dev`
   - Use your verified domain email

## Testing Steps

1. **Submit a test consultation:**
   - Use your own email as the client email
   - Check if you receive it

2. **Check terminal logs:**
   - Look for any error messages
   - Note the email ID

3. **Check Resend dashboard:**
   - Find the email by ID or recipient
   - Check the status

4. **Check your inbox:**
   - Check spam folder
   - Check promotions tab (Gmail)
   - Wait a few minutes (delivery can be delayed)

## Debug Information

When you submit the form, the terminal will show:
- Email ID (use this to track in Resend dashboard)
- Recipient email
- Direct link to check in Resend dashboard
- Full error details if something fails

## Next Steps

1. **Check terminal logs** - What error do you see?
2. **Check Resend dashboard** - What's the email status?
3. **Try with your own email** - Do you receive it?
4. **Check spam folder** - Is it there?

If emails are being sent but not received:
- Most likely in spam folder
- Or email provider is blocking `onboarding@resend.dev`
- Solution: Verify your domain in Resend

