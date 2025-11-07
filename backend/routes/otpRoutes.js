const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

console.log('✅ OTP Routes Module Loaded Successfully');

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS (Fast2SMS or MSG91)
const sendSMS = async (phone, otp) => {
  try {
    const smsProvider = process.env.SMS_PROVIDER || 'fast2sms'; // 'fast2sms' or 'msg91'
    
    // Option 1: Fast2SMS Integration (Default)
    if (smsProvider === 'fast2sms' && process.env.FAST2SMS_API_KEY) {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'v3',
          sender_id: process.env.FAST2SMS_SENDER_ID || 'TXTIND',
          message: `Your OTP for Lisaa Tourist Admin Login is: ${otp}. Valid for 5 minutes.`,
          language: 'english',
          flash: 0,
          numbers: phone
        })
      });
      
      const result = await response.json();
      
      if (result.return === true) {
        return { success: true, message: 'OTP sent successfully', provider: 'Fast2SMS' };
      } else {
        throw new Error(result.message || 'Failed to send SMS via Fast2SMS');
      }
    }
    
    // Option 2: MSG91 Integration
    if (smsProvider === 'msg91' && process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
      const response = await fetch(
        `https://api.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=${phone}&authkey=${process.env.MSG91_AUTH_KEY}&otp=${otp}`,
        { method: 'POST' }
      );
      
      const result = await response.json();
      
      if (result.type === 'success') {
        return { success: true, message: 'OTP sent successfully', provider: 'MSG91' };
      } else {
        throw new Error(result.message || 'Failed to send SMS via MSG91');
      }
    }
    
    // Fallback: Demo mode (only if no SMS provider configured)
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ SMS provider not configured. Running in demo mode.');
      console.log(`[DEMO] SMS would be sent to ${phone}: OTP = ${otp}`);
      return { success: true, message: 'OTP sent successfully (demo mode)', provider: 'demo' };
    }
    
    // Production mode without SMS provider configured
    throw new Error('SMS provider not configured. Please set FAST2SMS_API_KEY or MSG91 credentials in environment variables.');
    
  } catch (error) {
    console.error('SMS sending error:', error.message);
    throw error;
  }
};

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Validate phone number format (10 digits for India)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format. Please enter a valid 10-digit Indian mobile number.' });
    }

    // In production, remove phone number restrictions
    // For development/testing, you can keep allowed phones list
    if (process.env.NODE_ENV === 'development' && process.env.ALLOWED_PHONES) {
      const allowedPhones = process.env.ALLOWED_PHONES.split(',').map(p => p.trim());
      if (!allowedPhones.includes(phone)) {
        return res.status(403).json({ message: 'Unauthorized phone number for testing' });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiry (5 minutes)
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Send SMS
    const smsResult = await sendSMS(phone, otp);

    // Log success (without OTP) in production
    if (process.env.NODE_ENV === 'production') {
      console.log(`✅ OTP sent successfully to ${phone} via ${smsResult.provider || 'SMS'}`);
    } else {
      // Development mode: log with OTP for testing
      console.log(`✅ OTP Generated for ${phone}: ${otp}`);
      console.log(`📝 OTP stored in memory, expires in 5 minutes`);
    }

    // Production response (no OTP in response)
    const response = { 
      success: true, 
      message: 'OTP sent successfully to your registered mobile number'
    };

    // Only include demo_otp in development mode
    if (process.env.NODE_ENV === 'development' && smsResult.provider === 'demo') {
      response.demo_otp = otp;
      response.warning = 'SMS provider not configured. Running in demo mode.';
    }

    res.json(response);

  } catch (error) {
    console.error('Send OTP error:', error.message);
    res.status(500).json({ 
      message: error.message || 'Failed to send OTP. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify OTP endpoint  
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    // Get stored OTP
    const storedData = otpStore.get(phone);

    if (!storedData) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`❌ No OTP found for phone: ${phone}`);
      }
      return res.status(400).json({ message: 'OTP not found or expired. Please request a new OTP.' });
    }

    // Check if expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(phone);
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏰ OTP expired for phone: ${phone}`);
      }
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    // Convert both to string for comparison
    const enteredOTP = String(otp).trim();
    const storedOTP = String(storedData.otp).trim();

    // Verify OTP
    if (storedOTP === enteredOTP) {
      // Mark phone as verified but keep in store for password reset
      otpStore.set(phone, {
        otp: storedData.otp,
        expiresAt: storedData.expiresAt,
        verified: true // Add verified flag
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ OTP Verified Successfully for phone: ${phone}`);
      }
      
      return res.json({ 
        success: true, 
        message: 'OTP verified successfully',
        verified: true
      });
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log(`❌ Invalid OTP for phone: ${phone}`);
      }
      return res.status(400).json({ 
        message: 'Invalid OTP. Please check and try again.',
        ...(process.env.NODE_ENV === 'development' && { 
          debug: `Expected: ${storedOTP}, Got: ${enteredOTP}` 
        })
      });
    }

  } catch (error) {
    console.error('Verify OTP error:', error.message);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// Reset Password endpoint (after OTP verification)
router.post('/reset-password', async (req, res) => {
  try {
    const { phone, email, newPassword } = req.body;

    if (!phone || !email || !newPassword) {
      return res.status(400).json({ message: 'Phone, email, and new password are required' });
    }

    // Check if OTP was verified for this phone
    const storedData = otpStore.get(phone);
    
    if (!storedData || !storedData.verified) {
      return res.status(403).json({ message: 'Please verify OTP first' });
    }

    // Check if OTP expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({ message: 'OTP session expired. Please start again.' });
    }

    // Find or create admin user
    let adminUser = await AdminUser.findOne({ email: email.toLowerCase() });

    if (adminUser) {
      // Update existing admin password
      adminUser.password = newPassword;
      await adminUser.save();
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Password updated for existing admin: ${email}`);
      }
    } else {
      // Create new admin user
      adminUser = new AdminUser({
        email: email.toLowerCase(),
        password: newPassword,
        phone: phone,
        role: email.includes('pushpendra') ? 'Super Admin' : 'Admin'
      });
      await adminUser.save();
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ New admin user created: ${email}`);
      }
    }

    // Clear OTP after successful password reset
    otpStore.delete(phone);

    res.json({
      success: true,
      message: 'Password reset successfully',
      email: email
    });

  } catch (error) {
    console.error('Reset Password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Test endpoint to check if OTP routes are working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'OTP Routes are working!',
    endpoints: ['/send-otp', '/verify-otp', '/reset-password'],
    storedOTPs: otpStore.size 
  });
});

// Clear expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phone);
    }
  }
}, 60000); // Clean up every minute

console.log('🚀 OTP Routes Initialized');

module.exports = router;

