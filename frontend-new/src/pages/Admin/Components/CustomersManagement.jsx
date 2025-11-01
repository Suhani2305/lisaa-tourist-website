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
  VideoCameraOutlined
} from '@ant-design/icons';

// Import Google Font (Poppins) - Same as landing page
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Mock data - In real app, this would come from API
  const mockCustomers = [
    {
      id: 'CUST001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      status: 'active',
      tier: 'gold',
      joinDate: '2023-01-15',
      lastActivity: '2024-02-15',
      totalBookings: 8,
      totalSpent: 125000,
      loyaltyPoints: 2500,
      preferences: {
        destinations: ['Kerala', 'Rajasthan', 'Andaman'],
        tourTypes: ['Cultural', 'Adventure', 'Beach'],
        budget: 'premium'
      },
      address: {
        street: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Suresh Kumar',
        phone: '+91 98765 43211',
        relation: 'Brother'
      },
      notes: 'VIP customer, prefers luxury accommodations',
      tags: ['VIP', 'Frequent Traveler', 'Luxury'],
      socialMedia: {
        facebook: 'rajesh.kumar',
        instagram: '@rajesh_travels',
        twitter: '@rajesh_k'
      }
    },
    {
      id: 'CUST002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 555-0123',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      status: 'active',
      tier: 'silver',
      joinDate: '2023-06-20',
      lastActivity: '2024-02-10',
      totalBookings: 3,
      totalSpent: 45000,
      loyaltyPoints: 900,
      preferences: {
        destinations: ['Rajasthan', 'Kerala'],
        tourTypes: ['Cultural', 'Heritage'],
        budget: 'mid-range'
      },
      address: {
        street: '456 Park Avenue',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        country: 'USA'
      },
      emergencyContact: {
        name: 'Emily Johnson',
        phone: '+1 555-0124',
        relation: 'Sister'
      },
      notes: 'First time visitor to India, interested in cultural experiences',
      tags: ['International', 'Cultural', 'First-time'],
      socialMedia: {
        facebook: 'sarah.johnson',
        instagram: '@sarah_travels',
        twitter: '@sarah_j'
      }
    },
    {
      id: 'CUST003',
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 98765 43212',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      status: 'inactive',
      tier: 'bronze',
      joinDate: '2022-11-10',
      lastActivity: '2023-08-15',
      totalBookings: 2,
      totalSpent: 25000,
      loyaltyPoints: 500,
      preferences: {
        destinations: ['Kerala', 'Goa'],
        tourTypes: ['Beach', 'Relaxation'],
        budget: 'budget'
      },
      address: {
        street: '789 Gandhi Road',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      },
      emergencyContact: {
        name: 'Vikram Patel',
        phone: '+91 98765 43213',
        relation: 'Brother'
      },
      notes: 'Budget-conscious traveler, prefers group tours',
      tags: ['Budget', 'Group Travel', 'Beach'],
      socialMedia: {
        facebook: 'amit.patel',
        instagram: '@amit_travels',
        twitter: '@amit_p'
      }
    }
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCustomers(mockCustomers);
    } catch (error) {
      message.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setDetailModalVisible(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue({
      ...customer,
      joinDate: customer.joinDate ? new Date(customer.joinDate) : null
    });
    setModalVisible(true);
  };

  const handleDeleteCustomer = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setCustomers(customers.filter(customer => customer.id !== id));
      message.success('Customer deleted successfully');
    } catch (error) {
      message.error('Failed to delete customer');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setCustomers(customers.map(customer => 
        customer.id === id 
          ? { ...customer, status: newStatus, lastActivity: new Date().toISOString().split('T')[0] }
          : customer
      ));
      message.success(`Customer ${newStatus} successfully`);
    } catch (error) {
      message.error('Failed to update customer status');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCustomer) {
        // Update existing customer
        const updatedCustomers = customers.map(customer =>
          customer.id === editingCustomer.id
            ? { ...customer, ...values, lastActivity: new Date().toISOString().split('T')[0] }
            : customer
        );
        setCustomers(updatedCustomers);
        message.success('Customer updated successfully');
      } else {
        // Add new customer
        const newCustomer = {
          id: `CUST${Date.now()}`,
          ...values,
          totalBookings: 0,
          totalSpent: 0,
          loyaltyPoints: 0,
          joinDate: new Date().toISOString().split('T')[0],
          lastActivity: new Date().toISOString().split('T')[0]
        };
        setCustomers([newCustomer, ...customers]);
        message.success('Customer added successfully');
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
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'suspended': return 'orange';
      default: return 'default';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'platinum': return 'purple';
      case 'gold': return 'gold';
      case 'silver': return 'blue';
      case 'bronze': return 'orange';
      default: return 'default';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'platinum': return <CrownOutlined />;
      case 'gold': return <TrophyOutlined />;
      case 'silver': return <StarOutlined />;
      case 'bronze': return <GiftOutlined />;
      default: return <UserOutlined />;
    }
  };

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
                         customer.phone.includes(searchText);
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    const matchesTier = filterTier === 'all' || customer.tier === filterTier;
    
    return matchesSearch && matchesStatus && matchesTier;
  });

  // Calculate statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const newCustomers = customers.filter(c => {
    const joinDate = new Date(c.joinDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joinDate > thirtyDaysAgo;
  }).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      width: 300,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />}
            size={60}
            style={{ backgroundColor: '#ff6b35' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong style={{ fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>
                {record.name}
              </Text>
              <Tag color={getTierColor(record.tier)} icon={getTierIcon(record.tier)} style={{ fontSize: '10px' }}>
                {record.tier.toUpperCase()}
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
              {record.tags?.map((tag, index) => (
                <Tag key={index} size="small" style={{ fontSize: '8px', margin: '1px' }}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Activity',
      key: 'activity',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CalendarOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>Joined: {record.joinDate}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <ClockCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>Last: {record.lastActivity}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <BookOutlined style={{ color: '#faad14', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>{record.totalBookings} bookings</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Spending',
      key: 'spending',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
            <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>
              ₹{record.totalSpent.toLocaleString()}
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <HeartOutlined style={{ color: '#ff6b35', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>{record.loyaltyPoints} points</Text>
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
          <Tooltip title="Edit Customer">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditCustomer(record)}
              style={{ color: '#ff6b35' }}
            />
          </Tooltip>
          {record.status === 'active' && (
            <Tooltip title="Deactivate Customer">
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'inactive')}
                style={{ color: '#ff4d4f' }}
              />
            </Tooltip>
          )}
          {record.status === 'inactive' && (
            <Tooltip title="Activate Customer">
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'active')}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete Customer">
            <Popconfirm
              title="Are you sure you want to delete this customer?"
              onConfirm={() => handleDeleteCustomer(record.id)}
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
            👥 Customer Management
          </Title>
          <Text style={{ fontSize: '14px', color: '#6c757d', fontFamily: "'Poppins', sans-serif" }}>
            Manage customer profiles, preferences, and loyalty programs
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
            Add Customer
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Customers"
              value={totalCustomers}
              prefix={<TeamOutlined style={{ color: '#ff6b35' }} />}
              valueStyle={{ color: '#ff6b35', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Active Customers"
              value={activeCustomers}
              prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="New This Month"
              value={newCustomers}
              prefix={<StarOutlined style={{ color: '#faad14' }} />}
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
              placeholder="Search customers..."
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
              <Option value="inactive">Inactive</Option>
              <Option value="suspended">Suspended</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              placeholder="Tier"
              value={filterTier}
              onChange={setFilterTier}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Tiers</Option>
              <Option value="platinum">Platinum</Option>
              <Option value="gold">Gold</Option>
              <Option value="silver">Silver</Option>
              <Option value="bronze">Bronze</Option>
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
                Showing {filteredCustomers.length} of {customers.length} customers
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Customers Table */}
      <Card style={{ borderRadius: '16px' }}>
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredCustomers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Customer Details Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            👤 Customer Details - {selectedCustomer?.name}
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
        {selectedCustomer && (
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
                          <Card title="Personal Information" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Name">{selectedCustomer.name}</Descriptions.Item>
                              <Descriptions.Item label="Email">{selectedCustomer.email}</Descriptions.Item>
                              <Descriptions.Item label="Phone">{selectedCustomer.phone}</Descriptions.Item>
                              <Descriptions.Item label="Tier">
                                <Tag color={getTierColor(selectedCustomer.tier)} icon={getTierIcon(selectedCustomer.tier)}>
                                  {selectedCustomer.tier.toUpperCase()}
                                </Tag>
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Activity Summary" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Total Bookings">{selectedCustomer.totalBookings}</Descriptions.Item>
                              <Descriptions.Item label="Total Spent">₹{selectedCustomer.totalSpent.toLocaleString()}</Descriptions.Item>
                              <Descriptions.Item label="Loyalty Points">{selectedCustomer.loyaltyPoints}</Descriptions.Item>
                              <Descriptions.Item label="Member Since">{selectedCustomer.joinDate}</Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                      </Row>
                      
                      <Divider />
                      
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card title="Address" size="small">
                            <Text>{selectedCustomer.address?.street}, {selectedCustomer.address?.city}, {selectedCustomer.address?.state} {selectedCustomer.address?.pincode}, {selectedCustomer.address?.country}</Text>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Emergency Contact" size="small">
                            <Text>{selectedCustomer.emergencyContact?.name} ({selectedCustomer.emergencyContact?.relation})</Text>
                            <br />
                            <Text type="secondary">{selectedCustomer.emergencyContact?.phone}</Text>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  )
                },
                {
                  key: 'preferences',
                  label: 'Preferences',
                  children: (
                    <div>
                      <Card title="Travel Preferences" size="small">
                        <Row gutter={[16, 16]}>
                          <Col span={8}>
                            <Text strong>Preferred Destinations:</Text>
                            <div style={{ marginTop: '8px' }}>
                              {selectedCustomer.preferences?.destinations?.map((dest, index) => (
                                <Tag key={index} style={{ margin: '2px' }}>{dest}</Tag>
                              ))}
                            </div>
                          </Col>
                          <Col span={8}>
                            <Text strong>Tour Types:</Text>
                            <div style={{ marginTop: '8px' }}>
                              {selectedCustomer.preferences?.tourTypes?.map((type, index) => (
                                <Tag key={index} color="blue" style={{ margin: '2px' }}>{type}</Tag>
                              ))}
                            </div>
                          </Col>
                          <Col span={8}>
                            <Text strong>Budget Range:</Text>
                            <div style={{ marginTop: '8px' }}>
                              <Tag color="green">{selectedCustomer.preferences?.budget}</Tag>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                  )
                },
                {
                  key: 'social',
                  label: 'Social Media',
                  children: (
                    <div>
                      <Card title="Social Media Profiles" size="small">
                        <Row gutter={[16, 16]}>
                          <Col span={8}>
                            <Text strong>Facebook:</Text>
                            <br />
                            <Text type="secondary">{selectedCustomer.socialMedia?.facebook || 'Not provided'}</Text>
                          </Col>
                          <Col span={8}>
                            <Text strong>Instagram:</Text>
                            <br />
                            <Text type="secondary">{selectedCustomer.socialMedia?.instagram || 'Not provided'}</Text>
                          </Col>
                          <Col span={8}>
                            <Text strong>Twitter:</Text>
                            <br />
                            <Text type="secondary">{selectedCustomer.socialMedia?.twitter || 'Not provided'}</Text>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                  )
                }
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Add/Edit Customer Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </div>
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText="Save Customer"
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
                label="Full Name"
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
                name="tier"
                label="Customer Tier"
                rules={[{ required: true, message: 'Please select tier' }]}
              >
                <Select placeholder="Select tier" style={{ borderRadius: '8px' }}>
                  <Option value="bronze">Bronze</Option>
                  <Option value="silver">Silver</Option>
                  <Option value="gold">Gold</Option>
                  <Option value="platinum">Platinum</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status" style={{ borderRadius: '8px' }}>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="suspended">Suspended</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="joinDate"
                label="Join Date"
              >
                <DatePicker style={{ width: '100%', borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea
              rows={3}
              placeholder="Enter customer notes"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomersManagement;

