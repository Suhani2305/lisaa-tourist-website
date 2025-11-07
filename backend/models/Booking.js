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
  cancellationRefund: {
    refundable: Boolean,
    refundAmount: Number,
    refundPercentage: Number,
    cancellationFee: Number,
    totalPaid: Number,
    cancelledAt: Date,
    daysUntilTravel: Number
  },
  appliedCoupon: {
    code: String,
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer'
    },
    discountAmount: Number,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    discountValue: Number
  },
  notes: String,
  modificationRequests: [{
    type: {
      type: String,
      enum: ['date_change', 'traveler_add', 'traveler_remove', 'traveler_update', 'special_request', 'other'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requestDetails: {
      // For date change
      newStartDate: Date,
      newEndDate: Date,
      reason: String,
      // For traveler changes
      travelerToAdd: {
        name: String,
        age: Number,
        type: {
          type: String,
          enum: ['adult', 'child', 'infant']
        },
        gender: {
          type: String,
          enum: ['male', 'female', 'other']
        }
      },
      travelerToRemove: {
        type: mongoose.Schema.Types.ObjectId
      },
      travelerToUpdate: {
        travelerId: mongoose.Schema.Types.ObjectId,
        updates: {
          name: String,
          age: Number,
          type: String,
          gender: String
        }
      },
      // For special requests
      newSpecialRequest: String,
      // General
      description: String,
      adminNotes: String
    },
    priceDifference: {
      type: Number,
      default: 0
    },
    requiresPayment: {
      type: Boolean,
      default: false
    }
  }],
  reminderSent: {
    type: Boolean,
    default: false
  },
  followUpEmailSent: {
    type: Boolean,
    default: false
  }
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
