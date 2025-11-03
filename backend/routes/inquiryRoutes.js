const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');
const Tour = require('../models/Tour');
const jwt = require('jsonwebtoken');
const { sendInquiryReplyEmail } = require('../services/emailService');

// Middleware to verify JWT token (for admin routes)
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

// Public route - Create inquiry (Contact Form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, interestedTour } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create inquiry
    // Handle interestedTour - convert empty string to null, validate ObjectId if provided
    let tourId = null;
    if (interestedTour && interestedTour !== '') {
      if (mongoose.Types.ObjectId.isValid(interestedTour)) {
        tourId = interestedTour;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid tour ID format'
        });
      }
    }

    const inquiry = new Inquiry({
      name,
      email,
      phone,
      subject,
      message,
      interestedTour: tourId,
      status: 'new',
      priority: 'medium',
      source: 'website'
    });

    await inquiry.save();

    console.log('✅ New inquiry created:', inquiry._id);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      inquiryId: inquiry._id
    });
  } catch (error) {
    console.error('❌ Create inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry. Please try again.',
      error: error.message
    });
  }
});

// Admin route - Get all inquiries
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 50 } = req.query;

    // Build query
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const inquiries = await Inquiry.find(query)
      .populate('interestedTour', 'title destination duration price')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * parseInt(limit));

    const total = await Inquiry.countDocuments(query);

    res.json({
      success: true,
      inquiries,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('❌ Get inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries',
      error: error.message
    });
  }
});

// Admin route - Get single inquiry
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('interestedTour', 'title destination duration price');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      inquiry
    });
  } catch (error) {
    console.error('❌ Get inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiry',
      error: error.message
    });
  }
});

// Admin route - Update inquiry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      status,
      priority,
      assignedTo,
      notes,
      followUpDate,
      tags,
      interestedTour,
      budget,
      travelDate,
      replyMessage
    } = req.body;

    const inquiry = await Inquiry.findById(req.params.id)
      .populate('interestedTour', 'title destination duration price');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    const previousStatus = inquiry.status;

    // Update fields (only admin-editable fields)
    if (status) inquiry.status = status;
    if (priority) inquiry.priority = priority;
    
    // Handle assignedTo - convert empty string to null, otherwise use the value
    if (assignedTo !== undefined) {
      inquiry.assignedTo = assignedTo === '' || assignedTo === null ? null : assignedTo;
    }
    
    if (notes !== undefined) inquiry.notes = notes;
    if (followUpDate !== undefined) inquiry.followUpDate = followUpDate;
    if (tags) inquiry.tags = tags;
    
    // Handle interestedTour - convert empty string to null, validate ObjectId if provided
    if (interestedTour !== undefined) {
      if (interestedTour === '' || interestedTour === null) {
        inquiry.interestedTour = null;
      } else {
        // Validate ObjectId format
        if (mongoose.Types.ObjectId.isValid(interestedTour)) {
          inquiry.interestedTour = interestedTour;
        } else {
          return res.status(400).json({
            success: false,
            message: 'Invalid tour ID format'
          });
        }
      }
    }
    
    if (budget !== undefined) inquiry.budget = budget;
    if (travelDate !== undefined) inquiry.travelDate = travelDate;

    inquiry.updatedAt = Date.now();
    await inquiry.save();

    // Send reply email if status changed to closed and reply message provided
    if ((status === 'closed' || status === 'converted') && replyMessage) {
      try {
        const populatedInquiry = await Inquiry.findById(inquiry._id)
          .populate('interestedTour', 'title destination duration price');
        
        await sendInquiryReplyEmail(
          { inquiry: populatedInquiry, tour: populatedInquiry.interestedTour },
          replyMessage
        );
        console.log('✅ Inquiry reply email sent for inquiry:', inquiry._id);
      } catch (emailError) {
        console.error('❌ Error sending reply email:', emailError);
        // Don't fail the request if email fails
      }
    }

    console.log('✅ Inquiry updated:', inquiry._id);

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      inquiry
    });
  } catch (error) {
    console.error('❌ Update inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inquiry',
      error: error.message
    });
  }
});

// Admin route - Delete inquiry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    console.log('✅ Inquiry deleted:', req.params.id);

    res.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete inquiry',
      error: error.message
    });
  }
});

// Admin route - Get inquiry statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const total = await Inquiry.countDocuments();
    const newCount = await Inquiry.countDocuments({ status: 'new' });
    const contactedCount = await Inquiry.countDocuments({ status: 'contacted' });
    const qualifiedCount = await Inquiry.countDocuments({ status: 'qualified' });
    const convertedCount = await Inquiry.countDocuments({ status: 'converted' });
    const closedCount = await Inquiry.countDocuments({ status: 'closed' });

    const highPriority = await Inquiry.countDocuments({ priority: 'high' });
    const mediumPriority = await Inquiry.countDocuments({ priority: 'medium' });
    const lowPriority = await Inquiry.countDocuments({ priority: 'low' });

    res.json({
      success: true,
      stats: {
        total,
        byStatus: {
          new: newCount,
          contacted: contactedCount,
          qualified: qualifiedCount,
          converted: convertedCount,
          closed: closedCount
        },
        byPriority: {
          high: highPriority,
          medium: mediumPriority,
          low: lowPriority
        }
      }
    });
  } catch (error) {
    console.error('❌ Get inquiry stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

module.exports = router;

