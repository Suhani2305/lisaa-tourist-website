const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'State name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'State slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'State description is required']
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
  capital: {
    type: String,
    default: ''
  },
  area: {
    type: String,
    default: ''
  },
  population: {
    type: String,
    default: ''
  },
  languages: {
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
  },
  region: {
    type: String,
    enum: ['North', 'South', 'East', 'West', 'Northeast', 'Central', 'Other'],
    default: 'Other'
  }
}, {
  timestamps: true
});

// Create index for search
stateSchema.index({ name: 'text', description: 'text', slug: 1 });

module.exports = mongoose.model('State', stateSchema);

