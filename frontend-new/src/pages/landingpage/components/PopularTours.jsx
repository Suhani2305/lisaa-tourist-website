import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourService } from '../../../services';
import { Spin } from 'antd';

const PopularTours = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularTours();
  }, []);

  const fetchPopularTours = async () => {
    try {
      setLoading(true);
      const data = await tourService.getAllTours();
      
      // Helper function to calculate discounted price
      const calculateDiscountedPrice = (tour) => {
        const originalPrice = tour.price?.adult || 0;
        const discount = tour.discount;
        
        if (!discount || !discount.isActive) {
          return { originalPrice, finalPrice: originalPrice, hasDiscount: false };
        }
        
        // Check if discount is within date range
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
        
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
      
      // Transform backend data to component format
      const formattedTours = data.slice(0, 4).map(tour => {
        const priceInfo = calculateDiscountedPrice(tour);
        return {
          id: tour._id,
          image: tour.images?.[0] || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=90&auto=format&fit=crop",
          location: tour.destination,
          title: tour.title,
          description: tour.description ? tour.description.substring(0, 100) + '...' : '',
          rating: tour.rating?.average ? `${tour.rating.average} (${tour.rating.count})` : "4.5 (0)",
          duration: `${tour.duration?.days || 0} days`,
          price: priceInfo.hasDiscount 
            ? `₹${priceInfo.finalPrice.toLocaleString()}` 
            : `₹${priceInfo.originalPrice.toLocaleString()}`,
          originalPrice: priceInfo.originalPrice,
          hasDiscount: priceInfo.hasDiscount,
          discountValue: priceInfo.discountValue,
          discountType: priceInfo.discountType,
          type: tour.category || "Tour"
        };
      });
      
      setTours(formattedTours);
    } catch (error) {
      console.error("Failed to fetch popular tours:", error);
      setTours([]); // Empty array - no mock data!
    } finally {
      setLoading(false);
    }
  };

  // Component for the heart icon (Top right of the image)
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

  if (loading) {
    return (
      <div style={{ 
        padding: "80px 20px", 
        backgroundColor: 'white',
        textAlign: "center",
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: '#6c757d' }}>Loading popular tours...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: window.innerWidth <= 480 ? '20px 0' : window.innerWidth <= 768 ? '30px 0' : '100px 0', 
      backgroundColor: 'white' 
    }}>
      {/* Main Container with responsive padding */}
      <div style={{ 
        maxWidth: window.innerWidth <= 768 ? '100%' : '1800px', 
        maxHeight: '800px',
        margin: '0 auto', 
        padding: window.innerWidth <= 480 ? '0 8px' : window.innerWidth <= 768 ? '0 12px' : window.innerWidth <= 1024 ? '0 32px' : '0 250px' 
      }}>
        {/* Header Section */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center',
          marginBottom: window.innerWidth <= 768 ? '20px' : '40px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
          <h2 style={{
              fontSize: window.innerWidth <= 480 ? "1.8rem" : window.innerWidth <= 768 ? "2.2rem" : "3rem",
              fontWeight: "800",
              color: "#212529",
              margin: "0 0 8px 0",
              fontFamily: "'Playfair Display', 'Georgia', serif",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
          }}>
            Popular Indian Tours
          </h2>
          <p style={{
              margin: 0,
              color: "#6c757d",
              fontSize: window.innerWidth <= 768 ? "14px" : "16px"
          }}>
            Explore the rich cultural heritage and spiritual destinations of India
          </p>
          </div>
          <button
            onClick={() => navigate('/package')}
            style={{
              border: '2px solid #FF6B35',
              color: '#FF6B35',
              backgroundColor: 'white',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '600',
              height: window.innerWidth <= 480 ? '44px' : '48px',
              padding: window.innerWidth <= 480 ? '0 20px' : '0 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: window.innerWidth <= 480 ? '14px' : '15px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              alignSelf: window.innerWidth <= 768 ? 'flex-start' : 'center',
              whiteSpace: 'nowrap'
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

        {/* Tours Grid */}
        <div style={{ position: 'relative' }}>
        <div
          id="popular-tours-scroll"
          style={{
            display: window.innerWidth <= 768 ? 'flex' : 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? 'none' :
                             window.innerWidth <= 1024 ? 'repeat(3, 1fr)' : 
                             'repeat(4, 1fr)',
            gap: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '16px' : '24px',
            overflowX: window.innerWidth <= 768 ? 'auto' : 'visible',
            overflowY: 'visible',
            scrollBehavior: 'smooth',
            paddingBottom: window.innerWidth <= 768 ? '20px' : '0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {tours.map((tour) => {
            // Calculate card width to show 1.5 items on screen for mobile
            const screenWidth = window.innerWidth;
            const gap = window.innerWidth <= 480 ? 12 : 16;
            const cardWidth = window.innerWidth <= 768 ? Math.floor((screenWidth - gap * 2) / 1.5) : null;
            
            return (
            <div
              key={tour.id}
              onClick={() => navigate(`/package/${tour.id}`)}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                ...(window.innerWidth <= 768 ? {
                  minWidth: `${cardWidth}px`,
                  width: `${cardWidth}px`,
                  flexShrink: 0
                } : {})
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              {/* Image Container */}
              <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
                <img
                  src={tour.image}
                  alt={tour.title}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    imageRendering: 'high-quality',
                    WebkitImageRendering: 'high-quality'
                  }}
                />
                <CardIcons />
                
                {/* Tour Type Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(255, 107, 53, 0.9)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {tour.type}
                </div>
              </div>

              {/* Content Container */}
              <div style={{ padding: window.innerWidth <= 480 ? '12px' : '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Location */}
                <div style={{
                  fontSize: '13px',
                  color: '#6c757d',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>📍</span>
                  <span>{tour.location}</span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: window.innerWidth <= 480 ? '15px' : '16px',
                  fontWeight: '600',
                  color: '#212529',
                  margin: '0 0 8px 0',
                  lineHeight: '1.4'
                }}>
                  {tour.title}
                </h3>

                {/* Description */}
                {tour.description && (
                  <p style={{
                    fontSize: window.innerWidth <= 480 ? '12px' : '13px',
                    color: '#6c757d',
                    margin: '0 0 12px 0',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {tour.description}
                  </p>
                )}

                {/* Rating */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '12px'
                }}>
                  <span style={{ color: '#ffc107', fontSize: '14px' }}>★</span>
                  <span style={{ fontSize: '14px', color: '#212529', fontWeight: '500' }}>
                    {tour.rating}
                  </span>
                </div>

                {/* Duration and Price */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f3f5'
                }}>
                  <span style={{
                    fontSize: '13px',
                    color: '#6c757d',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>🕒</span>
                    <span>{tour.duration}</span>
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {tour.hasDiscount && (
                      <span style={{
                        fontSize: '12px',
                        color: '#6c757d',
                        textDecoration: 'line-through',
                        marginBottom: '2px'
                      }}>
                        ₹{tour.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span style={{
                      fontSize: window.innerWidth <= 480 ? '15px' : '16px',
                      fontWeight: '700',
                      color: '#ff6b35'
                    }}>
                      {tour.price}
                    </span>
                    {tour.hasDiscount && (
                      <span style={{
                        fontSize: '11px',
                        color: '#28a745',
                        fontWeight: '600',
                        marginTop: '2px'
                      }}>
                        {tour.discountType === 'percentage' ? `${tour.discountValue}% OFF` : `₹${tour.discountValue} OFF`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
          })}
        </div>
        
        {/* Custom scrollbar hide for mobile */}
        {window.innerWidth <= 768 && (
          <style>
            {`
              #popular-tours-scroll::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
        )}
        </div>

      </div>
    </div>
  );
};

export default PopularTours;
