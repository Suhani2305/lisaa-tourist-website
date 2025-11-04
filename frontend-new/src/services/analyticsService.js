import api from './api';

const analyticsService = {
  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard analytics');
    }
  },

  // Get revenue trends
  getRevenueTrends: async (period = 'month') => {
    try {
      const response = await api.get('/analytics/revenue-trends', { params: { period } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch revenue trends');
    }
  },

  // Get booking trends
  getBookingTrends: async (period = 'month') => {
    try {
      const response = await api.get('/analytics/booking-trends', { params: { period } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking trends');
    }
  },

  // Get popular destinations
  getPopularDestinations: async () => {
    try {
      const response = await api.get('/analytics/popular-destinations');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch popular destinations');
    }
  },

  // Get customer demographics
  getCustomerDemographics: async () => {
    try {
      const response = await api.get('/analytics/customer-demographics');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch customer demographics');
    }
  }
};

export default analyticsService;

