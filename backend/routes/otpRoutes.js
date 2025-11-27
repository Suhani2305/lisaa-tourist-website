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

// Allowed admin emails and phone numbers for password reset
const ALLOWED_ADMIN_EMAILS = [
  'pushpendrarawat868@gmail.com',
  'lsiaatech@gmail.com',
  'vp312600@gmail.com'
];

const ALLOWED_ADMIN_PHONES = [
  '9263616263',
  '8840206492',
  '9815381382'
];

const ADMIN_EMAIL_TO_PHONE = {
  'pushpendrarawat868@gmail.com': '9815381382',
  'lsiaatech@gmail.com': '9263616263',
  'vp312600@gmail.com': '8840206492'
};

const ADMIN_PHONE_TO_EMAIL = Object.entries(ADMIN_EMAIL_TO_PHONE).reduce(
  (acc, [email, phone]) => {
    if (phone) acc[phone] = email;
    return acc;
  },
  {}
);

const storeOtpSession = (session) => {
  session.keys = [];
  if (session.phone) {
    session.keys.push(session.phone);
    otpStore.set(session.phone, session);
  }
  if (session.email) {
    session.keys.push(session.email);
    otpStore.set(session.email, session);
  }
};

const deleteOtpSession = (session) => {
  if (!session?.keys) return;
  for (const key of session.keys) {
    otpStore.delete(key);
  }
};

const findOtpSession = (keys = []) => {
  for (const key of keys) {
    if (!key) continue;
    const session = otpStore.get(key);
    if (session) {
      return { session, key };
    }
  }
  return { session: null, key: null };
};

// Send OTP via SMS (Fast2SMS, MSG91, or Twilio)
const sendSMS = async (phone, otp) => {
  try {
    const smsProvider = process.env.SMS_PROVIDER || 'fast2sms'; // 'fast2sms', 'msg91', or 'twilio'
    const digits = phone.replace(/\D/g, "");
    const phoneNumber = digits; // Use 10-digit number for Indian providers
    
    // Option 1: Fast2SMS Integration
    if ((smsProvider === 'fast2sms' || !process.env.TWILIO_ACCOUNT_SID) && process.env.FAST2SMS_API_KEY) {
      try {
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
            numbers: phoneNumber
          })
        });
        
        const result = await response.json();
        
        if (result.return === true) {
          console.log('✅ OTP sent via Fast2SMS to:', phoneNumber);
          return { success: true, message: 'OTP sent successfully', provider: 'Fast2SMS' };
        } else {
          throw new Error(result.message || 'Failed to send SMS via Fast2SMS');
        }
      } catch (fast2smsError) {
        console.warn('⚠️ Fast2SMS failed, trying other providers:', fast2smsError.message);
        // Continue to try other providers
      }
    }
    
    // Option 2: MSG91 Integration
    if (process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
      try {
        const response = await fetch(
          `https://api.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=${phoneNumber}&authkey=${process.env.MSG91_AUTH_KEY}&otp=${otp}`,
          { method: 'POST' }
        );
        
        const result = await response.json();
        
        if (result.type === 'success') {
          console.log('✅ OTP sent via MSG91 to:', phoneNumber);
          return { success: true, message: 'OTP sent successfully', provider: 'MSG91' };
        } else {
          throw new Error(result.message || 'Failed to send SMS via MSG91');
        }
      } catch (msg91Error) {
        console.warn('⚠️ MSG91 failed, trying Twilio:', msg91Error.message);
        // Continue to try Twilio
      }
    }
    
    // Option 3: Twilio Integration
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        const twilio = require('twilio');
        const twilioClient = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
        
        let formattedPhone = phone;
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = `+91${digits}`;
        }
        
        const smsBody = `Your OTP for Lisaa Tourist Admin Login is: ${otp}. Valid for 5 minutes.`;
        
        const twilioMessage = await twilioClient.messages.create({
          body: smsBody,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: formattedPhone,
        });
        
        console.log('✅ OTP sent via Twilio to:', formattedPhone, 'SID:', twilioMessage.sid);
        return { success: true, message: 'OTP sent successfully', provider: 'Twilio', sid: twilioMessage.sid };
      } catch (twilioError) {
        console.warn('⚠️ Twilio failed:', twilioError.message);
        // Continue to fallback
      }
    }
    
    // No SMS provider configured - throw error
    throw new Error('SMS provider not configured. Please set FAST2SMS_API_KEY, MSG91 credentials, or Twilio credentials in environment variables.');
    
  } catch (error) {
    console.error('SMS sending error:', error.message);
    throw error;
  }
};

