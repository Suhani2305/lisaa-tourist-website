import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer style={{ 
      backgroundColor: '#fef7f4', 
      color: '#333', 
      padding: window.innerWidth <= 768 ? '50px 16px 20px' : '60px 250px 25px',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: window.innerWidth <= 768 ? '40px' : '0',
          paddingBottom: window.innerWidth <= 768 ? '30px' : '40px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          {/* Contact Us and Quick Links Row (Mobile) */}
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth <= 768 ? 'row' : 'row',
            justifyContent: window.innerWidth <= 768 ? 'space-around' : 'space-between',
            alignItems: 'flex-start',
            gap: window.innerWidth <= 768 ? '0' : '80px',
            width: '100%',
            marginBottom: window.innerWidth <= 768 ? '0' : '0'
          }}>
            {/* Contact */}
            <div style={{ 
              textAlign: window.innerWidth <= 768 ? 'center' : 'left',
              flex: '1',
              minWidth: window.innerWidth <= 768 ? 'auto' : '300px',
              paddingRight: window.innerWidth <= 768 ? '15px' : '0'
            }}>
              <h3 style={{
                fontSize: window.innerWidth <= 480 ? '16px' : window.innerWidth <= 768 ? '17px' : '18px',
                fontWeight: '700',
                marginBottom: window.innerWidth <= 768 ? '15px' : '20px',
                color: '#ff6b35'
              }}>
                Contact Us
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: window.innerWidth <= 768 ? '10px' : '12px' }}>
                <p style={{ margin: 0, lineHeight: '1.6', fontSize: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '13px' : '14px', opacity: 0.9 }}>
                  <strong style={{ color: '#ff6b35' }}>LSIAA Tours & Travels</strong><br />
                  U.G. 58, P.C.F. PLAZA, MINT HOUSE, VARANASI, UP 221001
                </p>
                <p style={{ margin: 0, fontSize: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '13px' : '14px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start' }}>
                  <span style={{ fontSize: '16px' }}>📞</span>
                  <span><strong>Phone:</strong> +91 9263616263</span>
                </p>
                <p style={{ margin: 0, fontSize: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '13px' : '14px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start' }}>
                  <span style={{ fontSize: '16px' }}>✉️</span>
                  <span><strong>Email:</strong> Lsiaatech@gmail.com</span>
                </p>
              </div>
            </div>
            
            {/* Gray Line (Mobile Only) */}
            {window.innerWidth <= 768 && (
              <div style={{
                width: '1px',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                minHeight: '200px',
                alignSelf: 'stretch'
              }} />
            )}
            
            {/* Quick Links */}
            <div style={{ 
              textAlign: window.innerWidth <= 768 ? 'center' : 'left',
              flex: '1',
              minWidth: window.innerWidth <= 768 ? 'auto' : '300px',
              paddingLeft: window.innerWidth <= 768 ? '15px' : '0'
            }}>
              <h3 style={{
                fontSize: window.innerWidth <= 480 ? '16px' : window.innerWidth <= 768 ? '17px' : '18px',
                fontWeight: '700',
                marginBottom: window.innerWidth <= 768 ? '15px' : '20px',
                color: '#ff6b35'
              }}>
                Quick Links
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: window.innerWidth <= 768 ? '10px' : '12px' }}>
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
                      fontSize: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '13px' : '14px',
                      opacity: 0.9,
                      cursor: 'pointer',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      padding: window.innerWidth <= 768 ? '5px 0' : '0',
                      justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start'
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
                    <span style={{ fontSize: window.innerWidth <= 480 ? '14px' : window.innerWidth <= 768 ? '15px' : '16px' }}>{link.icon}</span>
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Newsletter */}
          <div style={{ 
            textAlign: window.innerWidth <= 768 ? 'center' : 'left',
            width: '100%',
            marginTop: window.innerWidth <= 768 ? '5px' : '0'
          }}>
            <h3 style={{
              fontSize: window.innerWidth <= 480 ? '16px' : window.innerWidth <= 768 ? '17px' : '18px',
              fontWeight: '700',
              marginBottom: window.innerWidth <= 768 ? '15px' : '20px',
              color: '#ff6b35'
            }}>
              Newsletter
            </h3>
            <p style={{ 
              marginBottom: window.innerWidth <= 768 ? '15px' : '20px', 
              fontSize: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '13px' : '14px', 
              opacity: 0.9, 
              lineHeight: '1.6'
            }}>
              Subscribe to our newsletter and stay updated with the latest travel offers and destinations
            </p>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row',
              gap: '10px',
              alignItems: 'center',
              flexWrap: window.innerWidth <= 480 ? 'wrap' : 'nowrap'
            }}>
              <input 
                type="email" 
                placeholder="Enter your email"
                style={{
                  flex: '1',
                  minWidth: window.innerWidth <= 480 ? '100%' : '200px',
                  padding: window.innerWidth <= 480 ? '12px 15px' : window.innerWidth <= 768 ? '13px 18px' : '14px 20px',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  borderRadius: '8px',
                  fontSize: window.innerWidth <= 480 ? '13px' : window.innerWidth <= 768 ? '13px' : '14px',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff6b35';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 0, 0, 0.15)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              />
              <button 
                style={{
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  padding: window.innerWidth <= 480 ? '12px 20px' : window.innerWidth <= 768 ? '13px 24px' : '14px 28px',
                  borderRadius: '8px',
                  fontSize: window.innerWidth <= 480 ? '13px' : window.innerWidth <= 768 ? '13px' : '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                  whiteSpace: 'nowrap',
                  width: window.innerWidth <= 480 ? '100%' : 'auto'
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
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: window.innerWidth <= 768 ? '20px' : '25px',
          fontSize: window.innerWidth <= 480 ? '12px' : '13px',
          gap: window.innerWidth <= 768 ? '12px' : '20px',
          textAlign: 'center'
        }}>
          <div style={{ 
            opacity: 0.8, 
            fontSize: window.innerWidth <= 480 ? '12px' : '13px',
            lineHeight: '1.5'
          }}>
            © {new Date().getFullYear()} Copyright LSIAA Tours & Travels. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
