const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, state, category, search, featured, trending } = req.query;
    const query = { isActive: true };

    // Add filters
    if (state) query.state = new RegExp(state, 'i');
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (trending === 'true') query.trending = true;
    if (search) {
      query.$text = { $search: search };
    }

    const destinations = await Destination.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('attractions');

    const total = await Destination.countDocuments(query);

    res.json({
      destinations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single destination
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json(destination);
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create destination (admin only)
router.post('/', async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json({ message: 'Destination created successfully', destination });
  } catch (error) {
    console.error('Create destination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update destination (admin only)
router.put('/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json({ message: 'Destination updated successfully', destination });
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete destination (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured destinations
router.get('/featured/list', async (req, res) => {
  try {
    const destinations = await Destination.find({ featured: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(6);
    
    res.json(destinations);
  } catch (error) {
    console.error('Get featured destinations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending destinations
router.get('/trending/list', async (req, res) => {
  try {
    const destinations = await Destination.find({ trending: true, isActive: true })
      .sort({ 'rating.average': -1 })
      .limit(6);
    
    res.json(destinations);
  } catch (error) {
    console.error('Get trending destinations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
