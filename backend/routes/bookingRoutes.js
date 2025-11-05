const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
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

// Create booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { tourId, travelers, contactInfo, travelDates, specialRequests } = req.body;

    // Get tour details
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Calculate pricing
    let totalAmount = 0;
    travelers.forEach(traveler => {
      if (traveler.type === 'adult') {
        totalAmount += tour.price.adult;
      } else if (traveler.type === 'child') {
        totalAmount += tour.price.child;
      } else if (traveler.type === 'infant') {
        totalAmount += tour.price.infant;
      }
    });

    const booking = new Booking({
      user: req.user.userId,
      tour: tourId,
      travelers,
      contactInfo,
      travelDates,
      specialRequests,
      pricing: {
        basePrice: totalAmount,
        totalAmount: totalAmount,
        finalAmount: totalAmount
      }
    });

    await booking.save();
    await booking.populate('tour', 'title destination price images');

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user bookings (alias for /my-bookings)
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('tour', 'title destination price images')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('tour', 'title destination price images')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single booking (Must be AFTER /user and /my-bookings routes)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('tour', 'title destination price images itinerary');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('tour');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed booking' });
    }

    // Calculate refund based on cancellation policy
    const now = new Date();
    const travelStartDate = new Date(booking.travelDates.startDate);
    const daysUntilTravel = Math.ceil((travelStartDate - now) / (1000 * 60 * 60 * 24));
    
    let refundAmount = 0;
    let refundPercentage = 0;
    let cancellationFee = 0;
    let refundable = false;

    // Check cancellation deadline
    const cancellationDeadline = booking.cancellationPolicy?.cancellationDeadline 
      ? new Date(booking.cancellationPolicy.cancellationDeadline)
      : null;

    if (booking.cancellationPolicy?.canCancel) {
      // Calculate refund based on days until travel
      if (daysUntilTravel > 30) {
        // More than 30 days: Full refund (100%)
        refundPercentage = 100;
        refundable = true;
      } else if (daysUntilTravel > 15) {
        // 15-30 days: 75% refund
        refundPercentage = 75;
        refundable = true;
      } else if (daysUntilTravel > 7) {
        // 7-15 days: 50% refund
        refundPercentage = 50;
        refundable = true;
      } else if (daysUntilTravel > 0) {
        // 0-7 days: 25% refund
        refundPercentage = 25;
        refundable = true;
      } else {
        // Past travel date or same day: No refund
        refundPercentage = 0;
        refundable = false;
      }

      // Override with booking-specific policy if available
      if (booking.cancellationPolicy?.refundPercentage !== undefined) {
        refundPercentage = booking.cancellationPolicy.refundPercentage;
        refundable = refundPercentage > 0;
      }

      // Check if past cancellation deadline
      if (cancellationDeadline && now > cancellationDeadline) {
        refundPercentage = 0;
        refundable = false;
      }

      // Calculate amounts
      const totalPaid = booking.pricing?.finalAmount || booking.totalAmount || 0;
      refundAmount = Math.round((totalPaid * refundPercentage) / 100);
      cancellationFee = totalPaid - refundAmount;
    }

    // Update booking status
    booking.status = 'cancelled';
    
    // Update payment status if refund is applicable
    if (refundable && refundAmount > 0 && booking.payment?.status === 'paid') {
      booking.payment.status = 'refunded';
    }

    // Store refund information
    booking.cancellationRefund = {
      refundable,
      refundAmount,
      refundPercentage,
      cancellationFee,
      totalPaid,
      cancelledAt: now,
      daysUntilTravel
    };

    await booking.save();

    res.json({ 
      message: 'Booking cancelled successfully', 
      booking,
      refund: {
        refundable,
        refundAmount,
        refundPercentage,
        cancellationFee,
        totalPaid
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings (admin only)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('tour', 'title destination')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
