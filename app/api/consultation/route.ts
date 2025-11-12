import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import icalGenerator from 'ical-generator'
import { google } from 'googleapis'

// Check if API key is set
if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is not set in environment variables')
}

if (!process.env.YOUR_EMAIL) {
  console.error('❌ YOUR_EMAIL is not set in environment variables')
}

const resend = new Resend(process.env.RESEND_API_KEY)

// Your email address
const YOUR_EMAIL = process.env.YOUR_EMAIL || 'your-email@example.com'

// Google Calendar setup
function getGoogleCalendarClient() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CALENDAR_ID) {
    return null
  }

  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })

    return google.calendar({ version: 'v3', auth })
  } catch (error) {
    console.error('Error setting up Google Calendar:', error)
    return null
  }
}

// Business hours: 9 AM to 8 PM
const BUSINESS_START_HOUR = 9
const BUSINESS_END_HOUR = 20
const MEETING_DURATION_MINUTES = 30

// Find next available time slot
function findNextAvailableSlot(): { start: Date; end: Date } {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(BUSINESS_START_HOUR, 0, 0, 0)

  // Check if tomorrow is a weekday (Monday-Friday)
  const dayOfWeek = tomorrow.getDay()
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // If it's weekend, move to next Monday
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 2
    tomorrow.setDate(tomorrow.getDate() + daysUntilMonday)
  }

  // Round up to nearest 30-minute slot
  const minutes = tomorrow.getMinutes()
  if (minutes > 0) {
    tomorrow.setMinutes(30)
  }

  const endTime = new Date(tomorrow)
  endTime.setMinutes(endTime.getMinutes() + MEETING_DURATION_MINUTES)

  return {
    start: tomorrow,
    end: endTime,
  }
}

