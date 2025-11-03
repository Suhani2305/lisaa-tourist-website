const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Tour is required']
  },
  bookingNumber: {
    type: String,
    unique: true,
    required: true
  },
  travelers: [{
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true,
      min: [0, 'Age cannot be negative']
    },
    type: {
      type: String,
      enum: ['adult', 'child', 'infant'],
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    }
  }],
  contactInfo: {
    email: {
      type: String,
      required: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  travelDates: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    taxes: {
      type: Number,
      default: 0
    },
    finalAmount: {
      type: Number,
      required: true
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['credit-card', 'debit-card', 'net-banking', 'upi', 'wallet', 'cash'],
      required: true
    },
    transactionId: String,
    paymentDate: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  cancellationPolicy: {
    canCancel: {
      type: Boolean,
      default: true
    },
    cancellationDeadline: Date,
    refundPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  notes: String
}, {
  timestamps: true
});

// Generate booking number before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const count = await this.constructor.countDocuments();
    this.bookingNumber = `TB${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Index for efficient queries
// Note: bookingNumber already has unique: true which creates an index automatically
bookingSchema.index({ user: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'travelDates.startDate': 1 });

module.exports = mongoose.model('Booking', bookingSchema);
