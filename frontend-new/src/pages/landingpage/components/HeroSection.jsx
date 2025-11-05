import React from 'react';

// ✅ Import Google Font (Poppins)
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const HeroSection = () => {
  return (
    <div style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: window.innerWidth <= 768 ? 'scroll' : 'fixed',
      minHeight: window.innerWidth <= 768 ? '60vh' : '78vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: window.innerWidth <= 768 ? '0 16px' : '0 24px',
        textAlign: 'center',
        color: 'white'
      }}>
        <p style={{ 
          fontSize: window.innerWidth <= 480 ? '0.9rem' : window.innerWidth <= 768 ? '1rem' : '1.2rem', 
          marginBottom: window.innerWidth <= 768 ? '20px' : '40px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: '500',
          lineHeight: '1.4'
        }}>
          Discover the beauty of India with Lisaa Tours & Travels. 
        </p>
        <h1 style={{ 
          fontSize: window.innerWidth <= 480 ? '1.8rem' : window.innerWidth <= 768 ? '2.5rem' : '3.5rem', 
          fontWeight: '700', 
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          fontFamily: "'Poppins', sans-serif",
          lineHeight: '1.2'
        }}>
          Explore Incredible India
          <br />with Lisaa Tours & Travels
        </h1>
      </div>
      
      {/* 🧭 Sleek Search Bar */}
      <div style={{
        position: 'absolute',
        bottom: window.innerWidth <= 768 ? '-30px' : '-50px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: window.innerWidth <= 768 ? '90%' : '50%',
        maxWidth: window.innerWidth <= 768 ? '100%' : '900px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: window.innerWidth <= 768 ? '25px' : '50px',
          padding: window.innerWidth <= 768 ? '8px 16px' : '10px 40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: window.innerWidth <= 768 ? '5px' : '10px',
          flexWrap: window.innerWidth <= 768 ? 'wrap' : 'nowrap'
        }}>
          {/* 🔍 Where */}
          <div style={{
            flex: window.innerWidth <= 768 ? '1 1 100%' : 1,
            borderRight: window.innerWidth <= 768 ? 'none' : '1px solid #eee',
            padding: window.innerWidth <= 768 ? '8px 12px' : '10px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: window.innerWidth <= 768 ? '8px' : '0'
          }}>
            <label style={{ 
              fontSize: window.innerWidth <= 768 ? '11px' : '13px', 
              color: '#1a1a1a', 
              fontWeight: '600',
              marginBottom: '2px',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Where
            </label>
            <input 
              type="text" 
              placeholder="Search destinations in India"
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: window.innerWidth <= 768 ? '12px' : '10px',
                color: '#777',
                fontFamily: "'Poppins', sans-serif"
              }}
            />
          </div>

          {/* 📅 When */}
          <div style={{
            flex: window.innerWidth <= 768 ? '1 1 100%' : 1,
            borderRight: window.innerWidth <= 768 ? 'none' : '1px solid #eee',
            padding: window.innerWidth <= 768 ? '8px 12px' : '10px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: window.innerWidth <= 768 ? '8px' : '0'
          }}>
            <label style={{ 
              fontSize: window.innerWidth <= 768 ? '11px' : '13px', 
              color: '#1a1a1a', 
              fontWeight: '600',
              marginBottom: '2px',
              fontFamily: "'Poppins', sans-serif"
            }}>
              When
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: window.innerWidth <= 768 ? '5px' : '10px' }}>
              <input 
                type="date" 
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  fontSize: window.innerWidth <= 768 ? '12px' : '10px',
                  color: '#777',
                  fontFamily: "'Poppins', sans-serif",
                  backgroundColor: 'transparent'
                }}
              />
              <span style={{ color: '#bbb', fontSize: window.innerWidth <= 768 ? '10px' : '12px' }}>—</span>
              <input 
                type="date" 
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  fontSize: window.innerWidth <= 768 ? '12px' : '10px',
                  color: '#777',
                  fontFamily: "'Poppins', sans-serif",
                  backgroundColor: 'transparent'
                }}
              />
            </div>
          </div>

          {/* 🗺️ Tour Type */}
          <div style={{
            flex: window.innerWidth <= 768 ? '1 1 100%' : 1,
            padding: window.innerWidth <= 768 ? '8px 12px' : '10px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: window.innerWidth <= 768 ? '8px' : '0'
          }}>
            <label style={{ 
              fontSize: window.innerWidth <= 768 ? '11px' : '13px', 
              color: '#1a1a1a', 
              fontWeight: '600',
              marginBottom: '2px',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Tour Type
            </label>
            <select 
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: window.innerWidth <= 768 ? '12px' : '10px',
                color: '#777',
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              <option value="">All Tours</option>
              <option value="destinations">Destinations</option>
              <option value="tours">Tours</option>
              <option value="events">Events</option>
              <option value="testimonials">Testimonials</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          {/* 🔘 Search Button */}
          <button style={{
            backgroundColor: '#f15a29',
            color: 'white',
            border: 'none',
            padding: window.innerWidth <= 768 ? '12px 24px' : '15px 40px',
            borderRadius: window.innerWidth <= 768 ? '20px' : '40px',
            fontSize: window.innerWidth <= 768 ? '14px' : '16px',
            fontWeight: '600',
            fontFamily: "'Poppins', sans-serif",
            cursor: 'pointer',
            transition: '0.3s ease',
            width: window.innerWidth <= 768 ? '100%' : 'auto'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d94e23'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f15a29'}
          >
            Search
          </button>
        </div>
      </div>
      {/* 🔸 Bottom Black Divider */}
<div
  style={{
    position: "absolute",
    bottom: "-70px",
    left: 0,
    width: "100%",
    height: "1px",
    backgroundColor: "#D3D3D3", // black line
  }}
></div>

      
    </div>
  );
};

export default HeroSection;
