import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Tag, 
  Space, 
  Popconfirm,
  Row,
  Col,
  Typography,
  Statistic,
  Tooltip,
  Empty,
  Badge,
  Avatar
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  ReloadOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilePdfOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

// Import Google Font (Poppins)
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
if (!document.head.querySelector('link[href*="Poppins"]')) {
  document.head.appendChild(link);
}

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [form] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const adminRole = localStorage.getItem('adminRole') || 'Admin';
  const normalizedRole = adminRole === 'Super Admin' ? 'Superadmin' : adminRole;

  useEffect(() => {
    fetchAdmins();
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/management', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      message.error('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAdmin(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    form.setFieldsValue({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      isActive: admin.isActive
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:5000/api/admin/management/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      message.success('Admin deleted successfully');
      fetchAdmins();
    } catch (error) {
      message.error('Failed to delete admin');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingAdmin 
        ? `http://localhost:5000/api/admin/management/${editingAdmin._id}`
        : normalizedRole === 'Superadmin'
          ? 'http://localhost:5000/api/admin/management/create-admin'
          : 'http://localhost:5000/api/admin/management/create-manager';
      
      const method = editingAdmin ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      message.success(editingAdmin ? 'Admin updated successfully' : 'Admin created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchAdmins();
    } catch (error) {
      console.error('Error:', error);
      message.error(error.message || 'Operation failed. Please check console for details.');
    }
  };

  // Filter admins
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      searchText === '' ||
      admin.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && admin.isActive) ||
      (statusFilter === 'inactive' && !admin.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: admins.length,
    superadmin: admins.filter(a => a.role === 'Superadmin').length,
    admin: admins.filter(a => a.role === 'Admin').length,
    manager: admins.filter(a => a.role === 'Manager').length,
    active: admins.filter(a => a.isActive).length
  };

  // Export function - PDF only
  const handleExport = () => {
    try {
        // Create a printable HTML table
        const printWindow = window.open('', '_blank');
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Admin Management Report</title>
              <style>
                body { font-family: 'Poppins', sans-serif; padding: 20px; }
                h1 { color: #ff6b35; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #ff6b35; color: white; font-weight: 600; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <h1>Admin Management Report</h1>
              <p style="text-align: center; color: #666;">Generated on: ${new Date().toLocaleString()}</p>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredAdmins.map(admin => `
                    <tr>
                      <td>${admin.name || 'N/A'}</td>
                      <td>${admin.email || 'N/A'}</td>
                      <td>${admin.phone || 'N/A'}</td>
                      <td>${admin.role || 'N/A'}</td>
                      <td>${admin.isActive ? 'Active' : 'Inactive'}</td>
                      <td>${admin.createdBy?.name || admin.createdBy?.email || 'N/A'}</td>
                      <td>${admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="footer">
                <p>Total Records: ${filteredAdmins.length}</p>
                <p>Lisaa Tours & Travels - Admin Management System</p>
              </div>
            </body>
          </html>
        `;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 250);
        message.success('PDF export opened in print dialog!');
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export data');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#ff6b35' }}
          />
          <div>
            <Text strong style={{ fontFamily: "'Poppins', sans-serif" }}>
              {text || 'Unknown'}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
      width: 200
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colors = {
          'Superadmin': 'red',
          'Admin': 'blue',
          'Manager': 'green'
        };
        return (
          <Tag color={colors[role] || 'default'} style={{ borderRadius: '6px', fontWeight: '500' }}>
            {role}
          </Tag>
        );
      },
      width: 120
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Badge 
          status={isActive ? 'success' : 'default'} 
          text={
            <Tag color={isActive ? 'success' : 'error'} style={{ borderRadius: '6px', fontWeight: '500' }}>
              {isActive ? 'Active' : 'Inactive'}
            </Tag>
          }
        />
      ),
      width: 120
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Admin">
            <Button 
              type="primary"
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              disabled={normalizedRole === 'Admin' && record.role !== 'Manager'}
              size="small"
              style={{ borderRadius: '6px' }}
            >
              Edit
            </Button>
          </Tooltip>
          <Popconfirm
            title="Delete this admin?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Admin">
              <Button 
                danger 
                icon={<DeleteOutlined />}
                disabled={normalizedRole === 'Admin' && record.role !== 'Manager'}
                size="small"
                style={{ borderRadius: '6px' }}
              >
                Delete
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
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
          textShadow: '0 2px 4px rgba(255, 107, 53, 0.1)',
          textAlign: 'center'
        }}>
          Admin Management
        </Title>
        
        <p style={{
          fontSize: windowWidth <= 768 ? '13px' : windowWidth <= 1024 ? '14px' : '16px',
          color: '#6c757d',
          margin: '0 auto',
          fontFamily: "'Poppins', sans-serif",
          lineHeight: '1.6',
          maxWidth: '700px',
          textAlign: 'center'
        }}>
          Manage admin users and their roles
        </p>

        {/* Refresh Button - Top Right */}
        <Button 
          type="primary"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={fetchAdmins}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Total Admins</span>}
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
            color: 'white'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Superadmins</span>}
              value={stats.superadmin}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Admins</span>}
              value={stats.admin}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Managers</span>}
              value={stats.manager}
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
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={24} md={10} lg={10}>
            <Input
              placeholder="Search by name or email..."
              prefix={<UserOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              allowClear
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={12} sm={12} md={3} lg={3}>
            <Select
              placeholder="Role"
              value={roleFilter}
              onChange={setRoleFilter}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Roles</Option>
              <Option value="Superadmin">Superadmin</Option>
              <Option value="Admin">Admin</Option>
              <Option value="Manager">Manager</Option>
            </Select>
          </Col>
          <Col xs={12} sm={12} md={3} lg={3}>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Col>
          {(normalizedRole === 'Superadmin' || normalizedRole === 'Admin') && (
            <>
              <Col xs={12} sm={12} md={4} lg={4}>
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
                  onClick={handleExport}
                  size={windowWidth <= 768 ? 'middle' : 'large'}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    background: '#1890ff',
                    border: 'none',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                  }}
                >
                  {windowWidth <= 768 ? 'Export PDF' : 'Export PDF'}
                </Button>
              </Col>
              <Col xs={12} sm={12} md={4} lg={4}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleCreate}
                  size={windowWidth <= 768 ? 'middle' : 'large'}
                  style={{ 
                    width: '100%',
                    backgroundColor: '#ff6b35', 
                    borderColor: '#ff6b35',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}
                >
                  {windowWidth <= 768 ? 'Add' : (normalizedRole === 'Superadmin' ? 'Create Admin' : 'Create Manager')}
                </Button>
              </Col>
            </>
          )}
        </Row>
      </Card>

      {/* Table */}
      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
      >
        {filteredAdmins.length === 0 ? (
          <Empty 
            description={
              <span style={{ color: '#999', fontFamily: "'Poppins', sans-serif" }}>
                {admins.length === 0 ? 'No admins found. Create your first admin!' : 'No admins match your filters.'}
              </span>
            }
            style={{ padding: '40px 0' }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredAdmins}
            loading={loading}
            rowKey="_id"
            scroll={{ x: 1000 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} admins`,
              style: { fontFamily: "'Poppins', sans-serif" }
            }}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        title={editingAdmin ? 'Edit Admin' : (normalizedRole === 'Superadmin' ? 'Create Admin' : 'Create Manager')}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter admin name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input disabled={!!editingAdmin} placeholder="Enter email address" />
          </Form.Item>
          {!editingAdmin && (
            <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
              <Input.Password placeholder="Enter password (min 6 characters)" />
            </Form.Item>
          )}
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>
          {editingAdmin && (
            <Form.Item name="isActive" label="Status">
              <Select placeholder="Select status">
                <Option value={true}>Active</Option>
                <Option value={false}>Inactive</Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{ backgroundColor: '#ff6b35', borderColor: '#ff6b35' }}
              >
                {editingAdmin ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminManagement;
