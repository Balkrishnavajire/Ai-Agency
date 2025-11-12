# Troubleshooting: Emails Not Sending

## Quick Fix Checklist

### 1. ✅ Check Your .env.local File

Open `.env.local` and make sure you've replaced the placeholder values:

```bash
# ❌ WRONG - These are placeholders
RESEND_API_KEY=re_your_api_key_here
YOUR_EMAIL=your-email@example.com

# ✅ CORRECT - Your actual values
RESEND_API_KEY=re_abc123xyz789...
YOUR_EMAIL=krishna@yourdomain.com
```

### 2. ✅ Get Your Resend API Key

1. Go to https://resend.com
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy the key (starts with `re_`)
6. Paste it in `.env.local`

### 3. ✅ Restart Your Server

**IMPORTANT:** After updating `.env.local`, you MUST restart your server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

Environment variables are only loaded when the server starts!

### 4. ✅ Check Terminal Logs

When someone submits the form, watch your terminal. You should see:

```
✅ Environment variables check passed
📧 Your email: your-email@example.com
🔑 API Key present: Yes
📝 Form data received: { name: '...', email: '...' }
📧 Sending notification email to: ...
✅ Owner email sent successfully. ID: ...
```

**If you see errors like:**
- `❌ RESEND_API_KEY is missing` → Your API key isn't set
- `❌ YOUR_EMAIL is not configured` → Your email isn't set
- `Failed to send email` → Check the error message

### 5. ✅ Test the API Directly

Test if the API is working:

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

Check the terminal output for any errors.

### 6. ✅ Verify Resend Account

- Make sure your Resend account is active
- Check if you've exceeded free tier limits (100 emails/day on free tier)
- Verify your API key is not expired

### 7. ✅ Check Browser Console

Open browser DevTools (F12) → Console tab
Submit the form and check for any errors

## Common Errors & Solutions

### Error: "Email service not configured"
**Solution:** 
- Check `.env.local` has actual values (not placeholders)
- Restart your server

### Error: "Failed to send email"
**Solution:**
- Check Resend dashboard for error details
- Verify API key is correct
- Check if email addresses are valid

### No errors but no emails?
**Solution:**
- Check spam/junk folders
- Check Resend dashboard at https://resend.com/emails
- Verify email addresses are correct

### Server not reading .env.local?
**Solution:**
- Make sure file is named exactly `.env.local` (not `.env` or `.env.local.txt`)
- File should be in the root directory (same level as `package.json`)
- Restart the server after creating/updating the file

## Step-by-Step Setup

1. **Create Resend account:**
   ```
   Go to: https://resend.com
   Sign up → Get API key
   ```

2. **Update .env.local:**
   ```bash
   RESEND_API_KEY=re_your_actual_key_here
   YOUR_EMAIL=your-actual-email@example.com
   ```

3. **Restart server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

4. **Test:**
   - Submit a test consultation
   - Check terminal logs
   - Check Resend dashboard
   - Check your email

## Still Not Working?

1. Check terminal for specific error messages
2. Check Resend dashboard for delivery status
3. Verify your API key at https://resend.com/api-keys
4. Make sure you're using the correct email format

