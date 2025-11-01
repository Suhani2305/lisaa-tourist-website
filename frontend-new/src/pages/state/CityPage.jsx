import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Card, Row, Col, message, Tag } from 'antd';
import { stateService } from '../../services';
import Header from '../landingpage/components/Header';
import Footer from '../landingpage/components/Footer';

const CityPage = () => {
  const { stateSlug, citySlug } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSmall = window.innerWidth <= 480;
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCityData();
  }, [stateSlug, citySlug]);

  const fetchCityData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching city data:', stateSlug, citySlug);
      
      const data = await stateService.getCityBySlug(stateSlug, citySlug);
      console.log('✅ City data loaded:', data);
      
      setCity(data.city);
      setTours(data.tours || []);
    } catch (error) {
      console.error('❌ Failed to fetch city:', error);
      message.error('Failed to load city data');
      setTimeout(() => navigate(`/state/${stateSlug}`), 2000);
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
            <div style={{ marginTop: '16px', color: '#6c757d' }}>Loading city...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!city) {
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
            <h2>City not found</h2>
            <button onClick={() => navigate(`/state/${stateSlug}`)} style={{
              padding: '10px 20px',
              backgroundColor: '#FF6B35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px'
            }}>
              Go to State Page
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
        {/* Header/Navigation */}
        <div style={{
          backgroundColor: 'white',
          padding: isSmall ? '12px 0' : isMobile ? '14px 0' : '16px 0',
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
            gap: isMobile ? '12px' : '20px',
            flexWrap: 'wrap'
          }}>
            <button onClick={() => navigate(`/state/${stateSlug}`)} style={{
              padding: isSmall ? '6px 12px' : '8px 16px',
              backgroundColor: 'transparent',
              color: '#FF6B35',
              border: '2px solid #FF6B35',
              borderRadius: isMobile ? '6px' : '8px',
              cursor: 'pointer',
              fontSize: isSmall ? '12px' : '14px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}>
              ← {isSmall ? 'Back' : `Back to ${stateSlug}`}
            </button>
            <div>
              <div style={{ 
                fontSize: isSmall ? '10px' : '12px', 
                color: '#6c757d' 
              }}>
                Home / {stateSlug} / {city.name}
              </div>
              <h1 style={{ 
                fontSize: isSmall ? '1.1rem' : isMobile ? '1.3rem' : '2rem', 
                fontWeight: 'bold', 
                color: '#212529',
                margin: '4px 0 0 0'
              }}>
                {city.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div style={{
          maxWidth: isMobile ? '100%' : '1800px',
          margin: isSmall ? '20px auto' : isMobile ? '30px auto' : '40px auto',
          padding: isSmall ? '0 8px' : isMobile ? '0 12px' : window.innerWidth <= 1024 ? '0 32px' : '0 250px'
        }}>
          <Card style={{
            borderRadius: isMobile ? '12px' : '16px',
            marginBottom: isSmall ? '20px' : isMobile ? '30px' : '40px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {/* Hero Image */}
            {city.heroImage && (
              <div style={{
                width: '100%',
                height: isSmall ? '200px' : isMobile ? '300px' : '400px',
                marginBottom: '24px',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <img
                  src={city.heroImage}
                  alt={city.name}
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
              fontSize: isSmall ? '1.1rem' : isMobile ? '1.3rem' : '1.8rem',
              fontWeight: 'bold',
              color: '#212529',
              marginBottom: isSmall ? '12px' : '16px'
            }}>
              {city.name}
            </h2>
            <p style={{
              fontSize: isSmall ? '13px' : isMobile ? '14px' : '16px',
              color: '#6c757d',
              lineHeight: '1.6',
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}>
              {city.description}
            </p>

            {/* City Info */}
            {(city.bestTimeToVisit || city.attractions?.length > 0) && (
              <div style={{
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #e9ecef'
              }}>
                {city.bestTimeToVisit && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ color: '#FF6B35' }}>Best Time to Visit:</strong>
                    <div style={{ color: '#6c757d', marginTop: '4px' }}>{city.bestTimeToVisit}</div>
                  </div>
                )}
                {city.attractions && city.attractions.length > 0 && (
                  <div>
                    <strong style={{ color: '#FF6B35' }}>Popular Attractions:</strong>
                    <div style={{ marginTop: '8px' }}>
                      {city.attractions.map((attraction, index) => (
                        <Tag key={index} color="orange" style={{ marginBottom: '8px' }}>
                          {attraction}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Tours Section */}
          <div>
            <h2 style={{
              fontSize: isSmall ? '1.3rem' : isMobile ? '1.5rem' : '2rem',
              fontWeight: 'bold',
              color: '#212529',
              marginBottom: '24px'
            }}>
              Tours in {city.name}
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
                <p>No tours available for this city yet.</p>
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

export default CityPage;

