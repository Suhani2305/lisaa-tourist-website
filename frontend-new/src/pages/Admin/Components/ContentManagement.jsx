import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
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
  Upload
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
  QrcodeOutlined,
  FileOutlined,
  EditOutlined as EditIcon,
  EyeOutlined as ViewIcon,
  LinkOutlined,
  PictureOutlined,
  SoundOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined
} from '@ant-design/icons';
import { articleService } from '../../../services';

// Import Google Font (Poppins) - Same as landing page
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ContentManagement = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedContent, setSelectedContent] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock data - In real app, this would come from API
  const mockContents = [
    {
      id: 'CONTENT001',
      title: 'Kerala Backwaters - A Complete Travel Guide',
      type: 'blog_post',
      category: 'Travel Guide',
      status: 'published',
      author: 'Rajesh Kumar',
      publishDate: '2024-02-15',
      lastModified: '2024-02-20',
      views: 1250,
      likes: 45,
      shares: 12,
      tags: ['Kerala', 'Backwaters', 'Travel Guide', 'Houseboat'],
      featured: true,
      seoTitle: 'Kerala Backwaters Travel Guide - Complete Information',
      seoDescription: 'Discover the beauty of Kerala backwaters with our comprehensive travel guide. Best time to visit, places to see, and travel tips.',
      content: 'Kerala backwaters are a network of brackish lagoons and lakes lying parallel to the Arabian Sea coast...',
      featuredImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400',
      images: [
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
      ],
      metaKeywords: 'Kerala backwaters, houseboat, travel guide, Kerala tourism',
      readingTime: '8 min read',
      wordCount: 1200
    },
    {
      id: 'CONTENT002',
      title: 'Rajasthan Heritage Tour - Palace Stays and Cultural Experiences',
      type: 'tour_description',
      category: 'Tour Information',
      status: 'draft',
      author: 'Priya Sharma',
      publishDate: null,
      lastModified: '2024-02-18',
      views: 0,
      likes: 0,
      shares: 0,
      tags: ['Rajasthan', 'Heritage', 'Palace', 'Cultural'],
      featured: false,
      seoTitle: 'Rajasthan Heritage Tour - Palace Stays and Cultural Experiences',
      seoDescription: 'Experience the royal heritage of Rajasthan with palace stays and cultural experiences.',
      content: 'Discover the royal heritage of Rajasthan with our exclusive palace stays and cultural experiences...',
      featuredImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
      images: [
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400'
      ],
      metaKeywords: 'Rajasthan heritage, palace stays, cultural tours, royal experience',
      readingTime: '6 min read',
      wordCount: 900
    },
    {
      id: 'CONTENT003',
      title: 'Andaman Islands - Adventure Activities and Water Sports',
      type: 'video_content',
      category: 'Adventure',
      status: 'published',
      author: 'Amit Patel',
      publishDate: '2024-02-10',
      lastModified: '2024-02-12',
      views: 2100,
      likes: 78,
      shares: 25,
      tags: ['Andaman', 'Adventure', 'Water Sports', 'Islands'],
      featured: true,
      seoTitle: 'Andaman Islands Adventure Activities - Water Sports Guide',
      seoDescription: 'Explore adventure activities and water sports in Andaman Islands. Snorkeling, diving, and island hopping.',
      content: 'Andaman Islands offer some of the best adventure activities and water sports in India...',
      featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400'
      ],
      metaKeywords: 'Andaman islands, water sports, adventure activities, snorkeling, diving',
      readingTime: '5 min read',
      wordCount: 750,
      videoUrl: 'https://example.com/andaman-video.mp4'
    },
    {
      id: 'CONTENT004',
      title: 'Travel Tips for First-Time Visitors to India',
      type: 'blog_post',
      category: 'Travel Tips',
      status: 'published',
      author: 'Sarah Wilson',
      publishDate: '2024-01-25',
      lastModified: '2024-02-05',
      views: 3200,
      likes: 120,
      shares: 45,
      tags: ['India', 'Travel Tips', 'First Time', 'Guide'],
      featured: false,
      seoTitle: 'Travel Tips for First-Time Visitors to India - Complete Guide',
      seoDescription: 'Essential travel tips for first-time visitors to India. What to know before you go.',
      content: 'India is a diverse and fascinating country that offers incredible experiences for travelers...',
      featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
      ],
      metaKeywords: 'India travel tips, first time visitors, travel guide, India tourism',
      readingTime: '12 min read',
      wordCount: 1800
    }
  ];

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching all articles from backend...');
      const data = await articleService.getAllArticles({ all: 'true', limit: 1000 });
      console.log('📡 Raw API response:', data);
      
      const articlesArray = Array.isArray(data) ? data : [];
      console.log('📰 Processed articles array:', articlesArray);
      console.log('📊 Total articles found:', articlesArray.length);
      
      if (articlesArray.length === 0) {
        message.warning('No articles found in database. Create your first article!');
      } else {
        message.success(`Loaded ${articlesArray.length} articles successfully!`);
      }
      
      // Map backend data to frontend format
      const formattedContents = articlesArray.map(article => ({
        id: article._id,
        title: article.title,
        type: article.type,
        category: article.category,
        status: article.status,
        author: article.author,
        publishDate: article.publishDate ? new Date(article.publishDate).toISOString().split('T')[0] : null,
        lastModified: new Date(article.updatedAt).toISOString().split('T')[0],
        views: article.views,
        likes: article.likes,
        shares: article.shares,
        tags: article.tags || [],
        featured: article.featured,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        content: article.content,
        featuredImage: article.featuredImage,
        images: article.images || [],
        metaKeywords: article.metaKeywords,
        readingTime: article.readingTime,
        wordCount: article.wordCount,
        videoUrl: article.videoUrl
      }));
      
      setContents(formattedContents);
    } catch (error) {
      message.error('Failed to fetch articles. Check console for details.');
      console.error('❌ Fetch error:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (content) => {
    setSelectedContent(content);
    setDetailModalVisible(true);
  };

  const handleEditContent = (content) => {
    setEditingContent(content);
    form.setFieldsValue({
      ...content,
      publishDate: content.publishDate ? (dayjs(content.publishDate).isValid() ? dayjs(content.publishDate) : null) : null
    });
    setModalVisible(true);
  };

  const handleDeleteContent = async (id) => {
    try {
      await articleService.deleteArticle(id);
      setContents(contents.filter(content => content.id !== id));
      message.success('Article deleted successfully! ✅');
    } catch (error) {
      message.error('Failed to delete article');
      console.error('❌ Delete error:', error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await articleService.updateArticleStatus(id, newStatus);
      fetchContents(); // Refresh the list
      message.success(`Article ${newStatus} successfully! ✅`);
    } catch (error) {
      message.error('Failed to update article status');
      console.error('❌ Status update error:', error);
    }
  };

  const handleDuplicateContent = (content) => {
    const newContent = {
      ...content,
      id: `CONTENT${Date.now()}`,
      title: `${content.title} (Copy)`,
      status: 'draft',
      publishDate: null,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      shares: 0
    };
    setContents([newContent, ...contents]);
    message.success('Content duplicated successfully');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      console.log('📝 Form values:', values);
      
      // Prepare article data
      const articleData = {
        ...values,
        publishDate: values.publishDate ? values.publishDate.toISOString() : null,
      };
      
      if (editingContent) {
        // Update existing article
        await articleService.updateArticle(editingContent.id, articleData);
        message.success('Article updated successfully! ✅');
      } else {
        // Create new article
        await articleService.createArticle(articleData);
        message.success('Article created successfully! ✅');
      }
      
      setModalVisible(false);
      form.resetFields();
      setEditingContent(null);
      fetchContents(); // Refresh the list
    } catch (error) {
      console.error('❌ Save article error:', error);
      message.error(error.message || 'Failed to save article. Check console for details.');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setDetailModalVisible(false);
    form.resetFields();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'green';
      case 'draft': return 'orange';
      case 'archived': return 'red';
      case 'scheduled': return 'blue';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'blog_post': return 'blue';
      case 'tour_description': return 'green';
      case 'video_content': return 'purple';
      case 'image_gallery': return 'gold';
      case 'news_article': return 'red';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'blog_post': return <FileTextOutlined />;
      case 'tour_description': return <BookOutlined />;
      case 'video_content': return <VideoCameraOutlined />;
      case 'image_gallery': return <PictureOutlined />;
      case 'news_article': return <FileOutlined />;
      default: return <FileOutlined />;
    }
  };

  // Filter contents based on search and filters
  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchText.toLowerCase()) ||
                         content.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    const matchesType = filterType === 'all' || content.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const totalContents = contents.length;
  const publishedContents = contents.filter(c => c.status === 'published').length;
  const draftContents = contents.filter(c => c.status === 'draft').length;
  const totalViews = contents.reduce((sum, c) => sum + c.views, 0);

  const columns = [
    {
      title: 'Content',
      key: 'content',
      width: 400,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image
            width={80}
            height={60}
            src={record.featuredImage}
            style={{ borderRadius: '8px', objectFit: 'cover' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong style={{ fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>
                {record.title}
              </Text>
              {record.featured && <Tag color="gold">⭐ Featured</Tag>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <Tag color={getTypeColor(record.type)} icon={getTypeIcon(record.type)} style={{ fontSize: '10px' }}>
                {record.type.replace('_', ' ').toUpperCase()}
              </Tag>
              <Tag color="blue" style={{ fontSize: '10px' }}>
                {record.category}
              </Tag>
            </div>
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                By {record.author} • {record.readingTime}
              </Text>
            </div>
            <div style={{ marginTop: '4px' }}>
              {record.tags.slice(0, 3).map((tag, index) => (
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
      title: 'Performance',
      key: 'performance',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <EyeOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>{record.views} views</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <HeartOutlined style={{ color: '#ff6b35', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>{record.likes} likes</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <ShareAltOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>{record.shares} shares</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'SEO',
      key: 'seo',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <LinkOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text style={{ fontSize: '11px' }}>SEO Ready</Text>
          </div>
          <div style={{ marginTop: '4px' }}>
            <Text type="secondary" style={{ fontSize: '10px' }}>
              {record.wordCount} words
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Publish Date',
      key: 'publish',
      width: 120,
      render: (_, record) => (
        <div>
          {record.publishDate ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CalendarOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
              <Text style={{ fontSize: '12px' }}>{record.publishDate}</Text>
            </div>
          ) : (
            <Text type="secondary" style={{ fontSize: '12px' }}>Not Published</Text>
          )}
          <div style={{ marginTop: '4px' }}>
            <Text type="secondary" style={{ fontSize: '10px' }}>
              Modified: {record.lastModified}
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
          <Tooltip title="View Content">
            <Button
              type="text"
              icon={<ViewIcon />}
              onClick={() => handleViewDetails(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Edit Content">
            <Button
              type="text"
              icon={<EditIcon />}
              onClick={() => handleEditContent(record)}
              style={{ color: '#ff6b35' }}
            />
          </Tooltip>
          <Tooltip title="Duplicate Content">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleDuplicateContent(record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          {record.status === 'draft' && (
            <Tooltip title="Publish Content">
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'published')}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          {record.status === 'published' && (
            <Tooltip title="Archive Content">
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'archived')}
                style={{ color: '#faad14' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete Content">
            <Popconfirm
              title="Are you sure you want to delete this content?"
              onConfirm={() => handleDeleteContent(record.id)}
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
          textShadow: '0 2px 4px rgba(255, 107, 53, 0.1)',
          textAlign: 'center'
        }}>
          Content Management
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
          Manage blog posts, tour descriptions, and website content
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Total Content</span>}
              value={totalContents}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Published</span>}
              value={publishedContents}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Drafts</span>}
              value={draftContents}
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
              title={<span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: windowWidth <= 768 ? '12px' : '14px' }}>Total Views</span>}
              value={totalViews}
              valueStyle={{ color: 'white', fontSize: windowWidth <= 768 ? '24px' : '32px', fontWeight: '700' }}
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
        styles={{ body: { padding: windowWidth <= 768 ? '12px' : '20px' } }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={8}>
            <Input
              placeholder="Search content..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              allowClear
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              placeholder="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Status</Option>
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
              <Option value="archived">Archived</Option>
              <Option value="scheduled">Scheduled</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              placeholder="Type"
              value={filterType}
              onChange={setFilterType}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Types</Option>
              <Option value="blog_post">Blog Post</Option>
              <Option value="tour_description">Tour Description</Option>
              <Option value="video_content">Video Content</Option>
              <Option value="image_gallery">Image Gallery</Option>
              <Option value="news_article">News Article</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
              size={windowWidth <= 768 ? 'middle' : 'large'}
              block
              style={{
                borderRadius: '8px',
                background: '#ff6b35',
                border: 'none',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                height: windowWidth <= 768 ? '32px' : '40px'
              }}
            >
              Add Content
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Contents Table */}
      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
        styles={{ body: { padding: windowWidth <= 768 ? '12px' : '20px' } }}
      >
        <Table
          columns={columns}
          dataSource={filteredContents}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredContents.length,
            pageSize: windowWidth <= 768 ? 5 : 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} contents`,
            style: { fontFamily: "'Poppins', sans-serif" }
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Content Details Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            📰 Content Details - {selectedContent?.title}
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
          <Button key="close" onClick={handleModalCancel} style={{ borderRadius: '8px' }}>
            Close
          </Button>
        ]}
      >
        {selectedContent && (
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
                          <Card title="Content Information" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Title">{selectedContent.title}</Descriptions.Item>
                              <Descriptions.Item label="Type">
                                <Tag color={getTypeColor(selectedContent.type)} icon={getTypeIcon(selectedContent.type)}>
                                  {selectedContent.type.replace('_', ' ').toUpperCase()}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Category">{selectedContent.category}</Descriptions.Item>
                              <Descriptions.Item label="Author">{selectedContent.author}</Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Performance" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Views">{selectedContent.views}</Descriptions.Item>
                              <Descriptions.Item label="Likes">{selectedContent.likes}</Descriptions.Item>
                              <Descriptions.Item label="Shares">{selectedContent.shares}</Descriptions.Item>
                              <Descriptions.Item label="Reading Time">{selectedContent.readingTime}</Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                      </Row>
                      
                      <Divider />
                      
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card title="SEO Information" size="small">
                            <Text strong>SEO Title:</Text>
                            <br />
                            <Text>{selectedContent.seoTitle}</Text>
                            <br /><br />
                            <Text strong>SEO Description:</Text>
                            <br />
                            <Text>{selectedContent.seoDescription}</Text>
                            <br /><br />
                            <Text strong>Keywords:</Text>
                            <br />
                            <Text>{selectedContent.metaKeywords}</Text>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Content Details" size="small">
                            <Text strong>Status:</Text>
                            <br />
                            <Tag color={getStatusColor(selectedContent.status)}>
                              {selectedContent.status.toUpperCase()}
                            </Tag>
                            <br /><br />
                            <Text strong>Word Count:</Text>
                            <br />
                            <Text>{selectedContent.wordCount} words</Text>
                            <br /><br />
                            <Text strong>Featured:</Text>
                            <br />
                            <Text>{selectedContent.featured ? 'Yes' : 'No'}</Text>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  )
                },
                {
                  key: 'content',
                  label: 'Content',
                  children: (
                    <div>
                      <Card title="Content Preview" size="small">
                        <Text>{selectedContent.content}</Text>
                      </Card>
                      <Card title="Tags" size="small" style={{ marginTop: '16px' }}>
                        <div>
                          {selectedContent.tags?.map((tag, index) => (
                            <Tag key={index} style={{ margin: '2px' }}>{tag}</Tag>
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

      {/* Add/Edit Content Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            {editingContent ? 'Edit Content' : 'Create New Content'}
          </div>
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText="Save Content"
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
          <Form.Item
            name="title"
            label="Content Title"
            rules={[{ required: true, message: 'Please enter content title' }]}
          >
            <Input placeholder="Enter content title" style={{ borderRadius: '8px' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Content Type"
                rules={[{ required: true, message: 'Please select content type' }]}
              >
                <Select placeholder="Select type" style={{ borderRadius: '8px' }}>
                  <Option value="blog_post">Blog Post</Option>
                  <Option value="tour_description">Tour Description</Option>
                  <Option value="video_content">Video Content</Option>
                  <Option value="image_gallery">Image Gallery</Option>
                  <Option value="news_article">News Article</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please enter category' }]}
              >
                <Input placeholder="Enter category" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter content' }]}
          >
            <TextArea
              rows={6}
              placeholder="Enter content"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="author"
                label="Author"
                rules={[{ required: true, message: 'Please enter author' }]}
              >
                <Input placeholder="Enter author name" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status" style={{ borderRadius: '8px' }}>
                  <Option value="draft">Draft</Option>
                  <Option value="published">Published</Option>
                  <Option value="scheduled">Scheduled</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tags"
            label="Tags"
          >
            <Select
              mode="tags"
              placeholder="Enter tags (press Enter to add)"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Divider orientation="left">📸 Images</Divider>

          <Form.Item
            name="featuredImage"
            label="Featured Image URL"
            tooltip="Main image for the article. Use high-quality image (1920x1080 recommended)"
          >
            <Input 
              placeholder="Paste image URL here (e.g., https://images.unsplash.com/photo-...?w=1920&q=90)" 
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Preview Featured Image"
          >
            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.featuredImage !== curr.featuredImage}>
              {({ getFieldValue }) => {
                const imageUrl = getFieldValue('featuredImage');
                return imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Featured Image Preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px', 
                      borderRadius: '12px',
                      objectFit: 'cover'
                    }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
                  />
                ) : (
                  <div style={{ 
                    padding: '40px', 
                    border: '2px dashed #d9d9d9', 
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#999'
                  }}>
                    Paste image URL above to see preview
                  </div>
                );
              }}
            </Form.Item>
          </Form.Item>

          <Divider orientation="left">🔍 SEO Settings</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="seoTitle"
                label="SEO Title"
              >
                <Input placeholder="Enter SEO title" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="metaKeywords"
                label="Meta Keywords"
              >
                <Input placeholder="Enter keywords" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="seoDescription"
            label="SEO Description"
          >
            <TextArea
              rows={3}
              placeholder="Enter SEO description"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentManagement;
