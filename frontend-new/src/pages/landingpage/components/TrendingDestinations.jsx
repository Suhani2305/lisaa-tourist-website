import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tourService } from "../../../services";
import { Spin } from "antd";

const TrendingDestinations = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category mapping with icons and images
  const categoryMapping = {
    "Culture & Heritage": {
      icon: "🕌",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&q=90",
      title: "Culture & Heritage"
    },
    "Nature & Adventure": {
      icon: "🏔️",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&q=90",
      title: "Nature & Adventure"
    },
    "Beaches & Islands": {
      icon: "🏖️",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&q=90",
      title: "Beaches & Islands"
    },
    "Wellness & Spirituality": {
      icon: "🧘‍♀️",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=90",
      title: "Wellness & Spirituality"
    },
    "Food & Festivals": {
      icon: "🍛",
      image: "https://kashiyatra.in/wp-content/uploads/2024/09/dev-diwali-varanasi.jpg",
      title: "Food & Festivals"
    },
    "Modern India": {
      icon: "🏙️",
      image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=1920&q=90",
      title: "Modern India"
    },
    "Special Journeys": {
      icon: "🚗",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=90",
      title: "Special Journeys"
    }
  };

  useEffect(() => {
    fetchTrendingCategories();
  }, []);

  const fetchTrendingCategories = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching packages to extract trending categories...');
      
      // Fetch all active packages (backend filters by isActive automatically)
      const packages = await tourService.getAllTours();
      
      // Create all 7 categories with package counts (even if 0 packages)
      const allCategories = Object.keys(categoryMapping).map(cat => ({
        category: cat,
        ...categoryMapping[cat],
        packageCount: packages.filter(pkg => 
          pkg.trendingCategories && pkg.trendingCategories.includes(cat)
        ).length
      }));

      // Sort by package count (descending) and take first 5 for landing page
      const sortedCategories = allCategories.sort((a, b) => b.packageCount - a.packageCount);
      const top5Categories = sortedCategories.slice(0, 5);

      console.log('✅ Found trending categories:', top5Categories);
      setCategories(top5Categories);
    } catch (error) {
      console.error('❌ Failed to fetch trending categories:', error);
      // Fallback: Show all 7 categories with 0 package count
      const fallbackCategories = Object.keys(categoryMapping).slice(0, 7).map(cat => ({
        category: cat,
        ...categoryMapping[cat],
        packageCount: 0
      }));
      setCategories(fallbackCategories.slice(0, 5)); // Still show only 5 on landing page
    } finally {
      setLoading(false);
    }
  };

  // Show only first 5 on landing page (from backend data)
  const displayedDestinations = categories;

  return (
    <section id="trending-destinations-section" style={{ 
      padding: window.innerWidth <= 480 ? "40px 8px" : window.innerWidth <= 768 ? "50px 12px" : window.innerWidth <= 1024 ? "60px 32px" : "80px 250px", 
      backgroundColor: "#fff", 
      boxSizing: "border-box",
      minHeight: "400px"
    }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: window.innerWidth <= 480 ? "15px" : window.innerWidth <= 768 ? "20px" : "40px",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <div>
          <h2
            style={{
              fontSize: window.innerWidth <= 480 ? "1.8rem" : window.innerWidth <= 768 ? "2.2rem" : "3rem",
              fontWeight: "800",
              color: "#212529",
              margin: "0 0 8px 0",
              fontFamily: "'Playfair Display', 'Georgia', serif",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
          >
            Trending Destinations
          </h2>
          <p style={{
            margin: 0,
            color: "#6c757d",
            fontSize: window.innerWidth <= 768 ? "14px" : "16px"
          }}>
            Discover popular travel categories
          </p>
        </div>
        <button
          onClick={() => navigate('/trending-destinations')}
          style={{
            border: "2px solid #FF6B35",
            color: "#FF6B35",
            backgroundColor: "white",
            fontFamily: "Poppins, sans-serif",
            fontWeight: "600",
            height: window.innerWidth <= 480 ? "44px" : "48px",
            padding: window.innerWidth <= 480 ? "0 20px" : "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: window.innerWidth <= 480 ? "14px" : "15px",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#FF6B35";
            e.currentTarget.style.color = "#FF6B35";
            e.currentTarget.style.backgroundColor = "#fff5f2";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 107, 53, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#FF6B35";
            e.currentTarget.style.color = "#FF6B35";
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
          }}
        >
          See all
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#6c757d' }}>Loading trending destinations...</div>
          </div>
        </div>
      ) : displayedDestinations.length === 0 ? (
        <div style={{ 
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6c757d'
        }}>
          <p>No trending destinations available at the moment.</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>Packages will appear here once they are added with trending categories.</p>
        </div>
      ) : (
        <>
        {/* Grid layout for desktop, Horizontal scroll for mobile */}
        <div style={{ position: "relative" }}>
        <div
          id="landing-trending-destinations-scroll"
          style={{
            display: window.innerWidth <= 768 ? "flex" : "grid",
            gridTemplateColumns: window.innerWidth <= 768 
              ? "none" 
              : window.innerWidth <= 1024
                ? "repeat(3, 1fr)"
                : "repeat(3, 1fr)",
            gridTemplateRows: window.innerWidth > 1024 && window.innerWidth > 768
              ? "repeat(2, 1fr)" 
              : "auto",
            gap: window.innerWidth <= 480 ? "12px" : window.innerWidth <= 768 ? "16px" : "20px",
            overflowX: window.innerWidth <= 768 ? "auto" : "visible",
            overflowY: "visible",
            scrollBehavior: "smooth",
            paddingBottom: window.innerWidth <= 768 ? "20px" : "0",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {displayedDestinations.map((destination, index) => {
            const isDesktop = window.innerWidth > 1024 && window.innerWidth > 768;
            const is5thCard = index === 4 && isDesktop;
            const isMobile = window.innerWidth <= 768;
            
            // Calculate card width to show 1.5 items on screen
            const screenWidth = window.innerWidth;
            const gap = window.innerWidth <= 480 ? 12 : 16;
            const cardWidth = isMobile ? Math.floor((screenWidth - gap * 2) / 1.5) : null;
            
            return (
              <div 
                key={destination.category || index}
                style={{
                  ...(is5thCard ? {
                    gridColumn: "3 / 4",
                    gridRow: "1 / 3",
                  } : {}),
                  ...(isMobile ? {
                    minWidth: `${cardWidth}px`,
                    width: `${cardWidth}px`,
                    flexShrink: 0
                  } : {})
                }}
              >
                <Card 
                  destination={destination} 
                  aspect={is5thCard ? "2/3" : "4/3"} 
                  navigate={navigate} 
                />
              </div>
            );
          })}
        </div>
        </div>
        
        {/* Custom scrollbar hide for mobile */}
        {window.innerWidth <= 768 && (
          <style>
            {`
              #landing-trending-destinations-scroll::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
        )}
        </>
      )}
    </section>
  );
};

const Card = ({ destination, aspect, navigate }) => {
  const handleClick = () => {
    // Navigate to packages filtered by trending category
    if (destination.category) {
      navigate(`/package?trendingCategory=${encodeURIComponent(destination.category)}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        aspectRatio: aspect || "4/3",
        borderRadius: window.innerWidth <= 480 ? "12px" : window.innerWidth <= 768 ? "15px" : "20px",
        overflow: "hidden",
        cursor: "pointer",
        backgroundColor: "#f8fafc",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
      }}
    >
      <img
        src={destination.image || "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&q=90"}
        alt={destination.title || destination.category}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(75%)",
          imageRendering: "high-quality",
          WebkitImageRendering: "high-quality"
        }}
        loading="lazy"
      />
      {/* Category Badge */}
      {destination.icon && (
        <div
          style={{
            position: "absolute",
            top: window.innerWidth <= 480 ? "8px" : window.innerWidth <= 768 ? "12px" : "16px",
            right: window.innerWidth <= 480 ? "8px" : window.innerWidth <= 768 ? "12px" : "16px",
            fontSize: window.innerWidth <= 480 ? "18px" : window.innerWidth <= 768 ? "20px" : "24px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "50%",
            width: window.innerWidth <= 480 ? "32px" : window.innerWidth <= 768 ? "36px" : "40px",
            height: window.innerWidth <= 480 ? "32px" : window.innerWidth <= 768 ? "36px" : "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
        >
          {destination.icon}
        </div>
      )}
      {/* Title */}
      <div
        style={{
          position: "absolute",
          bottom: window.innerWidth <= 480 ? "10px" : window.innerWidth <= 768 ? "15px" : "20px",
          left: window.innerWidth <= 480 ? "15px" : window.innerWidth <= 768 ? "20px" : "30px",
          right: window.innerWidth <= 480 ? "15px" : window.innerWidth <= 768 ? "20px" : "30px",
          color: "white",
          fontWeight: "700",
          fontSize: window.innerWidth <= 480 ? "0.85rem" : window.innerWidth <= 768 ? "0.95rem" : "1.1rem",
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          lineHeight: "1.3"
        }}
      >
        {destination.title || destination.category}
        {destination.packageCount > 0 && (
          <div style={{
            fontSize: window.innerWidth <= 480 ? "0.7rem" : window.innerWidth <= 768 ? "0.75rem" : "0.8rem",
            marginTop: "4px",
            opacity: 0.9
          }}>
            {destination.packageCount} {destination.packageCount === 1 ? 'Package' : 'Packages'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingDestinations;
