const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');
const { authenticateAdmin, requireSuperadmin, requireAdmin } = require('../middleware/adminAuth');

// Get all admins (Superadmin and Admin can view)
router.get('/', authenticateAdmin, requireAdmin, async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    
    // Superadmin can see all (including Managers created by Admins)
    // Admin can see only Managers they created
    if (req.admin.role === 'Admin') {
      query.role = 'Manager';
      query.createdBy = req.adminId; // Admin can only see Managers they created
    }
    // Superadmin sees all - no filter needed
    
    if (role && req.admin.role === 'Superadmin') {
      // Superadmin can filter by role
      query.role = role;
    }

    const admins = await AdminUser.find(query)
      .select('-password')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
});

// Get single admin by ID
router.get('/:id', authenticateAdmin, requireAdmin, async (req, res) => {
  try {
    const admin = await AdminUser.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'name email role');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Admin can only view Managers, Superadmin can view all
    if (req.admin.role === 'Admin' && admin.role !== 'Manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ message: 'Failed to fetch admin' });
  }
});

// Create new Admin (Superadmin only)
router.post('/create-admin', authenticateAdmin, requireSuperadmin, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Name, email, password, and phone are required' });
    }

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const newAdmin = new AdminUser({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: 'Admin',
      createdBy: req.adminId
    });

    await newAdmin.save();

    res.status(201).json({
      message: 'Admin created successfully',
      admin: newAdmin.toJSON()
    });
  } catch (error) {
    console.error('Create admin error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({ 
        message: 'Validation error', 
        errors 
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Admin with this email already exists' 
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Failed to create admin',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create new Manager (Superadmin and Admin can create)
router.post('/create-manager', authenticateAdmin, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, assignedBookings, assignedInquiries } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Name, email, password, and phone are required' });
    }

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newManager = new AdminUser({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: 'Manager',
      createdBy: req.adminId,
      assignedData: {
        bookings: Array.isArray(assignedBookings) ? assignedBookings : [],
        inquiries: Array.isArray(assignedInquiries) ? assignedInquiries : []
      }
    });

    await newManager.save();

    res.status(201).json({
      message: 'Manager created successfully',
      manager: newManager.toJSON()
    });
  } catch (error) {
    console.error('Create manager error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({ 
        message: 'Validation error', 
        errors 
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Failed to create manager',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update admin/manager
router.put('/:id', authenticateAdmin, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, isActive, assignedBookings, assignedInquiries } = req.body;
    const adminId = req.params.id;

    const admin = await AdminUser.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Permission checks
    if (req.admin.role === 'Admin') {
      // Admin can only update Managers
      if (admin.role !== 'Manager') {
        return res.status(403).json({ message: 'Access denied. You can only update Managers.' });
      }
    }

    // Superadmin can update anyone, but can't change Superadmin role
    if (admin.role === 'Superadmin' && req.admin.role === 'Superadmin' && adminId !== req.adminId.toString()) {
      // Superadmin can't change other Superadmin's role
      if (req.body.role && req.body.role !== 'Superadmin') {
        return res.status(403).json({ message: 'Cannot change Superadmin role' });
      }
    }

    // Update fields
    if (name) admin.name = name;
    if (email) admin.email = email.toLowerCase();
    if (phone) admin.phone = phone;
    if (typeof isActive === 'boolean') admin.isActive = isActive;
    
    // Only update assignedData for Managers
    if (admin.role === 'Manager' || req.body.role === 'Manager') {
      if (assignedBookings !== undefined) admin.assignedData.bookings = assignedBookings;
      if (assignedInquiries !== undefined) admin.assignedData.inquiries = assignedInquiries;
    }

    await admin.save();

    res.json({
      message: 'Admin updated successfully',
      admin: admin.toJSON()
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ message: 'Failed to update admin' });
  }
});

// Delete admin/manager (Superadmin only for Admins, Admin can delete Managers)
router.delete('/:id', authenticateAdmin, requireAdmin, async (req, res) => {
  try {
    const adminId = req.params.id;

    // Can't delete yourself
    if (adminId === req.adminId.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const admin = await AdminUser.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Permission checks
    if (admin.role === 'Superadmin') {
      return res.status(403).json({ message: 'Cannot delete Superadmin account' });
    }

    if (req.admin.role === 'Admin' && admin.role === 'Admin') {
      return res.status(403).json({ message: 'Admin can only delete Managers' });
    }

    await AdminUser.findByIdAndDelete(adminId);

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Failed to delete admin' });
  }
});

// Get current admin profile
router.get('/profile/me', authenticateAdmin, async (req, res) => {
  try {
    const admin = await AdminUser.findById(req.adminId)
      .select('-password')
      .populate('createdBy', 'name email role');

    res.json(admin);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

module.exports = router;

