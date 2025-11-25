import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Divider,
  Checkbox,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services";

// Import Google Font (Poppins)
const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"; 
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text: TypographyText } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const heroSlides = [
    "https://images.pexels.com/photos/2870167/pexels-photo-2870167.jpeg",
    "https://images.pexels.com/photos/2613015/pexels-photo-2613015.jpeg",
    "https://images.pexels.com/photos/34865618/pexels-photo-34865618.jpeg",
  ];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const isTablet = windowWidth <= 1024;
  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 480;
  const currentSlide = heroSlides[currentSlideIndex];

  const styles = {
    page: {
      height: "100vh", 
      display: "flex",
      background: "#fcefed",
      fontFamily: "'Poppins', sans-serif",
      overflow: "hidden", 
    },
    layout: {
      flex: 1,
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      minHeight: '100%', 
    },
    heroSection: {
      backgroundImage: `url(${currentSlide})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      minHeight: "100%", 
    },
    heroOverlay: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(120deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)", 
    },
    heroDots: {
      position: "absolute",
      top: 30, 
      right: 30, 
      display: "flex",
      flexDirection: "row", 
      gap: 8,
    },
    heroDot: (active) => ({
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: active ? "#ff8a3d" : "rgba(255,255,255,0.5)",
      cursor: "pointer",
      transition: "all 0.3s",
    }),
    heroContent: {
      position: "absolute",
      bottom: isMobile ? 40 : 60,
      left: isMobile ? 20 : 48,
      right: 40,
      color: "#fff",
    },
    heroTitle: {
      fontSize: isMobile ? 26 : 36,
      fontWeight: 700,
      marginBottom: 8,
    },
    heroSubtitle: {
      color: "rgba(255,255,255,0.85)",
      fontSize: isMobile ? 14 : 16,
      lineHeight: 1.6,
    },
    formPanel: {
      background: "#fcefed",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      // Retained 40px padding for vertical balance
      padding: isSmallMobile ? "24px 20px" : isMobile ? "32px 32px" : "40px", 
      maxHeight: '100vh', 
      overflowY: 'auto', 
    },
    cardShell: {
      width: "100%",
      maxWidth: 520, 
      background: "#fff",
      borderRadius: 30,
      boxShadow: "0 25px 80px rgba(255,138,61,0.25)",
      // Retained 36px card padding
      padding: isSmallMobile ? "28px 20px" : "36px 32px", 
    },
    brandBlock: {
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      width: "100%",
      maxWidth: 520, 
      // Retained 12px margin bottom for separation
      marginBottom: 12, 
    },
    logo: {
      width: 70, // Increased Logo Size (from 60)
      height: 70, // Increased Logo Size (from 60)
      borderRadius: "18px",
      objectFit: "cover",
      marginRight: "16px",
      flexShrink: 0,
    },
    brandMainTextWrapper: {
        display: "flex",
        alignItems: "center", 
        lineHeight: 1, 
    },
    brandLsiaaText: {
        display: 'flex',
        alignItems: 'flex-start',
        lineHeight: 1,
        marginRight: '8px', 
    },
    brandLSText: {
        fontSize: isMobile ? 36 : 42, // Increased Font Size (from 36)
        fontWeight: 900, 
        color: "#1f1f1f", 
        letterSpacing: "-1px", 
        lineHeight: 1,
        textTransform: 'uppercase',
    },
    brandIAAText: {
        fontSize: isMobile ? 36 : 42, // Increased Font Size (from 36)
        fontWeight: 900, 
        color: "#ff6b35", 
        letterSpacing: "-1px", 
        marginLeft: isMobile ? '2px' : '4px',
        marginRight: '0',
    },
    brandSubTextContainer: { 
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingTop: isMobile ? 1 : 2, 
    },
    brandSubTitle: { 
        margin: 0,
        fontWeight: 500, 
        fontSize: isMobile ? 12 : 14, // Slightly increased sub-title font size for visibility
        color: "#1f1f1f", 
        letterSpacing: isMobile ? "2px" : "3px", // Increased letter spacing
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #ff6b35', 
        lineHeight: 1.2,
        paddingBottom: 2,
    },
    brandSubTitleAccent: { 
        margin: 0,
        marginTop: 4, // Slightly increased margin top for separation
        fontWeight: 600,
        fontSize: isMobile ? 12 : 14, // Slightly increased sub-title font size for visibility
        color: "#1f1f1f", 
        letterSpacing: isMobile ? "2px" : "3px", // Increased letter spacing
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 12, 
    },
    formMeta: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      gap: 8, 
    },
    footerText: {
      textAlign: "center",
      marginTop: 10, // Slightly increased margin top
    },
    googleButton: {
      width: "100%",
      height: "50px", // Increased button height (from 45)
      borderRadius: "12px",
      border: "1px solid #dadce0",
      fontWeight: 600,
      fontSize: "16px",
    },
  };

  // ... (All handler functions remain the same - no change in logic)
  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      const rawIdentifier = values.identifier?.trim() || "";
      const normalizedIdentifier = rawIdentifier.includes("@")
        ? rawIdentifier.toLowerCase()
        : rawIdentifier.replace(/\D/g, "");

      const response = await authService.login({
        identifier: normalizedIdentifier,
        password: values.password,
      });
      
      message.success(`Welcome back, ${response.user.name || 'User'}!`);
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      message.error(error.message || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      if (!googleClientId || googleClientId === 'YOUR_GOOGLE_CLIENT_ID') {
        message.warning('Google login is not configured. Please contact support or use email login.');
        setLoading(false);
        return;
      }

      // Load Google OAuth script if not already loaded
      if (!window.google) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = resolve;
          script.onerror = () => {
            reject(new Error('Failed to load Google OAuth script'));
          };
          document.body.appendChild(script);
        });
      }

      // Initialize Google Sign-In
      if (!window.google?.accounts) {
        throw new Error('Google OAuth library not loaded properly');
      }

      // Use OAuth2 token client for direct authentication
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'email profile',
        callback: async (response) => {
          if (response.error) {
            console.error('Google OAuth error:', response.error);
            message.error(response.error === 'popup_closed' 
              ? 'Google sign-in was cancelled' 
              : 'Google sign-in failed. Please try again.');
            setLoading(false);
            return;
          }
          
          if (response.access_token) {
            await handleGoogleCallback(response.access_token);
          } else {
            message.error('Failed to get access token from Google');
            setLoading(false);
          }
        },
      });

      // Request access token
      tokenClient.requestAccessToken();
      
    } catch (error) {
      console.error('Google login error:', error);
      message.error(error.message || 'Google login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleCallback = async (token) => {
    try {
      if (!token) {
        throw new Error('No access token received from Google');
      }
      
      const response = await authService.googleLogin(token);
      
      if (response && response.user) {
        message.success(`Welcome, ${response.user.name || 'User'}!`);
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Google login callback error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Google login failed. Please try again.';
      message.error(errorMessage);
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    if (provider === 'Google') {
      handleGoogleLogin();
    }
  };


  return (
    <div style={styles.page}>
      <div style={styles.layout}>
        <div style={styles.heroSection}>
          <div style={styles.heroOverlay} />
          <div style={styles.heroDots}>
            {heroSlides.map((_, index) => (
              <span
                key={index}
                style={styles.heroDot(index === currentSlideIndex)}
                onClick={() => setCurrentSlideIndex(index)}
              />
            ))}
          </div>
            
        </div>

        <div style={styles.formPanel}>
          {/* BRAND BLOCK (LSIAA HEADING) */}
          <div style={styles.brandBlock}>
            {/* Logo */}
            <img
              src="https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_200/v1691154856/samples/people/boy-snow-hoodie.jpg"
              alt="Lisaa logo"
              style={styles.logo}
            />
            {/* Main Text Wrapper: LSIAA + Sub Text */}
            <div style={styles.brandMainTextWrapper}>
                {/* LSIAA Block */}
                <div style={styles.brandLsiaaText}>
                    {/* L S (UMS U M equivalent) */}
                    <span style={styles.brandLSText}>LS</span>
                    {/* IAA (UMS S equivalent) */}
                    <span style={styles.brandIAAText}>IAA</span>
                </div>
                {/* Stacked Sub Text Container: TOURS & / TRAVELS */}
                <div style={styles.brandSubTextContainer}>
                    {/* TOURS & (UNIVERSITY equivalent) */}
                    <Title level={4} style={styles.brandSubTitle}>
                        TOURS &
                    </Title>
                    {/* TRAVELS (MANAGEMENT SYSTEM equivalent) */}
                    <Title level={4} style={styles.brandSubTitleAccent}>
                        TRAVELS
                    </Title>
                </div>
            </div>
          </div>
          {/* BRAND BLOCK ENDS HERE */}

          <div style={styles.cardShell}>
            <div style={styles.formContainer}>
              <div style={{ textAlign: "center" }}>
                <Title level={2} style={{ margin: 0, color: "#1f1f1f" }}>
                  Log in
                </Title>
              </div>

              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="large"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <Form.Item
                  name="identifier"
                  label={<TypographyText style={{ fontWeight: 500 }}>Email or Mobile Number</TypographyText>}
                  rules={[
                    { required: true, message: "Please enter your email or mobile number!" },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const trimmed = value.trim();
                        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                        const digits = trimmed.replace(/\D/g, "");
                        if (emailRegex.test(trimmed.toLowerCase()) || digits.length === 10) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Enter a valid email address or 10-digit mobile number")
                        );
                      },
                    },
                  ]}
                  // Retained 8px space
                  style={{ marginBottom: '8px' }} 
                >
                  <Input
                    prefix={<MailOutlined style={{ color: "#ff6b35" }} />}
                    placeholder="Please enter your email or mobile number"
                    // Increased input height/padding
                    style={{ borderRadius: "12px", padding: "12px 16px", height: '50px' }} 
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<TypographyText style={{ fontWeight: 500 }}>Password</TypographyText>}
                  rules={[{ required: true, message: "Please enter your password!" }]}
                  // Retained 8px space
                  style={{ marginBottom: '8px' }} 
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: "#ff6b35" }} />}
                    placeholder="Enter your password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    // Increased input height/padding
                    style={{ borderRadius: "12px", padding: "12px 16px", height: '50px' }} 
                  />
                </Form.Item>

                <div style={styles.formMeta}>
                  <Form.Item name="remember" valuePropName="checked" style={{ margin: 0 }}>
                    <Checkbox style={{ color: "#666" }}>Remember me</Checkbox>
                  </Form.Item>
                  <Button
                    type="link"
                    style={{ color: "#ff6b35", padding: 0 }}
                    onClick={() => navigate("/change-password")}
                  >
                    Forgot password?
                  </Button>
                </div>
                
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    width: "100%",
                    height: "52px", // Increased button height (from 45)
                    borderRadius: "14px",
                    backgroundColor: "#ff7a45",
                    borderColor: "#ff7a45",
                    fontWeight: 600,
                    fontSize: "18px", // Increased font size
                    marginTop: '8px', // Increased margin top for separation
                  }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </Form>

              <Divider plain style={{ margin: '10px 0' }}>or</Divider> 

              <Button
                icon={<GoogleOutlined />}
                onClick={() => handleSocialLogin("Google")}
                style={styles.googleButton}
              >
                Continue with Google
              </Button>

              <div style={styles.footerText}>
                <TypographyText style={{ color: "#666" }}>
                  New to Lisaa?{" "}
                  <Link to="/register" style={{ color: "#ff6b35", fontWeight: 600 }}>
                    Create account
                  </Link>
                </TypographyText>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;