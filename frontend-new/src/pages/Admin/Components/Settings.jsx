import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Image,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Popconfirm,
  Row,
  Col,
  Typography,
  Divider,
  InputNumber,
  Switch,
  Tooltip,
  Badge,
  Tabs,
  Statistic,
  Progress,
  Timeline,
  Descriptions,
  Avatar,
  Rate,
  List,
  Drawer,
  Upload,
  Grid,
  Radio,
  Checkbox,
  Slider,
  ColorPicker,
  TimePicker,
  Upload as AntUpload,
  Cascader,
  TreeSelect,
  AutoComplete,
  Mentions,
  Transfer,
  Tree,
  Anchor,
  BackTop,
  Affix,
  Breadcrumb,
  Dropdown,
  Menu,
  Result,
  Skeleton,
  Spin,
  Alert,
  Empty,
  ConfigProvider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  ImportOutlined,
  DownloadOutlined,
  PrinterOutlined,
  SendOutlined,
  MessageOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  CarOutlined,
  HomeOutlined,
  StarOutlined,
  TeamOutlined,
  GlobalOutlined,
  HeartOutlined,
  CrownOutlined,
  GiftOutlined,
  TrophyOutlined,
  BookOutlined,
  CameraOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PercentageOutlined,
  TagsOutlined,
  CopyOutlined,
  ShareAltOutlined,
  QrcodeOutlined,
  FileOutlined,
  EditOutlined as EditIcon,
  EyeOutlined as ViewIcon,
  LinkOutlined,
  PictureOutlined,
  SoundOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  UploadOutlined,
  FolderOutlined,
  FileImageOutlined,
  PlayCircleOutlined,
  AudioOutlined,
  FileZipOutlined,
  CloudUploadOutlined,
  DeleteOutlined as DeleteIcon,
  StarOutlined as StarIcon,
  HeartOutlined as HeartIcon,
  DownloadOutlined as DownloadIcon,
  SettingOutlined,
  ToolOutlined,
  ApiOutlined,
  DatabaseOutlined,
  CloudOutlined,
  WifiOutlined,
  MobileOutlined,
  DesktopOutlined,
  TabletOutlined,
  LaptopOutlined,
  MonitorOutlined,
  PrinterOutlined as PrinterIcon,
  ScanOutlined,
  CameraOutlined as CameraIcon,
  VideoCameraOutlined as VideoIcon,
  AudioOutlined as AudioIcon,
  SoundOutlined as SoundIcon,
  BellOutlined,
  NotificationOutlined,
  MessageOutlined as MessageIcon,
  CommentOutlined,
  LikeOutlined,
  DislikeOutlined,
  ShareAltOutlined as ShareIcon,
  RetweetOutlined,
  ForwardOutlined,
  BackwardOutlined,
  UpOutlined,
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  MenuOutlined,
  BorderOutlined,
  BorderInnerOutlined,
  BorderOuterOutlined,
  BorderTopOutlined,
  BorderBottomOutlined,
  BorderLeftOutlined,
  BorderRightOutlined,
  // BorderOutlined,
  // BorderOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  CompressOutlined,
  ExpandOutlined,
  ArrowsAltOutlined,
  ShrinkOutlined,
  // MenuOutlined,
  AppstoreOutlined,
  BarsOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
  EllipsisOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined as CloseCircleIcon,
  CheckCircleOutlined as CheckCircleIcon,
  ExclamationCircleOutlined as ExclamationCircleIcon,
  InfoCircleOutlined as InfoCircleIcon,
  QuestionCircleOutlined as QuestionCircleIcon,
  // ExclamationCircleOutlined,
  // CloseCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined as PlayCircleIcon,
  // RightOutlined,
  // LeftOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  ReloadOutlined,
  SyncOutlined,
  LoadingOutlined,
  SettingOutlined as SettingIcon,
  ToolOutlined as ToolIcon,
  ApiOutlined as ApiIcon,
  DatabaseOutlined as DatabaseIcon,
  CloudOutlined as CloudIcon,
  WifiOutlined as WifiIcon,
  MobileOutlined as MobileIcon,
  DesktopOutlined as DesktopIcon,
  TabletOutlined as TabletIcon,
  LaptopOutlined as LaptopIcon,
  MonitorOutlined as MonitorIcon,
  PrinterOutlined as PrinterIconAlt,
  ScanOutlined as ScanIcon,
  CameraOutlined as CameraIconAlt,
  VideoCameraOutlined as VideoIconAlt,
  AudioOutlined as AudioIconAlt,
  SoundOutlined as SoundIconAlt,
  BellOutlined as BellIcon,
  NotificationOutlined as NotificationIcon,
  MessageOutlined as MessageIconAlt,
  CommentOutlined as CommentIcon,
  LikeOutlined as LikeIcon,
  DislikeOutlined as DislikeIcon,
  ShareAltOutlined as ShareIconAlt,
  RetweetOutlined as RetweetIcon,
  ForwardOutlined as ForwardIcon,
  BackwardOutlined as BackwardIcon,
  UpOutlined as UpIcon,
  DownOutlined as DownIcon,
  LeftOutlined as LeftIcon,
  RightOutlined as RightIcon,
  VerticalAlignTopOutlined as VerticalAlignTopIcon,
  VerticalAlignBottomOutlined as VerticalAlignBottomIcon,
  VerticalAlignMiddleOutlined as VerticalAlignMiddleIcon,
  MenuOutlined as HorizontalIcon,
  MenuOutlined as VerticalIcon,
  BorderOutlined as BorderIcon,
  BorderInnerOutlined as BorderInnerIcon,
  BorderOuterOutlined as BorderOuterIcon,
  BorderTopOutlined as BorderTopIcon,
  BorderBottomOutlined as BorderBottomIcon,
  BorderLeftOutlined as BorderLeftIcon,
  BorderRightOutlined as BorderRightIcon,
  BorderOutlined as BorderVerticleIcon,
  BorderOutlined as BorderHorizontalIcon,
  FullscreenOutlined as FullscreenIcon,
  FullscreenExitOutlined as FullscreenExitIcon,
  CompressOutlined as CompressIcon,
  ExpandOutlined as ExpandIcon,
  ArrowsAltOutlined as ArrowsAltIcon,
  ShrinkOutlined as ShrinkIcon,
  MenuOutlined as MenuIcon,
  AppstoreOutlined as AppstoreIcon,
  BarsOutlined as BarsIcon,
  MenuFoldOutlined as MenuFoldIcon,
  MenuUnfoldOutlined as MenuUnfoldIcon,
  MoreOutlined as MoreIcon,
  EllipsisOutlined as EllipsisIcon,
  PlusCircleOutlined as PlusCircleIcon,
  MinusCircleOutlined as MinusCircleIcon,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
  SafetyOutlined,
  SafetyCertificateOutlined,
  SecurityScanOutlined,
  BugOutlined,
  CodeOutlined,
  FileExcelOutlined as FileExcelIcon,
  FilePdfOutlined as FilePdfIcon,
  FileWordOutlined as FileWordIcon,
  FilePptOutlined as FilePptIcon,
  FileZipOutlined as FileZipIcon,
  FileImageOutlined as FileImageIcon,
  FileTextOutlined as FileTextIcon,
  FileOutlined as FileIcon,
  FolderOutlined as FolderIcon,
  FolderOpenOutlined,
  FolderAddOutlined,
  MinusOutlined,
  // EyeOutlined,
  // FileZipOutlined,
  // SyncOutlined,
  // SafetyOutlined,
  // SearchOutlined,
  // CodeOutlined,
  // FileOutlined,
  // FileImageOutlined,
  // VideoCameraOutlined,
  // AudioOutlined,
  // FileTextOutlined,
  SwapOutlined,
  // CopyOutlined,
  // EditOutlined,
  // DeleteOutlined,
  // PlusOutlined,
  // SyncOutlined,
  // ReloadOutlined,
  // ReloadOutlined,
  SyncOutlined as FolderSyncIcon,
  SafetyOutlined as FolderProtectIcon,
  SearchOutlined as FolderSearchIcon,
  CodeOutlined as FolderCodeIcon,
  FileOutlined as FolderFileIcon,
  FileImageOutlined as FolderImageIcon,
  VideoCameraOutlined as FolderVideoIcon,
  AudioOutlined as FolderAudioIcon,
  FileTextOutlined as FolderDocumentIcon,
  FileZipOutlined as FolderArchiveIcon,
  CloudOutlined as FolderBackupIcon,
  ReloadOutlined as FolderRestoreIcon,
  SwapOutlined as FolderMoveIcon,
  CopyOutlined as FolderCopyIcon,
  EditOutlined as FolderRenameIcon,
  DeleteOutlined as FolderDeleteIcon,
  PlusOutlined as FolderCreateIcon,
  SyncOutlined as FolderUpdateIcon,
  ReloadOutlined as FolderRefreshIcon,
  ReloadOutlined as FolderReloadIcon
} from '@ant-design/icons';

