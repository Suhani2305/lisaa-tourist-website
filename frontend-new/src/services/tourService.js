import api from './api';

const tourService = {
  // Get all tours
  getAllTours: async (params = {}) => {
    try {
      const response = await api.get('/tours', { params });
      // Backend returns { tours, totalPages, currentPage, total }
      // Return just the tours array for easier use
      return response.data.tours || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get tours');
    }
  },

  // Get tour by ID
  getTourById: async (tourId) => {
    try {
      const response = await api.get(`/tours/${tourId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get tour');
    }
  },

  // Search tours
  searchTours: async (searchParams) => {
    try {
      const response = await api.get('/tours/search', { params: searchParams });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search tours');
    }
  },

  // Get featured tours
  getFeaturedTours: async () => {
    try {
      const response = await api.get('/tours?featured=true');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get featured tours');
    }
  },

  // Create tour (admin)
  createTour: async (tourData) => {
    try {
      console.log('🚀 Creating tour with data:', tourData);
      const response = await api.post('/tours', tourData);
      console.log('✅ Tour created response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create tour error:', error);
      console.error('❌ Response data:', error.response?.data);
      
      // Handle duplicate key error (MongoDB E11000)
      if (error.response?.data?.message && error.response.data.message.includes('E11000')) {
        if (error.response.data.message.includes('title')) {
          throw new Error('❌ This package title already exists! Please use a different title.');
        }
        throw new Error('❌ Duplicate entry found! Please check your data.');
      }
      
      // Show detailed validation errors
      if (error.response?.data?.errors) {
        const errorMsg = error.response.data.errors.map(e => `• ${e.field}: ${e.message}`).join('\n');
        throw new Error(`Validation errors:\n${errorMsg}`);
      }
      
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to create tour');
    }
  },

  // Update tour (admin)
  updateTour: async (tourId, tourData) => {
    try {
      const response = await api.put(`/tours/${tourId}`, tourData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update tour');
    }
  },

  // Delete tour (admin)
  deleteTour: async (tourId) => {
    try {
      const response = await api.delete(`/tours/${tourId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete tour');
    }
  },

  // Get tour statistics (admin)
  getTourStats: async () => {
    try {
      const response = await api.get('/tours/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get tour statistics');
    }
  },
};

export default tourService;
