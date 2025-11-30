import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Space, 
  Avatar,
  Statistic,
  List,
  Tag,
  message,
  Badge,
  Tooltip,
  Spin,
  Empty
} from 'antd';
import {
  ShoppingCartOutlined,
  MessageOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { bookingService, inquiryService } from '../../../services';

// Import Google Font (Poppins)
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
if (!document.head.querySelector('link[href*="Poppins"]')) {
  document.head.appendChild(link);
}

const { Title, Text } = Typography;

// Helper function to get time ago
const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  return Math.floor(seconds) + " seconds ago";
};

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Get manager info
  const adminEmail = localStorage.getItem('adminEmail') || 'manager@touristwebsite.com';
  const adminName = JSON.parse(localStorage.getItem('adminUser') || '{}').name || 'Manager';
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      totalInquiries: 0,
      newInquiries: 0,
      pendingPayments: 0
    },
    recentBookings: [],
    recentInquiries: []
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch bookings and inquiries
      const [bookingsData, inquiriesData] = await Promise.all([
        bookingService.getAllBookings({ limit: 10 }),
        inquiryService.getAllInquiries({ limit: 10, page: 1 })
      ]);

      const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.bookings || []);
      const inquiries = inquiriesData?.inquiries || (Array.isArray(inquiriesData) ? inquiriesData : []) || [];

      // Calculate statistics
      const stats = {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        totalInquiries: inquiries.length,
        newInquiries: inquiries.filter(i => i.status === 'new').length,
        pendingPayments: bookings.filter(b => b.payment?.status === 'pending').length
      };

      // Format recent bookings
      const recentBookings = bookings.slice(0, 5).map((booking, index) => ({
        key: booking._id || booking.id || `booking-${index}`,
        id: booking._id || booking.id,
        bookingNumber: booking.bookingNumber || `BK-${index + 1}`,
        customerName: booking.user?.name || booking.customerName || 'Guest User',
        customerEmail: booking.user?.email || booking.customerEmail || 'N/A',
        packageName: booking.tour?.title || booking.packageName || 'Unknown Package',
        amount: booking.pricing?.finalAmount || booking.totalAmount || booking.amount || 0,
        status: booking.status || 'pending',
        paymentStatus: booking.payment?.status || 'pending',
        date: booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        time: booking.createdAt ? getTimeAgo(booking.createdAt) : 'Just now'
      }));

      // Format recent inquiries
      const recentInquiries = inquiries.slice(0, 5).map((inquiry, index) => ({
        key: inquiry._id || inquiry.id || `inquiry-${index}`,
        id: inquiry._id || inquiry.id,
        name: inquiry.name || 'Unknown',
        email: inquiry.email || 'N/A',
        phone: inquiry.phone || 'N/A',
        subject: inquiry.subject || 'No Subject',
        status: inquiry.status || 'new',
        priority: inquiry.priority || 'medium',
        date: inquiry.createdAt ? new Date(inquiry.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        time: inquiry.createdAt ? getTimeAgo(inquiry.createdAt) : 'Just now'
      }));

      setDashboardData({
        stats,
        recentBookings,
        recentInquiries
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'orange',
      'confirmed': 'green',
      'cancelled': 'red',
      'completed': 'blue',
      'new': 'blue',
      'contacted': 'cyan',
      'qualified': 'purple',
      'converted': 'green',
      'closed': 'default'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'red',
      'medium': 'orange',
      'low': 'green'
    };
    return colors[priority] || 'default';
  };

  return (
    <div style={{ 
      padding: windowWidth <= 768 ? '16px' : '24px',
      fontFamily: "'Poppins', sans-serif",
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        position: 'relative',
        marginBottom: windowWidth <= 768 ? '20px' : '32px',
        textAlign: 'center'
      }}>
        <Title level={1} style={{ 
          fontSize: windowWidth <= 768 ? '1.8rem' : windowWidth <= 1024 ? '2.5rem' : '3rem', 
          fontWeight: '800', 
          color: '#FF6B35',
          margin: '0 auto 16px auto',
          fontFamily: "'Playfair Display', 'Georgia', serif",
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 4px rgba(255, 107, 53, 0.1)',
          textAlign: 'center'
        }}>
          Welcome, {adminName}!
        </Title>
        
        <p style={{
          fontSize: windowWidth <= 768 ? '13px' : windowWidth <= 1024 ? '14px' : '16px',
          color: '#6c757d',
          margin: '0 auto',
          fontFamily: "'Poppins', sans-serif",
          lineHeight: '1.6',
          maxWidth: '700px',
          textAlign: 'center'
        }}>
          Manage your assigned bookings and inquiries
        </p>

        {/* Refresh Button - Top Right */}
        <Button 
          type="primary"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={fetchDashboardData}
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            borderRadius: '12px',
            background: '#ff6b35',
            border: 'none',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
            height: windowWidth <= 768 ? '36px' : '42px',
            padding: windowWidth <= 768 ? '0 14px' : '0 20px',
            fontSize: windowWidth <= 768 ? '12px' : '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {windowWidth > 768 && 'Refresh'}
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[windowWidth <= 768 ? 12 : 16, windowWidth <= 768 ? 12 : 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={12} lg={4}>
          <Card style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Total Bookings</span>}
              value={dashboardData.stats.totalBookings}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={4}>
          <Card style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Pending</span>}
              value={dashboardData.stats.pendingBookings}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={4}>
          <Card style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Confirmed</span>}
              value={dashboardData.stats.confirmedBookings}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={4}>
          <Card style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Total Inquiries</span>}
              value={dashboardData.stats.totalInquiries}
              prefix={<MessageOutlined />}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={4}>
          <Card style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>New Inquiries</span>}
              value={dashboardData.stats.newInquiries}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={4}>
          <Card style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
            color: 'white'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Pending Payments</span>}
              value={dashboardData.stats.pendingPayments}
              prefix={<DollarOutlined />}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[windowWidth <= 768 ? 12 : 16, windowWidth <= 768 ? 12 : 16]}>
        {/* Recent Bookings */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ShoppingCartOutlined style={{ color: '#ff6b35' }} />
                <Text strong style={{ fontSize: windowWidth <= 768 ? '16px' : '18px' }}>Recent Bookings</Text>
              </Space>
            }
            extra={
              <Button 
                type="link" 
                onClick={() => navigate('/admin/bookings')}
                style={{ padding: 0, fontFamily: "'Poppins', sans-serif" }}
              >
                View All
              </Button>
            }
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: 'none',
              height: '100%'
            }}
            styles={{ body: { padding: windowWidth <= 768 ? '12px' : '20px' } }}
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
              </div>
            ) : dashboardData.recentBookings.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No bookings assigned yet"
              />
            ) : (
              <List
                dataSource={dashboardData.recentBookings}
                renderItem={(item) => (
                  <List.Item
                    style={{ 
                      padding: '12px 0',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/admin/bookings`)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={<ShoppingCartOutlined />}
                          style={{ backgroundColor: '#ff6b35' }}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{item.customerName}</Text>
                          <Tag color={getStatusColor(item.status)} style={{ borderRadius: '6px' }}>
                            {item.status.toUpperCase()}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {item.packageName}
                          </Text>
                          <Space>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              ₹{item.amount.toLocaleString()}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>•</Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {item.time}
                            </Text>
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Recent Inquiries */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <MessageOutlined style={{ color: '#ff6b35' }} />
                <Text strong style={{ fontSize: windowWidth <= 768 ? '16px' : '18px' }}>Recent Inquiries</Text>
              </Space>
            }
            extra={
              <Button 
                type="link" 
                onClick={() => navigate('/admin/inquiries')}
                style={{ padding: 0, fontFamily: "'Poppins', sans-serif" }}
              >
                View All
              </Button>
            }
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: 'none',
              height: '100%'
            }}
            styles={{ body: { padding: windowWidth <= 768 ? '12px' : '20px' } }}
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
              </div>
            ) : dashboardData.recentInquiries.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No inquiries assigned yet"
              />
            ) : (
              <List
                dataSource={dashboardData.recentInquiries}
                renderItem={(item) => (
                  <List.Item
                    style={{ 
                      padding: '12px 0',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/admin/inquiries`)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={<MessageOutlined />}
                          style={{ backgroundColor: '#1890ff' }}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{item.name}</Text>
                          <Tag color={getStatusColor(item.status)} style={{ borderRadius: '6px', fontSize: '11px' }}>
                            {item.status}
                          </Tag>
                          <Tag color={getPriorityColor(item.priority)} style={{ borderRadius: '6px', fontSize: '11px' }}>
                            {item.priority}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {item.subject}
                          </Text>
                          <Space>
                            <Tooltip title={item.email}>
                              <MailOutlined style={{ color: '#999', fontSize: '12px' }} />
                            </Tooltip>
                            {item.phone && (
                              <>
                                <Text type="secondary" style={{ fontSize: '12px' }}>•</Text>
                                <Tooltip title={item.phone}>
                                  <PhoneOutlined style={{ color: '#999', fontSize: '12px' }} />
                                </Tooltip>
                              </>
                            )}
                            <Text type="secondary" style={{ fontSize: '12px' }}>•</Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {item.time}
                            </Text>
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card 
        style={{ 
          marginTop: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
        styles={{ body: { padding: windowWidth <= 768 ? '16px' : '24px' } }}
      >
        <Title level={4} style={{ 
          marginBottom: '20px',
          fontFamily: "'Poppins', sans-serif",
          color: '#333'
        }}>
          Quick Actions
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={6}>
            <Button 
              type="primary" 
              block 
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={() => navigate('/admin/bookings')}
              style={{
                height: windowWidth <= 768 ? '48px' : '55px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                border: 'none',
                fontSize: windowWidth <= 768 ? '13px' : '15px',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              View Bookings
            </Button>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Button 
              block 
              size="large"
              icon={<MessageOutlined />}
              onClick={() => navigate('/admin/inquiries')}
              style={{
                height: windowWidth <= 768 ? '48px' : '55px',
                borderRadius: '12px',
                fontSize: windowWidth <= 768 ? '13px' : '15px',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif",
                border: '2px solid #1890ff',
                color: '#1890ff',
                background: 'transparent'
              }}
            >
              View Inquiries
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ManagerDashboard;

