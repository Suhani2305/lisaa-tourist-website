import React from 'react';

// Placeholder image for the avatar
const placeholderAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&q=80'; // Placeholder avatar

 

const CustomerReviews = () => {
  // Styles for avatar
  const activeAvatarStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid white',
    boxShadow: '0 0 0 2px rgba(0,0,0,0.1)',
    marginRight: '15px',
  };

  // Logo renderer
  const Logo = ({ name, size = '90px', style }) => {
    const svgUri = placeholderLogos[name];
    if (!svgUri) return null;
    return (
      <div
        style={{
          width: size,
          height: 'auto',
          padding: '0 10px',
          opacity: 0.7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        <img src={svgUri} alt={`${name} logo`} style={{ width: '100%', height: 'auto' }} />
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: window.innerWidth <= 768 ? '40px 16px' : window.innerWidth <= 1024 ? '60px 32px' : '80px 250px',
        minHeight: window.innerWidth <= 768 ? 'auto' : '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Main dark-blue container */}
      <div
        style={{
          backgroundColor: '#1F2039',
          maxWidth: '1400px',
          width: '100%',
          borderRadius: window.innerWidth <= 768 ? '20px' : '30px',
          padding: window.innerWidth <= 768 ? '30px 20px' : window.innerWidth <= 1024 ? '50px 40px' : '60px 50px',
          boxShadow: '0 15px 50px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative gradient overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
          pointerEvents: 'none'
        }}></div>

        {/* Inner content */}
        <div
          className="inner-content-wrapper"
          style={{
            display: 'flex',
            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center',
            gap: window.innerWidth <= 768 ? '30px' : '60px',
            width: '100%',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Left Section */}
          <div style={{ 
            flex: 1, 
            color: 'white',
            width: window.innerWidth <= 768 ? '100%' : 'auto'
          }}>
            <h2
              style={{
                fontSize: window.innerWidth <= 480 ? '1.2rem' : window.innerWidth <= 768 ? '1.5rem' : '2rem',
                fontWeight: '700',
                marginBottom: window.innerWidth <= 768 ? '24px' : '30px',
                lineHeight: '1.3',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              What our Travelers <br /> are saying
            </h2>

            <div style={{ 
              marginBottom: window.innerWidth <= 768 ? '24px' : '30px',
              paddingBottom: window.innerWidth <= 768 ? '20px' : '30px',
              borderBottom: window.innerWidth <= 768 ? 'none' : '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: window.innerWidth <= 768 ? 'row' : 'column',
                gap: window.innerWidth <= 768 ? '20px' : '0',
                alignItems: window.innerWidth <= 768 ? 'flex-start' : 'flex-start'
              }}>
                {/* Rating Section */}
                <div style={{ flex: window.innerWidth <= 768 ? '1' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                    <h3 style={{ 
                      fontSize: window.innerWidth <= 480 ? '2rem' : window.innerWidth <= 768 ? '2.5rem' : '3rem', 
                      fontWeight: '800', 
                      margin: 0,
                      color: '#ff6b35'
                    }}>4.8</h3>
                    <span style={{ fontSize: window.innerWidth <= 768 ? '1rem' : '1.2rem', opacity: 0.9 }}>⭐</span>
                  </div>
                  <p
                    style={{
                      fontSize: window.innerWidth <= 480 ? '0.75rem' : window.innerWidth <= 768 ? '0.85rem' : '0.95rem',
                      opacity: 0.9,
                      margin: 0,
                      lineHeight: '1.5',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    1000+ reviews on TripAdvisor
                    <br />
                    <span style={{ color: '#ff6b35', fontWeight: '600' }}>Certificate of Excellence</span>
                  </p>
                </div>

                {/* Happy Customers Section */}
                <div style={{ flex: window.innerWidth <= 768 ? '1' : 'none' }}>
                  <h3 style={{ 
                    fontSize: window.innerWidth <= 480 ? '2rem' : window.innerWidth <= 768 ? '2.5rem' : '3.5rem', 
                    fontWeight: '800', 
                    margin: '0 0 8px',
                    color: '#ff6b35'
                  }}>16M</h3>
                  <p
                    style={{
                      fontSize: window.innerWidth <= 480 ? '0.75rem' : window.innerWidth <= 768 ? '0.85rem' : '0.95rem',
                      opacity: 0.9,
                      margin: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Happy customers
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section (Review Card) */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-end',
              position: 'relative',
              width: window.innerWidth <= 768 ? '100%' : 'auto',
              maxWidth: window.innerWidth <= 768 ? '100%' : '450px'
            }}
          >
            {/* Background stacked card */}
            <div
              style={{
                backgroundColor: '#D7D8DA',
                borderRadius: window.innerWidth <= 768 ? '20px' : '25px',
                position: 'absolute',
                top: window.innerWidth <= 768 ? '10px' : '15px',
                left: window.innerWidth <= 768 ? '10px' : '15px',
                width: 'calc(100% - 20px)',
                height: 'calc(100% - 20px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                opacity: 0.6
              }}
            ></div>

            {/* Main Review Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: window.innerWidth <= 480 ? '24px' : window.innerWidth <= 768 ? '30px' : '40px',
                borderRadius: window.innerWidth <= 768 ? '20px' : '25px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                width: '100%',
                position: 'relative',
                zIndex: 1,
                border: '1px solid rgba(255,107,53,0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.15)';
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: window.innerWidth <= 768 ? '10px' : '15px',
                  right: window.innerWidth <= 768 ? '15px' : '20px',
                  fontSize: window.innerWidth <= 768 ? '100px' : '150px',
                  color: 'rgba(255,107,53,0.08)',
                  lineHeight: '0.1',
                  userSelect: 'none',
                  zIndex: 0,
                  fontFamily: 'Georgia, serif'
                }}
              >
                &ldquo;
              </div>

              <p
                style={{
                  color: '#ff6b35',
                  fontWeight: '700',
                  marginBottom: '12px',
                  fontSize: window.innerWidth <= 768 ? '1rem' : '1.1rem',
                  position: 'relative',
                  zIndex: 1,
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Amazing Experience
              </p>

              <p
                style={{
                  fontSize: window.innerWidth <= 480 ? '0.9rem' : window.innerWidth <= 768 ? '0.95rem' : '1rem',
                  color: '#495057',
                  lineHeight: '1.7',
                  marginBottom: window.innerWidth <= 768 ? '24px' : '30px',
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 1,
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                "LSIAA provided us with an incredible travel experience! From the moment we booked our trip to the spiritual destinations of India, everything was perfectly organized. The guides were knowledgeable, the accommodations were excellent, and the itinerary was well-planned. Highly recommended for anyone looking to explore India's rich heritage!"
              </p>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                position: 'relative', 
                zIndex: 1,
                paddingTop: window.innerWidth <= 768 ? '16px' : '20px',
                borderTop: '1px solid #f1f3f5'
              }}>
                <img 
                  src={placeholderAvatar} 
                  alt="Reviewer Avatar" 
                  style={{
                    ...activeAvatarStyle,
                    width: window.innerWidth <= 768 ? '45px' : '50px',
                    height: window.innerWidth <= 768 ? '45px' : '50px',
                    marginRight: window.innerWidth <= 768 ? '12px' : '15px'
                  }} 
                />
                <div>
                  <h4
                    style={{
                      fontSize: window.innerWidth <= 768 ? '15px' : '17px',
                      fontWeight: '700',
                      color: '#212529',
                      marginBottom: '4px',
                      margin: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Suhani
                  </h4>
                  <p
                    style={{
                      fontSize: window.innerWidth <= 768 ? '12px' : '13px',
                      color: '#6c757d',
                      margin: 0,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    Travel Enthusiast
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

         
      </div>
    </div>
  );
};

export default CustomerReviews;
