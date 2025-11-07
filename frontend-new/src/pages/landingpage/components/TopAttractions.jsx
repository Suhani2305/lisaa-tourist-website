import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stateService } from '../../../services';
import { Spin } from 'antd';

const TopAttractions = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMobile = window.innerWidth <= 768;
  const isSmall = window.innerWidth <= 480;

  useEffect(() => {
    fetchFeaturedStates();
  }, []);

  const fetchFeaturedStates = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching featured states from backend...');
      // Fetch only featured and active states, limit to 8 for landing page
      const data = await stateService.getAllStates({ featured: 'true', isActive: 'true', limit: 8 });
      const statesArray = Array.isArray(data) ? data : (data?.states || []);
      console.log('✅ Featured states loaded:', statesArray.length);
      setStates(statesArray);
    } catch (error) {
      console.error('❌ Failed to fetch featured states:', error);
      setStates([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="top-states-section" style={{
      padding: isSmall ? '40px 8px' : isMobile ? '50px 12px' : window.innerWidth <= 1024 ? '60px 32px' : '60px 250px',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isSmall ? '24px' : '32px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h2 style={{
              fontSize: isSmall ? "1.8rem" : isMobile ? "2.2rem" : "3rem",
              fontWeight: "800",
              color: "#212529",
              margin: "0 0 8px 0",
              fontFamily: "'Playfair Display', 'Georgia', serif",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}>
              Top States in India
            </h2>
            <p style={{
              margin: 0,
              color: "#6c757d",
              fontSize: isSmall ? "14px" : "16px"
            }}>
              Explore the most popular travel destinations
            </p>
          </div>
          <button
            onClick={() => navigate('/all-states')}
            style={{
              border: '2px solid #FF6B35',
              color: '#FF6B35',
              backgroundColor: 'white',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '600',
              height: isSmall ? '44px' : '48px',
              padding: isSmall ? '0 20px' : '0 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: isSmall ? '14px' : '15px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#FF6B35';
              e.currentTarget.style.color = '#FF6B35';
              e.currentTarget.style.backgroundColor = '#fff5f2';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#FF6B35';
              e.currentTarget.style.color = '#FF6B35';
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            }}
          >
            See all
          </button>
        </div>

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', color: '#6c757d' }}>Loading states...</div>
            </div>
          </div>
        ) : states.length > 0 ? (
          <div style={{ position: 'relative' }}>
          <div
            id="top-states-scroll"
            style={{
              display: isMobile ? 'flex' : 'grid',
              gridTemplateColumns: isMobile ? 'none' : 'repeat(4, 1fr)',
              gap: isSmall ? '16px' : '20px',
              overflowX: isMobile ? 'auto' : 'visible',
              overflowY: 'visible',
              scrollBehavior: 'smooth',
              paddingBottom: isMobile ? '20px' : '0',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {states.map((state) => {
              // Calculate card width to show 1.5 items on screen for mobile
              const screenWidth = window.innerWidth;
              const gap = isSmall ? 16 : 20;
              const cardWidth = isMobile ? Math.floor((screenWidth - gap * 2) / 1.5) : null;
              
              return (
              <div
                key={state._id || state.slug}
                onClick={() => navigate(`/state/${state.slug}`)}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  backgroundColor: 'white',
                  ...(isMobile ? {
                    minWidth: `${cardWidth}px`,
                    width: `${cardWidth}px`,
                    flexShrink: 0
                  } : {})
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={state.heroImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&q=90'}
                    alt={state.name}
                    style={{
                      width: '100%',
                      height: isSmall ? '180px' : '220px',
                      objectFit: 'cover',
                      imageRendering: 'high-quality',
                      WebkitImageRendering: 'high-quality'
                    }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    padding: isSmall ? '12px' : '16px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    color: 'white'
                  }}>
                    <h3 style={{
                      fontSize: isSmall ? '1.1rem' : '1.3rem',
                      fontWeight: 'bold',
                      margin: '0 0 4px 0'
                    }}>
                      {state.name}
                    </h3>
                    <p style={{
                      fontSize: isSmall ? '12px' : '13px',
                      margin: 0,
                      opacity: 0.9
                    }}>
                      {state.tours ? `${state.tours}+ Tours` : 'Explore Tours'}
                    </p>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
          
          {/* Custom scrollbar hide for mobile */}
          {isMobile && (
            <style>
              {`
                #top-states-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
          )}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6c757d'
          }}>
            <p>No featured states available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopAttractions;

