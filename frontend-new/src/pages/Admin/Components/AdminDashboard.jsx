import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Space, 
  Avatar,
  Progress,
  Statistic,
  List,
  Tag,
  Timeline,
  Dropdown,
  message,
  Badge,
  Tooltip,
  Divider,
  Spin,
  Empty
} from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  PlusOutlined,
  ReloadOutlined,
  DownloadOutlined,
  StarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService, bookingService, tourService, analyticsService, api } from '../../../services';

// Import Google Font (Poppins) - Same as landing page
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text, Paragraph } = Typography;

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Get admin info from localStorage
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@touristwebsite.com';
  const adminRole = localStorage.getItem('adminRole') || 'Super Admin';
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time state management
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalBookings: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      conversionRate: 0,
      monthlyGrowth: 0,
      revenueGrowth: 0
    },
    recentBookings: [],
    topPackages: [],
    recentActivities: [],
    notifications: []
  });

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminRole');
    message.success('Logged out successfully!');
    navigate('/admin/login');
  };

  // User menu items
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  // Real-time data fetching function
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real data from APIs
      const [analyticsData, recentBookingsData] = await Promise.all([
        analyticsService.getDashboardAnalytics(),
        bookingService.getAllBookings({ limit: 10 })
      ]);

      const analytics = analyticsData?.overview || analyticsData || {};
      const recentBookings = Array.isArray(recentBookingsData) 
        ? recentBookingsData 
        : (recentBookingsData?.bookings || []);
      const topTours = analyticsData?.topTours || [];

      // Calculate growth percentages
      const monthlyGrowth = analytics.monthlyRevenue && analytics.totalRevenue 
        ? Math.round(((analytics.monthlyRevenue / analytics.totalRevenue) * 100) / (analytics.totalBookings || 1))
        : 0;
      
      const revenueGrowth = analytics.monthlyRevenue && analytics.yearlyRevenue
        ? Math.round(((analytics.monthlyRevenue / (analytics.yearlyRevenue / 12)) - 1) * 100)
        : 0;

      // Calculate conversion rate (confirmed bookings / total bookings)
      const confirmedBookings = analyticsData?.bookingStatus?.confirmed || 0;
      const conversionRate = analytics.totalBookings > 0
        ? Math.round((confirmedBookings / analytics.totalBookings) * 100)
        : 0;

      // Format recent bookings
      const formattedRecentBookings = recentBookings.slice(0, 5).map((booking, index) => {
        const customerName = booking.user?.name || booking.customerName || 'Guest User';
        const packageName = booking.tour?.title || booking.packageName || 'Unknown Package';
        const amount = booking.totalAmount || booking.amount || 0;
        const status = booking.status || 'pending';
        const createdAt = booking.createdAt || booking.date || new Date();
        
        return {
          key: booking._id || booking.id || `booking-${index}`,
          id: booking._id || booking.id,
          customer: customerName,
          package: packageName,
          amount: amount,
          status: status,
          date: new Date(createdAt).toISOString().split('T')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${customerName}`,
          time: getTimeAgo(createdAt)
        };
      });

      // Format top packages
      const formattedTopPackages = topTours.slice(0, 4).map((item, index) => {
        const tour = item.tour || item;
        const bookings = item.bookings || item.count || 0;
        const revenue = item.revenue || 0;
        
        return {
          key: tour._id || tour.id || `package-${index}`,
          name: tour.title || tour.name || 'Unknown Package',
          bookings: bookings,
          revenue: revenue,
          rating: 4.5 + (Math.random() * 0.5), // Placeholder rating
          trend: index < 2 ? 'up' : 'down'
        };
      });

      // Generate recent activities from bookings
      const recentActivities = formattedRecentBookings.slice(0, 4).map((booking, index) => ({
        key: `act-${index}`,
        action: `New booking received for ${booking.package}`,
        time: booking.time,
        type: 'booking'
      }));

      // Generate notifications from pending bookings
      const pendingBookings = recentBookings.filter(b => b.status === 'pending').slice(0, 3);
      const notifications = pendingBookings.map((booking, index) => ({
        id: index + 1,
        message: `New booking pending approval - ${booking.tour?.title || 'Package'}`,
        type: 'warning',
        time: getTimeAgo(booking.createdAt)
      }));

      const newData = {
        stats: {
          totalBookings: analytics.totalBookings || 0,
          totalRevenue: analytics.totalRevenue || 0,
          totalCustomers: analytics.totalCustomers || 0,
          conversionRate: conversionRate,
          monthlyGrowth: monthlyGrowth,
          revenueGrowth: revenueGrowth
        },
        recentBookings: formattedRecentBookings,
        topPackages: formattedTopPackages,
        recentActivities: recentActivities,
        notifications: notifications.length > 0 ? notifications : [
          { id: 1, message: 'No pending notifications', type: 'info', time: 'Just now' }
        ]
      };
      
      setDashboardData(newData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      message.error('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleRefresh = () => {
    fetchDashboardData();
    message.success('Dashboard data refreshed!');
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#52c41a';
      case 'pending': return '#faad14';
      case 'cancelled': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  const getStatusTag = (status) => {
    const colors = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'error'
    };
    return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? <ArrowUpOutlined style={{ color: '#52c41a' }} /> : <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
  };

  return (
    <Spin spinning={loading} tip="Loading dashboard data...">
      <div style={{ 
        fontFamily: "'Poppins', sans-serif",
        width: '100%',
        maxWidth: '100%',
        overflow: 'visible',
        opacity: loading ? 0.7 : 1,
        transition: 'opacity 0.3s ease'
      }}>
      {/* Dashboard Header */}
      <div style={{
        position: 'relative',
        marginBottom: windowWidth <= 768 ? '24px' : '32px',
        paddingBottom: windowWidth <= 768 ? '20px' : '20px',
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
          Admin Dashboard
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
          Real-time business insights and management tools
        </p>
        
        <Button 
          type="primary"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={handleRefresh}
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
          {windowWidth > 768 && 'Refresh Data'}
        </Button>
      </div>


      {/* Statistics Cards - Landing Page Style */}
      <Row gutter={[windowWidth <= 768 ? 12 : 24, windowWidth <= 768 ? 12 : 24]} style={{ marginBottom: windowWidth <= 768 ? '24px' : '48px' }}>
        <Col xs={12} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: windowWidth <= 768 ? '12px' : '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
              color: 'white',
              height: windowWidth <= 768 ? '150px' : '220px',
              transition: 'all 0.3s ease',
              overflow: 'hidden'
            }}
            bodyStyle={{ 
              padding: '0',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            hoverable
          >
            <div style={{ textAlign: 'center', padding: windowWidth <= 768 ? '12px 8px' : '20px 16px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: '0 0 auto' }}>
                <ShoppingCartOutlined style={{ fontSize: windowWidth <= 768 ? '22px' : '36px', color: 'white', display: 'block' }} />
              </div>
              <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
                <Title level={2} style={{ color: 'white', margin: '0 0 6px 0', fontSize: windowWidth <= 768 ? '20px' : '40px', fontFamily: "'Poppins', sans-serif", lineHeight: '1.2' }}>
                {dashboardData.stats.totalBookings.toLocaleString()}
              </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '10px' : '16px', fontFamily: "'Poppins', sans-serif", display: 'block' }}>
                Total Bookings
              </Text>
              </div>
              <div style={{ flex: '0 0 auto', marginTop: windowWidth <= 768 ? '4px' : '8px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  flexWrap: 'wrap',
                  gap: '4px'
                }}>
                  {dashboardData.stats.monthlyGrowth >= 0 ? (
                    <>
                      <ArrowUpOutlined style={{ color: '#52c41a', fontSize: windowWidth <= 768 ? '10px' : '16px' }} />
                      <Text style={{ color: '#52c41a', fontSize: windowWidth <= 768 ? '9px' : '14px', fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}>
                        +{dashboardData.stats.monthlyGrowth}% {windowWidth > 768 && 'this month'}
                </Text>
                    </>
                  ) : (
                    <>
                      <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: windowWidth <= 768 ? '10px' : '16px' }} />
                      <Text style={{ color: '#ff4d4f', fontSize: windowWidth <= 768 ? '9px' : '14px', fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}>
                        {dashboardData.stats.monthlyGrowth}% {windowWidth > 768 && 'this month'}
                      </Text>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={12} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: windowWidth <= 768 ? '12px' : '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              height: windowWidth <= 768 ? '150px' : '220px',
              transition: 'all 0.3s ease',
              overflow: 'hidden'
            }}
            bodyStyle={{ 
              padding: '0',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            hoverable
          >
            <div style={{ textAlign: 'center', padding: windowWidth <= 768 ? '12px 8px' : '20px 16px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: '0 0 auto' }}>
                <DollarOutlined style={{ fontSize: windowWidth <= 768 ? '22px' : '36px', color: 'white', display: 'block' }} />
              </div>
              <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
                <Title level={2} style={{ color: 'white', margin: '0 0 6px 0', fontSize: windowWidth <= 768 ? '18px' : '40px', fontFamily: "'Poppins', sans-serif", lineHeight: '1.2' }}>
                ₹{(dashboardData.stats.totalRevenue / 100000).toFixed(1)}L
              </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '10px' : '16px', fontFamily: "'Poppins', sans-serif", display: 'block' }}>
                Total Revenue
              </Text>
              </div>
              <div style={{ flex: '0 0 auto', marginTop: windowWidth <= 768 ? '4px' : '8px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  flexWrap: 'wrap',
                  gap: '4px'
                }}>
                  {dashboardData.stats.revenueGrowth >= 0 ? (
                    <>
                      <ArrowUpOutlined style={{ color: '#52c41a', fontSize: windowWidth <= 768 ? '10px' : '16px' }} />
                      <Text style={{ color: '#52c41a', fontSize: windowWidth <= 768 ? '9px' : '14px', fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}>
                        +{dashboardData.stats.revenueGrowth}% {windowWidth > 768 && 'growth'}
                </Text>
                    </>
                  ) : (
                    <>
                      <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: windowWidth <= 768 ? '10px' : '16px' }} />
                      <Text style={{ color: '#ff4d4f', fontSize: windowWidth <= 768 ? '9px' : '14px', fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}>
                        {dashboardData.stats.revenueGrowth}% {windowWidth > 768 && 'growth'}
                      </Text>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={12} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: windowWidth <= 768 ? '12px' : '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              height: windowWidth <= 768 ? '150px' : '220px',
              transition: 'all 0.3s ease',
              overflow: 'hidden'
            }}
            bodyStyle={{ 
              padding: '0',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            hoverable
          >
            <div style={{ textAlign: 'center', padding: windowWidth <= 768 ? '12px 8px' : '20px 16px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: '0 0 auto' }}>
                <TeamOutlined style={{ fontSize: windowWidth <= 768 ? '22px' : '36px', color: 'white', display: 'block' }} />
              </div>
              <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
                <Title level={2} style={{ color: 'white', margin: '0 0 6px 0', fontSize: windowWidth <= 768 ? '20px' : '40px', fontFamily: "'Poppins', sans-serif", lineHeight: '1.2' }}>
                {dashboardData.stats.totalCustomers.toLocaleString()}
              </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '10px' : '16px', fontFamily: "'Poppins', sans-serif", display: 'block' }}>
                Total Customers
              </Text>
              </div>
              <div style={{ flex: '0 0 auto', marginTop: windowWidth <= 768 ? '4px' : '8px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  flexWrap: 'wrap',
                  gap: windowWidth <= 768 ? '4px' : '8px'
                }}>
                  {windowWidth <= 768 ? (
                    <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '9px', fontFamily: "'Poppins', sans-serif", fontWeight: '500' }}>
                      {dashboardData.stats.conversionRate}% active
                    </Text>
                  ) : (
                    <>
                <Progress 
                  percent={dashboardData.stats.conversionRate} 
                  size="small" 
                  strokeColor="#52c41a"
                  style={{ width: '80px' }}
                />
                      <Text style={{ color: '#52c41a', fontSize: '12px', fontFamily: "'Poppins', sans-serif" }}>
                  {dashboardData.stats.conversionRate}% active
                </Text>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={12} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: windowWidth <= 768 ? '12px' : '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              height: windowWidth <= 768 ? '150px' : '220px',
              transition: 'all 0.3s ease',
              overflow: 'hidden'
            }}
            bodyStyle={{ 
              padding: '0',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            hoverable
          >
            <div style={{ textAlign: 'center', padding: windowWidth <= 768 ? '12px 8px' : '20px 16px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: '0 0 auto' }}>
                <TrophyOutlined style={{ fontSize: windowWidth <= 768 ? '22px' : '36px', color: 'white', display: 'block' }} />
              </div>
              <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
                <Title level={2} style={{ color: 'white', margin: '0 0 6px 0', fontSize: windowWidth <= 768 ? '20px' : '40px', fontFamily: "'Poppins', sans-serif", lineHeight: '1.2' }}>
                {dashboardData.stats.conversionRate}%
              </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '10px' : '16px', fontFamily: "'Poppins', sans-serif", display: 'block' }}>
                Conversion Rate
              </Text>
              </div>
              <div style={{ flex: '0 0 auto', marginTop: windowWidth <= 768 ? '4px' : '8px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  flexWrap: 'wrap',
                  gap: '4px'
                }}>
                  <StarOutlined style={{ color: '#ffd700', fontSize: windowWidth <= 768 ? '10px' : '16px' }} />
                  <Text style={{ color: '#ffd700', fontSize: windowWidth <= 768 ? '9px' : '14px', fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}>
                    {windowWidth <= 768 ? 'Excellent' : 'Excellent Performance'}
                </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Content Sections */}
      <Row gutter={[windowWidth <= 768 ? 12 : 24, windowWidth <= 768 ? 12 : 24]}>
        {/* Recent Bookings */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div style={{ 
                fontSize: windowWidth <= 768 ? '16px' : '20px', 
                fontWeight: '600', 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Poppins', sans-serif",
                flexWrap: 'wrap'
              }}>
                Recent Bookings
                <Tag color="#ff6b35" style={{ marginLeft: '8px', fontSize: windowWidth <= 768 ? '11px' : '12px' }}>
                  {dashboardData.recentBookings.length} Active
                </Tag>
              </div>
            }
            extra={
              windowWidth > 768 && (
              <Button 
                type="text" 
                icon={<EyeOutlined />}
                  onClick={() => navigate('/admin/bookings')}
                style={{ color: '#ff6b35' }}
              >
                View All
              </Button>
              )
            }
            style={{ 
              borderRadius: windowWidth <= 768 ? '12px' : '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              minHeight: windowWidth <= 768 ? '300px' : '400px'
            }}
          >
            {dashboardData.recentBookings.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <ShoppingCartOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
                    <Text style={{ fontSize: '16px', color: '#8c8c8c', display: 'block', marginBottom: '8px' }}>
                      No recent bookings yet
                    </Text>
                    <Text type="secondary" style={{ fontSize: '14px', display: 'block' }}>
                      Bookings will appear here once customers start making reservations
                    </Text>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      style={{ 
                        marginTop: '20px',
                        background: '#ff6b35',
                        border: 'none',
                        borderRadius: '8px'
                      }}
                      onClick={() => navigate('/admin/packages')}
                    >
                      Create Package
                    </Button>
                  </div>
                }
              />
            ) : (
              <List
                dataSource={dashboardData.recentBookings}
                renderItem={(item) => (
                <List.Item
                  style={{ 
                    padding: windowWidth <= 768 ? '12px 0' : '20px 0',
                    borderBottom: '1px solid #f0f0f0',
                    borderRadius: '12px',
                    marginBottom: '8px',
                    background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        src={item.avatar}
                        size={windowWidth <= 768 ? 48 : 60}
                        style={{ borderRadius: '50%', border: '3px solid #ff6b35' }}
                      />
                    }
                    title={
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: windowWidth <= 768 ? 'column' : 'row',
                        justifyContent: 'space-between', 
                        alignItems: windowWidth <= 768 ? 'flex-start' : 'center',
                        gap: windowWidth <= 768 ? '8px' : '0'
                      }}>
                        <Text strong style={{ 
                          fontSize: windowWidth <= 768 ? '14px' : '16px', 
                          fontFamily: "'Poppins', sans-serif" 
                        }}>
                          {item.customer}
                        </Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {getStatusTag(item.status)}
                          <Text type="secondary" style={{ fontSize: windowWidth <= 768 ? '11px' : '12px' }}>
                            {item.time}
                          </Text>
                        </div>
                      </div>
                    }
                    description={
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ marginBottom: windowWidth <= 768 ? '8px' : '12px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                          <EnvironmentOutlined style={{ marginRight: '8px', color: '#ff6b35', fontSize: windowWidth <= 768 ? '14px' : '16px' }} />
                          <Text style={{ 
                            fontSize: windowWidth <= 768 ? '13px' : '14px', 
                            fontFamily: "'Poppins', sans-serif" 
                          }}>
                            {item.package}
                          </Text>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: windowWidth <= 768 ? 'column' : 'row',
                          justifyContent: 'space-between', 
                          alignItems: windowWidth <= 768 ? 'flex-start' : 'center',
                          gap: windowWidth <= 768 ? '12px' : '0'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarOutlined style={{ marginRight: '8px', color: '#ff6b35', fontSize: windowWidth <= 768 ? '12px' : '14px' }} />
                            <Text type="secondary" style={{ 
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: windowWidth <= 768 ? '12px' : '14px'
                            }}>
                              {item.date}
                            </Text>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <Text strong style={{ 
                              color: '#52c41a', 
                              fontSize: windowWidth <= 768 ? '16px' : '18px', 
                              fontFamily: "'Poppins', sans-serif" 
                            }}>
                              ₹{item.amount.toLocaleString()}
                            </Text>
                            <Button 
                              size="small" 
                              type="primary" 
                              onClick={() => navigate(`/admin/bookings`)}
                              style={{ 
                                background: '#ff6b35', 
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: windowWidth <= 768 ? '12px' : '14px',
                                height: windowWidth <= 768 ? '28px' : '32px'
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Top Packages & Quick Actions */}
        <Col xs={24} lg={10}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Top Packages */}
            <Card 
              title={
                <div style={{ 
                    fontSize: windowWidth <= 768 ? '16px' : '20px', 
                  fontWeight: '600', 
                  color: '#2c3e50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                    fontFamily: "'Poppins', sans-serif",
                    flexWrap: 'wrap'
                }}>
                    Top Packages
                    <Tag color="#ff6b35" style={{ marginLeft: '8px', fontSize: windowWidth <= 768 ? '11px' : '12px' }}>
                    Trending
                  </Tag>
                </div>
              }
              style={{ 
              borderRadius: windowWidth <= 768 ? '12px' : '20px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                border: 'none',
              minHeight: windowWidth <= 768 ? '200px' : '250px'
              }}
            >
              {dashboardData.topPackages.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <TrophyOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '12px' }} />
                      <Text style={{ fontSize: '14px', color: '#8c8c8c', display: 'block' }}>
                        No packages data available
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                        Top packages will appear after bookings are made
                      </Text>
                    </div>
                  }
                />
              ) : (
                <List
                  dataSource={dashboardData.topPackages}
                  renderItem={(item, index) => (
                  <List.Item style={{ 
                    padding: '16px 0',
                    borderRadius: '12px',
                    marginBottom: '8px',
                    background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
                    border: '1px solid #f0f0f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Text strong style={{ color: '#ff6b35', fontSize: '16px', fontFamily: "'Poppins', sans-serif" }}>
                            #{index + 1}
                          </Text>
                          <Text strong style={{ fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>
                            {item.name}
                          </Text>
                          {getTrendIcon(item.trend)}
                        </div>
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Text type="secondary" style={{ fontSize: '12px', fontFamily: "'Poppins', sans-serif" }}>
                            {item.bookings} bookings
                          </Text>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <StarOutlined style={{ color: '#ffd700', fontSize: '12px' }} />
                            <Text style={{ fontSize: '12px', fontFamily: "'Poppins', sans-serif" }}>
                              {item.rating}
                            </Text>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Text strong style={{ color: '#52c41a', fontSize: '16px', fontFamily: "'Poppins', sans-serif" }}>
                          ₹{(item.revenue / 100000).toFixed(1)}L
                        </Text>
                        <div style={{ fontSize: '10px', color: '#6c757d' }}>
                          Revenue
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
              )}
            </Card>

            {/* Quick Actions */}
            <Card 
              title={
                <div style={{ 
                    fontSize: windowWidth <= 768 ? '16px' : '20px', 
                  fontWeight: '600', 
                  color: '#2c3e50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                    fontFamily: "'Poppins', sans-serif",
                    flexWrap: 'wrap'
                }}>
                    Quick Actions
                    <Tag color="blue" style={{ marginLeft: '8px', fontSize: windowWidth <= 768 ? '11px' : '12px' }}>
                    Fast Access
                  </Tag>
                </div>
              }
              style={{ 
                borderRadius: windowWidth <= 768 ? '12px' : '20px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                border: 'none'
              }}
            >
              <Space direction="vertical" size={windowWidth <= 768 ? "small" : "middle"} style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  block 
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/admin/packages')}
                  style={{
                    height: windowWidth <= 768 ? '48px' : '55px',
                    borderRadius: windowWidth <= 768 ? '12px' : '15px',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                    border: 'none',
                    fontSize: windowWidth <= 768 ? '14px' : '16px',
                    fontWeight: '600',
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)'
                  }}
                >
                  Add New Package
                </Button>
                <Button 
                  block 
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => navigate('/admin/bookings')}
                  style={{
                    height: windowWidth <= 768 ? '48px' : '55px',
                    borderRadius: windowWidth <= 768 ? '12px' : '15px',
                    fontSize: windowWidth <= 768 ? '14px' : '16px',
                    fontWeight: '600',
                    fontFamily: "'Poppins', sans-serif",
                    border: '2px solid #667eea',
                    color: '#667eea',
                    background: 'transparent',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#667eea';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#667eea';
                  }}
                >
                  View All Bookings
                </Button>
                <Button 
                  block 
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={() => navigate('/admin/reports')}
                  style={{
                    height: windowWidth <= 768 ? '48px' : '55px',
                    borderRadius: windowWidth <= 768 ? '12px' : '15px',
                    fontSize: windowWidth <= 768 ? '14px' : '16px',
                    fontWeight: '600',
                    fontFamily: "'Poppins', sans-serif",
                    border: '2px solid #43e97b',
                    color: '#43e97b',
                    background: 'transparent',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#43e97b';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#43e97b';
                  }}
                >
                  Generate Report
                </Button>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Recent Activities & Notifications */}
      <Row gutter={[windowWidth <= 768 ? 12 : 24, windowWidth <= 768 ? 12 : 24]} style={{ marginTop: windowWidth <= 768 ? '16px' : '24px' }}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div style={{ 
                fontSize: windowWidth <= 768 ? '16px' : '20px', 
                fontWeight: '600', 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Poppins', sans-serif",
                flexWrap: 'wrap'
              }}>
                Recent Activities
                <Tag color="green" style={{ marginLeft: '8px', fontSize: windowWidth <= 768 ? '11px' : '12px' }}>
                  Live Updates
                </Tag>
              </div>
            }
            style={{ 
              borderRadius: windowWidth <= 768 ? '12px' : '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              minHeight: windowWidth <= 768 ? '250px' : '300px'
            }}
          >
            {dashboardData.recentActivities.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                    <ClockCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '12px' }} />
                    <Text style={{ fontSize: '14px', color: '#8c8c8c', display: 'block' }}>
                      No recent activities
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                      Activities will appear here as they happen
                    </Text>
                  </div>
                }
              />
            ) : (
              <Timeline
                items={dashboardData.recentActivities.map(activity => ({
                  key: activity.key,
                  color: activity.type === 'booking' ? '#52c41a' : 
                         activity.type === 'payment' ? '#1890ff' : 
                         activity.type === 'inquiry' ? '#faad14' : '#722ed1',
                  children: (
                    <div style={{ 
                      background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid #f0f0f0'
                    }}>
                      <Text strong style={{ fontSize: '16px', fontFamily: "'Poppins', sans-serif" }}>
                        {activity.action}
                      </Text>
                      <br />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <ClockCircleOutlined style={{ color: '#6c757d', fontSize: '12px' }} />
                        <Text type="secondary" style={{ fontSize: '12px', fontFamily: "'Poppins', sans-serif" }}>
                          {activity.time}
                        </Text>
                      </div>
                    </div>
                  )
                }))}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ 
                fontSize: windowWidth <= 768 ? '16px' : '20px', 
                fontWeight: '600', 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Poppins', sans-serif",
                flexWrap: 'wrap'
              }}>
                Notifications
                <Badge 
                  count={
                    dashboardData.notifications.filter(n => n.message !== 'No pending notifications').length
                  } 
                  size="small" 
                />
              </div>
            }
            style={{ 
              borderRadius: windowWidth <= 768 ? '12px' : '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              minHeight: windowWidth <= 768 ? '250px' : '300px'
            }}
          >
            {dashboardData.notifications.length === 0 || 
             (dashboardData.notifications.length === 1 && dashboardData.notifications[0].message === 'No pending notifications') ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                    <BellOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '12px' }} />
                    <Text style={{ fontSize: '14px', color: '#8c8c8c', display: 'block' }}>
                      No notifications
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                      You're all caught up! New notifications will appear here
                    </Text>
                  </div>
                }
              />
            ) : (
              <List
                dataSource={dashboardData.notifications.filter(n => n.message !== 'No pending notifications')}
                renderItem={(notification) => (
                  <List.Item style={{ 
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <List.Item.Meta
                      avatar={
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: notification.type === 'success' ? '#52c41a' : 
                                     notification.type === 'warning' ? '#faad14' : '#1890ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {notification.type === 'success' ? <CheckCircleOutlined style={{ color: 'white' }} /> :
                           notification.type === 'warning' ? <ExclamationCircleOutlined style={{ color: 'white' }} /> :
                           <BellOutlined style={{ color: 'white' }} />}
                        </div>
                      }
                      title={
                        <Text style={{ fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>
                          {notification.message}
                        </Text>
                      }
                      description={
                        <Text type="secondary" style={{ fontSize: '12px', fontFamily: "'Poppins', sans-serif" }}>
                          {notification.time}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
      </div>
    </Spin>
  );
};

export default AdminDashboard;
