import api from './api';
import authService from './authService';

const GUEST_WISHLIST_KEY = 'guestWishlist';

const wishlistService = {
  // Get guest wishlist from localStorage
  getGuestWishlist: () => {
    try {
      const guestWishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
      return guestWishlist ? JSON.parse(guestWishlist) : [];
    } catch (error) {
      console.error('Error reading guest wishlist:', error);
      return [];
    }
  },

  // Save guest wishlist to localStorage
  saveGuestWishlist: (tourIds) => {
    try {
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(tourIds));
    } catch (error) {
      console.error('Error saving guest wishlist:', error);
    }
  },

  // Add tour to guest wishlist
  addToGuestWishlist: (tourId) => {
    const guestWishlist = wishlistService.getGuestWishlist();
    if (!guestWishlist.includes(tourId)) {
      guestWishlist.push(tourId);
      wishlistService.saveGuestWishlist(guestWishlist);
    }
  },

  // Remove tour from guest wishlist
  removeFromGuestWishlist: (tourId) => {
    const guestWishlist = wishlistService.getGuestWishlist();
    const updatedWishlist = guestWishlist.filter(id => id !== tourId);
    wishlistService.saveGuestWishlist(updatedWishlist);
  },

  // Check if tour is in guest wishlist
  isInGuestWishlist: (tourId) => {
    const guestWishlist = wishlistService.getGuestWishlist();
    return guestWishlist.includes(tourId);
  },

  // Clear guest wishlist
  clearGuestWishlist: () => {
    localStorage.removeItem(GUEST_WISHLIST_KEY);
  },

  // Sync guest wishlist to backend after login
  syncGuestWishlist: async () => {
    if (!authService.isAuthenticated()) {
      return;
    }

    const guestWishlist = wishlistService.getGuestWishlist();
    if (guestWishlist.length === 0) {
      return;
    }

    try {
      // Add each tour from guest wishlist to backend
      const syncPromises = guestWishlist.map(tourId => 
        wishlistService.addToWishlist(tourId).catch(error => {
          // If tour already exists in backend wishlist, that's okay
          if (error.message && error.message.includes('already in wishlist')) {
            return null;
          }
          throw error;
        })
      );

      await Promise.all(syncPromises);
      
      // Clear guest wishlist after successful sync
      wishlistService.clearGuestWishlist();
    } catch (error) {
      console.error('Error syncing guest wishlist:', error);
      // Don't throw - we don't want to block the login process
    }
  },

  // Get user's wishlist (combines backend and guest if not authenticated)
  getWishlist: async () => {
    if (authService.isAuthenticated()) {
      try {
        const response = await api.get('/wishlist');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to get wishlist');
      }
    } else {
      // Return guest wishlist format
      const guestWishlist = wishlistService.getGuestWishlist();
      return guestWishlist.map(tourId => ({ tour: tourId }));
    }
  },

  // Check if tour is in wishlist (checks both guest and backend)
  checkWishlist: async (tourId) => {
    // First check guest wishlist if not authenticated
    if (!authService.isAuthenticated()) {
      return wishlistService.isInGuestWishlist(tourId);
    }

    // Check backend wishlist if authenticated
    try {
      const response = await api.get(`/wishlist/check/${tourId}`);
      return response.data.isInWishlist;
    } catch (error) {
      // If unauthorized, check guest wishlist as fallback
      if (error.response?.status === 401) {
        return wishlistService.isInGuestWishlist(tourId);
      }
      throw new Error(error.response?.data?.message || 'Failed to check wishlist');
    }
  },

  // Add to wishlist (handles both guest and authenticated)
  addToWishlist: async (tourId) => {
    if (authService.isAuthenticated()) {
      try {
        const response = await api.post('/wishlist', { tourId });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add to wishlist');
      }
    } else {
      // Add to guest wishlist
      wishlistService.addToGuestWishlist(tourId);
      return { message: 'Tour added to wishlist', tourId };
    }
  },

  // Remove from wishlist (handles both guest and authenticated)
  removeFromWishlist: async (tourId) => {
    if (authService.isAuthenticated()) {
      try {
        const response = await api.delete(`/wishlist/${tourId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
      }
    } else {
      // Remove from guest wishlist
      wishlistService.removeFromGuestWishlist(tourId);
      return { message: 'Tour removed from wishlist', tourId };
    }
  },

  // Clear wishlist (handles both guest and authenticated)
  clearWishlist: async () => {
    if (authService.isAuthenticated()) {
      try {
        const response = await api.delete('/wishlist');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to clear wishlist');
      }
    } else {
      // Clear guest wishlist
      wishlistService.clearGuestWishlist();
      return { message: 'Wishlist cleared' };
    }
  },
};

export default wishlistService;

