import React, { useState, useEffect } from 'react';
import {
  Card, 
  Form,
  Input,
  Button,
  Avatar,
  message,
  Spin,
  Typography,
  Divider,
  Row,
  Col,
  Select,
  Upload,
  Radio,
  DatePicker
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  CameraOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { authService, mediaService } from '../../services';
import Header from '../landingpage/components/Header';
import Footer from '../landingpage/components/Footer';

const { Title, Text } = Typography;
const { Option } = Select;

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await authService.getProfile();
      setUser(userData);
      setProfileImageUrl(userData.profileImage || '');
      
      // Set form values
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender || 'male',
        dateOfBirth: userData.dateOfBirth ? dayjs(userData.dateOfBirth) : null,
        city: userData.address?.city || '',
        state: userData.address?.state || '',
        country: userData.address?.country || 'India',
        street: userData.address?.street || '',
        zipCode: userData.address?.zipCode || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      message.error('Failed to load profile');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    
    // Get file from input
    const file = info.file.originFileObj || info.file;
    
    // Validate file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return;
    }
    
    // Validate file size (max 2MB)
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return;
    }
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    
    setImageFile(file);
  };

  const handleUpdateProfile = async (values) => {
    try {
      setSaving(true);
      
      // Prepare update data
      const updateData = {
        name: values.name,
        phone: values.phone,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth && dayjs.isDayjs(values.dateOfBirth) ? values.dateOfBirth.toISOString() : (values.dateOfBirth || null),
        address: {
          street: values.street || '',
          city: values.city || '',
          state: values.state || '',
          zipCode: values.zipCode || '',
          country: values.country || 'India'
        }
      };
      
      // If image is selected, upload directly to Cloudinary
      if (imageFile) {
        try {
          message.loading({ content: 'Uploading profile image...', key: 'profile' });
          const uploadResponse = await mediaService.uploadImage(imageFile);
          if (uploadResponse.url) {
            updateData.profileImage = uploadResponse.url;
            
            await authService.updateProfile(updateData);
            message.success({ content: 'Profile updated successfully!', key: 'profile' });
            
            // Refresh profile data
            await fetchUserProfile();
            setSaving(false);
          } else {
            throw new Error('Failed to get image URL from upload response');
          }
        } catch (error) {
          console.error('Image upload error:', error);
          message.error({ content: error.message || 'Failed to upload profile image', key: 'profile' });
          setSaving(false);
        }
      } else {
        await authService.updateProfile(updateData);
        message.success('Profile updated successfully!');
        
        // Refresh profile data
        await fetchUserProfile();
        setSaving(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error(error.message || 'Failed to update profile');
      setSaving(false);
    }
  };

  const getAvatarIcon = () => {
    if (profileImageUrl) {
      return null;
    }
    
    const gender = form.getFieldValue('gender') || user?.gender || 'male';
    if (gender === 'female') {
      return <WomanOutlined style={{ fontSize: '48px' }} />;
    } else {
      return <ManOutlined style={{ fontSize: '48px' }} />;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <Header />
      
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <Card
          style={{
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
              <Avatar
                size={120}
                icon={getAvatarIcon()}
                src={profileImageUrl}
                style={{ 
                  backgroundColor: form.getFieldValue('gender') === 'female' ? '#ff6b9d' : '#ff6b35',
                  border: '4px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleImageChange}
                accept="image/*"
              >
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CameraOutlined />}
                  size="large"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#ff6b35',
                    borderColor: '#ff6b35',
                  }}
                />
              </Upload>
            </div>
            <Title level={2} style={{ margin: 0 }}>
              Profile Settings
            </Title>
            <Text type="secondary">
              Update your personal information and profile picture
            </Text>
          </div>

          <Divider />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
            size="large"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: '#ff6b35' }} />}
                    placeholder="Enter your full name"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                >
                  <Input 
                    prefix={<MailOutlined style={{ color: '#ff6b35' }} />}
                    placeholder="Enter your email"
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined style={{ color: '#ff6b35' }} />}
                    placeholder="Enter your phone number"
                    maxLength={10}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: 'Please select your gender' }]}
                >
                  <Radio.Group
                    onChange={(e) => {
                      // Force re-render to update avatar color
                      form.setFieldsValue({ gender: e.target.value });
                    }}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="male">
                      <ManOutlined /> Male
                    </Radio.Button>
                    <Radio.Button value="female">
                      <WomanOutlined /> Female
                    </Radio.Button>
                    <Radio.Button value="other">
                      <UserOutlined /> Other
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="dateOfBirth"
                  label="Date of Birth"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Select your date of birth"
                    disabledDate={(current) => {
                      // Disable future dates
                      return current && current > dayjs();
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />
            <Title level={4}>Address Information</Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="street"
                  label="Street Address"
                >
                  <Input placeholder="Enter street address" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="city"
                  label="City"
                >
                  <Input placeholder="Enter city" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="state"
                  label="State"
                >
                  <Input placeholder="Enter state" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="zipCode"
                  label="Zip Code"
                >
                  <Input placeholder="Enter zip code" maxLength={10} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="country"
                  label="Country"
                >
                  <Select placeholder="Select country" defaultValue="India">
                    <Option value="India">India</Option>
                    <Option value="USA">USA</Option>
                    <Option value="UK">UK</Option>
                    <Option value="Canada">Canada</Option>
                    <Option value="Australia">Australia</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Member Since">
                  <Input 
                    value={new Date(user?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving}
                size="large"
                block
                style={{
                  backgroundColor: '#ff6b35',
                  borderColor: '#ff6b35',
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button
                type="link"
                onClick={() => navigate('/user-dashboard')}
                style={{ color: '#ff6b35' }}
              >
                Back to Dashboard
              </Button>
            </div>
          </Form>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;

