const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // Made optional temporarily for migration
    trim: true,
    default: function() {
      // Auto-generate name from email if not provided
      if (this.email) {
        const emailName = this.email.split('@')[0];
        return emailName.charAt(0).toUpperCase() + emailName.slice(1);
      }
      return 'Admin User';
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    default: 'Admin',
    enum: ['Superadmin', 'Admin', 'Manager'] // Legacy 'Super Admin' is normalized in pre-save hook
  },
  phone: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    default: null
  },
  assignedData: {
    bookings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }],
    inquiries: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inquiry'
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Normalize role and ensure name is set before saving
adminUserSchema.pre('save', async function(next) {
  // Normalize legacy role values
  if (this.role === 'Super Admin') {
    this.role = 'Superadmin';
  }
  
  // Ensure name is set
  if (!this.name && this.email) {
    const emailName = this.email.split('@')[0];
    this.name = emailName.charAt(0).toUpperCase() + emailName.slice(1);
  } else if (!this.name) {
    this.name = 'Admin User';
  }
  
  // Ensure assignedData is initialized for Managers
  if (this.role === 'Manager' && !this.assignedData) {
    this.assignedData = {
      bookings: [],
      inquiries: []
    };
  }
  
  next();
});

// Hash password before saving
adminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
adminUserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
adminUserSchema.methods.toJSON = function() {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

module.exports = mongoose.model('AdminUser', adminUserSchema);

