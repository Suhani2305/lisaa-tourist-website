import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tourService } from "../../../services";
import { Spin } from "antd";

const FeaturedTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedTrips();
  }, []);

  const fetchFeaturedTrips = async () => {
    try {
      setLoading(true);
      const data = await tourService.getAllTours({ featured: true });
      
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
      const formattedTrips = data.map(tour => {
        const priceInfo = calculateDiscountedPrice(tour);
        return {
          id: tour._id,
          image: tour.images?.[0] || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=90&auto=format&fit=crop",
          location: tour.destination,
          title: tour.title,
          description: tour.description ? tour.description.substring(0, 100) + '...' : '',
          rating: tour.rating?.average ? `${tour.rating.average} (${tour.rating.count})` : "4.5 (0)",
          duration: `${tour.duration?.days || 0} days`,
          price: priceInfo.hasDiscount 
            ? `From ₹${priceInfo.finalPrice.toLocaleString()}` 
            : `From ₹${priceInfo.originalPrice.toLocaleString()}`,
          originalPrice: priceInfo.originalPrice,
          hasDiscount: priceInfo.hasDiscount,
          discountValue: priceInfo.discountValue,
          discountType: priceInfo.discountType,
        };
      });
      
      setTrips(formattedTrips);
    } catch (error) {
      console.error("Failed to fetch featured trips:", error);
      setTrips([]); // Empty array - no mock data!
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (direction) => {
    const container = document.getElementById('trips-scroll-container');
    if (!container) return;
    const delta = Math.max(container.clientWidth * 0.8, 300);
    container.scrollBy({ left: direction === 'right' ? delta : -delta, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: "#fdf7f4", 
        padding: "80px 20px",
        textAlign: "center",
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: '#6c757d' }}>Loading featured trips...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: "#fdf7f4", 
      padding: window.innerWidth <= 768 ? "60px 16px 10px 16px" : window.innerWidth <= 1024 ? "80px 32px 10px 32px" : "120px 2px 10px 250px" 
    }}>
      <div style={{ 
        maxWidth: "1250px", 
        margin: "0 auto", 
        borderRadius: "20px" 
      }}>
        {/* Header Section */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: window.innerWidth <= 768 ? "20px" : "30px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <h2 style={{
              fontSize: window.innerWidth <= 480 ? "22px" : window.innerWidth <= 768 ? "26px" : "36px",
              margin: "0 0 8px 0",
              color: "#212529",
              fontWeight: "700",
              fontFamily: "Poppins, sans-serif"
            }}>
              Featured trips
            </h2>
            <p style={{
              margin: 0,
              color: "#6c757d",
              fontSize: window.innerWidth <= 768 ? "14px" : "16px"
            }}>
              Your choice. Discover the best packages
            </p>
          </div>
        </div>

        {/* Trips Container */}
        <div
          id="trips-scroll-container"
          style={{
            display: "flex",
            gap: window.innerWidth <= 768 ? "12px" : "20px",
            overflowX: "auto",
            scrollBehavior: "smooth",
            paddingBottom: "20px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            borderTopLeftRadius: "50px"
          }}
        >
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => navigate(`/package/${trip.id}`)}
              style={{
                minWidth: window.innerWidth <= 480 ? "280px" : window.innerWidth <= 768 ? "300px" : window.innerWidth <= 1440 ? "240px" : "280px",
                backgroundColor: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "transform 0.3s, box-shadow 0.3s",
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
            >
              {/* Image Section */}
              <div style={{ position: "relative", height: "220px" }}>
                <img
                  src={trip.image}
                  alt={trip.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    imageRendering: "high-quality",
                    WebkitImageRendering: "high-quality"
                  }}
                />
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
              </div>

              {/* Content Section */}
              <div style={{ padding: "16px" }}>
                <div style={{
                  fontSize: "13px",
                  color: "#6c757d",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  <span>📍</span>
                  <span>{trip.location}</span>
                </div>

                <h3 style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: "0 0 8px 0",
                  color: "#212529",
                  lineHeight: "1.4"
                }}>
                  {trip.title}
                </h3>

                {/* Description */}
                {trip.description && (
                  <p style={{
                    fontSize: "13px",
                    color: "#6c757d",
                    margin: "0 0 12px 0",
                    lineHeight: "1.5",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {trip.description}
                  </p>
                )}

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px"
                }}>
                  <span style={{ color: "#ffc107", fontSize: "14px" }}>★</span>
                  <span style={{ fontSize: "14px", color: "#212529", fontWeight: "500" }}>
                    {trip.rating}
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "12px",
                  borderTop: "1px solid #f1f3f5"
                }}>
                  <span style={{
                    fontSize: "13px",
                    color: "#6c757d",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <span>🕒</span>
                    <span>{trip.duration}</span>
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {trip.hasDiscount && (
                      <span style={{
                        fontSize: '12px',
                        color: '#6c757d',
                        textDecoration: 'line-through',
                        marginBottom: '2px'
                      }}>
                        ₹{trip.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#ff6b35"
                    }}>
                      {trip.price}
                    </span>
                    {trip.hasDiscount && (
                      <span style={{
                        fontSize: '11px',
                        color: '#28a745',
                        fontWeight: '600',
                        marginTop: '2px'
                      }}>
                        {trip.discountType === 'percentage' ? `${trip.discountValue}% OFF` : `₹${trip.discountValue} OFF`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Bottom Left */}
        <div style={{ 
          display: "flex", 
          gap: "22px", 
          marginTop: window.innerWidth <= 768 ? "15px" : "20px",
          marginBottom: window.innerWidth <= 768 ? "15px" : "20px",
          justifyContent: "flex-start"
        }}>
          <button
            onClick={() => handleScroll('left')}
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#ff6b35",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "white",
              boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f15a29";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 107, 53, 0.4)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ff6b35";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(255, 107, 53, 0.3)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            
          </button>
          <button
            onClick={() => handleScroll('right')}
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#ff6b35",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "white",
              boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f15a29";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 107, 53, 0.4)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ff6b35";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(255, 107, 53, 0.3)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            
          </button>
        </div>

        {/* Custom scrollbar hide */}
        <style>
          {`
            #trips-scroll-container::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default FeaturedTrips;
