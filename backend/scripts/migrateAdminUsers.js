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

const migrateAdminUsers = async () => {
  try {
    await connectDB();

    console.log('\n🔄 Migrating Admin Users...\n');

    // Get all admin users
    const admins = await AdminUser.find({});

    console.log(`Found ${admins.length} admin users to migrate\n`);

    for (const admin of admins) {
      let updated = false;
      const updates = {};

      // Fix role: "Super Admin" -> "Superadmin"
      if (admin.role === 'Super Admin') {
        updates.role = 'Superadmin';
        updated = true;
        console.log(`  📝 Updating role for ${admin.email}: "Super Admin" -> "Superadmin"`);
      }

      // Add name field if missing
      if (!admin.name || admin.name.trim() === '') {
        // Extract name from email or use a default
        const emailName = admin.email.split('@')[0];
        // Capitalize first letter of each word
        const capitalizedName = emailName
          .split('.')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
        updates.name = capitalizedName;
        updated = true;
        console.log(`  📝 Adding name for ${admin.email}: "${capitalizedName}"`);
      }

      // Update if needed
      if (updated) {
        await AdminUser.findByIdAndUpdate(admin._id, updates, { runValidators: false });
        console.log(`  ✅ Updated admin: ${admin.email}\n`);
      } else {
        console.log(`  ⏭️  No changes needed for: ${admin.email}\n`);
      }
    }

    console.log('✅ Migration complete!');
    console.log('\n📝 Summary:');
    console.log('- Updated role values from "Super Admin" to "Superadmin"');
    console.log('- Added missing name fields to admin users');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateAdminUsers();

