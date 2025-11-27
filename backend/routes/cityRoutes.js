const express = require('express');
const router = express.Router();
const City = require('../models/City');
const Tour = require('../models/Tour');

const buildAvailabilityFilters = (now = new Date()) => ([
  {
    $or: [
      { 'availability.isAvailable': { $exists: false } },
      { 'availability.isAvailable': true }
    ]
  },
  {
    $or: [
      { 'availability.startDate': { $exists: false } },
      { 'availability.startDate': { $lte: now } }
    ]
  },
  {
    $or: [
      { 'availability.endDate': { $exists: false } },
      { 'availability.endDate': { $gte: now } }
    ]
  }
]);

// Get all cities (optionally filtered by state)
router.get('/', async (req, res) => {
  try {
    const { stateSlug, featured, search, all = 'false' } = req.query;
    const query = {};

    if (all !== 'true') {
      query.isActive = true;
    }
    if (stateSlug) {
      query.stateSlug = stateSlug;
    }
    if (featured === 'true') {
      query.featured = true;
    }
    if (search) {
      query.$text = { $search: search };
    }

    const cities = await City.find(query).sort({ order: 1, name: 1 });
    res.json({ cities, total: cities.length });
  } catch (error) {
    console.error('❌ Get cities error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single city by slug
router.get('/:stateSlug/:citySlug', async (req, res) => {
  try {
    const { limit } = req.query;
    const limitNumber = Number(limit);

    const city = await City.findOne({ 
      stateSlug: req.params.stateSlug,
      slug: req.params.citySlug,
      isActive: true 
    });
    
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    const cityMatchConditions = [
      { citySlug: req.params.citySlug },
      { city: { $regex: city.name, $options: 'i' } },
      { destination: { $regex: city.name, $options: 'i' } }
    ];

    const availabilityFilters = buildAvailabilityFilters(new Date());

    let toursQuery = Tour.find({ 
      $and: [
        { $or: cityMatchConditions },
        { isActive: { $ne: false } },
        ...availabilityFilters
      ]
    }).sort({ createdAt: -1 });

    if (!Number.isNaN(limitNumber) && limitNumber > 0) {
      toursQuery = toursQuery.limit(limitNumber);
    }

    const tours = await toursQuery.exec();

    res.json({ city, tours });
  } catch (error) {
    console.error('❌ Get city error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create city (Admin only)
router.post('/', async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.status(201).json({ message: 'City created successfully', city });
  } catch (error) {
    console.error('❌ Create city error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'City with this name already exists in this state' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update city (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json({ message: 'City updated successfully', city });
  } catch (error) {
    console.error('❌ Update city error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'City with this name already exists in this state' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete city (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    console.error('❌ Delete city error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

