const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Tour = require('../models/Tour');
const Inquiry = require('../models/Inquiry');
const Offer = require('../models/Offer');

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    // Get all bookings
    const allBookings = await Booking.find({});
    const monthlyBookings = await Booking.find({ createdAt: { $gte: startOfMonth } });
    const yearlyBookings = await Booking.find({ createdAt: { $gte: startOfYear } });
    
    // Calculate revenue
    const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const yearlyRevenue = yearlyBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    
    // Get counts
    const totalCustomers = await User.countDocuments({ isActive: true });
    const totalTours = await Tour.countDocuments({ isActive: true });
    const totalBookingsCount = allBookings.length;
    const totalInquiries = await Inquiry.countDocuments({});
    
    // Booking status breakdown
    const bookingStatusCounts = {
      confirmed: allBookings.filter(b => b.status === 'confirmed').length,
      pending: allBookings.filter(b => b.status === 'pending').length,
      cancelled: allBookings.filter(b => b.status === 'cancelled').length,
      completed: allBookings.filter(b => b.status === 'completed').length
    };
    
    // Payment status breakdown
    const paymentStatusCounts = {
      paid: allBookings.filter(b => b.payment?.status === 'paid').length,
      pending: allBookings.filter(b => b.payment?.status === 'pending').length,
      failed: allBookings.filter(b => b.payment?.status === 'failed').length
    };
    
    // Recent bookings (last 10)
    const recentBookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('tour', 'title destination')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Top tours by bookings
    const tourBookings = await Booking.aggregate([
      {
        $group: {
          _id: '$tour',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const topTours = await Tour.populate(tourBookings, { path: '_id', select: 'title destination images' });
    
    res.json({
      overview: {
        totalRevenue,
        monthlyRevenue,
        yearlyRevenue,
        totalCustomers,
        totalTours,
        totalBookings: totalBookingsCount,
        totalInquiries
      },
      bookingStatus: bookingStatusCounts,
      paymentStatus: paymentStatusCounts,
      recentBookings,
      topTours: topTours.map(t => ({
        tour: t._id,
        bookings: t.count,
        revenue: t.revenue
      }))
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get revenue trends
router.get('/revenue-trends', async (req, res) => {
  try {
    const { period = 'month' } = req.query; // month, week, year
    
    let groupFormat = '%Y-%m';
    let startDate = new Date();
    
    if (period === 'week') {
      groupFormat = '%Y-%U';
      startDate.setDate(startDate.getDate() - 7 * 12); // 12 weeks
    } else if (period === 'month') {
      groupFormat = '%Y-%m';
      startDate.setMonth(startDate.getMonth() - 12); // 12 months
    } else if (period === 'year') {
      groupFormat = '%Y';
      startDate.setFullYear(startDate.getFullYear() - 5); // 5 years
    }
    
    const revenueData = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'payment.status': 'paid'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: groupFormat, date: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(revenueData);
  } catch (error) {
    console.error('Get revenue trends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking trends
router.get('/booking-trends', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let groupFormat = '%Y-%m';
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    
    const bookingData = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: groupFormat, date: '$createdAt' }
          },
          count: { $sum: 1 },
          confirmed: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(bookingData);
  } catch (error) {
    console.error('Get booking trends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular destinations
router.get('/popular-destinations', async (req, res) => {
  try {
    const destinationData = await Booking.aggregate([
      {
        $lookup: {
          from: 'tours',
          localField: 'tour',
          foreignField: '_id',
          as: 'tourData'
        }
      },
      { $unwind: '$tourData' },
      {
        $group: {
          _id: '$tourData.destination',
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { bookings: -1 } },
      { $limit: 10 }
    ]);
    
    res.json(destinationData);
  } catch (error) {
    console.error('Get popular destinations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer demographics (age and location)
router.get('/customer-demographics', async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('dateOfBirth age address createdAt');
    
    // Calculate age distribution
    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56-65': 0,
      '65+': 0
    };
    
    // Calculate location distribution
    const locationCounts = {};
    
    users.forEach(user => {
      // Calculate age
      let userAge = user.age;
      if (!userAge && user.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(user.dateOfBirth);
        userAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          userAge--;
        }
      }
      
      // Group by age
      if (userAge) {
        if (userAge >= 18 && userAge <= 25) {
          ageGroups['18-25']++;
        } else if (userAge >= 26 && userAge <= 35) {
          ageGroups['26-35']++;
        } else if (userAge >= 36 && userAge <= 45) {
          ageGroups['36-45']++;
        } else if (userAge >= 46 && userAge <= 55) {
          ageGroups['46-55']++;
        } else if (userAge >= 56 && userAge <= 65) {
          ageGroups['56-65']++;
        } else if (userAge > 65) {
          ageGroups['65+']++;
        }
      }
      
      // Group by location
      const location = user.address?.city || user.address?.state || user.address?.country || 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    
    // Convert to arrays
    const ageDistribution = Object.entries(ageGroups).map(([age, count]) => ({
      age,
      count,
      percentage: users.length > 0 ? ((count / users.length) * 100).toFixed(1) : 0
    }));
    
    const locationDistribution = Object.entries(locationCounts)
      .map(([location, count]) => ({
        location,
        count,
        percentage: users.length > 0 ? ((count / users.length) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 locations
    
    // Gender distribution
    const genderCounts = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const genderDistribution = genderCounts.map(item => ({
      gender: item._id || 'unknown',
      count: item.count,
      percentage: users.length > 0 ? ((item.count / users.length) * 100).toFixed(1) : 0
    }));
    
    res.json({
      byAge: ageDistribution,
      byLocation: locationDistribution,
      byGender: genderDistribution,
      totalCustomers: users.length
    });
  } catch (error) {
    console.error('Get customer demographics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

