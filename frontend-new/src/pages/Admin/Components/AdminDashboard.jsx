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
  
  // Get admin info from localStorage
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@touristwebsite.com';
  const adminRole = localStorage.getItem('adminRole') || 'Super Admin';

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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '20px 24px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 107, 53, 0.1)'
      }}>
        <div>
          <Title level={3} style={{ margin: '0 0 8px 0', color: '#2c3e50', fontFamily: "'Poppins', sans-serif" }}>
            📊 Dashboard Overview
          </Title>
          <Text style={{ fontSize: '14px', color: '#6c757d', fontFamily: "'Poppins', sans-serif" }}>
            Welcome back, {adminRole} • Last updated: {lastUpdated.toLocaleTimeString()}
          </Text>
        </div>
        
        <Button 
          type="primary"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={handleRefresh}
          style={{
            borderRadius: '12px',
            background: '#ff6b35',
            border: 'none',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '600'
          }}
        >
          Refresh Data
        </Button>
      </div>

      {/* Header Section - Landing Page Style */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '48px',
        padding: '40px 0',
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
        borderRadius: '20px',
        color: 'white',
        boxShadow: '0 15px 35px rgba(255, 107, 53, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Title level={1} style={{ 
          color: 'white', 
          marginBottom: '16px',
          fontSize: '42px',
          fontWeight: '700',
          fontFamily: "'Poppins', sans-serif"
        }}>
          🎯 Admin Dashboard
        </Title>
        <Paragraph style={{ 
          color: 'rgba(255, 255, 255, 0.9)', 
          fontSize: '18px',
          marginBottom: '0',
          fontFamily: "'Poppins', sans-serif"
        }}>
          Real-time business insights and management tools
        </Paragraph>
        <div style={{ 
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <Tag color="rgba(255, 255, 255, 0.2)" style={{ 
            color: 'white', 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontFamily: "'Poppins', sans-serif"
          }}>
            🔄 Auto-refresh every 30s
          </Tag>
          <Tag color="rgba(255, 255, 255, 0.2)" style={{ 
            color: 'white', 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontFamily: "'Poppins', sans-serif"
          }}>
            📊 Live Analytics
          </Tag>
        </div>
      </div>

      {/* Statistics Cards - Landing Page Style */}
      <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
              color: 'white',
              height: '200px',
              transition: 'all 0.3s ease'
            }}
            hoverable
          >
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <ShoppingCartOutlined style={{ fontSize: '36px', marginBottom: '16px', color: 'white' }} />
              <Title level={2} style={{ color: 'white', margin: '0 0 8px 0', fontSize: '40px', fontFamily: "'Poppins', sans-serif" }}>
                {dashboardData.stats.totalBookings.toLocaleString()}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', fontFamily: "'Poppins', sans-serif" }}>
                Total Bookings
              </Text>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ArrowUpOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                <Text style={{ color: '#52c41a', fontSize: '14px', marginLeft: '4px', fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}>
                  +{dashboardData.stats.monthlyGrowth}% this month
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              height: '200px',
              transition: 'all 0.3s ease'
            }}
            hoverable
          >
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <DollarOutlined style={{ fontSize: '36px', marginBottom: '16px', color: 'white' }} />
              <Title level={2} style={{ color: 'white', margin: '0 0 8px 0', fontSize: '40px', fontFamily: "'Poppins', sans-serif" }}>
                ₹{(dashboardData.stats.totalRevenue / 100000).toFixed(1)}L
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', fontFamily: "'Poppins', sans-serif" }}>
                Total Revenue
              </Text>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ArrowUpOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                <Text style={{ color: '#52c41a', fontSize: '14px', marginLeft: '4px', fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}>
                  +{dashboardData.stats.revenueGrowth}% growth
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              height: '200px',
              transition: 'all 0.3s ease'
            }}
            hoverable
          >
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <TeamOutlined style={{ fontSize: '36px', marginBottom: '16px', color: 'white' }} />
              <Title level={2} style={{ color: 'white', margin: '0 0 8px 0', fontSize: '40px', fontFamily: "'Poppins', sans-serif" }}>
                {dashboardData.stats.totalCustomers.toLocaleString()}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', fontFamily: "'Poppins', sans-serif" }}>
                Total Customers
              </Text>
              <div style={{ marginTop: '12px' }}>
                <Progress 
                  percent={dashboardData.stats.conversionRate} 
                  size="small" 
                  strokeColor="#52c41a"
                  style={{ width: '80px' }}
                />
                <Text style={{ color: '#52c41a', fontSize: '12px', marginLeft: '8px', fontFamily: "'Poppins', sans-serif" }}>
                  {dashboardData.stats.conversionRate}% active
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              height: '200px',
              transition: 'all 0.3s ease'
            }}
            hoverable
          >
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <TrophyOutlined style={{ fontSize: '36px', marginBottom: '16px', color: 'white' }} />
              <Title level={2} style={{ color: 'white', margin: '0 0 8px 0', fontSize: '40px', fontFamily: "'Poppins', sans-serif" }}>
                {dashboardData.stats.conversionRate}%
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', fontFamily: "'Poppins', sans-serif" }}>
                Conversion Rate
              </Text>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <StarOutlined style={{ color: '#ffd700', fontSize: '16px' }} />
                <Text style={{ color: '#ffd700', fontSize: '14px', marginLeft: '4px', fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}>
                  Excellent Performance
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Content Sections */}
      <Row gutter={[24, 24]}>
        {/* Recent Bookings */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                🛒 Recent Bookings
                <Tag color="#ff6b35" style={{ marginLeft: '8px' }}>
                  {dashboardData.recentBookings.length} Active
                </Tag>
              </div>
            }
            extra={
              <Button 
                type="text" 
                icon={<EyeOutlined />}
                style={{ color: '#ff6b35' }}
              >
                View All
              </Button>
            }
            style={{ 
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              minHeight: '400px'
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
                    padding: '20px 0',
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
                        size={60}
                        style={{ borderRadius: '50%', border: '3px solid #ff6b35' }}
                      />
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: '16px', fontFamily: "'Poppins', sans-serif" }}>
                          {item.customer}
                        </Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getStatusTag(item.status)}
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {item.time}
                          </Text>
                        </div>
                      </div>
                    }
                    description={
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                          <EnvironmentOutlined style={{ marginRight: '8px', color: '#ff6b35', fontSize: '16px' }} />
                          <Text style={{ fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>
                            {item.package}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarOutlined style={{ marginRight: '8px', color: '#ff6b35', fontSize: '14px' }} />
                            <Text type="secondary" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {item.date}
                            </Text>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Text strong style={{ color: '#52c41a', fontSize: '18px', fontFamily: "'Poppins', sans-serif" }}>
                              ₹{item.amount.toLocaleString()}
                            </Text>
                            <Button 
                              size="small" 
                              type="primary" 
                              style={{ 
                                background: '#ff6b35', 
                                border: 'none',
                                borderRadius: '8px'
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
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#2c3e50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  🏆 Top Packages
                  <Tag color="#ff6b35" style={{ marginLeft: '8px' }}>
                    Trending
                  </Tag>
                </div>
              }
              style={{ 
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                border: 'none',
                minHeight: '250px'
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
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#2c3e50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  ⚡ Quick Actions
                  <Tag color="blue" style={{ marginLeft: '8px' }}>
                    Fast Access
                  </Tag>
                </div>
              }
              style={{ 
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                border: 'none'
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  block 
                  size="large"
                  icon={<PlusOutlined />}
                  style={{
                    height: '55px',
                    borderRadius: '15px',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)'
                  }}
                >
                  📦 Add New Package
                </Button>
                <Button 
                  block 
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  style={{
                    height: '55px',
                    borderRadius: '15px',
                    fontSize: '16px',
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
                  🛒 View All Bookings
                </Button>
                <Button 
                  block 
                  size="large"
                  icon={<DownloadOutlined />}
                  style={{
                    height: '55px',
                    borderRadius: '15px',
                    fontSize: '16px',
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
                  📊 Generate Report
                </Button>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Recent Activities & Notifications */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                📈 Recent Activities
                <Tag color="green" style={{ marginLeft: '8px' }}>
                  Live Updates
                </Tag>
              </div>
            }
            style={{ 
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              minHeight: '300px'
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
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                🔔 Notifications
                <Badge 
                  count={
                    dashboardData.notifications.filter(n => n.message !== 'No pending notifications').length
                  } 
                  size="small" 
                />
              </div>
            }
            style={{ 
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: 'none',
              minHeight: '300px'
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
