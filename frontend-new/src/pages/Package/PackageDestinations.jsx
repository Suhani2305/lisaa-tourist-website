import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tourService, wishlistService, authService } from '../../services';
import { Spin, message, Select } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import Header from '../landingpage/components/Header';
import Footer from '../landingpage/components/Footer';

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
    trendingCategory: urlTrendingCategory || '',
    search: '',
    destination: '',
    minPrice: null,
    maxPrice: null,
    minDuration: null,
    maxDuration: null,
    priceRange: '',
    durationRange: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const searchDebounceTimerRef = useRef(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});

  const fetchPackages = useCallback(async (searchQuery = null) => {
    try {
      setLoading(true);
      const currentTrendingCategory = urlTrendingCategory || filters.trendingCategory;
      
      // Build API params with all filters (use searchQuery param or filters.search)
      const params = {};
      if (currentTrendingCategory) params.trendingCategory = currentTrendingCategory;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.destination) params.destination = filters.destination;
      // Use searchQuery if provided, otherwise use filters.search
      const searchTerm = searchQuery !== null ? searchQuery : filters.search;
      if (searchTerm) params.search = searchTerm;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      
      const data = await tourService.getAllTours(params);
      setPackages(data);
      
      // Extract unique destinations for filter dropdown
      const uniqueDestinations = [...new Set(data.map(pkg => pkg.destination).filter(Boolean))].sort();
      setDestinations(uniqueDestinations);
    } catch (error) {
      message.error('Failed to load packages');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [urlTrendingCategory, filters.trendingCategory, filters.category, filters.destination, filters.minPrice, filters.maxPrice]);

  // Initial fetch and when non-search filters change
  useEffect(() => {
    fetchPackages();
  }, [urlTrendingCategory, filters.trendingCategory, filters.category, filters.destination, filters.minPrice, filters.maxPrice]);

  // Fetch wishlist status for all packages
  const fetchWishlistStatus = async () => {
    if (!authService.isAuthenticated()) {
      setWishlistItems([]);
      return;
    }

    try {
      const wishlist = await wishlistService.getWishlist();
      const tourIds = wishlist.map(item => item.tour?._id || item.tour);
      setWishlistItems(tourIds);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setWishlistItems([]);
    }
  };

  useEffect(() => {
    fetchWishlistStatus();
  }, [packages]);

  const handleWishlistToggle = async (e, packageId) => {
    e.stopPropagation(); // Prevent package card click
    
    if (!authService.isAuthenticated()) {
      message.warning('Please login to add packages to wishlist');
      navigate('/login');
      return;
    }

    try {
      setWishlistLoading(prev => ({ ...prev, [packageId]: true }));
      
      const isInWishlist = wishlistItems.includes(packageId);
      
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(packageId);
        setWishlistItems(prev => prev.filter(id => id !== packageId));
        message.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(packageId);
        setWishlistItems(prev => [...prev, packageId]);
        message.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      message.error(error.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(prev => ({ ...prev, [packageId]: false }));
    }
  };

  // Optional: Debounced backend search for better accuracy (client-side search works instantly)
  // Commented out for now - using client-side search only for instant results
  // useEffect(() => {
  //   if (searchDebounceTimerRef.current) {
  //     clearTimeout(searchDebounceTimerRef.current);
  //   }

  //   if (filters.search && filters.search.trim() !== '') {
  //     searchDebounceTimerRef.current = setTimeout(() => {
  //       fetchPackages(filters.search);
  //     }, 500);
  //   }

  //   return () => {
  //     if (searchDebounceTimerRef.current) {
  //       clearTimeout(searchDebounceTimerRef.current);
  //     }
  //   };
  // }, [filters.search]);

  // Update filter when URL param changes
  useEffect(() => {
    if (urlTrendingCategory && urlTrendingCategory !== filters.trendingCategory) {
      setFilters(prev => ({
        ...prev,
        trendingCategory: urlTrendingCategory
      }));
    }
  }, [urlTrendingCategory, filters.trendingCategory]);

  // Filter and sort packages (client-side filtering for additional filters)
  useEffect(() => {
    let filtered = [...packages];

    // Apply trending category filter
    if (filters.trendingCategory) {
      filtered = filtered.filter(pkg => 
        pkg.trendingCategories && pkg.trendingCategories.includes(filters.trendingCategory)
      );
    }

    // Apply search filter (client-side backup for better UX)
    // Backend search is also used, but client-side ensures search works even if backend search fails
    if (filters.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(pkg => 
        pkg.title?.toLowerCase().includes(searchLower) ||
        pkg.description?.toLowerCase().includes(searchLower) ||
        pkg.destination?.toLowerCase().includes(searchLower) ||
        pkg.category?.toLowerCase().includes(searchLower)
      );
    }

    // Apply duration filter (client-side)
    if (filters.minDuration) {
      filtered = filtered.filter(pkg => (pkg.duration?.days || 0) >= filters.minDuration);
    }
    if (filters.maxDuration) {
      filtered = filtered.filter(pkg => (pkg.duration?.days || 0) <= filters.maxDuration);
    }

    // Apply price filter (client-side for discounted prices)
    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter(pkg => {
        const getDiscountedPrice = (tour) => {
          const originalPrice = tour.price?.adult || 0;
          const discount = tour.discount;
          
          if (!discount || !discount.isActive) return originalPrice;
          
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          
          if (discount.startDate) {
            const startDate = new Date(discount.startDate);
            startDate.setHours(0, 0, 0, 0);
            if (startDate > now) return originalPrice;
          }
          
          if (discount.endDate) {
            const endDate = new Date(discount.endDate);
            endDate.setHours(23, 59, 59, 999);
            if (endDate < now) return originalPrice;
          }
          
          if (discount.type === 'percentage') {
            return Math.round(originalPrice * (1 - (discount.value / 100)));
          } else if (discount.type === 'fixed') {
            return Math.max(0, originalPrice - discount.value);
          }
          
          return originalPrice;
        };
        
        const finalPrice = getDiscountedPrice(pkg);
        
        if (filters.minPrice && finalPrice < filters.minPrice) return false;
        if (filters.maxPrice && finalPrice > filters.maxPrice) return false;
        
        return true;
      });
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
      search: '',
      destination: '',
      minPrice: null,
      maxPrice: null,
      minDuration: null,
      maxDuration: null,
      priceRange: '',
      durationRange: ''
    });
    // Clear URL params
    navigate('/package', { replace: true });
  };

  const handlePackageClick = (packageId) => {
    navigate(`/package/${packageId}`);
  };

  const WishlistButton = ({ packageId }) => {
    const isInWishlist = wishlistItems.includes(packageId);
    const isLoading = wishlistLoading[packageId];

    return (
      <div 
        onClick={(e) => handleWishlistToggle(e, packageId)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isInWishlist ? '#fff5f5' : '#fff';
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        }}
      >
        {isLoading ? (
          <Spin size="small" />
        ) : isInWishlist ? (
          <HeartFilled style={{ fontSize: '18px', color: '#FF6B35' }} />
        ) : (
          <HeartOutlined style={{ fontSize: '18px', color: '#6c757d' }} />
        )}
      </div>
    );
  };

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
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>Loading packages...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Main Content */}
      <div style={{
        maxWidth: window.innerWidth <= 768 ? '100%' : '1800px',
        margin: '0 auto',
        padding: window.innerWidth <= 480 ? '16px 8px' : window.innerWidth <= 768 ? '20px 12px' : '24px 250px'
      }}>
        {/* Breadcrumb & Title */}
        <div style={{ 
          fontSize: window.innerWidth <= 480 ? '11px' : window.innerWidth <= 768 ? '12px' : '14px', 
          color: '#6c757d',
          marginBottom: '12px',
          fontFamily: 'Poppins, sans-serif'
        }}>
          <span 
            onClick={() => navigate('/')}
            style={{ 
              cursor: 'pointer',
              color: '#6c757d',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
          >
            Home
          </span>
          {urlTrendingCategory ? (
            <>
              <span style={{ margin: '0 8px', color: '#6c757d' }}> &gt; </span>
              <span 
                onClick={() => navigate('/trending-destinations')}
                style={{ 
                  cursor: 'pointer',
                  color: '#6c757d',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
              >
                Trending Destinations
              </span>
              <span style={{ margin: '0 8px', color: '#6c757d' }}> &gt; </span>
              <span style={{ color: '#212529' }}>{urlTrendingCategory}</span>
            </>
          ) : (
            <>
              <span style={{ margin: '0 8px', color: '#6c757d' }}> &gt; </span>
              <span style={{ color: '#212529' }}>Tours</span>
            </>
          )}
        </div>
        <h1 style={{ 
          fontSize: window.innerWidth <= 480 ? '1.2rem' : window.innerWidth <= 768 ? '1.5rem' : '2rem', 
          fontWeight: '700', 
          color: '#212529',
          margin: '0 0 24px 0',
          fontFamily: 'Poppins, sans-serif'
        }}>
          {urlTrendingCategory ? `${urlTrendingCategory} Packages` : 'Travel Packages Across India'}
        </h1>
        {urlTrendingCategory && (
          <p style={{ 
            fontSize: window.innerWidth <= 480 ? '12px' : '14px', 
            color: '#6c757d',
            margin: '0 0 24px 0',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Explore packages in {urlTrendingCategory} category
          </p>
        )}
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
          <div style={{ position: 'relative' }}>
            <SearchOutlined style={{
              position: 'absolute',
              left: window.innerWidth <= 480 ? '16px' : '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#FF6B35',
              fontSize: window.innerWidth <= 480 ? '16px' : '18px',
              zIndex: 1
            }} />
            <input
              type="text"
              placeholder="Search packages, destinations..."
              value={filters.search || ''}
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('search', value);
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF6B35';
                e.target.style.boxShadow = '0 4px 8px rgba(255, 107, 53, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#FF6B35';
                e.target.style.boxShadow = '0 2px 4px rgba(255, 107, 53, 0.2)';
              }}
              style={{
                width: '100%',
                padding: window.innerWidth <= 480 ? '12px 20px 12px 44px' : '16px 24px 16px 50px',
                border: '2px solid #FF6B35',
                borderRadius: '25px',
                fontSize: window.innerWidth <= 480 ? '14px' : '16px',
                outline: 'none',
                backgroundColor: 'white',
                color: '#212529',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(255, 107, 53, 0.2)',
                fontFamily: 'Poppins, sans-serif',
                transition: 'all 0.2s ease'
              }}
            />
          </div>
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontFamily: 'Poppins, sans-serif'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(2, 1fr)',
              gap: window.innerWidth <= 480 ? '16px' : '20px'
            }}>
              {/* Category Filter */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '8px',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: window.innerWidth <= 480 ? '10px 12px' : '12px 16px',
                    border: '2px solid #FF6B35',
                    borderRadius: '8px',
                    fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    color: '#212529',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>

              {/* Destination Filter */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '8px',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Destination
                </label>
                <select
                  value={filters.destination}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  style={{
                    width: '100%',
                    padding: window.innerWidth <= 480 ? '10px 12px' : '12px 16px',
                    border: '2px solid #FF6B35',
                    borderRadius: '8px',
                    fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    color: '#212529',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <option value="">All Destinations</option>
                  {destinations.map(dest => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '8px',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Price Range
                </label>
                <select
                  value={filters.priceRange || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setFilters(prev => ({
                        ...prev,
                        minPrice: null,
                        maxPrice: null,
                        priceRange: ''
                      }));
                    } else {
                      const parts = value.split('-');
                      const min = parts[0] === 'above' ? null : parseInt(parts[0]);
                      const max = parts[1] === 'above' ? null : (parts[1] ? parseInt(parts[1]) : null);
                      setFilters(prev => ({
                        ...prev,
                        minPrice: min,
                        maxPrice: max,
                        priceRange: value
                      }));
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: window.innerWidth <= 480 ? '10px 12px' : '12px 16px',
                    border: '2px solid #FF6B35',
                    borderRadius: '8px',
                    fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    color: '#212529',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <option value="">All Price Ranges</option>
                  <option value="0-5000">₹0 - ₹5,000</option>
                  <option value="5000-10000">₹5,000 - ₹10,000</option>
                  <option value="10000-20000">₹10,000 - ₹20,000</option>
                  <option value="20000-30000">₹20,000 - ₹30,000</option>
                  <option value="30000-50000">₹30,000 - ₹50,000</option>
                  <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                  <option value="100000-above">Above ₹1,00,000</option>
                </select>
              </div>

              {/* Duration Range */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '8px',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Duration
                </label>
                <select
                  value={filters.durationRange || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setFilters(prev => ({
                        ...prev,
                        minDuration: null,
                        maxDuration: null,
                        durationRange: ''
                      }));
                    } else {
                      const parts = value.split('-');
                      const min = parts[0] === 'above' ? null : parseInt(parts[0]);
                      const max = parts[1] === 'above' ? null : (parts[1] ? parseInt(parts[1]) : null);
                      setFilters(prev => ({
                        ...prev,
                        minDuration: min,
                        maxDuration: max,
                        durationRange: value
                      }));
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: window.innerWidth <= 480 ? '10px 12px' : '12px 16px',
                    border: '2px solid #FF6B35',
                    borderRadius: '8px',
                    fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    color: '#212529',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  <option value="">All Durations</option>
                  <option value="1-2">1 - 2 Days</option>
                  <option value="3-5">3 - 5 Days</option>
                  <option value="6-7">6 - 7 Days</option>
                  <option value="8-10">8 - 10 Days</option>
                  <option value="11-15">11 - 15 Days</option>
                  <option value="16-above">Above 15 Days</option>
                </select>
              </div>
            </div>

            <button
              onClick={clearFilters}
              style={{
                marginTop: '20px',
                padding: window.innerWidth <= 480 ? '10px 20px' : '12px 24px',
                backgroundColor: '#FF6B35',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                width: '100%'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f15a29'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6B35'}
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
                <WishlistButton packageId={pkg._id} />
                
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
            backgroundColor: '#ffffff',
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
      <Footer />
    </>
  );
};

export default PackageDestinations;
