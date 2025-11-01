const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`🔐 Admin Login Attempt: ${email}`);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin user
    const adminUser = await AdminUser.findOne({ email: email.toLowerCase() });

    if (!adminUser) {
      console.log(`❌ Admin not found: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if admin is active
    if (!adminUser.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isMatch = await adminUser.comparePassword(password);

    if (!isMatch) {
      console.log(`❌ Invalid password for: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    adminUser.lastLogin = new Date();
    await adminUser.save();

    console.log(`✅ Admin logged in successfully: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      admin: {
        email: adminUser.email,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Get all admins (for reference)
router.get('/admins', async (req, res) => {
  try {
    const admins = await AdminUser.find({ isActive: true }).select('-password');
    res.json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
});

module.exports = router;

