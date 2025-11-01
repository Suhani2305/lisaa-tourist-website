import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  message,
  Space,
} from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import Header from '../landingpage/components/Header';
import Footer from '../landingpage/components/Footer';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ContactUs = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Here you can add API call to save inquiry
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Thank you for contacting us! We will get back to you soon.');
      form.resetFields();
    } catch (error) {
      message.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <Header />

      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 20px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
          Get In Touch
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </Paragraph>
      </div>

      {/* Contact Content */}
      <div style={{ maxWidth: '1200px', margin: '-60px auto 60px', padding: '0 20px' }}>
        <Row gutter={[32, 32]}>
          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Title level={3} style={{ marginBottom: '24px' }}>
                Send us a Message
              </Title>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                size="large"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="Your Name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: '#ff6b35' }} />}
                        placeholder="Enter your name"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined style={{ color: '#ff6b35' }} />}
                        placeholder="Enter your email"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      rules={[
                        { required: true, message: 'Please enter your phone' },
                        { pattern: /^[0-9]{10}$/, message: 'Please enter valid 10-digit number' },
                      ]}
                    >
                      <Input
                        prefix={<PhoneOutlined style={{ color: '#ff6b35' }} />}
                        placeholder="Enter your phone"
                        maxLength={10}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="subject"
                      label="Subject"
                      rules={[{ required: true, message: 'Please enter subject' }]}
                    >
                      <Input
                        prefix={<MessageOutlined style={{ color: '#ff6b35' }} />}
                        placeholder="Enter subject"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      name="message"
                      label="Message"
                      rules={[{ required: true, message: 'Please enter your message' }]}
                    >
                      <TextArea
                        rows={6}
                        placeholder="Enter your message"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      style={{
                        width: '100%',
                        height: '50px',
                        backgroundColor: '#ff6b35',
                        borderColor: '#ff6b35',
                        fontSize: '16px',
                        fontWeight: '600',
                      }}
                    >
                      Send Message
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col xs={24} lg={10}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Contact Details Card */}
              <Card
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <Title level={4} style={{ marginBottom: '24px' }}>
                  Contact Information
                </Title>

                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {/* Office Address */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#fff5f0',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <EnvironmentOutlined style={{ fontSize: '24px', color: '#ff6b35' }} />
                    </div>
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                        Office Address
                      </Text>
                      <Text type="secondary">
                        123 Travel Street, Tourism District<br />
                        Mumbai, Maharashtra 400001, India
                      </Text>
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#fff5f0',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <PhoneOutlined style={{ fontSize: '24px', color: '#ff6b35' }} />
                    </div>
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                        Phone Number
                      </Text>
                      <Text type="secondary">
                        +91 98765 43210<br />
                        +91 98765 43211
                      </Text>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#fff5f0',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <MailOutlined style={{ fontSize: '24px', color: '#ff6b35' }} />
                    </div>
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                        Email Address
                      </Text>
                      <Text type="secondary">
                        info@lisaatours.com<br />
                        support@lisaatours.com
                      </Text>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#fff5f0',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <ClockCircleOutlined style={{ fontSize: '24px', color: '#ff6b35' }} />
                    </div>
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                        Working Hours
                      </Text>
                      <Text type="secondary">
                        Monday - Saturday: 9:00 AM - 6:00 PM<br />
                        Sunday: Closed
                      </Text>
                    </div>
                  </div>
                </Space>
              </Card>

              {/* Map Card */}
              <Card
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  padding: 0,
                }}
                bodyStyle={{ padding: 0 }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241316.67292555945!2d72.74109953749857!3d19.08219783958033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1678901234567!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </Card>
            </Space>
          </Col>
        </Row>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;

