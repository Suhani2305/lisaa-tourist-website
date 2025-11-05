const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Tour = require('../models/Tour');
const Offer = require('../models/Offer');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const whatsappService = require('../services/whatsappService');
const receiptService = require('../services/receiptService');
const path = require('path');
const fs = require('fs');

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
      bookingDetails,
      couponCode,
      couponDiscount,
      baseAmount
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

      // Fetch user and tour details
      const user = await User.findById(bookingDetails.userId);
      const tour = await Tour.findById(bookingDetails.tourId);

      if (!user || !tour) {
        return res.status(404).json({
          success: false,
          message: 'User or tour not found'
        });
      }

      // Handle coupon if applied
      let appliedCouponData = null;
      if (couponCode && couponDiscount > 0) {
        const offer = await Offer.findOne({ code: couponCode.toUpperCase() });
        if (offer) {
          appliedCouponData = {
            code: couponCode.toUpperCase(),
            offerId: offer._id,
            discountAmount: couponDiscount,
            discountType: offer.type,
            discountValue: offer.value
          };
          
          // Increment offer usage count
          offer.usedCount = (offer.usedCount || 0) + 1;
          await offer.save();
        }
      }

      // Calculate pricing with coupon
      const basePrice = baseAmount || bookingDetails.totalAmount;
      const couponDiscountAmount = couponDiscount || 0;
      const finalAmount = Math.max(0, basePrice - couponDiscountAmount);

      // Create booking in database
      const booking = new Booking({
        user: bookingDetails.userId,
        tour: bookingDetails.tourId,
        travelers: bookingDetails.travelers?.adults 
          ? [{ 
              name: user.name, 
              age: 30, 
              type: 'adult', 
              gender: user.gender || 'male' 
            }]
          : [],
        contactInfo: {
          email: user.email,
          phone: user.phone || bookingDetails.phone
        },
        travelDates: {
          startDate: new Date(bookingDetails.bookingDate),
          endDate: new Date(new Date(bookingDetails.bookingDate).getTime() + (tour.duration?.days || 1) * 24 * 60 * 60 * 1000)
        },
        pricing: {
          basePrice: basePrice,
          totalAmount: basePrice,
          discount: couponDiscountAmount,
          taxes: 0,
          finalAmount: finalAmount
        },
        payment: {
          status: 'paid',
          method: 'credit-card',
          transactionId: razorpay_payment_id,
          paymentDate: new Date()
        },
        status: 'confirmed',
        specialRequests: bookingDetails.specialRequests || '',
        appliedCoupon: appliedCouponData
      });

      await booking.save();

      // Populate booking with user and tour
      await booking.populate('user', 'name email phone');
      await booking.populate('tour', 'title destination duration images');

      console.log('✅ Booking created:', booking._id);

      // Generate receipt PDF
      let receiptUrl = null;
      try {
        const receiptResult = await receiptService.generateReceiptPDF({
          user: booking.user,
          tour: booking.tour,
          booking: booking,
          bookingNumber: booking.bookingNumber
        });
        if (receiptResult.success) {
          receiptUrl = receiptResult.url;
        }
      } catch (receiptError) {
        console.error('❌ Receipt generation error:', receiptError);
      }

      // Send notifications asynchronously (don't wait for them)
      Promise.all([
        emailService.sendBookingConfirmationEmail({
          user: booking.user,
          tour: booking.tour,
          booking: booking,
          bookingNumber: booking.bookingNumber
        }),
        smsService.sendBookingConfirmationSMS({
          user: booking.user,
          tour: booking.tour,
          booking: booking,
          bookingNumber: booking.bookingNumber
        }),
        whatsappService.sendBookingConfirmationWhatsApp({
          user: booking.user,
          tour: booking.tour,
          booking: booking,
          bookingNumber: booking.bookingNumber
        })
      ]).then(results => {
        console.log('📧 Notification results:', {
          email: results[0].success ? 'sent' : 'failed',
          sms: results[1].success ? 'sent' : 'failed',
          whatsapp: results[2].success ? 'sent' : 'failed'
        });
      }).catch(error => {
        console.error('❌ Notification sending error:', error);
      });

      res.json({
        success: true,
        message: 'Payment verified and booking confirmed!',
        bookingId: booking._id,
        bookingNumber: booking.bookingNumber,
        paymentId: razorpay_payment_id,
        receiptUrl: receiptUrl
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

// Download receipt
router.get('/receipt/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('user', 'name email phone')
      .populate('tour', 'title destination duration images');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Generate receipt if not exists
    const receiptResult = await receiptService.generateReceiptPDF({
      user: booking.user,
      tour: booking.tour,
      booking: booking,
      bookingNumber: booking.bookingNumber
    });

    if (!receiptResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate receipt',
        error: receiptResult.error
      });
    }

    // Send PDF file
    const filepath = receiptResult.filepath;
    const filename = `Receipt_${booking.bookingNumber}.pdf`;

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Receipt file not found'
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('❌ Download receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download receipt',
      error: error.message
    });
  }
});

// Serve receipt files statically (optional - for direct access)
router.get('/receipts/:filename', (req, res) => {
  try {
    const filepath = receiptService.getReceiptPath(req.params.filename);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${req.params.filename}"`);
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('❌ Serve receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve receipt',
      error: error.message
    });
  }
});

module.exports = router;

