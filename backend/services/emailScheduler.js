const Booking = require('../models/Booking');
const emailService = require('./emailService');

// Send reminder emails (3 days before travel)
const sendBookingReminders = async () => {
  try {
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    
    // Find bookings with travel date in 3 days
    const bookings = await Booking.find({
      status: { $in: ['confirmed', 'pending'] },
      'travelDates.startDate': {
        $gte: new Date(threeDaysLater.setHours(0, 0, 0, 0)),
        $lt: new Date(threeDaysLater.setHours(23, 59, 59, 999))
      }
    })
      .populate('user', 'name email')
      .populate('tour', 'title destination duration price images');

    console.log(`📧 Found ${bookings.length} bookings to send reminders for`);

    for (const booking of bookings) {
      try {
        // Check if reminder already sent
        if (booking.reminderSent) {
          continue;
        }

        if (booking.user && booking.user.email && booking.tour) {
          await emailService.sendBookingReminderEmail({
            user: booking.user,
            tour: booking.tour,
            booking: booking,
            bookingNumber: booking.bookingNumber
          });

          // Mark reminder as sent
          booking.reminderSent = true;
          await booking.save();

          console.log(`✅ Reminder email sent for booking ${booking.bookingNumber}`);
        }
      } catch (error) {
        console.error(`❌ Failed to send reminder for booking ${booking.bookingNumber}:`, error.message);
      }
    }

    return { success: true, count: bookings.length };
  } catch (error) {
    console.error('❌ Error in sendBookingReminders:', error);
    return { success: false, error: error.message };
  }
};

// Send review request emails (after journey completion)
const sendReviewRequests = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find completed bookings where journey has ended (endDate is today or in the past)
    // and review request email hasn't been sent yet
    const bookings = await Booking.find({
      status: 'completed',
      'travelDates.endDate': {
        $lte: today
      },
      reviewRequestEmailSent: { $ne: true } // Check if review request already sent
    })
      .populate('user', 'name email')
      .populate('tour', 'title destination duration price images');

    console.log(`📧 Found ${bookings.length} completed bookings to send review requests for`);

    for (const booking of bookings) {
      try {
        if (booking.user && booking.user.email && booking.tour) {
          await emailService.sendReviewRequestEmail({
            user: booking.user,
            tour: booking.tour,
            booking: booking,
            bookingNumber: booking.bookingNumber
          });

          // Mark review request as sent
          booking.reviewRequestEmailSent = true;
          await booking.save();

          console.log(`✅ Review request email sent for booking ${booking.bookingNumber}`);
        }
      } catch (error) {
        console.error(`❌ Failed to send review request for booking ${booking.bookingNumber}:`, error.message);
      }
    }

    return { success: true, count: bookings.length };
  } catch (error) {
    console.error('❌ Error in sendReviewRequests:', error);
    return { success: false, error: error.message };
  }
};

// Send follow-up emails (2 days after trip completion)
const sendBookingFollowUps = async () => {
  try {
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    
    // Find completed bookings from 2 days ago
    const bookings = await Booking.find({
      status: 'completed',
      'travelDates.endDate': {
        $gte: new Date(twoDaysAgo.setHours(0, 0, 0, 0)),
        $lt: new Date(twoDaysAgo.setHours(23, 59, 59, 999))
      },
      followUpEmailSent: { $ne: true } // Check if follow-up already sent
    })
      .populate('user', 'name email')
      .populate('tour', 'title destination duration price images');

    console.log(`📧 Found ${bookings.length} bookings to send follow-ups for`);

    for (const booking of bookings) {
      try {
        if (booking.user && booking.user.email && booking.tour) {
          await emailService.sendBookingFollowUpEmail({
            user: booking.user,
            tour: booking.tour,
            booking: booking,
            bookingNumber: booking.bookingNumber
          });

          // Mark follow-up as sent (add followUpEmailSent field to booking model)
          booking.followUpEmailSent = true;
          await booking.save();

          console.log(`✅ Follow-up email sent for booking ${booking.bookingNumber}`);
        }
      } catch (error) {
        console.error(`❌ Failed to send follow-up for booking ${booking.bookingNumber}:`, error.message);
      }
    }

    return { success: true, count: bookings.length };
  } catch (error) {
    console.error('❌ Error in sendBookingFollowUps:', error);
    return { success: false, error: error.message };
  }
};

// Manual trigger endpoints (for testing or manual execution)
const triggerReminders = async () => {
  return await sendBookingReminders();
};

const triggerFollowUps = async () => {
  return await sendBookingFollowUps();
};

const triggerReviewRequests = async () => {
  return await sendReviewRequests();
};

module.exports = {
  sendBookingReminders,
  sendBookingFollowUps,
  sendReviewRequests,
  triggerReminders,
  triggerFollowUps,
  triggerReviewRequests
};

