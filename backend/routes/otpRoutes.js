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
    // Option 1: Fast2SMS Integration
    // Uncomment and add your API key
    /*
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': 'YOUR_FAST2SMS_API_KEY',
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
    */

    // Option 2: MSG91 Integration
    // Uncomment and add your API key
    /*
    const response = await fetch(`https://api.msg91.com/api/v5/otp?template_id=YOUR_TEMPLATE_ID&mobile=${phone}&authkey=YOUR_AUTH_KEY&otp=${otp}`, {
      method: 'POST'
    });
    return await response.json();
    */

    // For now, just log (demo mode)
    console.log(`SMS sent to ${phone}: OTP = ${otp}`);
    return { success: true, message: 'OTP sent successfully' };
    
  } catch (error) {
    console.error('SMS sending error:', error);
    throw error;
  }
};

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  console.log('🔵 /api/otp/send-otp endpoint HIT');
  try {
    const { phone } = req.body;
    console.log('📞 Received phone number:', phone);

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Validate phone number
    const allowedPhones = ['9263616263', '8840206492'];
    if (!allowedPhones.includes(phone)) {
      return res.status(403).json({ message: 'Unauthorized phone number' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiry (5 minutes)
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Send SMS
    await sendSMS(phone, otp);

    console.log(`✅ OTP Generated for ${phone}: ${otp}`);
    console.log(`📝 OTP stored in memory, expires in 5 minutes`);

    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      // In production, don't send OTP in response
      // Only for demo/development:
      demo_otp: otp 
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint  
router.post('/verify-otp', async (req, res) => {
  console.log('🔵 /api/otp/verify-otp endpoint HIT');
  try {
    const { phone, otp } = req.body;

    console.log(`🔍 Verify OTP Request:`, { phone, otp, type: typeof otp });

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    // Get stored OTP
    const storedData = otpStore.get(phone);

    console.log(`📦 Stored OTP Data:`, storedData);

    if (!storedData) {
      console.log(`❌ No OTP found for phone: ${phone}`);
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    // Check if expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(phone);
      console.log(`⏰ OTP expired for phone: ${phone}`);
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Convert both to string for comparison
    const enteredOTP = String(otp).trim();
    const storedOTP = String(storedData.otp).trim();

    console.log(`🔑 Comparing OTPs:`, { 
      entered: enteredOTP, 
      stored: storedOTP, 
      match: enteredOTP === storedOTP 
    });

    // Verify OTP
    if (storedOTP === enteredOTP) {
      // Mark phone as verified but keep in store for password reset
      otpStore.set(phone, {
        otp: storedData.otp,
        expiresAt: storedData.expiresAt,
        verified: true // Add verified flag
      });
      
      console.log(`✅ OTP Verified Successfully for phone: ${phone}`);
      return res.json({ 
        success: true, 
        message: 'OTP verified successfully',
        verified: true
      });
    } else {
      console.log(`❌ Invalid OTP. Stored: ${storedOTP}, Entered: ${enteredOTP}`);
      return res.status(400).json({ 
        message: 'Invalid OTP',
        debug: `Expected: ${storedOTP}, Got: ${enteredOTP}` // Only for demo
      });
    }

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// Reset Password endpoint (after OTP verification)
router.post('/reset-password', async (req, res) => {
  console.log('🔵 /api/otp/reset-password endpoint HIT');
  try {
    const { phone, email, newPassword } = req.body;

    console.log(`🔐 Password Reset Request:`, { phone, email });

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
      console.log(`✅ Password updated for existing admin: ${email}`);
    } else {
      // Create new admin user
      adminUser = new AdminUser({
        email: email.toLowerCase(),
        password: newPassword,
        phone: phone,
        role: email.includes('pushpendra') ? 'Super Admin' : 'Admin'
      });
      await adminUser.save();
      console.log(`✅ New admin user created: ${email}`);
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

