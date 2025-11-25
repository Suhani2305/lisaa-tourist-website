import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Typography,
  message,
  Space,
  Tabs,
  Alert,
  Divider,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  KeyOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services";

const { Title, Text } = Typography;

const heroSlides = [
  "https://images.pexels.com/photos/2870167/pexels-photo-2870167.jpeg",
  "https://images.pexels.com/photos/2613015/pexels-photo-2613015.jpeg",
  "https://images.pexels.com/photos/34865618/pexels-photo-34865618.jpeg",
];

const ChangePassword = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [resetMethod, setResetMethod] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [normalizedIdentifier, setNormalizedIdentifier] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetRequestLoading, setResetRequestLoading] = useState(false);
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [identifierHint, setIdentifierHint] = useState(null);
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
      minHeight: "100vh",
      display: "flex",
      background: "#fcefed",
      fontFamily: "'Poppins', sans-serif",
      overflow: "hidden",
    },
    layout: {
      flex: 1,
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      minHeight: "100%",
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
      background: "linear-gradient(120deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.7) 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: isMobile ? "40px 24px" : "60px 48px",
    },
    heroText: {
      color: "#fff",
      maxWidth: 420,
    },
    heroTitle: {
      fontSize: isMobile ? 30 : 36,
      fontWeight: 700,
      marginBottom: 12,
      lineHeight: 1.2,
    },
    heroSubtitle: {
      color: "rgba(255,255,255,0.85)",
      fontSize: isMobile ? 15 : 16,
      lineHeight: 1.6,
    },
    heroDotNav: {
      position: "absolute",
      top: 24,
      right: 24,
      display: "flex",
      gap: 8,
    },
    heroDot: (active) => ({
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: active ? "#ff8a3d" : "rgba(255,255,255,0.4)",
      cursor: "pointer",
      border: "1px solid #fff",
    }),
    formPanel: {
      background: "#fcefed",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: isSmallMobile ? "24px 20px" : isMobile ? "32px 32px" : "100px 40px",
      maxHeight: "100vh",
      overflowY: "auto",
    },
    cardShell: {
      width: "100%",
      maxWidth: 520,
      background: "#fff",
      borderRadius: 30,
      boxShadow: "0 25px 80px rgba(255,138,61,0.25)",
      padding: isSmallMobile ? "28px 20px" : "36px 32px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
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
      display: "flex",
      alignItems: "flex-start",
      lineHeight: 1,
      marginRight: "8px",
    },
    brandLSText: {
      fontSize: isMobile ? 36 : 42,
      fontWeight: 900,
      color: "#1f1f1f",
      letterSpacing: "-1px",
      lineHeight: 1,
      textTransform: "uppercase",
    },
    brandIAAText: {
      fontSize: isMobile ? 36 : 42,
      fontWeight: 900,
      color: "#ff6b35",
      letterSpacing: "-1px",
      marginLeft: isMobile ? "2px" : "4px",
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
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      borderBottom: "1px solid #ff6b35",
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
      textTransform: "uppercase",
      lineHeight: 1.2,
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
    },
    sectionDescription: {
      color: "#666",
      fontSize: 14,
      lineHeight: 1.6,
    },
    buttonPrimary: {
      width: "100%",
      height: 52,
      
      backgroundColor: "#ff7a45",
      borderColor: "#ff7a45",
      fontWeight: 600,
      fontSize: 18,
    },
    buttonSecondary: {
      width: "100%",
      borderRadius: 14,
      fontWeight: 600,
      fontSize: 16,
      height: 48,
    },
    inputStyle: {
      borderRadius: 12,
      padding: "12px 16px",
      height: 50,
    },
    otpTimerRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 4,
      gap: 12,
    },
    otpTimerText: {
      color: "#8c8c8c",
      fontSize: 13,
      flex: 1,
    },
  };

  const clearStatusMessage = () => {
    setStatusMessage(null);
    setIdentifierHint(null);
  };

  const showStatusMessage = (type, text) => {
    if (!text) {
      clearStatusMessage();
      return;
    }
    setStatusMessage({ type, text });
    if (type === "error" && /account|email|mobile/i.test(text)) {
      setIdentifierHint(text);
    } else if (type === "success") {
      setIdentifierHint(null);
    }
  };

  const getErrorText = (error, fallback) => {
    return error?.response?.data?.message || error?.message || fallback;
  };

  const formatTimer = (value = 0) => {
    const minutes = String(Math.floor(value / 60)).padStart(2, "0");
    const seconds = String(value % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (otpTimer <= 0) return;
    const timer = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpTimer]);

  const resetFlow = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setEnteredOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setNormalizedIdentifier("");
    clearStatusMessage();
  };

  const normalizeIdentifierInput = () => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      const errorText = "Please enter your registered email or mobile number";
      showStatusMessage("error", errorText);
      return null;
    }
    if (resetMethod === "email") {
      const value = trimmed.toLowerCase();
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(value)) {
        const errorText = "Please enter a valid email address";
        showStatusMessage("error", errorText);
        return null;
      }
      return value;
    }
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length !== 10) {
      const errorText = "Please enter a valid 10-digit mobile number";
      showStatusMessage("error", errorText);
      return null;
    }
    return digits;
  };

  const handleSendResetOtp = async () => {
    const value = normalizeIdentifierInput();
    if (!value) return;
    setResetRequestLoading(true);
    clearStatusMessage();
    try {
      const response = await authService.requestPasswordReset(value);
      setOtpSent(true);
      setOtpVerified(false);
      setNormalizedIdentifier(value);
      setEnteredOtp("");
      setOtpTimer(60);
      const successText = response.message || "OTP sent to your registered account";
      showStatusMessage("success", successText);
      message.success(successText);
    } catch (error) {
      console.error("Password reset request error:", error);
      const errorText = getErrorText(error, "Failed to send OTP");
      showStatusMessage("error", errorText);
      message.error(errorText);
    } finally {
      setResetRequestLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!enteredOtp || enteredOtp.length !== 6) {
      message.error("Please enter the 6-digit OTP");
      return;
    }
    clearStatusMessage();
    setOtpVerifyLoading(true);
    try {
      await authService.verifyPasswordResetOtp({
        identifier: normalizedIdentifier,
        otp: enteredOtp,
      });
      setOtpVerified(true);
      const successText = "OTP verified! Set a new password.";
      showStatusMessage("success", successText);
      message.success(successText);
    } catch (error) {
      console.error("OTP verification error:", error);
      const errorText = getErrorText(error, "Failed to verify OTP");
      showStatusMessage("error", errorText);
      message.error(errorText);
    } finally {
      setOtpVerifyLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      message.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }
    clearStatusMessage();
    setPasswordResetLoading(true);
    try {
      const response = await authService.updatePasswordWithOtp({
        identifier: normalizedIdentifier,
        newPassword,
      });
      const successText = response.message || "Password updated successfully";
      showStatusMessage("success", successText);
      message.success(successText);
      resetFlow();
      setIdentifier("");
    } catch (error) {
      console.error("Password reset error:", error);
      const errorText = getErrorText(error, "Failed to reset password");
      showStatusMessage("error", errorText);
      message.error(errorText);
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handleMethodChange = (key) => {
    setResetMethod(key);
    setIdentifier("");
    setOtpSent(false);
    setOtpVerified(false);
    setEnteredOtp("");
    setNormalizedIdentifier("");
    clearStatusMessage();
  };

  return (
    <div style={styles.page}>
      <div style={styles.layout}>
        <div style={styles.heroSection}>
          <div style={styles.heroOverlay}>
            <div style={styles.heroText}>
              
               
            </div>
          </div>
          <div style={styles.heroDotNav}>
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
          <div style={styles.brandBlock}>
            <img
              src="https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_200/v1691154856/samples/people/boy-snow-hoodie.jpg"
              alt="Lisaa logo"
              style={styles.logo}
            />
            <div style={styles.brandMainTextWrapper}>
              <div style={styles.brandLsiaaText}>
                <span style={styles.brandLSText}>LS</span>
                <span style={styles.brandIAAText}>IAA</span>
              </div>
              <div style={styles.brandSubTextContainer}>
                <Title level={4} style={styles.brandSubTitle}>
                  Tours &
                </Title>
                <Title level={4} style={styles.brandSubTitleAccent}>
                  Travels
                </Title>
              </div>
            </div>
          </div>
          <div style={styles.cardShell}>
            <div style={styles.formContainer}>
              <div style={{ textAlign: "left" }}>
                <Title level={2} style={{ margin: 0, color: "#1f1f1f", fontWeight: 700 }}>
                  Forgot Password
                </Title>
                <Text style={styles.sectionDescription}>
                  Enter your registered email or mobile number to receive a verification OTP.
                </Text>
              </div>
              {statusMessage && (
                <Alert
                  type={statusMessage.type}
                  showIcon
                  message={statusMessage.text}
                  closable
                  onClose={clearStatusMessage}
                />
              )}

              <Tabs
                activeKey={resetMethod}
                onChange={handleMethodChange}
                items={[
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                ]}
              />

              {!otpSent && (
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                  <Input
                    size="large"
                    placeholder={
                      resetMethod === "email"
                        ? "e.g. johndoe@email.com"
                        : "10-digit mobile number"
                    }
                    prefix={
                      resetMethod === "email" ? (
                        <MailOutlined style={{ color: "#ff6b35" }} />
                      ) : (
                        <PhoneOutlined style={{ color: "#ff6b35" }} />
                      )
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    style={styles.inputStyle}
                  />
                  {identifierHint && (
                    <Text type="danger" style={{ fontSize: 13 }}>
                      {identifierHint}
                    </Text>
                  )}
                  <Button
                    type="primary"
                    size="large"
                    style={styles.buttonPrimary}
                    onClick={handleSendResetOtp}
                    loading={resetRequestLoading}
                  >
                    {resetRequestLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </Space>
              )}

              {otpSent && !otpVerified && (
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                  <Alert
                    type="success"
                    showIcon
                    message="OTP sent"
                    description={
                      <span>
                        We have sent a 6-digit code to your registered{" "}
                        <strong>{resetMethod === "email" ? "email" : "phone"}</strong>.
                      </span>
                    }
                  />
                  <div style={{ width: "100%" }}>
                    <Text style={{ fontWeight: 500, display: "block", marginBottom: 6 }}>
                      Enter the 6-digit OTP sent to your {resetMethod === "email" ? "email address" : "mobile number"}
                    </Text>
                    <Input.OTP
                      length={6}
                      value={enteredOtp}
                      onChange={(value) =>
                        setEnteredOtp(value.replace(/\D/g, "").slice(0, 6))
                      }
                      disabled={otpVerifyLoading}
                    />
                  </div>
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                    size="small"
                  >
                    <Button
                      type="link"
                      onClick={() => {
                        setOtpSent(false);
                        setIdentifier("");
                        setEnteredOtp("");
                        setNormalizedIdentifier("");
                      }}
                    >
                      Change identifier
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      style={styles.buttonPrimary}
                      onClick={handleVerifyOtp}
                      loading={otpVerifyLoading}
                    >
                      {otpVerifyLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </Space>
                  <div style={styles.otpTimerRow}>
                    <Typography.Text style={styles.otpTimerText}>
                      {otpTimer > 0
                        ? `Resend available in ${formatTimer(otpTimer)}`
                        : "OTP not received? Tap resend to get a new code."}
                    </Typography.Text>
                    <Button
                      type="link"
                      onClick={handleSendResetOtp}
                      disabled={resetRequestLoading || otpTimer > 0}
                      style={{ paddingLeft: 0 }}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </Space>
              )}

              {otpVerified && (
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                  <Alert
                    type="success"
                    showIcon
                    message="Identity confirmed"
                    description="Set a new password to finish the process."
                  />
                  <Input.Password
                    size="large"
                    placeholder="New password"
                    prefix={<LockOutlined style={{ color: "#ff6b35" }} />}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={styles.inputStyle}
                  />
                  <Input.Password
                    size="large"
                    placeholder="Confirm new password"
                    prefix={<LockOutlined style={{ color: "#ff6b35" }} />}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.inputStyle}
                  />
                  <Button
                    type="primary"
                    size="large"
                    style={styles.buttonPrimary}
                    onClick={handleUpdatePassword}
                    loading={passwordResetLoading}
                  >
                    {passwordResetLoading ? "Updating..." : "Update Password"}
                  </Button>
                </Space>
              )}
 

              <Button
                type="primary"
                size="large"
                style={styles.buttonPrimary}
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

