const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

// In-memory store for password reset OTPs
const passwordResetStore = new Map();
const registrationOtpStore = new Map();

const generateResetOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const isEmailIdentifier = (value = '') => value.includes('@');

const normalizePhone = (value = '') => value.replace(/\D/g, '');

const registrationOtpKey = (type, value) => `${type}:${value}`;

const cleanupExpiredOtpSessions = () => {
  const now = Date.now();
  for (const [key, session] of passwordResetStore.entries()) {
    if (now > session.expiresAt) {
      passwordResetStore.delete(key);
    }
  }
  for (const [key, session] of registrationOtpStore.entries()) {
    if (now > session.expiresAt) {
      registrationOtpStore.delete(key);
    }
  }
};

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedPhone = phone ? normalizePhone(phone) : "";

    const emailQuery = normalizedEmail ? { email: normalizedEmail } : null;
    const phoneQuery = normalizedPhone ? { phone: normalizedPhone } : null;

    const [existingEmailUser, existingPhoneUser] = await Promise.all([
      emailQuery ? User.findOne(emailQuery) : null,
      phoneQuery ? User.findOne(phoneQuery) : null,
    ]);

    if (existingEmailUser) {
      return res
        .status(400)
        .json({ message: 'An account already exists with this email. Please login.' });
    }

    if (existingPhoneUser) {
      return res
        .status(400)
        .json({ message: 'An account already exists with this mobile number. Please login.' });
    }

    if (normalizedEmail) {
      const emailSession = registrationOtpStore.get(registrationOtpKey('email', normalizedEmail));
      if (!emailSession || !emailSession.verified) {
        return res.status(400).json({ message: 'Please verify your email with OTP before registering.' });
      }
    }

    if (normalizedPhone) {
      const phoneSession = registrationOtpStore.get(registrationOtpKey('phone', normalizedPhone));
      if (!phoneSession || !phoneSession.verified) {
        return res.status(400).json({ message: 'Please verify your mobile number with OTP before registering.' });
      }
    }

    // Create new user
    const user = new User({
      name,
      email: normalizedEmail,
      password,
      phone: normalizedPhone || undefined,
    });

    await user.save();

    if (normalizedEmail) {
      registrationOtpStore.delete(registrationOtpKey('email', normalizedEmail));
    }
    if (normalizedPhone) {
      registrationOtpStore.delete(registrationOtpKey('phone', normalizedPhone));
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user (email or phone)
router.post('/login', async (req, res) => {
  try {
    const { identifier, email, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const rawIdentifier = (identifier || email || '').trim();
    if (!rawIdentifier) {
      return res.status(400).json({ message: 'Email or mobile number is required' });
    }

    let query = {};
    if (rawIdentifier.includes('@')) {
      query.email = rawIdentifier.toLowerCase();
    } else {
      const digits = rawIdentifier.replace(/\D/g, '');
      if (digits.length !== 10) {
        return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' });
      }
      query.phone = digits;
    }

    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).populate('bookings');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { name, phone, address, preferences, gender, profileImage, dateOfBirth, age } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (preferences) updateData.preferences = preferences;
    if (gender) updateData.gender = gender;
    if (profileImage) updateData.profileImage = profileImage;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    
    // Calculate age from dateOfBirth if provided
    if (dateOfBirth && !age) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      updateData.age = calculatedAge;
    } else if (age) {
      updateData.age = age;
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: user.toJSON() });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    
    // Populate booking stats for each user
    const Booking = require('../models/Booking');
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const userObj = user.toObject();
      const bookings = await Booking.find({ user: user._id });
      const totalBookings = bookings.length;
      const totalSpent = bookings.reduce((sum, booking) => {
        return sum + (booking.totalAmount || 0);
      }, 0);
      
      const lastBooking = bookings.length > 0 ? bookings[bookings.length - 1] : null;
      const lastActivity = lastBooking ? lastBooking.createdAt : user.createdAt;
      
      return {
        ...userObj,
        id: userObj._id.toString(),
        totalBookings,
        totalSpent,
        lastActivity
      };
    }));
    
    res.json(usersWithStats);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const Booking = require('../models/Booking');
    const bookings = await Booking.find({ user: user._id }).populate('tour', 'title destination');
    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    
    res.json({
      ...user.toObject(),
      id: user._id.toString(),
      totalBookings,
      totalSpent,
      bookings
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, address, preferences, gender, profileImage, isActive } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (preferences) updateData.preferences = preferences;
    if (gender) updateData.gender = gender;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request password reset (email or phone)
router.post('/request-password-reset', async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: 'Email or mobile number is required' });
    }

    const trimmedIdentifier = identifier.trim().toLowerCase();
    const identifierIsEmail = isEmailIdentifier(trimmedIdentifier);

    let query;
    let deliveryTarget;
    if (identifierIsEmail) {
      query = { email: trimmedIdentifier };
      deliveryTarget = trimmedIdentifier;
    } else {
      const numericPhone = normalizePhone(trimmedIdentifier);
      if (numericPhone.length !== 10) {
        return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' });
      }
      query = { phone: numericPhone };
      deliveryTarget = numericPhone;
    }

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email or mobile number' });
    }

    const otp = generateResetOTP();
    passwordResetStore.set(user._id.toString(), {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      verified: false,
      identifier: identifierIsEmail ? user.email : user.phone,
      method: identifierIsEmail ? 'email' : 'phone'
    });

    const response = {
      success: true,
      message: `OTP sent to your registered ${identifierIsEmail ? 'email address' : 'mobile number'}.`
    };

    if (process.env.NODE_ENV !== 'production') {
      response.demoOtp = otp;
    }

    try {
      if (identifierIsEmail) {
        if (typeof emailService.sendPasswordResetOtp === 'function') {
          await emailService.sendPasswordResetOtp(user.email, otp);
        } else {
          await emailService.sendOtpEmail(user.email, otp);
        }
      } else {
        await smsService.sendPasswordResetOtp(deliveryTarget, otp);
      }
    } catch (deliveryError) {
      console.error('OTP delivery error:', deliveryError);
      return res.status(500).json({ message: 'Failed to send OTP via the selected channel. Please try again.' });
    }

    res.json(response);
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({ message: 'Failed to start password reset. Please try again.' });
  }
});

