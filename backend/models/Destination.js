const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  attractions: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    image: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.0
    }
  }],
  bestTimeToVisit: {
    type: String,
    required: true
  },
  weather: {
    summer: {
      min: Number,
      max: Number,
      description: String
    },
    winter: {
      min: Number,
      max: Number,
      description: String
    },
    monsoon: {
      min: Number,
      max: Number,
      description: String
    }
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  category: {
    type: String,
    enum: ['historical', 'religious', 'adventure', 'beach', 'hill-station', 'desert', 'wildlife', 'cultural'],
    required: true
  },
  tags: [String],
  rating: {
    average: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search functionality
destinationSchema.index({ name: 'text', description: 'text', state: 'text', city: 'text' });
destinationSchema.index({ category: 1 });
destinationSchema.index({ state: 1, city: 1 });

module.exports = mongoose.model('Destination', destinationSchema);
