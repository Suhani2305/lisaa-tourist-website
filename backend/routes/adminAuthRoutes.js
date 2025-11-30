const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
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

    // Update last login and normalize role/name if needed
    adminUser.lastLogin = new Date();
    
    // Normalize role if it's legacy value
    if (adminUser.role === 'Super Admin') {
      adminUser.role = 'Superadmin';
    }
    
    // Ensure name is set
    if (!adminUser.name && adminUser.email) {
      const emailName = adminUser.email.split('@')[0];
      adminUser.name = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    await adminUser.save();

    // Normalize role for response (ensure it's not legacy value)
    const normalizedRole = adminUser.role === 'Super Admin' ? 'Superadmin' : adminUser.role;

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: adminUser._id, 
        email: adminUser.email,
        role: normalizedRole
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log(`✅ Admin logged in successfully: ${email} (${normalizedRole})`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        _id: adminUser._id,
        name: adminUser.name || (adminUser.email ? adminUser.email.split('@')[0].charAt(0).toUpperCase() + adminUser.email.split('@')[0].slice(1) : 'Admin User'),
        email: adminUser.email,
        role: normalizedRole,
        phone: adminUser.phone
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