// Verify OTP for password reset
router.post('/verify-password-reset', async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ message: 'Identifier and OTP are required' });
    }

    const trimmedIdentifier = identifier.trim().toLowerCase();
    const identifierIsEmail = isEmailIdentifier(trimmedIdentifier);
    const query = identifierIsEmail
      ? { email: trimmedIdentifier }
      : { phone: normalizePhone(trimmedIdentifier) };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: 'Account not found with that email or mobile number' });
    }

    const session = passwordResetStore.get(user._id.toString());
    if (!session) {
      return res.status(400).json({ message: 'OTP session not found. Please request a new OTP.' });
    }

    if (Date.now() > session.expiresAt) {
      passwordResetStore.delete(user._id.toString());
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (session.otp !== otp) {
      return res
        .status(400)
        .json({ message: 'Wrong OTP. Please enter it again or click resend OTP.' });
    }

    passwordResetStore.set(user._id.toString(), {
      ...session,
      verified: true
    });

    res.json({
      success: true,
      message: 'OTP verified successfully.'
    });
  } catch (error) {
    console.error('Verify password reset OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP. Please try again.' });
  }
});

// Reset password after OTP verification
router.post('/reset-password', async (req, res) => {
  try {
    const { identifier, newPassword } = req.body;

    if (!identifier || !newPassword) {
      return res.status(400).json({ message: 'Identifier and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const trimmedIdentifier = identifier.trim().toLowerCase();
    const identifierIsEmail = isEmailIdentifier(trimmedIdentifier);
    const query = identifierIsEmail
      ? { email: trimmedIdentifier }
      : { phone: normalizePhone(trimmedIdentifier) };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const session = passwordResetStore.get(user._id.toString());
    if (!session || !session.verified) {
      return res.status(403).json({ message: 'Please verify OTP before resetting password' });
    }

    if (Date.now() > session.expiresAt) {
      passwordResetStore.delete(user._id.toString());
      return res.status(400).json({ message: 'OTP session expired. Please start again.' });
    }

    user.password = newPassword;
    await user.save();

    passwordResetStore.delete(user._id.toString());

    res.json({
      success: true,
      message: 'Password updated successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password. Please try again.' });
  }
});

// Request OTP for registration verification
router.post('/request-registration-otp', async (req, res) => {
  try {
    const { identifier, type } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: 'Email or mobile number is required' });
    }

    const trimmedIdentifier = identifier.trim();
    const identifierIsEmail = type ? type === 'email' : isEmailIdentifier(trimmedIdentifier);

    let targetValue;
    let query;
    if (identifierIsEmail) {
      const normalizedEmail = trimmedIdentifier.toLowerCase();
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
      }
      targetValue = normalizedEmail;
      query = { email: normalizedEmail };
    } else {
      const numericPhone = normalizePhone(trimmedIdentifier);
      if (numericPhone.length !== 10) {
        return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' });
      }
      targetValue = numericPhone;
      query = { phone: numericPhone };
    }

    const existingUser = await User.findOne(query);
    if (existingUser) {
      return res.status(400).json({
        message: `An account already exists with this ${identifierIsEmail ? 'email' : 'mobile number'}. Please login.`,
      });
    }

    const otp = generateResetOTP();
    const key = registrationOtpKey(identifierIsEmail ? 'email' : 'phone', targetValue);
    registrationOtpStore.set(key, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      verified: false,
    });

    try {
      if (identifierIsEmail) {
        if (typeof emailService.sendRegistrationOtpEmail === 'function') {
          await emailService.sendRegistrationOtpEmail(targetValue, otp);
        } else {
          await emailService.sendOtpEmail(targetValue, otp);
        }
      } else {
        await smsService.sendPasswordResetOtp(targetValue, otp);
      }
    } catch (deliveryError) {
      registrationOtpStore.delete(key);
      console.error('Registration OTP delivery error:', deliveryError);
      return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }

    const response = {
      success: true,
      message: `OTP sent to your ${identifierIsEmail ? 'email address' : 'mobile number'}.`,
    };

    if (process.env.NODE_ENV !== 'production') {
      response.demoOtp = otp;
    }

    res.json(response);
  } catch (error) {
    console.error('Request registration OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

// Verify OTP for registration
router.post('/verify-registration-otp', async (req, res) => {
  try {
    const { identifier, otp, type } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ message: 'Identifier and OTP are required' });
    }

    const trimmedIdentifier = identifier.trim();
    const identifierIsEmail = type ? type === 'email' : isEmailIdentifier(trimmedIdentifier);
    const keyValue = identifierIsEmail ? trimmedIdentifier.toLowerCase() : normalizePhone(trimmedIdentifier);

    if (!identifierIsEmail && keyValue.length !== 10) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' });
    }

    const key = registrationOtpKey(identifierIsEmail ? 'email' : 'phone', keyValue);
    const session = registrationOtpStore.get(key);

    if (!session) {
      return res.status(400).json({ message: 'OTP session not found. Please request a new OTP.' });
    }

    if (Date.now() > session.expiresAt) {
      registrationOtpStore.delete(key);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (session.otp !== otp) {
      return res
        .status(400)
        .json({ message: 'Wrong OTP. Please enter it again or click resend OTP.' });
    }

    registrationOtpStore.set(key, {
      ...session,
      verified: true,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    res.json({ success: true, message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('Verify registration OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP. Please try again.' });
  }
});

// Periodically clean expired sessions
setInterval(cleanupExpiredOtpSessions, 60 * 1000);

module.exports = router;
