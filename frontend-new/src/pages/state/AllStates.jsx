import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stateService } from '../../services';
import { Spin, message } from 'antd';

const AllStates = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSmall = window.innerWidth <= 480;
  const isMobile = window.innerWidth <= 768;

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
  const displayStates = states.length > 0 ? states.map(state => ({
    id: state.slug,
    name: state.name,
    slug: state.slug,
    tours: `${state.tours || 0}+ Tours`,
    region: state.region || 'Other',
    image: state.heroImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=90',
    featured: state.featured
  })) : fallbackStates;

  // Filter states
  const filteredStates = displayStates
    .filter(state => selectedRegion === 'all' || state.region === selectedRegion)
    .filter(state => state.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical order

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: isSmall ? '12px 0' : '16px 0',
        borderBottom: '1px solid #e9ecef',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: isMobile ? '100%' : '1800px',
          margin: '0 auto',
          padding: isSmall ? '0 8px' : isMobile ? '0 12px' : window.innerWidth <= 1024 ? '0 32px' : '0 250px',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '12px' : '20px'
        }}>
          <button onClick={() => navigate('/')} style={{
            padding: isSmall ? '6px 12px' : '8px 16px',
            backgroundColor: 'transparent',
            color: '#FF6B35',
            border: '2px solid #FF6B35',
            borderRadius: isMobile ? '6px' : '8px',
            cursor: 'pointer',
            fontSize: isSmall ? '12px' : '14px',
            fontWeight: '600'
          }}>
            ← Back
          </button>
          <div>
            <div style={{ fontSize: isSmall ? '10px' : '12px', color: '#6c757d' }}>
              Home / All States
            </div>
            <h1 style={{ 
              fontSize: isSmall ? '1.1rem' : isMobile ? '1.3rem' : '1.8rem', 
              fontWeight: 'bold', 
              color: '#212529',
              margin: '4px 0 0 0'
            }}>
              Explore All Indian States
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: isMobile ? '100%' : '1800px',
        margin: '0 auto',
        padding: isSmall ? '16px 8px' : isMobile ? '20px 12px' : window.innerWidth <= 1024 ? '24px 32px' : '24px 250px'
      }}>
        {/* Filters Section */}
        <div style={{
          backgroundColor: 'white',
          padding: isSmall ? '16px' : isMobile ? '20px' : '24px',
          borderRadius: isMobile ? '10px' : '12px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          {/* Search Bar */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="🔍 Search states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: isSmall ? '10px 14px' : '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: isSmall ? '13px' : '14px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          {/* Region Filters */}
          <div>
            <div style={{
              fontSize: isSmall ? '12px' : '13px',
              fontWeight: '600',
              color: '#495057',
              marginBottom: '12px'
            }}>
              Filter by Region:
            </div>
            <div style={{
              display: 'flex',
              gap: isSmall ? '6px' : '8px',
              flexWrap: 'wrap'
            }}>
              {regions.map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  style={{
                    padding: isSmall ? '6px 12px' : '8px 16px',
                    backgroundColor: selectedRegion === region ? '#FF6B35' : '#f8f9fa',
                    color: selectedRegion === region ? 'white' : '#495057',
                    border: selectedRegion === region ? 'none' : '1px solid #dee2e6',
                    borderRadius: '20px',
                    fontSize: isSmall ? '11px' : '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedRegion !== region) {
                      e.target.style.backgroundColor = '#e9ecef';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedRegion !== region) {
                      e.target.style.backgroundColor = '#f8f9fa';
                    }
                  }}
                >
                  {region === 'all' ? 'All Regions' : region}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div style={{
            marginTop: '16px',
            fontSize: isSmall ? '12px' : '13px',
            color: '#6c757d',
            textAlign: 'center'
          }}>
            Showing <strong>{filteredStates.length}</strong> of <strong>{displayStates.length}</strong> states
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
          {filteredStates.map((state) => (
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
      </div>
    </div>
  );
};

export default AllStates;

