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
  Grid
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
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  RiseOutlined,
  FallOutlined,
  DashboardOutlined,
  FundOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  EyeInvisibleOutlined,
  ThunderboltOutlined,
  FireOutlined,
  BulbOutlined,
  RocketOutlined,
  TrophyOutlined as TrophyIcon,
  CrownOutlined as CrownIcon,
  GiftOutlined as GiftIcon,
  BookOutlined as BookIcon,
  GlobalOutlined as GlobalIcon,
  TeamOutlined as TeamIcon,
  HeartOutlined as HeartIconAlt,
  StarOutlined as StarIconAlt,
  DollarOutlined as DollarIcon,
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
  CheckCircleOutlined as CheckIcon,
  CloseCircleOutlined as CloseIcon,
  ExclamationCircleOutlined as ExclamationIcon,
  InfoCircleOutlined as InfoIcon,
  QuestionCircleOutlined as QuestionIcon,
  WarningOutlined,
  StopOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined as PlayIcon,
  PauseOutlined,
  RightOutlined,
  LeftOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  ReloadOutlined,
  SyncOutlined,
  LoadingOutlined,
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
  FullscreenOutlined,
  FullscreenExitOutlined,
  CompressOutlined,
  ExpandOutlined,
  ArrowsAltOutlined,
  ShrinkOutlined,
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
  PauseCircleOutlined as PauseCircleIcon,
  PlayCircleOutlined as PlayCircleIcon,
  RightOutlined as StepForwardIcon,
  LeftOutlined as StepBackwardIcon,
  DoubleRightOutlined as FastForwardIcon,
  DoubleLeftOutlined as FastBackwardIcon,
  ReloadOutlined as ReloadIcon,
  SyncOutlined as SyncIcon,
  LoadingOutlined as LoadingIcon,
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
  MinusCircleOutlined as MinusCircleIcon
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

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [exportFormat, setExportFormat] = useState('pdf');

  // Mock data for analytics
  const analyticsData = {
    overview: {
      totalBookings: 1247,
      totalRevenue: 2847500,
      totalCustomers: 892,
      totalTours: 45,
      bookingGrowth: 12.5,
      revenueGrowth: 18.3,
      customerGrowth: 8.7,
      tourGrowth: 5.2
    },
    bookings: {
      total: 1247,
      confirmed: 1156,
      pending: 67,
      cancelled: 24,
      byMonth: [
        { month: 'Jan', bookings: 89, revenue: 245000 },
        { month: 'Feb', bookings: 102, revenue: 287000 },
        { month: 'Mar', bookings: 134, revenue: 356000 },
        { month: 'Apr', bookings: 156, revenue: 412000 },
        { month: 'May', bookings: 178, revenue: 489000 },
        { month: 'Jun', bookings: 201, revenue: 567000 },
        { month: 'Jul', bookings: 189, revenue: 523000 },
        { month: 'Aug', bookings: 165, revenue: 445000 },
        { month: 'Sep', bookings: 142, revenue: 389000 },
        { month: 'Oct', bookings: 98, revenue: 267000 },
        { month: 'Nov', bookings: 76, revenue: 198000 },
        { month: 'Dec', bookings: 65, revenue: 168000 }
      ],
      byDestination: [
        { destination: 'Kerala', bookings: 234, revenue: 567000 },
        { destination: 'Rajasthan', bookings: 198, revenue: 445000 },
        { destination: 'Andaman', bookings: 156, revenue: 389000 },
        { destination: 'Kashmir', bookings: 134, revenue: 312000 },
        { destination: 'Goa', bookings: 98, revenue: 234000 },
        { destination: 'Himachal', bookings: 87, revenue: 198000 },
        { destination: 'Uttarakhand', bookings: 76, revenue: 167000 },
        { destination: 'Others', bookings: 264, revenue: 541000 }
      ]
    },
    customers: {
      total: 892,
      new: 234,
      returning: 658,
      byAge: [
        { age: '18-25', count: 156, percentage: 17.5 },
        { age: '26-35', count: 267, percentage: 29.9 },
        { age: '36-45', count: 234, percentage: 26.2 },
        { age: '46-55', count: 145, percentage: 16.3 },
        { age: '56-65', count: 67, percentage: 7.5 },
        { age: '65+', count: 23, percentage: 2.6 }
      ],
      byGender: [
        { gender: 'Male', count: 456, percentage: 51.1 },
        { gender: 'Female', count: 436, percentage: 48.9 }
      ],
      byLocation: [
        { location: 'Delhi', count: 123, percentage: 13.8 },
        { location: 'Mumbai', count: 98, percentage: 11.0 },
        { location: 'Bangalore', count: 87, percentage: 9.8 },
        { location: 'Chennai', count: 76, percentage: 8.5 },
        { location: 'Kolkata', count: 65, percentage: 7.3 },
        { location: 'Pune', count: 54, percentage: 6.1 },
        { location: 'Others', count: 389, percentage: 43.6 }
      ]
    },
    revenue: {
      total: 2847500,
      monthly: [
        { month: 'Jan', revenue: 245000, growth: 5.2 },
        { month: 'Feb', revenue: 287000, growth: 17.1 },
        { month: 'Mar', revenue: 356000, growth: 24.0 },
        { month: 'Apr', revenue: 412000, growth: 15.7 },
        { month: 'May', revenue: 489000, growth: 18.7 },
        { month: 'Jun', revenue: 567000, growth: 15.9 },
        { month: 'Jul', revenue: 523000, growth: -7.8 },
        { month: 'Aug', revenue: 445000, growth: -14.9 },
        { month: 'Sep', revenue: 389000, growth: -12.6 },
        { month: 'Oct', revenue: 267000, growth: -31.4 },
        { month: 'Nov', revenue: 198000, growth: -25.8 },
        { month: 'Dec', revenue: 168000, growth: -15.2 }
      ],
      bySource: [
        { source: 'Direct Website', revenue: 1245000, percentage: 43.7 },
        { source: 'Social Media', revenue: 567000, percentage: 19.9 },
        { source: 'Referrals', revenue: 445000, percentage: 15.6 },
        { source: 'Google Ads', revenue: 389000, percentage: 13.7 },
        { source: 'Other', revenue: 203500, percentage: 7.1 }
      ]
    },
    performance: {
      website: {
        pageViews: 45678,
        uniqueVisitors: 12345,
        bounceRate: 34.2,
        avgSessionDuration: '3:45',
        conversionRate: 8.7
      },
      social: {
        facebook: { followers: 1234, engagement: 4.2 },
        instagram: { followers: 5678, engagement: 6.8 },
        twitter: { followers: 2345, engagement: 3.1 },
        youtube: { followers: 3456, engagement: 5.9 }
      },
      seo: {
        organicTraffic: 7890,
        keywordRankings: 156,
        backlinks: 234,
        domainAuthority: 45
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? '#52c41a' : '#ff4d4f';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <RiseOutlined /> : <FallOutlined />;
  };

  const handleExport = (format) => {
    message.success(`Exporting report as ${format.toUpperCase()}...`);
    // In real app, this would trigger actual export
  };

  const OverviewTab = () => (
    <div>
      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Bookings"
              value={analyticsData.overview.totalBookings}
              prefix={<BookIcon style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontFamily: "'Poppins', sans-serif" }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text style={{ color: getGrowthColor(analyticsData.overview.bookingGrowth), fontSize: '12px' }}>
                {getGrowthIcon(analyticsData.overview.bookingGrowth)} {analyticsData.overview.bookingGrowth}% vs last month
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Revenue"
              value={formatCurrency(analyticsData.overview.totalRevenue)}
              prefix={<DollarIcon style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontFamily: "'Poppins', sans-serif" }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text style={{ color: getGrowthColor(analyticsData.overview.revenueGrowth), fontSize: '12px' }}>
                {getGrowthIcon(analyticsData.overview.revenueGrowth)} {analyticsData.overview.revenueGrowth}% vs last month
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Customers"
              value={analyticsData.overview.totalCustomers}
              prefix={<TeamIcon style={{ color: '#ff6b35' }} />}
              valueStyle={{ color: '#ff6b35', fontFamily: "'Poppins', sans-serif" }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text style={{ color: getGrowthColor(analyticsData.overview.customerGrowth), fontSize: '12px' }}>
                {getGrowthIcon(analyticsData.overview.customerGrowth)} {analyticsData.overview.customerGrowth}% vs last month
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Active Tours"
              value={analyticsData.overview.totalTours}
              prefix={<GlobalIcon style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontFamily: "'Poppins', sans-serif" }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text style={{ color: getGrowthColor(analyticsData.overview.tourGrowth), fontSize: '12px' }}>
                {getGrowthIcon(analyticsData.overview.tourGrowth)} {analyticsData.overview.tourGrowth}% vs last month
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Website Performance" style={{ borderRadius: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Page Views"
                  value={formatNumber(analyticsData.performance.website.pageViews)}
                  prefix={<EyeOutlined style={{ color: '#1890ff' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Unique Visitors"
                  value={formatNumber(analyticsData.performance.website.uniqueVisitors)}
                  prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Bounce Rate"
                  value={analyticsData.performance.website.bounceRate}
                  suffix="%"
                  prefix={<FallOutlined style={{ color: '#ff4d4f' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Conversion Rate"
                  value={analyticsData.performance.website.conversionRate}
                  suffix="%"
                  prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Social Media Performance" style={{ borderRadius: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <Text strong>Facebook</Text>
                  <br />
                  <Text style={{ fontSize: '18px', color: '#1890ff' }}>
                    {formatNumber(analyticsData.performance.social.facebook.followers)}
                  </Text>
                  <br />
                  <Text type="secondary">{analyticsData.performance.social.facebook.engagement}% engagement</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <Text strong>Instagram</Text>
                  <br />
                  <Text style={{ fontSize: '18px', color: '#e1306c' }}>
                    {formatNumber(analyticsData.performance.social.instagram.followers)}
                  </Text>
                  <br />
                  <Text type="secondary">{analyticsData.performance.social.instagram.engagement}% engagement</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const BookingsTab = () => (
    <div>
      {/* Booking Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Bookings"
              value={analyticsData.bookings.total}
              prefix={<BookIcon style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Confirmed"
              value={analyticsData.bookings.confirmed}
              prefix={<CheckIcon style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Pending"
              value={analyticsData.bookings.pending}
              prefix={<ClockIcon style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Monthly Bookings Chart Placeholder */}
      <Card title="Monthly Bookings Trend" style={{ borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <BarChartOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            <br />
            <Text type="secondary">Chart visualization would be implemented here</Text>
          </div>
        </div>
      </Card>

      {/* Top Destinations */}
      <Card title="Top Destinations by Bookings" style={{ borderRadius: '16px' }}>
        <List
          dataSource={analyticsData.bookings.byDestination}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: '#ff6b35' }}>{index + 1}</Avatar>}
                title={item.destination}
                description={`${item.bookings} bookings • ${formatCurrency(item.revenue)} revenue`}
              />
              <div style={{ textAlign: 'right' }}>
                <Progress
                  percent={Math.round((item.bookings / analyticsData.bookings.byDestination[0].bookings) * 100)}
                  size="small"
                  style={{ width: '100px' }}
                />
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  const RevenueTab = () => (
    <div>
      {/* Revenue Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Revenue"
              value={formatCurrency(analyticsData.revenue.total)}
              prefix={<DollarIcon style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Avg. Revenue/Booking"
              value={formatCurrency(analyticsData.revenue.total / analyticsData.bookings.total)}
              prefix={<DollarIcon style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Monthly Growth"
              value={12.5}
              suffix="%"
              prefix={<TrendingUpOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Revenue Growth"
              value={18.3}
              suffix="%"
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue Sources */}
      <Card title="Revenue by Source" style={{ borderRadius: '16px' }}>
        <List
          dataSource={analyticsData.revenue.bySource}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.source}
                description={`${formatCurrency(item.revenue)} (${item.percentage}%)`}
              />
              <Progress
                percent={item.percentage}
                size="small"
                style={{ width: '200px' }}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  const CustomersTab = () => (
    <div>
      {/* Customer Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Customers"
              value={analyticsData.customers.total}
              prefix={<TeamIcon style={{ color: '#ff6b35' }} />}
              valueStyle={{ color: '#ff6b35', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="New Customers"
              value={analyticsData.customers.new}
              prefix={<UserAddOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Returning Customers"
              value={analyticsData.customers.returning}
              prefix={<HeartIcon style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Customer Demographics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Customers by Age Group" style={{ borderRadius: '16px' }}>
            <List
              dataSource={analyticsData.customers.byAge}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.age}
                    description={`${item.count} customers`}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <Text strong>{item.percentage}%</Text>
                    <Progress
                      percent={item.percentage}
                      size="small"
                      style={{ width: '100px' }}
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Customers by Location" style={{ borderRadius: '16px' }}>
            <List
              dataSource={analyticsData.customers.byLocation}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.location}
                    description={`${item.count} customers`}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <Text strong>{item.percentage}%</Text>
                    <Progress
                      percent={item.percentage}
                      size="small"
                      style={{ width: '100px' }}
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
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
            📊 Reports & Analytics
          </Title>
          <Text style={{ fontSize: '14px', color: '#6c757d', fontFamily: "'Poppins', sans-serif" }}>
            Comprehensive analytics and reporting dashboard
          </Text>
        </div>
        
        <Space>
          <Select
            value={exportFormat}
            onChange={setExportFormat}
            style={{ width: '120px', borderRadius: '8px' }}
          >
            <Option value="pdf">PDF</Option>
            <Option value="excel">Excel</Option>
            <Option value="csv">CSV</Option>
          </Select>
          <Button
            icon={<ExportOutlined />}
            onClick={() => handleExport(exportFormat)}
            style={{
              borderRadius: '12px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600'
            }}
          >
            Export Report
          </Button>
          <Button
            icon={<PrinterIcon />}
            style={{
              borderRadius: '12px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600'
            }}
          >
            Print
          </Button>
        </Space>
      </div>

      {/* Date Range Filter */}
      <Card style={{ marginBottom: '24px', borderRadius: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Text strong>Date Range:</Text>
            <DatePicker.RangePicker
              style={{ width: '100%', borderRadius: '8px' }}
              value={dateRange}
              onChange={setDateRange}
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Text strong>Metric:</Text>
            <Select
              value={selectedMetric}
              onChange={setSelectedMetric}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="overview">Overview</Option>
              <Option value="bookings">Bookings</Option>
              <Option value="revenue">Revenue</Option>
              <Option value="customers">Customers</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={12}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                style={{
                  borderRadius: '8px',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                Apply Filters
              </Button>
              <Button
                icon={<ReloadIcon />}
                style={{
                  borderRadius: '8px',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                Refresh Data
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Analytics Content */}
      <Card style={{ borderRadius: '16px' }}>
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: 'overview',
              label: 'Overview',
              children: <OverviewTab />
            },
            {
              key: 'bookings',
              label: 'Bookings',
              children: <BookingsTab />
            },
            {
              key: 'revenue',
              label: 'Revenue',
              children: <RevenueTab />
            },
            {
              key: 'customers',
              label: 'Customers',
              children: <CustomersTab />
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default ReportsAnalytics;
