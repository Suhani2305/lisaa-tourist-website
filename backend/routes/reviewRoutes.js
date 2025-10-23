const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
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

// Get reviews for a tour
router.get('/tour/:tourId', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    const query = { tour: req.params.tourId, isActive: true };
    
    if (rating) {
      query.rating = parseInt(rating);
    }

    const reviews = await Review.find(query)
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { tour: req.params.tourId, isActive: true } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      averageRating: avgRating[0] || { average: 0, count: 0 }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { tourId, bookingId, rating, title, comment, images } = req.body;

    // Check if user has already reviewed this tour
    const existingReview = await Review.findOne({ 
      user: req.user.userId, 
      tour: tourId 
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this tour' });
    }

    const review = new Review({
      user: req.user.userId,
      tour: tourId,
      booking: bookingId,
      rating,
      title,
      comment,
      images
    });

    await review.save();
    await review.populate('user', 'name profileImage');

    // Update tour rating
    await updateTourRating(tourId);

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update review
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { rating, title, comment, images } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    review.images = images;

    await review.save();
    await review.populate('user', 'name profileImage');

    // Update tour rating
    await updateTourRating(review.tour);

    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete review
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    review.isActive = false;
    await review.save();

    // Update tour rating
    await updateTourRating(review.tour);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark review as helpful
router.post('/:id/helpful', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user already marked this review as helpful
    if (review.helpful.users.includes(req.user.userId)) {
      return res.status(400).json({ message: 'You have already marked this review as helpful' });
    }

    review.helpful.users.push(req.user.userId);
    review.helpful.count += 1;
    await review.save();

    res.json({ message: 'Review marked as helpful', helpfulCount: review.helpful.count });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reviews
router.get('/my-reviews', authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.userId, isActive: true })
      .populate('tour', 'title destination images')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to update tour rating
async function updateTourRating(tourId) {
  try {
    const stats = await Review.aggregate([
      { $match: { tour: tourId, isActive: true } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
      await Tour.findByIdAndUpdate(tourId, {
        'rating.average': Math.round(stats[0].average * 10) / 10,
        'rating.count': stats[0].count
      });
    }
  } catch (error) {
    console.error('Update tour rating error:', error);
  }
}

module.exports = router;
