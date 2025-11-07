const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB Atlas connection...');
    console.log('📍 Connection string:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env file');
      console.log('💡 Please create a .env file with your Atlas connection string');
      process.exit(1);
    }

    console.log('⏳ Connecting... (this may take a few seconds)');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });

    console.log('✅ Successfully connected to MongoDB!');
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🔗 Port: ${conn.connection.port || 'N/A (Atlas)'}`);
    
    // Test a simple operation
    try {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log(`📁 Collections found: ${collections.length}`);
      if (collections.length > 0) {
        console.log('   Collections:', collections.map(c => c.name).join(', '));
      }
    } catch (err) {
      console.log('⚠️  Could not list collections (may need permissions)');
    }
    
    console.log('🎉 Connection test successful!');
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your .env file has the correct MONGODB_URI');
    console.log('2. Verify your Atlas cluster is running');
    console.log('3. Check network access settings in Atlas (IP whitelist)');
    console.log('4. Ensure username/password are correct');
    console.log('5. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('6. Try using 0.0.0.0/0 in Atlas Network Access (for testing)');
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 Connection closed');
    }
    process.exit(0);
  }
};

testConnection();
