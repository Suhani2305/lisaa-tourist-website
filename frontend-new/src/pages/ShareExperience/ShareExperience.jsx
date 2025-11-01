import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  message, 
  Select,
  Rate,
  Upload,
  Divider,
  Typography,
  Space
} from 'antd';
import { 
  SendOutlined, 
  CameraOutlined,
  StarOutlined,
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { articleService } from '../../services';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ShareExperience = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log('📝 Submitting customer experience:', values);

      const articleData = {
        title: `${values.destination} - ${values.customerName}'s Experience`,
        content: values.experience,
        type: 'customer_experience',
        category: 'Customer Reviews',
        author: values.customerName,
        authorEmail: values.email,
        customerName: values.customerName,
        customerRating: values.rating,
        status: 'draft', // Admin will review before publishing
        featuredImage: values.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90',
        tags: [values.destination, 'Customer Experience', 'Travel Story'],
        seoTitle: `${values.customerName}'s ${values.destination} Travel Experience`,
        seoDescription: values.experience.substring(0, 150),
      };

      await articleService.createArticle(articleData);
      
      message.success('🎉 Thank you for sharing your experience! Our team will review and publish it soon.');
      form.resetFields();
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('❌ Submit experience error:', error);
      message.error('Failed to submit experience. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '40px 20px'
    }}>
      {/* Header */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto 40px auto',
        textAlign: 'center'
      }}>
        <Title level={2} style={{ 
          color: '#FF6B35',
          marginBottom: '16px',
          fontSize: '2.5rem'
        }}>
          ✈️ Share Your Travel Experience
        </Title>
        <Paragraph style={{ 
          fontSize: '16px', 
          color: '#6c757d',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Traveled with us? We'd love to hear about your journey! 
          Share your story and inspire others to explore the world.
        </Paragraph>
      </div>

      {/* Form Card */}
      <Card 
        style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            rating: 5
          }}
        >
          <Divider orientation="left">
            <UserOutlined /> Your Information
          </Divider>

          <Form.Item
            name="customerName"
            label="Your Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input 
              prefix={<UserOutlined />}
              placeholder="Enter your full name" 
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />}
              placeholder="your.email@example.com" 
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Divider orientation="left">
            <EnvironmentOutlined /> Your Journey
          </Divider>

          <Form.Item
            name="destination"
            label="Destination Visited"
            rules={[{ required: true, message: 'Please select destination' }]}
          >
            <Input 
              prefix={<EnvironmentOutlined />}
              placeholder="e.g., Kerala, Rajasthan, Goa, Himachal Pradesh" 
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="rating"
            label="Overall Rating"
            rules={[{ required: true, message: 'Please rate your experience' }]}
          >
            <Rate 
              style={{ fontSize: '32px' }}
              character={<StarOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="experience"
            label="Share Your Experience"
            rules={[
              { required: true, message: 'Please share your travel experience' },
              { min: 100, message: 'Please write at least 100 characters' }
            ]}
          >
            <TextArea
              rows={10}
              placeholder="Tell us about your journey... What did you love? What made it special? Any memorable moments? Travel tips for others?"
              style={{ borderRadius: '8px' }}
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Photo from Your Trip (Optional)"
            tooltip="Paste image URL from Google Photos, Dropbox, or Unsplash"
          >
            <Input 
              prefix={<CameraOutlined />}
              placeholder="Paste image URL here (optional)" 
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Image Preview"
          >
            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.imageUrl !== curr.imageUrl}>
              {({ getFieldValue }) => {
                const imageUrl = getFieldValue('imageUrl');
                return imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Trip Photo Preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px', 
                      borderRadius: '12px',
                      objectFit: 'cover',
                      display: 'block',
                      margin: '0 auto'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      message.warning('Invalid image URL');
                    }}
                  />
                ) : (
                  <div style={{ 
                    padding: '40px', 
                    border: '2px dashed #d9d9d9', 
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#999'
                  }}>
                    <CameraOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                    <br />
                    Paste your image URL above to see preview
                  </div>
                );
              }}
            </Form.Item>
          </Form.Item>

          <Divider />

          <div style={{ 
            backgroundColor: '#fff9f5', 
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              📌 <strong>Note:</strong> Your experience will be reviewed by our team before publishing. 
              We may contact you via email for verification. Thank you for sharing your story!
            </Text>
          </div>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button 
                onClick={() => navigate('/')}
                size="large"
                style={{ borderRadius: '8px' }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<SendOutlined />}
                style={{
                  backgroundColor: '#FF6B35',
                  borderColor: '#FF6B35',
                  borderRadius: '8px',
                  fontWeight: '600',
                  padding: '0 40px'
                }}
              >
                Submit Experience
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Tips Card */}
      <Card 
        style={{ 
          maxWidth: '800px', 
          margin: '40px auto 0 auto',
          borderRadius: '16px',
          backgroundColor: '#fff9f5',
          border: '2px solid #FF6B35'
        }}
      >
        <Title level={4} style={{ color: '#FF6B35', marginBottom: '16px' }}>
          💡 Tips for Writing a Great Review
        </Title>
        <ul style={{ color: '#6c757d', lineHeight: '2' }}>
          <li>Be specific about what you loved (food, scenery, activities, etc.)</li>
          <li>Mention your travel dates and season</li>
          <li>Share helpful tips for future travelers</li>
          <li>Include any challenges you faced and how you overcame them</li>
          <li>Add photos to make your story come alive!</li>
        </ul>
      </Card>
    </div>
  );
};

export default ShareExperience;


