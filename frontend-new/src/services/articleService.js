import api from './api';

const articleService = {
  // Get all articles
  getAllArticles: async (params = {}) => {
    try {
      const response = await api.get('/articles', { params });
      return response.data.articles || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get articles');
    }
  },

  // Get article by ID
  getArticleById: async (articleId) => {
    try {
      const response = await api.get(`/articles/${articleId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get article');
    }
  },

  // Create article
  createArticle: async (articleData) => {
    try {
      console.log('🚀 Creating article with data:', articleData);
      const response = await api.post('/articles', articleData);
      console.log('✅ Article created response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create article error:', error);
      console.error('❌ Response data:', error.response?.data);
      
      if (error.response?.data?.errors) {
        const errorMsg = error.response.data.errors.map(e => `• ${e.field}: ${e.message}`).join('\n');
        throw new Error(`Validation errors:\n${errorMsg}`);
      }
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to create article');
    }
  },

  // Update article
  updateArticle: async (articleId, articleData) => {
    try {
      const response = await api.put(`/articles/${articleId}`, articleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update article');
    }
  },

  // Delete article
  deleteArticle: async (articleId) => {
    try {
      const response = await api.delete(`/articles/${articleId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete article');
    }
  },

  // Update article status
  updateArticleStatus: async (articleId, status) => {
    try {
      const response = await api.patch(`/articles/${articleId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update article status');
    }
  },

  // Like article
  likeArticle: async (articleId) => {
    try {
      const response = await api.post(`/articles/${articleId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to like article');
    }
  },

  // Share article
  shareArticle: async (articleId) => {
    try {
      const response = await api.post(`/articles/${articleId}/share`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to share article');
    }
  },
};

export default articleService;


