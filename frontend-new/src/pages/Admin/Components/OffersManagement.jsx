import React, { useState, useEffect } from 'react';
import { offerService, tourService } from '../../../services';
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
  Drawer
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
  QrcodeOutlined
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
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [availableTours, setAvailableTours] = useState([]);

  useEffect(() => {
    fetchOffers();
    fetchTours();
  }, [filterStatus, searchText]);

  const fetchTours = async () => {
    try {
      const tours = await tourService.getAllTours({ all: 'true', limit: 1000 });
      setAvailableTours(Array.isArray(tours) ? tours : (tours?.data || tours?.tours || []));
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    }
  };

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await offerService.getAllOffers({
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchText || undefined
      });
      
      // Transform API data to match component format
      const transformedOffers = Array.isArray(response) ? response.map(offer => ({
        id: offer._id || offer.id,
        title: offer.title,
        code: offer.code,
        type: offer.type,
        value: offer.value,
        description: offer.description || '',
        status: offer.status,
        startDate: offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : null,
        endDate: offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : null,
        minAmount: offer.minAmount || 0,
        maxDiscount: offer.maxDiscount || null,
        usageLimit: offer.usageLimit || null,
        usedCount: offer.usedCount || 0,
        applicableTours: offer.applicableTours || [],
        customerTiers: offer.customerTiers || [],
        image: offer.image || '',
        terms: offer.terms || '',
        createdAt: offer.createdAt ? new Date(offer.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        updatedAt: offer.updatedAt ? new Date(offer.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        ...offer
      })) : [];
      
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
    form.setFieldsValue({
      ...offer,
      startDate: offer.startDate ? new Date(offer.startDate) : null,
      endDate: offer.endDate ? new Date(offer.endDate) : null
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
      await offerService.updateOffer(id, { status: newStatus });
      message.success(`Offer ${newStatus} successfully`);
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
      
      const offerData = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        applicableTours: values.applicableTours || [],
        customerTiers: values.customerTiers || []
      };
      
      if (editingOffer) {
        // Update existing offer
        await offerService.updateOffer(editingOffer.id, offerData);
        message.success('Offer updated successfully');
      } else {
        // Create new offer
        await offerService.createOffer(offerData);
        message.success('Offer created successfully');
      }
      
      setModalVisible(false);
      setEditingOffer(null);
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
    form.resetFields();
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
                         offer.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || offer.status === filterStatus;
    const matchesType = filterType === 'all' || offer.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const totalOffers = offers.length;
  const activeOffers = offers.filter(o => o.status === 'active').length;
  const expiredOffers = offers.filter(o => o.status === 'expired').length;
  const totalUsage = offers.reduce((sum, o) => sum + o.usedCount, 0);

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
            src={record.image}
            style={{ borderRadius: '8px', objectFit: 'cover' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
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
            🎟️ Offers & Coupons Management
          </Title>
          <Text style={{ fontSize: '14px', color: '#6c757d', fontFamily: "'Poppins', sans-serif" }}>
            Create and manage promotional offers, discounts, and coupon codes
          </Text>
        </div>
        
        <Space>
          <Button
            icon={<ImportOutlined />}
            style={{
              borderRadius: '12px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600'
            }}
          >
            Import
          </Button>
          <Button
            icon={<ExportOutlined />}
            style={{
              borderRadius: '12px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600'
            }}
          >
            Export
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
            style={{
              borderRadius: '12px',
              background: '#ff6b35',
              border: 'none',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600'
            }}
          >
            Create Offer
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Offers"
              value={totalOffers}
              prefix={<TagsOutlined style={{ color: '#ff6b35' }} />}
              valueStyle={{ color: '#ff6b35', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Active Offers"
              value={activeOffers}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Expired Offers"
              value={expiredOffers}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Usage"
              value={totalUsage}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Search offers..."
              prefix={<SearchOutlined style={{ color: '#ff6b35' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={12} sm={8} md={4}>
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
          <Col xs={12} sm={8} md={4}>
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
          <Col xs={24} sm={24} md={10}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                style={{
                  borderRadius: '8px',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                More Filters
              </Button>
              <Text type="secondary" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Showing {filteredOffers.length} of {offers.length} offers
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Offers Table */}
      <Card style={{ borderRadius: '16px' }}>
        <Table
          columns={columns}
          dataSource={filteredOffers}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredOffers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} offers`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Offer Details Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            🎟️ Offer Details - {selectedOffer?.title}
          </div>
        }
        open={detailModalVisible}
        onCancel={handleModalCancel}
        width={900}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} style={{ borderRadius: '8px' }}>
            Print
          </Button>,
          <Button key="share" icon={<ShareAltOutlined />} style={{ borderRadius: '8px' }}>
            Share
          </Button>,
          <Button key="qr" icon={<QrcodeOutlined />} style={{ borderRadius: '8px' }}>
            QR Code
          </Button>,
          <Button key="close" onClick={handleModalCancel} style={{ borderRadius: '8px' }}>
            Close
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
                      <Card title="Description" size="small">
                        <Text>{selectedOffer.description}</Text>
                      </Card>
                      <Card title="Terms & Conditions" size="small" style={{ marginTop: '16px' }}>
                        <Text>{selectedOffer.terms}</Text>
                      </Card>
                      <Card title="Applicable Tours" size="small" style={{ marginTop: '16px' }}>
                        <div>
                          {selectedOffer.applicableTours?.map((tour, index) => (
                            <Tag key={index} style={{ margin: '2px' }}>{tour}</Tag>
                          ))}
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
                <DatePicker style={{ width: '100%', borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: 'Please select end date' }]}
              >
                <DatePicker style={{ width: '100%', borderRadius: '8px' }} />
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
