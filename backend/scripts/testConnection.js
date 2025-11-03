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

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🔗 Port: ${conn.connection.port}`);
    
    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Collections: ${collections.length}`);
    
    console.log('🎉 Atlas connection test successful!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your .env file has the correct MONGODB_URI');
    console.log('2. Verify your Atlas cluster is running');
    console.log('3. Check network access settings in Atlas');
    console.log('4. Ensure username/password are correct');
  } finally {
    mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
};

testConnection();
