import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Alert,
  Divider,
  Modal,
  Select,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PhoneOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// Import Google Font (Poppins)
const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text, Paragraph } = Typography;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  
  // Forgot Password / OTP States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  // Responsive resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allowedEmails = [
    "pushpendrarawat868@gmail.com",
    "Lsiaatech@gmail.com",
    "vp312600@gmail.com", // Note: If email is vp312600@gmailcom (without dot), update here
  ];

  const adminPassword = "admin@123";

  // Phone numbers for OTP
  const otpPhones = [
    "9263616263",
    "8840206492"
  ];

  const onFinish = async (values) => {
    setLoading(true);
    setError("");

    try {
      // Call backend API for authentication
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        localStorage.setItem("adminToken", "admin-logged-in");
        localStorage.setItem("adminEmail", values.email);
        localStorage.setItem("adminRole", data.admin.role);

        console.log(`✅ Admin logged in: ${values.email}`);
        navigate("/admin/dashboard");
      } else {
        // Login failed
        setError(data.message || "Invalid email or password. Try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Login failed. Please check if backend is running.");
      setLoading(false);
    } finally {
      if (!error) {
        setLoading(false);
      }
    }
  };

  const getAdminRole = (email) => {
    if (email === "pushpendrarawat868@gmail.com") return "Super Admin";
    if (email === "Lsiaatech@gmail.com") return "Admin";
    if (email === "vp312600@gmail.com") return "Admin";
    return "Admin";
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setOtpSent(false);
    setOtpVerified(false);
    setSelectedPhone("");
    setEnteredOTP("");
    setNewPassword("");
    setConfirmPassword("");
    setAdminEmail("");
  };

  // Handle Password Reset
  const handlePasswordReset = async () => {
    // Validation
    if (!adminEmail) {
      message.error("Please enter your admin email!");
      return;
    }

    if (!allowedEmails.includes(adminEmail)) {
      message.error("This email is not authorized as admin!");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      message.error("Password must be at least 6 characters!");
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      console.log(`🔐 Resetting password for: ${adminEmail}`);

      const response = await fetch('http://localhost:5000/api/otp/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: selectedPhone,
          email: adminEmail,
          newPassword: newPassword
        })
      });

      const data = await response.json();
      console.log(`📥 Password Reset Response:`, data);

      if (response.ok) {
        message.success({
          content: `✅ Password reset successfully! You can now login with your new password.`,
          duration: 5
        });
        
        // Close modal and reset states
        setTimeout(() => {
          setShowForgotPassword(false);
          setOtpSent(false);
          setOtpVerified(false);
          setSelectedPhone("");
          setEnteredOTP("");
          setNewPassword("");
          setConfirmPassword("");
          setAdminEmail("");
        }, 1500);
      } else {
        message.error(data.message || 'Failed to reset password!');
      }
    } catch (error) {
      console.error('❌ Password reset error:', error);
      message.error('Failed to reset password. Check if backend is running!');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP to selected phone
  const handleSendOTP = async () => {
    if (!selectedPhone) {
      message.error("Please select a phone number!");
      return;
    }

    setLoading(true);
    try {
      console.log(`📤 Sending OTP request for phone: ${selectedPhone}`);
      
      // Call backend API to send real SMS OTP
      const response = await fetch('http://localhost:5000/api/otp/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: selectedPhone })
      });

      const data = await response.json();
      console.log(`📥 OTP Response:`, data);

      if (response.ok) {
        setGeneratedOTP(data.demo_otp); // Store for verification
        setOtpSent(true);
        message.success({
          content: `📱 OTP sent to ${selectedPhone} via SMS!`,
          duration: 5
        });
        // Show OTP in console and alert for easy testing
        console.log(`🔑 Your OTP is: ${data.demo_otp}`);
        console.log(`⏰ OTP valid for 5 minutes`);
      } else {
        message.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('❌ Send OTP error:', error);
      message.error('Failed to send OTP. Check if backend is running!');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!enteredOTP || enteredOTP.length !== 6) {
      message.error("Please enter a valid 6-digit OTP!");
      return;
    }

    setLoading(true);
    try {
      console.log(`📤 Verifying OTP:`, { 
        phone: selectedPhone, 
        enteredOTP: enteredOTP,
        type: typeof enteredOTP
      });

      // Call backend API to verify OTP
      const response = await fetch('http://localhost:5000/api/otp/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: selectedPhone,
          otp: enteredOTP 
        })
      });

      const data = await response.json();
      console.log(`📥 Verify Response:`, data);

      if (response.ok) {
        console.log(`✅ OTP Verified!`);
        // Set verified state and show password reset form
        setOtpVerified(true);
        message.success('OTP Verified! Now set your new password.');
      } else {
        console.error(`❌ Verification failed:`, data);
        message.error(data.message || 'Invalid OTP! Please try again.');
        if (data.debug) {
          console.error(`Debug info:`, data.debug);
        }
      }
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      message.error('Failed to verify OTP. Check if backend is running!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // minHeight hatake height
    width: "100vw",  // minWidth hatake width
    overflow: "hidden", // <-- scroll disable
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    boxSizing: "border-box",
    padding: "0 20px",
  }}
