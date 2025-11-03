import React, { useState, useEffect } from 'react';
import { bookingService } from '../../../services';
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
  Rate
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
  GlobalOutlined
} from '@ant-design/icons';

// Import Google Font (Poppins) - Same as landing page
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [filterStatus, filterPayment, searchText]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Fetch bookings from real API only - NO MOCK DATA
      const response = await bookingService.getAllBookings({
        status: filterStatus !== 'all' ? filterStatus : undefined,
        payment: filterPayment !== 'all' ? filterPayment : undefined
      });
      
      if (response && Array.isArray(response)) {
        // Transform API data to match component format
        const processedBookings = response.map(booking => ({
          id: booking._id,
          bookingNumber: booking.bookingNumber || booking._id,
          user: booking.user ? {
            name: booking.user.name || 'N/A',
            email: booking.user.email || 'N/A',
            phone: booking.user.phone || 'N/A',
            avatar: booking.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user.name || 'User')}&background=ff6b35&color=fff`
          } : {},
          tour: booking.tour ? {
            title: booking.tour.title || 'N/A',
            destination: booking.tour.destination || 'N/A',
            duration: booking.tour.duration ? `${booking.tour.duration.days} Days / ${booking.tour.duration.nights} Nights` : 'N/A',
            image: booking.tour.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400',
            category: booking.tour.category || 'General'
          } : {},
          travelers: Array.isArray(booking.travelers) ? booking.travelers : [],
          contactInfo: booking.contactInfo || {},
          travelDates: booking.travelDates || {
            startDate: booking.bookingDate || new Date().toISOString(),
            endDate: booking.bookingDate || new Date().toISOString()
          },
          pricing: booking.pricing || {
            basePrice: booking.totalAmount || 0,
            totalAmount: booking.totalAmount || 0,
            discount: 0,
            taxes: 0,
            finalAmount: booking.totalAmount || 0
          },
          payment: booking.payment || {
            status: booking.paymentStatus || 'pending',
            method: booking.paymentMethod || 'N/A',
            transactionId: booking.paymentId || 'N/A',
            paymentDate: booking.paymentDate || null
          },
          status: booking.status || 'pending',
          specialRequests: booking.specialRequests || '',
          notes: booking.notes || '',
          cancellationPolicy: booking.cancellationPolicy || {},
          createdAt: booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : '',
          updatedAt: booking.updatedAt ? new Date(booking.updatedAt).toISOString().split('T')[0] : ''
        }));
        setBookings(processedBookings);
      } else {
        // If no bookings, set empty array
        setBookings([]);
        message.info('No bookings found');
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      message.error(error.message || 'Failed to fetch bookings. Please try again.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailModalVisible(true);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    form.setFieldsValue({
      ...booking,
      travelDates: [
        new Date(booking.travelDates.startDate),
        new Date(booking.travelDates.endDate)
      ]
    });
    setModalVisible(true);
  };

  const handleDeleteBooking = async (id) => {
    try {
      const response = await bookingService.cancelBooking(id);
      if (response) {
        setBookings(bookings.filter(booking => booking.id !== id));
        message.success('Booking deleted successfully');
      } else {
        message.error('Failed to delete booking');
      }
    } catch (error) {
      console.error('Delete booking error:', error);
      message.error(error.message || 'Failed to delete booking');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await bookingService.updateBookingStatus(id, newStatus);
      if (response) {
        setBookings(bookings.map(booking => 
          booking.id === id 
            ? { ...booking, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
            : booking
        ));
        message.success(`Booking status updated to ${newStatus}`);
      } else {
        message.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Update booking status error:', error);
      message.error(error.message || 'Failed to update booking status');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingBooking) {
        // Update existing booking
        const updatedBookings = bookings.map(booking =>
          booking.id === editingBooking.id
            ? { 
                ...booking, 
                ...values, 
                travelDates: {
                  startDate: values.travelDates[0].toISOString().split('T')[0],
                  endDate: values.travelDates[1].toISOString().split('T')[0]
                },
                updatedAt: new Date().toISOString().split('T')[0] 
              }
            : booking
        );
        setBookings(updatedBookings);
        message.success('Booking updated successfully');
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setDetailModalVisible(false);
    form.resetFields();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      case 'completed': return 'blue';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'orange';
      case 'failed': return 'red';
      case 'refunded': return 'purple';
      default: return 'default';
    }
  };

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         booking.tour.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         booking.bookingNumber.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || booking.payment.status === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate statistics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalRevenue = bookings
    .filter(b => b.payment.status === 'paid')
    .reduce((sum, b) => sum + b.pricing.finalAmount, 0);

  const columns = [
    {
      title: 'Booking Details',
      key: 'booking',
      width: 350,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image
            width={60}
            height={60}
            src={record.tour.image}
            style={{ borderRadius: '8px', objectFit: 'cover' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong style={{ fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>
                {record.bookingNumber}
              </Text>
              <Tag color="blue" style={{ fontSize: '10px' }}>
                {record.tour?.category || 'N/A'}
              </Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <Text style={{ fontSize: '13px', fontWeight: '600', fontFamily: "'Poppins', sans-serif" }}>
                {record.tour?.title || 'N/A'}
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <EnvironmentOutlined style={{ color: '#ff6b35', fontSize: '12px' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.tour?.destination || 'N/A'}
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <CalendarOutlined style={{ color: '#ff6b35', fontSize: '12px' }} />
              <Text style={{ fontSize: '12px' }}>
                {record.travelDates?.startDate || 'N/A'} - {record.travelDates?.endDate || 'N/A'}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            src={record.user.avatar} 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#ff6b35' }}
          />
          <div>
            <Text strong style={{ fontSize: '13px', fontFamily: "'Poppins', sans-serif" }}>
              {record.user?.name || 'N/A'}
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <MailOutlined style={{ color: '#ff6b35', fontSize: '10px' }} />
              <Text type="secondary" style={{ fontSize: '11px' }}>
                {record.user?.email || 'N/A'}
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <PhoneOutlined style={{ color: '#ff6b35', fontSize: '10px' }} />
              <Text type="secondary" style={{ fontSize: '11px' }}>
                {record.user?.phone || 'N/A'}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Travelers',
      key: 'travelers',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TeamOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>{record.travelers?.length || 0} travelers</Text>
          </div>
          <div style={{ marginTop: '4px' }}>
            {record.travelers?.map((traveler, index) => (
              <Tag key={index} size="small" style={{ fontSize: '10px', margin: '1px' }}>
                {traveler?.name || 'Unknown'} ({traveler?.type || 'N/A'})
              </Tag>
            )) || <Text type="secondary" style={{ fontSize: '10px' }}>No travelers</Text>}
          </div>
        </div>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
            <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>
              ₹{record.pricing?.finalAmount?.toLocaleString() || '0'}
            </Text>
          </div>
          {record.pricing?.discount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <Text delete style={{ fontSize: '12px', color: '#999' }}>
                ₹{record.pricing?.totalAmount?.toLocaleString() || '0'}
              </Text>
              <Tag color="red" style={{ fontSize: '10px' }}>
                -₹{record.pricing?.discount?.toLocaleString() || '0'}
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Payment',
      key: 'payment',
      width: 120,
      render: (_, record) => (
        <div>
          <Tag color={getPaymentStatusColor(record.payment?.status)} style={{ textTransform: 'capitalize' }}>
            {record.payment?.status || 'N/A'}
          </Tag>
          <div style={{ marginTop: '4px' }}>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {record.payment?.method?.replace('-', ' ').toUpperCase() || 'N/A'}
            </Text>
          </div>
          {record.payment?.transactionId && (
            <div style={{ marginTop: '2px' }}>
              <Text type="secondary" style={{ fontSize: '10px' }}>
                {record.payment.transactionId}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ textTransform: 'capitalize' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
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
          <Tooltip title="Edit Booking">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditBooking(record)}
              style={{ color: '#ff6b35' }}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Confirm Booking">
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'confirmed')}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          {record.status === 'confirmed' && (
            <Tooltip title="Mark Complete">
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'completed')}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
          )}
          {record.status !== 'cancelled' && (
            <Tooltip title="Cancel Booking">
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'cancelled')}
                style={{ color: '#ff4d4f' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete Booking">
            <Popconfirm
              title="Are you sure you want to delete this booking?"
              onConfirm={() => handleDeleteBooking(record.id)}
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
            📅 Bookings Management
          </Title>
          <Text style={{ fontSize: '14px', color: '#6c757d', fontFamily: "'Poppins', sans-serif" }}>
            Manage all customer bookings, payments, and travel arrangements
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
            icon={<DownloadOutlined />}
            style={{
              borderRadius: '12px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600'
            }}
          >
            Reports
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Bookings"
              value={totalBookings}
              prefix={<CalendarOutlined style={{ color: '#ff6b35' }} />}
              valueStyle={{ color: '#ff6b35', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Confirmed"
              value={confirmedBookings}
              prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Pending"
              value={pendingBookings}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix="₹"
              valueStyle={{ color: '#1890ff', fontFamily: "'Poppins', sans-serif" }}
              formatter={(value) => value.toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Search bookings..."
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
              <Option value="pending">Pending</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              placeholder="Payment"
              value={filterPayment}
              onChange={setFilterPayment}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Payments</Option>
              <Option value="paid">Paid</Option>
              <Option value="pending">Pending</Option>
              <Option value="failed">Failed</Option>
              <Option value="refunded">Refunded</Option>
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
                Showing {filteredBookings.length} of {bookings.length} bookings
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Bookings Table */}
      <Card style={{ borderRadius: '16px' }}>
        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredBookings.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Booking Details Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            📋 Booking Details - {selectedBooking?.bookingNumber}
          </div>
        }
        open={detailModalVisible}
        onCancel={handleModalCancel}
        width={900}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} style={{ borderRadius: '8px' }}>
            Print
          </Button>,
          <Button key="email" icon={<SendOutlined />} style={{ borderRadius: '8px' }}>
            Email
          </Button>,
          <Button key="close" onClick={handleModalCancel} style={{ borderRadius: '8px' }}>
            Close
          </Button>
        ]}
      >
        {selectedBooking && (
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
                          <Card title="Customer Information" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Name">{selectedBooking.user.name}</Descriptions.Item>
                              <Descriptions.Item label="Email">{selectedBooking.user.email}</Descriptions.Item>
                              <Descriptions.Item label="Phone">{selectedBooking.user.phone}</Descriptions.Item>
                              <Descriptions.Item label="Emergency Contact">
                                {selectedBooking.contactInfo.emergencyContact.name} ({selectedBooking.contactInfo.emergencyContact.relation})
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Tour Information" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Tour">{selectedBooking.tour.title}</Descriptions.Item>
                              <Descriptions.Item label="Destination">{selectedBooking.tour.destination}</Descriptions.Item>
                              <Descriptions.Item label="Duration">{selectedBooking.tour.duration}</Descriptions.Item>
                              <Descriptions.Item label="Category">{selectedBooking.tour.category}</Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                      </Row>
                      
                      <Divider />
                      
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card title="Travel Dates" size="small">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <CalendarOutlined style={{ color: '#ff6b35' }} />
                              <Text>{selectedBooking.travelDates.startDate} to {selectedBooking.travelDates.endDate}</Text>
                            </div>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Payment Status" size="small">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <CreditCardOutlined style={{ color: '#ff6b35' }} />
                              <Tag color={getPaymentStatusColor(selectedBooking.payment.status)}>
                                {selectedBooking.payment.status.toUpperCase()}
                              </Tag>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                              <Text type="secondary">Method: {selectedBooking.payment.method.replace('-', ' ').toUpperCase()}</Text>
                            </div>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  )
                },
                {
                  key: 'travelers',
                  label: 'Travelers',
                  children: (
                    <div>
                      <Title level={5}>Traveler Details</Title>
                      {selectedBooking.travelers.map((traveler, index) => (
                        <Card key={index} size="small" style={{ marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#ff6b35' }} />
                            <div>
                              <Text strong>{traveler.name}</Text>
                              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                <Tag size="small">{traveler.type}</Tag>
                                <Tag size="small">{traveler.gender}</Tag>
                                <Tag size="small">Age: {traveler.age}</Tag>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )
                },
                {
                  key: 'pricing',
                  label: 'Pricing',
                  children: (
                    <div>
                      <Card title="Pricing Breakdown" size="small">
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="Base Price">₹{selectedBooking.pricing.basePrice.toLocaleString()}</Descriptions.Item>
                          {selectedBooking.pricing.discount > 0 && (
                            <Descriptions.Item label="Discount">-₹{selectedBooking.pricing.discount.toLocaleString()}</Descriptions.Item>
                          )}
                          <Descriptions.Item label="Taxes">₹{selectedBooking.pricing.taxes.toLocaleString()}</Descriptions.Item>
                          <Descriptions.Item label="Total Amount" style={{ fontWeight: 'bold', color: '#52c41a' }}>
                            ₹{selectedBooking.pricing.finalAmount.toLocaleString()}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </div>
                  )
                },
                {
                  key: 'notes',
                  label: 'Notes & Requests',
                  children: (
                    <div>
                      <Card title="Special Requests" size="small">
                        <Text>{selectedBooking.specialRequests || 'No special requests'}</Text>
                      </Card>
                      <Card title="Admin Notes" size="small" style={{ marginTop: '16px' }}>
                        <Text>{selectedBooking.notes || 'No admin notes'}</Text>
                      </Card>
                    </div>
                  )
                }
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Edit Booking Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            {editingBooking ? 'Edit Booking' : 'Add New Booking'}
          </div>
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText="Save Booking"
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
          <Tabs 
            defaultActiveKey="basic"
            items={[
              {
                key: 'basic',
                label: 'Basic Information',
                children: (
                  <div>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="status"
                          label="Booking Status"
                          rules={[{ required: true, message: 'Please select status' }]}
                        >
                          <Select placeholder="Select status" style={{ borderRadius: '8px' }}>
                            <Option value="pending">Pending</Option>
                            <Option value="confirmed">Confirmed</Option>
                            <Option value="cancelled">Cancelled</Option>
                            <Option value="completed">Completed</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={['payment', 'status']}
                          label="Payment Status"
                          rules={[{ required: true, message: 'Please select payment status' }]}
                        >
                          <Select placeholder="Select payment status" style={{ borderRadius: '8px' }}>
                            <Option value="pending">Pending</Option>
                            <Option value="paid">Paid</Option>
                            <Option value="failed">Failed</Option>
                            <Option value="refunded">Refunded</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="travelDates"
                          label="Travel Dates"
                          rules={[{ required: true, message: 'Please select travel dates' }]}
                        >
                          <DatePicker.RangePicker style={{ width: '100%', borderRadius: '8px' }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={['payment', 'method']}
                          label="Payment Method"
                        >
                          <Select placeholder="Select payment method" style={{ borderRadius: '8px' }}>
                            <Option value="credit-card">Credit Card</Option>
                            <Option value="debit-card">Debit Card</Option>
                            <Option value="net-banking">Net Banking</Option>
                            <Option value="upi">UPI</Option>
                            <Option value="wallet">Wallet</Option>
                            <Option value="cash">Cash</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="specialRequests"
                      label="Special Requests"
                    >
                      <TextArea
                        rows={3}
                        placeholder="Enter special requests"
                        style={{ borderRadius: '8px' }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="notes"
                      label="Admin Notes"
                    >
                      <TextArea
                        rows={3}
                        placeholder="Enter admin notes"
                        style={{ borderRadius: '8px' }}
                      />
                    </Form.Item>
                  </div>
                )
              }
            ]}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default BookingsManagement;
