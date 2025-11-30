const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

// Verify admin JWT token
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Verify admin exists and is active
    const admin = await AdminUser.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive admin account.' });
    }

    req.admin = admin;
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Check if admin has specific role(s)
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
};

// Superadmin only
const requireSuperadmin = requireRole('Superadmin');

// Admin or Superadmin
const requireAdmin = requireRole('Superadmin', 'Admin');

// Manager, Admin, or Superadmin
const requireManager = requireRole('Superadmin', 'Admin', 'Manager');

// Check if admin can access specific data (for managers)
const canAccessData = async (req, res, next) => {
  if (req.admin.role === 'Superadmin' || req.admin.role === 'Admin') {
    // Superadmin and Admin can access all data
    return next();
  }

  // Manager can only access assigned data
  if (req.admin.role === 'Manager') {
    // This will be checked in individual routes
    req.isManager = true;
    req.assignedData = req.admin.assignedData;
  }

  next();
};

module.exports = {
  authenticateAdmin,
  requireRole,
  requireSuperadmin,
  requireAdmin,
  requireManager,
  canAccessData
};

