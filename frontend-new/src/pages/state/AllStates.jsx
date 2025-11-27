import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stateService } from '../../services';
import { Spin, message } from 'antd';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import Header from '../landingpage/components/Header';
import Footer from '../landingpage/components/Footer';

const AllStates = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const isSmall = window.innerWidth <= 480;
  const isMobile = window.innerWidth <= 768;
  const pageSize = isMobile ? 6 : 12;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching all states from backend...');
      const statesArray = await stateService.getAllStates({ all: 'true' });
      console.log('✅ States loaded:', statesArray.length);
      setStates(Array.isArray(statesArray) ? statesArray : []);
    } catch (error) {
      console.error('❌ Failed to fetch states:', error);
      message.error('Failed to load states');
      setStates([]);
    } finally {
      setLoading(false);
    }
  };

  // All 29 Indian States (Fallback - will be replaced by API data)
  const fallbackStates = [
    { id: "andhra-pradesh", name: "Andhra Pradesh", tours: "180+ Tours", region: "South", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80" },
    { id: "arunachal-pradesh", name: "Arunachal Pradesh", tours: "95+ Tours", region: "Northeast", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80" },
    { id: "assam", name: "Assam", tours: "150+ Tours", region: "Northeast", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80" },
    { id: "bihar", name: "Bihar", tours: "120+ Tours", region: "East", image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80" },
    { id: "chhattisgarh", name: "Chhattisgarh", tours: "85+ Tours", region: "Central", image: "https://images.unsplash.com/photo-1587693266575-c337c15d223a?w=800&q=80" },
    { id: "goa", name: "Goa", tours: "300+ Tours", region: "West", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80" },
    { id: "gujarat", name: "Gujarat", tours: "220+ Tours", region: "West", image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80" },
    { id: "haryana", name: "Haryana", tours: "110+ Tours", region: "North", image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800&q=80" },
    { id: "himachal-pradesh", name: "Himachal Pradesh", tours: "450+ Tours", region: "North", image: "https://images.unsplash.com/photo-1626621341890-45ee5adcc441?w=800&q=80" },
    { id: "jharkhand", name: "Jharkhand", tours: "90+ Tours", region: "East", image: "https://images.unsplash.com/photo-1610519341503-1d45b96ee6f3?w=800&q=80" },
    { id: "karnataka", name: "Karnataka", tours: "290+ Tours", region: "South", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80" },
    { id: "kerala", name: "Kerala", tours: "400+ Tours", region: "South", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80" },
    { id: "madhya-pradesh", name: "Madhya Pradesh", tours: "200+ Tours", region: "Central", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80" },
    { id: "maharashtra", name: "Maharashtra", tours: "380+ Tours", region: "West", image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80" },
    { id: "manipur", name: "Manipur", tours: "75+ Tours", region: "Northeast", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80" },
    { id: "meghalaya", name: "Meghalaya", tours: "130+ Tours", region: "Northeast", image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80" },
    { id: "mizoram", name: "Mizoram", tours: "65+ Tours", region: "Northeast", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80" },
    { id: "nagaland", name: "Nagaland", tours: "80+ Tours", region: "Northeast", image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80" },
    { id: "odisha", name: "Odisha", tours: "160+ Tours", region: "East", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80" },
    { id: "punjab", name: "Punjab", tours: "170+ Tours", region: "North", image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800&q=80" },
    { id: "rajasthan", name: "Rajasthan", tours: "500+ Tours", region: "North", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80" },
    { id: "sikkim", name: "Sikkim", tours: "140+ Tours", region: "Northeast", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80" },
    { id: "tamil-nadu", name: "Tamil Nadu", tours: "320+ Tours", region: "South", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80" },
    { id: "telangana", name: "Telangana", tours: "190+ Tours", region: "South", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80" },
    { id: "tripura", name: "Tripura", tours: "70+ Tours", region: "Northeast", image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80" },
    { id: "uttar-pradesh", name: "Uttar Pradesh", tours: "350+ Tours", region: "North", image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800&q=80" },
    { id: "uttarakhand", name: "Uttarakhand", tours: "350+ Tours", region: "North", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80" },
    { id: "west-bengal", name: "West Bengal", tours: "280+ Tours", region: "East", image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80" },
    { id: "jammu-kashmir", name: "Jammu & Kashmir", tours: "250+ Tours", region: "North", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80" }
  ];

  const regions = ['all', 'North', 'South', 'East', 'West', 'Northeast', 'Central'];

  // Use API states if available, otherwise fallback
  const formatTourLabel = (count) => {
    const safeCount = Number(count) || 0;
    return `${safeCount} ${safeCount === 1 ? 'Package' : 'Packages'}`;
  };

  const displayStates = states.length > 0
    ? states.map(state => {
        const tourCount = Number(state.tours) || 0;
        return {
          id: state.slug,
          name: state.name,
          slug: state.slug,
          tourCount,
          tours: formatTourLabel(tourCount),
          region: state.region || 'Other',
          image: state.heroImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=90',
          featured: state.featured
        };
      })
    : fallbackStates.map(state => ({
        ...state,
        tourCount: parseInt(state.tours, 10) || 0,
        tours: state.tours
      }));

  // Filter states
  const filteredStates = displayStates
    .filter(state => selectedRegion === 'all' || state.region === selectedRegion)
    .filter(state => state.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical order

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedStates = filteredStates.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredStates.length / pageSize);

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>Loading states...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Main Content */}
      <div style={{
        maxWidth: isMobile ? '100%' : '1800px',
        margin: '0 auto',
        padding: isSmall ? '20px 8px' : isMobile ? '30px 12px' : window.innerWidth <= 1024 ? '40px 32px' : '60px 250px',
        paddingTop: isMobile ? '40px' : '60px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Breadcrumb */}
        <div style={{ 
          fontSize: isSmall ? '11px' : isMobile ? '12px' : '14px', 
          color: '#6c757d',
          marginBottom: '20px',
          fontFamily: 'Poppins, sans-serif',
          textAlign: 'center'
        }}>
          <span 
            onClick={() => {
              sessionStorage.setItem('scrollToStates', 'true');
              navigate('/');
            }}
            style={{ 
              cursor: 'pointer',
              color: '#6c757d',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B35'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
          >
            Home
          </span>
          <span style={{ margin: '0 8px', color: '#6c757d' }}> &gt; </span>
          <span style={{ color: '#212529', fontWeight: '600' }}>All States</span>
        </div>

        {/* Title */}
        <h1 style={{ 
          fontSize: isSmall ? '1.8rem' : isMobile ? '2.2rem' : '3rem', 
          fontWeight: '800', 
          color: '#FF6B35',
          margin: '0 auto 16px auto',
          fontFamily: "'Playfair Display', 'Georgia', serif",
          lineHeight: '1.2',
          textAlign: 'center',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 4px rgba(255, 107, 53, 0.1)'
        }}>
          Explore All Indian States
        </h1>

        {/* Description */}
        <p style={{
          fontSize: isSmall ? '13px' : isMobile ? '14px' : '16px',
          color: '#6c757d',
          margin: '0 auto 40px auto',
          fontFamily: 'Poppins, sans-serif',
          lineHeight: '1.6',
          maxWidth: '700px',
          textAlign: 'center'
        }}>
          Discover the diverse beauty and rich culture of all 29 states across India
        </p>
        {/* Search and Filter Section */}
        <div style={{
          display: 'flex',
          gap: isSmall ? '8px' : '12px',
          alignItems: 'center',
          flexWrap: 'nowrap',
          marginBottom: '24px'
        }}>
          {/* Search Bar */}
          <div style={{ 
            flex: '0 0 70%',
            position: 'relative',
            minWidth: '0'
          }}>
            <SearchOutlined style={{
              position: 'absolute',
              left: isSmall ? '16px' : '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#FF6B35',
              fontSize: isSmall ? '16px' : '18px',
              zIndex: 1
            }} />
            <input
              type="text"
              placeholder="Search states by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: isSmall ? '12px 20px 12px 44px' : '16px 24px 16px 50px',
                border: '2px solid #FF6B35',
                borderRadius: '25px',
                fontSize: isSmall ? '14px' : '16px',
                outline: 'none',
                backgroundColor: 'white',
                color: '#212529',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(255, 107, 53, 0.2)',
                fontFamily: 'Poppins, sans-serif',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF6B35';
                e.target.style.boxShadow = '0 4px 8px rgba(255, 107, 53, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#FF6B35';
                e.target.style.boxShadow = '0 2px 4px rgba(255, 107, 53, 0.2)';
              }}
            />
          </div>

          {/* Filter Dropdown */}
          <div style={{
            flex: '0 0 30%',
            position: 'relative'
          }}>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: isSmall ? '12px 20px' : '16px 24px',
                border: '2px solid #FF6B35',
                borderRadius: '25px',
                fontSize: isSmall ? '14px' : '16px',
                outline: 'none',
                backgroundColor: 'white',
                color: '#212529',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0 2px 4px rgba(255, 107, 53, 0.2)',
                transition: 'all 0.2s ease',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23FF6B35' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                paddingRight: isSmall ? '40px' : '45px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF6B35';
                e.target.style.boxShadow = '0 4px 8px rgba(255, 107, 53, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#FF6B35';
                e.target.style.boxShadow = '0 2px 4px rgba(255, 107, 53, 0.2)';
              }}
            >
              {regions.map(region => (
                <option key={region} value={region}>
                  {region === 'all' ? 'All Regions' : region}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '16px',
            marginBottom: '40px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', color: '#6c757d' }}>Loading states...</div>
            </div>
          </div>
        )}

        {/* States Grid */}
        {!loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isSmall ? '1fr' : isMobile ? 'repeat(2, 1fr)' : window.innerWidth <= 1024 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
          gap: isSmall ? '12px' : isMobile ? '16px' : '20px',
          marginBottom: '40px'
        }}>
          {paginatedStates.map((state) => (
            <div
              key={state.id}
              onClick={() => {
                const stateSlug = state.slug || state.id;
                navigate(`/state/${stateSlug}`);
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: isMobile ? '12px' : '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
            >
              {/* State Image */}
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={state.image}
                  alt={state.name}
                  style={{
                    width: '100%',
                    height: isSmall ? '180px' : isMobile ? '200px' : '220px',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                {/* Region Badge */}
                <div style={{
                  position: 'absolute',
                  top: isSmall ? '8px' : '12px',
                  left: isSmall ? '8px' : '12px',
                  backgroundColor: 'rgba(255, 107, 53, 0.95)',
                  color: 'white',
                  padding: isSmall ? '4px 10px' : '6px 12px',
                  borderRadius: isSmall ? '16px' : '20px',
                  fontSize: isSmall ? '10px' : '11px',
                  fontWeight: '600'
                }}>
                  {state.region}
                </div>
                {/* Tours Count Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: isSmall ? '8px' : '12px',
                  right: isSmall ? '8px' : '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#212529',
                  padding: isSmall ? '4px 10px' : '6px 12px',
                  borderRadius: isSmall ? '16px' : '20px',
                  fontSize: isSmall ? '10px' : '11px',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {state.tours}
                </div>
              </div>

              {/* State Info */}
              <div style={{ padding: isSmall ? '12px' : isMobile ? '16px' : '20px' }}>
                <h3 style={{
                  fontSize: isSmall ? '1rem' : isMobile ? '1.1rem' : '1.2rem',
                  fontWeight: 'bold',
                  color: '#212529',
                  marginBottom: isSmall ? '8px' : '12px'
                }}>
                  {state.name}
                </h3>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    color: '#FF6B35',
                    fontSize: isSmall ? '12px' : '14px',
                    fontWeight: '600'
                  }}>
                    Explore →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* No Results Message */}
        {!loading && filteredStates.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{
              fontSize: isSmall ? '1.1rem' : '1.3rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '8px'
            }}>
              No states found
            </h3>
            <p style={{
              fontSize: isSmall ? '13px' : '14px',
              color: '#6c757d'
            }}>
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Custom Pagination */}
        {!loading && filteredStates.length > 0 && totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginTop: '40px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}>
            {/* Previous Button */}
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={currentPage === 1}
              style={{
                padding: isSmall ? '8px 16px' : '10px 20px',
                backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                color: currentPage === 1 ? '#b0b0b0' : '#212529',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: isSmall ? '13px' : '14px',
                fontWeight: '600',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: currentPage === 1 ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.target.style.borderColor = '#FF6B35';
                  e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }
              }}
            >
              ← Prev
            </button>

            {/* Page Numbers */}
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        minWidth: isSmall ? '36px' : '40px',
                        height: isSmall ? '36px' : '40px',
                        backgroundColor: currentPage === page ? '#FF6B35' : 'white',
                        color: currentPage === page ? 'white' : '#212529',
                        border: currentPage === page ? 'none' : '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: isSmall ? '13px' : '14px',
                        fontWeight: currentPage === page ? '700' : '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Poppins, sans-serif',
                        boxShadow: currentPage === page 
                          ? '0 4px 12px rgba(255, 107, 53, 0.3)' 
                          : '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== page) {
                          e.target.style.borderColor = '#FF6B35';
                          e.target.style.backgroundColor = '#fff5f2';
                          e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== page) {
                          e.target.style.borderColor = '#e9ecef';
                          e.target.style.backgroundColor = 'white';
                          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                        }
                      }}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span
                      key={page}
                      style={{
                        color: '#6c757d',
                        fontSize: '14px',
                        padding: '0 4px'
                      }}
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={currentPage === totalPages}
              style={{
                padding: isSmall ? '8px 16px' : '10px 20px',
                backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
                color: currentPage === totalPages ? '#b0b0b0' : '#212529',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: isSmall ? '13px' : '14px',
                fontWeight: '600',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: currentPage === totalPages ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  e.target.style.borderColor = '#FF6B35';
                  e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
};

export default AllStates;

