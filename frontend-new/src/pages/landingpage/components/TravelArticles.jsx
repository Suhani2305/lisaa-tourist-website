import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../../../services';
import { Spin, message } from 'antd';

const TravelArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching published articles for landing page...');
      // Get published articles only, limit to 4 for landing page
      const data = await articleService.getAllArticles({ 
        status: 'published', 
        limit: 4 
      });
      console.log('✅ Articles loaded:', data);
      
      // Transform backend data to component format
      const formattedArticles = data.map(article => ({
        id: article._id,
        image: article.featuredImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90',
        date: new Date(article.publishDate || article.createdAt).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        author: `By ${article.author}`,
        title: article.title,
        type: article.type,
        category: article.category
      }));
      
      setArticles(formattedArticles);
    } catch (error) {
      console.error('❌ Failed to fetch articles:', error);
      // Don't show error to user, just log it
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        padding: window.innerWidth <= 768 ? '40px 0' : '100px 0', 
        backgroundColor: '#ffffff',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: '#6c757d' }}>Loading articles...</div>
        </div>
      </div>
    );
  }

  // Don't show section if no articles
  if (articles.length === 0) {
    return null;
  }

  // Helper component for the "Trips" tag
  const TripTag = ({ type }) => (
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
      {type?.replace('_', ' ') || 'Trips'}
    </div>
  );

  return (
    <div 
      id="travel-articles"
      style={{ 
        padding: window.innerWidth <= 768 ? '40px 0' : '100px 0', 
        backgroundColor: '#ffffff'
      }}
    >
      {/* Container for centering content */}
      <div style={{ 
        maxWidth: '1600px', 
        margin: '0 auto', 
        padding: window.innerWidth <= 768 ? '0 16px' : window.innerWidth <= 1024 ? '0 32px' : '0 250px' 
      }}>
        
        {/* Header Section (Travel Articles & See all) */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: window.innerWidth <= 768 ? '20px' : '40px',
          padding: '0 10px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <h2 style={{ 
            fontSize: window.innerWidth <= 480 ? '1.3rem' : window.innerWidth <= 768 ? '1.5rem' : '1.7rem',
            fontWeight: 'bold',
            color: '#212529',
            margin: 0
          }}>
            Travel Articles
          </h2>
          <a href="#" style={{ 
            color: '#007bff',
            textDecoration: 'none',
            fontSize: window.innerWidth <= 768 ? '12px' : '14px',
            fontWeight: '600'
          }}>
            {window.innerWidth <= 768 ? 'See more' : 'See all'}
          </a>
        </div>
        
        {/* Articles Grid - responsive columns */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: window.innerWidth <= 768 ? '15px' : '25px',
          paddingBottom: '20px'
        }}>
          {articles.slice(0, window.innerWidth <= 768 ? 2 : articles.length).map(article => (
            <div 
              key={article.id} 
              onClick={() => navigate(`/article/${article.id}`)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '8px',
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
              {/* Image with the 'Trips' Tag */}
              <div style={{ position: 'relative' }}>
                <img 
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '220px',
                    objectFit: 'cover',
                    imageRendering: 'high-quality',
                    WebkitImageRendering: 'high-quality'
                  }}
                />
                <TripTag type={article.type} />
              </div>
              
              {/* Content Block */}
              <div style={{ padding: '15px 20px 30px 20px' }}> {/* Adjusted padding */}
                
                {/* Date and Author */}
                <div style={{ 
                  fontSize: '13px', 
                  color: '#6c757d',
                  marginBottom: '8px',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{ fontWeight: '600' }}>{article.date}</span> {article.author}
                </div>
                
                {/* Title */}
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#212529',
                  lineHeight: '1.3',
                  margin: 0 // Remove default h3 margin
                }}>
                  {article.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelArticles;