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

// Shared email template function with modern responsive design
const getEmailTemplate = (options) => {
  const {
    title,
    subtitle,
    headerColor = '#FF6B35',
    content,
    buttonText,
    buttonLink,
    footerText
  } = options;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          background: linear-gradient(135deg, ${headerColor} 0%, #F7931E 100%);
          color: #ffffff;
          padding: 40px 30px;
          text-align: center;
        }
        .email-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #ffffff;
        }
        .email-header p {
          font-size: 16px;
          opacity: 0.95;
          margin: 0;
        }
        .email-body {
          padding: 40px 30px;
          background-color: #ffffff;
        }
        .email-content {
          color: #333333;
          font-size: 16px;
          line-height: 1.8;
        }
        .email-content p {
          margin-bottom: 16px;
        }
        .info-box {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-left: 4px solid ${headerColor};
          padding: 24px;
          margin: 24px 0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .info-box h2 {
          color: ${headerColor};
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
          margin-top: 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #6c757d;
          font-size: 14px;
        }
        .info-value {
          color: #212529;
          font-size: 15px;
          text-align: right;
          font-weight: 500;
        }
        .info-value strong {
          color: ${headerColor};
          font-size: 16px;
        }
        .button-container {
          text-align: center;
          margin: 32px 0;
        }
        .email-button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, ${headerColor} 0%, #F7931E 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
          transition: transform 0.2s;
        }
        .email-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
        }
        .highlight-box {
          background: #fff3e0;
          border: 2px solid #ff9800;
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
        }
        .highlight-box h3 {
          color: #e65100;
          margin-bottom: 12px;
          font-size: 18px;
        }
        .contact-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 24px 0;
        }
        .contact-info ul {
          list-style: none;
          padding: 0;
        }
        .contact-info li {
          padding: 8px 0;
          font-size: 15px;
        }
        .contact-info li strong {
          color: ${headerColor};
        }
        .email-footer {
          background-color: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        .email-footer p {
          color: #6c757d;
          font-size: 13px;
          margin: 8px 0;
        }
        .email-footer a {
          color: ${headerColor};
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            width: 100% !important;
            border-radius: 0 !important;
          }
          .email-header,
          .email-body,
          .email-footer {
            padding: 24px 20px !important;
          }
          .email-header h1 {
            font-size: 24px !important;
          }
          .info-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .info-value {
            text-align: left;
            margin-top: 4px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-header">
          <h1>${title}</h1>
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        <div class="email-body">
          <div class="email-content">
            ${content}
            ${buttonText && buttonLink ? `
              <div class="button-container">
                <a href="${buttonLink}" class="email-button">${buttonText}</a>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="email-footer">
          <p><strong>Lisaa Tours & Travels</strong></p>
          <p>📧 Email: <a href="mailto:Lsiaatech@gmail.com">Lsiaatech@gmail.com</a></p>
          <p>📱 Phone: <a href="tel:+919263616263">+91 9263616263</a></p>
          <p style="margin-top: 16px; color: #adb5bd; font-size: 12px;">
            © ${new Date().getFullYear()} Lisaa Tours & Travels. All rights reserved.
          </p>
          <p style="color: #adb5bd; font-size: 12px;">
            This is an automated email. Please do not reply directly to this message.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send booking reminder email (sent 3 days before travel)
const sendBookingReminderEmail = async (bookingData) => {
  try {
    if (!transporter) {
      console.warn('⚠️ Email service not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    const { user, tour, booking, bookingNumber } = bookingData;
    const travelDate = new Date(booking.travelDates?.startDate || booking.bookingDate);
    const daysUntilTravel = Math.ceil((travelDate - new Date()) / (1000 * 60 * 60 * 24));

    const content = `
      <p>Dear <strong>${user.name}</strong>,</p>
      
      <p>We're excited to remind you that your amazing journey with <strong>Lisaa Tours & Travels</strong> is just around the corner!</p>
      
      <div class="info-box">
        <h2>📅 Your Upcoming Trip</h2>
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
          <span class="info-label">Travel Date:</span>
          <span class="info-value"><strong>${travelDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">Days Remaining:</span>
          <span class="info-value"><strong style="color: #28a745;">${daysUntilTravel} Days</strong></span>
        </div>
      </div>

      <div class="highlight-box">
        <h3>📋 Important Reminders</h3>
        <ul style="margin-left: 20px; line-height: 2;">
          <li>Please arrive at the departure point 30 minutes before the scheduled time</li>
          <li>Carry a valid ID proof and booking confirmation</li>
          <li>Check weather conditions and pack accordingly</li>
          <li>Review the itinerary and contact information</li>
        </ul>
      </div>

      <p>Our team is here to ensure you have an unforgettable experience. If you have any last-minute questions or need assistance, please don't hesitate to contact us.</p>

      <div class="contact-info">
        <p><strong>Need Help?</strong></p>
        <ul>
          <li>📧 <strong>Email:</strong> Lsiaatech@gmail.com</li>
          <li>📱 <strong>Phone:</strong> +91 9263616263</li>
          <li>🕐 <strong>Support Hours:</strong> 9:00 AM - 8:00 PM (IST)</li>
        </ul>
      </div>

      <p>We look forward to welcoming you on this incredible adventure!</p>
      
      <p>Best regards,<br><strong>The Lisaa Tours & Travels Team</strong></p>
    `;

    const html = getEmailTemplate({
      title: '⏰ Reminder: Your Trip is Coming Soon!',
      subtitle: `Only ${daysUntilTravel} days until your adventure begins`,
      headerColor: '#28a745',
      content,
      buttonText: 'View Booking Details',
      buttonLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user-dashboard`
    });

    const mailOptions = {
      from: `"Lisaa Tours & Travels" <${process.env.EMAIL_USER || 'Lsiaatech@gmail.com'}>`,
      to: user.email,
      subject: `⏰ Reminder: Your Trip to ${tour.destination} in ${daysUntilTravel} Days`,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking reminder email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending booking reminder email:', error);
    return { success: false, error: error.message };
  }
};

// Send booking cancellation email
const sendBookingCancellationEmail = async (bookingData) => {
  try {
    if (!transporter) {
      console.warn('⚠️ Email service not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    const { user, tour, booking, bookingNumber } = bookingData;
    const refund = booking.cancellationRefund || {};
    const cancelledAt = refund.cancelledAt ? new Date(refund.cancelledAt) : new Date();

    let refundContent = '';
    if (refund.refundable && refund.refundAmount > 0) {
      refundContent = `
        <div class="highlight-box" style="background: #e8f5e9; border-color: #4caf50;">
          <h3 style="color: #2e7d32;">✅ Refund Information</h3>
          <div class="info-row">
            <span class="info-label">Total Amount Paid:</span>
            <span class="info-value">₹${refund.totalPaid?.toLocaleString() || booking.pricing?.finalAmount?.toLocaleString() || '0'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Refund Amount:</span>
            <span class="info-value"><strong style="color: #2e7d32;">₹${refund.refundAmount?.toLocaleString() || '0'}</strong></span>
          </div>
          <div class="info-row">
            <span class="info-label">Refund Percentage:</span>
            <span class="info-value"><strong>${refund.refundPercentage || 0}%</strong></span>
          </div>
          <div class="info-row">
            <span class="info-label">Cancellation Fee:</span>
            <span class="info-value">₹${refund.cancellationFee?.toLocaleString() || '0'}</span>
          </div>
          <p style="margin-top: 16px; color: #2e7d32; font-weight: 600;">
            💰 Your refund of ₹${refund.refundAmount?.toLocaleString() || '0'} will be processed within 5-7 business days to your original payment method.
          </p>
        </div>
      `;
    } else {
      refundContent = `
        <div class="highlight-box" style="background: #fff3e0; border-color: #ff9800;">
          <h3 style="color: #e65100;">⚠️ No Refund Applicable</h3>
          <p>As per our cancellation policy, no refund is applicable for this cancellation. The cancellation was made too close to the travel date or past the cancellation deadline.</p>
        </div>
      `;
    }

    const content = `
      <p>Dear <strong>${user.name}</strong>,</p>
      
      <p>We're sorry to see you cancel your booking with <strong>Lisaa Tours & Travels</strong>. We understand that plans can change, and we're here to help.</p>
      
      <div class="info-box">
        <h2>📋 Cancelled Booking Details</h2>
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
          <span class="info-label">Original Travel Date:</span>
          <span class="info-value">${new Date(booking.travelDates?.startDate || booking.bookingDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Cancelled On:</span>
          <span class="info-value">${cancelledAt.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      ${refundContent}

      <p>We hope to serve you again in the future. If you'd like to book a different tour or reschedule, please don't hesitate to contact us.</p>

      <div class="contact-info">
        <p><strong>Need Assistance?</strong></p>
        <ul>
          <li>📧 <strong>Email:</strong> Lsiaatech@gmail.com</li>
          <li>📱 <strong>Phone:</strong> +91 9263616263</li>
          <li>🕐 <strong>Support Hours:</strong> 9:00 AM - 8:00 PM (IST)</li>
        </ul>
      </div>

      <p>Thank you for considering Lisaa Tours & Travels. We look forward to welcoming you on a future adventure!</p>
      
      <p>Best regards,<br><strong>The Lisaa Tours & Travels Team</strong></p>
    `;

    const html = getEmailTemplate({
      title: '❌ Booking Cancelled',
      subtitle: 'We\'re sorry to see you go',
      headerColor: '#dc3545',
      content,
      buttonText: 'Book Another Tour',
      buttonLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/package`
    });

    const mailOptions = {
      from: `"Lisaa Tours & Travels" <${process.env.EMAIL_USER || 'Lsiaatech@gmail.com'}>`,
      to: user.email,
      subject: `❌ Booking Cancelled - ${bookingNumber}`,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking cancellation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending booking cancellation email:', error);
    return { success: false, error: error.message };
  }
};

// Send review request email (sent after journey completion)
const sendReviewRequestEmail = async (bookingData) => {
  try {
    if (!transporter) {
      console.warn('⚠️ Email service not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    const { user, tour, booking, bookingNumber } = bookingData;
    const travelDate = new Date(booking.travelDates?.endDate || booking.travelDates?.startDate || booking.bookingDate);
    const packageUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/package/${tour._id || tour}`;
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user-dashboard`;

    const content = `
      <p>Dear <strong>${user.name}</strong>,</p>
      
      <p>We hope you had an absolutely wonderful time on your recent journey with <strong>Lisaa Tours & Travels</strong>! 🌟</p>
      
      <div class="info-box">
        <h2>✈️ Your Completed Journey</h2>
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
          <span class="info-label">Journey Completed:</span>
          <span class="info-value">${travelDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div class="highlight-box" style="background: #fff3cd; border-color: #ffc107; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #856404; margin-top: 0;">⭐ Share Your Experience!</h3>
        <p style="font-size: 16px; line-height: 1.8;">Your feedback is incredibly valuable to us and helps other travelers make informed decisions. We would love to hear about your experience!</p>
        <p style="margin-top: 12px;">
          <strong>Please take a moment to:</strong>
        </p>
        <ul style="margin-left: 20px; line-height: 2.2; font-size: 15px;">
          <li>⭐ Rate your experience (1-5 stars)</li>
          <li>📝 Write a review about your journey</li>
          <li>📸 Share your favorite moments (optional)</li>
          <li>💬 Help other travelers discover amazing destinations</li>
        </ul>
      </div>

      <p style="font-size: 15px;">Your review helps us improve our services and assists fellow travelers in planning their perfect trip. Every review makes a difference! 🙏</p>

      <div class="contact-info">
        <p><strong>Quick Links:</strong></p>
        <ul>
          <li>📝 <a href="${packageUrl}" style="color: #FF6B35; text-decoration: none; font-weight: bold;">Leave a Review for ${tour.title}</a></li>
          <li>📊 <a href="${dashboardUrl}" style="color: #FF6B35; text-decoration: none; font-weight: bold;">View Your Bookings & Reviews</a></li>
        </ul>
      </div>

      <p>Thank you for choosing Lisaa Tours & Travels. We look forward to serving you again on your next adventure! 🗺️</p>
      
      <p>Warm regards,<br><strong>The Lisaa Tours & Travels Team</strong></p>
    `;

    const html = getEmailTemplate({
      title: '⭐ Share Your Experience!',
      subtitle: 'We\'d love to hear about your journey',
      headerColor: '#FF6B35',
      content,
      buttonText: 'Leave a Review Now',
      buttonLink: packageUrl
    });

    const mailOptions = {
      from: `"Lisaa Tours & Travels" <${process.env.EMAIL_USER || 'Lsiaatech@gmail.com'}>`,
      to: user.email,
      subject: `⭐ Share Your Experience - Review Request for ${tour.title}`,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Review request email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending review request email:', error);
    return { success: false, error: error.message };
  }
};

// Send follow-up email (sent 2 days after trip completion)
const sendBookingFollowUpEmail = async (bookingData) => {
  try {
    if (!transporter) {
      console.warn('⚠️ Email service not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    const { user, tour, booking, bookingNumber } = bookingData;
    const travelDate = new Date(booking.travelDates?.startDate || booking.bookingDate);

    const content = `
      <p>Dear <strong>${user.name}</strong>,</p>
      
      <p>We hope you had an absolutely amazing time on your recent trip with <strong>Lisaa Tours & Travels</strong>! 🌟</p>
      
      <div class="info-box">
        <h2>✈️ Your Recent Trip</h2>
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
          <span class="info-label">Travel Date:</span>
          <span class="info-value">${travelDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div class="highlight-box" style="background: #e3f2fd; border-color: #2196f3;">
        <h3 style="color: #1565c0;">💬 We'd Love Your Feedback!</h3>
        <p>Your experience matters to us! Please take a moment to share your thoughts and help us improve our services.</p>
        <p style="margin-top: 12px;">
          <strong>Your feedback helps us:</strong>
        </p>
        <ul style="margin-left: 20px; line-height: 2;">
          <li>Improve our tour packages and services</li>
          <li>Better serve future travelers</li>
          <li>Create even more amazing experiences</li>
        </ul>
      </div>

      <p>If you enjoyed your trip, we'd be thrilled if you could share your experience with others. Your reviews help fellow travelers discover amazing destinations!</p>

      <div class="contact-info">
        <p><strong>Share Your Experience</strong></p>
        <ul>
          <li>⭐ Leave a review on our website</li>
          <li>📸 Share your photos on social media and tag us</li>
          <li>💬 Tell your friends and family about your adventure</li>
        </ul>
      </div>

      <p>We're always planning new and exciting tours. If you're ready for your next adventure, check out our latest packages!</p>

      <div class="contact-info">
        <p><strong>Plan Your Next Adventure</strong></p>
        <ul>
          <li>📧 <strong>Email:</strong> Lsiaatech@gmail.com</li>
          <li>📱 <strong>Phone:</strong> +91 9263616263</li>
          <li>🌐 <strong>Website:</strong> Visit our website to explore more destinations</li>
        </ul>
      </div>

      <p>Thank you for choosing Lisaa Tours & Travels. We hope to see you again soon!</p>
      
      <p>Warm regards,<br><strong>The Lisaa Tours & Travels Team</strong></p>
    `;

    const html = getEmailTemplate({
      title: '🌟 How Was Your Trip?',
      subtitle: 'We\'d love to hear about your experience',
      headerColor: '#2196f3',
      content,
      buttonText: 'Leave a Review',
      buttonLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user-dashboard`
    });

    const mailOptions = {
      from: `"Lisaa Tours & Travels" <${process.env.EMAIL_USER || 'Lsiaatech@gmail.com'}>`,
      to: user.email,
      subject: `🌟 How Was Your Trip to ${tour.destination}?`,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking follow-up email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending booking follow-up email:', error);
    return { success: false, error: error.message };
  }
};

// Update existing booking confirmation email to use new template
const sendBookingConfirmationEmailUpdated = async (bookingData) => {
  try {
    if (!transporter) {
      console.warn('⚠️ Email service not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    const { user, tour, booking, bookingNumber } = bookingData;

    const travelersInfo = Array.isArray(booking.travelers) && booking.travelers.length > 0
      ? booking.travelers.map(t => `${t.name} (${t.type}, Age: ${t.age})`).join('<br>')
      : `${booking.travelers?.adults || 0} Adults, ${booking.travelers?.children || 0} Children`;

    const content = `
      <p>Dear <strong>${user.name}</strong>,</p>
      
      <p>Thank you for booking with <strong>Lisaa Tours & Travels</strong>! We're thrilled to have you join us on this incredible journey. 🎉</p>
      
      <div class="info-box">
        <h2>📋 Booking Details</h2>
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
          <span class="info-value"><strong>${new Date(booking.travelDates?.startDate || booking.bookingDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">Travelers:</span>
          <span class="info-value">${travelersInfo}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Total Amount:</span>
          <span class="info-value"><strong>₹${(booking.pricing?.finalAmount || booking.totalAmount || 0).toLocaleString()}</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">Payment Status:</span>
          <span class="info-value" style="color: #28a745;"><strong>✅ Paid</strong></span>
        </div>
        ${booking.payment?.transactionId ? `
        <div class="info-row">
          <span class="info-label">Transaction ID:</span>
          <span class="info-value" style="font-size: 12px;">${booking.payment.transactionId}</span>
        </div>
        ` : ''}
        ${booking.appliedCoupon ? `
        <div class="info-row">
          <span class="info-label">Applied Coupon:</span>
          <span class="info-value"><strong style="color: #28a745;">${booking.appliedCoupon.code}</strong> (₹${booking.appliedCoupon.discountAmount?.toLocaleString() || '0'} off)</span>
        </div>
        ` : ''}
      </div>

      <div class="highlight-box">
        <h3>📝 What's Next?</h3>
        <ul style="margin-left: 20px; line-height: 2;">
          <li>Our team will contact you within 24 hours with detailed itinerary</li>
          <li>You'll receive a reminder email 3 days before your travel date</li>
          <li>Please keep this booking confirmation for your records</li>
          <li>If you have any questions, feel free to reach out to us</li>
        </ul>
      </div>

      <p>We're excited to create unforgettable memories with you! Our team is dedicated to ensuring you have an amazing experience.</p>

      <div class="contact-info">
        <p><strong>Need Help?</strong></p>
        <ul>
          <li>📧 <strong>Email:</strong> Lsiaatech@gmail.com</li>
          <li>📱 <strong>Phone:</strong> +91 9263616263</li>
          <li>🕐 <strong>Support Hours:</strong> 9:00 AM - 8:00 PM (IST)</li>
        </ul>
      </div>

      <p>Thank you for choosing Lisaa Tours & Travels. We can't wait to welcome you!</p>
      
      <p>Best regards,<br><strong>The Lisaa Tours & Travels Team</strong></p>
    `;

    const html = getEmailTemplate({
      title: '🎉 Booking Confirmed!',
      subtitle: 'Your adventure awaits',
      headerColor: '#FF6B35',
      content,
      buttonText: 'View Booking Details',
      buttonLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user-dashboard`
    });

    const mailOptions = {
      from: `"Lisaa Tours & Travels" <${process.env.EMAIL_USER || 'Lsiaatech@gmail.com'}>`,
      to: user.email,
      subject: `🎉 Booking Confirmed - ${bookingNumber}`,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmationEmail: sendBookingConfirmationEmailUpdated,
  sendBookingReminderEmail,
  sendBookingCancellationEmail,
  sendBookingFollowUpEmail,
  sendReviewRequestEmail,
  sendInquiryReplyEmail,
  initializeEmailService
};

