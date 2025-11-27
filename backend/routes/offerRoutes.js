const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const User = require('../models/User');
const { sendCouponAnnouncementEmail } = require('../services/emailService');
const { sendCouponAnnouncementWhatsApp } = require('../services/whatsappService');

const notifyCustomersAboutOffer = async (offerDoc) => {
  if (!offerDoc) return null;

  const offer = typeof offerDoc.toObject === 'function' ? offerDoc.toObject() : offerDoc;

  try {
    const customers = await User.find({ role: 'user', isActive: true })
      .select('name email phone');

    if (!customers.length) {
      return { totalCustomers: 0, emailSent: 0, whatsappSent: 0 };
    }

    let emailSent = 0;
    let whatsappSent = 0;

    for (const customer of customers) {
      if (customer.email) {
        try {
          const result = await sendCouponAnnouncementEmail(customer, offer);
          if (result?.success) emailSent += 1;
        } catch (error) {
          console.error(`Email notification failed for ${customer.email}:`, error.message || error);
        }
      }

      if (customer.phone) {
        try {
          const result = await sendCouponAnnouncementWhatsApp(customer, offer);
          if (result?.success) whatsappSent += 1;
        } catch (error) {
          console.error(`WhatsApp notification failed for ${customer.phone}:`, error.message || error);
        }
      }
    }

    return {
      totalCustomers: customers.length,
      emailSent,
      whatsappSent
    };
  } catch (error) {
    console.error('Bulk coupon notification error:', error);
    throw error;
  }
};

const queueOfferBroadcastIfActive = (offer) => {
  if (!offer || offer.status !== 'active') return;

  setImmediate(() => {
    notifyCustomersAboutOffer(offer)
      .then((summary) => console.log('📣 Coupon broadcast summary:', summary))
      .catch((error) => console.error('❌ Coupon broadcast failed:', error));
  });
};

// Get all offers
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const offers = await Offer.find(query)
      .populate('applicableTours', 'title destination')
      .sort({ createdAt: -1 });
    
    res.json(offers);
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get offer by ID
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('applicableTours', 'title destination price');
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    res.json(offer);
  } catch (error) {
    console.error('Get offer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create offer
router.post('/', async (req, res) => {
  try {
    const offerData = req.body;
    
    // Check if code already exists
    const existingOffer = await Offer.findOne({ code: offerData.code.toUpperCase() });
    if (existingOffer) {
      return res.status(400).json({ message: 'Offer code already exists' });
    }
    
    const offer = new Offer({
      ...offerData,
      code: offerData.code.toUpperCase()
    });
    
    await offer.save();
    await offer.populate('applicableTours', 'title destination');
    
    queueOfferBroadcastIfActive(offer);
    
    res.status(201).json({ 
      message: 'Offer created successfully',
      offer,
      notificationQueued: offer.status === 'active'
    });
  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update offer
router.put('/:id', async (req, res) => {
  try {
    const updateData = req.body;
    
    // If code is being updated, check for duplicates
    if (updateData.code) {
      const existingOffer = await Offer.findOne({ 
        code: updateData.code.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingOffer) {
        return res.status(400).json({ message: 'Offer code already exists' });
      }
      updateData.code = updateData.code.toUpperCase();
    }
    
    const existingOffer = await Offer.findById(req.params.id);
    if (!existingOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('applicableTours', 'title destination');
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    const shouldBroadcast = existingOffer.status !== 'active' && offer.status === 'active';
    if (shouldBroadcast) {
      queueOfferBroadcastIfActive(offer);
    }
    
    res.json({ 
      message: 'Offer updated successfully',
      offer,
      notificationQueued: shouldBroadcast
    });
  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message || 'Unknown error'
    });
  }
});

// Delete offer
router.delete('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Delete offer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Validate offer code (for booking flow)
router.post('/validate/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { amount, userId, tourId } = req.body;
    
    const offer = await Offer.findOne({ code: code.toUpperCase() });
    
    if (!offer) {
      return res.status(404).json({ message: 'Invalid offer code' });
    }
    
    // Check if offer is active
    if (offer.status !== 'active') {
      return res.status(400).json({ message: 'Offer is not active' });
    }
    
    // Check date validity
    const now = new Date();
    // Set startDate to beginning of day (00:00:00)
    const startDate = new Date(offer.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    // Set endDate to end of day (23:59:59.999) so it's valid for the entire day
    const endDate = new Date(offer.endDate);
    endDate.setHours(23, 59, 59, 999);
    
    // Set current date to beginning of day for comparison
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    if (today < startDate || today > endDate) {
      return res.status(400).json({ message: 'Offer has expired' });
    }
    
    // Check minimum amount
    if (amount < offer.minAmount) {
      return res.status(400).json({ 
        message: `Minimum amount of ₹${offer.minAmount} required for this offer` 
      });
    }
    
    // Check applicability
    if (!offer.applicableToAll) {
      // If not applicable to all, check specific restrictions
      if (tourId) {
        const Tour = require('../models/Tour');
        const tour = await Tour.findById(tourId);
        
        if (!tour) {
          return res.status(400).json({ message: 'Tour not found' });
        }

        // Check if tour is in applicableTours
        if (offer.applicableTours && offer.applicableTours.length > 0) {
          const isTourApplicable = offer.applicableTours.some(
            tourId => tourId.toString() === tour._id.toString()
          );
          if (!isTourApplicable) {
            return res.status(400).json({ 
              message: 'This offer is not applicable to the selected tour' 
            });
          }
        }
        
        // Check if city is applicable
        if (offer.applicableCities && offer.applicableCities.length > 0) {
          const isCityApplicable = offer.applicableCities.some(
            city => city.toLowerCase() === tour.city?.toLowerCase() || 
                    city.toLowerCase() === tour.citySlug?.toLowerCase()
          );
          if (!isCityApplicable) {
            return res.status(400).json({ 
              message: 'This offer is not applicable to tours in this city' 
            });
          }
        }
        
        // Check if state is applicable
        if (offer.applicableStates && offer.applicableStates.length > 0) {
          const isStateApplicable = offer.applicableStates.some(
            state => state.toLowerCase() === tour.state?.toLowerCase() || 
                     state.toLowerCase() === tour.stateSlug?.toLowerCase()
          );
          if (!isStateApplicable) {
            return res.status(400).json({ 
              message: 'This offer is not applicable to tours in this state' 
            });
          }
        }
      }
    }
    
    // Check usage limit
    if (offer.usageLimit && offer.usedCount >= offer.usageLimit) {
      return res.status(400).json({ message: 'Offer usage limit reached' });
    }
    
    // Calculate discount
    let discount = 0;
    if (offer.type === 'percentage') {
      discount = (amount * offer.value) / 100;
      if (offer.maxDiscount && discount > offer.maxDiscount) {
        discount = offer.maxDiscount;
      }
    } else {
      discount = offer.value;
    }
    
    res.json({
      valid: true,
      offer: {
        id: offer._id,
        code: offer.code,
        title: offer.title,
        type: offer.type,
        value: offer.value,
        discount: Math.round(discount),
        maxDiscount: offer.maxDiscount
      }
    });
  } catch (error) {
    console.error('Validate offer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