// Format time for display
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Format date for display
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Generate calendar invite
function generateCalendarInvite(
  name: string,
  email: string,
  startTime: Date,
  endTime: Date
): string {
  const calendar = icalGenerator({ name: 'AI Agency Consultation' })

  calendar.createEvent({
    start: startTime,
    end: endTime,
    summary: 'AI Agency - Consultation (₹1000)',
    description: `Consultation with ${name} from AI Agency.\n\nConsultation Fee: ₹1000\n\nWe'll discuss how AI agents can transform your business.`,
    location: 'Online Meeting (Link will be sent separately)',
    organizer: {
      name: 'AI Agency',
      email: YOUR_EMAIL,
    },
    attendees: [
      {
        name: name,
        email: email,
        rsvp: true,
      },
    ],
    url: 'https://ai-agency.com',
  })

  return calendar.toString()
}

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is missing')
      return NextResponse.json(
        { error: 'Email service not configured. Please set RESEND_API_KEY in .env.local' },
        { status: 500 }
      )
    }

    if (!process.env.YOUR_EMAIL || process.env.YOUR_EMAIL === 'your-email@example.com') {
      console.error('❌ YOUR_EMAIL is not configured')
      return NextResponse.json(
        { error: 'Email service not configured. Please set YOUR_EMAIL in .env.local' },
        { status: 500 }
      )
    }

    console.log('✅ Environment variables check passed')
    console.log(`📧 Your email: ${YOUR_EMAIL}`)
    console.log(`🔑 API Key present: ${process.env.RESEND_API_KEY ? 'Yes' : 'No'}`)

    const body = await request.json()
    const { name, email, phone, company, message } = body

    console.log('📝 Form data received:', { name, email, phone, company })

    // Validate required fields
    if (!name || !email || !phone) {
      console.error('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      )
    }

    // Find next available slot
    const { start, end } = findNextAvailableSlot()
    const meetingDate = formatDate(start)
    const meetingTime = formatTime(start)
    const meetingTimeFormatted = `${meetingTime} - ${formatTime(end)}`

    // Generate calendar invite for client
    const calendarInvite = generateCalendarInvite(name, email, start, end)

    // Create event in your Google Calendar (if configured)
    let calendarEventId = null
    const calendar = getGoogleCalendarClient()
    if (calendar) {
      try {
        console.log('📅 Creating event in Google Calendar...')
        const event = {
          summary: `Consultation: ${name}${company ? ` (${company})` : ''}`,
          description: `Consultation with ${name}.\n\nConsultation Fee: ₹1000\n\nContact Info:\nEmail: ${email}\nPhone: ${phone}${company ? `\nCompany: ${company}` : ''}${message ? `\n\nMessage:\n${message}` : ''}`,
          start: {
            dateTime: start.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
          },
          end: {
            dateTime: end.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
          },
          attendees: [
            { email: YOUR_EMAIL, organizer: true },
            { email: email },
          ],
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 }, // 1 day before
              { method: 'popup', minutes: 30 }, // 30 minutes before
            ],
          },
          conferenceData: {
            createRequest: {
              requestId: `consultation-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
        }

        const response = await calendar.events.insert({
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          requestBody: event,
          conferenceDataVersion: 1,
        })

        calendarEventId = response.data.id
        console.log(`✅ Event created in Google Calendar. ID: ${calendarEventId}`)
        console.log(`📅 Meeting link: ${response.data.hangoutLink || 'N/A'}`)
      } catch (calendarError: any) {
        console.error('❌ Error creating Google Calendar event:', calendarError.message)
        // Don't fail the whole request if calendar creation fails
        console.log('⚠️ Continuing without calendar event...')
      }
    } else {
      console.log('⚠️ Google Calendar not configured. Skipping calendar event creation.')
      console.log('💡 To enable: Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_CALENDAR_ID in .env.local')
    }

    // Email to you (the business owner)
    const ownerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">New Consultation Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        <p><strong>Message:</strong> ${message || 'No message provided'}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <h3 style="color: #3b82f6;">Scheduled Meeting</h3>
        <p><strong>Date:</strong> ${meetingDate}</p>
        <p><strong>Time:</strong> ${meetingTimeFormatted}</p>
        <p><strong>Duration:</strong> 30 minutes</p>
        <p><strong>Consultation Fee:</strong> ₹1000</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          Please add this meeting to your calendar and prepare for the consultation. Payment details will be sent to the client.
        </p>
      </div>
    `

    // Email to the client
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Consultation Scheduled Successfully!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for scheduling a consultation with AI Agency. We're excited to discuss how AI agents can transform your business.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3b82f6; margin-top: 0;">Meeting Details</h3>
          <p><strong>Date:</strong> ${meetingDate}</p>
          <p><strong>Time:</strong> ${meetingTimeFormatted}</p>
          <p><strong>Duration:</strong> 30 minutes</p>
          <p><strong>Consultation Fee:</strong> ₹1000</p>
        </div>
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;"><strong>Payment Information:</strong></p>
          <p style="margin: 5px 0 0 0; color: #856404;">We'll send you payment details via email. Payment can be made after booking confirmation.</p>
        </div>
        <p>We'll send you a meeting link via email before the scheduled time. If you need to reschedule or have any questions, please reply to this email.</p>
        <p>Looking forward to speaking with you!</p>
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>AI Agency Team</strong>
        </p>
      </div>
    `

    // Generate calendar invite for you (owner)
    const ownerCalendarInvite = generateCalendarInvite(name, email, start, end)

    // Send email to you
    console.log(`📧 Sending notification email to: ${YOUR_EMAIL}`)
    try {
      const ownerEmailResult = await resend.emails.send({
        from: 'AI Agency <onboarding@resend.dev>', // Update this with your verified domain
        to: YOUR_EMAIL,
        subject: `New Consultation Booking: ${name}`,
        html: ownerEmailHtml,
        attachments: [
          {
            filename: 'consultation.ics',
            content: Buffer.from(ownerCalendarInvite).toString('base64'),
          },
        ],
      })
      console.log(`✅ Owner email sent successfully.`, ownerEmailResult)
      if (calendarEventId) {
        console.log(`📅 Event also added to your Google Calendar (ID: ${calendarEventId})`)
      } else {
        console.log(`📅 Calendar invite (.ics) attached to your email`)
      }
    } catch (emailError: any) {
      console.error('❌ Error sending owner email:', emailError)
      throw new Error(`Failed to send notification email: ${emailError.message}`)
    }

    // Send email to client
    console.log(`📧 Sending confirmation email to client: ${email}`)
    console.log(`📧 Email content length: ${clientEmailHtml.length} characters`)
    console.log(`📧 Calendar invite length: ${calendarInvite.length} characters`)
    
    try {
      const clientEmailResult = await resend.emails.send({
        from: 'AI Agency <onboarding@resend.dev>', // Update this with your verified domain
        to: email,
        subject: 'Your Consultation is Scheduled - AI Agency',
        html: clientEmailHtml,
        attachments: [
          {
            filename: 'consultation.ics',
            content: Buffer.from(calendarInvite).toString('base64'),
          },
        ],
      })
      
      console.log(`✅ Client email sent successfully!`)
      console.log(`📧 Recipient: ${email}`)
      console.log('📧 Full email response:', JSON.stringify(clientEmailResult, null, 2))
      
    } catch (emailError: any) {
      console.error('❌ Error sending client email:')
      console.error('❌ Error type:', emailError.constructor.name)
      console.error('❌ Error message:', emailError.message)
      console.error('❌ Full error:', JSON.stringify(emailError, null, 2))
      
      // Check if it's a Resend API error
      if (emailError.response) {
        console.error('❌ Resend API response:', JSON.stringify(emailError.response, null, 2))
      }
      
      throw new Error(`Failed to send confirmation email: ${emailError.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Consultation scheduled successfully',
      meetingDate,
      meetingTimeFormatted,
      calendarEventId: calendarEventId || null,
      addedToCalendar: calendarEventId ? true : false,
    })
  } catch (error: any) {
    console.error('Error scheduling consultation:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to schedule consultation' },
      { status: 500 }
    )
  }
}

