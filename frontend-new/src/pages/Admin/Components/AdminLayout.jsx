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
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

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

  // Real-time notification system
  useEffect(() => {
    // Initialize with some sample notifications
    const initialNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'New Booking Received',
        message: 'John Doe booked Kerala Backwaters Paradise',
        time: new Date(Date.now() - 5 * 60000), // 5 minutes ago
        read: false,
        icon: <ShoppingCartOutlined />
      },
      {
        id: 2,
        type: 'info',
        title: 'Customer Inquiry',
        message: 'Sarah Wilson inquired about Rajasthan Heritage Tour',
        time: new Date(Date.now() - 15 * 60000), // 15 minutes ago
        read: false,
        icon: <MessageOutlined />
      },
      {
        id: 3,
        type: 'warning',
        title: 'Payment Pending',
        message: 'Booking BK001 payment is pending for 2 days',
        time: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        read: false,
        icon: <ExclamationCircleOutlined />
      },
      {
        id: 4,
        type: 'success',
        title: 'Package Updated',
        message: 'Kerala Backwaters package has been updated',
        time: new Date(Date.now() - 60 * 60000), // 1 hour ago
        read: true,
        icon: <CheckCircleOutlined />
      },
      {
        id: 5,
        type: 'info',
        title: 'System Maintenance',
        message: 'Scheduled maintenance completed successfully',
        time: new Date(Date.now() - 120 * 60000), // 2 hours ago
        read: true,
        icon: <InfoCircleOutlined />
      }
    ];

    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter(n => !n.read).length);

    // Simulate real-time notifications
    const notificationInterval = setInterval(() => {
      const notificationTypes = [
        {
          type: 'success',
          title: 'New Booking',
          message: 'Customer booked a tour package',
          icon: <ShoppingCartOutlined />
        },
        {
          type: 'info',
          title: 'New Inquiry',
          message: 'Customer submitted an inquiry',
          icon: <MessageOutlined />
        },
        {
          type: 'warning',
          title: 'Payment Alert',
          message: 'Payment is pending for a booking',
          icon: <ExclamationCircleOutlined />
        },
        {
          type: 'success',
          title: 'Review Received',
          message: 'Customer left a 5-star review',
          icon: <CheckCircleOutlined />
        }
      ];

      // Randomly generate notifications (30% chance every 30 seconds)
      if (Math.random() < 0.3) {
        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        const newNotification = {
          id: Date.now(),
          type: randomNotification.type,
          title: randomNotification.title,
          message: randomNotification.message,
          time: new Date(),
          read: false,
          icon: randomNotification.icon
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only last 10
        setUnreadCount(prev => prev + 1);

        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: '/favicon.ico'
          });
        }
      }
    }, 30000); // Check every 30 seconds

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
    { key: "profile", icon: <UserOutlined />, label: "Profile" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
    { type: "divider" },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout", onClick: handleLogout },
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
          <Title level={4} style={{ margin: 0, color: "#ff6b35" }}>
            Admin Panel
          </Title>
        </div>
      }
      placement="left"
      onClose={() => setMobileDrawerVisible(false)}
      open={mobileDrawerVisible}
      width={280}
      styles={{ body: { padding: 0 } }}
    >
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
            padding: "0 24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderBottom: "1px solid #f0f0f0",
            position: "sticky",
            top: 0,
            zIndex: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
            minHeight: "64px",
            maxHeight: "64px",
            overflow: "hidden",
            width: "100%"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {windowWidth <= 768 && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileDrawerVisible(true)}
                style={{ fontSize: "18px" }}
              />
            )}
            <div
              style={{
                display: windowWidth <= 768 ? "none" : "flex",
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
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                background: "#ff6b35",
                border: "none",
                borderRadius: "20px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "600",
                display: windowWidth <= 768 ? "none" : "flex",
              }}
            >
              Quick Add
            </Button>

            <Badge count={unreadCount} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => setNotificationDrawerVisible(true)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
                  color: "white",
                  transition: "all 0.3s ease",
                  height: "36px",
                  maxHeight: "36px"
                }}
              >
                <Avatar
                  size={28}
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=ff6b35&textColor=ffffff"
                  icon={<UserOutlined />}
                  style={{
                    border: "2px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    backgroundColor: "#ff6b35",
                    color: "white"
                  }}
                />
                <div style={{ display: windowWidth <= 768 ? "none" : "block" }}>
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
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            padding: "24px",
            minHeight: "calc(100vh - 64px)",
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
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <Button 
                type="link" 
                onClick={markAllAsRead}
                style={{ color: '#ff6b35', fontFamily: "'Poppins', sans-serif" }}
              >
                Mark all as read
              </Button>
            )}
          </div>
        }
        placement="right"
        onClose={() => setNotificationDrawerVisible(false)}
        open={notificationDrawerVisible}
        width={400}
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
                onClick={() => markAsRead(notification.id)}
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
    </Layout>
  );
};

export default AdminLayout;
