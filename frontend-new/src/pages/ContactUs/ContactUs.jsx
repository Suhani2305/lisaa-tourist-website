import React, { useState, useEffect } from 'react';
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
  Select,
  ConfigProvider,
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
import { inquiryService, tourService } from '../../services';

const { Title, Text: TypographyText, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ContactUs = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setPackagesLoading(true);
      const tours = await tourService.getAllTours({ limit: 1000 });
      setPackages(Array.isArray(tours) ? tours : []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setPackagesLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Submit inquiry to backend API
      const response = await inquiryService.createInquiry({
        name: values.name,
        email: values.email,
        phone: values.phone,
        subject: values.subject || 'Contact Form Inquiry',
        message: values.message,
        interestedTour: values.interestedTour || null // Package/Tour ID
      });

      if (response.success) {
        message.success(response.message || 'Thank you for contacting us! We will get back to you soon.');
        form.resetFields();
      } else {
        message.error(response.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      message.error(error.message || 'Failed to send message. Please try again.');
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
          background: 'linear-gradient(135deg, #FF6B35 0%, #f15a29 100%)',
          padding: '80px 20px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Title level={1} style={{ 
          color: 'white', 
          marginBottom: '16px',
          fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
          fontFamily: 'Poppins, sans-serif'
        }}>
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

              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#FF6B35',
                  },
                }}
              >
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
                      name="interestedTour"
                      label="Interested Package (Optional)"
                    >
                      <Select
                        placeholder="Select a package you're interested in"
                        loading={packagesLoading}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ borderRadius: '8px' }}
                      >
                        {packages.map((pkg) => (
                          <Option key={pkg._id} value={pkg._id}>
                            {pkg.title} - {pkg.destination} ({pkg.duration?.days || 'N/A'} Days)
                          </Option>
                        ))}
                      </Select>
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
              </ConfigProvider>
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
                      <TypographyText strong style={{ display: 'block', marginBottom: '4px' }}>
                        Office Address
                      </TypographyText>
                      <TypographyText type="secondary">
                        U.G. 58, P.C.F. PLAZA, MINT HOUSE<br />
                        VARANASI, UP 221001, India
                      </TypographyText>
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
                      <TypographyText strong style={{ display: 'block', marginBottom: '4px' }}>
                        Phone Number
                      </TypographyText>
                      <TypographyText type="secondary">
                        +91 9263616263
                      </TypographyText>
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
                      <TypographyText strong style={{ display: 'block', marginBottom: '4px' }}>
                        Email Address
                      </TypographyText>
                      <TypographyText type="secondary">
                        Lsiaatech@gmail.com
                      </TypographyText>
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
                      <TypographyText strong style={{ display: 'block', marginBottom: '4px' }}>
                        Working Hours
                      </TypographyText>
                      <TypographyText type="secondary">
                        Monday - Sunday: 9:00 AM - 8:00 PM<br />
                      </TypographyText>
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.1234567890!2d83.0104!3d25.3176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db76febcf4d%3A0x681b0c5e8b0c5e8b!2sVaranasi%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1678901234567!5m2!1sen!2sin"
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

