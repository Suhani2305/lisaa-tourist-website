const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist-website';
    
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📍 Connection string:', mongoURI.includes('@') ? 'MongoDB Atlas' : 'Local MongoDB');
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds instead of 30
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check if MongoDB is running (for local) or accessible (for Atlas)');
    console.error('2. Verify MONGODB_URI in .env file is correct');
    console.error('3. Check network/firewall settings');
    console.error('4. For MongoDB Atlas: Verify IP whitelist and credentials\n');
    process.exit(1);
  }
};

module.exports = connectDB;
