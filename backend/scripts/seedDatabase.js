const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Destination = require('../models/Destination');
const Tour = require('../models/Tour');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist-website');
    console.log('🗄️  Database connected for seeding');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@tourist.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '9876543211'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '9876543212'
  }
];

const sampleDestinations = [
  {
    name: 'Jaipur',
    description: 'The Pink City of India, known for its magnificent palaces, forts, and rich cultural heritage.',
    shortDescription: 'The Pink City with magnificent palaces and forts',
    state: 'Rajasthan',
    city: 'Jaipur',
    images: [
      { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523', alt: 'Jaipur City Palace', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', alt: 'Hawa Mahal' }
    ],
    attractions: [
      { name: 'Amber Fort', description: 'Magnificent fort with stunning architecture', rating: 4.5 },
      { name: 'City Palace', description: 'Royal palace with museum', rating: 4.3 },
      { name: 'Hawa Mahal', description: 'Palace of Winds with unique facade', rating: 4.2 }
    ],
    bestTimeToVisit: 'October to March',
    weather: {
      summer: { min: 25, max: 45, description: 'Hot and dry' },
      winter: { min: 5, max: 25, description: 'Pleasant and cool' },
      monsoon: { min: 20, max: 35, description: 'Moderate with occasional rain' }
    },
    coordinates: { latitude: 26.9124, longitude: 75.7873 },
    category: 'historical',
    tags: ['palace', 'fort', 'culture', 'heritage'],
    rating: { average: 4.3, count: 150 },
    featured: true,
    trending: true
  },
  {
    name: 'Udaipur',
    description: 'The City of Lakes, famous for its beautiful lakes, palaces, and romantic atmosphere.',
    shortDescription: 'City of Lakes with romantic palaces',
    state: 'Rajasthan',
    city: 'Udaipur',
    images: [
      { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', alt: 'Lake Pichola', isPrimary: true }
    ],
    attractions: [
      { name: 'City Palace', description: 'Grand palace overlooking Lake Pichola', rating: 4.6 },
      { name: 'Lake Pichola', description: 'Beautiful lake with boat rides', rating: 4.4 }
    ],
    bestTimeToVisit: 'September to March',
    weather: {
      summer: { min: 20, max: 40, description: 'Warm' },
      winter: { min: 8, max: 28, description: 'Pleasant' },
      monsoon: { min: 18, max: 32, description: 'Moderate with rain' }
    },
    coordinates: { latitude: 24.5854, longitude: 73.7125 },
    category: 'historical',
    tags: ['lakes', 'palace', 'romantic'],
    rating: { average: 4.5, count: 120 },
    featured: true,
    trending: false
  }
];

const sampleTours = [
  {
    title: 'Rajasthan Royal Heritage Tour',
    description: 'Explore the royal heritage of Rajasthan with visits to Jaipur, Udaipur, and Jodhpur. Experience the grandeur of palaces, forts, and rich cultural traditions.',
    shortDescription: '7-day royal heritage tour covering major cities of Rajasthan',
    destination: null, // Will be set after destinations are created
    duration: { days: 7, nights: 6 },
    price: { adult: 25000, child: 15000, infant: 0 },
    images: [
      { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523', alt: 'Rajasthan Tour', isPrimary: true }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Jaipur',
        description: 'Arrive in Jaipur and check into hotel. Evening at leisure.',
        activities: ['Airport pickup', 'Hotel check-in', 'Local market visit'],
        meals: { breakfast: false, lunch: true, dinner: true },
        accommodation: 'Heritage Hotel'
      },
      {
        day: 2,
        title: 'Jaipur City Tour',
        description: 'Full day tour of Jaipur including Amber Fort, City Palace, and Hawa Mahal.',
        activities: ['Amber Fort visit', 'City Palace tour', 'Hawa Mahal photo stop'],
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: 'Heritage Hotel'
      }
    ],
    inclusions: [
      'Accommodation in heritage hotels',
      'All meals',
      'Air-conditioned vehicle',
      'Professional guide',
      'Entrance fees to monuments'
    ],
    exclusions: [
      'Personal expenses',
      'Tips and gratuities',
      'Travel insurance',
      'International flights'
    ],
    highlights: [
      'Visit to Amber Fort with elephant ride',
      'City Palace and museum tour',
      'Boat ride on Lake Pichola',
      'Traditional Rajasthani dinner'
    ],
    category: 'package',
    difficulty: 'easy',
    groupSize: { min: 2, max: 15 },
    availability: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isAvailable: true
    },
    rating: { average: 4.4, count: 25 },
    featured: true,
    trending: true,
    tags: ['heritage', 'royal', 'culture', 'luxury']
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Tour.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create users
    console.log('👥 Creating users...');
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${users.length} users`);

    // Create destinations
    console.log('🏛️  Creating destinations...');
    const destinations = await Destination.insertMany(sampleDestinations);
    console.log(`✅ Created ${destinations.length} destinations`);

    // Create tours
    console.log('🎯 Creating tours...');
    const tours = [...sampleTours];
    tours[0].destination = destinations[0]._id; // Set Jaipur as destination for the tour
    
    const createdTours = await Tour.insertMany(tours);
    console.log(`✅ Created ${createdTours.length} tours`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🏛️  Destinations: ${destinations.length}`);
    console.log(`🎯 Tours: ${createdTours.length}`);
    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@tourist.com / admin123');
    console.log('User: john@example.com / password123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeding
connectDB().then(() => {
  seedDatabase();
});
