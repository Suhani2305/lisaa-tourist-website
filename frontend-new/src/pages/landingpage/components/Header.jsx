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
        backgroundColor: '#f8f9fa', 
        padding: window.innerWidth <= 768 ? '6px 0' : '8px 0', 
        fontSize: window.innerWidth <= 480 ? '12px' : '14px',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: window.innerWidth <= 768 ? '0 16px' : '0 24px' 
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: window.innerWidth <= 768 ? 'wrap' : 'nowrap',
            gap: window.innerWidth <= 768 ? '8px' : '0'
          }}>
            <div style={{ 
              display: window.innerWidth <= 768 ? 'none' : 'block',
              flex: '1'
            }}>
              <span style={{ color: '#6c757d' }}>Search destinations or activities</span>
            </div>
            <div style={{ 
              flex: '1',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
            >
              <h2 style={{ 
                color: '#343a40', 
                fontWeight: 'bold', 
                margin: 0,
                fontSize: window.innerWidth <= 480 ? '18px' : '24px'
              }}>
                Lsiaa Tours & Travels
              </h2>
            </div>
            <div style={{ 
              flex: '1',
              textAlign: 'right',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: window.innerWidth <= 768 ? '12px' : '20px',
              flexWrap: 'wrap'
            }}>
              {isLoggedIn ? (
                <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '6px 12px',
                    borderRadius: '25px',
                    backgroundColor: '#fff',
                    border: '2px solid #ff6b35',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff5f0';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <Avatar 
                      size={window.innerWidth <= 480 ? 28 : 32} 
                      icon={getAvatarIcon()}
                      src={currentUser?.profileImage}
                      style={{ 
                        backgroundColor: getAvatarColor(),
                        cursor: 'pointer'
                      }} 
                    />
                    <span style={{ 
                      color: '#333', 
                      fontWeight: '500',
                      fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                      display: window.innerWidth <= 480 ? 'none' : 'inline'
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
                      color: '#6c757d', 
                      fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                    onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                  >
                    Login
                  </span>
                  <button 
                    onClick={handleRegister}
                    style={{
                      backgroundColor: '#ff6b35',
                      color: 'white',
                      border: 'none',
                      padding: window.innerWidth <= 480 ? '6px 12px' : '8px 16px',
                      borderRadius: '20px',
                      fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e55a29';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ff6b35';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
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
