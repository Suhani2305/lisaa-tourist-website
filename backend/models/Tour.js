const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tour title is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: [true, 'Destination is required']
  },
  duration: {
    days: {
      type: Number,
      required: [true, 'Duration in days is required'],
      min: [1, 'Duration must be at least 1 day']
    },
    nights: {
      type: Number,
      required: [true, 'Duration in nights is required'],
      min: [0, 'Duration in nights cannot be negative']
    }
  },
  price: {
    adult: {
      type: Number,
      required: [true, 'Adult price is required'],
      min: [0, 'Price cannot be negative']
    },
    child: {
      type: Number,
      required: [true, 'Child price is required'],
      min: [0, 'Price cannot be negative']
    },
    infant: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    }
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
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    activities: [String],
    meals: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false }
    },
    accommodation: String
  }],
  inclusions: [String],
  exclusions: [String],
  highlights: [String],
  category: {
    type: String,
    enum: ['package', 'day-tour', 'multi-day', 'adventure', 'cultural', 'religious', 'wildlife', 'beach'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'easy'
  },
  groupSize: {
    min: {
      type: Number,
      default: 1,
      min: [1, 'Minimum group size must be at least 1']
    },
    max: {
      type: Number,
      default: 20,
      min: [1, 'Maximum group size must be at least 1']
    }
  },
  availability: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
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
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for search functionality
tourSchema.index({ title: 'text', description: 'text' });
tourSchema.index({ destination: 1 });
tourSchema.index({ category: 1 });
tourSchema.index({ price: 1 });
tourSchema.index({ featured: 1, trending: 1 });

module.exports = mongoose.model('Tour', tourSchema);
