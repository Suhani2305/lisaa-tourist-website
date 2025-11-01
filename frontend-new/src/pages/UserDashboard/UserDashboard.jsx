import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tabs, 
  Button, 
  Avatar, 
  Divider,
  Spin,
  message,
  Tag,
  Empty,
  Space
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  HeartOutlined,
  SettingOutlined,
  LogoutOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService, bookingService } from '../../services';
import Header from '../landingpage/components/Header';
import Footer from '../landingpage/components/Footer';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const userData = await authService.getProfile();
      setUser(userData);

      // Fetch user bookings
      try {
        const bookingsData = await bookingService.getMyBookings();
        setBookings(bookingsData);
      } catch (bookingError) {
        console.error('Error fetching bookings:', bookingError);
        // It's okay if bookings fail, user might not have any
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      message.error('Failed to load user data');
      // If profile fetch fails, redirect to login
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    message.success('Logged out successfully');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      completed: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const getAvatarIcon = () => {
    if (user?.profileImage) {
      return null;
    }
    
    const gender = user?.gender || 'male';
    if (gender === 'female') {
      return <WomanOutlined />;
    } else if (gender === 'male') {
      return <ManOutlined />;
    } else {
      return <UserOutlined />;
    }
  };

  const getAvatarColor = () => {
    const gender = user?.gender || 'male';
    if (gender === 'female') {
      return '#ff6b9d';
    } else if (gender === 'male') {
      return '#ff6b35';
    } else {
      return '#9254de';
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <Header />
      
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        {/* User Profile Card */}
        <Card
          style={{
            marginBottom: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={6} style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                icon={getAvatarIcon()}
                src={user?.profileImage}
                style={{ backgroundColor: getAvatarColor() }}
              />
            </Col>
            
            <Col xs={24} md={12}>
              <Title level={2} style={{ marginBottom: '8px' }}>
                {user?.name || 'User'}
              </Title>
              <Space direction="vertical" size="small">
                <Text>
                  <MailOutlined style={{ marginRight: '8px', color: '#ff6b35' }} />
                  {user?.email}
                </Text>
                {user?.phone && (
                  <Text>
                    <PhoneOutlined style={{ marginRight: '8px', color: '#ff6b35' }} />
                    {user?.phone}
                  </Text>
                )}
                <Tag color={user?.role === 'admin' ? 'gold' : 'blue'}>
                  {user?.role === 'admin' ? 'Admin' : 'User'}
                </Tag>
              </Space>
            </Col>

            <Col xs={24} md={6} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                size="large"
              >
                Logout
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Tabs for different sections */}
        <Card
          style={{
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Tabs defaultActiveKey="bookings" size="large">
            {/* My Bookings Tab */}
            <TabPane
              tab={
                <span>
                  <BookOutlined />
                  My Bookings
                </span>
              }
              key="bookings"
            >
              {bookings && bookings.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {bookings.map((booking) => (
                    <Col xs={24} md={12} key={booking._id}>
                      <Card
                        hoverable
                        style={{ borderRadius: '8px' }}
                      >
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title level={5} style={{ margin: 0 }}>
                              Booking #{booking.bookingNumber}
                            </Title>
                            <Tag color={getStatusColor(booking.status)}>
                              {booking.status.toUpperCase()}
                            </Tag>
                          </div>
                          
                          <Divider style={{ margin: '12px 0' }} />
                          
                          <Text>
                            <CalendarOutlined style={{ marginRight: '8px' }} />
                            {new Date(booking.travelDates.startDate).toLocaleDateString()} - {new Date(booking.travelDates.endDate).toLocaleDateString()}
                          </Text>
                          
                          <Text strong style={{ fontSize: '18px', color: '#ff6b35' }}>
                            ₹{booking.pricing.finalAmount.toLocaleString()}
                          </Text>
                          
                          <Button type="primary" block>
                            View Details
                          </Button>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty
                  description="No bookings yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" onClick={() => navigate('/')}>
                    Explore Tours
                  </Button>
                </Empty>
              )}
            </TabPane>

            {/* Profile Settings Tab */}
            <TabPane
              tab={
                <span>
                  <SettingOutlined />
                  Profile Settings
                </span>
              }
              key="settings"
            >
              <Card>
                <Title level={4}>Personal Information</Title>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Name:</Text>
                    <Paragraph>{user?.name}</Paragraph>
                  </div>
                  <div>
                    <Text strong>Email:</Text>
                    <Paragraph>{user?.email}</Paragraph>
                  </div>
                  <div>
                    <Text strong>Phone:</Text>
                    <Paragraph>{user?.phone || 'Not provided'}</Paragraph>
                  </div>
                  <div>
                    <Text strong>Member Since:</Text>
                    <Paragraph>
                      {new Date(user?.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Paragraph>
                  </div>
                  
                  <Button type="primary" size="large">
                    Edit Profile
                  </Button>
                </Space>
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;

