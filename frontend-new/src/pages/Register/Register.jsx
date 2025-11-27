import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Divider,
  Checkbox,
  Radio,
  Alert,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  PhoneOutlined,
  ManOutlined,
  WomanOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services";

// Import Google Font (Poppins)
const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"; 
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text: TypographyText, Paragraph } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Re-used the hero slides for the visual background
  const heroSlides = [
    {
      id: 1,
      badge: "Member Privileges",
      title: "Unlock curated journeys & concierge support",
      subtitle: "Earn credits on every itinerary, invite-only previews, and 1:1 trip designers.",
      imageUrl:
        "https://images.pexels.com/photos/34865618/pexels-photo-34865618.jpeg",
    },
    {
      id: 2,
      badge: "Seamless Planning",
      title: "Personal dashboards for travelers & families",
      subtitle: "Build multi-city plans, split payments, and sync docs securely in the cloud.",
      imageUrl:
        "https://images.pexels.com/photos/2870167/pexels-photo-2870167.jpeg",
    },
    {
      id: 3,
      badge: "Insider Experiences",
      title: "Access limited-seat retreats & cultural immersions",
      subtitle: "From Ladakh stargazing to Kerala wellness, curated with Lisaa partners.",
      imageUrl:
        "https://images.pexels.com/photos/2613015/pexels-photo-2613015.jpeg",
    },
  ];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length),
      6000
    );
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const isTablet = windowWidth <= 1024;
  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 480;
  const currentSlide = heroSlides[currentSlideIndex];

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailOtpValue, setEmailOtpValue] = useState("");
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);
  const [emailOtpSending, setEmailOtpSending] = useState(false);
  const [emailOtpVerifying, setEmailOtpVerifying] = useState(false);

  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);
  const [phoneOtpValue, setPhoneOtpValue] = useState("");
  const [phoneOtpTimer, setPhoneOtpTimer] = useState(0);
  const [phoneOtpSending, setPhoneOtpSending] = useState(false);
  const [phoneOtpVerifying, setPhoneOtpVerifying] = useState(false);

  const emailValue = Form.useWatch("email", form);
  const phoneValue = Form.useWatch("phone", form);
  const previousEmailRef = useRef(emailValue);
  const previousPhoneRef = useRef(phoneValue);

  const resetEmailOtpState = () => {
    setEmailOtpSent(false);
    setEmailOtpVerified(false);
    setEmailOtpValue("");
    setEmailOtpTimer(0);
  };

  const resetPhoneOtpState = () => {
    setPhoneOtpSent(false);
    setPhoneOtpVerified(false);
    setPhoneOtpValue("");
    setPhoneOtpTimer(0);
  };

  useEffect(() => {
    if (
      previousEmailRef.current !== emailValue &&
      (emailOtpSent || emailOtpVerified)
    ) {
      resetEmailOtpState();
    }
    previousEmailRef.current = emailValue;
  }, [emailValue, emailOtpSent, emailOtpVerified]);

  useEffect(() => {
    if (
      previousPhoneRef.current !== phoneValue &&
      (phoneOtpSent || phoneOtpVerified)
    ) {
      resetPhoneOtpState();
    }
    previousPhoneRef.current = phoneValue;
  }, [phoneValue, phoneOtpSent, phoneOtpVerified]);

  useEffect(() => {
    if (emailOtpTimer <= 0) return;
    const timer = setInterval(() => {
      setEmailOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [emailOtpTimer]);

  useEffect(() => {
    if (phoneOtpTimer <= 0) return;
    const timer = setInterval(() => {
      setPhoneOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [phoneOtpTimer]);

  const formatTimer = (value = 0) => {
    const minutes = String(Math.floor(value / 60)).padStart(2, "0");
    const seconds = String(value % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleSendEmailOtp = async () => {
    const value = (emailValue || "").trim().toLowerCase();
    if (!value) {
      message.error("Please enter your email address first");
      return;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(value)) {
      message.error("Please enter a valid email address");
      return;
    }
    setEmailOtpSending(true);
    try {
      const response = await authService.requestRegistrationOtp({
        identifier: value,
        type: "email",
      });
      message.success(response.message || "OTP sent to your email");
      setEmailOtpSent(true);
      setEmailOtpVerified(false);
      setEmailOtpTimer(60);
    } catch (error) {
      message.error(error.message || "Failed to send email OTP");
    } finally {
      setEmailOtpSending(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    const value = (emailValue || "").trim().toLowerCase();
    if (!value) {
      message.error("Please enter your email address first");
      return;
    }
    if (!emailOtpValue || emailOtpValue.length !== 6) {
      message.error("Please enter the 6-digit email OTP");
      return;
    }
    setEmailOtpVerifying(true);
    try {
      const response = await authService.verifyRegistrationOtp({
        identifier: value,
        otp: emailOtpValue,
        type: "email",
      });
      message.success(response.message || "Email verified successfully");
      setEmailOtpVerified(true);
    } catch (error) {
      message.error(error.message || "Failed to verify email OTP");
    } finally {
      setEmailOtpVerifying(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    const value = (phoneValue || "").replace(/\D/g, "");
    if (!value) {
      message.error("Please enter your mobile number first");
      return;
    }
    if (value.length !== 10) {
      message.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setPhoneOtpSending(true);
    try {
      const response = await authService.requestRegistrationOtp({
        identifier: value,
        type: "phone",
      });
      message.success(response.message || "OTP sent to your mobile number");
      setPhoneOtpSent(true);
      setPhoneOtpVerified(false);
      setPhoneOtpTimer(60);
    } catch (error) {
      message.error(error.message || "Failed to send mobile OTP");
    } finally {
      setPhoneOtpSending(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    const value = (phoneValue || "").replace(/\D/g, "");
    if (!value) {
      message.error("Please enter your mobile number first");
      return;
    }
    if (!phoneOtpValue || phoneOtpValue.length !== 6) {
      message.error("Please enter the 6-digit mobile OTP");
      return;
    }
    setPhoneOtpVerifying(true);
    try {
      const response = await authService.verifyRegistrationOtp({
        identifier: value,
        otp: phoneOtpValue,
        type: "phone",
      });
      message.success(response.message || "Mobile number verified successfully");
      setPhoneOtpVerified(true);
    } catch (error) {
      message.error(error.message || "Failed to verify mobile OTP");
    } finally {
      setPhoneOtpVerifying(false);
    }
  };

  // --- STYLES COPIED FROM LOGIN COMPONENT (MODIFIED FOR SINGLE COLUMN) ---
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
      backgroundImage: `url(${currentSlide.imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      minHeight: "100%", 
    },
    heroOverlay: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(120deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)", 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: isMobile ? '40px 20px' : '60px 48px',
    },
    heroDotNav: {
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
    heroTitle: {
      color: '#fff',
      fontSize: isMobile ? 26 : 36,
      fontWeight: 700,
      margin: "16px 0 8px",
      lineHeight: 1.2,
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
      padding: isSmallMobile ? "28px 20px" : "36px 32px", 
    },
    // BRANDING STYLES 
    brandBlock: {
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      width: "100%",
      maxWidth: 520, 
      marginBottom: 12, 
    },
    logo: {
      width: 70, 
      height: 70, 
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
        fontSize: isMobile ? 36 : 42, 
        fontWeight: 900, 
        color: "#1f1f1f", 
        letterSpacing: "-1px", 
        lineHeight: 1,
        textTransform: 'uppercase',
    },
    brandIAAText: {
        fontSize: isMobile ? 36 : 42, 
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
        fontSize: isMobile ? 12 : 14, 
        color: "#1f1f1f", 
        letterSpacing: isMobile ? "2px" : "3px", 
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #ff6b35', 
        lineHeight: 1.2,
        paddingBottom: 2,
    },
    brandSubTitleAccent: { 
        margin: 0,
        marginTop: 4, 
        fontWeight: 600,
        fontSize: isMobile ? 12 : 14, 
        color: "#1f1f1f", 
        letterSpacing: isMobile ? "2px" : "3px", 
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 12, 
    },
    // NOTE: styles.gridTwo is no longer used for form items
    // gridTwo: { ... }, 
    inputStyle: {
        borderRadius: "12px", 
        padding: "12px 16px", 
        height: '50px' 
    },
    otpActionRow: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        marginBottom: 8,
    },
    otpButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
    },
    otpVerifyContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 8,
    },
    otpTimerText: {
        fontSize: 13,
        color: "#8c8c8c",
        textAlign: "right",
    },
    buttonStyle: {
        width: "100%",
        height: "52px", 
        borderRadius: "14px",
        backgroundColor: "#ff7a45",
        borderColor: "#ff7a45",
        fontWeight: 600,
        fontSize: "18px", 
        marginTop: '8px', 
    },
    googleButton: {
        width: "100%",
        height: "50px", 
        borderRadius: "12px",
        border: "1px solid #dadce0",
        fontWeight: 600,
        fontSize: "16px",
    },
    note: {
      padding: "14px",
      borderRadius: 14,
      border: "1px solid #f4f4f7",
      background: "#f8f9fb",
    },
  };
  // --- END STYLES COPY ---

  const onFinish = async (values) => {
    setLoading(true);

    const normalizedEmail = values.email?.trim().toLowerCase();
    const normalizedPhone = values.phone ? values.phone.replace(/\D/g, "") : undefined;

    if (!emailOtpVerified) {
      message.warning("Please verify your email with OTP before creating the account.");
      setLoading(false);
      return;
    }

    if (normalizedPhone && !phoneOtpVerified) {
      message.warning("Please verify your mobile number with OTP before creating the account.");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        name: values.fullName,
        email: normalizedEmail,
        password: values.password,
        phone: normalizedPhone || undefined,
        gender: values.gender || 'male',
      });
      
      message.success(`Registration successful! Welcome ${response.user.name}!`);
      resetEmailOtpState();
      resetPhoneOtpState();
      
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.message || "Registration failed. Please try again.";
      message.error(errorMessage);
      if (errorMessage.toLowerCase().includes('email')) {
        form.setFields([{ name: 'email', errors: [errorMessage] }]);
      } else if (errorMessage.toLowerCase().includes('mobile') || errorMessage.toLowerCase().includes('phone')) {
        form.setFields([{ name: 'phone', errors: [errorMessage] }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCallback = async (token) => {
    try {
      if (!token) {
        throw new Error('No access token received from Google');
      }
      
      // Use the existing authService.googleLogin to handle registration/login on the backend
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
      const errorMessage = error.response?.data?.message || error.message || 'Google registration failed. Please try again.';
      message.error(errorMessage);
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    if (provider !== 'Google') {
        message.info(`${provider} registration coming soon!`);
        return;
    }
    
    setLoading(true);

    try {
        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        
        if (!googleClientId || googleClientId === 'YOUR_GOOGLE_CLIENT_ID') {
            message.warning('Google login is not configured. Please contact support or use email registration.');
            setLoading(false);
            return;
        }

        // 1. Load Google OAuth script if not already loaded
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

        if (!window.google?.accounts) {
            throw new Error('Google OAuth library not loaded properly');
        }

        // 2. Initialize and request access token
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

        tokenClient.requestAccessToken();
        
    } catch (error) {
        console.error('Google registration error:', error);
        message.error(error.message || 'Google registration failed. Please try again.');
        setLoading(false);
    }
  };


  return (
    <div style={styles.page}>
      <div style={styles.layout}>
        {/* HERO SECTION - LOGIN PAGE STYLES */}
        <div style={styles.heroSection}>
          <div style={styles.heroOverlay}>
             {/* Re-using simplified hero content from Login's aesthetic */}
             <Title level={1} style={styles.heroTitle}>
               {currentSlide.title}
             </Title>
             <Paragraph style={styles.heroSubtitle}>{currentSlide.subtitle}</Paragraph>
          </div>
          <div style={styles.heroDotNav}>
            {heroSlides.map((slide, index) => (
              <span
                key={slide.id}
                style={styles.heroDot(index === currentSlideIndex)}
                onClick={() => setCurrentSlideIndex(index)}
              />
            ))}
          </div>
        </div>
        {/* END HERO SECTION */}

        <div style={styles.formPanel}>
          {/* BRAND BLOCK (LSIAA HEADING) - COPIED FROM LOGIN */}
          <div style={styles.brandBlock}>
            {/* Logo */}
            <img
              src="https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_200/v1691154856/samples/people/boy-snow-hoodie.jpg"
              alt="Lisaa logo"
              style={styles.logo}
            />
            {/* Main Text Wrapper: LSIAA + Sub Text */}
            <div style={styles.brandMainTextWrapper}>
                {/* L S (UMS U M equivalent) */}
                <div style={styles.brandLsiaaText}>
                    <span style={styles.brandLSText}>LS</span>
                    <span style={styles.brandIAAText}>IAA</span>
                </div>
                {/* Stacked Sub Text Container: TOURS & / TRAVELS */}
                <div style={styles.brandSubTextContainer}>
                    <Title level={4} style={styles.brandSubTitle}>
                        TOURS &
                    </Title>
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
                  Create Account
                </Title>
                <TypographyText style={{ color: "#8c8c8c" }}>
                  Quick setup. Only basic information needed.
                </TypographyText>
              </div>

              <Button
                icon={<GoogleOutlined />}
                onClick={() => handleSocialLogin("Google")}
                // Show loading state on the button itself
                loading={loading}
                style={styles.googleButton}
              >
                {loading ? "Loading Google..." : "Continue with Google"}
              </Button>

              <Divider plain style={{ margin: '16px 0' }}>or register with email</Divider>

              <Form
                form={form}
                name="register"
                onFinish={onFinish}
                layout="vertical"
                size="large"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {/* Full Name and Email - NOW IN COLUMN */}
                <div>
                  <Form.Item
                    name="fullName"
                    label={<TypographyText style={{ fontWeight: 500 }}>Full Name</TypographyText>}
                    rules={[{ required: true, message: "Please enter your full name!" }]}
                    style={{ marginBottom: '8px' }} 
                  >
                    <Input 
                      prefix={<UserOutlined style={{ color: "#ff6b35" }} />} 
                      placeholder="Riya Sharma" 
                      style={styles.inputStyle}
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label={<TypographyText style={{ fontWeight: 500 }}>Email Address</TypographyText>}
                    rules={[
                      { required: true, message: "Please enter your email!" },
                      { type: "email", message: "Please enter a valid email!" },
                    ]}
                    style={{ marginBottom: '8px' }} 
                  >
                    <Input 
                      prefix={<MailOutlined style={{ color: "#ff6b35" }} />} 
                      placeholder="you@email.com" 
                      style={styles.inputStyle}
                    />
                  </Form.Item>
                  {!emailOtpSent && (
                    <div style={styles.otpActionRow}>
                      <Button
                        style={styles.otpButton}
                        onClick={handleSendEmailOtp}
                        type="default"
                        disabled={emailOtpSending || !emailValue}
                        loading={emailOtpSending}
                      >
                        Send Email OTP
                      </Button>
                    </div>
                  )}
                  {emailOtpSent && !emailOtpVerified && (
                    <div style={styles.otpVerifyContainer}>
                      <Input.OTP
                        length={6}
                        value={emailOtpValue}
                        onChange={(val) =>
                          setEmailOtpValue(val.replace(/\D/g, "").slice(0, 6))
                        }
                        disabled={emailOtpVerified}
                        inputType="numeric"
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <Button
                          type="primary"
                          onClick={handleVerifyEmailOtp}
                          loading={emailOtpVerifying}
                          style={{ ...styles.otpButton, width: "100%" }}
                        >
                          Verify Email OTP
                        </Button>
                        <Button
                          type="default"
                          onClick={handleSendEmailOtp}
                          disabled={emailOtpTimer > 0 || emailOtpSending}
                          loading={emailOtpSending}
                          style={{ ...styles.otpButton, width: "100%" }}
                        >
                          {emailOtpTimer > 0
                            ? `Resend in ${formatTimer(emailOtpTimer)}`
                            : "Resend OTP"}
                        </Button>
                      </div>
                      <TypographyText style={styles.otpTimerText}>
                        {emailOtpTimer > 0
                          ? "Please wait before requesting a new OTP."
                          : "Didn't get the code? Tap resend to get another OTP."}
                      </TypographyText>
                    </div>
                  )}
                  {emailOtpVerified && (
                    <Alert
                      type="success"
                      showIcon
                      message="Email verified successfully"
                      style={{ marginBottom: 8 }}
                    />
                  )}
                </div>
                {/* END Full Name and Email */}

                {/* Phone and Gender - NOW IN COLUMN */}
                <div>
                  <Form.Item
                    name="phone"
                    label={<TypographyText style={{ fontWeight: 500 }}>WhatsApp Number</TypographyText>}
                    rules={[
                      { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number!" },
                    ]}
                    style={{ marginBottom: '8px' }} 
                  >
                    <Input 
                      prefix={<PhoneOutlined style={{ color: "#ff6b35" }} />} 
                      placeholder="10-digit mobile (optional)" 
                      maxLength={10} 
                      style={styles.inputStyle}
                    />
                  </Form.Item>
                  {!phoneOtpSent && (
                    <div style={styles.otpActionRow}>
                      <Button
                        style={styles.otpButton}
                        onClick={handleSendPhoneOtp}
                        type="default"
                        disabled={
                          phoneOtpSending ||
                          !phoneValue ||
                          phoneValue.replace(/\D/g, "").length !== 10
                        }
                        loading={phoneOtpSending}
                      >
                        Send Mobile OTP
                      </Button>
                    </div>
                  )}
                  {phoneOtpSent && !phoneOtpVerified && (
                    <div style={styles.otpVerifyContainer}>
                      <Input.OTP
                        length={6}
                        value={phoneOtpValue}
                        onChange={(val) =>
                          setPhoneOtpValue(val.replace(/\D/g, "").slice(0, 6))
                        }
                        disabled={phoneOtpVerified}
                        inputType="numeric"
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <Button
                          type="primary"
                          onClick={handleVerifyPhoneOtp}
                          loading={phoneOtpVerifying}
                          style={{ ...styles.otpButton, width: "100%" }}
                        >
                          Verify Mobile OTP
                        </Button>
                        <Button
                          type="default"
                          onClick={handleSendPhoneOtp}
                          disabled={phoneOtpTimer > 0 || phoneOtpSending}
                          loading={phoneOtpSending}
                          style={{ ...styles.otpButton, width: "100%" }}
                        >
                          {phoneOtpTimer > 0
                            ? `Resend in ${formatTimer(phoneOtpTimer)}`
                            : "Resend OTP"}
                        </Button>
                      </div>
                      <TypographyText style={styles.otpTimerText}>
                        {phoneOtpTimer > 0
                          ? "Please wait before requesting a new OTP."
                          : "Didn't get the code? Tap resend to get another OTP."}
                      </TypographyText>
                    </div>
                  )}
                  {phoneOtpVerified && (
                    <Alert
                      type="success"
                      showIcon
                      message="Mobile number verified successfully"
                      style={{ marginBottom: 8 }}
                    />
                  )}

                  <Form.Item
                    name="gender"
                    label={<TypographyText style={{ fontWeight: 500 }}>Gender</TypographyText>}
                    initialValue="male"
                    style={{ marginBottom: '8px' }} 
                  >
                    <Radio.Group 
                        buttonStyle="solid" 
                        style={{ display: "flex", gap: 8, height: '50px', alignItems: 'center' }}
                    >
                      <Radio.Button value="male" style={{ flex: 1, textAlign: "center", height: '40px', lineHeight: '40px', borderRadius: '8px' }}>
                        <ManOutlined /> Male
                      </Radio.Button>
                      <Radio.Button value="female" style={{ flex: 1, textAlign: "center", height: '40px', lineHeight: '40px', borderRadius: '8px' }}>
                        <WomanOutlined /> Female
                      </Radio.Button>
                      <Radio.Button value="other" style={{ flex: 1, textAlign: "center", height: '40px', lineHeight: '40px', borderRadius: '8px' }}>
                        <UserOutlined /> Other
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </div>
                {/* END Phone and Gender */}

                {/* Password and Confirm Password - NOW IN COLUMN */}
                <div>
                  <Form.Item
                      name="password"
                      label={<TypographyText style={{ fontWeight: 500 }}>Password</TypographyText>}
                      rules={[
                          { required: true, message: "Please enter your password!" },
                          { min: 6, message: "Password must be at least 6 characters!" },
                      ]}
                      style={{ marginBottom: '8px' }} 
                  >
                      <Input.Password
                          prefix={<LockOutlined style={{ color: "#ff6b35" }} />}
                          placeholder="Create a password"
                          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                          style={styles.inputStyle}
                      />
                  </Form.Item>

                  <Form.Item
                      name="confirmPassword"
                      label={<TypographyText style={{ fontWeight: 500 }}>Confirm Password</TypographyText>}
                      rules={[
                          { required: true, message: "Please confirm your password!" },
                          ({ getFieldValue }) => ({
                              validator(_, value) {
                                  if (!value || getFieldValue("password") === value) {
                                      return Promise.resolve();
                                  }
                                  return Promise.reject(new Error("Passwords do not match!"));
                              },
                          }),
                      ]}
                      style={{ marginBottom: '8px' }} 
                  >
                      <Input.Password
                          prefix={<LockOutlined style={{ color: "#ff6b35" }} />}
                          placeholder="Confirm password"
                          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                          style={styles.inputStyle}
                      />
                  </Form.Item>
                </div>
                {/* END Password and Confirm Password */}

                 

                <Button
                  type="primary"
                  htmlType="submit"
                  // Use separate loading state for form submission to avoid conflict with Google
                  loading={loading && !window.google} 
                  style={styles.buttonStyle}
                >
                  {loading && !window.google ? "Creating Account..." : "Create Account"}
                </Button>

                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <TypographyText style={{ color: "#666" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#ff6b35", fontWeight: 600 }}>
                      Sign In
                    </Link>
                  </TypographyText>
                </div>

                 
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;