>

      <Card
        style={{
          // --- BEGIN: WIDTH CHANGE FOR WIDER CARD ---
          width:
            windowWidth <= 480
              ? "95%" // Increased from 90%
              : windowWidth <= 768
              ? "70%" // Decreased from 80% to give a fixed width instead
              : "600px", // Increased fixed width from 420px to 600px
          // --- END: WIDTH CHANGE FOR WIDER CARD ---
          borderRadius: "20px",
          boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
          border: "none",
          background: "white",
        }}
        bodyStyle={{
          padding:
            windowWidth <= 480
              ? "24px"
              : windowWidth <= 768
              ? "32px"
              : "40px",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#ff6b35",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <UserOutlined style={{ fontSize: "28px", color: "white" }} />
          </div>

          <Title
            level={2}
            style={{
              margin: 0,
              color: "#ff6b35",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            Admin Login
          </Title>

          <Paragraph style={{ color: "#6c757d", marginBottom: 0 }}>
            Sign in to access the admin dashboard
          </Paragraph>
        </div>

        {/* Error */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: "24px", borderRadius: "12px" }}
          />
        )}

        {/* Form */}
        <Form
          name="admin-login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label={
              <Text strong style={{ color: "#ff6b35" }}>
                Email Address
              </Text>
            }
            rules={[
              { required: true, message: "Please enter your email!" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  // Custom validation - just check if it's one of allowed emails
                  if (allowedEmails.includes(value)) {
                    return Promise.resolve();
                  }
                  // Basic email format check (contains @ and .)
                  if (value.includes('@') && value.includes('.')) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Please enter a valid email!'));
                }
              }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#ff6b35" }} />}
              placeholder="Enter your admin email"
              style={{
                borderRadius: "8px",
                padding: "10px 14px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <Text strong style={{ color: "#ff6b35" }}>
                Password
              </Text>
            }
            rules={[{ required: true, message: "Enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#ff6b35" }} />}
              placeholder="Enter your password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={{
                borderRadius: "8px",
                padding: "10px 14px",
              }}
            />
          </Form.Item>

          {/* Forgot Password Link */}
          <div style={{ textAlign: "right", marginBottom: "16px" }}>
            <Button
              type="link"
              onClick={handleForgotPassword}
              style={{
                color: "#ff6b35",
                fontWeight: "500",
                padding: 0,
              }}
            >
              Forgot Password?
            </Button>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              height: "50px",
              borderRadius: "15px",
              backgroundColor: "#ff6b35",
              border: "none",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              marginTop: "10px",
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Form>

        <Divider style={{ margin: "24px 0" }}>
          <Text type="secondary" style={{ fontSize: "14px" }}>
            Admin Access
          </Text>
        </Divider>

        {/* Demo Admin Credentials */}
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#fff7e6",
            borderRadius: "10px",
            border: "1px solid #ffd591",
          }}
        >
          <Text
            strong
            style={{
              color: "#ff6b35",
              fontSize: "14px",
              display: "block",
              marginBottom: "8px",
            }}
          >
            🔑 Demo Admin Credentials:
          </Text>
          <Text
            style={{
              color: "#666",
              fontSize: "11px",
              display: "block",
              marginBottom: "4px",
            }}
          >
            1. pushpendrarawat868@gmail.com
          </Text>
          <Text
            style={{
              color: "#666",
              fontSize: "11px",
              display: "block",
              marginBottom: "4px",
            }}
          >
            2. Lsiaatech@gmail.com
          </Text>
          <Text
            style={{
              color: "#666",
              fontSize: "11px",
              display: "block",
              marginBottom: "8px",
            }}
          >
            3. vp312600@gmail.com
          </Text>
          <Text
            style={{
              color: "#999",
              fontSize: "10px",
              display: "block",
              fontStyle: "italic",
              marginBottom: "4px"
            }}
          >
            🔑 First time? Use "Forgot Password" to set your password
          </Text>
          <Text
            style={{
              color: "#999",
              fontSize: "10px",
              display: "block",
              fontStyle: "italic",
            }}
          >
            📱 OTP Numbers: 9263616263 or 8840206492
          </Text>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            padding: "12px",
            background: "rgba(255, 107, 53, 0.05)",
            borderRadius: "8px",
          }}
        >
          <Text type="secondary" style={{ fontSize: "12px" }}>
            🔒 Secure Admin Access • Lsiaa Travel and Tours 
          </Text>
        </div>
      </Card>

      {/* Forgot Password Modal with OTP */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <KeyOutlined style={{ fontSize: "32px", color: "#ff6b35", marginBottom: "8px" }} />
            <Title level={4} style={{ margin: 0 }}>Reset Password</Title>
          </div>
        }
        open={showForgotPassword}
        onCancel={() => {
          setShowForgotPassword(false);
          setOtpSent(false);
          setSelectedPhone("");
          setEnteredOTP("");
        }}
        footer={null}
        width={450}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* Step 1: Phone Selection */}
          {!otpSent && !otpVerified && (
            <>
              <Text>Select a phone number to receive OTP:</Text>
              <Select
                size="large"
                placeholder="Select phone number"
                style={{ width: "100%" }}
                value={selectedPhone}
                onChange={setSelectedPhone}
                prefix={<PhoneOutlined />}
              >
                {otpPhones.map((phone) => (
                  <Select.Option key={phone} value={phone}>
                    <PhoneOutlined style={{ marginRight: "8px" }} />
                    {phone}
                  </Select.Option>
                ))}
              </Select>
              <Button
                type="primary"
                block
                size="large"
                onClick={handleSendOTP}
                loading={loading}
                style={{
                  backgroundColor: "#ff6b35",
                  borderColor: "#ff6b35",
                }}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </>
          )}

          {/* Step 2: OTP Entry */}
          {otpSent && !otpVerified && (
            <>
              <Alert
                message={`📱 OTP sent to ${selectedPhone}`}
                description={
                  <div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      Check your SMS for the 6-digit OTP code.
                    </div>
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '12px', 
                      background: '#fff7e6',
                      border: '2px dashed #ff6b35',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                        Demo Mode - Your OTP:
                      </div>
                      <div style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold', 
                        color: '#ff6b35',
                        letterSpacing: '4px'
                      }}>
                        {generatedOTP}
                      </div>
                    </div>
                  </div>
                }
                type="success"
                showIcon
              />
              <Text>Enter OTP:</Text>
              <Input
                size="large"
                placeholder="Enter 6-digit OTP"
                value={enteredOTP}
                onChange={(e) => setEnteredOTP(e.target.value)}
                maxLength={6}
                prefix={<KeyOutlined style={{ color: "#ff6b35" }} />}
              />
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Button
                  onClick={() => {
                    setOtpSent(false);
                    setEnteredOTP("");
                  }}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
                <Button
                  type="primary"
                  onClick={handleVerifyOTP}
                  loading={loading}
                  style={{
                    backgroundColor: "#ff6b35",
                    borderColor: "#ff6b35",
                  }}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </Space>
            </>
          )}

          {/* Step 3: Password Reset Form */}
          {otpVerified && (
            <>
              <Alert
                message="✅ OTP Verified Successfully!"
                description="Now set your new password for admin access."
                type="success"
                showIcon
              />

              <div style={{ marginTop: '16px' }}>
                <Text strong style={{ color: "#ff6b35", marginBottom: '8px', display: 'block' }}>
                  Admin Email
                </Text>
                <Input
                  size="large"
                  placeholder="Enter your admin email"
                  prefix={<MailOutlined style={{ color: "#ff6b35" }} />}
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  style={{ marginBottom: '16px' }}
                />

                <Text strong style={{ color: "#ff6b35", marginBottom: '8px', display: 'block' }}>
                  New Password
                </Text>
                <Input.Password
                  size="large"
                  placeholder="Enter new password (min 6 characters)"
                  prefix={<LockOutlined style={{ color: "#ff6b35" }} />}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ marginBottom: '16px' }}
                />

                <Text strong style={{ color: "#ff6b35", marginBottom: '8px', display: 'block' }}>
                  Confirm Password
                </Text>
                <Input.Password
                  size="large"
                  placeholder="Re-enter new password"
                  prefix={<LockOutlined style={{ color: "#ff6b35" }} />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ marginBottom: '16px' }}
                />
              </div>

              <div style={{ 
                padding: '12px', 
                background: '#fff7e6',
                borderRadius: '8px',
                border: '1px solid #ffd591',
                marginBottom: '16px'
              }}>
                <Text style={{ color: '#666', fontSize: '13px' }}>
                  ℹ️ Password will be saved in database and you can login with this password from next time.
                </Text>
              </div>

              <Button
                type="primary"
                block
                size="large"
                onClick={handlePasswordReset}
                loading={loading}
                style={{
                  backgroundColor: "#ff6b35",
                  borderColor: "#ff6b35",
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </>
          )}
        </Space>
      </Modal>
    </div>
  );
};

export default AdminLogin;