// Import Google Font (Poppins) - Same as landing page
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Meta } = Card;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [form] = Form.useForm();
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
      content: 'Are you sure you want to reset all settings to default values?',
      onOk: () => {
        message.success('Settings reset to default values');
      }
    });
  };

  const GeneralSettings = () => (
    <Form
      form={form}
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
          <Button onClick={() => handleResetSettings('general')} style={{ borderRadius: '8px' }}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: '8px', background: '#ff6b35', border: 'none' }}>
            Save Settings
          </Button>
        </Space>
      </div>
    </Form>
  );

  const AppearanceSettings = () => (
    <Form
      form={form}
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
          <Button onClick={() => handleResetSettings('appearance')} style={{ borderRadius: '8px' }}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: '8px', background: '#ff6b35', border: 'none' }}>
            Save Settings
          </Button>
        </Space>
      </div>
    </Form>
  );

  const NotificationSettings = () => (
    <Form
      form={form}
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
          <Button onClick={() => handleResetSettings('notifications')} style={{ borderRadius: '8px' }}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: '8px', background: '#ff6b35', border: 'none' }}>
            Save Settings
          </Button>
        </Space>
      </div>
    </Form>
  );

  const SecuritySettings = () => (
    <Form
      form={form}
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
          <Button onClick={() => handleResetSettings('security')} style={{ borderRadius: '8px' }}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: '8px', background: '#ff6b35', border: 'none' }}>
            Save Settings
          </Button>
        </Space>
      </div>
    </Form>
  );

  const IntegrationSettings = () => (
    <Form
      form={form}
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
          <Button onClick={() => handleResetSettings('integrations')} style={{ borderRadius: '8px' }}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: '8px', background: '#ff6b35', border: 'none' }}>
            Save Settings
          </Button>
        </Space>
      </div>
    </Form>
  );

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '20px 24px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 107, 53, 0.1)'
      }}>
        <div>
          <Title level={3} style={{ margin: '0 0 8px 0', color: '#2c3e50', fontFamily: "'Poppins', sans-serif" }}>
            ⚙️ Settings
          </Title>
          <Text style={{ fontSize: '14px', color: '#6c757d', fontFamily: "'Poppins', sans-serif" }}>
            Configure your application settings and preferences
          </Text>
        </div>
        
        <Space>
          <Button
            icon={<SaveOutlined />}
            style={{
              borderRadius: '12px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600'
            }}
          >
            Save All
          </Button>
          <Button
            icon={<ReloadOutlined />}
            style={{
              borderRadius: '12px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600'
            }}
          >
            Reset All
          </Button>
        </Space>
      </div>

      {/* Settings Content */}
      <Card style={{ borderRadius: '16px' }}>
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
