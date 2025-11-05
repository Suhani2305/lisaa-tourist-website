import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Card, Row, Col, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { stateService, tourService } from '../../services';
import Header from '../landingpage/components/Header';
import Footer from '../landingpage/components/Footer';

const StatePage = () => {
  const { stateSlug } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [cities, setCities] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSmall = window.innerWidth <= 480;
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchStateData();
  }, [stateSlug]);

  const fetchStateData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching state data for:', stateSlug);
      
      const data = await stateService.getStateBySlug(stateSlug);
      console.log('✅ State data loaded:', data);
      
      setState(data.state);
      setCities(data.cities || []);
      setTours(data.tours || []);
    } catch (error) {
      console.error('❌ Failed to fetch state:', error);
      message.error('Failed to load state data');
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ 
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#6c757d' }}>Loading state...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!state) {
    return (
      <>
        <Header />
        <div style={{ 
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div>
            <h2>State not found</h2>
            <button onClick={() => navigate('/')} style={{
              padding: '10px 20px',
              backgroundColor: '#FF6B35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px'
            }}>
              Go to Homepage
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        {/* Hero Section */}
        <div style={{
          maxWidth: isMobile ? '100%' : '1800px',
          margin: isSmall ? '20px auto' : isMobile ? '30px auto' : '40px auto',
          padding: isSmall ? '0 8px' : isMobile ? '0 12px' : window.innerWidth <= 1024 ? '0 32px' : '0 250px'
        }}>
          {/* Breadcrumb & Title */}
          <div style={{ 
            fontSize: isSmall ? '11px' : isMobile ? '12px' : '14px', 
            color: '#6c757d',
            marginBottom: '12px',
            fontFamily: 'Poppins, sans-serif'
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
              onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
            >
              Home
            </span>
            <span style={{ margin: '0 8px', color: '#6c757d' }}> &gt; </span>
            <span 
              onClick={() => navigate('/all-states')}
              style={{ 
                cursor: 'pointer',
                color: '#6c757d',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
            >
              States
            </span>
            {state && (
              <>
                <span style={{ margin: '0 8px', color: '#6c757d' }}> &gt; </span>
                <span style={{ color: '#212529' }}>{state.name}</span>
              </>
            )}
          </div>
          <h1 style={{ 
            fontSize: isSmall ? '1.2rem' : isMobile ? '1.5rem' : '2rem', 
            fontWeight: '700', 
            color: '#212529',
            margin: '0 0 24px 0',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Explore {state.name}
          </h1>
          <Card style={{
            borderRadius: isMobile ? '12px' : '16px',
            marginBottom: isSmall ? '20px' : isMobile ? '30px' : '40px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {/* Hero Image */}
            {state.heroImage && (
              <div style={{
                width: '100%',
                height: isSmall ? '200px' : isMobile ? '300px' : '400px',
                marginBottom: '24px',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <img
                  src={state.heroImage}
                  alt={state.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    imageRendering: 'high-quality',
                    WebkitImageRendering: 'high-quality'
                  }}
                />
              </div>
            )}

            <h2 style={{
              fontSize: isSmall ? '1.2rem' : isMobile ? '1.5rem' : '1.75rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: isSmall ? '12px' : '16px',
              fontFamily: 'Poppins, sans-serif'
            }}>
              {state.name}
            </h2>
            <p style={{
              fontSize: isSmall ? '13px' : isMobile ? '14px' : '16px',
              color: '#6c757d',
              lineHeight: '1.6',
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}>
              {state.description}
            </p>

            {/* State Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isSmall ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid #e9ecef'
            }}>
              {state.capital && (
                <div>
                  <strong style={{ color: '#FF6B35' }}>Capital:</strong>
                  <div style={{ color: '#6c757d', marginTop: '4px' }}>{state.capital}</div>
                </div>
              )}
              {state.area && (
                <div>
                  <strong style={{ color: '#FF6B35' }}>Area:</strong>
                  <div style={{ color: '#6c757d', marginTop: '4px' }}>{state.area}</div>
                </div>
              )}
              {state.population && (
                <div>
                  <strong style={{ color: '#FF6B35' }}>Population:</strong>
                  <div style={{ color: '#6c757d', marginTop: '4px' }}>{state.population}</div>
                </div>
              )}
              {state.bestTimeToVisit && (
                <div>
                  <strong style={{ color: '#FF6B35' }}>Best Time:</strong>
                  <div style={{ color: '#6c757d', marginTop: '4px' }}>{state.bestTimeToVisit}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Cities Section */}
          <div style={{ marginBottom: isSmall ? '20px' : isMobile ? '30px' : '40px' }}>
            <h2 style={{
              fontSize: isSmall ? '1.3rem' : isMobile ? '1.5rem' : '2rem',
              fontWeight: 'bold',
              color: '#212529',
              marginBottom: '24px'
            }}>
              Popular Cities in {state.name}
            </h2>
            {cities.length > 0 ? (
              <Row gutter={[16, 16]}>
                {cities.map((city) => (
                  <Col key={city._id || city.slug} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      onClick={() => navigate(`/state/${stateSlug}/${city.slug}`)}
                      cover={
                        city.heroImage ? (
                          <img
                            src={city.heroImage}
                            alt={city.name}
                            style={{
                              height: '180px',
                              objectFit: 'cover',
                              imageRendering: 'high-quality',
                              WebkitImageRendering: 'high-quality'
                            }}
                            loading="lazy"
                          />
                        ) : (
                          <div style={{
                            height: '180px',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999'
                          }}>
                            No Image
                          </div>
                        )
                      }
                      style={{ borderRadius: '12px', overflow: 'hidden' }}
                    >
                      <Card.Meta
                        title={city.name}
                        description={
                          <div style={{
                            fontSize: '13px',
                            color: '#6c757d',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {city.shortDescription || city.description?.substring(0, 100) || 'Explore this beautiful city'}
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                color: '#6c757d'
              }}>
                <p>No cities available for this state yet.</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Check back later or contact us for more information.</p>
              </div>
            )}
          </div>

          {/* Tours Section */}
          <div>
            <h2 style={{
              fontSize: isSmall ? '1.2rem' : isMobile ? '1.5rem' : '1.75rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '24px',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Tours in {state.name}
            </h2>
            {tours.length > 0 ? (
              <Row gutter={[16, 16]}>
                {tours.map((tour) => (
                  <Col key={tour._id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      onClick={() => navigate(`/package/${tour._id || tour.slug}`)}
                      cover={
                        tour.images && tour.images.length > 0 ? (
                          <img
                            src={tour.images[0]}
                            alt={tour.title}
                            style={{
                              height: '200px',
                              objectFit: 'cover',
                              imageRendering: 'high-quality',
                              WebkitImageRendering: 'high-quality'
                            }}
                            loading="lazy"
                          />
                        ) : (
                          <div style={{
                            height: '200px',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999'
                          }}>
                            No Image
                          </div>
                        )
                      }
                      style={{ borderRadius: '12px', overflow: 'hidden' }}
                    >
                      <Card.Meta
                        title={tour.title}
                        description={
                          <div>
                            <div style={{ color: '#FF6B35', fontWeight: 'bold', fontSize: '16px', marginTop: '8px' }}>
                              ₹{tour.price?.adult?.toLocaleString() || 'N/A'}
                            </div>
                            {tour.shortDescription && (
                              <div style={{
                                fontSize: '13px',
                                color: '#6c757d',
                                marginTop: '8px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {tour.shortDescription}
                              </div>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                color: '#6c757d'
              }}>
                <p>No tours available for this state yet.</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Check back later or explore our packages section.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StatePage;

