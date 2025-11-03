const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Create receipts directory if it doesn't exist
const receiptsDir = path.join(__dirname, '../receipts');
if (!fs.existsSync(receiptsDir)) {
  fs.mkdirSync(receiptsDir, { recursive: true });
}

// Generate PDF receipt
const generateReceiptPDF = async (bookingData) => {
  try {
    const { user, tour, booking, bookingNumber } = bookingData;
    
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Generate filename
    const filename = `receipt_${bookingNumber}_${Date.now()}.pdf`;
    const filepath = path.join(receiptsDir, filename);

    // Create write stream
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).fillColor('#FF6B35').text('Lisaa Tours & Travels', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#666').text('Payment Receipt', { align: 'center' });
    doc.moveDown(1);

    // Line separator
    doc.strokeColor('#FF6B35').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Booking Information
    doc.fontSize(16).fillColor('#333').text('Booking Information', { underline: true });
    doc.moveDown(0.5);
    
    doc.fontSize(11).fillColor('#666');
    doc.text(`Booking Number: ${bookingNumber}`, { indent: 20 });
    doc.text(`Booking Date: ${new Date(booking.createdAt || new Date()).toLocaleDateString('en-IN')}`, { indent: 20 });
    doc.moveDown(0.5);

    // Customer Information
    doc.fontSize(16).fillColor('#333').text('Customer Information', { underline: true });
    doc.moveDown(0.5);
    
    doc.fontSize(11).fillColor('#666');
    doc.text(`Name: ${user.name}`, { indent: 20 });
    doc.text(`Email: ${user.email}`, { indent: 20 });
    doc.text(`Phone: ${user.phone || booking.contactInfo?.phone || 'N/A'}`, { indent: 20 });
    doc.moveDown(0.5);

    // Tour Details
    doc.fontSize(16).fillColor('#333').text('Tour Details', { underline: true });
    doc.moveDown(0.5);
    
    doc.fontSize(11).fillColor('#666');
    doc.text(`Package: ${tour.title}`, { indent: 20 });
    doc.text(`Destination: ${tour.destination}`, { indent: 20 });
    doc.text(`Duration: ${tour.duration?.days || 'N/A'} Days / ${tour.duration?.nights || 'N/A'} Nights`, { indent: 20 });
    doc.text(`Travel Date: ${new Date(booking.travelDates?.startDate || booking.bookingDate).toLocaleDateString('en-IN')}`, { indent: 20 });
    doc.moveDown(0.5);

    // Travelers
    doc.fontSize(16).fillColor('#333').text('Travelers', { underline: true });
    doc.moveDown(0.5);
    
    doc.fontSize(11).fillColor('#666');
    doc.text(`Adults: ${booking.travelers?.adults || 0}`, { indent: 20 });
    doc.text(`Children: ${booking.travelers?.children || 0}`, { indent: 20 });
    doc.moveDown(1);

    // Payment Details
    doc.fontSize(16).fillColor('#333').text('Payment Details', { underline: true });
    doc.moveDown(0.5);

    const basePrice = booking.pricing?.basePrice || booking.totalAmount || 0;
    const discount = booking.pricing?.discount || 0;
    const taxes = booking.pricing?.taxes || 0;
    const finalAmount = booking.pricing?.finalAmount || booking.totalAmount || 0;

    doc.fontSize(11).fillColor('#666');
    
    // Payment table
    doc.text(`Base Amount:`, 100, doc.y);
    doc.text(`₹${basePrice.toLocaleString('en-IN')}`, 400, doc.y, { align: 'right', width: 100 });
    doc.moveDown(0.3);

    if (discount > 0) {
      doc.text(`Discount:`, 100, doc.y);
      doc.text(`-₹${discount.toLocaleString('en-IN')}`, 400, doc.y, { align: 'right', width: 100, fillColor: '#28a745' });
      doc.moveDown(0.3);
    }

    if (taxes > 0) {
      doc.text(`Taxes & Fees:`, 100, doc.y);
      doc.text(`₹${taxes.toLocaleString('en-IN')}`, 400, doc.y, { align: 'right', width: 100 });
      doc.moveDown(0.3);
    }

    doc.moveDown(0.5);
    doc.strokeColor('#ddd').lineWidth(1).moveTo(100, doc.y).lineTo(500, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(14).fillColor('#333').font('Helvetica-Bold');
    doc.text(`Total Amount:`, 100, doc.y);
    doc.text(`₹${finalAmount.toLocaleString('en-IN')}`, 400, doc.y, { align: 'right', width: 100 });
    doc.font('Helvetica').fontSize(11);
    doc.moveDown(1);

    doc.fontSize(11).fillColor('#666');
    doc.text(`Payment Method: ${booking.payment?.method || 'Razorpay'}`, { indent: 20 });
    doc.text(`Transaction ID: ${booking.payment?.transactionId || booking.paymentId || 'N/A'}`, { indent: 20 });
    doc.text(`Payment Status: Paid`, { indent: 20, fillColor: '#28a745' });
    doc.moveDown(1);

    // Footer
    doc.moveDown(2);
    doc.strokeColor('#FF6B35').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);
    
    doc.fontSize(10).fillColor('#999').text('Thank you for choosing Lisaa Tours & Travels!', { align: 'center' });
    doc.moveDown(0.3);
    doc.text('For any queries, contact us at:', { align: 'center' });
    doc.moveDown(0.3);
    doc.text('Email: Lsiaatech@gmail.com | Phone: +91 9263616263', { align: 'center' });
    doc.moveDown(0.5);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, { align: 'center' });

    // Finalize PDF
    doc.end();

    // Wait for PDF to be generated
    await new Promise((resolve, reject) => {
      stream.on('finish', () => {
        console.log('✅ Receipt PDF generated:', filepath);
        resolve(filepath);
      });
      stream.on('error', reject);
    });

    return {
      success: true,
      filepath,
      filename,
      url: `/receipts/${filename}`
    };
  } catch (error) {
    console.error('❌ Error generating receipt PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Serve receipt file
const getReceiptPath = (filename) => {
  return path.join(receiptsDir, filename);
};

module.exports = {
  generateReceiptPDF,
  getReceiptPath
};

