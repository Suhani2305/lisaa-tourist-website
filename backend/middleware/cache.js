const NodeCache = require('node-cache');

// Create cache instance with 5 minute TTL (time to live)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Middleware to cache GET requests
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL and query params
    const cacheKey = `${req.originalUrl || req.url}`;

    // Check if data exists in cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('✅ Cache HIT:', cacheKey);
      return res.json(cachedData);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function (data) {
      // Convert Mongoose documents to plain objects before caching
      // This prevents errors with circular references and internal Mongoose methods
      let dataToCache = data;
      
      try {
        // Use JSON serialization to convert Mongoose documents to plain objects
        // This handles nested documents and arrays properly
        dataToCache = JSON.parse(JSON.stringify(data));
      } catch (error) {
        // If serialization fails, try to convert manually
        console.warn('⚠️ Cache serialization warning:', error.message);
        // Fallback: convert Mongoose documents to plain objects
        if (data && typeof data === 'object') {
          if (Array.isArray(data)) {
            dataToCache = data.map(item => {
              if (item && item.toObject && typeof item.toObject === 'function') {
                return item.toObject();
              }
              return item;
            });
          } else if (data.toObject && typeof data.toObject === 'function') {
            dataToCache = data.toObject();
          } else if (data.tours && Array.isArray(data.tours)) {
            // Handle nested tours array
            dataToCache = {
              ...data,
              tours: data.tours.map(tour => {
                if (tour && tour.toObject && typeof tour.toObject === 'function') {
                  return tour.toObject();
                }
                return tour;
              })
            };
          }
        }
      }
      
      // Cache the converted data
      cache.set(cacheKey, dataToCache, duration);
      console.log('💾 Cache SET:', cacheKey);
      
      // Call original json method with original data
      return originalJson(data);
    };

    next();
  };
};

// Clear cache for specific pattern
const clearCache = (pattern) => {
  const keys = cache.keys();
  const regex = new RegExp(pattern);
  let cleared = 0;
  
  keys.forEach(key => {
    if (regex.test(key)) {
      cache.del(key);
      cleared++;
    }
  });
  
  console.log(`🗑️ Cleared ${cleared} cache entries matching pattern: ${pattern}`);
  return cleared;
};

// Clear all cache
const clearAllCache = () => {
  cache.flushAll();
  console.log('🗑️ All cache cleared');
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearAllCache,
  cache
};

