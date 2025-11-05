import api from './api';

const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    try {
      const response = await api.get('/wishlist');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get wishlist');
    }
  },

  // Check if tour is in wishlist
  checkWishlist: async (tourId) => {
    try {
      const response = await api.get(`/wishlist/check/${tourId}`);
      return response.data.isInWishlist;
    } catch (error) {
      // If unauthorized, return false
      if (error.response?.status === 401) {
        return false;
      }
      throw new Error(error.response?.data?.message || 'Failed to check wishlist');
    }
  },

  // Add to wishlist
  addToWishlist: async (tourId) => {
    try {
      const response = await api.post('/wishlist', { tourId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (tourId) => {
    try {
      const response = await api.delete(`/wishlist/${tourId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  },

  // Clear wishlist
  clearWishlist: async () => {
    try {
      const response = await api.delete('/wishlist');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to clear wishlist');
    }
  },
};

export default wishlistService;

