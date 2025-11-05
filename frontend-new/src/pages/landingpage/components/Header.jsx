import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Avatar, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, SettingOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { authService } from '../../../services';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    // Check regular user token
    const token = localStorage.getItem('token');
    const user = authService.getCurrentUser();
    
    // Check admin token
    const adminToken = localStorage.getItem('adminToken');
    const admin = authService.getCurrentAdmin();
    
    if (token && user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setIsAdmin(false);
    } else if (adminToken && admin) {
      setIsLoggedIn(true);
      setCurrentUser(admin);
      setIsAdmin(true);
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsAdmin(false);
    navigate('/');
    window.location.reload(); // Refresh to clear all state
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  const handleUserDashboard = () => {
    navigate('/user-dashboard');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const getAvatarIcon = () => {
    if (currentUser?.profileImage) {
      return null; // Will use src instead
    }
    
    const gender = currentUser?.gender || 'male';
    if (gender === 'female') {
      return <WomanOutlined />;
    } else if (gender === 'male') {
      return <ManOutlined />;
    } else {
      return <UserOutlined />;
    }
  };

  const getAvatarColor = () => {
    const gender = currentUser?.gender || 'male';
    if (gender === 'female') {
      return '#ff6b9d'; // Pink for female
    } else if (gender === 'male') {
      return '#ff6b35'; // Orange for male
    } else {
      return '#9254de'; // Purple for other
    }
  };

  // Dropdown menu items for logged-in user
  const userMenuItems = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
            {currentUser?.name || currentUser?.email?.split('@')[0]}
          </div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
            {currentUser?.email}
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    ...(isAdmin ? [
      {
        key: 'admin-panel',
        icon: <DashboardOutlined />,
        label: 'Admin Panel',
        onClick: handleAdminPanel,
      },
    ] : [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'My Dashboard',
        onClick: handleUserDashboard,
      },
    ]),
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: 'Profile Settings',
      onClick: handleProfile,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: window.innerWidth <= 768 ? '12px 0' : '16px 0', 
        fontSize: window.innerWidth <= 480 ? '12px' : '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: window.innerWidth <= 768 ? '0 16px' : '0 40px' 
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: window.innerWidth <= 768 ? 'wrap' : 'nowrap',
            gap: window.innerWidth <= 768 ? '12px' : '20px'
          }}>
            {/* Company Name - Left Side */}
            <div style={{ 
              flex: window.innerWidth <= 768 ? '1 1 100%' : '0 0 auto',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            >
              <h2 style={{ 
                color: '#ff6b35', 
                fontWeight: '700', 
                margin: 0,
                fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '20px' : '24px',
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '0.5px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #f15a29 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                whiteSpace: 'nowrap'
              }}>
                Lisaa Tours & Travels
              </h2>
            </div>

            {/* Search Bar - Center */}
            <div style={{ 
              flex: window.innerWidth <= 768 ? '1 1 100%' : '1',
              maxWidth: window.innerWidth <= 768 ? '100%' : '600px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: window.innerWidth <= 768 ? '0' : '0 auto'
            }}>
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '25px',
                padding: window.innerWidth <= 480 ? '8px 16px' : '10px 20px',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                cursor: 'text'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ff6b35';
                e.currentTarget.style.backgroundColor = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              >
                <span style={{ 
                  color: '#666', 
                  fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                  fontFamily: 'Poppins, sans-serif',
                  marginRight: '8px'
                }}>
                  🔍
                </span>
                <span style={{ 
                  color: '#999', 
                  fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {window.innerWidth <= 480 ? 'Search...' : 'Search destinations or activities'}
                </span>
              </div>
            </div>

            {/* Login/Signup or User Dropdown - Right Side */}
            <div style={{ 
              flex: window.innerWidth <= 768 ? '1 1 100%' : '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-end',
              gap: window.innerWidth <= 768 ? '12px' : '20px',
              flexWrap: 'wrap'
            }}>
              {isLoggedIn ? (
                <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '25px',
                    backgroundColor: '#fff',
                    border: '2px solid #ff6b35',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 2px 4px rgba(255, 107, 53, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff5f0';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(255, 107, 53, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    <Avatar 
                      size={window.innerWidth <= 480 ? 30 : 36} 
                      icon={getAvatarIcon()}
                      src={currentUser?.profileImage}
                      style={{ 
                        backgroundColor: getAvatarColor(),
                        cursor: 'pointer',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <span style={{ 
                      color: '#333', 
                      fontWeight: '600',
                      fontSize: window.innerWidth <= 480 ? '12px' : '15px',
                      display: window.innerWidth <= 480 ? 'none' : 'inline',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      {currentUser?.name?.split(' ')[0] || currentUser?.email?.split('@')[0]}
                    </span>
                  </div>
                </Dropdown>
              ) : (
                <>
                  <span 
                    onClick={handleLogin}
                    style={{ 
                      color: '#666', 
                      fontSize: window.innerWidth <= 480 ? '13px' : '15px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Poppins, sans-serif',
                      padding: '8px 12px',
                      borderRadius: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ff6b35';
                      e.target.style.backgroundColor = '#fff5f0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#666';
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    Login
                  </span>
                  <button 
                    onClick={handleRegister}
                    style={{
                      backgroundColor: '#ff6b35',
                      color: 'white',
                      border: 'none',
                      padding: window.innerWidth <= 480 ? '8px 16px' : '10px 20px',
                      borderRadius: '25px',
                      fontSize: window.innerWidth <= 480 ? '13px' : '15px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Poppins, sans-serif',
                      boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f15a29';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ff6b35';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
                    }}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
