const express = require('express');
const router = express.Router();
const Media = require('../models/Media');

// Get all media files
router.get('/', async (req, res) => {
  try {
    const { type, category, search, isActive } = req.query;
    let query = {};
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const mediaFiles = await Media.find(query).sort({ createdAt: -1 });
    
    res.json(mediaFiles);
  } catch (error) {
    console.error('Get media files error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get media by ID
router.get('/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media file not found' });
    }
    
    // Increment views
    media.views += 1;
    await media.save();
    
    res.json(media);
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create media file
router.post('/', async (req, res) => {
  try {
    const mediaData = req.body;
    
    const media = new Media(mediaData);
    await media.save();
    
    res.status(201).json({ message: 'Media file created successfully', media });
  } catch (error) {
    console.error('Create media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update media file
router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      lastModified: new Date()
    };
    
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!media) {
      return res.status(404).json({ message: 'Media file not found' });
    }
    
    res.json({ message: 'Media file updated successfully', media });
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete media file
router.delete('/:id', async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media file not found' });
    }
    
    res.json({ message: 'Media file deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment downloads
router.post('/:id/download', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media file not found' });
    }
    
    media.downloads += 1;
    await media.save();
    
    res.json({ message: 'Download count updated', downloads: media.downloads });
  } catch (error) {
    console.error('Update download count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment likes
router.post('/:id/like', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media file not found' });
    }
    
    media.likes += 1;
    await media.save();
    
    res.json({ message: 'Like count updated', likes: media.likes });
  } catch (error) {
    console.error('Update like count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

