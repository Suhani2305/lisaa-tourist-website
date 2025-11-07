import React from 'react';

const AppDownload = () => {
  return (
    <div style={{ 
      padding: window.innerWidth <= 768 ? '0 16px' : window.innerWidth <= 1024 ? '0 32px' : '0 180px' 
    }}>
      <div
        style={{
          backgroundColor: '#ff6b35',
          margin: '2px 0',
          borderRadius: window.innerWidth <= 768 ? '8px' : '10px',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
      {/* Right Top Wavy Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%', // Covers the right half
          height: '100px', // Height of the wavy line effect
          backgroundColor: 'transparent',
          backgroundImage: 'radial-gradient(ellipse at top right, rgba(12, 12, 227, 0.2) 0%, transparent 90%)', // Simple wavy effect
          backgroundSize: '300% 200%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top right',
          transform: 'rotate(15deg) translateX(50%)', // Rotate slightly for a dynamic look
          transformOrigin: 'top right',
        }}
      ></div>

      {/* Right Bottom Flower (simple circular shape as a placeholder) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-30px', // Adjust to show partially
          right: '-30px', // Adjust to show partially
          width: '150px',
          height: '150px',
          backgroundColor: 'rgba(255,255,255,0.2)', // Light transparent white for the flower
          borderRadius: '50%', // Make it circular
        }}
      ></div>

      <div className="container" style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: window.innerWidth <= 768 ? '20px' : '60px',
            padding: window.innerWidth <= 768 ? '15px 15px 0 15px' : '20px 20px 0 20px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left Side - Text Content */}
          <div
            style={{
              flex: window.innerWidth <= 768 ? '1 1 100%' : '0.4',
              minWidth: window.innerWidth <= 768 ? '250px' : '300px',
              color: 'white',
              alignSelf: 'flex-start',
              width: window.innerWidth <= 768 ? '100%' : 'auto',
            }}
          >
            <h2
              style={{
                fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
                fontWeight: 'bold',
                margin: window.innerWidth <= 768 ? '20px 0 15px 0' : '40px 0 20px 0',
                lineHeight: '1.2',
              }}
            >
              Get 5% off your 1st app booking
            </h2>
            <p
              style={{
                fontSize: window.innerWidth <= 768 ? '0.7rem' : '0.8rem',
                marginBottom: window.innerWidth <= 768 ? '20px' : '30px',
                opacity: 0.9,
              }}
            >
              Booking's better on the app. Use promo code "TourBooking" to save!
            </p>

            <p
              style={{
                fontSize: window.innerWidth <= 768 ? '0.9rem' : '1.1rem',
                marginBottom: '10px',
                opacity: 0.9,
              }}
            >
              Get a magic link sent to your email!
            </p>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: window.innerWidth <= 768 ? '20px' : '30px',
                flexWrap: 'wrap',
              }}
            >
              <input
                type="email"
                placeholder="Email"
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '15px 20px',
                  border: 'none',
                  borderRadius: '15px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                style={{
                  backgroundColor: 'white',
                  color: '#5331ed',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '15px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Send
              </button>
            </div>
          </div>

          {/* Right Side - Image (Hidden on Mobile) */}
          {window.innerWidth > 768 && (
            <div
              style={{
                flex: 0.6, // 👈 60% width
                minWidth: '250px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end', // 👈 stick to bottom
                margin: '0 auto',
                paddingBottom: 0,
              }}
            >
              <img
                src="https://viatour-nextjs.vercel.app/img/cta/1/1.png"
                alt="App Preview"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  marginBottom: 0,
                  paddingBottom: 0,
                }}
              />
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default AppDownload;
