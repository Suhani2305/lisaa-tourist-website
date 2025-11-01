import api from './api';

const stateService = {
  getAllStates: async (params = {}) => {
    try {
      const response = await api.get('/states', { params });
      // Backend now returns array directly, or { states, total } for backward compatibility
      return Array.isArray(response.data) ? response.data : (response.data.states || response.data || []);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get states');
    }
  },

  getStateBySlug: async (slug) => {
    try {
      const response = await api.get(`/states/${slug}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get state');
    }
  },

  createState: async (stateData) => {
    try {
      const response = await api.post('/states', stateData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create state';
      if (error.response?.status === 400) {
        throw new Error(errorMessage);
      }
      throw new Error(errorMessage);
    }
  },

  updateState: async (stateId, stateData) => {
    try {
      const response = await api.put(`/states/${stateId}`, stateData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update state';
      if (error.response?.status === 400) {
        throw new Error(errorMessage);
      }
      throw new Error(errorMessage);
    }
  },

  deleteState: async (stateId) => {
    try {
      const response = await api.delete(`/states/${stateId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete state');
    }
  },

  // City methods
  getAllCities: async (params = {}) => {
    try {
      const response = await api.get('/cities', { params });
      return response.data.cities || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get cities');
    }
  },

  getCityBySlug: async (stateSlug, citySlug) => {
    try {
      const response = await api.get(`/cities/${stateSlug}/${citySlug}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get city');
    }
  },

  createCity: async (cityData) => {
    try {
      const response = await api.post('/cities', cityData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create city';
      if (error.response?.status === 400) {
        throw new Error(errorMessage);
      }
      throw new Error(errorMessage);
    }
  },

  updateCity: async (cityId, cityData) => {
    try {
      const response = await api.put(`/cities/${cityId}`, cityData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update city';
      if (error.response?.status === 400) {
        throw new Error(errorMessage);
      }
      throw new Error(errorMessage);
    }
  },

  deleteCity: async (cityId) => {
    try {
      const response = await api.delete(`/cities/${cityId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete city');
    }
  },
};

export default stateService;

