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
              fontSize: isSmall ? '1.5rem' : isMobile ? '1.8rem' : '2rem',
              fontWeight: 'bold',
              color: '#212529',
              marginBottom: '8px'
            }}>
              Top States in India
            </h2>
            <p style={{
              fontSize: isSmall ? '13px' : '14px',
              color: '#6c757d',
              margin: 0
            }}>
              Explore the most popular travel destinations
            </p>
          </div>
          <button
            onClick={() => navigate('/all-states')}
            style={{
              padding: isSmall ? '8px 16px' : '10px 20px',
              backgroundColor: 'transparent',
              color: '#FF6B35',
              border: '2px solid #FF6B35',
              borderRadius: '8px',
              fontSize: isSmall ? '13px' : '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6B35';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#FF6B35';
            }}
          >
            See all states →
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: isSmall ? '1fr' : isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isSmall ? '16px' : '20px'
          }}>
            {states.map((state) => (
              <div
                key={state._id || state.slug}
                onClick={() => navigate(`/state/${state.slug}`)}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  backgroundColor: 'white'
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
            ))}
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

