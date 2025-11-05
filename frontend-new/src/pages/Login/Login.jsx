import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Divider,
  Space,
  Checkbox,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  FacebookOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services";

// Import Google Font (Poppins)
const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text: TypographyText, Paragraph } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      // Regular user login only
      const response = await authService.login({
        email: values.email,
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

  const handleSocialLogin = (provider) => {
    message.info(`${provider} login coming soon!`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
        }}
      >
        {/* Left Side - Welcome Content */}
        <div
          style={{
            color: "white",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div style={{ marginBottom: "40px" }}>
            <Title
              level={1}
              style={{
                color: "white",
                fontSize: "48px",
                fontWeight: "700",
                marginBottom: "20px",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Welcome Back!
            </Title>
            <Paragraph
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "18px",
                lineHeight: "1.6",
                marginBottom: "30px",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Sign in to your account and start exploring amazing destinations
              around the world with our premium travel packages.
            </Paragraph>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "30px",
              marginTop: "40px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                }}
              >
                <UserOutlined style={{ fontSize: "24px", color: "white" }} />
              </div>
              <TypographyText style={{ color: "white", fontSize: "14px" }}>
                Easy Login
              </TypographyText>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                }}
              >
                <LockOutlined style={{ fontSize: "24px", color: "white" }} />
              </div>
              <TypographyText style={{ color: "white", fontSize: "14px" }}>
                Secure
              </TypographyText>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                }}
              >
                <MailOutlined style={{ fontSize: "24px", color: "white" }} />
              </div>
              <TypographyText style={{ color: "white", fontSize: "14px" }}>
                Email Login
              </TypographyText>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card
          style={{
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            border: "none",
            padding: "40px",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <Title
              level={2}
              style={{
                color: "#333",
                marginBottom: "10px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "600",
              }}
            >
              Sign In
            </Title>
            <TypographyText
              style={{
                color: "#666",
                fontSize: "16px",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Enter your credentials to access your account
            </TypographyText>
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
              name="email"
              label={
                <TypographyText
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Email Address
                </TypographyText>
              }
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#ff6b35" }} />}
                placeholder="Enter your email"
                style={{
                  borderRadius: "10px",
                  fontFamily: "'Poppins', sans-serif",
                  padding: "12px 16px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <TypographyText
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Password
                </TypographyText>
              }
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#ff6b35" }} />}
                placeholder="Enter your password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                style={{
                  borderRadius: "10px",
                  fontFamily: "'Poppins', sans-serif",
                  padding: "12px 16px",
                }}
              />
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Form.Item name="remember" valuePropName="checked" style={{ margin: 0 }}>
                <Checkbox
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "#666",
                  }}
                >
                  Remember me
                </Checkbox>
              </Form.Item>
              <Link
                to="/forgot-password"
                style={{
                  color: "#ff6b35",
                  textDecoration: "none",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "500",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <Form.Item style={{ marginBottom: "20px" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "10px",
                  backgroundColor: "#ff6b35",
                  borderColor: "#ff6b35",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </Form.Item>

            <Divider style={{ color: "#ccc" }}>
              <TypographyText
                style={{
                  color: "#999",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px",
                }}
              >
                Or continue with
              </TypographyText>
            </Divider>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                icon={<GoogleOutlined />}
                onClick={() => handleSocialLogin("Google")}
                style={{
                  width: "100%",
                  height: "45px",
                  borderRadius: "10px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "500",
                }}
              >
                Continue with Google
              </Button>
              <Button
                icon={<FacebookOutlined />}
                onClick={() => handleSocialLogin("Facebook")}
                style={{
                  width: "100%",
                  height: "45px",
                  borderRadius: "10px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "500",
                }}
              >
                Continue with Facebook
              </Button>
            </Space>

            <div
              style={{
                textAlign: "center",
                marginTop: "30px",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <TypographyText style={{ color: "#666" }}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#ff6b35",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Sign Up
                </Link>
              </TypographyText>
            </div>

            {/* Info Note */}
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
                border: "1px solid #e9ecef",
              }}
            >
              <TypographyText
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "600",
                  color: "#333",
                  fontSize: "14px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                ℹ️ Note:
              </TypographyText>
              <TypographyText
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "#666",
                  fontSize: "13px",
                  display: "block",
                }}
              >
                This is for regular users only. Admin users should login at <a href="/admin/login" style={{ color: "#ff6b35", fontWeight: "600" }}>/admin/login</a>
              </TypographyText>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
