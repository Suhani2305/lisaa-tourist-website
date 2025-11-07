import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Spin, 
  Button, 
  Tag, 
  Typography, 
  Divider, 
  Avatar,
  Space,
  Card,
  Row,
  Col,
  message
} from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { articleService } from '../../services';
import Header from '../landingpage/components/Header';
import Footer from '../landingpage/components/Footer';

const { Title, Paragraph, Text: TypographyText } = Typography;

const ArticleDetail = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [likedArticles, setLikedArticles] = useState(new Set());

  // Load liked articles from localStorage on component mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedArticles');
    if (savedLikes) {
      try {
        setLikedArticles(new Set(JSON.parse(savedLikes)));
      } catch (error) {
        console.error('Error loading liked articles:', error);
      }
    }
  }, []);

  // Scroll to top IMMEDIATELY when component mounts (before rendering)
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  useEffect(() => {
    fetchArticleDetail();
    fetchRelatedArticles();
  }, [articleId]);

  const fetchArticleDetail = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching article:', articleId);
      const data = await articleService.getArticleById(articleId);
      console.log('✅ Article loaded:', data);
      
      // Check if article is liked
      const savedLikes = localStorage.getItem('likedArticles');
      const likedSet = savedLikes ? new Set(JSON.parse(savedLikes)) : new Set();
      data.isLiked = likedSet.has(articleId);
      
      setArticle(data);
    } catch (error) {
      console.error('❌ Failed to fetch article:', error);
      message.error('Failed to load article');
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const data = await articleService.getAllArticles({ 
        status: 'published', 
        limit: 3 
      });
      setRelatedArticles(data.filter(a => a._id !== articleId).slice(0, 3));
    } catch (error) {
      console.error('❌ Failed to fetch related articles:', error);
    }
  };

  const handleLike = async () => {
    try {
      const isCurrentlyLiked = likedArticles.has(articleId);
      
      if (isCurrentlyLiked) {
        // Unlike
        const newLikedSet = new Set(likedArticles);
        newLikedSet.delete(articleId);
        setLikedArticles(newLikedSet);
        localStorage.setItem('likedArticles', JSON.stringify([...newLikedSet]));
        
        // Update local state
        setArticle({ 
          ...article, 
          isLiked: false,
          likes: Math.max(0, (article.likes || 0) - 1)
        });
        
        message.success('Removed like');
      } else {
        // Like
        const newLikedSet = new Set(likedArticles);
        newLikedSet.add(articleId);
        setLikedArticles(newLikedSet);
        localStorage.setItem('likedArticles', JSON.stringify([...newLikedSet]));
        
        // Update local state
        setArticle({ 
          ...article, 
          isLiked: true,
          likes: (article.likes || 0) + 1
        });
        
        // Call API to increment likes
    try {
      await articleService.likeArticle(articleId);
        } catch (error) {
          console.error('Like API error:', error);
        }
        
        message.success('Liked! ❤️');
      }
    } catch (error) {
      console.error('❌ Like error:', error);
      message.error('Failed to like/unlike');
    }
  };

  const isLiked = (articleId) => {
    return likedArticles.has(articleId);
  };

  const handleShare = async () => {
    try {
      await articleService.shareArticle(articleId);
      setArticle({ ...article, shares: (article.shares || 0) + 1 });
      
      // Copy URL to clipboard
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      message.success('Link copied to clipboard! 🔗');
    } catch (error) {
      console.error('❌ Share error:', error);
      message.success('Link copied to clipboard! 🔗');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ 
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#6c757d' }}>Loading article...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Header />
        <div style={{ 
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div>
            <Title level={3}>Article not found</Title>
            <Button type="primary" onClick={() => navigate('/')}>
              Go to Homepage
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Article Content */}
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          padding: '0 20px 60px 20px'
        }}>
          {/* Breadcrumb Navigation */}
          <div style={{ 
            fontSize: window.innerWidth <= 768 ? '11px' : '14px', 
            color: '#6c757d',
            marginBottom: '20px',
            fontFamily: 'Poppins, sans-serif'
          }}>
            <span 
              onClick={() => {
                sessionStorage.setItem('scrollToArticles', 'true');
                navigate('/');
              }}
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
            <span 
              onClick={() => navigate('/articles')}
              style={{ 
                cursor: 'pointer',
                color: '#6c757d',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
            >
              Travel Articles
            </span>
            {article && (
              <>
                <span style={{ margin: '0 8px', color: '#6c757d' }}> &gt; </span>
                <span style={{ color: '#212529' }}>{article.title}</span>
              </>
            )}
          </div>

          {/* Hero Image */}
          {article.featuredImage && (
            <div style={{
              width: '100%',
              height: '500px',
              overflow: 'hidden',
              marginBottom: '40px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <img
                src={article.featuredImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90'}
                alt={article.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  imageRendering: 'high-quality',
                  WebkitImageRendering: 'high-quality'
                }}
              />
            </div>
          )}
          {/* Category & Type Tags */}
          <Space style={{ marginBottom: '20px' }}>
            <Tag color="orange" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {article.category}
            </Tag>
            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {article.type?.replace('_', ' ').toUpperCase()}
            </Tag>
          </Space>

          {/* Title */}
          <Title level={1} style={{ 
            fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
            fontWeight: '700',
            color: '#212529',
            marginBottom: '24px',
            lineHeight: '1.3',
            fontFamily: 'Poppins, sans-serif'
          }}>
            {article.title}
          </Title>

          {/* Meta Info */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '30px',
            paddingBottom: '30px'
          }}>
            <Space>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#FF6B35' }} />
              <TypographyText strong>{article.author}</TypographyText>
            </Space>
            <Space>
              <CalendarOutlined style={{ color: '#6c757d' }} />
              <TypographyText type="secondary">
                {new Date(article.publishDate || article.createdAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </TypographyText>
            </Space>
            <Space>
              <ClockCircleOutlined style={{ color: '#6c757d' }} />
              <TypographyText type="secondary">{article.readingTime || '5 min read'}</TypographyText>
            </Space>
          </div>

          {/* Article Stats & Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <Space size="large">
              <Space>
                <EyeOutlined style={{ fontSize: '18px', color: '#6c757d' }} />
                <TypographyText>{article.views || 0} views</TypographyText>
              </Space>
              <Space>
                <HeartOutlined style={{ fontSize: '18px', color: '#FF6B35' }} />
                <TypographyText>{article.likes || 0} likes</TypographyText>
              </Space>
              <Space>
                <ShareAltOutlined style={{ fontSize: '18px', color: '#6c757d' }} />
                <TypographyText>{article.shares || 0} shares</TypographyText>
              </Space>
            </Space>
            <Space>
              <Button 
                icon={article.isLiked ? <HeartFilled /> : <HeartOutlined />}
                onClick={handleLike}
                style={{
                  borderColor: '#ff6b35',
                  color: article.isLiked ? '#ffffff' : '#ff6b35',
                  backgroundColor: article.isLiked ? '#ff6b35' : 'transparent'
                }}
              >
                {article.isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button 
                type="primary"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
                style={{
                  backgroundColor: '#FF6B35',
                  borderColor: '#FF6B35'
                }}
              >
                Share
              </Button>
            </Space>
          </div>

          {/* Article Content */}
          <Card style={{ 
            marginBottom: '40px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#343a40',
              whiteSpace: 'pre-wrap'
            }}>
              {article.content}
            </div>
          </Card>

          {/* Customer Rating (if customer_experience) */}
          {article.type === 'customer_experience' && article.customerRating && (
            <Card style={{ 
              marginBottom: '40px',
              borderRadius: '12px',
              backgroundColor: '#fff9f5',
              border: '2px solid #FF6B35'
            }}>
              <Title level={4} style={{ color: '#FF6B35', marginBottom: '16px' }}>
                ⭐ Customer Rating
              </Title>
              <div style={{ fontSize: '32px', color: '#FF6B35' }}>
                {'⭐'.repeat(article.customerRating || 5)}
              </div>
              <TypographyText type="secondary" style={{ fontSize: '16px', marginTop: '8px', display: 'block' }}>
                {article.customerRating || 5} out of 5 stars
              </TypographyText>
            </Card>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <Title level={5}>Tags:</Title>
              <Space wrap>
                {article.tags.map(tag => (
                  <Tag key={tag} style={{ fontSize: '14px', padding: '4px 12px' }}>
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <>
              <Divider />
              <Title level={3} style={{ marginBottom: '30px' }}>
                Related Articles
              </Title>
              <Row gutter={[20, 20]}>
                {relatedArticles.map(related => (
                  <Col xs={24} sm={12} md={8} key={related._id}>
                    <Card
                      hoverable
                      cover={
                        <img
                          src={related.featuredImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90'}
                          alt={related.title}
                          style={{ 
                            height: '200px', 
                            objectFit: 'cover',
                            imageRendering: 'high-quality'
                          }}
                        />
                      }
                      onClick={() => navigate(`/article/${related._id}`)}
                      style={{ borderRadius: '12px', overflow: 'hidden' }}
                    >
                      <Card.Meta
                        title={related.title}
                        description={
                          <Space direction="vertical" size="small">
                            <TypographyText type="secondary">
                              By {related.author}
                            </TypographyText>
                            <TypographyText type="secondary" style={{ fontSize: '12px' }}>
                              {new Date(related.publishDate || related.createdAt).toLocaleDateString()}
                            </TypographyText>
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ArticleDetail;

