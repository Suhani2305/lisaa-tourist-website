import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tourService } from "../../services";
import { Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Header from "../landingpage/components/Header";
import Footer from "../landingpage/components/Footer";

const TrendingDestinationsPage = () => {
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
      
      // Fetch all active packages
      const packages = await tourService.getAllTours();
      
      // Create all 7 categories with package counts (even if 0 packages)
      const allCategories = Object.keys(categoryMapping).map(cat => ({
        category: cat,
        ...categoryMapping[cat],
        packageCount: packages.filter(pkg => 
          pkg.trendingCategories && pkg.trendingCategories.includes(cat)
        ).length
      }));

      console.log('✅ Found trending categories:', allCategories);
      setCategories(allCategories);
    } catch (error) {
      console.error('❌ Failed to fetch trending categories:', error);
      // Fallback: Show all 7 categories with 0 package count
      const fallbackCategories = Object.keys(categoryMapping).map(cat => ({
        category: cat,
        ...categoryMapping[cat],
        packageCount: 0
      }));
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  // Show all categories (no filter needed)
  const filteredDestinations = categories;

  const isSmall = window.innerWidth <= 480;
  const isMobile = window.innerWidth <= 768;

  return (
    <>
      <Header />
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        {/* Main Content */}
        <div style={{
          maxWidth: isMobile ? "100%" : "1800px",
          margin: "0 auto",
          padding: isSmall ? "20px 8px" : isMobile ? "30px 12px" : window.innerWidth <= 1024 ? "40px 32px" : "60px 250px"
        }}>
          {/* Breadcrumb & Title */}
          <div style={{ 
            fontSize: isSmall ? "11px" : isMobile ? "12px" : "14px", 
            color: "#6c757d",
            marginBottom: "12px",
            fontFamily: "Poppins, sans-serif"
          }}>
            <span 
              onClick={() => {
                sessionStorage.setItem('scrollToTrendingDestinations', 'true');
                navigate("/");
              }}
              style={{ 
                cursor: "pointer",
                color: "#6c757d",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ff6b35"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#6c757d"}
            >
              Home
            </span>
            <span style={{ margin: "0 8px", color: "#6c757d" }}> &gt; </span>
            <span style={{ color: "#212529" }}>Trending Destinations</span>
          </div>
          <h1 style={{ 
            fontSize: isSmall ? "1.2rem" : isMobile ? "1.5rem" : "2rem", 
            fontWeight: "700", 
            color: "#212529", 
            margin: "0 0 24px 0",
            fontFamily: "Poppins, sans-serif"
          }}>
            Trending Destinations
          </h1>
          {/* Loading State */}
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px', color: '#6c757d' }}>Loading trending destinations...</div>
              </div>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              color: '#6c757d'
            }}>
              <p>No trending destinations available at the moment.</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>Packages will appear here once they are added with trending categories.</p>
            </div>
          ) : (
            /* Destinations Grid */
            <div style={{
              display: "grid",
              gridTemplateColumns: isSmall ? "1fr" : isMobile ? "repeat(2, 1fr)" : window.innerWidth <= 1024 ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
              gap: isSmall ? "16px" : isMobile ? "20px" : "24px"
            }}>
              {filteredDestinations.map(destination => (
                <div
                  key={destination.category}
                  onClick={() => {
                    // Navigate to packages filtered by trending category
                    navigate(`/package?trendingCategory=${encodeURIComponent(destination.category)}`);
                  }}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4/3",
                  borderRadius: isMobile ? "12px" : "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundColor: "#f8fafc",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
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
                    <div style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      fontSize: "20px",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                    }}>
                      {destination.icon}
                    </div>
                  )}
                  {/* Category Label */}
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    backgroundColor: "rgba(255, 107, 53, 0.9)",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase"
                  }}>
                    {destination.category}
                  </div>
                  {/* Title */}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "20px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                    color: "white",
                    fontWeight: "700",
                    fontSize: isSmall ? "0.9rem" : isMobile ? "1rem" : "1.1rem",
                    textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                    lineHeight: "1.3"
                  }}>
                    {destination.title || destination.category}
                    {destination.packageCount > 0 && (
                      <div style={{
                        fontSize: isSmall ? "0.7rem" : isMobile ? "0.75rem" : "0.8rem",
                        marginTop: "4px",
                        opacity: 0.9
                      }}>
                        {destination.packageCount} {destination.packageCount === 1 ? 'Package' : 'Packages'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Count */}
          <div style={{
            textAlign: "center",
            marginTop: "40px",
            padding: "20px",
            color: "#6c757d",
            fontSize: "14px"
          }}>
            Showing {filteredDestinations.length} {filteredDestinations.length === 1 ? "category" : "categories"}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrendingDestinationsPage;

