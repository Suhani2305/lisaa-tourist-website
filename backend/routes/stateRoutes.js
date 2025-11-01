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
    
    // Add tour count for each state (including both tours and packages, including city tours)
    const statesWithTourCount = await Promise.all(
      states.map(async (state) => {
        // Get all cities in this state
        const cities = await City.find({ 
          stateSlug: state.slug,
          isActive: { $ne: false }
        });
        const citySlugs = cities.map(city => city.slug);
        
        // Count all tours and packages for this state
        // 1. Direct state tours (by stateSlug)
        // 2. Tours matching state name
        // 3. Tours matching destination with state name
        // 4. City tours (tours with citySlug matching cities in this state)
        const tourCount = await Tour.countDocuments({
          $or: [
            { stateSlug: state.slug },
            { state: { $regex: state.name, $options: 'i' } },
            { destination: { $regex: state.name, $options: 'i' } },
            ...(citySlugs.length > 0 ? [{ citySlug: { $in: citySlugs } }] : [])
          ],
          isActive: { $ne: false }
        });
        
        return {
          ...state.toObject(),
          tours: tourCount
        };
      })
    );
    
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

