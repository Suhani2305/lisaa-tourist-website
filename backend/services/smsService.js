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

// Send registration OTP via SMS (supports Twilio, Fast2SMS, or MSG91)
const sendRegistrationOtp = async (phoneNumber, otp) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is required for SMS OTP delivery');
    }

    const digits = phoneNumber.replace(/\D/g, "");
    const phone = digits; // Use 10-digit number for Indian providers

    // Try Fast2SMS first (if configured)
    if (process.env.FAST2SMS_API_KEY) {
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'v3',
            sender_id: process.env.FAST2SMS_SENDER_ID || 'TXTIND',
            message: `Your Lisaa Tours & Travels registration OTP is ${otp}. Use this code to verify your mobile number. It expires in 5 minutes.`,
            language: 'english',
            flash: 0,
            numbers: phone
          })
        });
        
        const result = await response.json();
        
        if (result.return === true) {
          console.log('✅ Registration OTP SMS sent via Fast2SMS to:', phone);
          return { success: true, provider: 'Fast2SMS' };
        } else {
          throw new Error(result.message || 'Failed to send SMS via Fast2SMS');
        }
      } catch (fast2smsError) {
        console.warn('⚠️ Fast2SMS failed, trying other providers:', fast2smsError.message);
        // Continue to try other providers
      }
    }

    // Try MSG91 (if configured)
    if (process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
      try {
        const response = await fetch(
          `https://api.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=${phone}&authkey=${process.env.MSG91_AUTH_KEY}&otp=${otp}`,
          { method: 'POST' }
        );
        
        const result = await response.json();
        
        if (result.type === 'success') {
          console.log('✅ Registration OTP SMS sent via MSG91 to:', phone);
          return { success: true, provider: 'MSG91' };
        } else {
          throw new Error(result.message || 'Failed to send SMS via MSG91');
        }
      } catch (msg91Error) {
        console.warn('⚠️ MSG91 failed, trying Twilio:', msg91Error.message);
        // Continue to try Twilio
      }
    }

    // Try Twilio (if configured)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        // Initialize Twilio client if not already initialized
        if (!twilioClient) {
          twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
          );
        }
        
        let formattedPhone = phoneNumber;
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = `+91${digits}`;
        }

        const smsBody = `Your Lisaa Tours & Travels registration OTP is ${otp}. Use this code to verify your mobile number. It expires in 5 minutes.`;
        
        const twilioMessage = await twilioClient.messages.create({
          body: smsBody,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: formattedPhone,
        });

        console.log('✅ Registration OTP SMS sent via Twilio to:', formattedPhone, 'SID:', twilioMessage.sid);
        return { success: true, sid: twilioMessage.sid, provider: 'Twilio' };
      } catch (twilioError) {
        console.warn('⚠️ Twilio failed:', twilioError.message);
        // Continue to fallback
      }
    }

    // If no SMS provider is configured, throw error
    const message = 'SMS service not configured. Please configure Fast2SMS, MSG91, or Twilio credentials in .env file.';
    console.warn('⚠️', message);
    throw new Error(message);
  } catch (error) {
    console.error('❌ Error sending registration OTP SMS:', error);
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
  sendRegistrationOtp,
  sendBookingConfirmationSMS,
  initializeSmsService
};

