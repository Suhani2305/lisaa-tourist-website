const twilio = require('twilio');

// WhatsApp service configuration
let twilioClient;

// Initialize Twilio WhatsApp client
const initializeWhatsAppService = () => {
  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      console.log('✅ WhatsApp service initialized');
    } else {
      console.warn('⚠️ Twilio credentials not found. WhatsApp service disabled.');
    }
  } catch (error) {
    console.error('❌ WhatsApp service initialization error:', error);
  }
};

// Initialize on module load
initializeWhatsAppService();

// Send booking confirmation WhatsApp message
const sendBookingConfirmationWhatsApp = async (bookingData) => {
  try {
    if (!twilioClient) {
      console.warn('⚠️ WhatsApp service not configured. Skipping WhatsApp send.');
      return { success: false, message: 'WhatsApp service not configured' };
    }

    const { user, tour, booking, bookingNumber } = bookingData;
    const phoneNumber = user.phone || booking.contactInfo?.phone;

    if (!phoneNumber) {
      console.warn('⚠️ Phone number not available. Skipping WhatsApp send.');
      return { success: false, message: 'Phone number not available' };
    }

    // Format phone number for WhatsApp (must include country code)
    let formattedPhone = phoneNumber;
    if (!formattedPhone.startsWith('whatsapp:+')) {
      // Remove any existing whatsapp: prefix
      formattedPhone = formattedPhone.replace('whatsapp:', '');
      // Add country code if not present
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+91${formattedPhone}`; // Default to India (+91)
      }
      formattedPhone = `whatsapp:${formattedPhone}`;
    }

    const message = `🎉 *Booking Confirmed!*\n\nDear ${user.name},\n\nYour tour booking has been successfully confirmed.\n\n*Booking Details:*\n📋 Booking Number: *${bookingNumber}*\n✈️ Tour Package: *${tour.title}*\n📍 Destination: ${tour.destination}\n📅 Travel Date: ${new Date(booking.travelDates?.startDate || booking.bookingDate).toLocaleDateString('en-IN')}\n👥 Travelers: ${booking.travelers?.adults || 0} Adults, ${booking.travelers?.children || 0} Children\n💰 Total Amount: *₹${booking.pricing?.finalAmount || booking.totalAmount || 0}*\n✅ Payment Status: Paid\n\nThank you for choosing *Lisaa Tours & Travels*! Our team will contact you shortly with more details.\n\nFor any queries:\n📧 Email: Lsiaatech@gmail.com\n📱 Phone: +91 9263616263\n\nHave a wonderful journey! 🌟`;

    const twilioMessage = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886', // Your Twilio WhatsApp number
      to: formattedPhone
    });

    console.log('✅ Booking confirmation WhatsApp sent:', twilioMessage.sid);
    return { success: true, messageSid: twilioMessage.sid };
  } catch (error) {
    console.error('❌ Error sending booking confirmation WhatsApp:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmationWhatsApp,
  initializeWhatsAppService
};

