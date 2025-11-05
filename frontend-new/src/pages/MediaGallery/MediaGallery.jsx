import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mediaService } from '../../services';
import { Spin, message, Modal, Image, Tag, Row, Col, Card, Select, Input, Button, Space, ConfigProvider } from 'antd';
import Header from '../landingpage/components/Header';
import Footer from '../landingpage/components/Footer';
import { 
  PictureOutlined, 
  VideoCameraOutlined, 
  AudioOutlined, 
  FileOutlined,
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  HeartOutlined,
  HeartFilled,
  FilterOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Meta } = Card;

const MediaGallery = () => {
  const navigate = useNavigate();
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [likedMedia, setLikedMedia] = useState(new Set());

  // Load liked media from localStorage on component mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedMedia');
    if (savedLikes) {
      try {
        setLikedMedia(new Set(JSON.parse(savedLikes)));
      } catch (error) {
        console.error('Error loading liked media:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchMediaFiles();
  }, [filterType, filterCategory, searchText]);

  const fetchMediaFiles = async () => {
    setLoading(true);
    try {
      const response = await mediaService.getAllMedia({
        type: filterType !== 'all' ? filterType : undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        search: searchText || undefined,
        isActive: true
      });
      
      const savedLikes = JSON.parse(localStorage.getItem('likedMedia') || '[]');
      const likedSet = new Set(savedLikes);
      
      const transformedMedia = Array.isArray(response) ? response.map(media => ({
        id: media._id || media.id,
        name: media.name,
        title: media.title || media.name,
        type: media.type,
        category: media.category || 'Other',
        size: media.size || 0,
        dimensions: media.dimensions || '',
        format: media.format || '',
        url: media.url,
        thumbnail: media.thumbnail || media.url,
        alt: media.alt || media.title || media.name,
        description: media.description || '',
        tags: media.tags || [],
        views: media.views || 0,
        downloads: media.downloads || 0,
        likes: media.likes || 0,
        isLiked: likedSet.has(media._id || media.id)
      })) : [];
      
      setMediaFiles(transformedMedia);
    } catch (error) {
      console.error('Failed to fetch media files:', error);
      message.error('Failed to load media gallery');
      setMediaFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image':
        return <PictureOutlined style={{ fontSize: '24px', color: '#ff6b35' }} />;
      case 'video':
        return <VideoCameraOutlined style={{ fontSize: '24px', color: '#ff6b35' }} />;
      case 'audio':
        return <AudioOutlined style={{ fontSize: '24px', color: '#ff6b35' }} />;
      default:
        return <FileOutlined style={{ fontSize: '24px', color: '#ff6b35' }} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'image':
        return '#52c41a';
      case 'video':
        return '#1890ff';
      case 'audio':
        return '#722ed1';
      default:
        return '#faad14';
    }
  };

  const handlePreview = (media) => {
    setSelectedMedia(media);
    if (media.type === 'image') {
      setPreviewImage(media.url);
    }
    setPreviewVisible(true);
  };

  const handleDownload = async (media) => {
    try {
      await mediaService.incrementDownloads(media.id);
      // Create a temporary link to download
      const link = document.createElement('a');
      link.href = media.url;
      link.download = media.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success('Download started');
      fetchMediaFiles(); // Refresh to update download count
    } catch (error) {
      console.error('Download error:', error);
      message.error('Failed to download');
    }
  };

  const handleLike = async (media, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    try {
      const isCurrentlyLiked = likedMedia.has(media.id);
      
      if (isCurrentlyLiked) {
        // Unlike - decrement likes
        const newLikedSet = new Set(likedMedia);
        newLikedSet.delete(media.id);
        setLikedMedia(newLikedSet);
        
        // Update localStorage
        localStorage.setItem('likedMedia', JSON.stringify(Array.from(newLikedSet)));
        
        // Update local state
        setMediaFiles(prevMedia => prevMedia.map(m => 
          m.id === media.id 
            ? { ...m, isLiked: false, likes: Math.max(0, (m.likes || 0) - 1) }
            : m
        ));
        
        message.success('Unliked');
      } else {
        // Like - increment likes
        const newLikedSet = new Set(likedMedia);
        newLikedSet.add(media.id);
        setLikedMedia(newLikedSet);
        
        // Update localStorage
        localStorage.setItem('likedMedia', JSON.stringify(Array.from(newLikedSet)));
        
        // Update local state
        setMediaFiles(prevMedia => prevMedia.map(m => 
          m.id === media.id 
            ? { ...m, isLiked: true, likes: (m.likes || 0) + 1 }
            : m
        ));
        
        // Call backend API to update like count
        try {
          await mediaService.incrementLikes(media.id);
        } catch (apiError) {
          console.error('Backend like update error:', apiError);
          // Don't show error to user, just log it
        }
        
        message.success('Liked! ❤️');
      }
    } catch (error) {
      console.error('Like error:', error);
      message.error('Failed to like/unlike');
    }
  };
  
  const isLiked = (mediaId) => {
    return likedMedia.has(mediaId);
  };

  const filteredMedia = mediaFiles.filter(media => {
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      return (
        media.title?.toLowerCase().includes(searchLower) ||
        media.description?.toLowerCase().includes(searchLower) ||
        media.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>Loading media...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Main Content Section */}
      <section style={{ 
        paddingTop: '0',
        paddingBottom: window.innerWidth <= 480 ? "40px" : window.innerWidth <= 768 ? "50px" : window.innerWidth <= 1024 ? "60px" : "80px",
        paddingLeft: window.innerWidth <= 480 ? "8px" : window.innerWidth <= 768 ? "12px" : window.innerWidth <= 1024 ? "32px" : window.innerWidth <= 1400 ? "120px" : "250px",
        paddingRight: window.innerWidth <= 480 ? "8px" : window.innerWidth <= 768 ? "12px" : window.innerWidth <= 1024 ? "32px" : window.innerWidth <= 1400 ? "120px" : "250px",
        backgroundColor: "#f8f9fa", 
        boxSizing: "border-box",
        marginTop: '0',
        flex: '1'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Container */}
          <div style={{
            padding: window.innerWidth <= 768 ? '20px 0' : '40px 0',
            minHeight: '400px'
          }}>
            {/* Breadcrumb & Title */}
            <div style={{ 
              fontSize: window.innerWidth <= 768 ? '11px' : '14px', 
              color: '#6c757d',
              marginBottom: '12px',
              fontFamily: "'Poppins', sans-serif"
            }}>
              <span 
                onClick={() => navigate('/')}
                style={{ 
                  cursor: 'pointer',
                  color: '#6c757d',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
              >
                Home
              </span>
              <span style={{ margin: '0 8px', color: '#6c757d' }}> &gt; </span>
              <span style={{ color: '#212529' }}>Media Gallery</span>
            </div>
            <h1 style={{
              fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
              fontWeight: '700',
              color: '#212529',
              margin: '0 0 12px 0',
              fontFamily: "'Poppins', sans-serif",
              lineHeight: '1.3'
            }}>
              Media Gallery
            </h1>
            <p style={{
              fontSize: window.innerWidth <= 768 ? '14px' : '16px',
              color: '#6c757d',
              margin: '0 0 24px 0',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Explore our collection of images, videos, and media from amazing destinations
            </p>

            {/* Filters Section */}
            <div style={{
              backgroundColor: 'white',
              padding: window.innerWidth <= 480 ? '16px' : window.innerWidth <= 768 ? '20px' : '24px',
              borderRadius: '12px',
              marginBottom: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '100%' }}>
                  <SearchOutlined style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6c757d',
                    fontSize: '16px',
                    zIndex: 1
                  }} />
                  <Input
                    placeholder="Search media..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="large"
                    style={{ 
                      borderRadius: '8px',
                      paddingLeft: '44px',
                      fontFamily: "'Poppins', sans-serif",
                      backgroundColor: '#f8f9fa',
                      border: '2px solid #e9ecef',
                      color: '#212529'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6B35';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e9ecef';
                      e.target.style.backgroundColor = '#f8f9fa';
                    }}
                  />
                </div>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#FF6B35',
                      colorPrimaryHover: '#f15a29',
                      borderRadius: 8,
                    },
                  }}
                >
                  <Select
                    placeholder="Type"
                    value={filterType}
                    onChange={setFilterType}
                    size="large"
                    style={{ 
                      width: window.innerWidth <= 768 ? '100%' : '150px',
                      borderRadius: '8px',
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    <Option value="all">All Types</Option>
                    <Option value="image">Images</Option>
                    <Option value="video">Videos</Option>
                    <Option value="audio">Audio</Option>
                    <Option value="document">Documents</Option>
                  </Select>
                  <Select
                    placeholder="Category"
                    value={filterCategory}
                    onChange={setFilterCategory}
                    size="large"
                    style={{ 
                      width: window.innerWidth <= 768 ? '100%' : '180px',
                      borderRadius: '8px',
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    <Option value="all">All Categories</Option>
                    <Option value="Destinations">Destinations</Option>
                    <Option value="Tours">Tours</Option>
                    <Option value="Events">Events</Option>
                    <Option value="Testimonials">Testimonials</Option>
                    <Option value="Marketing">Marketing</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </ConfigProvider>
              </div>
              
              {/* Results Count */}
              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid #e9ecef',
                fontSize: window.innerWidth <= 480 ? '12px' : '13px',
                color: '#6c757d',
                textAlign: 'center',
                fontFamily: "'Poppins', sans-serif"
              }}>
                Showing <strong style={{ color: '#FF6B35' }}>{filteredMedia.length}</strong> of <strong>{mediaFiles.length}</strong> {filteredMedia.length === 1 ? 'media file' : 'media files'}
              </div>
            </div>

            {/* Large Image Gallery Container */}
            <div style={{
              backgroundColor: 'transparent',
              minHeight: '300px'
            }}>
            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '80px 20px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                <Spin size="large" />
                <p style={{ 
                  marginTop: '20px', 
                  color: '#6c757d',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '16px'
                }}>
                  Loading media...
                </p>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '80px 20px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                <PictureOutlined style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }} />
                <h3 style={{ 
                  color: '#0f172a', 
                  marginBottom: '10px',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '600',
                  fontSize: window.innerWidth <= 768 ? '1rem' : '1.15rem'
                }}>
                  No media found
                </h3>
                <p style={{ 
                  color: '#6c757d',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '14px'
                }}>
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth <= 480 
                  ? '1fr' 
                  : window.innerWidth <= 768 
                    ? 'repeat(2, 1fr)' 
                    : window.innerWidth <= 1024
                      ? 'repeat(3, 1fr)'
                      : 'repeat(4, 1fr)',
                gap: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '16px' : '20px',
              }}>
                {filteredMedia.map((media) => (
                  <div
                    key={media.id}
                    onClick={() => handlePreview(media)}
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '4/3',
                      borderRadius: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '15px' : '20px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      backgroundColor: '#f8fafc',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.15)';
                      const overlay = e.currentTarget.querySelector('[data-overlay]');
                      const bottomOverlay = e.currentTarget.querySelector('[data-bottom-overlay]');
                      if (overlay) overlay.style.opacity = '1';
                      if (overlay) overlay.style.transform = 'translate(-50%, -50%) translateY(0)';
                      if (bottomOverlay) bottomOverlay.style.transform = 'translateY(0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                      const overlay = e.currentTarget.querySelector('[data-overlay]');
                      const bottomOverlay = e.currentTarget.querySelector('[data-bottom-overlay]');
                      if (overlay) overlay.style.opacity = '0';
                      if (overlay) overlay.style.transform = 'translate(-50%, -50%) translateY(20px)';
                      if (bottomOverlay) bottomOverlay.style.transform = 'translateY(100%)';
                    }}
                  >
                    {media.type === 'image' ? (
                      <img
                        src={media.thumbnail}
                        alt={media.alt}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8fafc'
                      }}>
                        {getTypeIcon(media.type)}
                        <Tag 
                          color={getTypeColor(media.type)} 
                          style={{ 
                            marginTop: '10px',
                            fontFamily: "'Poppins', sans-serif"
                          }}
                        >
                          {media.type.toUpperCase()}
                        </Tag>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 2
                    }}>
                      <Tag 
                        style={{
                          backgroundColor: '#FF6B35',
                          color: '#fff',
                          border: 'none',
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: '500',
                          borderRadius: '6px',
                          padding: '4px 12px'
                        }}
                      >
                        {media.category}
                      </Tag>
                    </div>
                    
                    {/* Overlay on Hover - Bottom */}
                    <div 
                      data-bottom-overlay
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                        padding: '20px 15px 15px',
                        transform: 'translateY(100%)',
                        transition: 'transform 0.3s ease',
                        zIndex: 1
                      }}
                    >
                      <div style={{
                        color: '#fff',
                        fontFamily: "'Poppins', sans-serif"
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {media.title}
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          opacity: 0.9
                        }}>
                          <span>👁️ {media.views || 0}</span>
                          <span>💾 {media.downloads || 0}</span>
                          <span>❤️ {media.likes || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons Overlay */}
                    <div 
                      data-overlay
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) translateY(20px)',
                        opacity: 0,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        gap: '10px',
                        zIndex: 2
                      }}
                    >
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(media);
                        }}
                        style={{
                          backgroundColor: '#FF6B35',
                          borderColor: '#FF6B35',
                          fontFamily: "'Poppins', sans-serif"
                        }}
                      />
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(media);
                        }}
                        style={{
                          backgroundColor: '#52c41a',
                          borderColor: '#52c41a',
                          fontFamily: "'Poppins', sans-serif"
                        }}
                      />
                      <Button
                        type="primary"
                        icon={media.isLiked ? <HeartFilled /> : <HeartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(media, e);
                        }}
                        style={{
                          backgroundColor: media.isLiked ? '#ff4d4f' : '#ff9999',
                          borderColor: media.isLiked ? '#ff4d4f' : '#ff9999',
                          fontFamily: "'Poppins', sans-serif"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => {
          setPreviewVisible(false);
          setPreviewImage('');
          setSelectedMedia(null);
        }}
        width={window.innerWidth <= 768 ? '95%' : '80%'}
        style={{ top: 20 }}
        styles={{
          body: {
            padding: '20px',
            fontFamily: "'Poppins', sans-serif"
          }
        }}
      >
        {selectedMedia && selectedMedia.type === 'image' && previewImage ? (
          <div style={{ textAlign: 'center' }}>
            <img
              src={previewImage}
              alt={selectedMedia.alt}
              style={{
                width: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
              }}
            />
          </div>
        ) : selectedMedia && selectedMedia.type === 'video' ? (
          <video
            controls
            src={selectedMedia.url}
            style={{ width: '100%', maxHeight: '70vh' }}
          />
        ) : selectedMedia && selectedMedia.type === 'audio' ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            <AudioOutlined style={{ fontSize: '64px', color: '#ff6b35', marginBottom: '20px' }} />
            <audio 
              controls 
              src={selectedMedia.url} 
              style={{ width: '100%', marginBottom: '20px' }} 
            />
            <h3 style={{ 
              marginTop: '20px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              color: '#1a1a1a',
              fontSize: window.innerWidth <= 768 ? '1rem' : '1.15rem'
            }}>
              {selectedMedia.title}
            </h3>
          </div>
        ) : selectedMedia ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            <FileOutlined style={{ fontSize: '64px', color: '#ff6b35', marginBottom: '20px' }} />
            <h3 style={{ 
              marginBottom: '20px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              color: '#1a1a1a',
              fontSize: window.innerWidth <= 768 ? '1rem' : '1.15rem'
            }}>
              {selectedMedia.title}
            </h3>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              onClick={() => handleDownload(selectedMedia)}
              style={{
                backgroundColor: '#ff6b35',
                borderColor: '#ff6b35',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '600',
                borderRadius: '8px',
                height: '45px',
                padding: '0 30px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e55a29';
                e.target.style.borderColor = '#e55a29';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ff6b35';
                e.target.style.borderColor = '#ff6b35';
              }}
            >
              Download {selectedMedia.format || 'File'}
            </Button>
          </div>
        ) : null}
        
        {selectedMedia && (
          <div style={{ 
            marginTop: '30px', 
            padding: '30px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '12px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            <h4 style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              fontSize: '20px',
              color: '#1a1a1a',
              marginBottom: '15px'
            }}>
              {selectedMedia.title}
            </h4>
            <p style={{ 
              color: '#666', 
              marginBottom: '15px',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              {selectedMedia.description || 'No description available'}
            </p>
            {selectedMedia.tags && selectedMedia.tags.length > 0 && (
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                flexWrap: 'wrap',
                marginBottom: '20px'
              }}>
                {selectedMedia.tags.map((tag, idx) => (
                  <Tag 
                    key={idx}
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      borderRadius: '6px',
                      padding: '4px 12px'
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
            <div style={{ 
              marginTop: '20px', 
              display: 'flex', 
              gap: '30px', 
              fontSize: '14px', 
              color: '#666',
              paddingTop: '20px',
              borderTop: '1px solid #e0e0e0'
            }}>
              <span style={{ fontFamily: "'Poppins', sans-serif" }}>
                👁️ {selectedMedia.views || 0} views
              </span>
              <span style={{ fontFamily: "'Poppins', sans-serif" }}>
                💾 {selectedMedia.downloads || 0} downloads
              </span>
              <span style={{ fontFamily: "'Poppins', sans-serif" }}>
                ❤️ {selectedMedia.likes || 0} likes
              </span>
            </div>
          </div>
        )}
      </Modal>
      </div>
      <Footer />
    </>
  );
};

export default MediaGallery;

