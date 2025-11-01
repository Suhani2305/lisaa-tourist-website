const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'City name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'City slug is required'],
    lowercase: true,
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    ref: 'State'
  },
  stateSlug: {
    type: String,
    required: [true, 'State slug is required']
  },
  description: {
    type: String,
    required: [true, 'City description is required']
  },
  shortDescription: {
    type: String,
    default: ''
  },
  heroImage: {
    type: String,
    default: ''
  },
  images: {
    type: [String],
    default: []
  },
  attractions: {
    type: [String],
    default: []
  },
  bestTimeToVisit: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metaTitle: {
    type: String,
    default: ''
  },
  metaDescription: {
    type: String,
    default: ''
  },
  metaKeywords: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for unique city within state
citySchema.index({ stateSlug: 1, slug: 1 }, { unique: true });
citySchema.index({ name: 'text', description: 'text', slug: 1 });

module.exports = mongoose.model('City', citySchema);

