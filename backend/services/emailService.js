const nodemailer = require('nodemailer');

// Email service configuration
let transporter;

// Initialize email transporter
const initializeEmailService = () => {
  try {
    // Use Gmail SMTP (you can change to other providers)
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'Lsiaatech@gmail.com',
        pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD
      }
    });
    console.log('✅ Email service initialized');
  } catch (error) {
    console.error('❌ Email service initialization error:', error);
  }
};

// Initialize on module load
if (process.env.EMAIL_USER || process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD) {
  initializeEmailService();
}

// Send booking confirmation email
const sendBookingConfirmationEmail = async (bookingData) => {
  try {
    if (!transporter) {
      console.warn('⚠️ Email service not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    const { user, tour, booking, bookingNumber } = bookingData;

    const mailOptions = {
      from: `"Lisaa Tours & Travels" <${process.env.EMAIL_USER || 'Lsiaatech@gmail.com'}>`,
      to: user.email,
      subject: `🎉 Booking Confirmed - ${bookingNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #FF6B35; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: bold; color: #666; }
            .info-value { color: #333; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #FF6B35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Booking Confirmed!</h1>
              <p>Your tour booking has been successfully confirmed</p>
            </div>
            <div class="content">
              <p>Dear ${user.name},</p>
              <p>Thank you for booking with <strong>Lisaa Tours & Travels</strong>!</p>
              
              <div class="booking-info">
                <h2 style="color: #FF6B35; margin-top: 0;">Booking Details</h2>
                <div class="info-row">
                  <span class="info-label">Booking Number:</span>
                  <span class="info-value"><strong>${bookingNumber}</strong></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Tour Package:</span>
                  <span class="info-value">${tour.title}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Destination:</span>
                  <span class="info-value">${tour.destination}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Duration:</span>
                  <span class="info-value">${tour.duration?.days || 'N/A'} Days / ${tour.duration?.nights || 'N/A'} Nights</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Travel Date:</span>
                  <span class="info-value">${new Date(booking.travelDates?.startDate || booking.bookingDate).toLocaleDateString('en-IN')}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Travelers:</span>
                  <span class="info-value">${booking.travelers?.adults || 0} Adults, ${booking.travelers?.children || 0} Children</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Total Amount:</span>
                  <span class="info-value"><strong>₹${booking.pricing?.finalAmount || booking.totalAmount || 0}</strong></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Payment Status:</span>
                  <span class="info-value" style="color: #28a745;"><strong>Paid</strong></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Payment ID:</span>
                  <span class="info-value">${booking.payment?.transactionId || booking.paymentId || 'N/A'}</span>
                </div>
              </div>

              <p style="margin-top: 30px;">We're excited to have you join us on this amazing journey! Our team will contact you shortly with more details about your trip.</p>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact us:</p>
              <ul>
                <li>📧 Email: Lsiaatech@gmail.com</li>
                <li>📱 Phone: +91 9263616263</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/user-dashboard" class="button">View Booking Details</a>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Lisaa Tours & Travels. All rights reserved.</p>
              <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send inquiry reply email to customer
const sendInquiryReplyEmail = async (inquiryData, replyMessage) => {
  try {
    if (!transporter) {
      console.warn('⚠️ Email service not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    const { inquiry, tour } = inquiryData;

    const mailOptions = {
      from: `"Lisaa Tours & Travels" <${process.env.EMAIL_USER || 'Lsiaatech@gmail.com'}>`,
      to: inquiry.email,
      subject: `Re: ${inquiry.subject} - Inquiry Response`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reply-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #FF6B35; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Inquiry Response</h1>
              <p>Response to your inquiry</p>
            </div>
            <div class="content">
              <p>Dear ${inquiry.name},</p>
              <p>Thank you for contacting <strong>Lisaa Tours & Travels</strong>!</p>
              
              <div class="reply-box">
                <h2 style="color: #FF6B35; margin-top: 0;">Your Original Inquiry</h2>
                <p><strong>Subject:</strong> ${inquiry.subject}</p>
                <p><strong>Message:</strong></p>
                <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${inquiry.message}</p>
                ${tour ? `<p><strong>Interested Package:</strong> ${tour.title} - ${tour.destination}</p>` : ''}
              </div>

              <div class="reply-box">
                <h2 style="color: #FF6B35; margin-top: 0;">Our Response</h2>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${replyMessage}</div>
              </div>

              <p style="margin-top: 30px;">We hope this information is helpful. If you have any further questions, please feel free to contact us:</p>
              <ul>
                <li>📧 Email: Lsiaatech@gmail.com</li>
                <li>📱 Phone: +91 9263616263</li>
              </ul>

              <p>Best regards,<br><strong>Lisaa Tours & Travels Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Lisaa Tours & Travels. All rights reserved.</p>
              <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Inquiry reply email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending inquiry reply email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendInquiryReplyEmail,
  initializeEmailService
};