// Send OTP endpoint (supports email OR phone)
router.post('/send-otp', async (req, res) => {
  try {
    const { phone, email, method } = req.body; // method: 'email' or 'phone'

    // Determine if using email or phone
    const useEmail = method === 'email' || (email && !phone);
    const usePhone = method === 'phone' || (!email && phone);

    if (!useEmail && !usePhone) {
      return res.status(400).json({ message: 'Either email or phone number is required' });
    }

    let normalizedEmail = null;
    let normalizedPhone = null;

    // Handle email method
    if (useEmail) {
      if (!email) {
        return res.status(400).json({ message: 'Email is required for email method' });
      }
      
      normalizedEmail = email.trim().toLowerCase();
      
      // Validate it's an allowed admin email
      if (!ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)) {
        return res.status(403).json({ message: 'This email is not authorized for admin password reset. Only admin emails are allowed.' });
      }
    }

    // Handle phone method
    if (usePhone) {
      if (!phone) {
        return res.status(400).json({ message: 'Phone number is required for phone method' });
      }

      // Validate phone number format (10 digits for India)
      const phoneRegex = /^[6-9]\d{9}$/;
      normalizedPhone = phone.replace(/\D/g, "");
      
      if (!phoneRegex.test(normalizedPhone)) {
        return res.status(400).json({ message: 'Invalid phone number format. Please enter a valid 10-digit Indian mobile number.' });
      }

      // Validate phone number is in allowed list
      if (!ALLOWED_ADMIN_PHONES.includes(normalizedPhone)) {
        return res.status(403).json({ message: 'This phone number is not authorized for admin password reset. Only admin phone numbers are allowed.' });
      }
    }

    // Derive linked identifiers (email<->phone) if available
    if (usePhone && !normalizedEmail) {
      normalizedEmail = ADMIN_PHONE_TO_EMAIL[normalizedPhone] || null;
    }
    if (useEmail && !normalizedPhone) {
      normalizedPhone = ADMIN_EMAIL_TO_PHONE[normalizedEmail] || null;
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP - use email or phone as key
    const session = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      email: normalizedEmail,
      phone: normalizedPhone,
      method: useEmail ? 'email' : 'phone',
      verified: false
    };
    storeOtpSession(session);

    let deliveryResult = null;
    let responseMessage = '';

    // Send OTP via email
    if (useEmail) {
      try {
        const emailService = require('../services/emailService');
        
        // Check if email service is available
        if (!emailService || (typeof emailService.sendPasswordResetOtp !== 'function' && typeof emailService.sendOtpEmail !== 'function')) {
          deleteOtpSession(session);
          return res.status(500).json({ 
            message: 'Email service is not configured. Please configure EMAIL_USER and EMAIL_PASSWORD in server environment variables.' 
          });
        }
        
        // Send email OTP
        try {
          if (typeof emailService.sendPasswordResetOtp === 'function') {
            await emailService.sendPasswordResetOtp(normalizedEmail, otp);
          } else {
            await emailService.sendOtpEmail(normalizedEmail, otp);
          }
          deliveryResult = { provider: 'email' };
          responseMessage = `OTP sent successfully to ${normalizedEmail}`;
          console.log(`✅ Admin Password Reset OTP sent via email to: ${normalizedEmail}`);
        } catch (emailError) {
          console.error('Email sending error:', emailError);
          deleteOtpSession(session);
          return res.status(500).json({ 
            message: `Failed to send OTP email: ${emailError.message || 'Unknown error'}. Please check email service configuration.` 
          });
        }
      } catch (error) {
        console.error('Email service error:', error);
        deleteOtpSession(session);
        return res.status(500).json({ 
          message: `Email service error: ${error.message || 'Unknown error'}. Please check email service configuration.` 
        });
      }
    }

    // Send OTP via SMS
    if (usePhone) {
      try {
        const smsResult = await sendSMS(normalizedPhone, otp);
        deliveryResult = smsResult;
        responseMessage = `OTP sent successfully to ${normalizedPhone}`;
        
        console.log(`✅ Admin Password Reset OTP sent successfully to ${normalizedPhone} via ${smsResult.provider || 'SMS'}`);
      } catch (smsError) {
        console.error('SMS sending error:', smsError);
        deleteOtpSession(session);
        return res.status(500).json({ 
          message: `Failed to send OTP SMS: ${smsError.message || 'Unknown error'}. Please check SMS service configuration (Twilio, Fast2SMS, or MSG91).` 
        });
      }
    }

    // Response
    const response = { 
      success: true, 
      message: responseMessage,
      method: useEmail ? 'email' : 'phone'
    };

    res.json(response);

  } catch (error) {
    console.error('Send OTP error:', error.message);
    res.status(500).json({ 
      message: error.message || 'Failed to send OTP. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify OTP endpoint (supports email OR phone)
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, email, otp, method } = req.body;

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    // Determine if using email or phone
    const useEmail = method === 'email' || (email && !phone);
    const usePhone = method === 'phone' || (!email && phone);

    if (!useEmail && !usePhone) {
      return res.status(400).json({ message: 'Either email or phone is required' });
    }

    let storeKey = null;
    let normalizedEmail = null;
    let normalizedPhone = null;

    // Handle email method
    if (useEmail) {
      if (!email) {
        return res.status(400).json({ message: 'Email is required for email method' });
      }
      normalizedEmail = email.trim().toLowerCase();
      
      // Validate it's an allowed admin email
      if (!ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)) {
        return res.status(403).json({ message: 'This email is not authorized for admin password reset.' });
      }
      
      storeKey = normalizedEmail;
    }

    // Handle phone method
    if (usePhone) {
      if (!phone) {
        return res.status(400).json({ message: 'Phone is required for phone method' });
      }
      
      normalizedPhone = phone.replace(/\D/g, "");
      
      // Validate phone number is in allowed list
      if (!ALLOWED_ADMIN_PHONES.includes(normalizedPhone)) {
        return res.status(403).json({ message: 'This phone number is not authorized for admin password reset.' });
      }
      
      storeKey = normalizedPhone;
    }

    // Get stored OTP
    const { session: storedData, key: matchedKey } = findOtpSession(
      [storeKey, normalizedPhone, normalizedEmail]
    );

    if (!storedData) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`❌ No OTP found for ${useEmail ? 'email' : 'phone'}: ${storeKey}`);
      }
      return res.status(400).json({ message: 'OTP not found or expired. Please request a new OTP.' });
    }

    // Check if expired
    if (Date.now() > storedData.expiresAt) {
      deleteOtpSession(storedData);
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏰ OTP expired for ${useEmail ? 'email' : 'phone'}: ${storeKey}`);
      }
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    // Convert both to string for comparison
    const enteredOTP = String(otp).trim();
    const storedOTP = String(storedData.otp).trim();

    // Verify OTP
    if (storedOTP === enteredOTP) {
      // Mark as verified but keep in store for password reset
      storedData.verified = true;
      storedData.verifiedAt = Date.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ OTP Verified Successfully for ${useEmail ? 'email' : 'phone'}: ${storeKey}`);
      }
      
      return res.json({ 
        success: true, 
        message: 'OTP verified successfully',
        verified: true,
        method: useEmail ? 'email' : 'phone'
      });
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log(`❌ Invalid OTP for ${useEmail ? 'email' : 'phone'}: ${storeKey}`);
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
    const { phone, email, newPassword, method } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    // Validate email is in allowed list (email is always required)
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)) {
      return res.status(403).json({ message: 'This email is not authorized for admin password reset. Only admin emails are allowed.' });
    }

    const usePhone = method === 'phone' || (!email && phone);
    let normalizedPhone = null;

    if (usePhone) {
      if (!phone) {
        return res.status(400).json({ message: 'Phone number is required for phone method' });
      }
      normalizedPhone = phone.replace(/\D/g, "");
      if (!ALLOWED_ADMIN_PHONES.includes(normalizedPhone)) {
        return res.status(403).json({ message: 'This phone number is not authorized for admin password reset.' });
      }
    }

    const { session: storedSession } = findOtpSession([
      normalizedEmail,
      normalizedPhone
    ]);

    if (!storedSession || !storedSession.verified) {
      return res.status(403).json({ message: 'Please verify OTP first' });
    }

    if (Date.now() > storedSession.expiresAt) {
      deleteOtpSession(storedSession);
      return res.status(400).json({ message: 'OTP session expired. Please start again.' });
    }

    if (storedSession.email && storedSession.email !== normalizedEmail) {
      return res.status(403).json({ message: 'Email does not match the one used for OTP request.' });
    }

    const sessionPhone = normalizedPhone || storedSession.phone || ADMIN_EMAIL_TO_PHONE[normalizedEmail] || null;

    // Find or create admin user
    let adminUser = await AdminUser.findOne({ email: normalizedEmail });

    if (adminUser) {
      // Update existing admin password
      adminUser.password = newPassword;
      if (normalizedPhone) {
        adminUser.phone = normalizedPhone;
      }
      await adminUser.save();
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Password updated for existing admin: ${normalizedEmail}`);
      }
    } else {
      // Create new admin user
      adminUser = new AdminUser({
        email: normalizedEmail,
        password: newPassword,
        phone: normalizedPhone || storedSession.phone || null,
        role: normalizedEmail.includes('pushpendra') ? 'Super Admin' : 'Admin'
      });
      await adminUser.save();
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ New admin user created: ${normalizedEmail}`);
      }
    }

    // Clear OTP after successful password reset
    deleteOtpSession(storedSession);

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
  const processedSessions = new WeakSet();
  for (const [, data] of otpStore.entries()) {
    if (!data || processedSessions.has(data)) continue;
    processedSessions.add(data);
    if (now > data.expiresAt) {
      deleteOtpSession(data);
    }
  }
}, 60000); // Clean up every minute

console.log('🚀 OTP Routes Initialized');

module.exports = router;

