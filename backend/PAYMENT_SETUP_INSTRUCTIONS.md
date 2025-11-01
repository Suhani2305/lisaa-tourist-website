# 💳 Payment Setup Instructions - Razorpay

## 🚨 Current Issue
**Error:** `Authentication failed` - Razorpay API keys not configured

---

## ✅ Quick Fix - Follow These Steps:

### Step 1: Get Razorpay Test API Keys

1. **Go to Razorpay Website**
   - Visit: https://razorpay.com/
   - Click **"Sign Up"** button

2. **Create Account**
   - Use email: `Lsiaatech@gmail.com`
   - Use phone: `+91 9263616263`
   - Verify your email and phone with OTP

3. **Login to Dashboard**
   - Visit: https://dashboard.razorpay.com/
   - Complete login

4. **Generate Test API Keys**
   - Click on **Settings** (⚙️ icon) in sidebar
   - Click on **API Keys**
   - Click **"Generate Test Keys"** button
   - You'll see two keys:
     ```
     Key ID: rzp_test_XXXXXXXXXXXX (starts with rzp_test_)
     Key Secret: YYYYYYYYYYYYYYYY (hidden, click "Show" to reveal)
     ```
   - **COPY BOTH KEYS** - You'll need them in next step

---

### Step 2: Update .env File

1. **Open `.env` file** in backend folder
   - File location: `backend/.env`

2. **Replace placeholder values** with your real Razorpay keys:

**BEFORE:**
```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYYYYYYYY
```

**AFTER (example):**
```env
RAZORPAY_KEY_ID=rzp_test_abc123xyz456
RAZORPAY_KEY_SECRET=SuperSecretKeyHere123456
```

3. **Also update MongoDB URI** (if not already):
```env
MONGODB_URI=your_actual_mongodb_connection_string
```

4. **Save the file** (Ctrl + S)

---

### Step 3: Restart Backend Server

1. **Stop current backend** (if running)
   - Press `Ctrl + C` in backend terminal

2. **Start backend again:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Check console** - You should see:
   ```
   ✅ Server running on port 5000
   ✅ MongoDB connected successfully
   ```

---

### Step 4: Test Payment

1. **Go to frontend** and try booking a package

2. **Use these TEST card details:**
   - **Card Number:** `4111 1111 1111 1111` ✅ Success
   - **CVV:** Any 3 digits (e.g., `123`)
   - **Expiry:** Any future date (e.g., `12/25`)
   - **Name:** Your name

3. **Or use UPI:**
   - **UPI ID:** `success@razorpay` ✅ Success
   - **UPI ID:** `failure@razorpay` ❌ Failure (for testing)

---

## 🧪 Test Mode vs Live Mode

### Test Mode (Current - For Development)
- Keys start with `rzp_test_`
- Free to use
- No real money transactions
- Use test card/UPI details above

### Live Mode (For Production - Real Payments)
- Keys start with `rzp_live_`
- Requires KYC completion
- Real money transactions
- Only activate when going live

---

## 🔒 Security Tips

1. **Never commit .env file to Git**
   - Already added to `.gitignore`
   - Keys should remain secret

2. **Don't share Key Secret**
   - Keep it private
   - Regenerate if exposed

3. **Use Test keys for development**
   - Only use Live keys in production

---

## 🆘 Troubleshooting

### Error: "Authentication failed"
✅ **Solution:** Update `.env` with real Razorpay keys (see Step 2 above)

### Error: "Cannot find module 'razorpay'"
✅ **Solution:** Install Razorpay package
```bash
cd backend
npm install razorpay
```

### Error: "Payment verification failed"
✅ **Solution:** Make sure `RAZORPAY_KEY_SECRET` is correct in `.env`

### Payment modal not opening
✅ **Solution:** Check browser console for errors

---

## 📞 Support

**Razorpay Support:**
- Website: https://razorpay.com/support/
- Email: support@razorpay.com
- Phone: +91-8069000700

**Project Contact:**
- Email: Lsiaatech@gmail.com
- Phone: +91 9263616263

---

## ✅ Checklist

Before testing payment, make sure:
- [ ] Razorpay account created
- [ ] Test API Keys generated
- [ ] Keys added to `backend/.env` file
- [ ] `.env` file saved
- [ ] Backend server restarted
- [ ] MongoDB connected
- [ ] Frontend running

**Once all above are ✅, payment should work!** 🎉


