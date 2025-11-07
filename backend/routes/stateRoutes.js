const express = require('express');
const router = express.Router();
const State = require('../models/State');
const City = require('../models/City');
const Tour = require('../models/Tour');

// Get all states
router.get('/', async (req, res) => {
  try {
    const { featured, search, all = 'false', limit, isActive = 'true' } = req.query;
    const query = {};

    if (all !== 'true') {
      query.isActive = isActive === 'true';
    }
    if (featured === 'true') {
      query.featured = true;
    }
    if (search) {
      query.$text = { $search: search };
    }

    let queryBuilder = State.find(query).sort({ order: 1, name: 1 });
    
    if (limit && !isNaN(parseInt(limit))) {
      queryBuilder = queryBuilder.limit(parseInt(limit));
    }

    const states = await queryBuilder.exec();
    
    // Optimized: Get all cities grouped by state in one query (instead of N queries)
    const allCities = await City.find({ isActive: { $ne: false } }).select('stateSlug slug');
    const citiesByState = {};
    allCities.forEach(city => {
      if (!citiesByState[city.stateSlug]) {
        citiesByState[city.stateSlug] = [];
      }
      citiesByState[city.stateSlug].push(city.slug);
    });
    
    // Optimized: Count tours for all states in parallel (instead of sequential N+1 queries)
    const stateSlugs = states.map(s => s.slug);
    const tourCountPromises = states.map(async (state) => {
      const citySlugs = citiesByState[state.slug] || [];
      const count = await Tour.countDocuments({
        $or: [
          { stateSlug: state.slug },
          { state: { $regex: state.name, $options: 'i' } },
          { destination: { $regex: state.name, $options: 'i' } },
          ...(citySlugs.length > 0 ? [{ citySlug: { $in: citySlugs } }] : [])
        ],
        isActive: { $ne: false }
      });
      return { stateSlug: state.slug, count };
    });
    
    // Execute all count queries in parallel
    const counts = await Promise.all(tourCountPromises);
    const countMap = {};
    counts.forEach(c => { countMap[c.stateSlug] = c.count; });
    
    // Map states with tour counts and convert to plain objects
    const statesWithTourCount = states.map(state => {
      const stateObj = state.toObject ? state.toObject() : state;
      return {
        ...stateObj,
        tours: countMap[state.slug] || 0
      };
    });
    
    res.json(statesWithTourCount); // Return array with tour counts
  } catch (error) {
    console.error('❌ Get states error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single state by slug
router.get('/:slug', async (req, res) => {
  try {
    const state = await State.findOne({ slug: req.params.slug, isActive: true });
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }

    // Get cities in this state
    const cities = await City.find({ 
      stateSlug: req.params.slug, 
      isActive: true 
    }).sort({ order: 1, name: 1 });

    // Get tours for this state (by stateSlug or state name)
    const tours = await Tour.find({ 
      $or: [
        { stateSlug: req.params.slug },
        { state: { $regex: state.name, $options: 'i' } },
        { destination: { $regex: state.name, $options: 'i' } }
      ],
      isActive: true 
    }).limit(12).sort({ createdAt: -1 });

    res.json({ state, cities, tours });
  } catch (error) {
    console.error('❌ Get state error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create state (Admin only)
router.post('/', async (req, res) => {
  try {
    const state = new State(req.body);
    await state.save();
    res.status(201).json({ message: 'State created successfully', state });
  } catch (error) {
    console.error('❌ Create state error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'State with this name or slug already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update state (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
    res.json({ message: 'State updated successfully', state });
  } catch (error) {
    console.error('❌ Update state error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'State with this name or slug already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete state (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
    res.json({ message: 'State deleted successfully' });
  } catch (error) {
    console.error('❌ Delete state error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

