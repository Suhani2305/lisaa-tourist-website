import api from './api';

const inquiryService = {
  // Create inquiry (Public - Contact Form)
  createInquiry: async (inquiryData) => {
    try {
      const response = await api.post('/inquiries', inquiryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit inquiry');
    }
  },

  // Get all inquiries (Admin only)
  getAllInquiries: async (params = {}) => {
    try {
      const response = await api.get('/inquiries', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get inquiries');
    }
  },

  // Get single inquiry (Admin only)
  getInquiryById: async (id) => {
    try {
      const response = await api.get(`/inquiries/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get inquiry');
    }
  },

  // Update inquiry (Admin only)
  updateInquiry: async (id, updateData) => {
    try {
      const response = await api.put(`/inquiries/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update inquiry');
    }
  },

  // Delete inquiry (Admin only)
  deleteInquiry: async (id) => {
    try {
      const response = await api.delete(`/inquiries/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete inquiry');
    }
  },

  // Get inquiry statistics (Admin only)
  getInquiryStats: async () => {
    try {
      const response = await api.get('/inquiries/stats/overview');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get inquiry statistics');
    }
  }
};

export default inquiryService;

