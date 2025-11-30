const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// Increase payload limit to 50MB for image uploads (base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const otpRoutes = require('./routes/otpRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminManagementRoutes = require('./routes/adminManagementRoutes');
const adminApprovalRoutes = require('./routes/adminApprovalRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const articleRoutes = require('./routes/articleRoutes');
const stateRoutes = require('./routes/stateRoutes');
const cityRoutes = require('./routes/cityRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const offerRoutes = require('./routes/offerRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const socialAuthRoutes = require('./routes/socialAuthRoutes');
const emailSchedulerRoutes = require('./routes/emailSchedulerRoutes');
const { cacheMiddleware } = require('./middleware/cache');

// API Routes
// Apply caching to GET routes (5 minute cache for read-heavy endpoints)
app.use('/api/tours', cacheMiddleware(300), tourRoutes);
app.use('/api/articles', cacheMiddleware(300), articleRoutes);
app.use('/api/states', cacheMiddleware(300), stateRoutes);
app.use('/api/destinations', cacheMiddleware(300), destinationRoutes);

// Non-cached routes (dynamic data)
app.use('/api/users', userRoutes);
app.use('/api/auth/social', socialAuthRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/management', adminManagementRoutes);
app.use('/api/admin/approvals', adminApprovalRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/emails', emailSchedulerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler - catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
