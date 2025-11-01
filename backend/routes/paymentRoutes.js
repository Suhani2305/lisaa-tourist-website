const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

// Initialize Razorpay
// Get your API keys from: https://dashboard.razorpay.com/app/dashboard
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.log('\n⚠️  WARNING: Razorpay API keys not found in .env file!');
  console.log('📖 Read PAYMENT_SETUP_INSTRUCTIONS.md for setup guide\n');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, tourId, tourTitle, customerName, customerEmail, customerPhone } = req.body;

    console.log('💰 Creating payment order:', {
      amount,
      tourId,
      tourTitle,
      customerName
    });

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise (₹100 = 10000 paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        tourId,
        tourTitle,
        customerName,
        customerEmail,
        customerPhone
      }
    };

    const order = await razorpay.orders.create(options);

    console.log('✅ Razorpay order created:', order.id);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('❌ Payment order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
});

// Verify payment and create booking
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingDetails
    } = req.body;

    console.log('🔐 Verifying payment:', razorpay_payment_id);

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      console.log('✅ Payment signature verified!');

      // Create booking in database
      const booking = new Booking({
        user: bookingDetails.userId,
        tour: bookingDetails.tourId,
        travelers: bookingDetails.travelers,
        bookingDate: bookingDetails.bookingDate,
        totalAmount: bookingDetails.totalAmount,
        paymentStatus: 'paid',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'confirmed',
        specialRequests: bookingDetails.specialRequests || ''
      });

      await booking.save();

      console.log('✅ Booking created:', booking._id);

      res.json({
        success: true,
        message: 'Payment verified and booking confirmed!',
        bookingId: booking._id,
        paymentId: razorpay_payment_id
      });
    } else {
      console.error('❌ Invalid payment signature');
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
});

// Get payment details
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);
    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('❌ Fetch payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
});

module.exports = router;

