const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Tour is required']
  }
}, {
  timestamps: true
});

// Ensure one entry per user per tour
wishlistSchema.index({ user: 1, tour: 1 }, { unique: true });

// Index for efficient queries
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ tour: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);

