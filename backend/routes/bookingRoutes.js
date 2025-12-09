const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');
const { authenticateAdmin, requireManager, canAccessData } = require('../middleware/adminAuth');

// Middleware to verify JWT token (for regular users)
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

    // Send cancellation email
    try {
      const bookingWithUser = await Booking.findById(booking._id)
        .populate('user', 'name email')
        .populate('tour', 'title destination duration price images');
      
      if (bookingWithUser && bookingWithUser.user && bookingWithUser.user.email) {
        await emailService.sendBookingCancellationEmail({
          user: bookingWithUser.user,
          tour: bookingWithUser.tour,
          booking: bookingWithUser,
          bookingNumber: bookingWithUser.bookingNumber
        });
      }
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Don't fail the cancellation if email fails
    }

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

// Get all bookings (admin/manager only)
router.get('/admin/all', authenticateAdmin, requireManager, canAccessData, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let query = status ? { status } : {};

    // Filter for managers - only show assigned bookings
    if (req.admin.role === 'Manager') {
      const assignedBookingIds = req.admin.assignedData?.bookings || [];
      if (assignedBookingIds.length === 0) {
        // Manager has no assigned bookings
        return res.json({
          bookings: [],
          totalPages: 0,
          currentPage: parseInt(page),
          total: 0
        });
      }
      query._id = { $in: assignedBookingIds };
    }

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
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request booking modification
router.post('/:id/modify', authenticateToken, async (req, res) => {
  try {
    const { type, requestDetails, reason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('tour');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if booking can be modified
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot modify cancelled or completed booking' });
    }

    // Calculate price difference if applicable
    let priceDifference = 0;
    let requiresPayment = false;

    if (type === 'traveler_add' && requestDetails.travelerToAdd) {
      const tour = booking.tour;
      const traveler = requestDetails.travelerToAdd;
      if (traveler.type === 'adult') {
        priceDifference = tour.price?.adult || 0;
      } else if (traveler.type === 'child') {
        priceDifference = tour.price?.child || 0;
      } else if (traveler.type === 'infant') {
        priceDifference = tour.price?.infant || 0;
      }
      requiresPayment = priceDifference > 0;
    } else if (type === 'traveler_remove' && requestDetails.travelerToRemove) {
      // Calculate refund (negative price difference)
      const travelerToRemove = booking.travelers.id(requestDetails.travelerToRemove);
      if (travelerToRemove) {
        const tour = booking.tour;
        if (travelerToRemove.type === 'adult') {
          priceDifference = -(tour.price?.adult || 0);
        } else if (travelerToRemove.type === 'child') {
          priceDifference = -(tour.price?.child || 0);
        } else if (travelerToRemove.type === 'infant') {
          priceDifference = -(tour.price?.infant || 0);
        }
      }
    }

    // Create modification request
    const modificationRequest = {
      type,
      status: 'pending',
      requestedAt: new Date(),
      requestDetails: {
        ...requestDetails,
        reason: reason || requestDetails.reason || requestDetails.description
      },
      priceDifference,
      requiresPayment
    };

    booking.modificationRequests.push(modificationRequest);
    await booking.save();

    res.status(201).json({
      message: 'Modification request submitted successfully',
      request: modificationRequest,
      booking
    });
  } catch (error) {
    console.error('Request modification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update special requests (user can update directly)
router.put('/:id/special-requests', authenticateToken, async (req, res) => {
  try {
    const { specialRequests } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.specialRequests = specialRequests;
    await booking.save();

    res.json({
      message: 'Special requests updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update special requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get modification requests (admin/manager)
router.get('/admin/modification-requests', authenticateAdmin, requireManager, canAccessData, async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    
    // Build query with manager filtering
    let query = { 'modificationRequests.status': status };
    
    // Filter for managers - only show assigned bookings
    if (req.admin.role === 'Manager') {
      const assignedBookingIds = req.admin.assignedData?.bookings || [];
      if (assignedBookingIds.length === 0) {
        return res.json({ requests: [] });
      }
      query._id = { $in: assignedBookingIds };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('tour', 'title destination price')
      .select('bookingNumber user tour travelers travelDates pricing status modificationRequests');

    const requests = [];
    bookings.forEach(booking => {
      booking.modificationRequests.forEach(request => {
        if (request.status === status) {
          requests.push({
            id: request._id,
            bookingId: booking._id,
            bookingNumber: booking.bookingNumber,
            user: booking.user,
            tour: booking.tour,
            type: request.type,
            status: request.status,
            requestedAt: request.requestedAt,
            requestDetails: request.requestDetails,
            priceDifference: request.priceDifference,
            requiresPayment: request.requiresPayment
          });
        }
      });
    });

    // Sort by requestedAt (newest first)
    requests.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

    res.json({ requests });
  } catch (error) {
    console.error('Get modification requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject modification request (admin/manager)
router.put('/:bookingId/modify/:requestId', authenticateAdmin, requireManager, canAccessData, async (req, res) => {
  try {
    const { bookingId, requestId } = req.params;
    const { action, adminNotes } = req.body; // action: 'approve' or 'reject'

    const booking = await Booking.findById(bookingId).populate('tour');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if manager can access this booking
    if (req.admin.role === 'Manager') {
      const assignedBookingIds = req.admin.assignedData?.bookings || [];
      if (!assignedBookingIds.includes(bookingId)) {
        return res.status(403).json({ message: 'Access denied. This booking is not assigned to you.' });
      }
    }

    const request = booking.modificationRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Modification request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    if (action === 'approve') {
      request.status = 'approved';
      request.reviewedAt = new Date();
      request.reviewedBy = req.adminId; // Use adminId for admin routes
      request.requestDetails.adminNotes = adminNotes;

      // Apply the modification
      if (request.type === 'date_change') {
        if (request.requestDetails.newStartDate) {
          booking.travelDates.startDate = new Date(request.requestDetails.newStartDate);
        }
        if (request.requestDetails.newEndDate) {
          booking.travelDates.endDate = new Date(request.requestDetails.newEndDate);
        }
      } else if (request.type === 'traveler_add') {
        if (request.requestDetails.travelerToAdd) {
          booking.travelers.push(request.requestDetails.travelerToAdd);
          // Update pricing
          if (request.priceDifference > 0) {
            booking.pricing.totalAmount += request.priceDifference;
            booking.pricing.finalAmount += request.priceDifference;
          }
        }
      } else if (request.type === 'traveler_remove') {
        if (request.requestDetails.travelerToRemove) {
          booking.travelers.id(request.requestDetails.travelerToRemove).remove();
          // Update pricing
          if (request.priceDifference < 0) {
            booking.pricing.totalAmount += request.priceDifference; // priceDifference is negative
            booking.pricing.finalAmount += request.priceDifference;
          }
        }
      } else if (request.type === 'traveler_update') {
        if (request.requestDetails.travelerToUpdate) {
          const traveler = booking.travelers.id(request.requestDetails.travelerToUpdate.travelerId);
          if (traveler) {
            Object.assign(traveler, request.requestDetails.travelerToUpdate.updates);
          }
        }
      } else if (request.type === 'special_request') {
        if (request.requestDetails.newSpecialRequest) {
          booking.specialRequests = request.requestDetails.newSpecialRequest;
        }
      }

      await booking.save();

      res.json({
        message: 'Modification request approved and applied successfully',
        booking
      });
    } else if (action === 'reject') {
      request.status = 'rejected';
      request.reviewedAt = new Date();
      request.reviewedBy = req.adminId; // Use adminId for admin routes
      request.requestDetails.adminNotes = adminNotes;

      await booking.save();

      res.json({
        message: 'Modification request rejected',
        booking
      });
    } else {
      return res.status(400).json({ message: 'Invalid action. Use "approve" or "reject"' });
    }
  } catch (error) {
    console.error('Process modification request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (admin/manager)
router.put('/:id/status', authenticateAdmin, requireManager, canAccessData, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if manager can access this booking
    if (req.admin.role === 'Manager') {
      const assignedBookingIds = req.admin.assignedData?.bookings || [];
      if (!assignedBookingIds.includes(req.params.id)) {
        return res.status(403).json({ message: 'Access denied. This booking is not assigned to you.' });
      }
    }

    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment status (admin/manager)
router.put('/:id/payment-status', authenticateAdmin, requireManager, canAccessData, async (req, res) => {
  try {
    const { paymentStatus, transactionId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if manager can access this booking
    if (req.admin.role === 'Manager') {
      const assignedBookingIds = req.admin.assignedData?.bookings || [];
      if (!assignedBookingIds.includes(req.params.id)) {
        return res.status(403).json({ message: 'Access denied. This booking is not assigned to you.' });
      }
    }

    if (!booking.payment) {
      booking.payment = {};
    }

    booking.payment.status = paymentStatus;
    if (transactionId) {
      booking.payment.transactionId = transactionId;
    }
    booking.payment.updatedAt = new Date();

    await booking.save();

    res.json({ message: 'Payment status updated successfully', booking });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
