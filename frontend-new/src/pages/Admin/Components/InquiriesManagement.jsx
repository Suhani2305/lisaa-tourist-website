import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { inquiryService, tourService } from '../../../services';
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
  VideoCameraOutlined,
  QuestionCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
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

const InquiriesManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [form] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyForm] = Form.useForm();
  const [tablePage, setTablePage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(window.innerWidth <= 768 ? 5 : 10);
  const [availableTours, setAvailableTours] = useState([]);

  // Reply templates generator function
  const getReplyTemplates = () => {
    const customerName = editingInquiry?.name || 'Customer';
    const tourTitle = editingInquiry?.interestedTour?.title;
    const subject = editingInquiry?.subject;
    
    return [
      {
        label: 'General Inquiry Response',
        value: `Dear ${customerName},

Thank you for contacting Lisaa Tours & Travels. We have received your inquiry and appreciate your interest in our services.

Our team is currently reviewing your request and will get back to you within 24-48 hours with detailed information about our tour packages and pricing.

If you have any immediate questions or concerns, please feel free to contact us:
📧 Email: Lsiaatech@gmail.com
📱 Phone: +91 9263616263

We look forward to serving you and making your travel experience memorable.

Best regards,
Lisaa Tours & Travels Team`
      },
      {
        label: 'Package Information Request',
        value: `Dear ${customerName},

Thank you for your interest in our tour packages. We are delighted to provide you with more information about our services.

${tourTitle 
  ? `Regarding your interest in "${tourTitle}" package:`
  : 'Regarding your tour inquiry:'}

Our comprehensive tour packages include:
✓ Comfortable accommodation
✓ Transportation
✓ Professional guide services
✓ Meals (as per package)
✓ Sightseeing and activities

For detailed pricing, itinerary, and booking information, our travel consultant will contact you shortly.

Best regards,
Lisaa Tours & Travels Team`
      },
      {
        label: 'Booking Confirmation',
        value: `Dear ${customerName},

Thank you for choosing Lisaa Tours & Travels! We are excited to confirm your interest in booking with us.

Our booking team will reach out to you shortly to:
• Confirm tour dates and availability
• Discuss pricing and payment options
• Provide detailed itinerary
• Answer any questions you may have

We are committed to making your travel experience unforgettable. Please feel free to contact us at:
📧 Email: Lsiaatech@gmail.com
📱 Phone: +91 9263616263

Thank you for your trust in us!

Best regards,
Lisaa Tours & Travels Team`
      },
      {
        label: 'Inquiry Closed - Thank You',
        value: `Dear ${customerName},

Thank you for contacting Lisaa Tours & Travels regarding your inquiry.

${subject ? `Regarding your inquiry: "${subject}"` : 'We have addressed your inquiry and hope our response was helpful.'}

We appreciate your interest in our services. If you have any further questions or would like to book a tour in the future, please don't hesitate to reach out to us.

We hope to serve you in the future and make your travel dreams come true!

Best regards,
Lisaa Tours & Travels Team`
      },
      {
        label: 'Additional Information Needed',
        value: `Dear ${customerName},

Thank you for your inquiry. To better assist you and provide the most suitable tour package, we need some additional information:

1. Preferred travel dates
2. Number of travelers (adults/children)
3. Budget range
4. Specific destinations or activities of interest
5. Any special requirements or preferences

Once we receive this information, our travel consultant will prepare a customized package proposal for you.

You can reach us at:
📧 Email: Lsiaatech@gmail.com
📱 Phone: +91 9263616263

We look forward to hearing from you soon!

Best regards,
Lisaa Tours & Travels Team`
      },
      {
        label: 'Custom Package Offer',
        value: `Dear ${customerName},

Thank you for your inquiry with Lisaa Tours & Travels!

Based on your requirements, we would be happy to create a customized tour package tailored specifically for you. Our team specializes in crafting unique travel experiences that match your preferences and budget.

We will contact you shortly to discuss:
• Customized itinerary based on your interests
• Best available pricing options
• Travel dates and availability
• Special inclusions and upgrades

${tourTitle 
  ? `We have noted your interest in "${tourTitle}" and will include similar experiences in your custom package.`
  : 'We will create a package that best suits your travel needs.'}

Looking forward to planning your perfect trip!

Best regards,
Lisaa Tours & Travels Team`
      }
    ];
  };

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
  }, [searchText, filterStatus, filterPriority]);

  useEffect(() => {
    fetchInquiries();
    fetchTours();
  }, [filterStatus, filterPriority, searchText]);

  const fetchTours = async () => {
    try {
      const tours = await tourService.getAllTours({ all: 'true', limit: 1000 });
      setAvailableTours(Array.isArray(tours) ? tours : (tours?.data || tours?.tours || []));
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      // Fetch inquiries from real API only
      const response = await inquiryService.getAllInquiries({
        status: filterStatus !== 'all' ? filterStatus : undefined,
        priority: filterPriority !== 'all' ? filterPriority : undefined,
        search: searchText || undefined
      });
      
      if (response.success && response.inquiries) {
        // Transform API data to match component format
        const transformedInquiries = response.inquiries.map(inq => ({
          id: inq._id,
          ...inq,
          createdAt: inq.createdAt ? new Date(inq.createdAt).toISOString().split('T')[0] : '',
          updatedAt: inq.updatedAt ? new Date(inq.updatedAt).toISOString().split('T')[0] : '',
          travelDate: inq.travelDate ? new Date(inq.travelDate).toISOString().split('T')[0] : null,
          followUpDate: inq.followUpDate ? new Date(inq.followUpDate).toISOString().split('T')[0] : null,
          // Add default avatar if not present
          avatar: inq.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(inq.name)}&background=ff6b35&color=fff`,
          // Keep interestedTour as populated object if available
          interestedTour: inq.interestedTour
        }));
        setInquiries(transformedInquiries);
      } else {
        // If no inquiries, set empty array
        setInquiries([]);
        message.info('No inquiries found');
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
      message.error(error.message || 'Failed to fetch inquiries. Please try again.');
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    setDetailModalVisible(true);
  };

  const handleEditInquiry = (inquiry) => {
    setEditingInquiry(inquiry);
    form.setFieldsValue({
      ...inquiry,
      travelDate: inquiry.travelDate ? (dayjs(inquiry.travelDate).isValid() ? dayjs(inquiry.travelDate) : null) : null,
      followUpDate: inquiry.followUpDate ? (dayjs(inquiry.followUpDate).isValid() ? dayjs(inquiry.followUpDate) : null) : null,
      // Set interestedTour to the populated tour object if available
      interestedTour: inquiry.interestedTour?._id || inquiry.interestedTour
    });
    setModalVisible(true);
  };

  const handleDeleteInquiry = async (id) => {
    try {
      const response = await inquiryService.deleteInquiry(id);
      if (response.success) {
        setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
        message.success('Inquiry deleted successfully');
      } else {
        message.error('Failed to delete inquiry');
      }
    } catch (error) {
      console.error('Delete inquiry error:', error);
      message.error(error.message || 'Failed to delete inquiry');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await inquiryService.updateInquiry(id, { status: newStatus });
      if (response.success) {
        setInquiries(inquiries.map(inquiry => 
          inquiry.id === id 
            ? { ...inquiry, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
            : inquiry
        ));
        message.success(`Inquiry status updated to ${newStatus}`);
      } else {
        message.error('Failed to update inquiry status');
      }
    } catch (error) {
      console.error('Update inquiry error:', error);
      message.error(error.message || 'Failed to update inquiry status');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingInquiry) {
        // Update existing inquiry via API (only admin-editable fields)
        try {
          const updateData = {
            // Only include admin-editable fields, exclude customer fields (name, email, phone, subject, message)
            status: values.status,
            priority: values.priority,
            assignedTo: values.assignedTo || null, // Convert empty string to null
            notes: values.notes,
            interestedTour: values.interestedTour || null, // Convert empty string to null
            budget: values.budget || '',
            travelDate: values.travelDate ? values.travelDate.toISOString() : null,
            followUpDate: values.followUpDate ? values.followUpDate.toISOString() : null,
            source: values.source,
            tags: values.tags
          };
          
          const response = await inquiryService.updateInquiry(editingInquiry.id, updateData);
          
          if (response.success) {
            // Update local state
            await fetchInquiries(); // Refresh to get updated data
            message.success('Inquiry updated successfully');
            setModalVisible(false);
            form.resetFields();
            setEditingInquiry(null);
          } else {
            message.error('Failed to update inquiry');
          }
        } catch (error) {
          console.error('Update inquiry error:', error);
          message.error(error.message || 'Failed to update inquiry');
        }
      } else {
        // Create new inquiry
        try {
          const inquiryData = {
            name: values.name,
            email: values.email,
            phone: values.phone,
            subject: values.subject,
            message: values.message,
            source: values.source || 'website',
            status: values.status || 'new',
            priority: values.priority || 'medium',
            assignedTo: values.assignedTo || null,
            notes: values.notes || '',
            interestedTour: values.interestedTour || null,
            budget: values.budget || '',
            travelDate: values.travelDate ? values.travelDate.toISOString() : null,
            followUpDate: values.followUpDate ? values.followUpDate.toISOString() : null,
            tags: values.tags || []
          };
          
          const response = await inquiryService.createInquiry(inquiryData);
          
          if (response.success) {
            message.success('Inquiry created successfully');
            setModalVisible(false);
            form.resetFields();
            setEditingInquiry(null);
            await fetchInquiries(); // Refresh inquiries list
          } else {
            message.error('Failed to create inquiry');
          }
        } catch (error) {
          console.error('Create inquiry error:', error);
          message.error(error.message || 'Failed to create inquiry');
        }
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleSendReply = async () => {
    try {
      const values = await replyForm.validateFields();
      const replyMessage = values.replyMessage;
      
      if (!replyMessage) {
        message.error('Please enter a reply message');
        return;
      }

      // Update inquiry status to closed/converted and send reply
      const updateData = {
        status: values.status || 'closed',
        replyMessage: replyMessage
      };

      const response = await inquiryService.updateInquiry(editingInquiry.id, updateData);
      
      if (response.success) {
        message.success('Reply sent successfully to customer!');
        setReplyModalVisible(false);
        replyForm.resetFields();
        await fetchInquiries(); // Refresh inquiries
      } else {
        message.error('Failed to send reply');
      }
    } catch (error) {
      console.error('Send reply error:', error);
      message.error(error.message || 'Failed to send reply');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setDetailModalVisible(false);
    form.resetFields();
  };

  const handleExport = () => {
    try {
      // Create CSV headers
      const headers = ['Name', 'Email', 'Phone', 'Subject', 'Status', 'Priority', 'Source', 'Tour Interest', 'Budget', 'Travel Date', 'Assigned To', 'Created Date'];
      
      // Create CSV rows
      const rows = filteredInquiries.map(inquiry => [
        inquiry.name || 'N/A',
        inquiry.email || 'N/A',
        inquiry.phone || 'N/A',
        inquiry.subject || 'N/A',
        inquiry.status || 'N/A',
        inquiry.priority || 'N/A',
        inquiry.source || 'N/A',
        inquiry.interestedTour?.title || inquiry.interestedTour || 'N/A',
        inquiry.budget ? `₹${inquiry.budget}` : 'N/A',
        inquiry.travelDate || 'N/A',
        inquiry.assignedTo || 'N/A',
        inquiry.createdAt || 'N/A'
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
      link.setAttribute('download', `inquiries_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('Inquiries exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export inquiries');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'blue';
      case 'contacted': return 'orange';
      case 'qualified': return 'green';
      case 'converted': return 'purple';
      case 'closed': return 'red';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'website': return <GlobalOutlined />;
      case 'phone': return <PhoneOutlined />;
      case 'social_media': return <CameraOutlined />;
      case 'referral': return <UserOutlined />;
      case 'email': return <MailOutlined />;
      default: return <QuestionCircleOutlined />;
    }
  };

  // Filter inquiries based on search and filters
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchText.toLowerCase()) ||
                         inquiry.subject.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || inquiry.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate statistics
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const convertedInquiries = inquiries.filter(i => i.status === 'converted').length;
  const conversionRate = totalInquiries > 0 ? Math.round((convertedInquiries / totalInquiries) * 100) : 0;

  const columns = [
    {
      title: 'Inquiry Details',
      key: 'inquiry',
      width: 350,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />}
            size={50}
            style={{ backgroundColor: '#ff6b35' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong style={{ fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>
                {record.name}
              </Text>
              <Tag color={getPriorityColor(record.priority)} style={{ fontSize: '10px' }}>
                {record.priority.toUpperCase()}
              </Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <MailOutlined style={{ color: '#ff6b35', fontSize: '10px' }} />
              <Text type="secondary" style={{ fontSize: '11px' }}>
                {record.email}
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <PhoneOutlined style={{ color: '#ff6b35', fontSize: '10px' }} />
              <Text type="secondary" style={{ fontSize: '11px' }}>
                {record.phone}
              </Text>
            </div>
            <div style={{ marginTop: '4px' }}>
              <Text style={{ fontSize: '12px', fontWeight: '600' }}>
                {record.subject}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Tour Interest',
      key: 'tour',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>
              {record.interestedTour?.title 
                ? `${record.interestedTour.title} - ${record.interestedTour.destination}`
                : record.interestedTour || 'No package selected'
              }
            </Text>
          </div>
          {record.budget && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <DollarOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
              <Text style={{ fontSize: '12px' }}>₹{record.budget}</Text>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <CalendarOutlined style={{ color: '#faad14', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>{record.travelDate}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Source',
      key: 'source',
      width: 100,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', color: '#ff6b35', marginBottom: '4px' }}>
            {getSourceIcon(record.source)}
          </div>
          <Text style={{ fontSize: '11px', textTransform: 'capitalize' }}>
            {record.source.replace('_', ' ')}
          </Text>
        </div>
      ),
    },
    {
      title: 'Assigned To',
      key: 'assigned',
      width: 120,
      render: (_, record) => (
        <div>
          <Text style={{ fontSize: '12px' }}>{record.assignedTo}</Text>
          {record.followUpDate && (
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary" style={{ fontSize: '10px' }}>
                Follow-up: {record.followUpDate}
              </Text>
            </div>
          )}
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
          <Tooltip title="Edit Inquiry">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditInquiry(record)}
              style={{ color: '#ff6b35' }}
            />
          </Tooltip>
          {record.status === 'new' && (
            <Tooltip title="Mark as Contacted">
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'contacted')}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          {record.status === 'contacted' && (
            <Tooltip title="Mark as Qualified">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'qualified')}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
          )}
          {record.status === 'qualified' && (
            <Tooltip title="Mark as Converted">
              <Button
                type="text"
                icon={<TrophyOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'converted')}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete Inquiry">
            <Popconfirm
              title="Are you sure you want to delete this inquiry?"
              onConfirm={() => handleDeleteInquiry(record.id)}
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

  // Get paginated inquiries
  const getPaginatedInquiries = () => {
    const start = (tablePage - 1) * tablePageSize;
    const end = start + tablePageSize;
    return filteredInquiries.slice(start, end);
  };

  const paginatedInquiries = getPaginatedInquiries();
  const totalInquiriesCount = filteredInquiries.length;

  return (
    <div style={{ 
      fontFamily: "'Poppins', sans-serif",
      padding: windowWidth <= 768 ? '16px' : '24px',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        position: 'relative',
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
          Inquiries Management
        </Title>
        <p style={{ 
          fontSize: windowWidth <= 768 ? '13px' : '16px',
          color: '#6c757d',
          margin: '0 auto',
          fontFamily: "'Poppins', sans-serif",
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          Manage customer inquiries, leads, and follow-up activities
        </p>

        {/* Refresh Button - Top Right */}
        <Button 
          type="primary"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={fetchInquiries}
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            borderRadius: '12px',
            background: '#ff6b35',
            border: 'none',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
            height: windowWidth <= 768 ? '36px' : '42px',
            padding: windowWidth <= 768 ? '0 14px' : '0 20px',
            fontSize: windowWidth <= 768 ? '12px' : '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {windowWidth > 768 && 'Refresh'}
        </Button>
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Total Inquiries</span>}
              value={totalInquiries}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>New Inquiries</span>}
              value={newInquiries}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Converted</span>}
              value={convertedInquiries}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Conversion Rate</span>}
              value={conversionRate}
              suffix="%"
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
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
        styles={{ body: { padding: windowWidth <= 768 ? '12px' : '20px' } }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={10} lg={10}>
            <Input
              placeholder="Search inquiries..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              allowClear
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={12} sm={8} md={3} lg={3}>
            <Select
              placeholder="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Status</Option>
              <Option value="new">New</Option>
              <Option value="contacted">Contacted</Option>
              <Option value="qualified">Qualified</Option>
              <Option value="converted">Converted</Option>
              <Option value="closed">Closed</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={3} lg={3}>
            <Select
              placeholder="Priority"
              value={filterPriority}
              onChange={setFilterPriority}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Priority</Option>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4} lg={4}>
            <Tooltip title="Export to CSV">
              <Button
                icon={<ExportOutlined />}
                onClick={handleExport}
                size={windowWidth <= 768 ? 'middle' : 'large'}
                style={{ 
                  width: '100%',
                  borderRadius: '8px'
                }}
              >
                {windowWidth > 768 ? 'Export' : 'Export'}
              </Button>
            </Tooltip>
          </Col>
          <Col xs={12} sm={24} md={4} lg={4}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingInquiry(null);
                form.resetFields();
                setModalVisible(true);
              }}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              style={{ 
                width: '100%',
                backgroundColor: '#ff6b35', 
                borderColor: '#ff6b35',
                borderRadius: '8px',
                fontWeight: '600'
              }}
            >
              {windowWidth > 768 ? 'Add Inquiry' : 'Add'}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Inquiries Table */}
      <Card style={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: 'none'
      }}>
        <Table
          columns={columns}
          dataSource={paginatedInquiries}
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
            total={totalInquiriesCount}
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
            {totalInquiriesCount > 0 
              ? `${(tablePage - 1) * tablePageSize + 1}-${Math.min(tablePage * tablePageSize, totalInquiriesCount)} of ${totalInquiriesCount} inquiries`
              : 'No inquiries found'
            }
          </div>
        </div>
      </Card>

      {/* Inquiry Details Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            Inquiry Details - {selectedInquiry?.name}
          </div>
        }
        open={detailModalVisible}
        onCancel={handleModalCancel}
        width={900}
        footer={[
          <Button 
            key="reply" 
            type="primary"
            icon={<SendOutlined />} 
            onClick={() => {
              setEditingInquiry(selectedInquiry);
              setDetailModalVisible(false);
              setReplyModalVisible(true);
            }}
            style={{ 
              borderRadius: '8px',
              background: '#ff6b35',
              border: 'none'
            }}
          >
            Send Reply
          </Button>,
          <Button key="print" icon={<PrinterOutlined />} style={{ borderRadius: '8px' }}>
            Print
          </Button>,
          <Button key="close" onClick={handleModalCancel} style={{ borderRadius: '8px' }}>
            Close
          </Button>
        ]}
      >
        {selectedInquiry ? (
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
                          <Card title="Contact Information" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Name">{selectedInquiry?.name || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Email">{selectedInquiry?.email || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Phone">{selectedInquiry?.phone || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Source">
                                <Tag color="blue" icon={getSourceIcon(selectedInquiry?.source || 'website')}>
                                  {(selectedInquiry?.source || 'website').replace('_', ' ').toUpperCase()}
                                </Tag>
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Inquiry Details" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Subject">{selectedInquiry?.subject || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Status">
                                <Tag color={getStatusColor(selectedInquiry?.status || 'new')}>
                                  {(selectedInquiry?.status || 'new').toUpperCase()}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Priority">
                                <Tag color={getPriorityColor(selectedInquiry?.priority || 'medium')}>
                                  {(selectedInquiry?.priority || 'medium').toUpperCase()}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Assigned To">
                                {selectedInquiry.assignedTo || 'Not assigned'}
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                      </Row>
                      
                      <Divider />
                      
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card title="Tour Interest" size="small">
                            <Text strong>Interested Tour:</Text>
                            <br />
                            <Text>
                              {selectedInquiry.interestedTour?.title 
                                ? `${selectedInquiry.interestedTour.title} - ${selectedInquiry.interestedTour.destination}`
                                : selectedInquiry.interestedTour || 'No package selected'
                              }
                            </Text>
                            <br /><br />
                            <Text strong>Budget:</Text>
                            <br />
                            <Text>{selectedInquiry.budget ? `₹${selectedInquiry.budget}` : 'Not specified'}</Text>
                            <br /><br />
                            <Text strong>Travel Date:</Text>
                            <br />
                            <Text>{selectedInquiry.travelDate || 'Not specified'}</Text>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Timeline" size="small">
                            <Text strong>Created:</Text>
                            <br />
                            <Text>{selectedInquiry?.createdAt || 'N/A'}</Text>
                            <br /><br />
                            <Text strong>Last Updated:</Text>
                            <br />
                            <Text>{selectedInquiry?.updatedAt || 'N/A'}</Text>
                            <br /><br />
                            {selectedInquiry?.followUpDate && (
                              <>
                                <Text strong>Follow-up Date:</Text>
                                <br />
                                <Text>{selectedInquiry.followUpDate}</Text>
                              </>
                            )}
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  )
                },
                {
                  key: 'message',
                  label: 'Message',
                  children: (
                    <div>
                      <Card title="Customer Message" size="small">
                        <Text>{selectedInquiry?.message || 'No message available'}</Text>
                      </Card>
                      <Card title="Admin Notes" size="small" style={{ marginTop: '16px' }}>
                        <Text>{selectedInquiry?.notes || 'No notes available'}</Text>
                      </Card>
                    </div>
                  )
                }
              ]}
            />
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <Text type="secondary">Loading inquiry details...</Text>
          </div>
        )}
      </Modal>

      {/* Add/Edit Inquiry Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            {editingInquiry ? 'Edit Inquiry' : 'Add New Inquiry'}
          </div>
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText="Save Inquiry"
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
          {/* Customer Information - Editable when adding new, read-only when editing */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Customer Name"
                rules={!editingInquiry ? [{ required: true, message: 'Please enter customer name' }] : []}
              >
                <Input 
                  placeholder="Customer name" 
                  style={{ borderRadius: '8px' }}
                  readOnly={!!editingInquiry}
                  disabled={!!editingInquiry}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={!editingInquiry ? [
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ] : []}
              >
                <Input 
                  placeholder="Customer email" 
                  style={{ borderRadius: '8px' }}
                  readOnly={!!editingInquiry}
                  disabled={!!editingInquiry}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={!editingInquiry ? [{ required: true, message: 'Please enter phone number' }] : []}
              >
                <Input 
                  placeholder="Customer phone" 
                  style={{ borderRadius: '8px' }}
                  readOnly={!!editingInquiry}
                  disabled={!!editingInquiry}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="source"
                label="Source"
                rules={!editingInquiry ? [{ required: true, message: 'Please select source' }] : []}
              >
                <Select 
                  placeholder="Select source" 
                  style={{ borderRadius: '8px' }}
                  disabled={!!editingInquiry}
                >
                  <Option value="website">Website</Option>
                  <Option value="phone">Phone</Option>
                  <Option value="social_media">Social Media</Option>
                  <Option value="referral">Referral</Option>
                  <Option value="email">Email</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="subject"
            label="Subject"
            rules={!editingInquiry ? [{ required: true, message: 'Please enter subject' }] : []}
          >
            <Input 
              placeholder="Inquiry subject" 
              style={{ borderRadius: '8px' }}
              readOnly={!!editingInquiry}
              disabled={!!editingInquiry}
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Customer Message"
            rules={!editingInquiry ? [{ required: true, message: 'Please enter message' }] : []}
          >
            <TextArea
              rows={4}
              placeholder="Customer message"
              style={{ borderRadius: '8px' }}
              readOnly={!!editingInquiry}
              disabled={!!editingInquiry}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status" style={{ borderRadius: '8px' }}>
                  <Option value="new">New</Option>
                  <Option value="contacted">Contacted</Option>
                  <Option value="qualified">Qualified</Option>
                  <Option value="converted">Converted</Option>
                  <Option value="closed">Closed</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please select priority' }]}
              >
                <Select placeholder="Select priority" style={{ borderRadius: '8px' }}>
                  <Option value="high">High</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="low">Low</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="assignedTo"
                label="Assigned To (Admin Name)"
              >
                <Input placeholder="Enter admin name" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="interestedTour"
            label="Interested Package"
          >
            {editingInquiry ? (
              <Text 
                style={{ 
                  padding: '8px 12px', 
                  background: '#f5f5f5', 
                  borderRadius: '8px',
                  display: 'block',
                  minHeight: '32px'
                }}
              >
                {editingInquiry.interestedTour?.title 
                  ? `${editingInquiry.interestedTour.title} - ${editingInquiry.interestedTour.destination}`
                  : editingInquiry.interestedTour || 'No package selected'
                }
              </Text>
            ) : (
              <Select
                placeholder="Select package (optional)"
                style={{ borderRadius: '8px' }}
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={availableTours.map(tour => ({
                  label: `${tour.title} - ${tour.destination || 'N/A'}`,
                  value: tour._id || tour.id
                }))}
              />
            )}
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="Budget"
              >
                <Input 
                  placeholder="Enter budget (e.g., ₹50000)" 
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="travelDate"
                label="Travel Date"
              >
                <DatePicker
                  style={{ width: '100%', borderRadius: '8px' }}
                  placeholder="Select travel date"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="followUpDate"
            label="Follow-up Date"
          >
            <DatePicker
              style={{ width: '100%', borderRadius: '8px' }}
              placeholder="Select follow-up date"
              format="YYYY-MM-DD"
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
        </Form>
      </Modal>

      {/* Reply Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            Send Reply to Customer - {editingInquiry?.name}
          </div>
        }
        open={replyModalVisible}
        onOk={handleSendReply}
        onCancel={() => {
          setReplyModalVisible(false);
          replyForm.resetFields();
        }}
        width={700}
        okText="Send Reply"
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
          form={replyForm}
          layout="vertical"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          initialValues={{
            status: 'closed'
          }}
        >
          <Form.Item
            name="status"
            label="Update Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status" style={{ borderRadius: '8px' }}>
              <Option value="closed">Closed</Option>
              <Option value="converted">Converted</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Customer Details">
            <div style={{ 
              background: '#f5f5f5', 
              padding: '12px', 
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <Text strong>Email:</Text> <Text>{editingInquiry?.email}</Text><br />
              <Text strong>Subject:</Text> <Text>{editingInquiry?.subject}</Text>
            </div>
          </Form.Item>

          <Form.Item
            label={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Reply Message</span>
                <Select
                  placeholder="Quick Templates"
                  style={{ width: 200, borderRadius: '8px' }}
                  onChange={(value) => {
                    replyForm.setFieldsValue({ replyMessage: value });
                  }}
                  options={getReplyTemplates().map(template => ({
                    label: template.label,
                    value: template.value
                  }))}
                />
              </div>
            }
            name="replyMessage"
            rules={[{ required: true, message: 'Please enter reply message' }]}
          >
            <TextArea
              rows={8}
              placeholder="Enter your reply message to the customer... or select a template above"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <div style={{ 
            marginBottom: '16px',
            padding: '12px',
            background: '#f0f2f5',
            borderRadius: '8px'
          }}>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              📝 Quick Templates:
            </Text>
            <Space wrap>
              {getReplyTemplates().map((template, index) => (
                <Button
                  key={index}
                  size="small"
                  onClick={() => {
                    replyForm.setFieldsValue({ replyMessage: template.value });
                    message.success('Template applied! You can edit it as needed.');
                  }}
                  style={{ 
                    borderRadius: '6px',
                    fontSize: '11px',
                    marginBottom: '4px'
                  }}
                >
                  {template.label}
                </Button>
              ))}
            </Space>
          </div>

          <div style={{ 
            background: '#fff7e6', 
            padding: '12px', 
            borderRadius: '8px',
            border: '1px solid #ffe58f',
            marginTop: '16px'
          }}>
            <Text type="warning">
              ⚠️ This reply will be sent via email to {editingInquiry?.email}. 
              The inquiry status will be updated to the selected status.
            </Text>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default InquiriesManagement;
