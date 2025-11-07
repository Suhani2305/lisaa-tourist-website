# 📱 SMS OTP Service - Production Setup Guide

## Overview
The SMS service is now production-ready with support for Fast2SMS and MSG91 providers. The system automatically detects which provider is configured and uses it accordingly.

## Quick Setup

### Step 1: Choose SMS Provider

**Option A: Fast2SMS (Recommended for India)**
- Website: https://www.fast2sms.com
- Pricing: ₹0.15 - ₹0.25 per SMS
- Minimum recharge: ₹50
- Good for: 200-300 SMS

**Option B: MSG91 (Alternative)**
- Website: https://msg91.com
- Pricing: ₹0.17 - ₹0.30 per SMS
- Minimum recharge: ₹100
- Good for: Production use

### Step 2: Get API Credentials

#### For Fast2SMS:
1. Sign up at https://www.fast2sms.com
2. Verify your account
3. Go to Dashboard → API Keys
4. Copy your API key
5. (Optional) Set sender ID (default: TXTIND)

#### For MSG91:
1. Sign up at https://msg91.com
2. Verify your account
3. Create an OTP template
4. Get Auth Key from dashboard
5. Get Template ID from your template

### Step 3: Configure Environment Variables

Add to your `.env` file in the `backend` directory:

```env
# Choose SMS Provider: 'fast2sms' or 'msg91'
SMS_PROVIDER=fast2sms

# For Fast2SMS
FAST2SMS_API_KEY=your_api_key_here
FAST2SMS_SENDER_ID=TXTIND  # Optional, defaults to TXTIND

# OR For MSG91
# SMS_PROVIDER=msg91
# MSG91_AUTH_KEY=your_auth_key_here
# MSG91_TEMPLATE_ID=your_template_id_here

# Development/Testing (Optional)
# ALLOWED_PHONES=9263616263,8840206492  # Only for development mode
NODE_ENV=production  # Set to 'production' for production mode
```

### Step 4: Restart Backend Server

```bash
cd backend
npm start
# or
node server.js
```

## How It Works

### Production Mode (`NODE_ENV=production`)
- ✅ Sends real SMS via configured provider
- ✅ No OTP shown in console
- ✅ No `demo_otp` in API response
- ✅ Phone number validation (10-digit Indian format)
- ✅ Error messages without sensitive data

### Development Mode (`NODE_ENV=development`)
- ✅ Falls back to demo mode if SMS provider not configured
- ✅ Shows OTP in console for testing
- ✅ Returns `demo_otp` in response (only if demo mode)
- ✅ More detailed error messages

## API Endpoints

### POST `/api/otp/send-otp`
**Request:**
```json
{
  "phone": "9263616263"
}
```

**Response (Production):**
```json
{
  "success": true,
  "message": "OTP sent successfully to your registered mobile number"
}
```

**Response (Development/Demo):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "demo_otp": "123456",
  "warning": "SMS provider not configured. Running in demo mode."
}
```

### POST `/api/otp/verify-otp`
**Request:**
```json
{
  "phone": "9263616263",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "verified": true
}
```

## Testing

### Test with Real Phone Number
1. Add your phone number to `.env` (if using `ALLOWED_PHONES` in dev mode)
2. Call `/api/otp/send-otp` with your phone number
3. Check your phone for SMS
4. Verify OTP using `/api/otp/verify-otp`

### Test in Development Mode
1. Don't configure SMS provider
2. System will run in demo mode
3. OTP will be shown in console and response
4. Use this for local testing

## Troubleshooting

### SMS Not Sending
1. **Check API Key**: Verify your API key is correct
2. **Check Balance**: Ensure you have sufficient balance in your SMS provider account
3. **Check Phone Format**: Phone number must be 10 digits (Indian format)
4. **Check Logs**: Look for error messages in console
5. **Check Provider Status**: Verify SMS provider service is operational

### Common Errors

**"SMS provider not configured"**
- Add `FAST2SMS_API_KEY` or `MSG91_AUTH_KEY` to `.env`
- Restart server

**"Invalid phone number format"**
- Phone must be 10 digits starting with 6-9
- Example: `9263616263` ✅
- Example: `09263616263` ❌ (no leading 0)

**"Unauthorized phone number"**
- Only in development mode with `ALLOWED_PHONES` set
- Add your phone to `ALLOWED_PHONES` in `.env`
- Or remove `ALLOWED_PHONES` for production

## Security Notes

1. **Never commit `.env` file** to version control
2. **Rotate API keys** periodically
3. **Monitor SMS usage** to detect abuse
4. **Set rate limits** on OTP endpoints
5. **Use HTTPS** in production

## Cost Estimation

For 1000 OTPs per month:
- Fast2SMS: ~₹150-250
- MSG91: ~₹170-300

## Support

For issues with:
- **Fast2SMS**: https://www.fast2sms.com/support
- **MSG91**: https://msg91.com/support
- **Code Issues**: Check backend logs and error messages

