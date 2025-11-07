const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Offer title is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Offer code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
    default: 'percentage'
  },
  value: {
    type: Number,
    required: [true, 'Offer value is required'],
    min: [0, 'Offer value must be positive']
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  minAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  applicableToAll: {
    type: Boolean,
    default: false // If true, applies to all packages
  },
  applicableTours: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  }],
  applicableCities: [{
    type: String // City names or slugs
  }],
  applicableStates: [{
    type: String // State names or slugs
  }],
  customerTiers: [{
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum']
  }],
  image: {
    type: String,
    default: ''
  },
  terms: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Note: code field already has unique: true which creates an index automatically
// No need to manually create index for code

// Index for active offers
offerSchema.index({ status: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Offer', offerSchema);

