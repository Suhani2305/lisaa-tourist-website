import api from './api';

const offerService = {
  // Get all offers
  getAllOffers: async (params = {}) => {
    try {
      const response = await api.get('/offers', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch offers');
    }
  },

  // Get offer by ID
  getOfferById: async (offerId) => {
    try {
      const response = await api.get(`/offers/${offerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch offer');
    }
  },

  // Create offer
  createOffer: async (offerData) => {
    try {
      const response = await api.post('/offers', offerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create offer');
    }
  },

  // Update offer
  updateOffer: async (offerId, offerData) => {
    try {
      const response = await api.put(`/offers/${offerId}`, offerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update offer');
    }
  },

  // Delete offer
  deleteOffer: async (offerId) => {
    try {
      const response = await api.delete(`/offers/${offerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete offer');
    }
  },

  // Validate offer code
  validateOffer: async (code, amount, userId) => {
    try {
      const response = await api.post(`/offers/validate/${code}`, { amount, userId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Invalid offer code');
    }
  }
};

export default offerService;

