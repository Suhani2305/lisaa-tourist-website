import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { offerService, tourService, stateService, mediaService } from '../../../services';
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
  Radio,
  Alert,
  Pagination
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
  UploadOutlined,
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
  ReloadOutlined
} from '@ant-design/icons';

// Import Google Font (Poppins) - Same as landing page
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [form] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [availableTours, setAvailableTours] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [applicabilityType, setApplicabilityType] = useState('all'); // 'all', 'tours', 'cities', 'states'
  const [imageFileList, setImageFileList] = useState([]);
  const [tablePage, setTablePage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(window.innerWidth <= 768 ? 5 : 10);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth <= 768) {
        setTablePageSize(5);
      } else {
        setTablePageSize(10);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setTablePage(1);
  }, [searchText, filterStatus, filterType]);

  useEffect(() => {
    fetchOffers();
    fetchTours();
    fetchStates();
    fetchCities();
  }, [filterStatus, searchText]);

  const fetchTours = async () => {
    try {
      const tours = await tourService.getAllTours({ all: 'true', limit: 1000 });
      setAvailableTours(Array.isArray(tours) ? tours : (tours?.data || tours?.tours || []));
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    }
  };

  const fetchStates = async () => {
    try {
      const states = await stateService.getAllStates({ all: 'true' });
      setAvailableStates(Array.isArray(states) ? states : (states?.states || []));
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await stateService.getAllCities({ all: 'true' });
      // Handle different response formats
      let citiesArray = [];
      if (Array.isArray(response)) {
        citiesArray = response;
      } else if (response?.cities && Array.isArray(response.cities)) {
        citiesArray = response.cities;
      } else if (response?.data?.cities && Array.isArray(response.data.cities)) {
        citiesArray = response.data.cities;
      }
      setAvailableCities(citiesArray);
      console.log('✅ Cities loaded:', citiesArray.length);
    } catch (error) {
      console.error('❌ Failed to fetch cities:', error);
      message.error('Failed to load cities. Please refresh the page.');
      setAvailableCities([]);
    }
  };

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await offerService.getAllOffers({
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchText || undefined
      });
      
      const now = dayjs();
      
      // Transform API data to match component format
      const transformedOffers = Array.isArray(response) ? response.map(offer => {
        const formattedStart = offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : null;
        const formattedEnd = offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : null;
        // Auto-mark coupons whose end date has passed
        const hasExpired = formattedEnd ? dayjs(formattedEnd).endOf('day').isBefore(now) : false;
        
        return {
        ...offer,
        id: offer._id || offer.id,
        title: offer.title,
        code: offer.code,
        type: offer.type,
        value: offer.value,
        description: offer.description || '',
        status: offer.status,
        startDate: formattedStart,
        endDate: formattedEnd,
        minAmount: offer.minAmount || 0,
        maxDiscount: offer.maxDiscount || null,
        usageLimit: offer.usageLimit || null,
        usedCount: offer.usedCount || 0,
        applicableToAll: offer.applicableToAll || false,
        applicableTours: offer.applicableTours || [],
        applicableCities: offer.applicableCities || [],
        applicableStates: offer.applicableStates || [],
        customerTiers: offer.customerTiers || [],
        image: offer.image || '',
        terms: offer.terms || '',
        createdAt: offer.createdAt ? new Date(offer.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        updatedAt: offer.updatedAt ? new Date(offer.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: hasExpired ? 'expired' : offer.status,
      };
      }) : [];
      
      setOffers(transformedOffers);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
      message.error('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (offer) => {
    setSelectedOffer(offer);
    setDetailModalVisible(true);
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    
    // Determine applicability type based on existing data
    let appType = 'all';
    if (offer.applicableTours && offer.applicableTours.length > 0) {
      appType = 'tours';
    } else if (offer.applicableCities && offer.applicableCities.length > 0) {
      appType = 'cities';
    } else if (offer.applicableStates && offer.applicableStates.length > 0) {
      appType = 'states';
    }
    
    setApplicabilityType(appType);
    
    // Convert applicableTours to array of IDs if they're objects
    const toursArray = offer.applicableTours 
      ? offer.applicableTours.map(t => typeof t === 'object' ? (t._id || t.id) : t)
      : [];
    
    // Set image file list if image exists
    const imageValue = offer.image || '';
    if (imageValue) {
      setImageFileList([{
        uid: '-1',
        name: 'coupon-image',
        status: 'done',
        url: imageValue
      }]);
    } else {
      setImageFileList([]);
    }
    
    form.setFieldsValue({
      ...offer,
      startDate: offer.startDate ? (dayjs(offer.startDate).isValid() ? dayjs(offer.startDate) : null) : null,
      endDate: offer.endDate ? (dayjs(offer.endDate).isValid() ? dayjs(offer.endDate) : null) : null,
      image: imageValue,
      applicabilityType: appType,
      applicableTours: toursArray,
      applicableCities: offer.applicableCities || [],
      applicableStates: offer.applicableStates || []
    });
    setModalVisible(true);
  };

  const handleDeleteOffer = async (id) => {
    try {
      await offerService.deleteOffer(id);
      message.success('Offer deleted successfully');
      fetchOffers(); // Refresh list
    } catch (error) {
      console.error('Failed to delete offer:', error);
      message.error('Failed to delete offer');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await offerService.updateOffer(id, { status: newStatus });
      message.success(`Offer ${newStatus} successfully`);
      if (response?.notificationQueued) {
        message.info('Customers will be notified about this coupon shortly via email & WhatsApp.');
      }
      fetchOffers(); // Refresh list
    } catch (error) {
      console.error('Failed to update offer status:', error);
      message.error('Failed to update offer status');
    }
  };

  const handleDuplicateOffer = async (offer) => {
    try {
      const newOfferData = {
        ...offer,
        title: `${offer.title} (Copy)`,
        code: `${offer.code}COPY`,
        status: 'inactive',
        usedCount: 0
      };
      delete newOfferData.id;
      delete newOfferData._id;
      delete newOfferData.createdAt;
      delete newOfferData.updatedAt;
      
      await offerService.createOffer(newOfferData);
      message.success('Offer duplicated successfully');
      fetchOffers(); // Refresh list
    } catch (error) {
      console.error('Failed to duplicate offer:', error);
      message.error('Failed to duplicate offer');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Determine applicableToAll and clear other fields based on applicabilityType
      const appType = values.applicabilityType || applicabilityType || 'all';
      const applicableToAll = appType === 'all';
      
      const offerData = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        applicableToAll: applicableToAll,
        applicableTours: appType === 'tours' ? (values.applicableTours || []) : [],
        applicableCities: appType === 'cities' ? (values.applicableCities || []) : [],
        applicableStates: appType === 'states' ? (values.applicableStates || []) : [],
        customerTiers: values.customerTiers || []
      };
      
      // Remove applicabilityType from offerData as it's not part of the schema
      delete offerData.applicabilityType;
      
      let response;
      if (editingOffer) {
        // Update existing offer
        response = await offerService.updateOffer(editingOffer.id, offerData);
        message.success('Offer updated successfully');
      } else {
        // Create new offer
        response = await offerService.createOffer(offerData);
        message.success('Offer created successfully');
      }

      if (response?.notificationQueued) {
        message.info('Customers will be notified about this coupon shortly via email & WhatsApp.');
      }
      
      setModalVisible(false);
      setEditingOffer(null);
      setApplicabilityType('all');
      form.resetFields();
      fetchOffers(); // Refresh list
    } catch (error) {
      console.error('Failed to save offer:', error);
      message.error(error.message || 'Failed to save offer');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setDetailModalVisible(false);
    setEditingOffer(null);
    setApplicabilityType('all');
    setImageFileList([]);
    form.resetFields();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && selectedOffer) {
      try {
        await navigator.share({
          title: selectedOffer.title,
          text: `Check out this offer: ${selectedOffer.code}`,
          url: window.location.href
        });
        message.success('Offer shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Fallback: Copy to clipboard
          const shareText = `Offer: ${selectedOffer.title}\nCode: ${selectedOffer.code}\n${window.location.href}`;
          navigator.clipboard.writeText(shareText).then(() => {
            message.success('Offer details copied to clipboard!');
          });
        }
      }
    } else {
      // Fallback: Copy to clipboard
      if (selectedOffer) {
        const shareText = `Offer: ${selectedOffer.title}\nCode: ${selectedOffer.code}\n${window.location.href}`;
        navigator.clipboard.writeText(shareText).then(() => {
          message.success('Offer details copied to clipboard!');
        }).catch(() => {
          message.info('Share functionality not available');
        });
      }
    }
  };

  const handleQRCode = () => {
    if (selectedOffer) {
      const qrData = {
        type: 'offer',
        code: selectedOffer.code,
        title: selectedOffer.title
      };
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify(qrData))}`;
      
      // Open QR code in new window or show in modal
      Modal.info({
        title: 'QR Code for Offer',
        width: 400,
        content: (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <img src={qrUrl} alt="QR Code" style={{ maxWidth: '100%' }} />
            <p style={{ marginTop: '16px', fontFamily: "'Poppins', sans-serif" }}>
              Scan to get offer code: <strong>{selectedOffer.code}</strong>
            </p>
          </div>
        ),
        okText: 'Close',
        okButtonProps: {
          style: { borderRadius: '8px' }
        }
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'draft': return 'orange';
      case 'expired': return 'red';
      case 'paused': return 'blue';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'percentage': return 'blue';
      case 'fixed': return 'green';
      case 'free_shipping': return 'purple';
      case 'buy_one_get_one': return 'gold';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'percentage': return <PercentageOutlined />;
      case 'fixed': return <DollarOutlined />;
      case 'free_shipping': return <CarOutlined />;
      case 'buy_one_get_one': return <GiftOutlined />;
      default: return <TagsOutlined />;
    }
  };

  // Filter offers based on search and filters
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         offer.code.toLowerCase().includes(searchText.toLowerCase()) ||
                         (offer.description || '').toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || offer.status === filterStatus;
    const matchesType = filterType === 'all' || offer.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get paginated offers
  const getPaginatedOffers = () => {
    const start = (tablePage - 1) * tablePageSize;
    const end = start + tablePageSize;
    return filteredOffers.slice(start, end);
  };

  const paginatedOffers = getPaginatedOffers();
  const totalOffersCount = filteredOffers.length;

  const handleExport = () => {
    try {
      // Create CSV headers
      const headers = ['Code', 'Title', 'Type', 'Value', 'Status', 'Start Date', 'End Date', 'Usage Limit', 'Used Count', 'Min Amount', 'Max Discount'];
      
      // Create CSV rows
      const rows = filteredOffers.map(offer => [
        offer.code || 'N/A',
        offer.title || 'N/A',
        offer.type || 'N/A',
        offer.value || 0,
        offer.status || 'N/A',
        offer.startDate || 'N/A',
        offer.endDate || 'N/A',
        offer.usageLimit || 'Unlimited',
        offer.usedCount || 0,
        offer.minAmount || 0,
        offer.maxDiscount || 'N/A'
      ]);
      
      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `offers_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('Offers exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export offers');
    }
  };

  // Calculate statistics
  const totalOffers = offers.length;
  const activeOffers = offers.filter(o => o.status === 'active').length;
  const expiredOffers = offers.filter(o => o.status === 'expired').length;
  const totalUsage = offers.reduce((sum, o) => sum + (o.usedCount || 0), 0);

  const columns = [
    {
      title: 'Offer Details',
      key: 'offer',
      width: 350,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image
            width={60}
            height={60}
            src={record.image || null}
            style={{ borderRadius: '8px', objectFit: 'cover' }}
            fallback="https://via.placeholder.com/60x60?text=No+Image"
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong style={{ fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>
                {record.title}
              </Text>
              <Tag color={getTypeColor(record.type)} icon={getTypeIcon(record.type)} style={{ fontSize: '10px' }}>
                {record.type.toUpperCase()}
              </Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <TagsOutlined style={{ color: '#ff6b35', fontSize: '10px' }} />
              <Text type="secondary" style={{ fontSize: '11px' }}>
                Code: {record.code}
              </Text>
            </div>
            <div style={{ marginTop: '4px' }}>
              <Text style={{ fontSize: '12px' }}>{record.description}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Discount',
      key: 'discount',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DollarOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
            <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>
              {record.type === 'percentage' ? `${record.value}%` : `₹${record.value}`}
            </Text>
          </div>
          {record.maxDiscount && (
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                Max: ₹{record.maxDiscount.toLocaleString()}
              </Text>
            </div>
          )}
          {record.minAmount && (
            <div style={{ marginTop: '2px' }}>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                Min: ₹{record.minAmount.toLocaleString()}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Usage',
      key: 'usage',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>{record.usedCount}/{record.usageLimit || '∞'}</Text>
          </div>
          <div style={{ marginTop: '4px' }}>
            <Progress 
              percent={record.usageLimit ? Math.round((record.usedCount / record.usageLimit) * 100) : 0}
              size="small"
              strokeColor="#ff6b35"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Validity',
      key: 'validity',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CalendarOutlined style={{ color: '#faad14', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>{record.startDate}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <CalendarOutlined style={{ color: '#faad14', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>{record.endDate}</Text>
          </div>
          <div style={{ marginTop: '4px' }}>
            <Text type="secondary" style={{ fontSize: '10px' }}>
              {new Date(record.endDate) < new Date() ? 'Expired' : 'Active'}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)} style={{ textTransform: 'capitalize' }}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Edit Offer">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditOffer(record)}
              style={{ color: '#ff6b35' }}
            />
          </Tooltip>
          <Tooltip title="Duplicate Offer">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleDuplicateOffer(record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="Share Offer">
            <Button
              type="text"
              icon={<ShareAltOutlined />}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          {record.status === 'active' && (
            <Tooltip title="Pause Offer">
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'paused')}
                style={{ color: '#faad14' }}
              />
            </Tooltip>
          )}
          {record.status === 'paused' && (
            <Tooltip title="Activate Offer">
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'active')}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete Offer">
            <Popconfirm
              title="Are you sure you want to delete this offer?"
              onConfirm={() => handleDeleteOffer(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ 
      fontFamily: "'Poppins', sans-serif",
      padding: windowWidth <= 768 ? '16px' : '24px',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        marginBottom: windowWidth <= 768 ? '20px' : '32px',
        textAlign: 'center'
      }}>
        <Title level={1} style={{ 
          fontSize: windowWidth <= 768 ? '1.8rem' : windowWidth <= 1024 ? '2.5rem' : '3rem', 
          fontWeight: '800', 
          color: '#FF6B35',
          margin: '0 auto 16px auto',
          fontFamily: "'Playfair Display', 'Georgia', serif",
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          textAlign: 'center'
        }}>
          Offers Management
        </Title>
        <p style={{ 
          fontSize: windowWidth <= 768 ? '13px' : '16px',
          color: '#6c757d',
          margin: '0 auto',
          fontFamily: "'Poppins', sans-serif",
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          Create and manage promotional offers, discounts, and coupon codes
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[windowWidth <= 768 ? 12 : 16, windowWidth <= 768 ? 12 : 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={12} lg={6}>
          <Card style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Total Offers</span>}
              value={totalOffers}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Active Offers</span>}
              value={activeOffers}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
            color: 'white'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Expired Offers</span>}
              value={expiredOffers}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Total Usage</span>}
              value={totalUsage}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions Bar */}
      <Card style={{ 
        marginBottom: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: 'none',
        padding: windowWidth <= 768 ? '16px' : '20px'
      }}>
        <Row gutter={[12, 12]}>
          {windowWidth <= 768 ? (
            <>
              <Col xs={16}>
                <Input
                  placeholder="Search offers..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </Col>
              <Col xs={8}>
                <Select
                  placeholder="Status"
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  <Option value="all">All Status</Option>
                  <Option value="active">Active</Option>
                  <Option value="draft">Draft</Option>
                  <Option value="expired">Expired</Option>
                  <Option value="paused">Paused</Option>
                </Select>
              </Col>
              <Col xs={12}>
                <Select
                  placeholder="Type"
                  value={filterType}
                  onChange={setFilterType}
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  <Option value="all">All Types</Option>
                  <Option value="percentage">Percentage</Option>
                  <Option value="fixed">Fixed Amount</Option>
                  <Option value="free_shipping">Free Shipping</Option>
                  <Option value="buy_one_get_one">BOGO</Option>
                </Select>
              </Col>
              <Col xs={6}>
                <Tooltip title="Refresh">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchOffers}
                    loading={loading}
                    size="middle"
                    style={{ borderRadius: '8px', width: '100%' }}
                  />
                </Tooltip>
              </Col>
              <Col xs={6}>
                <Tooltip title="Export">
                  <Button
                    icon={<ExportOutlined />}
                    onClick={handleExport}
                    size="middle"
                    style={{ borderRadius: '8px', width: '100%' }}
                  />
                </Tooltip>
              </Col>
              <Col xs={24}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setApplicabilityType('all');
                    setImageFileList([]);
                    form.resetFields();
                    form.setFieldsValue({ applicabilityType: 'all' });
                    setModalVisible(true);
                  }}
                  size="middle"
                  style={{ 
                    borderRadius: '8px', 
                    width: '100%',
                    background: '#ff6b35',
                    border: 'none',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: '600'
                  }}
                >
                  Create Offer
                </Button>
              </Col>
            </>
          ) : (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input
                  placeholder="Search offers..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </Col>
              <Col xs={12} sm={6} md={4} lg={3}>
                <Select
                  placeholder="Status"
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  <Option value="all">All Status</Option>
                  <Option value="active">Active</Option>
                  <Option value="draft">Draft</Option>
                  <Option value="expired">Expired</Option>
                  <Option value="paused">Paused</Option>
                </Select>
              </Col>
              <Col xs={12} sm={6} md={4} lg={3}>
                <Select
                  placeholder="Type"
                  value={filterType}
                  onChange={setFilterType}
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  <Option value="all">All Types</Option>
                  <Option value="percentage">Percentage</Option>
                  <Option value="fixed">Fixed Amount</Option>
                  <Option value="free_shipping">Free Shipping</Option>
                  <Option value="buy_one_get_one">BOGO</Option>
                </Select>
              </Col>
              <Col xs={12} sm={6} md={4} lg={3}>
                <Tooltip title="Refresh">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchOffers}
                    loading={loading}
                    size={windowWidth <= 768 ? 'middle' : 'large'}
                    style={{ borderRadius: '8px', width: '100%' }}
                  >
                    {windowWidth > 768 && 'Refresh'}
                  </Button>
                </Tooltip>
              </Col>
              <Col xs={12} sm={6} md={4} lg={3}>
                <Tooltip title="Export to CSV">
                  <Button
                    icon={<ExportOutlined />}
                    onClick={handleExport}
                    size={windowWidth <= 768 ? 'middle' : 'large'}
                    style={{ borderRadius: '8px', width: '100%' }}
                  >
                    {windowWidth > 768 && 'Export'}
                  </Button>
                </Tooltip>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setApplicabilityType('all');
                    setImageFileList([]);
                    form.resetFields();
                    form.setFieldsValue({ applicabilityType: 'all' });
                    setModalVisible(true);
                  }}
                  size={windowWidth <= 768 ? 'middle' : 'large'}
                  style={{ 
                    borderRadius: '8px', 
                    width: '100%',
                    background: '#ff6b35',
                    border: 'none',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: '600'
                  }}
                >
                  {windowWidth > 768 ? 'Create Offer' : 'Create'}
                </Button>
              </Col>
            </>
          )}
        </Row>
      </Card>

      {/* Offers Table */}
      <Card style={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: 'none'
      }}>
        <Table
          columns={columns}
          dataSource={paginatedOffers}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1200 }}
          rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
        />
        
        {/* Custom Pagination */}
        <div style={{ 
          marginTop: '24px', 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Pagination
            current={tablePage}
            total={totalOffersCount}
            pageSize={tablePageSize}
            onChange={(page, size) => {
              setTablePage(page);
              setTablePageSize(size);
            }}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={['5', '10', '20', '50']}
            style={{ textAlign: 'center' }}
          />
          <div style={{ 
            textAlign: 'center',
            color: '#6c757d',
            fontSize: '14px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            {totalOffersCount > 0 
              ? `${(tablePage - 1) * tablePageSize + 1}-${Math.min(tablePage * tablePageSize, totalOffersCount)} of ${totalOffersCount} offers`
              : 'No offers found'
            }
          </div>
        </div>
      </Card>

      {/* Offer Details Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            Offer Details - {selectedOffer?.title}
          </div>
        }
        open={detailModalVisible}
        onCancel={handleModalCancel}
        width={900}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint} style={{ borderRadius: '8px' }}>
            Print
          </Button>,
          <Button key="share" icon={<ShareAltOutlined />} onClick={handleShare} style={{ borderRadius: '8px' }}>
            Share
          </Button>,
          <Button key="qr" icon={<QrcodeOutlined />} onClick={handleQRCode} style={{ borderRadius: '8px' }}>
            QR Code
          </Button>
        ]}
      >
        {selectedOffer && (
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Tabs 
              defaultActiveKey="overview"
              items={[
                {
                  key: 'overview',
                  label: 'Overview',
                  children: (
                    <div>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card title="Offer Information" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Title">{selectedOffer.title}</Descriptions.Item>
                              <Descriptions.Item label="Code">{selectedOffer.code}</Descriptions.Item>
                              <Descriptions.Item label="Type">
                                <Tag color={getTypeColor(selectedOffer.type)} icon={getTypeIcon(selectedOffer.type)}>
                                  {selectedOffer.type.toUpperCase()}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Status">
                                <Tag color={getStatusColor(selectedOffer.status)}>
                                  {selectedOffer.status.toUpperCase()}
                                </Tag>
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Discount Details" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Value">
                                {selectedOffer.type === 'percentage' ? `${selectedOffer.value}%` : `₹${selectedOffer.value}`}
                              </Descriptions.Item>
                              <Descriptions.Item label="Min Amount">₹{selectedOffer.minAmount?.toLocaleString() || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Max Discount">₹{selectedOffer.maxDiscount?.toLocaleString() || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Usage Limit">{selectedOffer.usageLimit || 'Unlimited'}</Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                      </Row>
                      
                      <Divider />
                      
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card title="Validity Period" size="small">
                            <Text strong>Start Date:</Text>
                            <br />
                            <Text>{selectedOffer.startDate}</Text>
                            <br /><br />
                            <Text strong>End Date:</Text>
                            <br />
                            <Text>{selectedOffer.endDate}</Text>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Usage Statistics" size="small">
                            <Text strong>Used Count:</Text>
                            <br />
                            <Text>{selectedOffer.usedCount}</Text>
                            <br /><br />
                            <Text strong>Remaining:</Text>
                            <br />
                            <Text>{selectedOffer.usageLimit ? selectedOffer.usageLimit - selectedOffer.usedCount : 'Unlimited'}</Text>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  )
                },
                {
                  key: 'details',
                  label: 'Details',
                  children: (
                    <div>
                      <Row gutter={[16, 16]}>
                        <Col span={16}>
                          <Card title="Description" size="small">
                            <Text>{selectedOffer.description || 'No description available'}</Text>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card title="QR Code" size="small" style={{ textAlign: 'center' }}>
                            {selectedOffer.code && (
                              <>
                                <img 
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedOffer.code)}`} 
                                  alt="QR Code" 
                                  style={{ 
                                    maxWidth: '100%', 
                                    height: 'auto',
                                    border: '1px solid #e8e8e8',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    backgroundColor: '#fff'
                                  }} 
                                />
                                <div style={{ marginTop: '12px' }}>
                                  <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                    Offer Code:
                                  </Text>
                                  <Text 
                                    copyable 
                                    style={{ 
                                      fontSize: '16px', 
                                      fontWeight: '600',
                                      color: '#ff6b35',
                                      fontFamily: "'Poppins', sans-serif"
                                    }}
                                  >
                                    {selectedOffer.code}
                                  </Text>
                                </div>
                              </>
                            )}
                          </Card>
                        </Col>
                      </Row>
                      <Card title="Terms & Conditions" size="small" style={{ marginTop: '16px' }}>
                        <Text>{selectedOffer.terms || 'No terms and conditions specified'}</Text>
                      </Card>
                      <Card title="Applicability" size="small" style={{ marginTop: '16px' }}>
                        <div>
                          {selectedOffer.applicableToAll ? (
                            <Tag color="green" style={{ margin: '2px' }}>
                              <GlobalOutlined style={{ marginRight: '4px' }} />
                              All Available Packages
                            </Tag>
                          ) : (
                            <>
                              {selectedOffer.applicableTours && selectedOffer.applicableTours.length > 0 && (
                                <div style={{ marginBottom: '12px' }}>
                                  <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                    <BookOutlined style={{ marginRight: '4px' }} />
                                    Specific Tours ({selectedOffer.applicableTours.length}):
                                  </Text>
                                  {selectedOffer.applicableTours.map((tour, index) => (
                                    <Tag key={index} color="blue" style={{ margin: '2px' }}>
                                      {typeof tour === 'object' ? tour.title || tour._id : tour}
                                    </Tag>
                          ))}
                                </div>
                              )}
                              {selectedOffer.applicableCities && selectedOffer.applicableCities.length > 0 && (
                                <div style={{ marginBottom: '12px' }}>
                                  <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                    <EnvironmentOutlined style={{ marginRight: '4px' }} />
                                    Cities ({selectedOffer.applicableCities.length}):
                                  </Text>
                                  {selectedOffer.applicableCities.map((city, index) => (
                                    <Tag key={index} color="orange" style={{ margin: '2px' }}>
                                      {city}
                                    </Tag>
                                  ))}
                                </div>
                              )}
                              {selectedOffer.applicableStates && selectedOffer.applicableStates.length > 0 && (
                                <div>
                                  <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                    <HomeOutlined style={{ marginRight: '4px' }} />
                                    States ({selectedOffer.applicableStates.length}):
                                  </Text>
                                  {selectedOffer.applicableStates.map((state, index) => (
                                    <Tag key={index} color="purple" style={{ margin: '2px' }}>
                                      {state}
                                    </Tag>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </Card>
                    </div>
                  )
                }
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Add/Edit Offer Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            {editingOffer ? 'Edit Offer' : 'Create New Offer'}
          </div>
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText="Save Offer"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            background: '#ff6b35',
            border: 'none',
            borderRadius: '8px',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '600'
          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: '8px',
            fontFamily: "'Poppins', sans-serif"
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Offer Title"
                rules={[{ required: true, message: 'Please enter offer title' }]}
              >
                <Input placeholder="Enter offer title" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Coupon Code"
                rules={[{ required: true, message: 'Please enter coupon code' }]}
              >
                <Input placeholder="Enter coupon code" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea
              rows={3}
              placeholder="Enter offer description"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Coupon Image"
            extra="Upload an image for the coupon (optional, max 5MB)"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={imageFileList}
              beforeUpload={(file) => {
                // Check file size (max 5MB)
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error('Image must be smaller than 5MB!');
                  return false;
                }
                // Check file type
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('You can only upload image files!');
                  return false;
                }
                return false; // Prevent auto upload
              }}
              onChange={async (info) => {
                const { fileList } = info;
                setImageFileList(fileList);
                
                if (fileList.length > 0) {
                  const file = fileList[0].originFileObj;
                  if (file) {
                    // Upload directly to Cloudinary instead of Base64
                    try {
                      message.loading({ content: 'Uploading image...', key: 'upload' });
                      const response = await mediaService.uploadImage(file);
                      if (response.url) {
                        form.setFieldValue('image', response.url);
                        message.success({ content: 'Image uploaded successfully!', key: 'upload' });
                        // Update fileList with the uploaded URL for preview
                        setImageFileList([{
                          ...fileList[0],
                          url: response.url,
                          status: 'done'
                        }]);
                      }
                    } catch (error) {
                      console.error('Image upload error:', error);
                      message.error({ content: error.message || 'Failed to upload image', key: 'upload' });
                      setImageFileList([]);
                      form.setFieldValue('image', '');
                    }
                  } else if (fileList[0].url) {
                    // If it's an existing image (from edit mode)
                    form.setFieldValue('image', fileList[0].url);
                  }
                } else {
                  form.setFieldValue('image', '');
                }
              }}
              accept="image/*"
              onRemove={() => {
                setImageFileList([]);
                form.setFieldValue('image', '');
                return true;
              }}
            >
              {imageFileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Offer Type"
                rules={[{ required: true, message: 'Please select offer type' }]}
              >
                <Select placeholder="Select type" style={{ borderRadius: '8px' }}>
                  <Option value="percentage">Percentage</Option>
                  <Option value="fixed">Fixed Amount</Option>
                  <Option value="free_shipping">Free Shipping</Option>
                  <Option value="buy_one_get_one">Buy One Get One</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="value"
                label="Discount Value"
                rules={[{ required: true, message: 'Please enter discount value' }]}
              >
                <InputNumber
                  placeholder="Enter value"
                  style={{ width: '100%', borderRadius: '8px' }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status" style={{ borderRadius: '8px' }}>
                  <Option value="draft">Draft</Option>
                  <Option value="active">Active</Option>
                  <Option value="paused">Paused</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: 'Please select start date' }]}
              >
                <DatePicker 
                  style={{ width: '100%', borderRadius: '8px' }}
                  format="YYYY-MM-DD"
                  disabledDate={(current) => {
                    if (!current) return false;
                    if (!dayjs.isDayjs(current) || !current.isValid()) return false;
                    return false; // Allow all dates for start date
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[
                  { required: true, message: 'Please select end date' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.resolve();
                      }
                      const startDate = getFieldValue('startDate');
                      if (startDate && dayjs.isDayjs(value) && dayjs.isDayjs(startDate) && value.isBefore(startDate)) {
                        return Promise.reject('End date must be after start date');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker 
                  style={{ width: '100%', borderRadius: '8px' }}
                  format="YYYY-MM-DD"
                  disabledDate={(current) => {
                    if (!current) return false;
                    if (!dayjs.isDayjs(current) || !current.isValid()) return false;
                    const startDate = form.getFieldValue('startDate');
                    if (startDate && dayjs.isDayjs(startDate) && startDate.isValid()) {
                      return current.isBefore(startDate.startOf('day'));
                    }
                    return false;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="minAmount"
                label="Minimum Amount"
              >
                <InputNumber
                  placeholder="Enter minimum amount"
                  style={{ width: '100%', borderRadius: '8px' }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxDiscount"
                label="Maximum Discount"
              >
                <InputNumber
                  placeholder="Enter max discount"
                  style={{ width: '100%', borderRadius: '8px' }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="usageLimit"
                label="Usage Limit"
              >
                <InputNumber
                  placeholder="Enter usage limit"
                  style={{ width: '100%', borderRadius: '8px' }}
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" style={{ marginTop: '24px', marginBottom: '16px' }}>
            <GlobalOutlined style={{ marginRight: '8px' }} />
            Applicability Settings
          </Divider>

          <Form.Item
            name="applicabilityType"
            label="Apply Coupon To"
            rules={[{ required: true, message: 'Please select applicability type' }]}
            initialValue="all"
          >
            <Radio.Group
              value={applicabilityType}
              onChange={(e) => {
                setApplicabilityType(e.target.value);
                form.setFieldsValue({
                  applicableTours: [],
                  applicableCities: [],
                  applicableStates: []
                });
              }}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value="all">
                  <Text strong>All Available Packages</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Coupon applies to all tours and packages
                  </Text>
                </Radio>
                <Radio value="tours">
                  <Text strong>Specific Tours</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Select specific tours for this coupon
                  </Text>
                </Radio>
                <Radio value="cities">
                  <Text strong>Specific Cities</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Coupon applies to all tours in selected cities
                  </Text>
                </Radio>
                <Radio value="states">
                  <Text strong>Specific States</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Coupon applies to all tours in selected states
                  </Text>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {applicabilityType === 'tours' && (
            <Form.Item
              name="applicableTours"
              label="Select Tours"
              rules={[{ required: true, message: 'Please select at least one tour' }]}
            >
              <Select
                mode="multiple"
                placeholder="Select tours for this coupon"
                style={{ width: '100%', borderRadius: '8px' }}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={availableTours.map(tour => ({
                  label: `${tour.title} - ${tour.destination || 'N/A'}`,
                  value: tour._id || tour.id
                }))}
              />
            </Form.Item>
          )}

          {applicabilityType === 'cities' && (
            <Form.Item
              name="applicableCities"
              label="Select Cities"
              rules={[{ required: true, message: 'Please select at least one city' }]}
            >
              {availableCities.length === 0 ? (
                <Alert
                  message="No cities available"
                  description="Please ensure cities are added to the system first."
                  type="warning"
                  style={{ borderRadius: '8px' }}
                />
              ) : (
                <Select
                  mode="multiple"
                  placeholder="Select cities for this coupon"
                  style={{ width: '100%', borderRadius: '8px' }}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={Array.from(
                    new Map(
                      availableCities
                        .filter(city => city && city.name) // Filter out invalid cities
                        .map(city => {
                          const cityName = city.name.trim();
                          const cityState = city.state ? `, ${city.state.trim()}` : '';
                          const label = `${cityName}${cityState}`;
                          // Use city name as key to remove duplicates
                          return [cityName, { label, value: cityName }];
                        })
                    ).values()
                  )}
                />
              )}
            </Form.Item>
          )}

          {applicabilityType === 'states' && (
            <Form.Item
              name="applicableStates"
              label="Select States"
              rules={[{ required: true, message: 'Please select at least one state' }]}
            >
              <Select
                mode="multiple"
                placeholder="Select states for this coupon"
                style={{ width: '100%', borderRadius: '8px' }}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={availableStates.map(state => ({
                  label: state.name,
                  value: state.slug || state.name
                }))}
              />
            </Form.Item>
          )}

          <Form.Item
            name="terms"
            label="Terms & Conditions"
          >
            <TextArea
              rows={3}
              placeholder="Enter terms and conditions"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OffersManagement;
