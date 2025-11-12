# Google Calendar Integration Setup

This guide will help you set up Google Calendar integration so that consultation bookings are automatically added to your calendar.

## Benefits

- ✅ Events automatically added to your Google Calendar
- ✅ Both you and the client receive calendar invites
- ✅ Automatic Google Meet link generation
- ✅ Reminders set (1 day before and 30 minutes before)
- ✅ Client details included in calendar event

## Setup Steps

### 1. Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Name it "AI Agency Calendar" or similar

### 2. Enable Google Calendar API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click **Enable**

### 3. Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in:
   - **Service account name**: `ai-agency-calendar`
   - **Service account ID**: (auto-generated)
   - Click **Create and Continue**
4. Skip role assignment (click **Continue**)
5. Click **Done**

### 4. Create Service Account Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON** format
5. Click **Create** (JSON file will download)

### 5. Share Calendar with Service Account

1. Open the JSON file you downloaded
2. Copy the `client_email` value (looks like: `ai-agency-calendar@project-id.iam.gserviceaccount.com`)
3. Open Google Calendar (https://calendar.google.com)
4. Find your calendar in the left sidebar
5. Click the three dots next to your calendar → **Settings and sharing**
6. Under **Share with specific people**, click **Add people**
7. Paste the `client_email` from step 2
8. Set permission to **Make changes to events**
9. Click **Send**

### 6. Get Your Calendar ID

1. In Google Calendar settings, scroll down to **Integrate calendar**
2. Find **Calendar ID** (looks like: `your-email@gmail.com` or a long string)
3. Copy this ID

### 7. Update .env.local

Add these variables to your `.env.local` file:

```bash
# Google Calendar Integration
GOOGLE_CLIENT_EMAIL=ai-agency-calendar@your-project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
```

**Important Notes:**
- `GOOGLE_CLIENT_EMAIL`: Copy from the JSON file (the `client_email` field)
- `GOOGLE_PRIVATE_KEY`: Copy from the JSON file (the `private_key` field)
  - Keep the quotes and include the `\n` characters
  - The entire key should be on one line with `\n` for line breaks
- `GOOGLE_CALENDAR_ID`: Your calendar ID from step 6

### 8. Example .env.local

```bash
RESEND_API_KEY=re_your_api_key_here
YOUR_EMAIL=your-email@example.com

# Google Calendar Integration
GOOGLE_CLIENT_EMAIL=ai-agency-calendar@project-123456.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your-email@gmail.com
```

### 9. Restart Server

After updating `.env.local`, restart your development server:

```bash
npm run dev
```

## How It Works

When someone books a consultation:

1. **Google Calendar Event Created** (if configured):
   - Event added to your calendar automatically
   - Google Meet link generated
   - Reminders set (1 day + 30 min before)
   - Client added as attendee

2. **Email to You**:
   - Notification email with client details
   - Calendar invite (.ics file) attached
   - Can be added to any calendar app

3. **Email to Client**:
   - Confirmation email
   - Calendar invite (.ics file) attached
   - Can be added to their calendar

## Troubleshooting

### Event not created in Google Calendar?

1. **Check terminal logs:**
   - Look for `📅 Creating event in Google Calendar...`
   - Check for any error messages

2. **Verify service account has access:**
   - Make sure you shared the calendar with the service account email
   - Permission should be "Make changes to events"

3. **Check environment variables:**
   - Verify all three variables are set correctly
   - Make sure `GOOGLE_PRIVATE_KEY` includes the `\n` characters

4. **Check calendar ID:**
   - Make sure it's the correct calendar ID
   - For primary calendar, it's usually your email address

### Private Key Format Issues?

The private key in the JSON file looks like:
```json
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
```

In `.env.local`, it should be:
```bash
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
```

Keep the quotes and `\n` characters!

## Testing

1. Submit a test consultation form
2. Check terminal for:
   - `📅 Creating event in Google Calendar...`
   - `✅ Event created in Google Calendar. ID: ...`
3. Check your Google Calendar - the event should appear
4. Check your email - you should receive the calendar invite
5. Check client's email - they should receive the calendar invite

## Optional: Without Google Calendar

If you don't want to set up Google Calendar integration:
- The system will still work
- Both you and client will receive calendar invites (.ics files) via email
- You can manually add them to your calendar
- Just don't set the Google Calendar environment variables

