const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Article content is required']
  },
  type: {
    type: String,
    enum: ['blog_post', 'tour_description', 'video_content', 'image_gallery', 'news_article', 'customer_experience'],
    default: 'blog_post'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required']
  },
  authorEmail: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'scheduled'],
    default: 'draft'
  },
  featuredImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90'
  },
  images: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  },
  seoTitle: {
    type: String
  },
  seoDescription: {
    type: String
  },
  metaKeywords: {
    type: String
  },
  readingTime: {
    type: String,
    default: '5 min read'
  },
  wordCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  publishDate: {
    type: Date
  },
  videoUrl: {
    type: String
  },
  // For customer experiences
  customerName: {
    type: String
  },
  customerRating: {
    type: Number,
    min: 1,
    max: 5
  },
  tourPackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  }
}, {
  timestamps: true
});

// Index for search
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });
articleSchema.index({ status: 1, featured: 1 });
articleSchema.index({ category: 1 });
articleSchema.index({ publishDate: -1 });

module.exports = mongoose.model('Article', articleSchema);

