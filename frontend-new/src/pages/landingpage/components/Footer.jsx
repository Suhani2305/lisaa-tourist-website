import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer style={{ 
      backgroundColor: '#fef7f4', 
      color: '#333', 
      padding: window.innerWidth <= 768 ? '40px 0 20px' : '70px 0 30px',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: window.innerWidth <= 768 ? '0 16px' : '0 24px' 
      }}>
        {/* Top Line */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: window.innerWidth <= 768 ? '30px' : '50px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{
            fontSize: window.innerWidth <= 768 ? '16px' : '20px',
            fontWeight: '600',
            color: '#ff6b35',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>📞</span>
            Speak to our expert at: <span style={{ color: '#333' }}>+91 9263616263</span>
          </div>
          <div style={{
            fontSize: window.innerWidth <= 768 ? '14px' : '16px',
            fontWeight: '600',
            color: '#ff6b35'
          }}>
            Follow Us
          </div>
        </div>
        
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: window.innerWidth <= 768 ? '30px' : '50px',
          paddingTop: window.innerWidth <= 768 ? '30px' : '50px',
          paddingBottom: window.innerWidth <= 768 ? '30px' : '50px'
        }}>
          {/* Contact */}
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#ff6b35'
            }}>
              Contact Us
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ margin: 0, lineHeight: '1.8', fontSize: '14px', opacity: 0.9 }}>
                <strong style={{ color: '#ff6b35' }}>Lisaa Tours & Travels</strong><br />
                Rajasthan, India
              </p>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                📞 <strong>Phone:</strong> +91 9263616263
              </p>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                ✉️ <strong>Email:</strong> Lsiaatech@gmail.com
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#ff6b35'
            }}>
              Quick Links
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Contact Us', route: '/contact', icon: '📧' },
                { name: 'Share Your Experience', route: '/share-experience', icon: '✈️' },
                { name: 'Media Gallery', route: '/gallery', icon: '📸' }
              ].map(link => (
                <a 
                  key={link.name} 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.route);
                  }}
                  style={{
                    color: '#000000',
                    textDecoration: 'none',
                    fontSize: '14px',
                    opacity: 0.9,
                    cursor: 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.color = '#ff6b35';
                    e.target.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '0.9';
                    e.target.style.color = '#000000';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#ff6b35'
            }}>
              Newsletter
            </h3>
            <p style={{ marginBottom: '20px', fontSize: '14px', opacity: 0.9, lineHeight: '1.6' }}>
              Subscribe to our newsletter and stay updated with the latest travel offers and destinations
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="email" 
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: '#000000',
                  fontFamily: 'Poppins, sans-serif'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff6b35';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 0, 0, 0.2)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                }}
              />
              <button 
                style={{
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f15a29';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ff6b35';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '30px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ opacity: 0.8, fontSize: '14px' }}>
            © {new Date().getFullYear()} Copyright Lisaa Tours & Travels. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', opacity: 0.8 }}>💳</span>
            <span style={{ fontSize: '24px', opacity: 0.8 }}>💳</span>
            <span style={{ fontSize: '24px', opacity: 0.8 }}>💳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
