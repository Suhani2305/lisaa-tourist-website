import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../../services';
import { Spin, message, Pagination } from 'antd';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import Header from '../landingpage/components/Header';
import Footer from '../landingpage/components/Footer';

const AllArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    fetchAllArticles();
  }, [currentPage, pageSize]);

  const fetchAllArticles = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching all published articles...');
      
      // Get published articles with pagination
      const data = await articleService.getAllArticles({ 
        status: 'published',
        page: currentPage,
        limit: pageSize
      });
      
      console.log('✅ Articles loaded:', data);
      
      // Handle paginated response
      const articlesArray = data?.articles || (Array.isArray(data) ? data : []);
      const total = data?.total || articlesArray.length;
      setTotalArticles(total);
      
      // Transform backend data to component format
      const formattedArticles = articlesArray.map(article => ({
        id: article._id,
        image: article.featuredImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90',
        date: new Date(article.publishDate || article.createdAt).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        author: article.author,
        title: article.title,
        type: article.type,
        category: article.category,
        description: article.content?.substring(0, 150) + '...' || '',
        readingTime: article.readingTime || '5 min read'
      }));
      
      setArticles(formattedArticles);
      
      // Update pagination info if available
      if (data?.totalPages) {
        // Backend pagination info available
      }
    } catch (error) {
      console.error('❌ Failed to fetch articles:', error);
      message.error('Failed to load articles');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper component for the article type tag
  const ArticleTag = ({ type }) => (
    <div style={{
      position: 'absolute',
      top: '15px',
      left: '15px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: '#343a40',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.5px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textTransform: 'capitalize'
    }}>
      {type?.replace('_', ' ') || 'Article'}
    </div>
  );

  // Get unique types
  const types = ['all', ...new Set(articles.map(a => a.type).filter(Boolean))];

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || article.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const isMobile = window.innerWidth <= 768;
  const isSmall = window.innerWidth <= 480;

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
            <div style={{ marginTop: '16px', color: '#6c757d' }}>Loading articles...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        minHeight: '100vh',
        paddingBottom: '60px'
      }}>
        {/* Container */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          padding: window.innerWidth <= 768 ? '20px 20px' : '40px 20px'
        }}>
          {/* Breadcrumb & Title */}
          <div style={{ 
            fontSize: window.innerWidth <= 768 ? '11px' : '14px', 
            color: '#6c757d',
            marginBottom: '12px',
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
            <span style={{ color: '#212529' }}>Travel Articles</span>
          </div>
          <h1 style={{ 
            fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
            fontWeight: '700',
            color: '#212529',
            margin: '0 0 12px 0',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Travel Articles
          </h1>
          <p style={{
            fontSize: window.innerWidth <= 768 ? '14px' : '16px',
            color: '#6c757d',
            margin: '0 0 24px 0',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Explore our collection of travel guides, stories, and experiences
          </p>

          {/* Filters Section */}
          <div style={{
            backgroundColor: 'white',
            padding: isSmall ? '16px' : isMobile ? '20px' : '24px',
            borderRadius: '12px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            {/* Search Bar */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ position: 'relative' }}>
                <SearchOutlined style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c757d',
                  fontSize: '16px'
                }} />
                <input
                  type="text"
                  placeholder="Search articles by title, author, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: isSmall ? '10px 14px 10px 40px' : '12px 16px 12px 44px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: isSmall ? '13px' : '14px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    fontFamily: 'Poppins, sans-serif',
                    backgroundColor: '#f8f9fa',
                    color: '#212529'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FF6B35';
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.color = '#212529';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.color = '#212529';
                  }}
                />
              </div>
            </div>

            {/* Type Filters */}
            {types.length > 1 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: isSmall ? '12px' : '13px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '12px',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Filter by Type:
                </div>
                <div style={{
                  display: 'flex',
                  gap: isSmall ? '6px' : '8px',
                  flexWrap: 'wrap'
                }}>
                  {types.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      style={{
                        padding: isSmall ? '6px 12px' : '8px 16px',
                        backgroundColor: selectedType === type ? '#FF6B35' : '#f8f9fa',
                        color: selectedType === type ? 'white' : '#495057',
                        border: selectedType === type ? 'none' : '1px solid #dee2e6',
                        borderRadius: '20px',
                        fontSize: isSmall ? '11px' : '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        fontFamily: 'Poppins, sans-serif',
                        textTransform: 'capitalize'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedType !== type) {
                          e.target.style.backgroundColor = '#e9ecef';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedType !== type) {
                          e.target.style.backgroundColor = '#f8f9fa';
                        }
                      }}
                    >
                      {type === 'all' ? 'All Types' : type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Count */}
            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #e9ecef',
              fontSize: isSmall ? '12px' : '13px',
              color: '#6c757d',
              textAlign: 'center',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Showing <strong style={{ color: '#FF6B35' }}>{filteredArticles.length}</strong> {filteredArticles.length === 1 ? 'article' : 'articles'}
              {totalArticles > 0 && ` (${totalArticles} total)`}
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              color: '#6c757d',
              fontFamily: 'Poppins, sans-serif'
            }}>
              <p style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '600', color: '#212529' }}>No articles found</p>
              <p style={{ fontSize: '14px' }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 768 
                ? 'repeat(1, 1fr)' 
                : window.innerWidth <= 1024 
                  ? 'repeat(2, 1fr)' 
                  : 'repeat(3, 1fr)',
              gap: '25px',
              marginBottom: '40px'
            }}>
              {filteredArticles.map(article => (
                <div 
                  key={article.id} 
                  onClick={() => navigate(`/article/${article.id}`)}
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: 'inherit',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,53,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Image with Tag */}
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        imageRendering: 'high-quality',
                        WebkitImageRendering: 'high-quality'
                      }}
                    />
                    <ArticleTag type={article.type} />
                  </div>
                  
                  {/* Content Block */}
                  <div style={{ padding: '20px' }}>
                    {/* Date and Author */}
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#6c757d',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      <span style={{ fontWeight: '600' }}>{article.date}</span>
                      <span>•</span>
                      <span>By {article.author}</span>
                      <span>•</span>
                      <span>{article.readingTime}</span>
                    </div>
                    
                    {/* Title */}
                    <h3 style={{ 
                      fontSize: window.innerWidth <= 768 ? '1rem' : '1.15rem', 
                      fontWeight: '600', 
                      color: '#212529',
                      lineHeight: '1.3',
                      margin: '0 0 12px 0',
                      fontFamily: 'Poppins, sans-serif'
                    }}>
                      {article.title}
                    </h3>
                    
                    {/* Description */}
                    {article.description && (
                      <p style={{
                        fontSize: '14px',
                        color: '#6c757d',
                        lineHeight: '1.6',
                        margin: '0 0 12px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {article.description}
                      </p>
                    )}
                    
                    {/* Category Tag */}
                    {article.category && (
                      <div style={{
                        display: 'inline-block',
                        backgroundColor: '#fff5f0',
                        color: '#ff6b35',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginTop: '8px'
                      }}>
                        {article.category}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default AllArticles;

