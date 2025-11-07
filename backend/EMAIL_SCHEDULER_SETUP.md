# 📧 Email Scheduler Setup Guide

## Overview
The email scheduler automatically sends reminder and follow-up emails for bookings. This guide explains how to set it up and use it.

## Email Types

### 1. Booking Reminder Email
- **When:** 3 days before travel date
- **Purpose:** Remind customers about their upcoming trip
- **Content:** Travel date, important reminders, contact information

### 2. Booking Follow-up Email
- **When:** 2 days after trip completion
- **Purpose:** Request feedback and encourage reviews
- **Content:** Trip summary, feedback request, next adventure suggestions

### 3. Booking Cancellation Email
- **When:** Immediately upon cancellation
- **Purpose:** Confirm cancellation and provide refund details
- **Content:** Cancellation details, refund information, rebooking options

## Setup Options

### Option 1: Manual Trigger (Recommended for Testing)

Use the admin API endpoints to manually trigger emails:

```bash
# Send reminder emails
POST /api/emails/send-reminders
Headers: Authorization: Bearer <admin_token>

# Send follow-up emails
POST /api/emails/send-follow-ups
Headers: Authorization: Bearer <admin_token>
```

### Option 2: Cron Job (Recommended for Production)

Set up a cron job to run daily:

**Linux/Mac (crontab):**
```bash
# Edit crontab
crontab -e

# Add these lines (runs daily at 9 AM)
0 9 * * * curl -X POST http://localhost:5000/api/emails/send-reminders -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
0 9 * * * curl -X POST http://localhost:5000/api/emails/send-follow-ups -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Windows (Task Scheduler):**
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to "Daily" at 9:00 AM
4. Action: Start a program
5. Program: `curl.exe`
6. Arguments: `-X POST http://localhost:5000/api/emails/send-reminders -H "Authorization: Bearer YOUR_ADMIN_TOKEN"`

### Option 3: Node.js Cron Package

Install `node-cron`:
```bash
npm install node-cron
```

Add to `server.js`:
```javascript
const cron = require('node-cron');
const emailScheduler = require('./services/emailScheduler');

// Run daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily email scheduler...');
  await emailScheduler.sendBookingReminders();
  await emailScheduler.sendBookingFollowUps();
});
```

## Testing

### Test Reminder Emails
1. Create a booking with travel date 3 days from now
2. Call `POST /api/emails/send-reminders`
3. Check email inbox

### Test Follow-up Emails
1. Mark a booking as completed with end date 2 days ago
2. Call `POST /api/emails/send-follow-ups`
3. Check email inbox

## API Endpoints

### POST `/api/emails/send-reminders`
**Description:** Manually trigger reminder emails for bookings 3 days before travel

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Reminder emails processed",
  "count": 5
}
```

### POST `/api/emails/send-follow-ups`
**Description:** Manually trigger follow-up emails for completed bookings

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Follow-up emails processed",
  "count": 3
}
```

## Database Fields

The Booking model includes:
- `reminderSent` (Boolean) - Tracks if reminder email was sent
- `followUpEmailSent` (Boolean) - Tracks if follow-up email was sent

These prevent duplicate emails from being sent.

## Troubleshooting

### Emails Not Sending
1. Check email service configuration in `.env`
2. Verify EMAIL_USER and EMAIL_PASSWORD are set
3. Check server logs for error messages
4. Ensure bookings have valid user email addresses

### Duplicate Emails
- The system checks `reminderSent` and `followUpEmailSent` flags
- If you need to resend, manually reset these flags in the database

### Scheduling Issues
- Verify cron job is running
- Check server timezone settings
- Ensure server is running at scheduled time

## Best Practices

1. **Run scheduler during off-peak hours** (e.g., 9 AM)
2. **Monitor email delivery** - Check logs regularly
3. **Test before production** - Use manual triggers first
4. **Set up email monitoring** - Track bounce rates and delivery
5. **Handle errors gracefully** - Emails failing shouldn't break the system

## Email Template Customization

All email templates are in `backend/services/emailService.js`. You can customize:
- Colors and branding
- Content and messaging
- Timing (currently 3 days before, 2 days after)
- Additional information

## Support

For issues:
- Check server logs for detailed error messages
- Verify email service configuration
- Test email sending manually first
- Contact support if issues persist

