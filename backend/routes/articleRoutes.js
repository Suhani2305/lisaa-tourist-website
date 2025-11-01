const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Get all articles with filters
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 1000,
      status,
      type,
      category,
      featured,
      search,
      all = 'false'
    } = req.query;
    
    const query = {};
    
    // Only show published articles to public (unless admin requests all)
    if (all !== 'true' && !status) {
      query.status = 'published';
    }
    
    // Add filters
    if (status) query.status = status;
    if (type) query.type = type;
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$text = { $search: search };
    }

    console.log('🔍 Fetching articles with query:', query);

    let articlesQuery = Article.find(query)
      .sort({ publishDate: -1, createdAt: -1 });
    
    if (limit !== 'all') {
      articlesQuery = articlesQuery.limit(parseInt(limit)).skip((page - 1) * parseInt(limit));
    }
    
    const articles = await articlesQuery;
    const total = await Article.countDocuments(query);

    console.log('✅ Found', articles.length, 'articles out of', total, 'total');

    res.json({
      articles,
      totalPages: limit === 'all' ? 1 : Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('❌ Get articles error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single article by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('🔍 Fetching article with ID:', req.params.id);
    const article = await Article.findById(req.params.id).populate('tourPackage', 'title destination');
    
    if (!article) {
      console.log('❌ Article not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment views
    article.views += 1;
    await article.save();

    console.log('✅ Article found:', article.title);
    res.json(article);
  } catch (error) {
    console.error('❌ Get article error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create article (Admin & Customers)
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating article:', req.body.title);
    
    // Calculate word count and reading time
    const wordCount = req.body.content ? req.body.content.split(/\s+/).length : 0;
    const readingTime = Math.ceil(wordCount / 200) + ' min read'; // Average reading speed 200 words/min
    
    const articleData = {
      ...req.body,
      wordCount,
      readingTime,
      publishDate: req.body.status === 'published' ? new Date() : null
    };

    const article = new Article(articleData);
    await article.save();
    
    console.log('✅ Article created successfully:', article._id);
    res.status(201).json({ message: 'Article created successfully', article });
  } catch (error) {
    console.error('❌ Create article error:', error);
    
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

// Update article
router.put('/:id', async (req, res) => {
  try {
    console.log('📝 Updating article:', req.params.id);
    
    // Recalculate word count and reading time if content changed
    if (req.body.content) {
      const wordCount = req.body.content.split(/\s+/).length;
      req.body.wordCount = wordCount;
      req.body.readingTime = Math.ceil(wordCount / 200) + ' min read';
    }
    
    // Set publish date if status changed to published
    if (req.body.status === 'published' && !req.body.publishDate) {
      req.body.publishDate = new Date();
    }
    
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    console.log('✅ Article updated successfully');
    res.json({ message: 'Article updated successfully', article });
  } catch (error) {
    console.error('❌ Update article error:', error);
    
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

// Delete article
router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    console.log('✅ Article deleted successfully');
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('❌ Delete article error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update article status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const updateData = { status };
    if (status === 'published' && !req.body.publishDate) {
      updateData.publishDate = new Date();
    }
    
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    console.log('✅ Article status updated to:', status);
    res.json({ message: 'Article status updated successfully', article });
  } catch (error) {
    console.error('❌ Update article status error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Increment likes
router.post('/:id/like', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article liked successfully', likes: article.likes });
  } catch (error) {
    console.error('❌ Like article error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Increment shares
router.post('/:id/share', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article shared successfully', shares: article.shares });
  } catch (error) {
    console.error('❌ Share article error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;

