import api from './api';

const destinationService = {
  // Get all destinations
  getAllDestinations: async (params = {}) => {
    try {
      const response = await api.get('/destinations', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get destinations');
    }
  },

  // Get destination by ID
  getDestinationById: async (destinationId) => {
    try {
      const response = await api.get(`/destinations/${destinationId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get destination');
    }
  },

  // Get popular destinations
  getPopularDestinations: async () => {
    try {
      const response = await api.get('/destinations?popular=true');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get popular destinations');
    }
  },

  // Create destination (admin)
  createDestination: async (destinationData) => {
    try {
      const response = await api.post('/destinations', destinationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create destination');
    }
  },

  // Update destination (admin)
  updateDestination: async (destinationId, destinationData) => {
    try {
      const response = await api.put(`/destinations/${destinationId}`, destinationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update destination');
    }
  },

  // Delete destination (admin)
  deleteDestination: async (destinationId) => {
    try {
      const response = await api.delete(`/destinations/${destinationId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete destination');
    }
  },
};

export default destinationService;
