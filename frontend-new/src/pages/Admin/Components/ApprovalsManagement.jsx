import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Input,
  Select,
  message,
  Tag,
  Space,
  Row,
  Col,
  Typography,
  Statistic,
  Descriptions,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  Empty,
  Popconfirm
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

// Import Google Font (Poppins) - Same as other pages
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ApprovalsManagement = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const adminRole = localStorage.getItem('adminRole') || 'Admin';
  const normalizedRole = adminRole === 'Super Admin' ? 'Superadmin' : adminRole;

  useEffect(() => {
    if (normalizedRole === 'Superadmin') {
      fetchPendingApprovals();
    } else {
      fetchMyApprovals();
    }
  }, [normalizedRole, filterStatus]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      // Superadmin sees all approvals (pending, approved, rejected) - not dismissed
      const statusParam = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
      const response = await fetch(`http://localhost:5000/api/admin/approvals/pending${statusParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setApprovals(data);
    } catch (error) {
      message.error('Failed to fetch approvals');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApprovals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const statusParam = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
      const response = await fetch(`http://localhost:5000/api/admin/approvals/my-requests${statusParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setApprovals(data);
    } catch (error) {
      message.error('Failed to fetch approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/approvals/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve');
      }
      
      message.success({
        content: '✅ Approval request approved and processed successfully! The changes are now live.',
        duration: 5
      });
      
      // Refresh packages list if on package management
      if (window.location.pathname.includes('/admin/packages')) {
        // Trigger package refresh by dispatching custom event
        window.dispatchEvent(new Event('packages-refresh'));
      }
      
      if (normalizedRole === 'Superadmin') {
        fetchPendingApprovals();
      } else {
        fetchMyApprovals();
      }
      setDetailModalVisible(false);
      setSelectedApproval(null);
    } catch (error) {
      message.error(error.message || 'Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      message.error('Please provide a rejection reason');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/approvals/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rejectionReason })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject');
      }
      
      message.success({
        content: 'Approval request rejected. The requesting admin has been notified.',
        duration: 5
      });
      setRejectionReason('');
      setDetailModalVisible(false);
      setSelectedApproval(null);
      if (normalizedRole === 'Superadmin') {
        fetchPendingApprovals();
      } else {
        fetchMyApprovals();
      }
    } catch (error) {
      message.error(error.message || 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const formatActionType = (type) => {
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'orange',
      'approved': 'green',
      'rejected': 'red'
    };
    return colors[status] || 'default';
  };

  const getActionTypeColor = (type) => {
    if (type.includes('create')) return 'blue';
    if (type.includes('update')) return 'cyan';
    if (type.includes('delete')) return 'red';
    return 'default';
  };

  // Filter approvals
  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = 
      formatActionType(approval.actionType).toLowerCase().includes(searchText.toLowerCase()) ||
      approval.requestedBy?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      approval.requestedBy?.email?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || approval.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: approvals.length,
    pending: approvals.filter(a => a.status === 'pending').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length
  };

  const columns = [
    {
      title: 'Action Type',
      dataIndex: 'actionType',
      key: 'actionType',
      render: (type) => (
        <Tag color={getActionTypeColor(type)} style={{ fontSize: '12px', padding: '4px 12px' }}>
          {formatActionType(type)}
        </Tag>
      ),
      width: 180
    },
    {
      title: 'Requested By',
      dataIndex: ['requestedBy', 'name'],
      key: 'requestedBy',
      render: (name, record) => (
        <Space>
          <Avatar 
            size="small" 
            icon={<UserOutlined />}
            src={record.requestedBy?.avatar}
            style={{ backgroundColor: '#ff6b35' }}
          />
          <div>
            <Text strong>{name || 'Unknown'}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.requestedBy?.email || ''}
            </Text>
          </div>
        </Space>
      ),
      width: 200
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'pending' ? 'processing' : status === 'approved' ? 'success' : 'error'}
          text={
            <Tag color={getStatusColor(status)} style={{ fontSize: '12px', padding: '4px 12px' }}>
              {status.toUpperCase()}
            </Tag>
          }
        />
      ),
      width: 120
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#999' }} />
          <Text>{new Date(date).toLocaleString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</Text>
        </Space>
      ),
      width: 180
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="default"
              icon={<EyeOutlined />} 
              onClick={() => {
                setSelectedApproval(record);
                setDetailModalVisible(true);
              }}
            >
              View
            </Button>
          </Tooltip>
          {normalizedRole === 'Superadmin' && record.status === 'pending' && (
            <>
              <Popconfirm
                title="Approve this request?"
                description="This action will be processed immediately."
                onConfirm={() => handleApprove(record._id)}
                okText="Yes, Approve"
                cancelText="Cancel"
                okButtonProps={{ type: 'primary', icon: <CheckOutlined /> }}
              >
                <Tooltip title="Approve Request">
                  <Button 
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  >
                    Approve
                  </Button>
                </Tooltip>
              </Popconfirm>
              <Tooltip title="Reject Request">
                <Button 
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    setSelectedApproval(record);
                    setDetailModalVisible(true);
                  }}
                >
                  Reject
                </Button>
              </Tooltip>
            </>
          )}
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
          {normalizedRole === 'Superadmin' ? 'Approvals Dashboard' : 'My Approval Requests'}
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
          {normalizedRole === 'Superadmin' 
            ? 'Review and approve/reject admin requests' 
            : 'Track your submitted approval requests'}
        </p>

        {/* Refresh Button - Top Right */}
        <Button 
          type="primary"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={() => {
            if (normalizedRole === 'Superadmin') {
              fetchPendingApprovals();
            } else {
              fetchMyApprovals();
            }
          }}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Total Requests</span>}
              value={stats.total}
              prefix={<FileTextOutlined />}
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
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Approved</span>}
              value={stats.approved}
              prefix={<CheckCircleOutlined />}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Rejected</span>}
              value={stats.rejected}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card
        style={{
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: 'none'
        }}
        styles={{ body: { padding: '24px' } }}
      >
        {/* Search and Filter Bar */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={16}>
            <Input
              placeholder="Search by action type, requester name or email..."
              prefix={<UserOutlined style={{ color: '#999' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size={windowWidth <= 768 ? 'middle' : 'large'}
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              style={{ width: '100%', borderRadius: '8px' }}
              placeholder="Filter by status"
            >
              <Option value="all">All Status</Option>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Col>
        </Row>

        {/* Table */}
        {filteredApprovals.length === 0 ? (
          <Empty
            description="No approval requests found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: '40px 0' }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredApprovals}
            loading={loading}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} requests`,
              style: { fontFamily: "'Poppins', sans-serif" }
            }}
            scroll={{ x: 1000 }}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined style={{ color: '#ff6b35' }} />
            <Title level={4} style={{ margin: 0, fontFamily: "'Poppins', sans-serif" }}>
              Approval Request Details
            </Title>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedApproval(null);
          setRejectionReason('');
        }}
        footer={null}
        width={700}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {selectedApproval && (
          <div>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Action Type">
                <Tag color={getActionTypeColor(selectedApproval.actionType)}>
                  {formatActionType(selectedApproval.actionType)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Requested By">
                <Space>
                  <Avatar 
                    icon={<UserOutlined />}
                    src={selectedApproval.requestedBy?.avatar}
                    style={{ backgroundColor: '#ff6b35' }}
                  />
                  <div>
                    <Text strong>{selectedApproval.requestedBy?.name || 'Unknown'}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {selectedApproval.requestedBy?.email || ''}
                    </Text>
                  </div>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge 
                  status={selectedApproval.status === 'pending' ? 'processing' : selectedApproval.status === 'approved' ? 'success' : 'error'}
                  text={
                    <Tag color={getStatusColor(selectedApproval.status)}>
                      {selectedApproval.status.toUpperCase()}
                    </Tag>
                  }
                />
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(selectedApproval.createdAt).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Descriptions.Item>
              {selectedApproval.approvedBy && (
                <Descriptions.Item label="Approved/Rejected By">
                  <Space>
                    <Avatar 
                      icon={<UserOutlined />}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                    <Text>{selectedApproval.approvedBy?.name || 'Unknown'}</Text>
                  </Space>
                </Descriptions.Item>
              )}
              {selectedApproval.approvedAt && (
                <Descriptions.Item label="Processed At">
                  {new Date(selectedApproval.approvedAt).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Descriptions.Item>
              )}
              {selectedApproval.rejectionReason && (
                <Descriptions.Item label="Rejection Reason">
                  <Text type="danger">{selectedApproval.rejectionReason}</Text>
                </Descriptions.Item>
              )}
              {selectedApproval.notes && (
                <Descriptions.Item label="Notes">
                  <Text>{selectedApproval.notes}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            <Title level={5} style={{ fontFamily: "'Poppins', sans-serif" }}>
              Request Data
            </Title>
            <Card
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                marginBottom: '20px'
              }}
            >
              <pre style={{
                margin: 0,
                fontFamily: "'Poppins', monospace",
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {JSON.stringify(selectedApproval.data, null, 2)}
              </pre>
            </Card>

            {normalizedRole === 'Superadmin' && selectedApproval.status === 'pending' && (
              <div>
                <Divider />
                <Title level={5} style={{ fontFamily: "'Poppins', sans-serif", marginBottom: '12px' }}>
                  <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                  Action Required
                </Title>
                <TextArea
                  rows={4}
                  placeholder="Enter rejection reason (required for rejection)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  style={{ marginBottom: '16px', borderRadius: '8px' }}
                />
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={() => {
                      setDetailModalVisible(false);
                      setSelectedApproval(null);
                      setRejectionReason('');
                    }}
                    style={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </Button>
                  <Popconfirm
                    title="Reject this request?"
                    description="Please ensure you have provided a rejection reason."
                    onConfirm={() => handleReject(selectedApproval._id)}
                    okText="Yes, Reject"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    disabled={!rejectionReason.trim()}
                  >
                    <Button
                      danger
                      icon={<CloseCircleOutlined />}
                      disabled={!rejectionReason.trim()}
                      style={{ borderRadius: '8px' }}
                    >
                      Reject
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Approve this request?"
                    description="This action will be processed immediately."
                    onConfirm={() => handleApprove(selectedApproval._id)}
                    okText="Yes, Approve"
                    cancelText="Cancel"
                    okButtonProps={{ type: 'primary', icon: <CheckOutlined /> }}
                  >
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      style={{
                        backgroundColor: '#52c41a',
                        borderColor: '#52c41a',
                        borderRadius: '8px'
                      }}
                    >
                      Approve
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApprovalsManagement;
