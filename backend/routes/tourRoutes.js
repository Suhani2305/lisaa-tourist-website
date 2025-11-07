const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');

// Get all tours
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 500, // Optimized default limit for better performance
      destination, 
      category, 
      trendingCategory, // Filter by trending category (Culture & Heritage, etc.)
      search, 
      featured, 
      trending,
      minPrice,
      maxPrice,
      difficulty,
      all = 'false' // New param to get ALL packages (for admin)
    } = req.query;
    
    // For admin panel, don't filter by isActive
    const query = {};
    
    // Only apply isActive filter if not requesting all packages
    if (all !== 'true') {
      query.isActive = true;
    }

    // Add filters
    if (destination) query.destination = destination;
    if (category) {
      // Support both category and tourType param names
      query.category = category;
    }
    if (trendingCategory) {
      // Filter by trending category (search within trendingCategories array)
      // Use $in operator to match if the array contains this trending category
      query.trendingCategories = { $in: [trendingCategory] };
      console.log('🔍 Filtering by trending category:', trendingCategory);
    }
    if (featured === 'true') query.featured = true;
    if (trending === 'true') query.trending = true;
    if (difficulty) query.difficulty = difficulty;
    if (minPrice || maxPrice) {
      query['price.adult'] = {};
      if (minPrice) query['price.adult'].$gte = parseInt(minPrice);
      if (maxPrice) query['price.adult'].$lte = parseInt(maxPrice);
    }
    if (search) {
      // Use regex search for better results (searches in title, description, destination, city, state)
      // This is more flexible than $text search which requires specific text index
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
      console.log('🔍 Search query:', search);
    }

    console.log('🔍 Fetching tours with query:', query);
    console.log('📄 Pagination - Page:', page, 'Limit:', limit);

    let toursQuery = Tour.find(query).sort({ createdAt: -1 });
    
    // Only apply pagination if limit is not "all"
    if (limit !== 'all') {
      toursQuery = toursQuery.limit(parseInt(limit)).skip((page - 1) * parseInt(limit));
    }
    
    const tours = await toursQuery;
    const total = await Tour.countDocuments(query);

    console.log('✅ Found', tours.length, 'tours out of', total, 'total');

    // Convert Mongoose documents to plain objects for better caching and JSON serialization
    const toursPlain = tours.map(tour => tour.toObject ? tour.toObject() : tour);

    res.json({
      tours: toursPlain,
      totalPages: limit === 'all' ? 1 : Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('❌ Get tours error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single tour
router.get('/:id', async (req, res) => {
  try {
    console.log('🔍 Fetching tour with ID:', req.params.id);
    const tour = await Tour.findById(req.params.id);
    
    if (!tour) {
      console.log('❌ Tour not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Tour not found' });
    }

    console.log('✅ Tour found:', tour.title);
    res.json(tour);
  } catch (error) {
    console.error('❌ Get tour error:', error);
    console.error('❌ Invalid ID format:', req.params.id);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create tour (admin only)
router.post('/', async (req, res) => {
  try {
    console.log('📦 Received tour data:', JSON.stringify(req.body, null, 2));
    
    const tour = new Tour(req.body);
    await tour.save();
    
    console.log('✅ Tour created successfully:', tour._id);
    res.status(201).json({ message: 'Tour created successfully', tour });
  } catch (error) {
    console.error('❌ Create tour error:', error);
    console.error('Error details:', error.message);
    
    // Handle duplicate key error (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return res.status(400).json({
        message: `A package with this ${field} already exists: "${value}". Please use a different ${field}.`,
        error: 'Duplicate entry',
        field,
        value
      });
    }
    
    // Send detailed validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({ 
        message: 'Validation error', 
        errors 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update tour (admin only)
router.put('/:id', async (req, res) => {
  try {
    console.log('📝 Updating tour:', req.params.id);
    console.log('Update data:', JSON.stringify(req.body, null, 2));
    
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    console.log('✅ Tour updated successfully');
    res.json({ message: 'Tour updated successfully', tour });
  } catch (error) {
    console.error('❌ Update tour error:', error);
    
    // Handle duplicate key error (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return res.status(400).json({
        message: `A package with this ${field} already exists: "${value}". Please use a different ${field}.`,
        error: 'Duplicate entry',
        field,
        value
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({ 
        message: 'Validation error', 
        errors 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
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
      .sort({ 'rating.average': -1 })
      .limit(6);
    
    res.json(tours);
  } catch (error) {
    console.error('Get trending tours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tours by destination
router.get('/destination/:destinationName', async (req, res) => {
  try {
    const tours = await Tour.find({ 
      destination: req.params.destinationName, 
      isActive: true 
    });
    
    res.json(tours);
  } catch (error) {
    console.error('Get tours by destination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
