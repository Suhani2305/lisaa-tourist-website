import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../../services';
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

const { Title, Text: TypographyText, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Meta } = Card;

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);
      const [popularDestinations, setPopularDestinations] = useState([]);
  const [customerDemographics, setCustomerDemographics] = useState(null);
  const [topPackages, setTopPackages] = useState([]);
  
  // Filter states
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: null,
    months: [],
    years: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async (filters = appliedFilters) => {
    setLoading(true);
    try {
      // Build period based on filters
      let period = 'month';
      if (filters.years && filters.years.length > 0) {
        period = 'year';
      } else if (filters.months && filters.months.length > 0) {
        period = 'month';
      }

      const [dashboard, revenue, bookings, destinations, demographics] = await Promise.all([
        analyticsService.getDashboardAnalytics(),
        analyticsService.getRevenueTrends(period),
        analyticsService.getBookingTrends(period),
        analyticsService.getPopularDestinations(),
        analyticsService.getCustomerDemographics()
      ]);
      
      // Calculate growth percentages from trends
      const calculateGrowth = (currentData, previousData) => {
        if (!currentData || !previousData || previousData === 0) return 0;
        return ((currentData - previousData) / previousData) * 100;
      };

      // Calculate booking growth from trends
      let bookingGrowth = 0;
      if (bookings && bookings.length >= 2) {
        const currentMonth = bookings[bookings.length - 1]?.count || 0;
        const previousMonth = bookings[bookings.length - 2]?.count || 0;
        bookingGrowth = calculateGrowth(currentMonth, previousMonth);
      }

      // Calculate revenue growth from trends
      let revenueGrowth = 0;
      if (revenue && revenue.length >= 2) {
        const currentMonthRevenue = revenue[revenue.length - 1]?.revenue || 0;
        const previousMonthRevenue = revenue[revenue.length - 2]?.revenue || 0;
        revenueGrowth = calculateGrowth(currentMonthRevenue, previousMonthRevenue);
      }

      // Calculate new vs returning customers
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      // This would need additional API call, for now estimate based on bookings
      const newCustomers = 0; // TODO: Calculate from user registration dates
      const returningCustomers = dashboard.overview?.totalCustomers || 0;

      // Transform destinations data
      const transformedDestinations = destinations.map(dest => ({
        destination: dest._id || 'Unknown',
        bookings: dest.bookings || 0,
        revenue: dest.revenue || 0
      }));

      // Store top packages from dashboard
      setTopPackages(dashboard.topTours || []);

      // Transform API data to match component format
      setAnalyticsData({
        overview: {
          totalBookings: dashboard.overview?.totalBookings || 0,
          totalRevenue: dashboard.overview?.totalRevenue || 0,
          totalCustomers: dashboard.overview?.totalCustomers || 0,
          totalTours: dashboard.overview?.totalTours || 0,
          bookingGrowth: parseFloat(bookingGrowth.toFixed(1)),
          revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
          customerGrowth: 0, // Would need user registration trends
          tourGrowth: 0 // Would need tour creation trends
        },
        bookings: {
          total: dashboard.overview?.totalBookings || 0,
          confirmed: dashboard.bookingStatus?.confirmed || 0,
          pending: dashboard.bookingStatus?.pending || 0,
          cancelled: dashboard.bookingStatus?.cancelled || 0,
          completed: dashboard.bookingStatus?.completed || 0,
          byMonth: bookings || [],
          byDestination: transformedDestinations || []
        },
        customers: {
          total: dashboard.overview?.totalCustomers || 0,
          new: newCustomers,
          returning: returningCustomers,
          byAge: demographics?.byAge || [],
          byGender: demographics?.byGender || [],
          byLocation: demographics?.byLocation || []
        },
        revenue: {
          total: dashboard.overview?.totalRevenue || 0,
          monthly: dashboard.overview?.monthlyRevenue || 0,
          yearly: dashboard.overview?.yearlyRevenue || 0,
          byMonth: revenue || [],
          byDestination: transformedDestinations || []
        },
        performance: {
          website: {
            pageViews: 0,
            uniqueVisitors: 0,
            bounceRate: 0,
            avgSessionDuration: '0:00',
            conversionRate: 0
          },
          social: {
            facebook: { followers: 0, engagement: 0 },
            instagram: { followers: 0, engagement: 0 },
            twitter: { followers: 0, engagement: 0 },
            youtube: { followers: 0, engagement: 0 }
          },
          seo: {
            organicTraffic: 0,
            keywordRankings: 0,
            backlinks: 0,
            domainAuthority: 0
          }
        },
        dashboard: dashboard
      });
      
      // Apply filters to data
      let filteredRevenue = revenue || [];
      let filteredBookings = bookings || [];
      
      if (filters.months && filters.months.length > 0) {
        filteredRevenue = filteredRevenue.filter(item => {
          const itemDate = new Date(item._id + '-01');
          const itemMonth = itemDate.getMonth() + 1;
          return filters.months.includes(itemMonth);
        });
        filteredBookings = filteredBookings.filter(item => {
          const itemDate = new Date(item._id + '-01');
          const itemMonth = itemDate.getMonth() + 1;
          return filters.months.includes(itemMonth);
        });
      }
      
      if (filters.years && filters.years.length > 0) {
        filteredRevenue = filteredRevenue.filter(item => {
          const itemDate = new Date(item._id + '-01');
          const itemYear = itemDate.getFullYear();
          return filters.years.includes(itemYear);
        });
        filteredBookings = filteredBookings.filter(item => {
          const itemDate = new Date(item._id + '-01');
          const itemYear = itemDate.getFullYear();
          return filters.years.includes(itemYear);
        });
      }

      if (filters.dateRange && filters.dateRange.length === 2) {
        const startDate = new Date(filters.dateRange[0]);
        const endDate = new Date(filters.dateRange[1]);
        
        filteredRevenue = filteredRevenue.filter(item => {
          const itemDate = new Date(item._id + '-01');
          return itemDate >= startDate && itemDate <= endDate;
        });
        filteredBookings = filteredBookings.filter(item => {
          const itemDate = new Date(item._id + '-01');
          return itemDate >= startDate && itemDate <= endDate;
        });
      }

      setRevenueTrends(filteredRevenue);
      setBookingTrends(filteredBookings);
      setPopularDestinations(transformedDestinations || []);
      setCustomerDemographics(demographics || null);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      message.error('Failed to fetch analytics data');
      // Fallback to empty data structure
      setAnalyticsData({
        overview: {
          totalBookings: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          totalTours: 0,
          bookingGrowth: 0,
          revenueGrowth: 0,
          customerGrowth: 0,
          tourGrowth: 0
        },
        bookings: {
          total: 0,
          confirmed: 0,
          pending: 0,
          cancelled: 0,
          byMonth: [],
          byDestination: []
        },
        customers: {
          total: 0,
          new: 0,
          returning: 0,
          byAge: [],
          byGender: [],
          byLocation: []
        },
        revenue: {
          total: 0,
          monthly: 0,
          yearly: 0,
          byMonth: [],
          byDestination: []
        },
        performance: {
          website: {
            pageViews: 0,
            uniqueVisitors: 0,
            bounceRate: 0,
            avgSessionDuration: '0:00',
            conversionRate: 0
          },
          social: {
            facebook: { followers: 0, engagement: 0 },
            instagram: { followers: 0, engagement: 0 },
            twitter: { followers: 0, engagement: 0 },
            youtube: { followers: 0, engagement: 0 }
          },
          seo: {
            organicTraffic: 0,
            keywordRankings: 0,
            backlinks: 0,
            domainAuthority: 0
          }
        }
      });
    } finally {
      setLoading(false);
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

  const handleApplyFilters = () => {
    const filters = {
      dateRange: dateRange,
      months: selectedMonths,
      years: selectedYears
    };
    setAppliedFilters(filters);
    fetchAnalytics(filters);
    message.success('Filters applied successfully!');
  };

  const handleRefreshData = () => {
    setDateRange([]);
    setSelectedMonths([]);
    setSelectedYears([]);
    setAppliedFilters({
      dateRange: null,
      months: [],
      years: []
    });
    fetchAnalytics({ dateRange: null, months: [], years: [] });
    message.success('Data refreshed!');
  };

  const handleExport = (format) => {
    try {
      if (!analyticsData) {
        message.warning('No data available to export');
        return;
      }

      // Use filtered data for export
      const exportData = {
        ...analyticsData,
        revenue: {
          ...analyticsData.revenue,
          byMonth: revenueTrends
        },
        bookings: {
          ...analyticsData.bookings,
          byMonth: bookingTrends
        },
        filters: appliedFilters
      };

      if (format === 'csv') {
        // Export as CSV
        const csvData = generateCSV();
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success('CSV report exported successfully!');
      } else if (format === 'excel') {
        // Export as Excel (CSV format with .xlsx extension)
        const csvData = generateCSV();
        const blob = new Blob([csvData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `analytics-report-${new Date().toISOString().split('T')[0]}.xlsx`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success('Excel report exported successfully!');
      } else if (format === 'pdf') {
        // For PDF, we'll use window.print() which allows saving as PDF
        message.info('Opening print dialog. You can save as PDF from there.');
        window.print();
      }
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export report');
    }
  };

  const generateCSV = () => {
    const rows = [];
    
    // Header
    rows.push(['Analytics Report', `Generated: ${new Date().toLocaleString()}`]);
    
    // Filter info
    if (appliedFilters.months.length > 0 || appliedFilters.years.length > 0 || appliedFilters.dateRange) {
      rows.push([]);
      rows.push(['FILTERS APPLIED']);
      if (appliedFilters.months.length > 0) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const selectedMonthNames = appliedFilters.months.map(m => monthNames[m - 1]).join(', ');
        rows.push(['Months', selectedMonthNames]);
      }
      if (appliedFilters.years.length > 0) {
        rows.push(['Years', appliedFilters.years.join(', ')]);
      }
      if (appliedFilters.dateRange && appliedFilters.dateRange.length === 2) {
        rows.push(['Date Range', `${appliedFilters.dateRange[0].toLocaleDateString()} to ${appliedFilters.dateRange[1].toLocaleDateString()}`]);
      }
    }
    rows.push([]);
    
    // Overview
    rows.push(['OVERVIEW']);
    rows.push(['Total Bookings', analyticsData?.overview?.totalBookings || 0]);
    rows.push(['Total Revenue', `₹${formatCurrency(analyticsData?.overview?.totalRevenue || 0).replace('₹', '')}`]);
    rows.push(['Total Customers', analyticsData?.overview?.totalCustomers || 0]);
    rows.push(['Total Tours', analyticsData?.overview?.totalTours || 0]);
    rows.push([]);
    
    // Bookings
    rows.push(['BOOKINGS']);
    rows.push(['Total', analyticsData?.bookings?.total || 0]);
    rows.push(['Confirmed', analyticsData?.bookings?.confirmed || 0]);
    rows.push(['Pending', analyticsData?.bookings?.pending || 0]);
    rows.push(['Cancelled', analyticsData?.bookings?.cancelled || 0]);
    rows.push([]);
    
    // Revenue
    rows.push(['REVENUE']);
    rows.push(['Total Revenue', `₹${formatCurrency(analyticsData?.revenue?.total || 0).replace('₹', '')}`]);
    rows.push(['Monthly Revenue', `₹${formatCurrency(analyticsData?.revenue?.monthly || 0).replace('₹', '')}`]);
    rows.push(['Yearly Revenue', `₹${formatCurrency(analyticsData?.revenue?.yearly || 0).replace('₹', '')}`]);
    rows.push([]);
    
    // Revenue Trends (filtered)
    if (revenueTrends.length > 0) {
      rows.push(['REVENUE TRENDS']);
      rows.push(['Period', 'Revenue', 'Bookings']);
      revenueTrends.forEach(item => {
        rows.push([item._id || 'N/A', `₹${item.revenue || 0}`, item.bookings || item.count || 0]);
      });
      rows.push([]);
    }
    
    // Customer Demographics
    if (customerDemographics) {
      rows.push(['CUSTOMER DEMOGRAPHICS']);
      rows.push([]);
      
      // Age Distribution
      if (customerDemographics.byAge && customerDemographics.byAge.length > 0) {
        rows.push(['CUSTOMERS BY AGE']);
        rows.push(['Age Group', 'Count', 'Percentage']);
        customerDemographics.byAge.forEach(item => {
          rows.push([item.age, item.count, `${item.percentage}%`]);
        });
        rows.push([]);
      }
      
      // Location Distribution
      if (customerDemographics.byLocation && customerDemographics.byLocation.length > 0) {
        rows.push(['CUSTOMERS BY LOCATION']);
        rows.push(['Location', 'Count', 'Percentage']);
        customerDemographics.byLocation.forEach(item => {
          rows.push([item.location, item.count, `${item.percentage}%`]);
        });
        rows.push([]);
      }
      
      // Gender Distribution
      if (customerDemographics.byGender && customerDemographics.byGender.length > 0) {
        rows.push(['CUSTOMERS BY GENDER']);
        rows.push(['Gender', 'Count', 'Percentage']);
        customerDemographics.byGender.forEach(item => {
          rows.push([item.gender, item.count, `${item.percentage}%`]);
        });
      }
    }
    
    // Convert to CSV string
    return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const handlePrint = () => {
    try {
      if (!analyticsData) {
        message.warning('No data available to print');
        return;
      }

      // Create a print-friendly view
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        message.error('Please allow popups to print');
        return;
      }

      // Use filtered data for print
      const printData = {
        ...analyticsData,
        revenue: {
          ...analyticsData.revenue,
          byMonth: revenueTrends
        },
        bookings: {
          ...analyticsData.bookings,
          byMonth: bookingTrends
        }
      };

      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Analytics Report</title>
            <style>
              @media print {
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .no-print { display: none; }
                h1 { color: #2c3e50; border-bottom: 2px solid #ff6b35; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #ff6b35; color: white; }
                .stat { margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
              }
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #2c3e50; border-bottom: 2px solid #ff6b35; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #ff6b35; color: white; }
              .stat { margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h1>📊 Analytics Report</h1>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            ${appliedFilters.months.length > 0 || appliedFilters.years.length > 0 || appliedFilters.dateRange ? `
            <h2>Filters Applied</h2>
            <ul>
              ${appliedFilters.months.length > 0 ? `<li><strong>Months:</strong> ${appliedFilters.months.map(m => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]).join(', ')}</li>` : ''}
              ${appliedFilters.years.length > 0 ? `<li><strong>Years:</strong> ${appliedFilters.years.join(', ')}</li>` : ''}
              ${appliedFilters.dateRange && appliedFilters.dateRange.length === 2 ? `<li><strong>Date Range:</strong> ${appliedFilters.dateRange[0].toLocaleDateString()} to ${appliedFilters.dateRange[1].toLocaleDateString()}</li>` : ''}
            </ul>
            ` : ''}
            <h2>Overview</h2>
            <div class="stat">
              <strong>Total Bookings:</strong> ${analyticsData?.overview?.totalBookings || 0}
            </div>
            <div class="stat">
              <strong>Total Revenue:</strong> ₹${formatCurrency(analyticsData?.overview?.totalRevenue || 0).replace('₹', '')}
            </div>
            <div class="stat">
              <strong>Total Customers:</strong> ${analyticsData?.overview?.totalCustomers || 0}
            </div>
            <div class="stat">
              <strong>Total Tours:</strong> ${analyticsData?.overview?.totalTours || 0}
            </div>
            
            <h2>Bookings Status</h2>
            <table>
              <tr>
                <th>Status</th>
                <th>Count</th>
              </tr>
              <tr>
                <td>Total</td>
                <td>${analyticsData?.bookings?.total || 0}</td>
              </tr>
              <tr>
                <td>Confirmed</td>
                <td>${analyticsData?.bookings?.confirmed || 0}</td>
              </tr>
              <tr>
                <td>Pending</td>
                <td>${analyticsData?.bookings?.pending || 0}</td>
              </tr>
              <tr>
                <td>Cancelled</td>
                <td>${analyticsData?.bookings?.cancelled || 0}</td>
              </tr>
            </table>
            
            <h2>Revenue</h2>
            <table>
              <tr>
                <th>Type</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>Total Revenue</td>
                <td>₹${formatCurrency(analyticsData?.revenue?.total || 0).replace('₹', '')}</td>
              </tr>
              <tr>
                <td>Monthly Revenue</td>
                <td>₹${formatCurrency(analyticsData?.revenue?.monthly || 0).replace('₹', '')}</td>
              </tr>
              <tr>
                <td>Yearly Revenue</td>
                <td>₹${formatCurrency(analyticsData?.revenue?.yearly || 0).replace('₹', '')}</td>
              </tr>
            </table>
            
            ${revenueTrends.length > 0 ? `
            <h2>Revenue Trends (Filtered Data)</h2>
            <table>
              <tr>
                <th>Period</th>
                <th>Revenue</th>
                <th>Bookings</th>
              </tr>
              ${revenueTrends.map(item => `
                <tr>
                  <td>${item._id || 'N/A'}</td>
                  <td>₹${item.revenue || 0}</td>
                  <td>${item.bookings || item.count || 0}</td>
                </tr>
              `).join('')}
            </table>
            ` : ''}
            
            ${customerDemographics && (customerDemographics.byAge?.length > 0 || customerDemographics.byLocation?.length > 0) ? `
            <h2>Customer Demographics</h2>
            ${customerDemographics.byAge && customerDemographics.byAge.length > 0 ? `
            <h3>Customers by Age</h3>
            <table>
              <tr>
                <th>Age Group</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
              ${customerDemographics.byAge.map(item => `
                <tr>
                  <td>${item.age}</td>
                  <td>${item.count}</td>
                  <td>${item.percentage}%</td>
                </tr>
              `).join('')}
            </table>
            ` : ''}
            ${customerDemographics.byLocation && customerDemographics.byLocation.length > 0 ? `
            <h3>Customers by Location</h3>
            <table>
              <tr>
                <th>Location</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
              ${customerDemographics.byLocation.map(item => `
                <tr>
                  <td>${item.location}</td>
                  <td>${item.count}</td>
                  <td>${item.percentage}%</td>
                </tr>
              `).join('')}
            </table>
            ` : ''}
            ` : ''}
            
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
    } catch (error) {
      console.error('Print error:', error);
      message.error('Failed to print report');
    }
  };

  if (!analyticsData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <LoadingOutlined style={{ fontSize: '48px', color: '#1890ff' }} spin />
        <div style={{ marginTop: '16px' }}>
          <TypographyText>Loading analytics data...</TypographyText>
        </div>
      </div>
    );
  }

  const OverviewTab = () => (
    <div>
      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Bookings"
              value={analyticsData?.overview?.totalBookings || 0}
              prefix={<BookIcon style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontFamily: "'Poppins', sans-serif" }}
            />
            <div style={{ marginTop: '8px' }}>
              <TypographyText style={{ color: getGrowthColor(analyticsData.overview.bookingGrowth), fontSize: '12px' }}>
                {getGrowthIcon(analyticsData.overview.bookingGrowth)} {analyticsData.overview.bookingGrowth}% vs last month
              </TypographyText>
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
              <TypographyText style={{ color: getGrowthColor(analyticsData.overview.revenueGrowth), fontSize: '12px' }}>
                {getGrowthIcon(analyticsData.overview.revenueGrowth)} {analyticsData.overview.revenueGrowth}% vs last month
              </TypographyText>
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
              <TypographyText style={{ color: getGrowthColor(analyticsData.overview.customerGrowth), fontSize: '12px' }}>
                {getGrowthIcon(analyticsData.overview.customerGrowth)} {analyticsData.overview.customerGrowth}% vs last month
              </TypographyText>
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
              <TypographyText style={{ color: getGrowthColor(analyticsData.overview.tourGrowth), fontSize: '12px' }}>
                {getGrowthIcon(analyticsData.overview.tourGrowth)} {analyticsData.overview.tourGrowth}% vs last month
              </TypographyText>
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
                  value={formatNumber(analyticsData?.performance?.website?.pageViews || 0)}
                  prefix={<EyeOutlined style={{ color: '#1890ff' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Unique Visitors"
                  value={formatNumber(analyticsData?.performance?.website?.uniqueVisitors || 0)}
                  prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Bounce Rate"
                  value={analyticsData?.performance?.website?.bounceRate || 0}
                  suffix="%"
                  prefix={<FallOutlined style={{ color: '#ff4d4f' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Conversion Rate"
                  value={analyticsData?.performance?.website?.conversionRate || 0}
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
                  <TypographyText strong>Facebook</TypographyText>
                  <br />
                  <TypographyText style={{ fontSize: '18px', color: '#1890ff' }}>
                    {formatNumber(analyticsData?.performance?.social?.facebook?.followers || 0)}
                  </TypographyText>
                  <br />
                  <TypographyText type="secondary">{analyticsData?.performance?.social?.facebook?.engagement || 0}% engagement</TypographyText>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <TypographyText strong>Instagram</TypographyText>
                  <br />
                  <TypographyText style={{ fontSize: '18px', color: '#e1306c' }}>
                    {formatNumber(analyticsData?.performance?.social?.instagram?.followers || 0)}
                  </TypographyText>
                  <br />
                  <TypographyText type="secondary">{analyticsData?.performance?.social?.instagram?.engagement || 0}% engagement</TypographyText>
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

      {/* Monthly Bookings Trend */}
      <Card title="Monthly Bookings Trend" style={{ borderRadius: '16px', marginBottom: '24px' }}>
        {bookingTrends && bookingTrends.length > 0 ? (
          <div style={{ padding: '20px' }}>
            <Table
              dataSource={bookingTrends.map((item, idx) => ({ ...item, key: idx }))}
              columns={[
                {
                  title: 'Period',
                  dataIndex: '_id',
                  key: 'period',
                  render: (text) => text || 'N/A'
                },
                {
                  title: 'Total Bookings',
                  dataIndex: 'count',
                  key: 'count',
                  render: (count) => count || 0
                },
                {
                  title: 'Confirmed',
                  dataIndex: 'confirmed',
                  key: 'confirmed',
                  render: (confirmed) => confirmed || 0
                },
                {
                  title: 'Cancelled',
                  dataIndex: 'cancelled',
                  key: 'cancelled',
                  render: (cancelled) => cancelled || 0
                }
              ]}
              pagination={false}
              size="small"
            />
          </div>
        ) : (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <BarChartOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <br />
              <TypographyText type="secondary">No booking trend data available</TypographyText>
            </div>
          </div>
        )}
      </Card>

      {/* Top Destinations */}
      <Card title="Top Destinations by Bookings" style={{ borderRadius: '16px', marginBottom: '24px' }}>
        {analyticsData.bookings.byDestination && analyticsData.bookings.byDestination.length > 0 ? (
          <List
            dataSource={analyticsData.bookings.byDestination}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#ff6b35' }}>{index + 1}</Avatar>}
                  title={item.destination || 'Unknown'}
                  description={`${item.bookings || 0} bookings • ${formatCurrency(item.revenue || 0)} revenue`}
                />
                <div style={{ textAlign: 'right' }}>
                  {analyticsData.bookings.byDestination[0]?.bookings > 0 && (
                    <Progress
                      percent={Math.round(((item.bookings || 0) / analyticsData.bookings.byDestination[0].bookings) * 100)}
                      size="small"
                      style={{ width: '100px' }}
                    />
                  )}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <TypographyText type="secondary">No destination data available</TypographyText>
          </div>
        )}
      </Card>

      {/* Popular Packages */}
      <Card title="Popular Packages" style={{ borderRadius: '16px' }}>
        {topPackages && topPackages.length > 0 ? (
          <List
            dataSource={topPackages}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      src={item.tour?.images?.[0]} 
                      icon={<BookIcon />}
                      style={{ backgroundColor: '#ff6b35' }}
                    />
                  }
                  title={item.tour?.title || 'Unknown Package'}
                  description={`${item.tour?.destination || 'Unknown'} • ${item.bookings || 0} bookings`}
                />
                <div style={{ textAlign: 'right' }}>
                  <TypographyText strong style={{ fontSize: '16px', color: '#52c41a' }}>
                    {formatCurrency(item.revenue || 0)}
                  </TypographyText>
                  <br />
                  <TypographyText type="secondary" style={{ fontSize: '12px' }}>
                    Revenue
                  </TypographyText>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <TypographyText type="secondary">No package data available</TypographyText>
          </div>
        )}
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
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
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

      {/* Revenue Trends */}
      <Card title="Revenue Trends" style={{ borderRadius: '16px', marginBottom: '24px' }}>
        {revenueTrends && revenueTrends.length > 0 ? (
          <div style={{ padding: '20px' }}>
            <Table
              dataSource={revenueTrends.map((item, idx) => ({ ...item, key: idx }))}
              columns={[
                {
                  title: 'Period',
                  dataIndex: '_id',
                  key: 'period',
                  render: (text) => text || 'N/A'
                },
                {
                  title: 'Revenue',
                  dataIndex: 'revenue',
                  key: 'revenue',
                  render: (revenue) => formatCurrency(revenue || 0)
                },
                {
                  title: 'Bookings',
                  dataIndex: 'bookings',
                  key: 'bookings',
                  render: (bookings) => bookings || item.count || 0
                }
              ]}
              pagination={false}
              size="small"
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <TypographyText type="secondary">No revenue trend data available</TypographyText>
          </div>
        )}
      </Card>

      {/* Revenue by Destination */}
      <Card title="Revenue by Destination" style={{ borderRadius: '16px' }}>
        {analyticsData.revenue.byDestination && analyticsData.revenue.byDestination.length > 0 ? (
          <List
            dataSource={analyticsData.revenue.byDestination}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#52c41a' }}>{index + 1}</Avatar>}
                  title={item.destination || 'Unknown'}
                  description={`${formatCurrency(item.revenue || 0)} revenue`}
                />
                <div style={{ textAlign: 'right' }}>
                  {analyticsData.revenue.byDestination[0]?.revenue > 0 && (
                    <Progress
                      percent={Math.round(((item.revenue || 0) / analyticsData.revenue.byDestination[0].revenue) * 100)}
                      size="small"
                      style={{ width: '100px' }}
                      strokeColor="#52c41a"
                    />
                  )}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <TypographyText type="secondary">No destination revenue data available</TypographyText>
          </div>
        )}
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
                    <TypographyText strong>{item.percentage}%</TypographyText>
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
                    <TypographyText strong>{item.percentage}%</TypographyText>
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
          <TypographyText style={{ fontSize: '14px', color: '#6c757d', fontFamily: "'Poppins', sans-serif" }}>
            Comprehensive analytics and reporting dashboard
          </TypographyText>
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
            onClick={handlePrint}
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

      {/* Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <TypographyText strong style={{ display: 'block', marginBottom: '8px' }}>Date Range:</TypographyText>
            <DatePicker.RangePicker
              style={{ width: '100%', borderRadius: '8px' }}
              value={dateRange}
              onChange={setDateRange}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <TypographyText strong style={{ display: 'block', marginBottom: '8px' }}>Select Months:</TypographyText>
            <Select
              mode="multiple"
              placeholder="Select months"
              value={selectedMonths}
              onChange={setSelectedMonths}
              style={{ width: '100%', borderRadius: '8px' }}
              allowClear
            >
              {[
                { value: 1, label: 'January' },
                { value: 2, label: 'February' },
                { value: 3, label: 'March' },
                { value: 4, label: 'April' },
                { value: 5, label: 'May' },
                { value: 6, label: 'June' },
                { value: 7, label: 'July' },
                { value: 8, label: 'August' },
                { value: 9, label: 'September' },
                { value: 10, label: 'October' },
                { value: 11, label: 'November' },
                { value: 12, label: 'December' }
              ].map(month => (
                <Option key={month.value} value={month.value}>{month.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <TypographyText strong style={{ display: 'block', marginBottom: '8px' }}>Select Years:</TypographyText>
            <Select
              mode="multiple"
              placeholder="Select years"
              value={selectedYears}
              onChange={setSelectedYears}
              style={{ width: '100%', borderRadius: '8px' }}
              allowClear
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <Option key={year} value={year}>{year}</Option>
                );
              })}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <TypographyText strong style={{ display: 'block', marginBottom: '8px' }}>Metric:</TypographyText>
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
          <Col xs={24}>
            <Space>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={handleApplyFilters}
                style={{
                  borderRadius: '8px',
                  fontFamily: "'Poppins', sans-serif",
                  background: '#ff6b35',
                  border: 'none'
                }}
              >
                Apply Filters
              </Button>
              <Button
                icon={<ReloadIcon />}
                onClick={handleRefreshData}
                style={{
                  borderRadius: '8px',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                Refresh Data
              </Button>
              {(appliedFilters.months.length > 0 || appliedFilters.years.length > 0 || appliedFilters.dateRange) && (
                <TypographyText type="secondary" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Filters Active: 
                  {appliedFilters.months.length > 0 && ` ${appliedFilters.months.length} month(s)`}
                  {appliedFilters.years.length > 0 && ` ${appliedFilters.years.length} year(s)`}
                  {appliedFilters.dateRange && ' Date Range'}
                </TypographyText>
              )}
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
