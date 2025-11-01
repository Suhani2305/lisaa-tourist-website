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
  CloseCircleOutlined
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
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Mock data - In real app, this would come from API
  const mockInquiries = [
    {
      id: 'INQ001',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      status: 'new',
      priority: 'high',
      source: 'website',
      subject: 'Kerala Backwaters Tour Inquiry',
      message: 'Hi, I am interested in booking a Kerala backwaters tour for my family. We are 4 people and would like to travel in March. Please provide details about packages and pricing.',
      interestedTour: 'Kerala Backwaters Paradise',
      budget: '50000-75000',
      travelDate: '2024-03-15',
      createdAt: '2024-02-15',
      updatedAt: '2024-02-15',
      assignedTo: 'Rajesh Kumar',
      tags: ['Kerala', 'Family', 'Backwaters'],
      followUpDate: '2024-02-20',
      notes: 'VIP customer, interested in luxury package'
    },
    {
      id: 'INQ002',
      name: 'Michael Johnson',
      email: 'michael.johnson@email.com',
      phone: '+1 555-0123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      status: 'contacted',
      priority: 'medium',
      source: 'phone',
      subject: 'Rajasthan Heritage Tour',
      message: 'Hello, I am planning a trip to Rajasthan with my wife. We are interested in the heritage tour and would like to know about the best time to visit and what to expect.',
      interestedTour: 'Rajasthan Heritage Tour',
      budget: '80000-100000',
      travelDate: '2024-04-20',
      createdAt: '2024-02-12',
      updatedAt: '2024-02-16',
      assignedTo: 'Sarah Wilson',
      tags: ['Rajasthan', 'Heritage', 'International'],
      followUpDate: '2024-02-18',
      notes: 'International customer, first time to India'
    },
    {
      id: 'INQ003',
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 98765 43212',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      status: 'qualified',
      priority: 'low',
      source: 'social_media',
      subject: 'Andaman Islands Adventure',
      message: 'I saw your post about Andaman Islands on Instagram. My friends and I are planning a trip there. Can you provide information about adventure activities and water sports?',
      interestedTour: 'Andaman Islands Adventure',
      budget: '30000-50000',
      travelDate: '2024-05-10',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-14',
      assignedTo: 'Vikram Singh',
      tags: ['Andaman', 'Adventure', 'Group'],
      followUpDate: '2024-02-17',
      notes: 'Group booking, interested in adventure activities'
    },
    {
      id: 'INQ004',
      name: 'Sunita Reddy',
      email: 'sunita.reddy@email.com',
      phone: '+91 98765 43213',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      status: 'converted',
      priority: 'high',
      source: 'referral',
      subject: 'Kerala Ayurveda Retreat',
      message: 'My friend recommended your services. I am looking for a relaxing Ayurveda retreat in Kerala. Please send me details about your wellness packages.',
      interestedTour: 'Kerala Ayurveda Retreat',
      budget: '60000-80000',
      travelDate: '2024-03-01',
      createdAt: '2024-02-08',
      updatedAt: '2024-02-15',
      assignedTo: 'Priya Sharma',
      tags: ['Kerala', 'Ayurveda', 'Wellness'],
      followUpDate: null,
      notes: 'Converted to booking, wellness-focused customer'
    }
  ];

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInquiries(mockInquiries);
    } catch (error) {
      message.error('Failed to fetch inquiries');
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
      travelDate: inquiry.travelDate ? new Date(inquiry.travelDate) : null,
      followUpDate: inquiry.followUpDate ? new Date(inquiry.followUpDate) : null
    });
    setModalVisible(true);
  };

  const handleDeleteInquiry = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
      message.success('Inquiry deleted successfully');
    } catch (error) {
      message.error('Failed to delete inquiry');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setInquiries(inquiries.map(inquiry => 
        inquiry.id === id 
          ? { ...inquiry, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
          : inquiry
      ));
      message.success(`Inquiry ${newStatus} successfully`);
    } catch (error) {
      message.error('Failed to update inquiry status');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingInquiry) {
        // Update existing inquiry
        const updatedInquiries = inquiries.map(inquiry =>
          inquiry.id === editingInquiry.id
            ? { 
                ...inquiry, 
                ...values, 
                travelDate: values.travelDate ? values.travelDate.toISOString().split('T')[0] : null,
                followUpDate: values.followUpDate ? values.followUpDate.toISOString().split('T')[0] : null,
                updatedAt: new Date().toISOString().split('T')[0] 
              }
            : inquiry
        );
        setInquiries(updatedInquiries);
        message.success('Inquiry updated successfully');
      } else {
        // Add new inquiry
        const newInquiry = {
          id: `INQ${Date.now()}`,
          ...values,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setInquiries([newInquiry, ...inquiries]);
        message.success('Inquiry added successfully');
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
            <Text style={{ fontSize: '12px' }}>{record.interestedTour}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <DollarOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>₹{record.budget}</Text>
          </div>
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
            💬 Inquiries & Leads Management
          </Title>
          <Text style={{ fontSize: '14px', color: '#6c757d', fontFamily: "'Poppins', sans-serif" }}>
            Manage customer inquiries, leads, and follow-up activities
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
            Add Inquiry
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Inquiries"
              value={totalInquiries}
              prefix={<MessageOutlined style={{ color: '#ff6b35' }} />}
              valueStyle={{ color: '#ff6b35', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="New Inquiries"
              value={newInquiries}
              prefix={<ExclamationCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Converted"
              value={convertedInquiries}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Conversion Rate"
              value={conversionRate}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Search inquiries..."
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
              <Option value="new">New</Option>
              <Option value="contacted">Contacted</Option>
              <Option value="qualified">Qualified</Option>
              <Option value="converted">Converted</Option>
              <Option value="closed">Closed</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              placeholder="Priority"
              value={filterPriority}
              onChange={setFilterPriority}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Priority</Option>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
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
                Showing {filteredInquiries.length} of {inquiries.length} inquiries
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Inquiries Table */}
      <Card style={{ borderRadius: '16px' }}>
        <Table
          columns={columns}
          dataSource={filteredInquiries}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredInquiries.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} inquiries`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Inquiry Details Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            💬 Inquiry Details - {selectedInquiry?.name}
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
        {selectedInquiry && (
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
                              <Descriptions.Item label="Name">{selectedInquiry.name}</Descriptions.Item>
                              <Descriptions.Item label="Email">{selectedInquiry.email}</Descriptions.Item>
                              <Descriptions.Item label="Phone">{selectedInquiry.phone}</Descriptions.Item>
                              <Descriptions.Item label="Source">
                                <Tag color="blue" icon={getSourceIcon(selectedInquiry.source)}>
                                  {selectedInquiry.source.replace('_', ' ').toUpperCase()}
                                </Tag>
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Inquiry Details" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Subject">{selectedInquiry.subject}</Descriptions.Item>
                              <Descriptions.Item label="Status">
                                <Tag color={getStatusColor(selectedInquiry.status)}>
                                  {selectedInquiry.status.toUpperCase()}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Priority">
                                <Tag color={getPriorityColor(selectedInquiry.priority)}>
                                  {selectedInquiry.priority.toUpperCase()}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Assigned To">{selectedInquiry.assignedTo}</Descriptions.Item>
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
                            <Text>{selectedInquiry.interestedTour}</Text>
                            <br /><br />
                            <Text strong>Budget:</Text>
                            <br />
                            <Text>₹{selectedInquiry.budget}</Text>
                            <br /><br />
                            <Text strong>Travel Date:</Text>
                            <br />
                            <Text>{selectedInquiry.travelDate}</Text>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Timeline" size="small">
                            <Text strong>Created:</Text>
                            <br />
                            <Text>{selectedInquiry.createdAt}</Text>
                            <br /><br />
                            <Text strong>Last Updated:</Text>
                            <br />
                            <Text>{selectedInquiry.updatedAt}</Text>
                            <br /><br />
                            {selectedInquiry.followUpDate && (
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
                        <Text>{selectedInquiry.message}</Text>
                      </Card>
                      <Card title="Admin Notes" size="small" style={{ marginTop: '16px' }}>
                        <Text>{selectedInquiry.notes || 'No notes available'}</Text>
                      </Card>
                    </div>
                  )
                }
              ]}
            />
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Customer Name"
                rules={[{ required: true, message: 'Please enter customer name' }]}
              >
                <Input placeholder="Enter customer name" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input placeholder="Enter email" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Enter phone number" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="source"
                label="Source"
                rules={[{ required: true, message: 'Please select source' }]}
              >
                <Select placeholder="Select source" style={{ borderRadius: '8px' }}>
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
            rules={[{ required: true, message: 'Please enter subject' }]}
          >
            <Input placeholder="Enter inquiry subject" style={{ borderRadius: '8px' }} />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter message' }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter customer message"
              style={{ borderRadius: '8px' }}
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
                label="Assigned To"
              >
                <Input placeholder="Enter assigned person" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

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
    </div>
  );
};

export default InquiriesManagement;
