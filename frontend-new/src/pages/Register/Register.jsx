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
  Radio,
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
  PhoneOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services";

// Import Google Font (Poppins)
const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text, Paragraph } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      // Register user with backend API
      const response = await authService.register({
        name: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
        gender: values.gender || 'male',
      });
      
      message.success(`Registration successful! Welcome ${response.user.name}!`);
      
      // Redirect to home page after successful registration
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      message.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    message.info(`${provider} registration coming soon!`);
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
              Join Us Today!
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
              Create your account and unlock exclusive travel deals, personalized
              recommendations, and access to our premium tour packages.
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
              <Text style={{ color: "white", fontSize: "14px" }}>
                Easy Signup
              </Text>
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
              <Text style={{ color: "white", fontSize: "14px" }}>
                Secure
              </Text>
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
              <Text style={{ color: "white", fontSize: "14px" }}>
                Free Account
              </Text>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
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
              Create Account
            </Title>
            <Text
              style={{
                color: "#666",
                fontSize: "16px",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Join thousands of travelers worldwide
            </Text>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Form.Item
              name="fullName"
              label={
                <Text
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Full Name
                </Text>
              }
              rules={[{ required: true, message: "Please enter your full name!" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#ff6b35" }} />}
                placeholder="Enter your full name"
                style={{
                  borderRadius: "10px",
                  fontFamily: "'Poppins', sans-serif",
                  padding: "12px 16px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={
                <Text
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Email Address
                </Text>
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
              name="phone"
              label={
                <Text
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Phone Number (Optional)
                </Text>
              }
              rules={[
                { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number!" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: "#ff6b35" }} />}
                placeholder="Enter your phone number"
                maxLength={10}
                style={{
                  borderRadius: "10px",
                  fontFamily: "'Poppins', sans-serif",
                  padding: "12px 16px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label={
                <Text
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Gender
                </Text>
              }
              initialValue="male"
            >
              <Radio.Group
                buttonStyle="solid"
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <Radio.Button value="male" style={{ flex: 1, textAlign: "center" }}>
                  <ManOutlined /> Male
                </Radio.Button>
                <Radio.Button value="female" style={{ flex: 1, textAlign: "center" }}>
                  <WomanOutlined /> Female
                </Radio.Button>
                <Radio.Button value="other" style={{ flex: 1, textAlign: "center" }}>
                  <UserOutlined /> Other
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <Text
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Password
                </Text>
              }
              rules={[
                { required: true, message: "Please enter your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#ff6b35" }} />}
                placeholder="Create a password"
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

            <Form.Item
              name="confirmPassword"
              label={
                <Text
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Confirm Password
                </Text>
              }
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#ff6b35" }} />}
                placeholder="Confirm your password"
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

            <Form.Item name="agree" valuePropName="checked" style={{ marginBottom: "20px" }}>
              <Checkbox
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "#666",
                }}
              >
                I agree to the{" "}
                <Link to="/terms" style={{ color: "#ff6b35" }}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" style={{ color: "#ff6b35" }}>
                  Privacy Policy
                </Link>
              </Checkbox>
            </Form.Item>

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
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </Form.Item>

            <Divider style={{ color: "#ccc" }}>
              <Text
                style={{
                  color: "#999",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px",
                }}
              >
                Or continue with
              </Text>
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
              <Text style={{ color: "#666" }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#ff6b35",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Sign In
                </Link>
              </Text>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
