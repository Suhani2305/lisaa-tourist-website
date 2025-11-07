import React from 'react';
import { useNavigate } from 'react-router-dom';

const PromotionalBanner = () => {
  const navigate = useNavigate();
  // Styles for the background shape on the left side
  const backgroundShapeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    // This creates the subtle, rounded, off-white background shape
    backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><path fill=\'%23ffffff\' d=\'M0 0h100v100H0z\'/><path fill=\'%23fff\' d=\'M0 0c20 0 50 10 70 30S90 70 70 100H0z\'/><path fill=\'%23fef6f3\' d=\'M0 0c20 0 50 10 70 30S90 70 70 100H0z\' transform=\'scale(1.1)\' transform-origin=\'50 50\' opacity=\'0.5\'/></svg>")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '20px 0 0 20px', // Matches the container's left border radius
    opacity: 0.9, // Make it subtle
  };

  return (
    <div style={{ 
      padding: window.innerWidth <= 768 ? '40px 16px' : window.innerWidth <= 1024 ? '80px 32px' : '120px 170px', 
      backgroundColor: '#ffffff' 
    }}>
      <div style={{ 
        maxWidth: '1300px', 
        margin: '0 auto' 
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: window.innerWidth <= 768 ? '16px' : '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          alignItems: 'stretch',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          minHeight: window.innerWidth <= 768 ? 'auto' : '400px'
        }}>
          
          {/* Left Side - Text Content */}
          <div style={{
            flex: window.innerWidth <= 768 ? 'none' : '1 1 320px',
            padding: window.innerWidth <= 768 ? '24px 20px' : '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: window.innerWidth <= 768 ? '#f8f9fa' : '#393230',
            zIndex: 2,
            order: window.innerWidth <= 768 ? 1 : 1
          }}>
             {/* The background shape from the image */}
             <div style={backgroundShapeStyle}></div> 

            {/* Content Wrapper */}
            <div style={{ position: 'relative', zIndex: 3 }}>
                <h2 style={{
                fontSize: window.innerWidth <= 480 ? '1.3rem' : window.innerWidth <= 768 ? '1.5rem' : window.innerWidth <= 1024 ? '2rem' : '2.5rem',
                fontWeight: 'normal',
                color: window.innerWidth <= 768 ? '#343a40' : '#343a40',
                marginBottom: '5px',
                lineHeight: '1.2'
                }}>
                Grab up to <span style={{ color: '#ff6b35', fontWeight: 'bold' }}>35% off</span>
                </h2>
                <h2 style={{
                fontSize: window.innerWidth <= 480 ? '1.3rem' : window.innerWidth <= 768 ? '1.5rem' : window.innerWidth <= 1024 ? '2rem' : '2.5rem',
                fontWeight: 'bold',
                color: window.innerWidth <= 768 ? '#343a40' : '#343a40',
                marginBottom: window.innerWidth <= 768 ? '16px' : '30px',
                lineHeight: '1.2'
                }}>
                on your favorite<br />Destination
                </h2>
                <p style={{
                fontSize: window.innerWidth <= 480 ? '0.85rem' : window.innerWidth <= 768 ? '0.9rem' : '1rem',
                color: window.innerWidth <= 768 ? '#6c757d' : '#000000',
                marginBottom: window.innerWidth <= 768 ? '16px' : '30px'
                }}>
                Limited time offer, don't miss the opportunity
                </p>
                <button 
                onClick={() => navigate('/package')}
                style={{
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                padding: window.innerWidth <= 480 ? '10px 18px' : window.innerWidth <= 768 ? '10px 20px' : '12px 25px',
                borderRadius: '8px',
                fontSize: window.innerWidth <= 480 ? '13px' : window.innerWidth <= 768 ? '14px' : '16px',
                fontWeight: '600',
                cursor: 'pointer',
                alignSelf: 'flex-start',
                boxShadow: '0 4px 10px rgba(255,107,53,0.4)',
                transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f15a29';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(255,107,53,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff6b35';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(255,107,53,0.4)';
                }}>
                Book Now
                </button>
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div style={{
            flex: window.innerWidth <= 768 ? 'none' : '1 1 320px',
            // Updated URL to an image that closely resembles the one in the photo (Cappadocia hot air balloons)
            backgroundImage: 'url("https://i2-prod.manchestereveningnews.co.uk/incoming/article27932397.ece/ALTERNATES/s615b/2_GettyImages-1392042272.jpg")', 
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            position: 'relative',
            minHeight: window.innerWidth <= 768 ? '250px' : '400px',
            flexGrow: window.innerWidth <= 768 ? 0 : 1.5,
            order: window.innerWidth <= 768 ? 2 : 2
          }}>
            {/* Removed the extra balloon emoji circle as it's not in the image */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;