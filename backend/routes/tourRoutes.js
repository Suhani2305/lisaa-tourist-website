const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');

// Get all tours
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      destination, 
      category, 
      search, 
      featured, 
      trending,
      minPrice,
      maxPrice,
      difficulty
    } = req.query;
    
    const query = { isActive: true };

    // Add filters
    if (destination) query.destination = destination;
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (trending === 'true') query.trending = true;
    if (difficulty) query.difficulty = difficulty;
    if (minPrice || maxPrice) {
      query['price.adult'] = {};
      if (minPrice) query['price.adult'].$gte = parseInt(minPrice);
      if (maxPrice) query['price.adult'].$lte = parseInt(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const tours = await Tour.find(query)
      .populate('destination', 'name state city images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tour.countDocuments(query);

    res.json({
      tours,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single tour
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate('destination', 'name state city images attractions');
    
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json(tour);
  } catch (error) {
    console.error('Get tour error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create tour (admin only)
router.post('/', async (req, res) => {
  try {
    const tour = new Tour(req.body);
    await tour.save();
    res.status(201).json({ message: 'Tour created successfully', tour });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update tour (admin only)
router.put('/:id', async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('destination');

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json({ message: 'Tour updated successfully', tour });
  } catch (error) {
    console.error('Update tour error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete tour (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Delete tour error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured tours
router.get('/featured/list', async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true, isActive: true })
      .populate('destination', 'name state city images')
      .sort({ createdAt: -1 })
      .limit(6);
    
    res.json(tours);
  } catch (error) {
    console.error('Get featured tours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending tours
router.get('/trending/list', async (req, res) => {
  try {
    const tours = await Tour.find({ trending: true, isActive: true })
      .populate('destination', 'name state city images')
      .sort({ 'rating.average': -1 })
      .limit(6);
    
    res.json(tours);
  } catch (error) {
    console.error('Get trending tours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tours by destination
router.get('/destination/:destinationId', async (req, res) => {
  try {
    const tours = await Tour.find({ 
      destination: req.params.destinationId, 
      isActive: true 
    }).populate('destination', 'name state city images');
    
    res.json(tours);
  } catch (error) {
    console.error('Get tours by destination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
