import React, { useState, useEffect } from 'react';
import { mediaService } from '../../../services';
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
  Upload,
  Grid
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
  FilePptOutlined,
  UploadOutlined,
  FolderOutlined,
  FileImageOutlined,
  PlayCircleOutlined,
  AudioOutlined,
  FileZipOutlined,
  CloudUploadOutlined,
  DeleteOutlined as DeleteIcon,
  StarOutlined as StarIcon,
  HeartOutlined as HeartIcon,
  DownloadOutlined as DownloadIcon
} from '@ant-design/icons';

// Import Google Font (Poppins) - Same as landing page
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Meta } = Card;

const MediaGallery = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Mock data - In real app, this would come from API
  const mockMediaFiles = [
    {
      id: 'MEDIA001',
      name: 'kerala-backwaters-sunset.jpg',
      title: 'Kerala Backwaters Sunset',
      type: 'image',
      category: 'Destinations',
      size: '2.5 MB',
      dimensions: '1920x1080',
      format: 'JPEG',
      url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=200',
      alt: 'Beautiful sunset over Kerala backwaters',
      description: 'Stunning sunset view over the serene backwaters of Kerala',
      tags: ['Kerala', 'Backwaters', 'Sunset', 'Nature'],
      uploadedBy: 'Rajesh Kumar',
      uploadDate: '2024-02-15',
      lastModified: '2024-02-20',
      views: 1250,
      downloads: 45,
      likes: 23,
      featured: true,
      status: 'active',
      fileSize: 2500000,
      mimeType: 'image/jpeg'
    },
    {
      id: 'MEDIA002',
      name: 'rajasthan-palace-tour.mp4',
      title: 'Rajasthan Palace Tour',
      type: 'video',
      category: 'Tours',
      size: '45.2 MB',
      dimensions: '1920x1080',
      format: 'MP4',
      url: 'https://example.com/rajasthan-palace-tour.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200',
      alt: 'Tour of Rajasthan palace',
      description: 'Complete tour of the magnificent Rajasthan palace',
      tags: ['Rajasthan', 'Palace', 'Tour', 'Heritage'],
      uploadedBy: 'Priya Sharma',
      uploadDate: '2024-02-10',
      lastModified: '2024-02-12',
      views: 2100,
      downloads: 78,
      likes: 45,
      featured: true,
      status: 'active',
      fileSize: 45200000,
      mimeType: 'video/mp4',
      duration: '5:30'
    },
    {
      id: 'MEDIA003',
      name: 'andaman-diving-experience.jpg',
      title: 'Andaman Diving Experience',
      type: 'image',
      category: 'Activities',
      size: '3.1 MB',
      dimensions: '2560x1440',
      format: 'JPEG',
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200',
      alt: 'Underwater diving in Andaman',
      description: 'Amazing underwater diving experience in Andaman Islands',
      tags: ['Andaman', 'Diving', 'Underwater', 'Adventure'],
      uploadedBy: 'Amit Patel',
      uploadDate: '2024-02-08',
      lastModified: '2024-02-10',
      views: 1800,
      downloads: 32,
      likes: 67,
      featured: false,
      status: 'active',
      fileSize: 3100000,
      mimeType: 'image/jpeg'
    },
    {
      id: 'MEDIA004',
      name: 'travel-guide-audio.mp3',
      title: 'Kerala Travel Guide Audio',
      type: 'audio',
      category: 'Guides',
      size: '8.7 MB',
      dimensions: null,
      format: 'MP3',
      url: 'https://example.com/kerala-travel-guide.mp3',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
      alt: 'Audio guide for Kerala travel',
      description: 'Comprehensive audio guide for Kerala travel',
      tags: ['Kerala', 'Audio', 'Guide', 'Travel'],
      uploadedBy: 'Sarah Wilson',
      uploadDate: '2024-02-05',
      lastModified: '2024-02-07',
      views: 950,
      downloads: 156,
      likes: 34,
      featured: false,
      status: 'active',
      fileSize: 8700000,
      mimeType: 'audio/mpeg',
      duration: '12:45'
    },
    {
      id: 'MEDIA005',
      name: 'tour-brochure.pdf',
      title: 'Complete Tour Brochure',
      type: 'document',
      category: 'Marketing',
      size: '4.2 MB',
      dimensions: null,
      format: 'PDF',
      url: 'https://example.com/tour-brochure.pdf',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
      alt: 'Tour brochure PDF',
      description: 'Complete tour brochure with all destinations',
      tags: ['Brochure', 'PDF', 'Marketing', 'Tours'],
      uploadedBy: 'Vikram Singh',
      uploadDate: '2024-02-01',
      lastModified: '2024-02-03',
      views: 3200,
      downloads: 89,
      likes: 12,
      featured: false,
      status: 'active',
      fileSize: 4200000,
      mimeType: 'application/pdf'
    }
  ];

  useEffect(() => {
    fetchMediaFiles();
  }, [filterType, filterCategory, searchText]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fetchMediaFiles = async () => {
    setLoading(true);
    try {
      const response = await mediaService.getAllMedia({
        type: filterType !== 'all' ? filterType : undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        search: searchText || undefined,
        isActive: true
      });
      
      // Transform API data to match component format
      const transformedMedia = Array.isArray(response) ? response.map(media => ({
        id: media._id || media.id,
        name: media.name,
        title: media.title || media.name,
        type: media.type,
        category: media.category || 'Other',
        size: formatFileSize(media.size || 0),
        dimensions: media.dimensions || '',
        format: media.format || '',
        url: media.url,
        thumbnail: media.thumbnail || media.url,
        alt: media.alt || media.title || media.name,
        description: media.description || '',
        tags: media.tags || [],
        uploadedBy: media.uploadedBy || 'Admin',
        uploadDate: media.uploadDate ? new Date(media.uploadDate).toISOString().split('T')[0] : (media.createdAt ? new Date(media.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        lastModified: media.lastModified ? new Date(media.lastModified).toISOString().split('T')[0] : (media.updatedAt ? new Date(media.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        views: media.views || 0,
        downloads: media.downloads || 0,
        likes: media.likes || 0,
        status: media.isActive ? 'active' : 'inactive',
        fileSize: media.size || 0,
        ...media
      })) : [];
      
      setMediaFiles(transformedMedia);
    } catch (error) {
      console.error('Failed to fetch media files:', error);
      message.error('Failed to fetch media files');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (media) => {
    setSelectedMedia(media);
    setDetailModalVisible(true);
  };

  const handleEditMedia = (media) => {
    setEditingMedia(media);
    form.setFieldsValue({
      ...media,
      uploadDate: media.uploadDate ? new Date(media.uploadDate) : null
    });
    setModalVisible(true);
  };

  const handleDeleteMedia = async (id) => {
    try {
      await mediaService.deleteMedia(id);
      message.success('Media file deleted successfully');
      fetchMediaFiles(); // Refresh list
    } catch (error) {
      console.error('Failed to delete media file:', error);
      message.error('Failed to delete media file');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const isActive = newStatus === 'active';
      await mediaService.updateMedia(id, { isActive });
      message.success(`Media ${newStatus} successfully`);
      fetchMediaFiles(); // Refresh list
    } catch (error) {
      console.error('Failed to update media status:', error);
      message.error('Failed to update media status');
    }
  };

  const handleDuplicateMedia = (media) => {
    const newMedia = {
      ...media,
      id: `MEDIA${Date.now()}`,
      name: `${media.name.split('.')[0]}_copy.${media.name.split('.')[1]}`,
      title: `${media.title} (Copy)`,
      uploadDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      views: 0,
      downloads: 0,
      likes: 0,
      featured: false
    };
    setMediaFiles([newMedia, ...mediaFiles]);
    message.success('Media file duplicated successfully');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const uploadFile = values.uploadFile || form.getFieldValue('uploadFile');
      
      // If new file is uploaded, use Cloudinary upload
      if (uploadFile && !editingMedia) {
        try {
          // Upload file to Cloudinary
          const uploadResponse = await mediaService.uploadFile(uploadFile, {
            title: values.title,
            category: values.category,
            alt: values.alt,
            description: values.description,
            tags: Array.isArray(values.tags) ? values.tags.join(',') : values.tags
          });
          
          message.success('Media file uploaded successfully');
          setModalVisible(false);
          setEditingMedia(null);
          form.resetFields();
          fetchMediaFiles();
          return;
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          message.error(uploadError.message || 'Failed to upload file');
          return;
        }
      }
      
      // For editing or if no new file, use existing URL
      const mediaData = {
        ...values,
        uploadDate: values.uploadDate ? values.uploadDate.toISOString() : new Date().toISOString(),
        tags: values.tags || []
      };
      
      // Remove uploadFile from data
      delete mediaData.uploadFile;
      
      if (editingMedia) {
        // Update existing media
        await mediaService.updateMedia(editingMedia.id, mediaData);
        message.success('Media file updated successfully');
      } else {
        // Create new media (with URL or base64 fallback)
        await mediaService.createMedia(mediaData);
        message.success('Media file created successfully');
      }
      
      setModalVisible(false);
      setEditingMedia(null);
      form.resetFields();
      fetchMediaFiles(); // Refresh list
    } catch (error) {
      console.error('Failed to save media:', error);
      message.error(error.message || 'Failed to save media file');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setDetailModalVisible(false);
    setUploadModalVisible(false);
    form.resetFields();
    setUploadFileList([]);
  };

  // Handle file upload using Cloudinary
  const handleFileUpload = async () => {
    if (uploadFileList.length === 0) {
      message.warning('Please select files to upload');
      return;
    }

    setUploading(true);
    try {
      // Prepare files for upload
      const files = uploadFileList.map(file => file.originFileObj || file);
      
      // Upload multiple files to Cloudinary
      const response = await mediaService.uploadMultipleFiles(files);
      
      message.success(`${response.media?.length || uploadFileList.length} file(s) uploaded successfully!`);
      setUploadModalVisible(false);
      setUploadFileList([]);
      fetchMediaFiles();
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error.message || 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  // Handle file change
  const handleFileChange = ({ fileList }) => {
    setUploadFileList(fileList);
  };

  // Handle export
  const handleExport = () => {
    try {
      const csvData = [
        ['Media Export', `Generated: ${new Date().toLocaleString()}`],
        [],
        ['Name', 'Title', 'Type', 'Category', 'Size', 'Format', 'Views', 'Downloads', 'Likes', 'Status']
      ];

      mediaFiles.forEach(media => {
        csvData.push([
          media.name,
          media.title,
          media.type,
          media.category,
          media.size,
          media.format,
          media.views,
          media.downloads,
          media.likes,
          media.status
        ]);
      });

      const csv = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `media-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success('Media exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export media');
    }
  };

  // Handle import (CSV)
  const handleImport = () => {
    message.info('Import functionality coming soon!');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'image': return 'blue';
      case 'video': return 'purple';
      case 'audio': return 'green';
      case 'document': return 'orange';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image': return <FileImageOutlined />;
      case 'video': return <VideoCameraOutlined />;
      case 'audio': return <AudioOutlined />;
      case 'document': return <FileOutlined />;
      default: return <FileOutlined />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'archived': return 'red';
      case 'processing': return 'orange';
      default: return 'default';
    }
  };

  // Filter media files based on search and filters
  const filteredMediaFiles = mediaFiles.filter(media => {
    const matchesSearch = media.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         media.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         media.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    const matchesType = filterType === 'all' || media.type === filterType;
    const matchesCategory = filterCategory === 'all' || media.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Calculate statistics
  const totalMedia = mediaFiles.length;
  const imageCount = mediaFiles.filter(m => m.type === 'image').length;
  const videoCount = mediaFiles.filter(m => m.type === 'video').length;
  const totalSize = mediaFiles.reduce((sum, m) => sum + m.fileSize, 0);

  // Grid View Component
  const GridView = () => (
    <Row gutter={[16, 16]}>
      {filteredMediaFiles.map(media => (
        <Col xs={12} sm={8} md={6} lg={4} key={media.id}>
          <Card
            hoverable
            cover={
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <Image
                  src={media.thumbnail}
                  alt={media.alt}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
                />
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {media.format}
                </div>
                {media.featured && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: '#ff6b35',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    ⭐ Featured
                  </div>
                )}
              </div>
            }
            actions={[
              <Tooltip title="View Details">
                <Button
                  type="text"
                  icon={<ViewIcon />}
                  onClick={() => handleViewDetails(media)}
                  style={{ color: '#1890ff' }}
                />
              </Tooltip>,
              <Tooltip title="Edit">
                <Button
                  type="text"
                  icon={<EditIcon />}
                  onClick={() => handleEditMedia(media)}
                  style={{ color: '#ff6b35' }}
                />
              </Tooltip>,
              <Tooltip title="Download">
                <Button
                  type="text"
                  icon={<DownloadIcon />}
                  style={{ color: '#52c41a' }}
                />
              </Tooltip>,
              <Tooltip title="Delete">
                <Popconfirm
                  title="Are you sure you want to delete this media?"
                  onConfirm={() => handleDeleteMedia(media.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="text"
                    icon={<DeleteIcon />}
                    danger
                  />
                </Popconfirm>
              </Tooltip>
            ]}
          >
            <Meta
              title={
                <div>
                  <Text strong style={{ fontSize: '12px' }}>
                    {media.title}
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <Tag color={getTypeColor(media.type)} icon={getTypeIcon(media.type)} size="small">
                      {media.type.toUpperCase()}
                    </Tag>
                  </div>
                </div>
              }
              description={
                <div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    {media.size} • {media.views} views
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    {media.tags.slice(0, 2).map((tag, index) => (
                      <Tag key={index} size="small" style={{ fontSize: '8px', margin: '1px' }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );

  // List View Component
  const ListView = () => {
    const columns = [
      {
        title: 'Media',
        key: 'media',
        width: 300,
        render: (_, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image
              width={60}
              height={60}
              src={record.thumbnail}
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
                  {record.type.toUpperCase()}
                </Tag>
                <Tag color="blue" style={{ fontSize: '10px' }}>
                  {record.category}
                </Tag>
              </div>
              <div style={{ marginTop: '4px' }}>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {record.size} • {record.format}
                </Text>
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
              <DownloadIcon style={{ color: '#52c41a', fontSize: '12px' }} />
              <Text style={{ fontSize: '12px' }}>{record.downloads} downloads</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <HeartIcon style={{ color: '#ff6b35', fontSize: '12px' }} />
              <Text style={{ fontSize: '12px' }}>{record.likes} likes</Text>
            </div>
          </div>
        ),
      },
      {
        title: 'Upload Info',
        key: 'upload',
        width: 150,
        render: (_, record) => (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UserOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
              <Text style={{ fontSize: '12px' }}>{record.uploadedBy}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <CalendarOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
              <Text style={{ fontSize: '12px' }}>{record.uploadDate}</Text>
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
            <Tooltip title="View Details">
              <Button
                type="text"
                icon={<ViewIcon />}
                onClick={() => handleViewDetails(record)}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
            <Tooltip title="Edit Media">
              <Button
                type="text"
                icon={<EditIcon />}
                onClick={() => handleEditMedia(record)}
                style={{ color: '#ff6b35' }}
              />
            </Tooltip>
            <Tooltip title="Download">
              <Button
                type="text"
                icon={<DownloadIcon />}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
            <Tooltip title="Duplicate">
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={() => handleDuplicateMedia(record)}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
            <Tooltip title="Delete Media">
              <Popconfirm
                title="Are you sure you want to delete this media?"
                onConfirm={() => handleDeleteMedia(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  icon={<DeleteIcon />}
                  danger
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={filteredMediaFiles}
        rowKey="id"
        loading={loading}
        pagination={{
          total: filteredMediaFiles.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} media files`,
        }}
        scroll={{ x: 1000 }}
      />
    );
  };

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
            📸 Media Gallery
          </Title>
          <Text style={{ fontSize: '14px', color: '#6c757d', fontFamily: "'Poppins', sans-serif" }}>
            Manage images, videos, documents, and other media files
          </Text>
        </div>
        
        <Space>
          <Button
            icon={<CloudUploadOutlined />}
            onClick={() => setUploadModalVisible(true)}
            style={{
              borderRadius: '12px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600'
            }}
          >
            Upload
          </Button>
          <Button
            icon={<ImportOutlined />}
            onClick={handleImport}
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
            onClick={handleExport}
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
            Add Media
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Media"
              value={totalMedia}
              prefix={<FolderOutlined style={{ color: '#ff6b35' }} />}
              valueStyle={{ color: '#ff6b35', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Images"
              value={imageCount}
              prefix={<FileImageOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Videos"
              value={videoCount}
              prefix={<VideoCameraOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic
              title="Total Size"
              value={formatFileSize(totalSize)}
              prefix={<CloudUploadOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontFamily: "'Poppins', sans-serif" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and View Toggle */}
      <Card style={{ marginBottom: '24px', borderRadius: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Search media..."
              prefix={<SearchOutlined style={{ color: '#ff6b35' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              placeholder="Type"
              value={filterType}
              onChange={setFilterType}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Types</Option>
              <Option value="image">Images</Option>
              <Option value="video">Videos</Option>
              <Option value="audio">Audio</Option>
              <Option value="document">Documents</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              placeholder="Category"
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: '100%', borderRadius: '8px' }}
            >
              <Option value="all">All Categories</Option>
              <Option value="Destinations">Destinations</Option>
              <Option value="Tours">Tours</Option>
              <Option value="Activities">Activities</Option>
              <Option value="Guides">Guides</Option>
              <Option value="Marketing">Marketing</Option>
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
              <Button.Group>
                <Button
                  icon={<PictureOutlined />}
                  type={viewMode === 'grid' ? 'primary' : 'default'}
                  onClick={() => setViewMode('grid')}
                  style={{ borderRadius: '8px' }}
                />
                <Button
                  icon={<FileTextOutlined />}
                  type={viewMode === 'list' ? 'primary' : 'default'}
                  onClick={() => setViewMode('list')}
                  style={{ borderRadius: '8px' }}
                />
              </Button.Group>
              <Text type="secondary" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Showing {filteredMediaFiles.length} of {mediaFiles.length} media files
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Media Display */}
      <Card style={{ borderRadius: '16px' }}>
        {viewMode === 'grid' ? <GridView /> : <ListView />}
      </Card>

      {/* Media Details Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            📸 Media Details - {selectedMedia?.title}
          </div>
        }
        open={detailModalVisible}
        onCancel={handleModalCancel}
        width={900}
        footer={[
          <Button key="download" icon={<DownloadIcon />} style={{ borderRadius: '8px' }}>
            Download
          </Button>,
          <Button key="share" icon={<ShareAltOutlined />} style={{ borderRadius: '8px' }}>
            Share
          </Button>,
          <Button key="close" onClick={handleModalCancel} style={{ borderRadius: '8px' }}>
            Close
          </Button>
        ]}
      >
        {selectedMedia && (
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
                          <Card title="Media Information" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Title">{selectedMedia.title}</Descriptions.Item>
                              <Descriptions.Item label="Type">
                                <Tag color={getTypeColor(selectedMedia.type)} icon={getTypeIcon(selectedMedia.type)}>
                                  {selectedMedia.type.toUpperCase()}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Category">{selectedMedia.category}</Descriptions.Item>
                              <Descriptions.Item label="Format">{selectedMedia.format}</Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="File Details" size="small">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Size">{selectedMedia.size}</Descriptions.Item>
                              <Descriptions.Item label="Dimensions">{selectedMedia.dimensions || 'N/A'}</Descriptions.Item>
                              <Descriptions.Item label="Uploaded By">{selectedMedia.uploadedBy}</Descriptions.Item>
                              <Descriptions.Item label="Upload Date">{selectedMedia.uploadDate}</Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                      </Row>
                      
                      <Divider />
                      
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card title="Performance" size="small">
                            <Text strong>Views:</Text> {selectedMedia.views}
                            <br />
                            <Text strong>Downloads:</Text> {selectedMedia.downloads}
                            <br />
                            <Text strong>Likes:</Text> {selectedMedia.likes}
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Description" size="small">
                            <Text>{selectedMedia.description}</Text>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  )
                },
                {
                  key: 'preview',
                  label: 'Preview',
                  children: (
                    <div>
                      {selectedMedia.type === 'image' && (
                        <Image
                          src={selectedMedia.url}
                          alt={selectedMedia.alt}
                          style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                        />
                      )}
                      {selectedMedia.type === 'video' && (
                        <video
                          controls
                          style={{ width: '100%', maxHeight: '400px' }}
                        >
                          <source src={selectedMedia.url} type={selectedMedia.mimeType} />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {selectedMedia.type === 'audio' && (
                        <audio
                          controls
                          style={{ width: '100%' }}
                        >
                          <source src={selectedMedia.url} type={selectedMedia.mimeType} />
                          Your browser does not support the audio tag.
                        </audio>
                      )}
                      {selectedMedia.type === 'document' && (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                          <FileOutlined style={{ fontSize: '64px', color: '#ff6b35' }} />
                          <br />
                          <Text strong>{selectedMedia.title}</Text>
                          <br />
                          <Text type="secondary">{selectedMedia.format} • {selectedMedia.size}</Text>
                        </div>
                      )}
                    </div>
                  )
                }
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Add/Edit Media Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            {editingMedia ? 'Edit Media' : 'Add New Media'}
          </div>
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText="Save Media"
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
            label="Media Title"
            rules={[{ required: true, message: 'Please enter media title' }]}
          >
            <Input placeholder="Enter media title" style={{ borderRadius: '8px' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Media Type"
                rules={[{ required: true, message: 'Please select media type' }]}
              >
                <Select placeholder="Select type" style={{ borderRadius: '8px' }}>
                  <Option value="image">Image</Option>
                  <Option value="video">Video</Option>
                  <Option value="audio">Audio</Option>
                  <Option value="document">Document</Option>
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
            name="description"
            label="Description"
          >
            <TextArea
              rows={3}
              placeholder="Enter media description"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

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

          <Form.Item
            name="alt"
            label="Alt Text"
          >
            <Input placeholder="Enter alt text for accessibility" style={{ borderRadius: '8px' }} />
          </Form.Item>

          <Form.Item
            name="url"
            label="Media File"
            rules={editingMedia ? [] : [{ required: !editingMedia, message: 'Please upload a media file' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={(file) => {
                // Check file size (max 10MB)
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isLt10M) {
                  message.error('File must be smaller than 10MB!');
                  return false;
                }
                return false; // Prevent auto upload
              }}
              onChange={(info) => {
                const { fileList } = info;
                // Store file in form
                form.setFieldValue('uploadFile', fileList[0]?.originFileObj);
                // Preview image
                if (fileList[0]?.originFileObj) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    form.setFieldValue('url', reader.result);
                    if (form.getFieldValue('type') === 'image') {
                      form.setFieldValue('thumbnail', reader.result);
                    }
                  };
                  reader.readAsDataURL(fileList[0].originFileObj);
                }
              }}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            >
              {form.getFieldValue('url') ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            {form.getFieldValue('url') && (
              <div style={{ marginTop: '8px' }}>
                {form.getFieldValue('type') === 'image' ? (
                  <Image
                    src={form.getFieldValue('url')}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                  />
                ) : (
                  <Text type="secondary">File selected: {form.getFieldValue('uploadFile')?.name || 'File'}</Text>
                )}
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>

      {/* Upload Multiple Files Modal */}
      <Modal
        title={
          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
            📤 Upload Media Files
          </div>
        }
        open={uploadModalVisible}
        onOk={handleFileUpload}
        onCancel={handleModalCancel}
        width={600}
        okText="Upload Files"
        cancelText="Cancel"
        confirmLoading={uploading}
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
        <div style={{ fontFamily: "'Poppins', sans-serif" }}>
          <Upload
            multiple
            fileList={uploadFileList}
            onChange={handleFileChange}
            beforeUpload={() => false} // Prevent auto upload
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            listType="picture-card"
          >
            {uploadFileList.length >= 10 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <Text type="secondary" style={{ display: 'block', marginTop: '16px' }}>
            You can upload up to 10 files at once. Supported formats: Images, Videos, Audio, Documents (PDF, DOC, DOCX)
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default MediaGallery;
