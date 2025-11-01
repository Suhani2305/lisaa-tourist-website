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
        padding: window.innerWidth <= 768 ? '20px 0' : '40px 0',
        minHeight: window.innerWidth <= 768 ? '50vh' : '70vh',
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
          width: '95%',
          borderRadius: window.innerWidth <= 768 ? '20px' : '30px',
          padding: window.innerWidth <= 768 ? '30px 0 20px' : '60px 0 30px',
          boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Inner content */}
        <div
          className="inner-content-wrapper"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: window.innerWidth <= 768 ? '20px' : '60px',
            width: 'calc(100% - 100px)',
            paddingBottom: window.innerWidth <= 768 ? '40px' : '80px',
            flexWrap: window.innerWidth <= 768 ? 'wrap' : 'nowrap'
          }}
        >
          {/* Left Section */}
          <div style={{ 
            flex: 1, 
            color: 'white', 
            paddingLeft: window.innerWidth <= 768 ? '20px' : '50px' 
          }}>
            <h2
              style={{
                fontSize: window.innerWidth <= 768 ? '1.3rem' : '1.7rem',
                fontWeight: 'bold',
                marginBottom: window.innerWidth <= 768 ? '15px' : '20px',
              }}
            >
              What our Travelers <br /> are saying
            </h2>

            <div style={{ marginBottom: window.innerWidth <= 768 ? '15px' : '20px' }}>
              <h3 style={{ 
                fontSize: window.innerWidth <= 768 ? '2rem' : '2.5rem', 
                fontWeight: '800', 
                margin: '0 0 5px' 
              }}>4.8</h3>
              <p
                style={{
                  fontSize: window.innerWidth <= 768 ? '0.7rem' : '0.8rem',
                  opacity: 0.8,
                  margin: 0,
                  lineHeight: '1.4',
                }}
              >
                1000+ reviews on TripAdvisor.
                <br />
                Certificate of Excellence
              </p>
            </div>

            <div>
              <h3 style={{ 
                fontSize: window.innerWidth <= 768 ? '2.5rem' : '3.5rem', 
                fontWeight: '800', 
                margin: '0 0 2px' 
              }}>16M</h3>
              <p
                style={{
                  fontSize: window.innerWidth <= 768 ? '0.7rem' : '0.8rem',
                  opacity: 0.8,
                  margin: 0,
                }}
              >
                Happy customers
              </p>
            </div>
          </div>

          {/* Right Section (Review Card) */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              position: 'relative',
              marginRight: '10px',
              marginTop: '10px',
            }}
          >
            {/* Background stacked card */}
            <div
              style={{
                backgroundColor: '#D7D8DA',
                borderRadius: '25px',
                position: 'absolute',
                top: '15px',
                left: '15px',
                width: 'calc(100% - 30px)',
                height: 'calc(100% - 30px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              }}
            ></div>

            {/* Main Review Card */}
            <div
              style={{
                backgroundColor: '#EBECEC',
                padding: '40px',
                borderRadius: '25px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                maxWidth: '400px',
                width: '100%',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '20px',
                  fontSize: '150px',
                  color: 'rgba(0,0,0,0.08)',
                  lineHeight: '0.1',
                  userSelect: 'none',
                  zIndex: 0,
                }}
              >
                &ldquo;
              </div>

              <p
                style={{
                  color: '#ff6b35',
                  fontWeight: '700',
                  marginBottom: '10px',
                  fontSize: '1.1rem',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                Great Work
              </p>

              <p
                style={{
                  fontSize: '1rem',
                  color: '#495057',
                  lineHeight: '1.7',
                  marginBottom: '30px',
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                "I think Educrat is the best theme I ever seen this year. Amazing design, easy to customize and a design quality superlative account on its cloud platform for optimized performance."
              </p>

              <div style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <img src={placeholderAvatar} alt="Reviewer Avatar" style={activeAvatarStyle} />
                <div>
                  <h4
                    style={{
                      fontSize: '17px',
                      fontWeight: 'bold',
                      color: '#343a40',
                      marginBottom: '3px',
                      margin: 0,
                    }}
                  >
                    Courtney Henry
                  </h4>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#6c757d',
                      margin: 0,
                    }}
                  >
                    Web Designer
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
