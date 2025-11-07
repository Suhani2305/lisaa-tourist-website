import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

// ✅ Import Google Font (Poppins)
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    tourType: ''
  });

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('🔍 Hero Search triggered with data:', searchData);
    
    const params = new URLSearchParams();
    
    // Add destination/search
    if (searchData.destination && searchData.destination.trim()) {
      params.append('search', searchData.destination.trim());
      console.log('📍 Adding search param:', searchData.destination.trim());
    }
    
    // Add dates
    if (searchData.startDate) {
      params.append('startDate', searchData.startDate);
      console.log('📅 Adding startDate:', searchData.startDate);
    }
    if (searchData.endDate) {
      params.append('endDate', searchData.endDate);
      console.log('📅 Adding endDate:', searchData.endDate);
    }
    
    // Add tour type/category (trending destinations)
    if (searchData.tourType && searchData.tourType.trim()) {
      params.append('trendingCategory', searchData.tourType.trim());
      console.log('🗺️ Adding trending category:', searchData.tourType.trim());
    }
    
    const queryString = params.toString();
    const finalUrl = `/package${queryString ? `?${queryString}` : ''}`;
    
    console.log('🚀 Navigating to:', finalUrl);
    console.log('📊 Search data being sent:', searchData);
    
    // Use navigate instead of window.location for React Router
    navigate(finalUrl);
  };
  return (
    <div style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: window.innerWidth <= 768 ? 'scroll' : 'fixed',
      minHeight: window.innerWidth <= 768 ? '60vh' : '78vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: window.innerWidth <= 768 ? '0 16px' : '0 24px',
        textAlign: 'center',
        color: 'white'
      }}>
        <p style={{ 
          fontSize: window.innerWidth <= 480 ? '0.9rem' : window.innerWidth <= 768 ? '1rem' : '1.2rem', 
          marginBottom: window.innerWidth <= 768 ? '20px' : '40px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: '500',
          lineHeight: '1.4'
        }}>
          Discover the beauty of India with Lisaa Tours & Travels. 
        </p>
        <h1 style={{ 
          fontSize: window.innerWidth <= 480 ? '1.8rem' : window.innerWidth <= 768 ? '2.5rem' : '3.5rem', 
          fontWeight: '700', 
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          fontFamily: "'Poppins', sans-serif",
          lineHeight: '1.2'
        }}>
          Explore Incredible India
          <br />with Lisaa Tours & Travels
        </h1>
      </div>
      
      {/* 🧭 Sleek Search Bar */}
      <div style={{
        position: 'absolute',
        bottom: window.innerWidth <= 768 ? '-30px' : '-50px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: window.innerWidth <= 768 ? '90%' : '50%',
        maxWidth: window.innerWidth <= 768 ? '100%' : '900px'
      }}>
        <form onSubmit={handleSearch}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: window.innerWidth <= 768 ? '25px' : '50px',
            padding: window.innerWidth <= 768 ? '8px 16px' : '10px 40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: window.innerWidth <= 768 ? '5px' : '10px',
            flexWrap: window.innerWidth <= 768 ? 'wrap' : 'nowrap'
          }}>
          {/* 🔍 Where */}
          <div style={{
            flex: '1',
            borderRight: window.innerWidth <= 768 ? 'none' : '1px solid #eee',
            padding: window.innerWidth <= 768 ? '8px 12px' : '10px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: window.innerWidth <= 768 ? '8px' : '0'
          }}>
            <label style={{ 
              fontSize: window.innerWidth <= 768 ? '11px' : '13px', 
              color: '#1a1a1a', 
              fontWeight: '600',
              marginBottom: '2px',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Where
            </label>
            <input 
              type="text" 
              value={searchData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch(e);
                }
              }}
              placeholder="Search destinations in India"
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: window.innerWidth <= 768 ? '12px' : '14px',
                color: '#333',
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: 'white'
              }}
            />
          </div>

          {/* 📅 When */}
          <div style={{
            flex: '1',
            borderRight: window.innerWidth <= 768 ? 'none' : '1px solid #eee',
            padding: window.innerWidth <= 768 ? '8px 12px' : '10px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: window.innerWidth <= 768 ? '8px' : '0'
          }}>
            <label style={{ 
              fontSize: window.innerWidth <= 768 ? '11px' : '13px', 
              color: '#1a1a1a', 
              fontWeight: '600',
              marginBottom: '2px',
              fontFamily: "'Poppins', sans-serif"
            }}>
              When
            </label>
            <DatePicker.RangePicker
              value={searchData.startDate && searchData.endDate ? [
                dayjs(searchData.startDate),
                dayjs(searchData.endDate)
              ] : null}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  handleInputChange('startDate', dates[0].format('YYYY-MM-DD'));
                  handleInputChange('endDate', dates[1].format('YYYY-MM-DD'));
                } else {
                  handleInputChange('startDate', '');
                  handleInputChange('endDate', '');
                }
              }}
              format="DD/MM/YYYY"
              placeholder={['Start Date', 'End Date']}
              disabledDate={(current) => {
                return current && current < dayjs().startOf('day');
              }}
              style={{
                width: '100%',
                border: 'none',
                fontSize: window.innerWidth <= 768 ? '12px' : '14px',
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: 'transparent'
              }}
              size="small"
              bordered={false}
              className="hero-date-picker"
            />
          </div>

          {/* 🗺️ Tour Type */}
          <div style={{
            flex: '1',
            padding: window.innerWidth <= 768 ? '8px 12px' : '10px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: window.innerWidth <= 768 ? '8px' : '0'
          }}>
            <label style={{ 
              fontSize: window.innerWidth <= 768 ? '11px' : '13px', 
              color: '#1a1a1a', 
              fontWeight: '600',
              marginBottom: '2px',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Tour Type
            </label>
            <select 
              value={searchData.tourType}
              onChange={(e) => handleInputChange('tourType', e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: window.innerWidth <= 768 ? '12px' : '14px',
                color: '#333',
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              <option value="">All Tour Types</option>
              <option value="Culture & Heritage">Culture & Heritage</option>
              <option value="Nature & Adventure">Nature & Adventure</option>
              <option value="Beaches & Islands">Beaches & Islands</option>
              <option value="Wellness & Spirituality">Wellness & Spirituality</option>
              <option value="Food & Festivals">Food & Festivals</option>
              <option value="Modern India">Modern India</option>
              <option value="Special Journeys">Special Journeys</option>
            </select>
          </div>

          {/* 🔘 Search Button */}
          <button 
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleSearch(e);
            }}
            style={{
              backgroundColor: '#f15a29',
              color: 'white',
              border: 'none',
              padding: window.innerWidth <= 768 ? '12px 24px' : '15px 40px',
              borderRadius: window.innerWidth <= 768 ? '20px' : '40px',
              fontSize: window.innerWidth <= 768 ? '14px' : '16px',
              fontWeight: '600',
              fontFamily: "'Poppins', sans-serif",
              cursor: 'pointer',
              transition: '0.3s ease',
              width: window.innerWidth <= 768 ? '100%' : 'auto'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d94e23'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f15a29'}
          >
            Search
          </button>
          </div>
        </form>
      </div>
      {/* 🔸 Bottom Black Divider */}
<div
  style={{
    position: "absolute",
    bottom: window.innerWidth <= 768 ? "-40px" : "-70px",
    left: 0,
    width: "100%",
    height: "1px",
    backgroundColor: "#D3D3D3", // black line
  }}
></div>

      
    </div>
  );
};

export default HeroSection;
