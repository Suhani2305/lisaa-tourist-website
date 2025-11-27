const twilio = require('twilio');

// WhatsApp service configuration
let twilioClient;
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_WHATSAPP_COUNTRY_CODE || '+91';

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

const formatPhoneForWhatsApp = (phoneNumber) => {
  if (!phoneNumber) {
    return null;
  }

  let formattedPhone = phoneNumber.toString().trim();
  if (!formattedPhone) {
    return null;
  }

  formattedPhone = formattedPhone.replace('whatsapp:', '');
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = `${DEFAULT_COUNTRY_CODE}${formattedPhone.replace(/^0+/, '')}`;
  }

  return `whatsapp:${formattedPhone}`;
};

const formatOfferApplicabilityText = (offer = {}) => {
  if (offer.applicableToAll) {
    return 'Applicable on all tours across India.';
  }

  const sections = [];
  if (Array.isArray(offer.applicableTours) && offer.applicableTours.length > 0) {
    const tours = offer.applicableTours
      .map(tour => (typeof tour === 'object' ? tour.title || tour.name || tour._id : tour))
      .filter(Boolean)
      .slice(0, 5)
      .join(', ');
    if (tours) {
      sections.push(`Select tours: ${tours}`);
    }
  }

  if (Array.isArray(offer.applicableCities) && offer.applicableCities.length > 0) {
    sections.push(`Cities: ${offer.applicableCities.slice(0, 5).join(', ')}`);
  }

  if (Array.isArray(offer.applicableStates) && offer.applicableStates.length > 0) {
    sections.push(`States: ${offer.applicableStates.slice(0, 5).join(', ')}`);
  }

  return sections.join(' | ') || 'Applicable on selected itineraries (check website).';
};

const sendCouponAnnouncementWhatsApp = async (user, offer) => {
  try {
    if (!twilioClient) {
      console.warn('⚠️ WhatsApp service not configured. Skipping coupon announcement.');
      return { success: false, message: 'WhatsApp service not configured' };
    }

    const phoneNumber = formatPhoneForWhatsApp(user?.phone);
    if (!phoneNumber) {
      return { success: false, message: 'Phone number not available or invalid' };
    }

    const discountValue = offer?.type === 'percentage'
      ? `${offer?.value || 0}% off`
      : `₹${offer?.value || 0} off`;
    const startDate = offer?.startDate ? new Date(offer.startDate).toLocaleDateString('en-IN') : 'Today';
    const endDate = offer?.endDate ? new Date(offer.endDate).toLocaleDateString('en-IN') : 'Limited time';
    const applicability = formatOfferApplicabilityText(offer);
    const minAmount = offer?.minAmount ? Number(offer.minAmount) : 0;
    const maxDiscount = offer?.maxDiscount ? Number(offer.maxDiscount) : null;

    const message = `🎁 *New Travel Coupon Just Dropped!*

Hi ${user?.name || 'Traveler'},
Use code *${offer?.code || 'N/A'}* to unlock *${discountValue}* on your next booking.

• Offer: ${offer?.title || 'Limited-time coupon'}
• Validity: ${startDate} - ${endDate}
• Min. booking: ₹${minAmount}${maxDiscount ? ` | Max. discount: ₹${maxDiscount}` : ''}
• Applicability: ${applicability}

${offer?.terms ? `Terms: ${offer.terms}\n\n` : ''}Book on our website or ping us back—we'll help you apply the coupon. Hurry before it expires!`;

    const twilioMessage = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      to: phoneNumber
    });

    console.log('✅ Coupon announcement WhatsApp sent:', twilioMessage.sid, 'to', phoneNumber);
    return { success: true, messageSid: twilioMessage.sid };
  } catch (error) {
    console.error('❌ Error sending coupon announcement WhatsApp:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmationWhatsApp,
  sendCouponAnnouncementWhatsApp,
  initializeWhatsAppService
};

