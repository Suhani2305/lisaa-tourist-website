import api from './api';

const mediaService = {
  // Get all media files
  getAllMedia: async (params = {}) => {
    try {
      const response = await api.get('/media', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch media files');
    }
  },

  // Get media by ID
  getMediaById: async (mediaId) => {
    try {
      const response = await api.get(`/media/${mediaId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch media file');
    }
  },

  // Create media file
  createMedia: async (mediaData) => {
    try {
      const response = await api.post('/media', mediaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create media file');
    }
  },

  // Update media file
  updateMedia: async (mediaId, mediaData) => {
    try {
      const response = await api.put(`/media/${mediaId}`, mediaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update media file');
    }
  },

  // Delete media file
  deleteMedia: async (mediaId) => {
    try {
      const response = await api.delete(`/media/${mediaId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete media file');
    }
  },

  // Increment downloads
  incrementDownloads: async (mediaId) => {
    try {
      const response = await api.post(`/media/${mediaId}/download`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update download count');
    }
  },

  // Increment likes
  incrementLikes: async (mediaId) => {
    try {
      const response = await api.post(`/media/${mediaId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update like count');
    }
  }
};

export default mediaService;

