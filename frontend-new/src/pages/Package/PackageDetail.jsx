import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tourService, paymentService, authService } from '../../services';
import { Spin, message, Tabs, Timeline, Tag, Card, Row, Col, Modal, Form, Input, InputNumber, DatePicker, Button, Collapse } from 'antd';
import {
  ClockCircleOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarFilled,
  EnvironmentOutlined,
  UserOutlined,
  HomeOutlined,
  CreditCardOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const PackageDetail = () => {
  const navigate = useNavigate();
  const { packageSlug } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [form] = Form.useForm();
  
  // Watch form values for price calculation (must be at top level, before any returns)
  const adultsCount = Form.useWatch('adults', form) || 1;
  const childrenCount = Form.useWatch('children', form) || 0;
  
  useEffect(() => {
    fetchPackageDetails();
  }, [packageSlug]);

  // Helper function to calculate discounted price
  const calculateDiscountedPrice = (tour) => {
    if (!tour) return { originalPrice: 0, finalPrice: 0, hasDiscount: false };
    
    const originalPrice = tour.price?.adult || 0;
    const discount = tour.discount;
    
    if (!discount || !discount.isActive) {
      return { originalPrice, finalPrice: originalPrice, hasDiscount: false };
    }
    
    // Check if discount is within date range
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    if (discount.startDate) {
      const startDate = new Date(discount.startDate);
      startDate.setHours(0, 0, 0, 0);
      if (startDate > now) {
        return { originalPrice, finalPrice: originalPrice, hasDiscount: false };
      }
    }
    
    if (discount.endDate) {
      const endDate = new Date(discount.endDate);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      if (endDate < now) {
        return { originalPrice, finalPrice: originalPrice, hasDiscount: false };
      }
    }
    
    let finalPrice = originalPrice;
    if (discount.type === 'percentage') {
      finalPrice = originalPrice * (1 - (discount.value / 100));
    } else if (discount.type === 'fixed') {
      finalPrice = Math.max(0, originalPrice - discount.value);
    }
    
    return { 
      originalPrice, 
      finalPrice: Math.round(finalPrice), 
      hasDiscount: true,
      discountValue: discount.value,
      discountType: discount.type
    };
  };

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching package with ID:', packageSlug);
      const data = await tourService.getTourById(packageSlug);
      console.log('✅ Package data received:', data);
      
      // Check if data.tour exists (backend might wrap it)
      const packageInfo = data.tour || data;
      console.log('📦 Final package info:', packageInfo);
      
      setPackageData(packageInfo);
    } catch (error) {
      console.error('❌ Error fetching package:', error);
      console.error('❌ Package ID:', packageSlug);
      message.error('Failed to load package details. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async (values) => {
    try {
      setPaymentLoading(true);

      // Check if user is logged in
      const user = await authService.getProfile();
      if (!user) {
        message.error('Please login to book this package');
        navigate('/login');
        return;
      }

      const adults = values.adults || 1;
      const children = values.children || 0;
      
      // Calculate discounted prices
      const adultPriceInfo = calculateDiscountedPrice(packageData);
      const adultPrice = adultPriceInfo.hasDiscount ? adultPriceInfo.finalPrice : packageData.price.adult;
      
      // Apply same discount percentage to child price if applicable
      let childPrice = packageData.price.child || 0;
      if (adultPriceInfo.hasDiscount && packageData.price.child > 0) {
        if (adultPriceInfo.discountType === 'percentage') {
          childPrice = Math.round(packageData.price.child * (1 - (adultPriceInfo.discountValue / 100)));
        } else if (adultPriceInfo.discountType === 'fixed') {
          childPrice = Math.max(0, packageData.price.child - adultPriceInfo.discountValue);
        }
      }
      
      const totalAmount = (adults * adultPrice) + (children * childPrice);

      // Load Razorpay script
      const isLoaded = await paymentService.loadRazorpayScript();
      if (!isLoaded) {
        message.error('Failed to load payment gateway. Please try again.');
        return;
      }

      // Create order
      const orderData = {
        amount: totalAmount,
        tourId: packageData._id,
        tourTitle: packageData.title,
        customerName: values.name || user.name,
        customerEmail: values.email || user.email,
        customerPhone: values.phone || user.phone
      };

      const orderResponse = await paymentService.createOrder(orderData);

      // Razorpay options
      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'Lisaa Tours & Travels',
        description: packageData.title,
        image: packageData.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=150&h=150&fit=crop&q=80',
        order_id: orderResponse.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingDetails: {
                userId: user._id,
                tourId: packageData._id,
                travelers: {
                  adults: adults,
                  children: children
                },
                bookingDate: values.travelDate,
                totalAmount: totalAmount,
                specialRequests: values.specialRequests || ''
              }
            };

            const verifyResponse = await paymentService.verifyPayment(verificationData);

            if (verifyResponse.success) {
              message.success('🎉 Payment successful! Your booking is confirmed!');
              setBookingModalVisible(false);
              form.resetFields();
              
              // Redirect to user dashboard
              setTimeout(() => {
                navigate('/user-dashboard');
              }, 2000);
            }
          } catch (error) {
            message.error('Payment verification failed. Please contact support.');
            console.error(error);
          }
        },
        prefill: {
          name: values.name || user.name,
          email: values.email || user.email,
          contact: values.phone || user.phone
        },
        notes: {
          tourId: packageData._id,
          tourTitle: packageData.title
        },
        theme: {
          color: '#FF6B35'
        },
        method: {
          netbanking: true,
          card: true,
          wallet: true,
          upi: true
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on('payment.failed', function (response) {
        message.error('Payment failed! Please try again.');
        console.error('Payment failed:', response.error);
      });

      razorpayInstance.open();

    } catch (error) {
      message.error(error.message || 'Booking failed. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <Spin size="large" />
        <div style={{ color: '#6c757d', fontSize: '16px' }}>Loading package details...</div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '40px'
      }}>
        <h1 style={{ color: '#dc3545', marginBottom: '16px' }}>Package Not Found</h1>
        <button 
          onClick={() => navigate('/package')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#FF6B35',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Back to Packages
        </button>
      </div>
    );
  }

  const isMobile = window.innerWidth <= 768;
  const isSmall = window.innerWidth <= 480;

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: isSmall ? '12px 0' : '16px 0',
        borderBottom: '1px solid #e9ecef',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: isMobile ? '100%' : '1800px',
          margin: '0 auto',
          padding: isSmall ? '0 8px' : isMobile ? '0 12px' : '0 250px',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '12px' : '20px'
        }}>
          <button onClick={() => navigate('/package')} style={{
            padding: isSmall ? '6px 12px' : '8px 16px',
            backgroundColor: 'transparent',
            color: '#FF6B35',
            border: '2px solid #FF6B35',
            borderRadius: isMobile ? '6px' : '8px',
            cursor: 'pointer',
            fontSize: isSmall ? '12px' : '14px',
            fontWeight: '600'
          }}>
            ← Back
          </button>
          <div>
            <h1 style={{ 
              fontSize: isSmall ? '1.1rem' : isMobile ? '1.3rem' : '1.8rem', 
              fontWeight: 'bold', 
              color: '#212529',
              margin: '0'
            }}>
              {packageData.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: isMobile ? '100%' : '1800px',
        margin: '0 auto',
        padding: isSmall ? '16px 8px' : isMobile ? '20px 12px' : '24px 250px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
          gap: isMobile ? '20px' : '30px'
        }}>
          {/* Left Content */}
          <div>
            {/* Quick Info Bar */}
            <Card style={{ marginBottom: '20px', borderRadius: '12px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <EnvironmentOutlined style={{ fontSize: '24px', color: '#FF6B35', marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>Destination</div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{packageData.destination}</div>
                </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <ClockCircleOutlined style={{ fontSize: '24px', color: '#FF6B35', marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>Duration</div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                      {packageData.duration?.days}D/{packageData.duration?.nights}N
                </div>
              </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <UserOutlined style={{ fontSize: '24px', color: '#FF6B35', marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>Group Size</div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                      Max {packageData.groupSize?.max || 20}
              </div>
            </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <StarFilled style={{ fontSize: '24px', color: '#ffc107', marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>Rating</div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                      {packageData.rating?.average || 4.5}/5
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Image Gallery */}
            <div style={{
              backgroundColor: 'white',
              padding: isSmall ? '16px' : isMobile ? '20px' : '30px',
              borderRadius: '12px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '16px'
              }}>
                <img
                  src={
                    packageData.images && packageData.images.length > 0
                      ? packageData.images[selectedImage]
                      : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90&auto=format&fit=crop'
                  }
                  alt={packageData.title}
                  loading="eager"
                  style={{
                    width: '100%',
                    height: isSmall ? '250px' : isMobile ? '300px' : '450px',
                    objectFit: 'cover',
                    imageRendering: 'high-quality',
                    WebkitImageRendering: 'high-quality'
                  }}
                />
              </div>

              {/* Thumbnails */}
              {packageData.images && packageData.images.length > 1 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${isSmall ? 3 : 4}, 1fr)`,
                  gap: isSmall ? '8px' : '12px'
                }}>
                  {packageData.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedImage === idx ? '3px solid #FF6B35' : '3px solid transparent'
                      }}
                    >
                      <img
                        src={img}
                        alt={packageData.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: isSmall ? '70px' : '90px',
                          objectFit: 'cover',
                          imageRendering: 'high-quality',
                          WebkitImageRendering: 'high-quality'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs for Details */}
            <Card style={{ borderRadius: '12px' }}>
              <Tabs defaultActiveKey="1" size="large">
                <TabPane tab="📝 Overview" key="1">
                  <div style={{ padding: '16px 0' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#212529' }}>
                      Package Description
                    </h3>
                    <p style={{ fontSize: '15px', color: '#495057', lineHeight: '1.7' }}>
                      {packageData.description}
                    </p>

                    {packageData.highlights && packageData.highlights.length > 0 && (
                      <>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '12px', color: '#212529' }}>
                          ✨ Package Highlights
                        </h3>
                        <Row gutter={[12, 12]}>
                          {packageData.highlights.map((highlight, index) => (
                            <Col xs={24} sm={12} key={index}>
                  <div style={{
                    display: 'flex',
                                alignItems: 'flex-start',
                    gap: '8px',
                                padding: '8px',
                  backgroundColor: '#f8f9fa',
                                borderRadius: '8px'
                              }}>
                                <StarFilled style={{ color: '#FF6B35', marginTop: '4px', flexShrink: 0 }} />
                                <span style={{ fontSize: '14px', color: '#495057' }}>{highlight}</span>
                  </div>
                            </Col>
                          ))}
                        </Row>
                      </>
                )}
              </div>
                </TabPane>

                <TabPane tab="📅 Itinerary" key="2">
                  <div style={{ padding: '16px 0' }}>
                    {packageData.itinerary && packageData.itinerary.length > 0 ? (
                      <Timeline mode="left">
                        {packageData.itinerary.map((day, index) => (
                          <Timeline.Item
                            key={index}
                            dot={
              <div style={{
                                width: '32px',
                                height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#FF6B35',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            fontWeight: '700',
                                fontSize: '14px'
                          }}>
                            {day.day}
                          </div>
                            }
                            color="#FF6B35"
                          >
                            <Card
                        style={{
                                marginBottom: '16px',
                                borderLeft: '4px solid #FF6B35',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                              }}
                            >
                              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#212529', marginBottom: '8px' }}>
                                Day {day.day}: {day.title}
                              </h4>
                              <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '12px', lineHeight: '1.6' }}>
                                {day.description}
                              </p>

                              {day.activities && day.activities.length > 0 && (
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
                                    Activities:
                        </div>
                                  {day.activities.map((activity, idx) => (
                                    <div key={idx} style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: '8px',
                          marginBottom: '4px'
                        }}>
                                      <CheckCircleOutlined style={{ color: '#28a745', marginTop: '4px', flexShrink: 0 }} />
                                      <span style={{ fontSize: '13px', color: '#495057' }}>{activity}</span>
                        </div>
                                  ))}
              </div>
            )}

                              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
                                {day.meals && (
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d' }}>Meals:</span>
                                    {day.meals.breakfast && <Tag color="green">🍳 Breakfast</Tag>}
                                    {day.meals.lunch && <Tag color="orange">🍛 Lunch</Tag>}
                                    {day.meals.dinner && <Tag color="blue">🍽️ Dinner</Tag>}
                                    {!day.meals.breakfast && !day.meals.lunch && !day.meals.dinner && (
                                      <Tag>No meals included</Tag>
                                    )}
              </div>
            )}

                                {day.accommodation && (
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <HomeOutlined style={{ color: '#6c757d' }} />
                                    <span style={{ fontSize: '13px', color: '#495057' }}>{day.accommodation}</span>
              </div>
            )}
                  </div>
                            </Card>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6c757d' }}>
                        <CalendarOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                        <p>Detailed itinerary will be shared upon booking</p>
              </div>
            )}
                  </div>
                </TabPane>

                <TabPane tab="✅ Inclusions" key="3">
                  <div style={{ padding: '16px 0' }}>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} md={12}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#28a745' }}>
                          <CheckCircleOutlined style={{ marginRight: '8px' }} />
                          What's Included
                        </h3>
                        {packageData.inclusions && packageData.inclusions.length > 0 ? (
                          <div>
                            {packageData.inclusions.map((item, index) => (
                              <div key={index} style={{
                          display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                          padding: '12px',
                                marginBottom: '8px',
                                backgroundColor: '#d4edda',
                          borderRadius: '8px',
                                border: '1px solid #c3e6cb'
                              }}>
                                <CheckCircleOutlined style={{ color: '#28a745', marginTop: '2px', flexShrink: 0 }} />
                                <span style={{ fontSize: '14px', color: '#155724' }}>{item}</span>
                      </div>
                            ))}
                </div>
                        ) : (
                          <p style={{ color: '#6c757d' }}>Details will be shared upon inquiry</p>
                        )}
                      </Col>

                      <Col xs={24} md={12}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#dc3545' }}>
                          <CloseCircleOutlined style={{ marginRight: '8px' }} />
                          What's Not Included
                        </h3>
                        {packageData.exclusions && packageData.exclusions.length > 0 ? (
                          <div>
                            {packageData.exclusions.map((item, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                                gap: '12px',
                                padding: '12px',
                                marginBottom: '8px',
                                backgroundColor: '#f8d7da',
                                borderRadius: '8px',
                                border: '1px solid #f5c6cb'
                              }}>
                                <CloseCircleOutlined style={{ color: '#dc3545', marginTop: '2px', flexShrink: 0 }} />
                                <span style={{ fontSize: '14px', color: '#721c24' }}>{item}</span>
                          </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ color: '#6c757d' }}>Details will be shared upon inquiry</p>
                        )}
                      </Col>
                    </Row>
              </div>
                </TabPane>
              </Tabs>
            </Card>
          </div>

          {/* Right Sidebar - Booking Card */}
          <div>
            <div style={{
              backgroundColor: 'white',
              padding: isSmall ? '20px' : '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              position: isMobile ? 'relative' : 'sticky',
              top: isMobile ? '0' : '100px'
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: '2px solid #e9ecef'
              }}>
                <Tag color={packageData.category === 'spiritual' ? 'blue' : packageData.category === 'adventure' ? 'red' : 'orange'} style={{ marginBottom: '12px' }}>
                  {packageData.category?.toUpperCase()}
                </Tag>
                <div style={{
                  fontSize: '14px',
                  color: '#6c757d',
                  marginBottom: '8px'
                }}>
                  Starting From
                </div>
                
                {/* Discount Badge */}
                {(() => {
                  const priceInfo = calculateDiscountedPrice(packageData);
                  return priceInfo.hasDiscount ? (
                    <div style={{
                      marginBottom: '8px',
                      display: 'inline-block',
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {priceInfo.discountType === 'percentage' 
                        ? `${priceInfo.discountValue}% OFF` 
                        : `₹${priceInfo.discountValue} OFF`}
                    </div>
                  ) : null;
                })()}
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                  {(() => {
                    const priceInfo = calculateDiscountedPrice(packageData);
                    return priceInfo.hasDiscount ? (
                      <>
                        <div style={{
                          fontSize: '1.2rem',
                          fontWeight: '500',
                          color: '#6c757d',
                          textDecoration: 'line-through'
                        }}>
                          ₹{priceInfo.originalPrice.toLocaleString()}
                        </div>
                        <div style={{
                          fontSize: '2.2rem',
                          fontWeight: '700',
                          color: '#FF6B35'
                        }}>
                          ₹{priceInfo.finalPrice.toLocaleString()}
                        </div>
                      </>
                    ) : (
                      <div style={{
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        color: '#FF6B35'
                      }}>
                        ₹{packageData.price?.adult?.toLocaleString()}
                      </div>
                    );
                  })()}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6c757d'
                }}>
                  per person
              </div>
                {packageData.price?.child > 0 && (() => {
                  const adultPriceInfo = calculateDiscountedPrice(packageData);
                  let childPrice = packageData.price.child;
                  let childOriginalPrice = packageData.price.child;
                  
                  if (adultPriceInfo.hasDiscount) {
                    if (adultPriceInfo.discountType === 'percentage') {
                      childPrice = Math.round(packageData.price.child * (1 - (adultPriceInfo.discountValue / 100)));
                    } else if (adultPriceInfo.discountType === 'fixed') {
                      childPrice = Math.max(0, packageData.price.child - adultPriceInfo.discountValue);
                    }
                  }
                  
                  return (
                    <div style={{
                      fontSize: '14px',
                      color: '#6c757d',
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      Child: 
                      {adultPriceInfo.hasDiscount && (
                        <span style={{ textDecoration: 'line-through', fontSize: '12px' }}>
                          ₹{childOriginalPrice.toLocaleString()}
                        </span>
                      )}
                      <span style={{ fontWeight: '600', color: '#FF6B35' }}>
                        ₹{childPrice.toLocaleString()}
                      </span>
                    </div>
                  );
                })()}
                </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#495057' }}>
                  Package Details:
                </div>
                <div style={{ fontSize: '13px', color: '#6c757d', lineHeight: '1.8' }}>
                  <div>📅 Duration: {packageData.duration?.days} Days / {packageData.duration?.nights} Nights</div>
                  <div>👥 Max Group: {packageData.groupSize?.max || 20} People</div>
                  <div>🎯 Difficulty: {packageData.difficulty || 'Moderate'}</div>
                  <div>
                    📍 Status: {' '}
                    <Tag color={packageData.availability?.isAvailable ? 'success' : 'error'} style={{ marginLeft: '4px' }}>
                      {packageData.availability?.isAvailable ? 'Available' : 'Not Available'}
                    </Tag>
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              <button 
                onClick={() => setBookingModalVisible(true)}
                style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#FF6B35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                marginBottom: '12px',
                transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#ff5722'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6B35'}
              >
                <CreditCardOutlined /> Book Now & Pay
              </button>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '16px',
                flexWrap: 'wrap'
              }}>
                <img src="https://i.imgur.com/WPX6jaB.png" alt="UPI" style={{ height: '24px' }} />
                <img src="https://i.imgur.com/3P1qxPj.png" alt="Cards" style={{ height: '24px' }} />
                <img src="https://i.imgur.com/DqKZgL3.png" alt="Netbanking" style={{ height: '24px' }} />
              </div>

              <div style={{
                textAlign: 'center',
                fontSize: '11px',
                color: '#6c757d',
                marginBottom: '12px'
              }}>
                <SafetyOutlined /> 100% Secure Payment via Razorpay
              </div>

              <div style={{
                fontSize: '12px',
                color: '#6c757d',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                ✓ Instant Confirmation<br />
                ✓ Free Cancellation Available
              </div>

              {/* Contact */}
              <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '8px'
                }}>
                  Need Help?
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#FF6B35',
                  marginBottom: '8px'
                }}>
                  📞 +91 9263616263
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6c757d'
                }}>
                  📧 Lsiaatech@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Booking Modal */}
      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <CreditCardOutlined style={{ fontSize: '24px', color: '#FF6B35', marginBottom: '8px' }} />
            <h3 style={{ margin: '8px 0 0 0' }}>Book Your Package</h3>
          </div>
        }
        open={bookingModalVisible}
        onCancel={() => {
          setBookingModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleBookNow}
          initialValues={{
            adults: 1,
            children: 0
          }}
        >
          <Card style={{ marginBottom: '16px', backgroundColor: '#f8f9fa' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Selected Package</h4>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              <div><strong>{packageData?.title}</strong></div>
              <div>📍 {packageData?.destination}</div>
              <div>🕒 {packageData?.duration?.days}D/{packageData?.duration?.nights}N</div>
            </div>
          </Card>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="your.email@example.com" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter your phone' }]}
              >
                <Input placeholder="10-digit number" maxLength={10} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="travelDate"
                label="Travel Date"
                rules={[{ required: true, message: 'Please select travel date' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="adults"
                label="Number of Adults"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber min={1} max={20} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="children"
                label="Number of Children"
              >
                <InputNumber min={0} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="specialRequests"
            label="Special Requests (Optional)"
          >
            <Input.TextArea rows={3} placeholder="Any special requirements or requests..." />
          </Form.Item>

          <Card style={{ marginBottom: '16px', backgroundColor: '#fff9f5', border: '2px solid #FF6B35' }}>
            <Row justify="space-between" align="middle">
              <Col>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>Total Amount</div>
                {(() => {
                  const adultPriceInfo = calculateDiscountedPrice(packageData);
                  const adultPrice = adultPriceInfo.hasDiscount ? adultPriceInfo.finalPrice : (packageData?.price?.adult || 0);
                  
                  let childPrice = packageData?.price?.child || 0;
                  if (adultPriceInfo.hasDiscount && childPrice > 0) {
                    if (adultPriceInfo.discountType === 'percentage') {
                      childPrice = Math.round(childPrice * (1 - (adultPriceInfo.discountValue / 100)));
                    } else if (adultPriceInfo.discountType === 'fixed') {
                      childPrice = Math.max(0, childPrice - adultPriceInfo.discountValue);
                    }
                  }
                  
                  const totalAmount = (adultsCount * adultPrice) + (childrenCount * childPrice);
                  const originalTotal = (adultsCount * (packageData?.price?.adult || 0)) + 
                                       (childrenCount * (packageData?.price?.child || 0));
                  
                  return (
                    <>
                      {adultPriceInfo.hasDiscount && (
                        <div style={{ fontSize: '12px', color: '#6c757d', textDecoration: 'line-through', marginBottom: '4px' }}>
                          ₹{originalTotal.toLocaleString()}
                        </div>
                      )}
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B35' }}>
                        ₹{totalAmount.toLocaleString()}
                      </div>
                      {adultPriceInfo.hasDiscount && (
                        <div style={{ fontSize: '12px', color: '#28a745', fontWeight: '600', marginTop: '4px' }}>
                          {adultPriceInfo.discountType === 'percentage' 
                            ? `${adultPriceInfo.discountValue}% OFF` 
                            : `₹${adultPriceInfo.discountValue} OFF`}
                        </div>
                      )}
                    </>
                  );
                })()}
              </Col>
              <Col>
                <div style={{ fontSize: '12px', color: '#6c757d', textAlign: 'right' }}>
                  {(() => {
                    const adultPriceInfo = calculateDiscountedPrice(packageData);
                    const adultPrice = adultPriceInfo.hasDiscount ? adultPriceInfo.finalPrice : (packageData?.price?.adult || 0);
                    const adultOriginalPrice = packageData?.price?.adult || 0;
                    
                    let childPrice = packageData?.price?.child || 0;
                    let childOriginalPrice = packageData?.price?.child || 0;
                    if (adultPriceInfo.hasDiscount && childPrice > 0) {
                      if (adultPriceInfo.discountType === 'percentage') {
                        childPrice = Math.round(childPrice * (1 - (adultPriceInfo.discountValue / 100)));
                      } else if (adultPriceInfo.discountType === 'fixed') {
                        childPrice = Math.max(0, childPrice - adultPriceInfo.discountValue);
                      }
                    }
                    
                    return (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <span>Adult: </span>
                          {adultPriceInfo.hasDiscount && (
                            <span style={{ textDecoration: 'line-through', fontSize: '10px' }}>
                              ₹{adultOriginalPrice.toLocaleString()}
                            </span>
                          )}
                          <span>₹{adultPrice.toLocaleString()} × {adultsCount}</span>
                        </div>
                        {childrenCount > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '4px' }}>
                            <span>Child: </span>
                            {adultPriceInfo.hasDiscount && childOriginalPrice > 0 && (
                              <span style={{ textDecoration: 'line-through', fontSize: '10px' }}>
                                ₹{childOriginalPrice.toLocaleString()}
                              </span>
                            )}
                            <span>₹{childPrice.toLocaleString()} × {childrenCount}</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </Col>
            </Row>
          </Card>

          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '8px' }}>
              <SafetyOutlined /> Secure Payment Options
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Tag color="blue">💳 Credit/Debit Cards</Tag>
              <Tag color="green">📱 UPI</Tag>
              <Tag color="orange">🏦 Netbanking</Tag>
              <Tag color="purple">📲 Wallets</Tag>
            </div>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={paymentLoading}
              size="large"
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#FF6B35',
                borderColor: '#FF6B35',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              <CreditCardOutlined /> Proceed to Secure Payment
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', fontSize: '11px', color: '#6c757d' }}>
            By proceeding, you agree to our terms and conditions
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PackageDetail;
