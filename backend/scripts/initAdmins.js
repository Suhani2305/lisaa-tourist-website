const mongoose = require('mongoose');
require('dotenv').config();
const AdminUser = require('../models/AdminUser');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist-website');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

const initAdmins = async () => {
  try {
    await connectDB();

    const adminEmails = [
      {
        name: 'Super Admin',
        email: 'pushpendrarawat868@gmail.com',
        phone: '9263616263',
        role: 'Superadmin'
      },
      {
        name: 'Admin User',
        email: 'Lsiaatech@gmail.com',
        phone: '8840206492',
        role: 'Admin'
      },
      {
        name: 'Admin User 2',
        email: 'vp312600@gmail.com',
        phone: '9263616263',
        role: 'Admin'
      }
    ];

    console.log('\n🔄 Initializing Admin Users...\n');

    for (const adminData of adminEmails) {
      const existing = await AdminUser.findOne({ email: adminData.email.toLowerCase() });
      
      if (existing) {
        console.log(`⏭️  Admin already exists: ${adminData.email}`);
      } else {
        // Create admin with default password
        const admin = new AdminUser({
          name: adminData.name,
          email: adminData.email.toLowerCase(),
          password: 'admin@123', // Default password - user should reset
          phone: adminData.phone,
          role: adminData.role
        });
        
        await admin.save();
        console.log(`✅ Created admin: ${adminData.email} (${adminData.role})`);
      }
    }

    console.log('\n✅ Admin initialization complete!');
    console.log('\n📝 Instructions:');
    console.log('1. Admin users can login with default password: admin@123');
    console.log('2. Admins should use "Forgot Password" to set new password');
    console.log('3. OTP will be sent to their registered phone numbers');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing admins:', error);
    process.exit(1);
  }
};

initAdmins();

