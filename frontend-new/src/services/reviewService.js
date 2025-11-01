import api from './api';

const reviewService = {
  // Get all reviews
  getAllReviews: async (params = {}) => {
    try {
      const response = await api.get('/reviews', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get reviews');
    }
  },

  // Get reviews for a specific tour
  getTourReviews: async (tourId) => {
    try {
      const response = await api.get(`/reviews/tour/${tourId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get tour reviews');
    }
  },

  // Get reviews by user
  getUserReviews: async () => {
    try {
      const response = await api.get('/reviews/user');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user reviews');
    }
  },

  // Create a review
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  },
};

export default reviewService;
