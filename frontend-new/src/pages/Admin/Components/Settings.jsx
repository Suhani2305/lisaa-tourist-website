import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Typography,
  Divider,
  InputNumber,
  Switch,
  Tabs,
  Radio
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';

// Import Google Fonts (Poppins & Playfair Display)
const link1 = document.createElement("link");
link1.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link1.rel = "stylesheet";
document.head.appendChild(link1);

const link2 = document.createElement("link");
link2.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap";
link2.rel = "stylesheet";
document.head.appendChild(link2);

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [generalForm] = Form.useForm();
  const [appearanceForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [integrationForm] = Form.useForm();
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Lisaa Tours & Travels',
      siteDescription: 'Your gateway to amazing travel experiences across India',
      siteUrl: 'https://lisaatourism.com',
      adminEmail: 'Lsiaatech@gmail.com',
      supportEmail: 'Lsiaatech@gmail.com',
      phoneNumber: '+91 9263616263',
      address: '123 Tourism Street, Travel City, TC 12345',
      timezone: 'Asia/Kolkata',
      language: 'en',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    },
    appearance: {
      primaryColor: '#ff6b35',
      secondaryColor: '#f15a29',
      fontFamily: 'Poppins',
      logoUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=80&fit=crop&q=80',
      faviconUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=32&h=32&fit=crop&q=80',
      theme: 'light',
      layout: 'default',
      sidebarCollapsed: false,
      showBreadcrumbs: true,
      showFooter: true,
      showHeader: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingConfirmations: true,
      paymentConfirmations: true,
      cancellationNotifications: true,
      reminderNotifications: true,
      marketingEmails: false,
      newsletterSubscriptions: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      lockoutDuration: 15,
      ipWhitelist: [],
      sslEnabled: true,
      backupEnabled: true,
      backupFrequency: 'daily',
      dataRetention: 365
    },
    integrations: {
      googleAnalytics: '',
      facebookPixel: '',
      googleMaps: '',
      paymentGateway: 'razorpay',
      smsProvider: 'twilio',
      emailProvider: 'sendgrid',
      socialLogin: {
        google: true,
        facebook: true,
        twitter: false,
        linkedin: false
      }
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'noreply@lisaatourism.com',
      smtpPassword: '********',
      smtpEncryption: 'tls',
      fromName: 'Lisaa Tourism',
      fromEmail: 'noreply@lisaatourism.com',
      replyTo: 'support@lisaatourism.com'
    },
    payment: {
      razorpayKeyId: 'rzp_test_********',
      razorpayKeySecret: '********',
      stripePublishableKey: 'pk_test_********',
      stripeSecretKey: 'sk_test_********',
      paypalClientId: '********',
      paypalClientSecret: '********',
      currency: 'INR',
      testMode: true
    }
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Settings are already loaded from state
    } catch (error) {
      message.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (tab, values) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(prev => ({
        ...prev,
        [tab]: { ...prev[tab], ...values }
      }));
      
      message.success('Settings saved successfully');
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = (tab) => {
    Modal.confirm({
      title: 'Reset Settings',
      content: `Are you sure you want to reset ${tab} settings to default values?`,
      onOk: () => {
        // Reset to default values
        const defaultSettings = {
          general: {
            siteName: 'Lisaa Tours & Travels',
            siteDescription: 'Your gateway to amazing travel experiences across India',
            siteUrl: 'https://lisaatourism.com',
            adminEmail: 'Lsiaatech@gmail.com',
            supportEmail: 'Lsiaatech@gmail.com',
            phoneNumber: '+91 9263616263',
            address: '123 Tourism Street, Travel City, TC 12345',
            timezone: 'Asia/Kolkata',
            language: 'en',
            currency: 'INR',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h'
          },
          appearance: {
            primaryColor: '#ff6b35',
            secondaryColor: '#f15a29',
            fontFamily: 'Poppins',
            logoUrl: '',
            faviconUrl: '',
            theme: 'light',
            layout: 'default',
            sidebarCollapsed: false,
            showBreadcrumbs: true,
            showFooter: true,
            showHeader: true
          },
          notifications: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            bookingConfirmations: true,
            paymentConfirmations: true,
            cancellationNotifications: true,
            reminderNotifications: true,
            marketingEmails: false,
            newsletterSubscriptions: true
          },
          security: {
            twoFactorAuth: false,
            sessionTimeout: 30,
            passwordExpiry: 90,
            loginAttempts: 5,
            lockoutDuration: 15,
            ipWhitelist: [],
            sslEnabled: true,
            backupEnabled: true,
            backupFrequency: 'daily',
            dataRetention: 365
          },
          integrations: {
            googleAnalytics: '',
            facebookPixel: '',
            googleMaps: '',
            paymentGateway: 'razorpay',
            smsProvider: 'twilio',
            emailProvider: 'sendgrid',
            socialLogin: {
              google: true,
              facebook: true,
              twitter: false,
              linkedin: false
            }
          }
        };
        
        setSettings(prev => ({
          ...prev,
          [tab]: defaultSettings[tab]
        }));
        
        // Reset form
        if (tab === 'general') generalForm.setFieldsValue(defaultSettings.general);
        else if (tab === 'appearance') appearanceForm.setFieldsValue(defaultSettings.appearance);
        else if (tab === 'notifications') notificationForm.setFieldsValue(defaultSettings.notifications);
        else if (tab === 'security') securityForm.setFieldsValue(defaultSettings.security);
        else if (tab === 'integrations') integrationForm.setFieldsValue(defaultSettings.integrations);
        
        message.success(`${tab.charAt(0).toUpperCase() + tab.slice(1)} settings reset to default values`);
      }
    });
  };

  const handleSaveAll = async () => {
    try {
      setLoading(true);
      // Get all form values
      const generalValues = generalForm.getFieldsValue();
      const appearanceValues = appearanceForm.getFieldsValue();
      const notificationValues = notificationForm.getFieldsValue();
      const securityValues = securityForm.getFieldsValue();
      const integrationValues = integrationForm.getFieldsValue();
      
      // Save all settings
      await Promise.all([
        handleSaveSettings('general', generalValues),
        handleSaveSettings('appearance', appearanceValues),
        handleSaveSettings('notifications', notificationValues),
        handleSaveSettings('security', securityValues),
        handleSaveSettings('integrations', integrationValues)
      ]);
      
      message.success('All settings saved successfully!');
    } catch (error) {
      message.error('Failed to save all settings');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAll = () => {
    Modal.confirm({
      title: 'Reset All Settings',
      content: 'Are you sure you want to reset ALL settings to default values? This action cannot be undone.',
      okText: 'Yes, Reset All',
      okType: 'danger',
      onOk: () => {
        const defaultSettings = {
          general: {
            siteName: 'Lisaa Tours & Travels',
            siteDescription: 'Your gateway to amazing travel experiences across India',
            siteUrl: 'https://lisaatourism.com',
            adminEmail: 'Lsiaatech@gmail.com',
            supportEmail: 'Lsiaatech@gmail.com',
            phoneNumber: '+91 9263616263',
            address: '123 Tourism Street, Travel City, TC 12345',
            timezone: 'Asia/Kolkata',
            language: 'en',
            currency: 'INR',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h'
          },
          appearance: {
            primaryColor: '#ff6b35',
            secondaryColor: '#f15a29',
            fontFamily: 'Poppins',
            logoUrl: '',
            faviconUrl: '',
            theme: 'light',
            layout: 'default',
            sidebarCollapsed: false,
            showBreadcrumbs: true,
            showFooter: true,
            showHeader: true
          },
          notifications: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            bookingConfirmations: true,
            paymentConfirmations: true,
            cancellationNotifications: true,
            reminderNotifications: true,
            marketingEmails: false,
            newsletterSubscriptions: true
          },
          security: {
            twoFactorAuth: false,
            sessionTimeout: 30,
            passwordExpiry: 90,
            loginAttempts: 5,
            lockoutDuration: 15,
            ipWhitelist: [],
            sslEnabled: true,
            backupEnabled: true,
            backupFrequency: 'daily',
            dataRetention: 365
          },
          integrations: {
            googleAnalytics: '',
            facebookPixel: '',
            googleMaps: '',
            paymentGateway: 'razorpay',
            smsProvider: 'twilio',
            emailProvider: 'sendgrid',
            socialLogin: {
              google: true,
              facebook: true,
              twitter: false,
              linkedin: false
            }
          }
        };
        
        setSettings(defaultSettings);
        
        // Reset all forms
        generalForm.setFieldsValue(defaultSettings.general);
        appearanceForm.setFieldsValue(defaultSettings.appearance);
        notificationForm.setFieldsValue(defaultSettings.notifications);
        securityForm.setFieldsValue(defaultSettings.security);
        integrationForm.setFieldsValue(defaultSettings.integrations);
        
        message.success('All settings reset to default values');
      }
    });
  };

  const GeneralSettings = () => (
    <Form
      form={generalForm}
      layout="vertical"
      initialValues={settings.general}
      onFinish={(values) => handleSaveSettings('general', values)}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="siteName"
            label="Site Name"
            rules={[{ required: true, message: 'Please enter site name' }]}
          >
            <Input placeholder="Enter site name" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="siteUrl"
            label="Site URL"
            rules={[{ required: true, message: 'Please enter site URL' }]}
          >
            <Input placeholder="https://example.com" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="siteDescription"
            label="Site Description"
          >
            <TextArea
              rows={3}
              placeholder="Enter site description"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="adminEmail"
            label="Admin Email"
            rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}
          >
            <Input placeholder="Lsiaatech@gmail.com" defaultValue="Lsiaatech@gmail.com" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="supportEmail"
            label="Support Email"
            rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}
          >
            <Input placeholder="Lsiaatech@gmail.com" defaultValue="Lsiaatech@gmail.com" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
          >
            <Input placeholder="+91 9876543210" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="timezone"
            label="Timezone"
          >
            <Select placeholder="Select timezone" style={{ borderRadius: '8px' }}>
              <Option value="Asia/Kolkata">Asia/Kolkata (IST)</Option>
              <Option value="UTC">UTC</Option>
              <Option value="America/New_York">America/New_York (EST)</Option>
              <Option value="Europe/London">Europe/London (GMT)</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="address"
            label="Address"
          >
            <TextArea
              rows={2}
              placeholder="Enter complete address"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
        </Col>
      </Row>
      
      <Divider />
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            name="language"
            label="Default Language"
          >
            <Select placeholder="Select language" style={{ borderRadius: '8px' }}>
              <Option value="en">English</Option>
              <Option value="hi">Hindi</Option>
              <Option value="ta">Tamil</Option>
              <Option value="te">Telugu</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="currency"
            label="Default Currency"
          >
            <Select placeholder="Select currency" style={{ borderRadius: '8px' }}>
              <Option value="INR">Indian Rupee (₹)</Option>
              <Option value="USD">US Dollar ($)</Option>
              <Option value="EUR">Euro (€)</Option>
              <Option value="GBP">British Pound (£)</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="dateFormat"
            label="Date Format"
          >
            <Select placeholder="Select date format" style={{ borderRadius: '8px' }}>
              <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
              <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
              <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      
      <div style={{ textAlign: 'right', marginTop: '24px' }}>
        <Space>
          <Button 
            onClick={() => handleResetSettings('general')} 
            size={windowWidth <= 768 ? 'middle' : 'large'}
            style={{ 
              borderRadius: '8px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              height: windowWidth <= 768 ? '32px' : '40px'
            }}
          >
            Reset
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            size={windowWidth <= 768 ? 'middle' : 'large'}
            style={{ 
              borderRadius: '8px', 
              background: '#ff6b35', 
              border: 'none',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
              height: windowWidth <= 768 ? '32px' : '40px'
            }}
          >
            Save Settings
          </Button>
        </Space>
      </div>
    </Form>
  );

  const AppearanceSettings = () => (
    <Form
      form={appearanceForm}
      layout="vertical"
      initialValues={settings.appearance}
      onFinish={(values) => handleSaveSettings('appearance', values)}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="primaryColor"
            label="Primary Color"
          >
            <Input
              type="color"
              style={{ borderRadius: '8px' }}
              value={settings.appearance.primaryColor}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="secondaryColor"
            label="Secondary Color"
          >
            <Input
              type="color"
              style={{ borderRadius: '8px' }}
              value={settings.appearance.secondaryColor}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="fontFamily"
            label="Font Family"
          >
            <Select placeholder="Select font" style={{ borderRadius: '8px' }}>
              <Option value="Poppins">Poppins</Option>
              <Option value="Roboto">Roboto</Option>
              <Option value="Open Sans">Open Sans</Option>
              <Option value="Lato">Lato</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="theme"
            label="Theme"
          >
            <Radio.Group>
              <Radio value="light">Light</Radio>
              <Radio value="dark">Dark</Radio>
              <Radio value="auto">Auto</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="logoUrl"
            label="Logo URL"
          >
            <Input placeholder="https://example.com/logo.png" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="faviconUrl"
            label="Favicon URL"
          >
            <Input placeholder="https://example.com/favicon.ico" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
      </Row>
      
      <Divider />
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="layout"
            label="Layout Style"
          >
            <Select placeholder="Select layout" style={{ borderRadius: '8px' }}>
              <Option value="default">Default</Option>
              <Option value="compact">Compact</Option>
              <Option value="wide">Wide</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="sidebarCollapsed"
            label="Sidebar"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="showBreadcrumbs"
            label="Show Breadcrumbs"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="showFooter"
            label="Show Footer"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="showHeader"
            label="Show Header"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      
      <div style={{ textAlign: 'right', marginTop: '24px' }}>
        <Space>
          <Button 
            onClick={() => handleResetSettings('appearance')} 
            size={windowWidth <= 768 ? 'middle' : 'large'}
            style={{ 
              borderRadius: '8px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              height: windowWidth <= 768 ? '32px' : '40px'
            }}
          >
            Reset
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            size={windowWidth <= 768 ? 'middle' : 'large'}
            style={{ 
              borderRadius: '8px', 
              background: '#ff6b35', 
              border: 'none',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
              height: windowWidth <= 768 ? '32px' : '40px'
            }}
          >
            Save Settings
          </Button>
        </Space>
      </div>
    </Form>
  );

  const NotificationSettings = () => (
    <Form
      form={notificationForm}
      layout="vertical"
      initialValues={settings.notifications}
      onFinish={(values) => handleSaveSettings('notifications', values)}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="emailNotifications"
            label="Email Notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="smsNotifications"
            label="SMS Notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="pushNotifications"
            label="Push Notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="marketingEmails"
            label="Marketing Emails"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      
      <Divider />
      
      <Title level={4}>Notification Types</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="bookingConfirmations"
            label="Booking Confirmations"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="paymentConfirmations"
            label="Payment Confirmations"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="cancellationNotifications"
            label="Cancellation Notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="reminderNotifications"
            label="Reminder Notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="newsletterSubscriptions"
            label="Newsletter Subscriptions"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      
      <div style={{ textAlign: 'right', marginTop: '24px' }}>
        <Space>
          <Button 
            onClick={() => handleResetSettings('notifications')} 
            size={windowWidth <= 768 ? 'middle' : 'large'}
            style={{ 
              borderRadius: '8px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              height: windowWidth <= 768 ? '32px' : '40px'
            }}
          >
            Reset
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            size={windowWidth <= 768 ? 'middle' : 'large'}
            style={{ 
              borderRadius: '8px', 
              background: '#ff6b35', 
              border: 'none',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
              height: windowWidth <= 768 ? '32px' : '40px'
            }}
          >
            Save Settings
          </Button>
        </Space>
      </div>
    </Form>
  );

  const SecuritySettings = () => (
    <Form
      form={securityForm}
      layout="vertical"
      initialValues={settings.security}
      onFinish={(values) => handleSaveSettings('security', values)}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="twoFactorAuth"
            label="Two-Factor Authentication"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="sslEnabled"
            label="SSL Enabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="sessionTimeout"
            label="Session Timeout (minutes)"
          >
            <InputNumber
              min={5}
              max={480}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="passwordExpiry"
            label="Password Expiry (days)"
          >
            <InputNumber
              min={30}
              max={365}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="loginAttempts"
            label="Max Login Attempts"
          >
            <InputNumber
              min={3}
              max={10}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="lockoutDuration"
            label="Lockout Duration (minutes)"
          >
            <InputNumber
              min={5}
              max={60}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Form.Item>
        </Col>
      </Row>
      
      <Divider />
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="backupEnabled"
            label="Automatic Backup"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="backupFrequency"
            label="Backup Frequency"
          >
            <Select placeholder="Select frequency" style={{ borderRadius: '8px' }}>
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="dataRetention"
            label="Data Retention (days)"
          >
            <InputNumber
              min={30}
              max={1095}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Form.Item>
        </Col>
      </Row>
      
      <div style={{ textAlign: 'right', marginTop: '24px' }}>
        <Space>
          <Button 
            onClick={() => handleResetSettings('security')} 
            size={windowWidth <= 768 ? 'middle' : 'large'}
            style={{ 
              borderRadius: '8px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              height: windowWidth <= 768 ? '32px' : '40px'
            }}
          >
            Reset
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            size={windowWidth <= 768 ? 'middle' : 'large'}
            style={{ 
              borderRadius: '8px', 
              background: '#ff6b35', 
              border: 'none',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
              height: windowWidth <= 768 ? '32px' : '40px'
            }}
          >
            Save Settings
          </Button>
        </Space>
      </div>
    </Form>
  );

  const IntegrationSettings = () => (
    <Form
      form={integrationForm}
      layout="vertical"
      initialValues={settings.integrations}
      onFinish={(values) => handleSaveSettings('integrations', values)}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="googleAnalytics"
            label="Google Analytics ID"
          >
            <Input placeholder="GA-XXXXXXXXX" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="facebookPixel"
            label="Facebook Pixel ID"
          >
            <Input placeholder="XXXXXXXXXXXXXXX" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="googleMaps"
            label="Google Maps API Key"
          >
            <Input placeholder="AIzaSyXXXXXXXXXXXXXXX" style={{ borderRadius: '8px' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="paymentGateway"
            label="Payment Gateway"
          >
            <Select placeholder="Select gateway" style={{ borderRadius: '8px' }}>
              <Option value="razorpay">Razorpay</Option>
              <Option value="stripe">Stripe</Option>
              <Option value="paypal">PayPal</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      
      <Divider />
      
      <Title level={4}>Social Login</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name={['socialLogin', 'google']}
            label="Google Login"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={['socialLogin', 'facebook']}
            label="Facebook Login"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={['socialLogin', 'twitter']}
            label="Twitter Login"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={['socialLogin', 'linkedin']}
            label="LinkedIn Login"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      
      <div style={{ textAlign: 'right', marginTop: '24px' }}>
        <Space>
          <Button 
            onClick={() => handleResetSettings('integrations')} 
            size={windowWidth <= 768 ? 'middle' : 'large'}
            style={{ 
              borderRadius: '8px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              height: windowWidth <= 768 ? '32px' : '40px'
            }}
          >
            Reset
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            size={windowWidth <= 768 ? 'middle' : 'large'}
            style={{ 
              borderRadius: '8px', 
              background: '#ff6b35', 
              border: 'none',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
              height: windowWidth <= 768 ? '32px' : '40px'
            }}
          >
            Save Settings
          </Button>
        </Space>
      </div>
    </Form>
  );

  return (
    <div style={{ 
      padding: windowWidth <= 768 ? '16px' : '24px',
      fontFamily: "'Poppins', sans-serif",
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        marginBottom: windowWidth <= 768 ? '20px' : '32px',
        textAlign: 'center',
        position: 'relative',
        paddingTop: windowWidth <= 768 ? '40px' : '0'
      }}>
        <Title level={1} style={{ 
          fontSize: windowWidth <= 768 ? '1.8rem' : windowWidth <= 1024 ? '2.5rem' : '3rem', 
          fontWeight: '800', 
          color: '#FF6B35',
          margin: '0 auto 16px auto',
          fontFamily: "'Playfair Display', 'Georgia', serif",
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 4px rgba(255, 107, 53, 0.1)',
          textAlign: 'center'
        }}>
          Settings
        </Title>
        
        <p style={{
          fontSize: windowWidth <= 768 ? '13px' : windowWidth <= 1024 ? '14px' : '16px',
          color: '#6c757d',
          margin: '0 auto',
          fontFamily: "'Poppins', sans-serif",
          lineHeight: '1.6',
          maxWidth: '700px',
          textAlign: 'center'
        }}>
          Configure your application settings and preferences
        </p>

        <Space 
          style={{ 
            position: windowWidth <= 768 ? 'absolute' : 'absolute', 
            top: windowWidth <= 768 ? '0' : '0', 
            right: '0',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            gap: '8px'
          }}
        >
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSaveAll}
            loading={loading}
            size={windowWidth <= 768 ? 'small' : 'large'}
            style={{
              borderRadius: '8px',
              background: '#52c41a',
              border: 'none',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)',
              height: windowWidth <= 768 ? '28px' : '40px',
              padding: windowWidth <= 768 ? '0 8px' : '0 16px',
              fontSize: windowWidth <= 768 ? '12px' : '14px'
            }}
          >
            {windowWidth > 768 && 'Save All'}
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleResetAll}
            size={windowWidth <= 768 ? 'small' : 'large'}
            style={{
              borderRadius: '8px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              height: windowWidth <= 768 ? '28px' : '40px',
              padding: windowWidth <= 768 ? '0 8px' : '0 16px',
              fontSize: windowWidth <= 768 ? '12px' : '14px'
            }}
          >
            {windowWidth > 768 && 'Reset All'}
          </Button>
        </Space>
      </div>

      {/* Settings Content */}
      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
        bodyStyle={{ padding: windowWidth <= 768 ? '12px' : '20px' }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'general',
              label: 'General',
              children: <GeneralSettings />
            },
            {
              key: 'appearance',
              label: 'Appearance',
              children: <AppearanceSettings />
            },
            {
              key: 'notifications',
              label: 'Notifications',
              children: <NotificationSettings />
            },
            {
              key: 'security',
              label: 'Security',
              children: <SecuritySettings />
            },
            {
              key: 'integrations',
              label: 'Integrations',
              children: <IntegrationSettings />
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default Settings;
