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
  Rate,
  Empty,
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
  BookOutlined,
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

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [form] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [gridPage, setGridPage] = useState(1);
  const [gridPageSize, setGridPageSize] = useState(window.innerWidth <= 768 ? 6 : 12);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modificationRequests, setModificationRequests] = useState([]);
  const [modificationLoading, setModificationLoading] = useState(false);
  const [modificationModalVisible, setModificationModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processingRequest, setProcessingRequest] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth <= 768) {
        setGridPageSize(6); // 6 items per page on mobile
      } else {
        setGridPageSize(12); // 12 items per page on desktop
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setGridPage(1);
  }, [searchText, filterStatus, filterPayment]);

  useEffect(() => {
    fetchBookings();
    fetchModificationRequests();
  }, [filterStatus, filterPayment, searchText]);

  const fetchModificationRequests = async () => {
    setModificationLoading(true);
    try {
      const response = await bookingService.getModificationRequests('pending');
      if (response && response.requests) {
        setModificationRequests(response.requests);
      }
    } catch (error) {
      console.error('Failed to fetch modification requests:', error);
      message.error('Failed to load modification requests');
    } finally {
      setModificationLoading(false);
    }
  };

  const handleProcessRequest = async (action) => {
    if (!selectedRequest) return;
    
    try {
      setProcessingRequest(true);
      await bookingService.processModificationRequest(
        selectedRequest.bookingId,
        selectedRequest.id,
        action,
        adminNotes
      );
      message.success(`Modification request ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      setModificationModalVisible(false);
      setSelectedRequest(null);
      setAdminNotes('');
      fetchModificationRequests();
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Failed to process request:', error);
      message.error(error.message || 'Failed to process modification request');
    } finally {
      setProcessingRequest(false);
    }
  };

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
    const matchesSearch = booking.user?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                         booking.tour?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                         booking.bookingNumber?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || booking.payment?.status === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate paginated data for grid view
  const getPaginatedBookings = () => {
    const startIndex = (gridPage - 1) * gridPageSize;
    const endIndex = startIndex + gridPageSize;
    return filteredBookings.slice(startIndex, endIndex);
  };

  const paginatedBookings = getPaginatedBookings();
  const totalBookingsCount = filteredBookings.length;

  // Export bookings to CSV
  const handleExport = () => {
    try {
      // Create CSV headers
      const headers = ['Booking Number', 'Customer Name', 'Customer Email', 'Tour Title', 'Destination', 'Travel Dates', 'Travelers', 'Amount', 'Payment Status', 'Booking Status'];
      
      // Create CSV rows
      const rows = filteredBookings.map(booking => [
        booking.bookingNumber || 'N/A',
        booking.user?.name || 'N/A',
        booking.user?.email || 'N/A',
        booking.tour?.title || 'N/A',
        booking.tour?.destination || 'N/A',
        `${booking.travelDates?.startDate || 'N/A'} - ${booking.travelDates?.endDate || 'N/A'}`,
        booking.travelers?.length || 0,
        booking.pricing?.finalAmount || 0,
        booking.payment?.status || 'N/A',
        booking.status || 'N/A'
      ]);
      
      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('Bookings exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export bookings');
    }
  };

  // Calculate statistics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalRevenue = bookings
    .filter(b => b.payment?.status === 'paid')
    .reduce((sum, b) => sum + (b.pricing?.finalAmount || 0), 0);

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
    <div style={{ 
      padding: windowWidth <= 768 ? '16px' : '24px',
      fontFamily: "'Poppins', sans-serif",
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
          Bookings Management
        </Title>
        <p style={{ 
          fontSize: windowWidth <= 768 ? '13px' : '16px',
          color: '#6c757d',
          margin: '0 auto',
          fontFamily: "'Poppins', sans-serif",
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          Manage all customer bookings, payments, and travel arrangements
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Total Bookings</span>}
              value={totalBookings}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Confirmed</span>}
              value={confirmedBookings}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Pending</span>}
              value={pendingBookings}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Total Revenue</span>}
              value={totalRevenue}
              prefix="₹"
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '20px' : '28px', fontWeight: '700' }}
              formatter={(value) => value.toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions Bar */}
      <Card 
        style={{ 
          marginBottom: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
        bodyStyle={{ padding: windowWidth <= 768 ? '12px' : '20px' }}
      >
        <Row gutter={[12, 12]} align="middle">
          {/* Row 1: Search and Status Filter (mobile) / All filters (desktop) */}
          <Col xs={16} sm={24} md={8}>
            <Input
              placeholder="Search bookings..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              allowClear
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={8} sm={24} md={4}>
            <Select
              placeholder="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Status</Option>
              <Option value="pending">Pending</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Col>
          
          {/* Row 2: Payment, Refresh, Export (mobile) / Continue in same row (desktop) */}
          <Col xs={12} sm={24} md={4}>
            <Select
              placeholder="Payment"
              value={filterPayment}
              onChange={setFilterPayment}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Payments</Option>
              <Option value="paid">Paid</Option>
              <Option value="pending">Pending</Option>
              <Option value="failed">Failed</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
          </Col>
          <Col xs={6} sm={12} md={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                fetchBookings();
                fetchModificationRequests();
              }}
              loading={loading}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              style={{ borderRadius: '8px', width: '100%' }}
            >
              {windowWidth > 768 && 'Refresh'}
            </Button>
          </Col>
          <Col xs={6} sm={12} md={4}>
            <Tooltip title="Export Bookings to CSV">
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
        </Row>
      </Card>

      {/* Tabs for Bookings and Modification Requests */}
      <Card style={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: 'none'
      }}>
        <Tabs
          defaultActiveKey="bookings"
          items={[
            {
              key: 'bookings',
              label: (
                <span>
                  <BookOutlined /> All Bookings
                  {modificationRequests.length > 0 && (
                    <Badge count={modificationRequests.length} offset={[8, -2]} />
                  )}
                </span>
              ),
              children: (
                <>
                  <Row gutter={[windowWidth <= 768 ? 12 : 16, windowWidth <= 768 ? 12 : 16]}>
                    {filteredBookings.length === 0 ? (
                      <Col span={24}>
                        <Empty 
                          description={
                            <span style={{ color: '#999', fontFamily: "'Poppins', sans-serif" }}>
                              {bookings.length === 0 ? 'No bookings found.' : 'No bookings match your filters.'}
                            </span>
                          }
                        />
                      </Col>
                    ) : (
                      paginatedBookings.map((booking) => (
                          <Col xs={24} sm={12} lg={8} xl={6} key={booking.id}>
                            <Card
                              hoverable
                              style={{
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                border: 'none',
                                overflow: 'hidden',
                                height: '100%',
                                transition: 'all 0.3s ease'
                              }}
                              cover={
                                booking.tour?.image ? (
                                  <div 
                                    style={{ 
                                      height: '200px', 
                                      overflow: 'hidden', 
                                      position: 'relative',
                                      cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                      const img = e.currentTarget.querySelector('img');
                                      if (img) img.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                      const img = e.currentTarget.querySelector('img');
                                      if (img) img.style.transform = 'scale(1)';
                                    }}
                                  >
                                    <Image
                                      alt={booking.tour?.title || 'Tour'}
                                      src={booking.tour.image}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease'
                                      }}
                                      preview={false}
                                    />
                                    <Tag
                                      color={getStatusColor(booking.status)}
                                      style={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        fontSize: '11px',
                                        padding: '4px 8px',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                        textTransform: 'capitalize'
                                      }}
                                    >
                                      {booking.status}
                                    </Tag>
                                  </div>
                                ) : (
                                  <div style={{ 
                                    height: '200px', 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <Text style={{ color: 'white', fontSize: '48px', fontWeight: 'bold' }}>
                                      {booking.bookingNumber?.charAt(0)?.toUpperCase() || 'B'}
                                    </Text>
                                  </div>
                                )
                              }
                              bodyStyle={{ padding: '16px' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                              }}
                              actions={[
                                <Tooltip title="View Details">
                                  <EyeOutlined 
                                    key="view" 
                                    onClick={() => handleViewDetails(booking)}
                                    style={{ 
                                      fontSize: '18px', 
                                      color: '#1890ff',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#40a9ff';
                                      e.currentTarget.style.transform = 'scale(1.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#1890ff';
                                      e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                  />
                                </Tooltip>,
                                <Tooltip title="Edit Booking">
                                  <EditOutlined 
                                    key="edit" 
                                    onClick={() => handleEditBooking(booking)}
                                    style={{ 
                                      fontSize: '18px', 
                                      color: '#ff6b35',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ff8c5a';
                                      e.currentTarget.style.transform = 'scale(1.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#ff6b35';
                                      e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                  />
                                </Tooltip>,
                                <Popconfirm
                                  title="Delete this booking?"
                                  description="This action cannot be undone."
                                  onConfirm={() => handleDeleteBooking(booking.id)}
                                  okText="Yes"
                                  cancelText="No"
                                  okButtonProps={{ danger: true }}
                                >
                                  <Tooltip title="Delete Booking">
                                    <DeleteOutlined 
                                      key="delete"
                                      style={{ 
                                        fontSize: '18px', 
                                        color: '#ff4d4f',
                                        transition: 'all 0.2s ease'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#ff7875';
                                        e.currentTarget.style.transform = 'scale(1.2)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#ff4d4f';
                                        e.currentTarget.style.transform = 'scale(1)';
                                      }}
                                    />
                                  </Tooltip>
                                </Popconfirm>
                              ]}
                            >
                              <Title level={5} style={{ 
                                marginBottom: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#2c3e50',
                                fontFamily: "'Poppins', sans-serif"
                              }}>
                                {booking.bookingNumber}
                              </Title>
                              <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                                {booking.tour?.title || 'N/A'}
                              </Text>
                              <div style={{ marginBottom: '8px' }}>
                                <Avatar 
                                  src={booking.user?.avatar} 
                                  icon={<UserOutlined />}
                                  size="small"
                                  style={{ marginRight: '8px' }}
                                />
                                <Text style={{ fontSize: '13px' }}>
                                  {booking.user?.name || 'N/A'}
                                </Text>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                <div>
                                  <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                                    ₹{booking.pricing?.finalAmount?.toLocaleString() || '0'}
                                  </Text>
                                </div>
                                <Tag color={getPaymentStatusColor(booking.payment?.status)} style={{ textTransform: 'capitalize' }}>
                                  {booking.payment?.status || 'N/A'}
                                </Tag>
                              </div>
                            </Card>
                          </Col>
                        ))
                      )}
                    </Row>
                    {filteredBookings.length > 0 && (
                      <div style={{ 
                        marginTop: '24px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: windowWidth <= 768 ? '16px 0' : '24px 0'
                      }}>
                        <Pagination
                          current={gridPage}
                          total={totalBookingsCount}
                          pageSize={gridPageSize}
                          onChange={(page, pageSize) => {
                            setGridPage(page);
                            setGridPageSize(pageSize);
                          }}
                          showSizeChanger
                          showQuickJumper={windowWidth > 768}
                          pageSizeOptions={['6', '12', '24', '48']}
                          style={{
                            fontFamily: "'Poppins', sans-serif"
                          }}
                        />
                        <div style={{
                          marginTop: '12px',
                          textAlign: 'center',
                          color: '#6c757d',
                          fontSize: windowWidth <= 768 ? '13px' : '14px',
                          fontFamily: "'Poppins', sans-serif"
                        }}>
                          {`${(gridPage - 1) * gridPageSize + 1}-${Math.min(gridPage * gridPageSize, totalBookingsCount)} of ${totalBookingsCount} bookings`}
                        </div>
                      </div>
                    )}
                  </>
                )
            },
            {
              key: 'modifications',
              label: (
                <span>
                  <EditOutlined /> Modification Requests
                  {modificationRequests.length > 0 && (
                    <Badge count={modificationRequests.length} offset={[8, -2]} />
                  )}
                </span>
              ),
              children: (
                <div>
                  {modificationRequests.length > 0 ? (
                    <Table
                      dataSource={modificationRequests}
                      rowKey="id"
                      loading={modificationLoading}
                      columns={[
                        {
                          title: 'Booking #',
                          dataIndex: 'bookingNumber',
                          key: 'bookingNumber',
                          render: (text) => <Text strong>{text}</Text>
                        },
                        {
                          title: 'Customer',
                          key: 'customer',
                          render: (_, record) => (
                            <div>
                              <div>{record.user?.name || 'N/A'}</div>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {record.user?.email || 'N/A'}
                              </Text>
                            </div>
                          )
                        },
                        {
                          title: 'Tour',
                          key: 'tour',
                          render: (_, record) => record.tour?.title || 'N/A'
                        },
                        {
                          title: 'Request Type',
                          dataIndex: 'type',
                          key: 'type',
                          render: (type) => {
                            const typeMap = {
                              'date_change': { label: 'Date Change', color: 'blue' },
                              'traveler_add': { label: 'Add Traveler', color: 'green' },
                              'traveler_remove': { label: 'Remove Traveler', color: 'orange' },
                              'traveler_update': { label: 'Update Traveler', color: 'cyan' },
                              'special_request': { label: 'Special Request', color: 'purple' },
                              'other': { label: 'Other', color: 'default' }
                            };
                            const typeInfo = typeMap[type] || typeMap['other'];
                            return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
                          }
                        },
                        {
                          title: 'Price Difference',
                          dataIndex: 'priceDifference',
                          key: 'priceDifference',
                          render: (amount) => {
                            if (!amount || amount === 0) return <Text>-</Text>;
                            const isPositive = amount > 0;
                            return (
                              <Text style={{ color: isPositive ? '#ff4d4f' : '#52c41a' }}>
                                {isPositive ? '+' : ''}₹{Math.abs(amount).toLocaleString()}
                              </Text>
                            );
                          }
                        },
                        {
                          title: 'Requested',
                          dataIndex: 'requestedAt',
                          key: 'requestedAt',
                          render: (date) => new Date(date).toLocaleDateString()
                        },
                        {
                          title: 'Actions',
                          key: 'actions',
                          render: (_, record) => (
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => {
                                setSelectedRequest(record);
                                setModificationModalVisible(true);
                              }}
                            >
                              Review
                            </Button>
                          )
                        }
                      ]}
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `${total} pending requests`
                      }}
                    />
                  ) : (
                    <Empty
                      description="No pending modification requests"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </div>
              )
            }
          ]}
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

      {/* Modification Request Review Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            <EditOutlined style={{ marginRight: '8px', color: '#ff6b35' }} />
            Review Modification Request
          </div>
        }
        open={modificationModalVisible}
        onCancel={() => {
          setModificationModalVisible(false);
          setSelectedRequest(null);
          setAdminNotes('');
        }}
        footer={null}
        width={700}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {selectedRequest && (
          <div>
            <Descriptions bordered column={1} size="middle" style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="Booking Number">
                <Text strong>{selectedRequest.bookingNumber}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                <div>
                  <div>{selectedRequest.user?.name || 'N/A'}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {selectedRequest.user?.email || 'N/A'}
                  </Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Tour">
                {selectedRequest.tour?.title || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Request Type">
                <Tag color="blue">
                  {selectedRequest.type === 'date_change' && 'Date Change'}
                  {selectedRequest.type === 'traveler_add' && 'Add Traveler'}
                  {selectedRequest.type === 'traveler_remove' && 'Remove Traveler'}
                  {selectedRequest.type === 'traveler_update' && 'Update Traveler'}
                  {selectedRequest.type === 'special_request' && 'Special Request'}
                  {selectedRequest.type === 'other' && 'Other'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Requested At">
                {new Date(selectedRequest.requestedAt).toLocaleString()}
              </Descriptions.Item>
              {selectedRequest.priceDifference !== 0 && (
                <Descriptions.Item label="Price Difference">
                  <Text style={{ 
                    color: selectedRequest.priceDifference > 0 ? '#ff4d4f' : '#52c41a',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    {selectedRequest.priceDifference > 0 ? '+' : ''}₹{Math.abs(selectedRequest.priceDifference).toLocaleString()}
                  </Text>
                  {selectedRequest.requiresPayment && (
                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#ff4d4f' }}>
                      Additional payment required
                    </div>
                  )}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Request Details */}
            <Card title="Request Details" size="small" style={{ marginBottom: '16px' }}>
              {selectedRequest.type === 'date_change' && (
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>New Start Date: </Text>
                    <Text>{selectedRequest.requestDetails?.newStartDate ? new Date(selectedRequest.requestDetails.newStartDate).toLocaleDateString() : 'N/A'}</Text>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>New End Date: </Text>
                    <Text>{selectedRequest.requestDetails?.newEndDate ? new Date(selectedRequest.requestDetails.newEndDate).toLocaleDateString() : 'N/A'}</Text>
                  </div>
                  {selectedRequest.requestDetails?.reason && (
                    <div>
                      <Text strong>Reason: </Text>
                      <Text>{selectedRequest.requestDetails.reason}</Text>
                    </div>
                  )}
                </div>
              )}

              {selectedRequest.type === 'traveler_add' && selectedRequest.requestDetails?.travelerToAdd && (
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Name: </Text>
                    <Text>{selectedRequest.requestDetails.travelerToAdd.name}</Text>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Age: </Text>
                    <Text>{selectedRequest.requestDetails.travelerToAdd.age}</Text>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Type: </Text>
                    <Tag>{selectedRequest.requestDetails.travelerToAdd.type}</Tag>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Gender: </Text>
                    <Text>{selectedRequest.requestDetails.travelerToAdd.gender}</Text>
                  </div>
                  {selectedRequest.requestDetails?.reason && (
                    <div>
                      <Text strong>Reason: </Text>
                      <Text>{selectedRequest.requestDetails.reason}</Text>
                    </div>
                  )}
                </div>
              )}

              {selectedRequest.type === 'traveler_remove' && (
                <div>
                  <Text>Traveler ID: {selectedRequest.requestDetails?.travelerToRemove || 'N/A'}</Text>
                  {selectedRequest.requestDetails?.reason && (
                    <div style={{ marginTop: '8px' }}>
                      <Text strong>Reason: </Text>
                      <Text>{selectedRequest.requestDetails.reason}</Text>
                    </div>
                  )}
                </div>
              )}

              {selectedRequest.type === 'special_request' && (
                <div>
                  <Text strong>New Special Request: </Text>
                  <Text>{selectedRequest.requestDetails?.newSpecialRequest || 'N/A'}</Text>
                </div>
              )}

              {selectedRequest.requestDetails?.description && (
                <div style={{ marginTop: '12px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
                  <Text strong>Additional Notes: </Text>
                  <Text>{selectedRequest.requestDetails.description}</Text>
                </div>
              )}
            </Card>

            {/* Admin Notes */}
            <Form.Item label="Admin Notes (Optional)">
              <TextArea
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes about this decision..."
              />
            </Form.Item>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <Button
                onClick={() => {
                  setModificationModalVisible(false);
                  setSelectedRequest(null);
                  setAdminNotes('');
                }}
              >
                Cancel
              </Button>
              <Button
                danger
                onClick={() => handleProcessRequest('reject')}
                loading={processingRequest}
                icon={<CloseOutlined />}
              >
                Reject
              </Button>
              <Button
                type="primary"
                onClick={() => handleProcessRequest('approve')}
                loading={processingRequest}
                icon={<CheckOutlined />}
                style={{ background: '#52c41a', borderColor: '#52c41a' }}
              >
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingsManagement;
