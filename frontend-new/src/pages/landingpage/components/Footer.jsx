import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer style={{ 
      backgroundColor: '#343a40', 
      color: 'white', 
      padding: window.innerWidth <= 768 ? '30px 0 20px' : '60px 0 20px' 
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
          paddingBottom: window.innerWidth <= 768 ? '20px' : '40px',
          borderBottom: '1px solid #495057',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{
            fontSize: window.innerWidth <= 768 ? '14px' : '18px',
            fontWeight: 'bold',
            color: '#ff6b35'
          }}>
            Speak to our expert at: +91 9263616263
          </div>
          <div style={{
            fontSize: window.innerWidth <= 768 ? '14px' : '16px',
            fontWeight: 'bold'
          }}>
            Follow Us
          </div>
        </div>
        
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 768 ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: window.innerWidth <= 768 ? '20px' : '40px',
          paddingTop: window.innerWidth <= 768 ? '20px' : '40px',
          paddingBottom: window.innerWidth <= 768 ? '20px' : '40px'
        }}>
          {/* Contact */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#ff6b35'
            }}>
              Contact
            </h3>
            <p style={{ marginBottom: '10px', lineHeight: '1.6' }}>
              Lisaa Tours & Travels<br />
              Rajasthan, India<br />
              Phone: +91 9263616263
            </p>
            <p style={{ marginBottom: '10px' }}>
              Email: Lsiaatech@gmail.com
            </p>
          </div>
          
          {/* Company */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#ff6b35'
            }}>
              Company
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['About Us', 'Tours Reviews', 'Contact Us', 'Share Your Experience', 'Travel Guides', 'Data Policy', 'Cookie Policy', 'Legal', 'Careers'].map(link => (
                <a 
                  key={link} 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (link === 'Share Your Experience') {
                      navigate('/share-experience');
                    } else if (link === 'Contact Us') {
                      navigate('/contact');
                    }
                  }}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '14px',
                    opacity: 0.8,
                    cursor: 'pointer',
                    fontWeight: link === 'Share Your Experience' ? '600' : '400'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.color = '#ff6b35';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '0.8';
                    e.target.style.color = 'white';
                  }}
                >
                  {link === 'Share Your Experience' ? '✈️ ' + link : link}
                </a>
              ))}
            </div>
          </div>
          
          {/* Support */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#ff6b35'
            }}>
              Support
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Get in Touch', 'Help center', 'Live chat', 'How it works'].map(link => (
                <a key={link} href="#" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                  opacity: 0.8
                }}>
                  {link}
                </a>
              ))}
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#ff6b35'
            }}>
              Newsletter
            </h3>
            <p style={{ marginBottom: '20px', fontSize: '14px', opacity: 0.8 }}>
              Subscribe to the free newsletter and stay up to date
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="email" 
                placeholder="Your email"
                style={{
                  flex: 1,
                  padding: '10px 15px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button style={{
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Send
              </button>
            </div>
          </div>
          
          {/* Mobile Apps */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#ff6b35'
            }}>
              Mobile Apps
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid #495057',
                padding: '10px 20px',
                borderRadius: '5px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                iOS App
              </button>
              <button style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid #495057',
                padding: '10px 20px',
                borderRadius: '5px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                Android App
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #495057',
          fontSize: '14px'
        }}>
          <div style={{ opacity: 0.8 }}>
            © Copyright Lisaa Tours & Travels 2025
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <span style={{ fontSize: '20px' }}>💳</span>
            <span style={{ fontSize: '20px' }}>💳</span>
            <span style={{ fontSize: '20px' }}>💳</span>
            <span style={{ fontSize: '20px' }}>💳</span>
            <span style={{ fontSize: '20px' }}>💳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
