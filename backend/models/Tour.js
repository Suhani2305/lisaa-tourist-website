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
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  destination: {
    type: String,
    required: [true, 'Destination is required']
  },
  city: {
    type: String,
    default: ''
  },
  citySlug: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  stateSlug: {
    type: String,
    default: ''
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
      min: [0, 'Price cannot be negative'],
      default: function() {
        // Default to 70% of adult price if not provided
        return this.price?.adult ? Math.round(this.price.adult * 0.7) : 0;
      }
    },
    infant: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    }
  },
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    value: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100%'],
      default: 0
    },
    startDate: {
      type: Date,
      required: function() {
        // Required if discount is active
        return this.discount?.isActive === true;
      }
    },
    endDate: {
      type: Date,
      required: function() {
        // Required if discount is active
        return this.discount?.isActive === true;
      }
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  images: {
    type: [String],
    default: []
  },
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
    enum: ['spiritual', 'wellness', 'heritage', 'study', 'adventure', 'cultural', 'package', 'day-tour', 'multi-day', 'religious', 'wildlife', 'beach', 'city-tour'],
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
      type: Date
    },
    endDate: {
      type: Date
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
  trendingCategories: {
    type: [String],
    default: [],
    enum: ['Culture & Heritage', 'Nature & Adventure', 'Beaches & Islands', 'Wellness & Spirituality', 'Food & Festivals', 'Modern India', 'Special Journeys']
  },
  tags: [String]
}, {
  timestamps: true
});

// Pre-save hook to auto-calculate child price as 70% of adult price if not provided
tourSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('price.adult')) {
    // If child price is not set or is 0, calculate it as 70% of adult price
    if (!this.price?.child || this.price.child === 0) {
      if (this.price?.adult && this.price.adult > 0) {
        this.price.child = Math.round(this.price.adult * 0.7);
      }
    }
  }
  next();
});

// Index for search functionality
tourSchema.index({ title: 'text', description: 'text' });
tourSchema.index({ destination: 1 });
tourSchema.index({ category: 1 });
tourSchema.index({ price: 1 });
tourSchema.index({ featured: 1, trending: 1 });
tourSchema.index({ trendingCategories: 1 });

module.exports = mongoose.model('Tour', tourSchema);
