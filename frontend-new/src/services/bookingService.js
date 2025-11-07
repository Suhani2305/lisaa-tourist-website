import api from './api';

const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  },

  // Get all bookings for current user
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings/user');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get bookings');
    }
  },

  // Alias for getUserBookings (for compatibility)
  getMyBookings: async () => {
    try {
      const response = await api.get('/bookings/user');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get bookings');
    }
  },

  // Get all bookings (admin)
  getAllBookings: async (params = {}) => {
    try {
      const response = await api.get('/bookings/admin/all', { params });
      return response.data.bookings || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get bookings');
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get booking');
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update booking status');
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  },

  // Get booking statistics (admin)
  getBookingStats: async () => {
    try {
      const response = await api.get('/bookings/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get booking statistics');
    }
  },

  // Request booking modification
  requestModification: async (bookingId, modificationData) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/modify`, modificationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to request modification');
    }
  },

  // Update special requests
  updateSpecialRequests: async (bookingId, specialRequests) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/special-requests`, { specialRequests });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update special requests');
    }
  },

  // Get modification requests (admin)
  getModificationRequests: async (status = 'pending') => {
    try {
      const response = await api.get('/bookings/admin/modification-requests', { params: { status } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get modification requests');
    }
  },

  // Approve/Reject modification request (admin)
  processModificationRequest: async (bookingId, requestId, action, adminNotes) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/modify/${requestId}`, { action, adminNotes });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to process modification request');
    }
  },
};

export default bookingService;
