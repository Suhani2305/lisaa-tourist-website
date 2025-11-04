const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Media name is required'],
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'document'],
    required: true
  },
  category: {
    type: String,
    enum: ['Destinations', 'Tours', 'Events', 'Testimonials', 'Marketing', 'Other'],
    default: 'Other'
  },
  size: {
    type: Number, // Size in bytes
    default: 0
  },
  dimensions: {
    type: String, // e.g., "1920x1080"
    default: ''
  },
  format: {
    type: String, // e.g., "JPEG", "MP4", "PDF"
    default: ''
  },
  url: {
    type: String,
    required: [true, 'Media URL is required']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploadedBy: {
    type: String,
    default: 'Admin'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
mediaSchema.index({ type: 1, category: 1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ isActive: 1 });

module.exports = mongoose.model('Media', mediaSchema);

