const express = require('express');
const router = express.Router();
const emailScheduler = require('../services/emailScheduler');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token (admin only)
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

// Manual trigger for reminder emails (admin only)
router.post('/send-reminders', authenticateToken, async (req, res) => {
  try {
    const result = await emailScheduler.triggerReminders();
    res.json({
      success: true,
      message: `Reminder emails processed`,
      ...result
    });
  } catch (error) {
    console.error('Error triggering reminders:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send reminder emails',
      error: error.message 
    });
  }
});

// Manual trigger for follow-up emails (admin only)
router.post('/send-follow-ups', authenticateToken, async (req, res) => {
  try {
    const result = await emailScheduler.triggerFollowUps();
    res.json({
      success: true,
      message: `Follow-up emails processed`,
      ...result
    });
  } catch (error) {
    console.error('Error triggering follow-ups:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send follow-up emails',
      error: error.message 
    });
  }
});

// Manual trigger for review request emails (admin only)
router.post('/send-review-requests', authenticateToken, async (req, res) => {
  try {
    const result = await emailScheduler.triggerReviewRequests();
    res.json({
      success: true,
      message: `Review request emails processed`,
      ...result
    });
  } catch (error) {
    console.error('Error triggering review requests:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send review request emails',
      error: error.message 
    });
  }
});

module.exports = router;

