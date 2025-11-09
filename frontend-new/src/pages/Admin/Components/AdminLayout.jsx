import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Badge,
  Typography,
  Drawer,
  message,
  Modal,
} from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  MessageOutlined,
  GiftOutlined,
  FileTextOutlined,
  PictureOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  MenuOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  SearchOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { bookingService, inquiryService } from "../../../services";

// Import Google Font (Poppins)
const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationDrawerVisible, setNotificationDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [greetingModalVisible, setGreetingModalVisible] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setMobileDrawerVisible(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Time-based greeting modal when admin enters dashboard
  useEffect(() => {
    if (location.pathname === '/admin/dashboard') {
      const justLoggedIn = sessionStorage.getItem('adminJustLoggedIn');
      
      // Show greeting if admin just logged in
      if (justLoggedIn === 'true') {
        const hour = new Date().getHours();
        let greeting = '';
        
        if (hour >= 5 && hour < 12) {
          greeting = 'Good Morning';
        } else if (hour >= 12 && hour < 17) {
          greeting = 'Good Afternoon';
        } else if (hour >= 17 && hour < 21) {
          greeting = 'Good Evening';
        } else {
          greeting = 'Good Night';
        }
        
        const adminRole = localStorage.getItem('adminRole') || 'Super Admin';
        setGreetingMessage(`${greeting}, ${adminRole}!`);
        setGreetingModalVisible(true);
        
        // Clear the flag so it doesn't show again until next login
        sessionStorage.removeItem('adminJustLoggedIn');
        sessionStorage.setItem('lastAdminGreetingTime', Date.now().toString());
        
        // Auto close modal after 4 seconds
        setTimeout(() => {
          setGreetingModalVisible(false);
        }, 4000);
      }
    }
  }, [location.pathname]);

  // Real-time notification system with real data
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [bookingsData, inquiriesData] = await Promise.all([
          bookingService.getAllBookings({ limit: 20, sort: '-createdAt' }),
          inquiryService.getAllInquiries({ limit: 20, sort: '-createdAt' })
        ]);

        const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.bookings || []);
        const inquiries = Array.isArray(inquiriesData) ? inquiriesData : (inquiriesData?.inquiries || inquiriesData || []);

        const notificationList = [];

        // Process recent bookings (last 24 hours)
        const recentBookings = bookings.filter(booking => {
          const bookingDate = new Date(booking.createdAt || booking.date);
          const hoursAgo = (Date.now() - bookingDate.getTime()) / (1000 * 60 * 60);
          return hoursAgo <= 24;
        });

        recentBookings.slice(0, 5).forEach(booking => {
          const customerName = booking.user?.name || booking.customerName || 'Guest User';
          const packageName = booking.tour?.title || booking.packageName || 'Unknown Package';
          const bookingDate = new Date(booking.createdAt || booking.date);
          
          notificationList.push({
            id: `booking-${booking._id || booking.id}`,
            type: booking.status === 'pending' ? 'warning' : 'success',
            title: booking.status === 'pending' ? 'New Booking Pending' : 'New Booking Received',
            message: `${customerName} booked ${packageName}`,
            time: bookingDate,
            read: false,
            icon: <ShoppingCartOutlined />,
            link: `/admin/bookings`
          });
        });

        // Process pending payments
        const pendingPayments = bookings.filter(booking => 
          booking.payment?.status === 'pending' || booking.status === 'pending'
        );

        pendingPayments.slice(0, 3).forEach(booking => {
          const customerName = booking.user?.name || booking.customerName || 'Guest User';
          const amount = booking.totalAmount || booking.amount || 0;
          const bookingDate = new Date(booking.createdAt || booking.date);
          const daysPending = Math.floor((Date.now() - bookingDate.getTime()) / (1000 * 60 * 60 * 24));
          
          notificationList.push({
            id: `payment-${booking._id || booking.id}`,
            type: daysPending > 2 ? 'warning' : 'info',
            title: 'Payment Pending',
            message: `Payment of ₹${amount.toLocaleString()} pending for ${daysPending} day${daysPending > 1 ? 's' : ''}`,
            time: bookingDate,
            read: false,
            icon: <ExclamationCircleOutlined />,
            link: `/admin/bookings`
          });
        });

        // Process recent inquiries (last 24 hours)
        const recentInquiries = inquiries.filter(inquiry => {
          const inquiryDate = new Date(inquiry.createdAt || inquiry.date);
          const hoursAgo = (Date.now() - inquiryDate.getTime()) / (1000 * 60 * 60);
          return hoursAgo <= 24 && (inquiry.status === 'new' || !inquiry.status);
        });

        recentInquiries.slice(0, 5).forEach(inquiry => {
          const customerName = inquiry.name || inquiry.customerName || 'Guest';
          const tourName = inquiry.interestedTour?.title || inquiry.tourName || 'General Inquiry';
          const inquiryDate = new Date(inquiry.createdAt || inquiry.date);
          
          notificationList.push({
            id: `inquiry-${inquiry._id || inquiry.id}`,
            type: 'info',
            title: 'New Customer Inquiry',
            message: `${customerName} inquired about ${tourName}`,
            time: inquiryDate,
            read: false,
            icon: <MessageOutlined />,
            link: `/admin/inquiries`
          });
        });

        // Sort by time (newest first) and limit to 10
        notificationList.sort((a, b) => new Date(b.time) - new Date(a.time));
        const finalNotifications = notificationList.slice(0, 10);

        // Check for new notifications (compare with previous state)
        setNotifications(prev => {
          const prevIds = new Set(prev.map(n => n.id));
          const newNotifications = finalNotifications.filter(n => !prevIds.has(n.id));
          
          // Show browser notification for new items
          if (newNotifications.length > 0 && Notification.permission === 'granted') {
            newNotifications.forEach(notif => {
              new Notification(notif.title, {
                body: notif.message,
                icon: '/favicon.ico',
                tag: notif.id
              });
            });
          }
          
          return finalNotifications;
        });
        
        setUnreadCount(finalNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        // Set empty notifications on error
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Refresh notifications every 30 seconds
    const notificationInterval = setInterval(fetchNotifications, 30000);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => clearInterval(notificationInterval);
  }, []);

  const adminEmail =
    localStorage.getItem("adminEmail") || "admin@touristwebsite.com";
  const adminRole = localStorage.getItem("adminRole") || "Super Admin";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminRole");
    // Clear greeting-related sessionStorage
    sessionStorage.removeItem("adminJustLoggedIn");
    sessionStorage.removeItem("lastAdminGreetingTime");
    message.success("Logged out successfully!");
    navigate("/admin/login");
  };

  // Notification handlers
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning': return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'error': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const formatTime = (time) => {
    const now = new Date();
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const userMenuItems = [
    { 
      key: "profile", 
      icon: <UserOutlined />, 
      label: "Profile",
      onClick: () => navigate("/admin/profile")
    },
    { 
      key: "settings", 
      icon: <SettingOutlined />, 
      label: "Settings",
      onClick: () => navigate("/admin/settings")
    },
    { type: "divider" },
    { 
      key: "logout", 
      icon: <LogoutOutlined />, 
      label: "Logout", 
      onClick: handleLogout,
      danger: true
    },
  ];

  const menuItems = [
    { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard", onClick: () => navigate("/admin/dashboard") },
    { key: "/admin/packages", icon: <AppstoreOutlined />, label: "Packages", onClick: () => navigate("/admin/packages") },
    { key: "/admin/states", icon: <HomeOutlined />, label: "States & Cities", onClick: () => navigate("/admin/states") },
    { key: "/admin/bookings", icon: <ShoppingCartOutlined />, label: "Bookings", onClick: () => navigate("/admin/bookings") },
    { key: "/admin/customers", icon: <TeamOutlined />, label: "Customers", onClick: () => navigate("/admin/customers") },
    { key: "/admin/inquiries", icon: <MessageOutlined />, label: "Inquiries", onClick: () => navigate("/admin/inquiries") },
    { key: "/admin/offers", icon: <GiftOutlined />, label: "Offers & Coupons", onClick: () => navigate("/admin/offers") },
    { key: "/admin/content", icon: <FileTextOutlined />, label: "Content Management", onClick: () => navigate("/admin/content") },
    { key: "/admin/gallery", icon: <PictureOutlined />, label: "Media Gallery", onClick: () => navigate("/admin/gallery") },
    { key: "/admin/reports", icon: <BarChartOutlined />, label: "Reports & Analytics", onClick: () => navigate("/admin/reports") },
    { key: "/admin/settings", icon: <SettingOutlined />, label: "Settings", onClick: () => navigate("/admin/settings") },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/") return "/admin/dashboard";
    return path;
  };

  const MobileMenu = () => (
    <Drawer
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#ff6b35",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HomeOutlined style={{ color: "white", fontSize: "20px" }} />
          </div>
          <Title level={4} style={{ margin: 0, color: "#ff6b35", fontSize: "18px" }}>
            Admin Panel
          </Title>
        </div>
      }
      placement="left"
      onClose={() => setMobileDrawerVisible(false)}
      open={mobileDrawerVisible}
      width={Math.min(280, window.innerWidth * 0.85)}
      styles={{ body: { padding: 0 } }}
    >
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems.map(item => ({
          ...item,
          onClick: () => {
            item.onClick();
            setMobileDrawerVisible(false);
          }
        }))}
        style={{
          border: "none",
          fontFamily: "'Poppins', sans-serif",
          padding: "16px 0",
          fontSize: "15px"
        }}
      />
      <div style={{ 
        padding: "16px", 
        borderTop: "1px solid #f0f0f0",
        marginTop: "auto"
      }}>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          block
          style={{
            height: "42px",
            borderRadius: "8px",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "600"
          }}
        >
          Logout
        </Button>
      </div>
    </Drawer>
  );

  const DesktopSidebar = () => (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={280}
      collapsedWidth={80}
      style={{
        background: "white",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
        height: "100vh",
        position: "fixed", // fixed sidebar
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "20px 16px",
          borderBottom: "1px solid #f0f0f0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: collapsed ? "40px" : "60px",
            height: collapsed ? "40px" : "60px",
            backgroundColor: "#ff6b35",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            transition: "all 0.3s ease",
          }}
        >
          <HomeOutlined
            style={{ color: "white", fontSize: collapsed ? "20px" : "28px" }}
          />
        </div>
        {!collapsed && (
          <Title level={4} style={{ margin: 0, color: "#ff6b35", fontSize: "18px" }}>
            Admin Panel
          </Title>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        style={{
          border: "none",
          fontFamily: "'Poppins', sans-serif",
          padding: "16px 0",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "#ff6b35",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
          }}
        />
      </div>
    </Sider>
  );

  return (
    <Layout style={{ minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      {windowWidth <= 768 && <MobileMenu />}
      {windowWidth > 768 && <DesktopSidebar />}

      <Layout
        style={{
          marginLeft: windowWidth > 768 ? (collapsed ? 80 : 280) : 0,
          transition: "all 0.3s ease",
          minHeight: "100vh",
          background: "#f8f9fa",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Header
          style={{
            background: "white",
            padding: windowWidth <= 768 ? "0 12px" : "0 24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderBottom: "1px solid #f0f0f0",
            position: "sticky",
            top: 0,
            zIndex: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: windowWidth <= 768 ? "56px" : "64px",
            minHeight: windowWidth <= 768 ? "56px" : "64px",
            maxHeight: windowWidth <= 768 ? "56px" : "64px",
            overflow: "hidden",
            width: "100%"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: windowWidth <= 768 ? "8px" : "16px", flex: 1 }}>
            {windowWidth <= 768 && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileDrawerVisible(true)}
                style={{ 
                  fontSize: "20px",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              />
            )}
            {windowWidth <= 768 ? (
            <div
              style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f8f9fa",
                  borderRadius: "12px",
                  padding: "6px 10px",
                  flex: 1,
                  maxWidth: "calc(100vw - 180px)",
                  border: "1px solid #e9ecef",
                  height: "36px"
                }}
              >
                <SearchOutlined style={{ color: "#6c757d", marginRight: "6px", fontSize: "14px" }} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      message.info(`Searching for: ${searchQuery}`);
                    }
                  }}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    width: "100%",
                    fontSize: "13px",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                alignItems: "center",
                background: "#f8f9fa",
                borderRadius: "20px",
                padding: "6px 12px",
                width: "250px",
                maxWidth: "250px",
                border: "1px solid #e9ecef",
                height: "36px"
              }}
            >
              <SearchOutlined style={{ color: "#6c757d", marginRight: "8px" }} />
              <input
                type="text"
                placeholder="Search packages, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    message.info(`Searching for: ${searchQuery}`);
                  }
                }}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "100%",
                  fontSize: "14px",
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
            </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: windowWidth <= 768 ? "8px" : "16px" }}>
            {windowWidth > 768 && (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'package',
                    label: 'Add Package',
                    icon: <AppstoreOutlined />,
                    onClick: () => navigate('/admin/packages')
                  },
                  {
                    key: 'offer',
                    label: 'Create Offer',
                    icon: <GiftOutlined />,
                    onClick: () => navigate('/admin/offers')
                  },
                  {
                    key: 'content',
                    label: 'Add Content',
                    icon: <FileTextOutlined />,
                    onClick: () => navigate('/admin/content')
                  }
                ]
              }}
              placement="bottomRight"
              arrow
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  background: "#ff6b35",
                  border: "none",
                  borderRadius: "20px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "600",
                }}
              >
                Quick Add
              </Button>
            </Dropdown>
            )}

            <Badge count={unreadCount} size="small" offset={[-5, 5]}>
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => setNotificationDrawerVisible(true)}
                style={{
                  width: windowWidth <= 768 ? "36px" : "40px",
                  height: windowWidth <= 768 ? "36px" : "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: windowWidth <= 768 ? "16px" : "18px"
                }}
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: windowWidth <= 768 ? "4px" : "8px",
                  cursor: "pointer",
                  padding: windowWidth <= 768 ? "4px 8px" : "6px 12px",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
                  color: "white",
                  transition: "all 0.3s ease",
                  height: windowWidth <= 768 ? "36px" : "36px",
                  maxHeight: windowWidth <= 768 ? "36px" : "36px"
                }}
              >
                <Avatar
                  size={windowWidth <= 768 ? 24 : 28}
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=ff6b35&textColor=ffffff"
                  icon={<UserOutlined />}
                  style={{
                    border: "2px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    backgroundColor: "#ff6b35",
                    color: "white"
                  }}
                />
                {windowWidth > 768 && (
                  <div>
                  <Text
                    style={{
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {adminRole}
                  </Text>
                  <br />
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "12px",
                    }}
                  >
                    {adminEmail}
                  </Text>
                </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            padding: windowWidth <= 768 ? "12px" : "24px",
            minHeight: `calc(100vh - ${windowWidth <= 768 ? '56px' : '64px'})`,
            overflow: "visible",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ width: "100%", maxWidth: "100%", minHeight: "100%" }}>
            <Outlet />
          </div>
        </Content>
      </Layout>

      {/* Notification Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600', fontSize: windowWidth <= 768 ? '16px' : '18px' }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <Button 
                type="link" 
                onClick={markAllAsRead}
                style={{ 
                  color: '#ff6b35', 
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: windowWidth <= 768 ? '13px' : '14px',
                  padding: windowWidth <= 768 ? '4px 8px' : '4px 12px'
                }}
              >
                Mark all as read
              </Button>
            )}
          </div>
        }
        placement="right"
        onClose={() => setNotificationDrawerVisible(false)}
        open={notificationDrawerVisible}
        width={windowWidth <= 768 ? window.innerWidth * 0.85 : 400}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#8c8c8c'
            }}>
              <BellOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.link) {
                    navigate(notification.link);
                    setNotificationDrawerVisible(false);
                  }
                }}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  backgroundColor: notification.read ? '#fff' : '#f6ffed',
                  transition: 'all 0.2s ease',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = notification.read ? '#fafafa' : '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = notification.read ? '#fff' : '#f6ffed';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: notification.read ? '#f0f0f0' : '#e6f7ff'
                  }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '4px'
                    }}>
                      <h4 style={{ 
                        margin: 0, 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: notification.read ? '#8c8c8c' : '#262626',
                        fontFamily: "'Poppins', sans-serif"
                      }}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#ff6b35',
                          marginLeft: '8px',
                          flexShrink: 0
                        }} />
                      )}
                    </div>
                    
                    <p style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '13px', 
                      color: notification.read ? '#8c8c8c' : '#595959',
                      lineHeight: '1.4',
                      fontFamily: "'Poppins', sans-serif"
                    }}>
                      {notification.message}
                    </p>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      fontSize: '12px',
                      color: '#8c8c8c',
                      fontFamily: "'Poppins', sans-serif"
                    }}>
                      <ClockCircleOutlined />
                      <span>{formatTime(notification.time)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Drawer>

      {/* Greeting Modal */}
      <Modal
        open={greetingModalVisible}
        onCancel={() => setGreetingModalVisible(false)}
        footer={null}
        closable={true}
        maskClosable={true}
        centered
        width={windowWidth <= 768 ? 350 : 450}
        style={{
          fontFamily: "'Poppins', sans-serif"
        }}
        styles={{
          body: {
            padding: windowWidth <= 768 ? '32px 24px' : '40px 32px',
            textAlign: 'center'
          }
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: windowWidth <= 768 ? '80px' : '100px',
            height: windowWidth <= 768 ? '80px' : '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(255, 107, 53, 0.3)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <SmileOutlined style={{
              fontSize: windowWidth <= 768 ? '40px' : '50px',
              color: '#fff'
            }} />
          </div>
          
          <Title level={2} style={{
            margin: 0,
            fontSize: windowWidth <= 768 ? '24px' : '32px',
            color: '#ff6b35',
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontWeight: '700'
          }}>
            {greetingMessage}
          </Title>
          
          <Text style={{
            fontSize: windowWidth <= 768 ? '14px' : '16px',
            color: '#6c757d',
            fontFamily: "'Poppins', sans-serif",
            lineHeight: '1.6'
          }}>
            Welcome to Admin Dashboard
          </Text>
          
          <div style={{
            width: '60px',
            height: '4px',
            background: 'linear-gradient(90deg, #ff6b35 0%, #ff8c5a 100%)',
            borderRadius: '2px',
            marginTop: '8px'
          }} />
        </div>
        
        <style>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}</style>
      </Modal>
    </Layout>
  );
};

export default AdminLayout;
