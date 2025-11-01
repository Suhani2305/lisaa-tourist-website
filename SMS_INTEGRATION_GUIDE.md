# 📱 SMS OTP Integration Guide

## ✅ What's Already Done:

1. ✅ Backend API routes created (`/api/otp/send-otp` and `/api/otp/verify-otp`)
2. ✅ Frontend integrated with backend OTP API
3. ✅ OTP verification shows password without redirecting
4. ✅ Mock SMS system working (shows OTP in console)

---

## 🚀 How to Enable Real SMS (Production)

You need to integrate an SMS gateway service. Here are the two best options for India:

### Option 1: Fast2SMS (Recommended for India)

**Step 1: Get API Key**
1. Go to: https://www.fast2sms.com
2. Sign up for account
3. Get your API key from dashboard
4. Add credits (₹50-100 for testing)

**Step 2: Update Backend Code**

Open `backend/routes/otpRoutes.js` and uncomment Fast2SMS section:

```javascript
const sendSMS = async (phone, otp) => {
  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': 'YOUR_FAST2SMS_API_KEY_HERE', // Add your API key
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'v3',
        sender_id: 'TXTIND',
        message: `Your OTP for Lisaa Tourist Admin Login is: ${otp}. Valid for 5 minutes.`,
        language: 'english',
        flash: 0,
        numbers: phone
      })
    });
    return await response.json();
  } catch (error) {
    console.error('SMS sending error:', error);
    throw error;
  }
};
```

**Step 3: Remove Demo OTP from Response**

In `backend/routes/otpRoutes.js`, remove this line from production:
```javascript
// Remove or comment this in production:
demo_otp: otp 
```

---

### Option 2: MSG91 (Alternative)

**Step 1: Get API Credentials**
1. Go to: https://msg91.com
2. Sign up and verify account
3. Create a template for OTP message
4. Get Auth Key and Template ID

**Step 2: Update Backend Code**

Open `backend/routes/otpRoutes.js` and uncomment MSG91 section:

```javascript
const sendSMS = async (phone, otp) => {
  try {
    const authKey = 'YOUR_MSG91_AUTH_KEY';
    const templateId = 'YOUR_TEMPLATE_ID';
    
    const response = await fetch(
      `https://api.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${phone}&authkey=${authKey}&otp=${otp}`,
      { method: 'POST' }
    );
    return await response.json();
  } catch (error) {
    console.error('SMS sending error:', error);
    throw error;
  }
};
```

---

## 🔧 Environment Variables Setup

Add SMS credentials to your `.env` file:

```env
# For Fast2SMS
FAST2SMS_API_KEY=your_api_key_here

# OR For MSG91
MSG91_AUTH_KEY=your_auth_key_here
MSG91_TEMPLATE_ID=your_template_id_here
```

Then update code to use environment variables:

```javascript
// In otpRoutes.js
const sendSMS = async (phone, otp) => {
  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      'authorization': process.env.FAST2SMS_API_KEY, // Use env variable
      'Content-Type': 'application/json'
    },
    // ... rest of code
  });
};
```

---

## 📝 Current Flow (Demo Mode):

1. User clicks "Forgot Password?"
2. Selects phone number
3. Clicks "Send OTP"
4. **Backend generates OTP** ✅
5. **OTP shown in console** (for demo)
6. User enters OTP
7. Backend verifies OTP
8. **Password shown in notification** (doesn't redirect) ✅

---

## 🎯 Production Flow:

1. User clicks "Forgot Password?"
2. Selects phone number
3. Clicks "Send OTP"
4. **Backend sends real SMS to phone** 📱
5. User receives SMS with OTP
6. User enters OTP from SMS
7. Backend verifies OTP
8. Password shown in notification

---

## 💰 SMS Service Pricing:

### Fast2SMS:
- ₹0.15 - ₹0.25 per SMS
- Minimum recharge: ₹50
- Good for 200-300 SMS

### MSG91:
- ₹0.17 - ₹0.30 per SMS
- Minimum recharge: ₹100
- Good for testing and production

---

## 🧪 Testing:

### Demo Mode (Current):
```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend-new
npm run dev

# Test OTP flow
1. Go to /admin/login
2. Click "Forgot Password?"
3. Select phone: 9263616263
4. Click "Send OTP"
5. Check browser console for OTP
6. Enter OTP
7. See password in notification
```

### Production Mode (After SMS Integration):
- Same steps, but OTP will come via real SMS
- No console logging of OTP
- Users receive OTP on their actual phone

---

## 🔒 Security Best Practices:

1. ✅ OTP expires in 5 minutes (already implemented)
2. ✅ OTP stored temporarily in memory (already implemented)
3. ✅ OTP deleted after verification (already implemented)
4. ⚠️ In production, DON'T send OTP in API response
5. ⚠️ Rate limit OTP requests (add middleware)
6. ⚠️ Log OTP attempts for security monitoring

---

## 📊 What's Working Now:

| Feature | Status |
|---------|--------|
| OTP Generation | ✅ Working |
| OTP Storage | ✅ Working (5 min expiry) |
| OTP Verification | ✅ Working |
| Password Reveal | ✅ Working (no redirect) |
| Backend API | ✅ Working |
| Frontend Integration | ✅ Working |
| SMS Sending | ⚠️ Demo Mode (console) |

---

## 🚀 To Enable Real SMS:

**Quick Steps:**
1. Choose SMS provider (Fast2SMS or MSG91)
2. Sign up and get API key
3. Uncomment SMS code in `backend/routes/otpRoutes.js`
4. Add API key to `.env`
5. Remove `demo_otp` from response
6. Test with real phone number
7. Done! 🎉

---

## 📞 Support:

For SMS integration issues:
- Fast2SMS: https://fast2sms.com/support
- MSG91: https://msg91.com/help

---

## ✅ Summary:

**Current Status:**
- ✅ Complete OTP system built
- ✅ Backend APIs ready
- ✅ Frontend integrated
- ✅ Demo mode working
- ⏳ Just need to add SMS API key for production

**To Go Live:**
- Just uncomment SMS code
- Add API key
- Test once
- Ready! 🚀

