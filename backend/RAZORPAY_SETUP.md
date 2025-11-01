# 🔐 Razorpay Payment Gateway Setup

## Step 1: Create Razorpay Account

1. Go to https://razorpay.com/
2. Click on "Sign Up" 
3. Complete registration with your business details
4. Verify your email and phone number

## Step 2: Get API Keys

1. Login to Razorpay Dashboard: https://dashboard.razorpay.com/
2. Go to **Settings** → **API Keys**
3. Click on **Generate Test Keys** (for testing)
4. Copy both:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** 

## Step 3: Add Keys to Backend

1. Open `backend/.env` file
2. Add these lines:

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
```

3. Save the file

## Step 4: Install Razorpay Package

```bash
cd backend
npm install razorpay
```

## Step 5: Restart Backend Server

```bash
npm run dev
```

## 🧪 Testing Payment

### Test Cards (Razorpay Test Mode):

**Success:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

### Test UPI:
- UPI ID: `success@razorpay`
- UPI ID (Failure): `failure@razorpay`

### Test Netbanking:
- Select any bank
- Use Razorpay test credentials

## 🚀 Going Live (Production)

1. Complete KYC in Razorpay Dashboard
2. Activate Live Mode
3. Generate **Live API Keys** (starts with `rzp_live_`)
4. Replace test keys with live keys in `.env`
5. Test thoroughly before going live!

## 💡 Payment Methods Enabled:

✅ Credit/Debit Cards (Visa, Mastercard, RuPay)
✅ UPI (Google Pay, PhonePe, Paytm, etc.)
✅ Net Banking (All major banks)
✅ Wallets (Paytm, PhonePe, Amazon Pay, etc.)

## 🔒 Security Features:

- PCI DSS Compliant
- 256-bit SSL Encryption
- Signature Verification
- Automatic refunds
- Real-time fraud detection

## 📞 Support

Razorpay Support: https://razorpay.com/support/
Email: support@razorpay.com
Phone: +91-8069000700

