const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Tour = require('../models/Tour');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Get user's wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ user: req.user.userId })
      .populate('tour', 'title destination price images duration category')
      .sort({ createdAt: -1 });

    res.json(wishlists);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if tour is in wishlist
router.get('/check/:tourId', authenticateToken, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      user: req.user.userId,
      tour: req.params.tourId
    });

    res.json({ isInWishlist: !!wishlistItem });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to wishlist
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { tourId } = req.body;

    if (!tourId) {
      return res.status(400).json({ message: 'Tour ID is required' });
    }

    // Check if tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({
      user: req.user.userId,
      tour: tourId
    });

    if (existingWishlist) {
      return res.status(400).json({ message: 'Tour already in wishlist' });
    }

    // Create wishlist item
    const wishlist = new Wishlist({
      user: req.user.userId,
      tour: tourId
    });

    await wishlist.save();
    await wishlist.populate('tour', 'title destination price images duration category');

    res.status(201).json({
      message: 'Tour added to wishlist',
      wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Tour already in wishlist' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from wishlist
router.delete('/:tourId', authenticateToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndDelete({
      user: req.user.userId,
      tour: req.params.tourId
    });

    if (!wishlist) {
      return res.status(404).json({ message: 'Tour not found in wishlist' });
    }

    res.json({ message: 'Tour removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear all wishlist items
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await Wishlist.deleteMany({ user: req.user.userId });

    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

