import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tourService } from '../../services';
import { Spin, message } from 'antd';

const PackageDestinations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get trendingCategory from URL params
  const urlParams = new URLSearchParams(location.search);
  const urlTrendingCategory = urlParams.get('category') || urlParams.get('trendingCategory');
  
  const [filters, setFilters] = useState({
    category: 'All',
    trendingCategory: urlTrendingCategory || '', // Add trendingCategory filter
    search: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      // Get current trendingCategory from URL or filters
      const currentTrendingCategory = urlTrendingCategory || filters.trendingCategory;
      // Pass trendingCategory to API if available
      const params = currentTrendingCategory ? { trendingCategory: currentTrendingCategory } : {};
      const data = await tourService.getAllTours(params);
      setPackages(data);
      setFilteredPackages(data);
    } catch (error) {
      message.error('Failed to load packages');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [urlTrendingCategory, filters.trendingCategory]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Update filter when URL param changes
  useEffect(() => {
    if (urlTrendingCategory && urlTrendingCategory !== filters.trendingCategory) {
      setFilters(prev => ({
        ...prev,
        trendingCategory: urlTrendingCategory
      }));
    }
  }, [urlTrendingCategory, filters.trendingCategory]);

  // Filter and sort packages
  useEffect(() => {
    let filtered = [...packages];

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(pkg => {
        const pkgCategory = pkg.category?.toLowerCase();
        const filterCategory = filters.category.toLowerCase();
        return pkgCategory === filterCategory;
      });
    }

    // Apply trending category filter
    if (filters.trendingCategory) {
      filtered = filtered.filter(pkg => 
        pkg.trendingCategories && pkg.trendingCategories.includes(filters.trendingCategory)
      );
    }

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(pkg => 
        pkg.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        pkg.destination?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Helper function to calculate discounted price for sorting
    const getDiscountedPrice = (tour) => {
      const originalPrice = tour.price?.adult || 0;
      const discount = tour.discount;
      
      if (!discount || !discount.isActive) {
        return originalPrice;
      }
      
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Reset time to start of day
      
      if (discount.startDate) {
        const startDate = new Date(discount.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (startDate > now) {
          return originalPrice;
        }
      }
      
      if (discount.endDate) {
        const endDate = new Date(discount.endDate);
        endDate.setHours(23, 59, 59, 999); // Set to end of day
        if (endDate < now) {
          return originalPrice;
        }
      }
      
      if (discount.type === 'percentage') {
        return Math.round(originalPrice * (1 - (discount.value / 100)));
      } else if (discount.type === 'fixed') {
        return Math.max(0, originalPrice - discount.value);
      }
      
      return originalPrice;
    };

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.title || '').localeCompare(b.title || '');
        case 'price-low':
          return getDiscountedPrice(a) - getDiscountedPrice(b);
        case 'price-high':
          return getDiscountedPrice(b) - getDiscountedPrice(a);
        case 'duration':
          return (a.duration?.days || 0) - (b.duration?.days || 0);
        default:
          return 0;
      }
    });

    setFilteredPackages(filtered);
  }, [filters, sortBy, packages]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All',
      trendingCategory: '',
      search: ''
    });
    // Clear URL params
    navigate('/package', { replace: true });
  };

  const handlePackageClick = (packageId) => {
    navigate(`/package/${packageId}`);
  };

  const CardIcons = () => (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      cursor: 'pointer'
    }}>
      <span style={{ color: '#212529', fontSize: '14px' }}>♥</span> 
    </div>
  );

  const categories = [
    { label: 'All', value: 'All' },
    { label: 'Spiritual', value: 'spiritual' },
    { label: 'Wellness', value: 'wellness' },
    { label: 'Heritage', value: 'heritage' },
    { label: 'Study', value: 'study' },
    { label: 'Adventure', value: 'adventure' },
    { label: 'Cultural', value: 'cultural' },
    { label: 'City Tour', value: 'city-tour' },
    { label: 'Package', value: 'package' },
    { label: 'Day Tour', value: 'day-tour' },
    { label: 'Multi Day', value: 'multi-day' },
    { label: 'Religious', value: 'religious' },
    { label: 'Wildlife', value: 'wildlife' },
    { label: 'Beach', value: 'beach' }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: '#6c757d' }}>Loading packages...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: window.innerWidth <= 480 ? '12px 0' : '16px 0',
        borderBottom: '1px solid #e9ecef',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: window.innerWidth <= 768 ? '100%' : '1800px',
          margin: '0 auto',
          padding: window.innerWidth <= 480 ? '0 8px' : window.innerWidth <= 768 ? '0 12px' : '0 250px',
          display: 'flex',
          alignItems: 'center',
          gap: window.innerWidth <= 768 ? '12px' : '20px',
          flexWrap: 'wrap'
        }}>
          <button onClick={() => {
            // If coming from trending category, go back to trending destinations page
            if (urlTrendingCategory) {
              navigate('/trending-destinations');
            } else {
              navigate('/');
            }
          }} style={{
            padding: window.innerWidth <= 480 ? '6px 12px' : '8px 16px',
            backgroundColor: 'transparent',
            color: '#FF6B35',
            border: '2px solid #FF6B35',
            borderRadius: window.innerWidth <= 768 ? '6px' : '8px',
            cursor: 'pointer',
            fontSize: window.innerWidth <= 480 ? '12px' : '14px',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FF6B35';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#FF6B35';
          }}>
            ← {urlTrendingCategory ? 'Back to Trending' : 'Back to Home'}
          </button>
          <div>
            <div style={{ fontSize: window.innerWidth <= 480 ? '10px' : '12px', color: '#6c757d' }}>
              {urlTrendingCategory ? `Home / Trending Destinations / ${urlTrendingCategory}` : 'Home / Travel Packages'}
            </div>
            <h1 style={{ 
              fontSize: window.innerWidth <= 480 ? '1.1rem' : window.innerWidth <= 768 ? '1.3rem' : '1.8rem', 
              fontWeight: 'bold', 
              color: '#212529',
              margin: '4px 0 0 0'
            }}>
              {urlTrendingCategory ? `${urlTrendingCategory} Packages` : 'Travel Packages Across India'}
            </h1>
            {urlTrendingCategory && (
              <p style={{ 
                fontSize: window.innerWidth <= 480 ? '12px' : '14px', 
                color: '#6c757d',
                margin: '8px 0 0 0'
              }}>
                Explore packages in {urlTrendingCategory} category
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: window.innerWidth <= 768 ? '100%' : '1800px',
        margin: '0 auto',
        padding: window.innerWidth <= 480 ? '16px 8px' : window.innerWidth <= 768 ? '20px 12px' : '24px 250px'
      }}>
        {/* Packages Count */}
        <div style={{
          fontSize: window.innerWidth <= 480 ? '12px' : '14px',
          color: '#6c757d',
          marginBottom: window.innerWidth <= 480 ? '15px' : '30px'
        }}>
          {filteredPackages.length} packages found
        </div>

        {/* Search Bar */}
        <div style={{
          marginBottom: window.innerWidth <= 480 ? '15px' : '30px',
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Search packages, destinations..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{
              width: '100%',
              padding: window.innerWidth <= 480 ? '12px 20px' : '16px 24px',
              border: '2px solid #FF6B35',
              borderRadius: '25px',
              fontSize: window.innerWidth <= 480 ? '14px' : '16px',
              outline: 'none',
              backgroundColor: 'white',
              color: '#212529',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(255, 107, 53, 0.2)'
            }}
          />
        </div>

        {/* Filter and Sort Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: window.innerWidth <= 480 ? '15px' : '30px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: window.innerWidth <= 480 ? '8px 16px' : '12px 24px',
              backgroundColor: '#FF6B35',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: window.innerWidth <= 480 ? '12px' : '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔍 Filters
            <span style={{ fontSize: '12px' }}>
              {showFilters ? '▲' : '▼'}
            </span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: window.innerWidth <= 480 ? '8px' : '12px',
            flexWrap: 'wrap'
          }}>
            <label style={{
              fontSize: window.innerWidth <= 480 ? '12px' : '14px',
              fontWeight: '600',
              color: '#495057'
            }}>
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: window.innerWidth <= 480 ? '8px 12px' : '10px 16px',
                border: '2px solid #FF6B35',
                borderRadius: '25px',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                outline: 'none',
                backgroundColor: 'white',
                color: '#212529',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{
            backgroundColor: 'white',
            padding: window.innerWidth <= 480 ? '20px' : '24px',
            borderRadius: '15px',
            marginBottom: window.innerWidth <= 480 ? '15px' : '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: window.innerWidth <= 480 ? '10px' : '12px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '4px'
              }}>
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: window.innerWidth <= 480 ? '8px 12px' : '10px 16px',
                  border: '2px solid #FF6B35',
                  borderRadius: '8px',
                  fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  color: '#212529',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={clearFilters}
              style={{
                marginTop: '16px',
                padding: window.innerWidth <= 480 ? '10px 20px' : '12px 24px',
                backgroundColor: '#FF6B35',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
        
        {/* Packages Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: window.innerWidth <= 480 ? '12px' : '16px', 
          paddingBottom: '20px',
        }}>
          {filteredPackages.map(pkg => (
            <div 
              key={pkg._id} 
              onClick={() => handlePackageClick(pkg._id)}
              style={{
                backgroundColor: 'white',
                borderRadius: window.innerWidth <= 768 ? '10px' : '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative' }}>
                <img 
                  src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90&auto=format&fit=crop'}
                  alt={pkg.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: window.innerWidth <= 480 ? '160px' : '200px', 
                    objectFit: 'cover',
                    imageRendering: 'high-quality',
                    WebkitImageRendering: 'high-quality'
                  }}
                />
                <CardIcons />
                
                {/* Discount Badge */}
                {(() => {
                  const discount = pkg.discount;
                  if (!discount || !discount.isActive) return null;
                  
                  const now = new Date();
                  now.setHours(0, 0, 0, 0); // Reset time to start of day
                  
                  if (discount.startDate) {
                    const startDate = new Date(discount.startDate);
                    startDate.setHours(0, 0, 0, 0);
                    if (startDate > now) return null;
                  }
                  
                  if (discount.endDate) {
                    const endDate = new Date(discount.endDate);
                    endDate.setHours(23, 59, 59, 999); // Set to end of day
                    if (endDate < now) return null;
                  }
                  
                  return (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: window.innerWidth <= 480 ? '4px 8px' : '6px 10px',
                      borderRadius: '20px',
                      fontSize: window.innerWidth <= 480 ? '9px' : '10px',
                      fontWeight: '700',
                      zIndex: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}>
                      {discount.type === 'percentage' ? `${discount.value}% OFF` : `₹${discount.value} OFF`}
                    </div>
                  );
                })()}
                
                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: '#FF6B35',
                  color: 'white',
                  padding: window.innerWidth <= 480 ? '4px 10px' : '6px 12px',
                  borderRadius: '20px',
                  fontSize: window.innerWidth <= 480 ? '10px' : '11px',
                  fontWeight: '600',
                  zIndex: 2
                }}>
                  {pkg.category || 'Tour'}
                </div>
              </div>
              
              {/* Package Info */}
              <div style={{ padding: window.innerWidth <= 480 ? '14px' : '16px' }}>
                <h3 style={{
                  fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
                  fontWeight: '700',
                  color: '#212529',
                  marginBottom: window.innerWidth <= 480 ? '6px' : '8px',
                  lineHeight: '1.3'
                }}>
                  {pkg.title}
                </h3>

                <p style={{
                  fontSize: window.innerWidth <= 480 ? '12px' : '13px',
                  color: '#6c757d',
                  marginBottom: window.innerWidth <= 480 ? '10px' : '12px',
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {pkg.description}
                </p>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #e9ecef',
                  paddingTop: window.innerWidth <= 480 ? '10px' : '12px'
                }}>
                  <div style={{
                    fontSize: window.innerWidth <= 480 ? '11px' : '12px',
                    color: '#6c757d',
                    fontWeight: '500'
                  }}>
                    {pkg.duration?.days || 0} days
                  </div>
                  {(() => {
                    // Helper function to calculate discounted price
                    const calculateDiscountedPrice = (tour) => {
                      const originalPrice = tour.price?.adult || 0;
                      const discount = tour.discount;
                      
                      if (!discount || !discount.isActive) {
                        return { originalPrice, finalPrice: originalPrice, hasDiscount: false };
                      }
                      
                      // Check if discount is within date range
                      const now = new Date();
                      now.setHours(0, 0, 0, 0); // Reset time to start of day
                      
                      if (discount.startDate) {
                        const startDate = new Date(discount.startDate);
                        startDate.setHours(0, 0, 0, 0);
                        if (startDate > now) {
                          return { originalPrice, finalPrice: originalPrice, hasDiscount: false };
                        }
                      }
                      
                      if (discount.endDate) {
                        const endDate = new Date(discount.endDate);
                        endDate.setHours(23, 59, 59, 999); // Set to end of day
                        if (endDate < now) {
                          return { originalPrice, finalPrice: originalPrice, hasDiscount: false };
                        }
                      }
                      
                      let finalPrice = originalPrice;
                      if (discount.type === 'percentage') {
                        finalPrice = originalPrice * (1 - (discount.value / 100));
                      } else if (discount.type === 'fixed') {
                        finalPrice = Math.max(0, originalPrice - discount.value);
                      }
                      
                      return { 
                        originalPrice, 
                        finalPrice: Math.round(finalPrice), 
                        hasDiscount: true,
                        discountValue: discount.value,
                        discountType: discount.type
                      };
                    };
                    
                    const priceInfo = calculateDiscountedPrice(pkg);
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        {priceInfo.hasDiscount && (
                          <span style={{
                            fontSize: '11px',
                            color: '#6c757d',
                            textDecoration: 'line-through',
                            marginBottom: '2px'
                          }}>
                            ₹{priceInfo.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span style={{
                          fontSize: window.innerWidth <= 480 ? '14px' : '16px',
                          fontWeight: '700',
                          color: '#FF6B35'
                        }}>
                          ₹{priceInfo.finalPrice.toLocaleString()}
                        </span>
                        {priceInfo.hasDiscount && (
                          <span style={{
                            fontSize: '10px',
                            color: '#28a745',
                            fontWeight: '600',
                            marginTop: '2px'
                          }}>
                            {priceInfo.discountType === 'percentage' ? `${priceInfo.discountValue}% OFF` : `₹${priceInfo.discountValue} OFF`}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPackages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: window.innerWidth <= 480 ? '40px 20px' : '60px 40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: window.innerWidth <= 480 ? '48px' : '64px', marginBottom: '16px' }}>
              🔍
            </div>
            <h3 style={{
              fontSize: window.innerWidth <= 480 ? '18px' : '24px',
              fontWeight: '600',
              color: '#495057',
              marginBottom: '8px'
            }}>
              No packages found
            </h3>
            <p style={{
              fontSize: window.innerWidth <= 480 ? '14px' : '16px',
              color: '#6c757d',
              marginBottom: '20px'
            }}>
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              style={{
                padding: window.innerWidth <= 480 ? '10px 20px' : '12px 24px',
                backgroundColor: '#FF6B35',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageDestinations;
