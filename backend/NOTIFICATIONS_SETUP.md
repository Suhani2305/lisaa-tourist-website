# 📧 Notifications Setup Guide

This guide explains how to set up Email, SMS, and WhatsApp notifications for booking confirmations.

## 📋 Prerequisites

1. **Email Service (Nodemailer)** - Already installed ✅
2. **SMS Service (Twilio)** - Already installed ✅
3. **WhatsApp Service (Twilio)** - Already installed ✅

---

## 📧 Email Configuration

### Step 1: Set up Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** → **2-Step Verification** (enable if not enabled)
3. Scroll down and click **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### Step 2: Add to .env file

Add these lines to `backend/.env`:

```env
# Email Configuration (Gmail)
EMAIL_USER=Lsiaatech@gmail.com
EMAIL_PASSWORD=your_16_character_app_password_here
# OR use Gmail App Password variable name
GMAIL_APP_PASSWORD=your_16_character_app_password_here
```

**Important:** Use the **App Password**, not your regular Gmail password!

---

## 📱 SMS Configuration (Twilio)

### Step 1: Create Twilio Account

1. Go to https://www.twilio.com/
2. Sign up for a free account
3. Verify your phone number
4. Get your Account SID and Auth Token from Dashboard

### Step 2: Get a Twilio Phone Number

1. Go to **Phone Numbers** → **Get Started**
2. Buy a Twilio phone number (free trial includes $15 credit)
3. Note the phone number

### Step 3: Add to .env file

Add these lines to `backend/.env`:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
```

---

## 💬 WhatsApp Configuration (Twilio)

### Step 1: Set up Twilio WhatsApp

1. Login to Twilio Console
2. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Click **Get started with WhatsApp Sandbox**
4. Follow the instructions to join the sandbox (send a message to Twilio)
5. Note your WhatsApp number (format: `whatsapp:+14155238886`)

### Step 2: Add to .env file

Add this line to `backend/.env`:

```env
# Twilio WhatsApp Configuration
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886  # Default Twilio sandbox number
```

**Note:** For production, you'll need to:
- Submit for Twilio WhatsApp approval
- Use your approved WhatsApp Business number

---

## 🧪 Testing Notifications

### Test Email

1. Make a test booking
2. Check your email inbox (and spam folder)
3. You should receive a confirmation email

### Test SMS

1. Make a test booking
2. Check your phone for SMS
3. SMS will only send if Twilio credentials are configured

### Test WhatsApp

1. Make a test booking
2. Check WhatsApp for message
3. WhatsApp will only send if Twilio credentials are configured

---

## 🔧 Troubleshooting

### Email not sending?

✅ **Check:**
- Gmail App Password is correct
- 2-Step Verification is enabled
- Email credentials in `.env` are correct
- Check backend logs for errors

### SMS not sending?

✅ **Check:**
- Twilio Account SID and Auth Token are correct
- Twilio phone number is correct
- You have Twilio credits (free trial has $15)
- Phone number format: `+91XXXXXXXXXX` (with country code)

### WhatsApp not sending?

✅ **Check:**
- Twilio WhatsApp number is correct
- You've joined Twilio WhatsApp Sandbox
- Phone number format: `whatsapp:+91XXXXXXXXXX`
- For production: WhatsApp Business API is approved

---

## 📝 Example .env Configuration

```env
# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

# Email (Gmail)
EMAIL_USER=Lsiaatech@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop

# Twilio SMS
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Twilio WhatsApp
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

---

## 🎉 Features

After setup, when a booking is confirmed:

✅ **Email sent** - Beautiful HTML email with booking details
✅ **SMS sent** - Text message with booking summary
✅ **WhatsApp sent** - Formatted message with booking details
✅ **PDF Receipt** - Auto-generated and downloadable

All notifications are sent **automatically** after successful payment!

---

## 📞 Support

- **Email:** Lsiaatech@gmail.com
- **Phone:** +91 9263616263
- **Twilio Support:** https://www.twilio.com/help

---

**Note:** Services will gracefully fail if credentials are not configured. Bookings will still be created successfully, but notifications won't be sent.

