const twilio = require('twilio');

// SMS service configuration
let twilioClient;

// Initialize Twilio SMS client
const initializeSmsService = () => {
  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      console.log('✅ SMS service initialized');
    } else {
      console.warn('⚠️ Twilio credentials not found. SMS service disabled.');
    }
  } catch (error) {
    console.error('❌ SMS service initialization error:', error);
  }
};

// Initialize on module load
initializeSmsService();

// Send password reset OTP via SMS
const sendPasswordResetOtp = async (phoneNumber, otp) => {
  try {
    if (!twilioClient) {
      const message = 'SMS service not configured. Skipping password reset OTP send.';
      console.warn('⚠️', message);
      throw new Error(message);
    }

    if (!phoneNumber) {
      throw new Error('Phone number is required for SMS OTP delivery');
    }

    let formattedPhone = phoneNumber;
    const digits = phoneNumber.replace(/\D/g, "");
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+91${digits}`;
    }

    const smsBody = `Your Lisaa Tours & Travels OTP is ${otp}. It expires in 5 minutes.`;
    const twilioMessage = await twilioClient.messages.create({
      body: smsBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log('✅ Password reset OTP SMS sent:', twilioMessage.sid);
    return { success: true, sid: twilioMessage.sid };
  } catch (error) {
    console.error('❌ Error sending password reset OTP SMS:', error);
    throw error;
  }
};

// Send booking confirmation SMS
const sendBookingConfirmationSMS = async (bookingData) => {
  try {
    if (!twilioClient) {
      console.warn('⚠️ SMS service not configured. Skipping SMS send.');
      return { success: false, message: 'SMS service not configured' };
    }

    const { user, tour, booking, bookingNumber } = bookingData;
    const phoneNumber = user.phone || booking.contactInfo?.phone;

    if (!phoneNumber) {
      console.warn('⚠️ Phone number not available. Skipping SMS send.');
      return { success: false, message: 'Phone number not available' };
    }

    // Format phone number (add country code if needed)
    let formattedPhone = phoneNumber;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone}`; // Default to India (+91)
    }

    const message = `🎉 Booking Confirmed!\n\nBooking No: ${bookingNumber}\nTour: ${tour.title}\nDestination: ${tour.destination}\nDate: ${new Date(booking.travelDates?.startDate || booking.bookingDate).toLocaleDateString('en-IN')}\nAmount: ₹${booking.pricing?.finalAmount || booking.totalAmount || 0}\n\nThank you for choosing Lisaa Tours & Travels!\n\nFor queries: +91 9263616263`;

    const twilioMessage = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: formattedPhone
    });

    console.log('✅ Booking confirmation SMS sent:', twilioMessage.sid);
    return { success: true, messageSid: twilioMessage.sid };
  } catch (error) {
    console.error('❌ Error sending booking confirmation SMS:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetOtp,
  sendBookingConfirmationSMS,
  initializeSmsService
};

