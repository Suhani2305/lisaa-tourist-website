import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tabs, 
  Button, 
  Avatar, 
  Divider,
  Spin,
  message,
  Tag,
  Empty,
  Space,
  Modal,
  Descriptions,
  Popconfirm,
  Alert
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  HeartOutlined,
  HeartFilled,
  DeleteOutlined,
  SettingOutlined,
  LogoutOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ManOutlined,
  WomanOutlined,
  DownloadOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  UserAddOutlined,
  InfoCircleOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService, bookingService, paymentService, wishlistService } from '../../services';
import Header from '../landingpage/components/Header';
import Footer from '../landingpage/components/Footer';

const { Title, Text: TypographyText, Paragraph } = Typography;

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [removingWishlist, setRemovingWishlist] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setWishlistLoading(true);
      const wishlistData = await wishlistService.getWishlist();
      setWishlist(wishlistData);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      message.error('Failed to load wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (tourId) => {
    try {
      setRemovingWishlist(prev => ({ ...prev, [tourId]: true }));
      await wishlistService.removeFromWishlist(tourId);
      setWishlist(prev => prev.filter(item => (item.tour?._id || item.tour) !== tourId));
      message.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      message.error(error.message || 'Failed to remove from wishlist');
    } finally {
      setRemovingWishlist(prev => ({ ...prev, [tourId]: false }));
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const userData = await authService.getProfile();
      setUser(userData);

      // Fetch user bookings
      try {
        const bookingsData = await bookingService.getMyBookings();
        setBookings(bookingsData);
      } catch (bookingError) {
        console.error('Error fetching bookings:', bookingError);
        // It's okay if bookings fail, user might not have any
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      message.error('Failed to load user data');
      // If profile fetch fails, redirect to login
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    message.success('Logged out successfully');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      completed: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const getAvatarIcon = () => {
    if (user?.profileImage) {
      return null;
    }
    
    const gender = user?.gender || 'male';
    if (gender === 'female') {
      return <WomanOutlined />;
    } else if (gender === 'male') {
      return <ManOutlined />;
    } else {
      return <UserOutlined />;
    }
  };

  const getAvatarColor = () => {
    const gender = user?.gender || 'male';
    if (gender === 'female') {
      return '#ff6b9d';
    } else if (gender === 'male') {
      return '#ff6b35';
    } else {
      return '#9254de';
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailModalVisible(true);
  };

  const calculateRefundPreview = (booking) => {
    if (!booking || !booking.travelDates?.startDate) {
      return { refundable: false, refundAmount: 0, refundPercentage: 0, cancellationFee: 0 };
    }

    const now = new Date();
    const travelStartDate = new Date(booking.travelDates.startDate);
    const daysUntilTravel = Math.ceil((travelStartDate - now) / (1000 * 60 * 60 * 24));
    
    let refundPercentage = 0;
    let refundable = false;

    if (booking.cancellationPolicy?.canCancel) {
      if (daysUntilTravel > 30) {
        refundPercentage = 100;
        refundable = true;
      } else if (daysUntilTravel > 15) {
        refundPercentage = 75;
        refundable = true;
      } else if (daysUntilTravel > 7) {
        refundPercentage = 50;
        refundable = true;
      } else if (daysUntilTravel > 0) {
        refundPercentage = 25;
        refundable = true;
      } else {
        refundPercentage = 0;
        refundable = false;
      }

      // Override with booking-specific policy if available
      if (booking.cancellationPolicy?.refundPercentage !== undefined) {
        refundPercentage = booking.cancellationPolicy.refundPercentage;
        refundable = refundPercentage > 0;
      }
    }

    const totalPaid = booking.pricing?.finalAmount || booking.totalAmount || 0;
    const refundAmount = Math.round((totalPaid * refundPercentage) / 100);
    const cancellationFee = totalPaid - refundAmount;

    return {
      refundable,
      refundAmount,
      refundPercentage,
      cancellationFee,
      totalPaid,
      daysUntilTravel
    };
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setCancelling(true);
      const response = await bookingService.cancelBooking(selectedBooking._id);
      
      // Show refund information if available
      if (response.refund) {
        const { refundAmount, refundPercentage, cancellationFee, refundable } = response.refund;
        
        if (refundable && refundAmount > 0) {
          message.success({
            content: `Booking cancelled successfully! Refund of ₹${refundAmount.toLocaleString()} (${refundPercentage}%) will be processed within 5-7 business days.`,
            duration: 8
          });
        } else {
          message.warning({
            content: 'Booking cancelled successfully. No refund applicable as per cancellation policy.',
            duration: 6
          });
        }
      } else {
        message.success('Booking cancelled successfully');
      }
      
      setDetailModalVisible(false);
      setSelectedBooking(null);
      // Refresh bookings
      await fetchUserData();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      message.error(error.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const canCancelBooking = (booking) => {
    // Can cancel if status is pending or confirmed (not completed or already cancelled)
    return booking.status === 'pending' || booking.status === 'confirmed';
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
      
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        {/* User Profile Card */}
        <Card
          style={{
            marginBottom: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={6} style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                icon={getAvatarIcon()}
                src={user?.profileImage}
                style={{ backgroundColor: getAvatarColor() }}
              />
            </Col>
            
            <Col xs={24} md={12}>
              <Title level={2} style={{ marginBottom: '8px' }}>
                {user?.name || 'User'}
              </Title>
              <Space direction="vertical" size="small">
                <TypographyText>
                  <MailOutlined style={{ marginRight: '8px', color: '#ff6b35' }} />
                  {user?.email}
                </TypographyText>
                {user?.phone && (
                  <TypographyText>
                    <PhoneOutlined style={{ marginRight: '8px', color: '#ff6b35' }} />
                    {user?.phone}
                  </TypographyText>
                )}
                <Tag color={user?.role === 'admin' ? 'gold' : 'blue'}>
                  {user?.role === 'admin' ? 'Admin' : 'User'}
                </Tag>
              </Space>
            </Col>

            <Col xs={24} md={6} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                size="large"
              >
                Logout
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Tabs for different sections */}
        <Card
          style={{
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Tabs 
            defaultActiveKey="bookings" 
            size="large"
            items={[
              {
                key: 'bookings',
                label: (
                <span>
                  <BookOutlined />
                  My Bookings
                </span>
                ),
                children: (
                  <>
              {bookings && bookings.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {bookings.map((booking) => (
                    <Col xs={24} md={12} key={booking._id}>
                      <Card
                        hoverable
                        style={{ borderRadius: '8px' }}
                      >
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title level={5} style={{ margin: 0 }}>
                              Booking #{booking.bookingNumber}
                            </Title>
                            <Tag color={getStatusColor(booking.status)}>
                              {booking.status.toUpperCase()}
                            </Tag>
                          </div>
                          
                          <Divider style={{ margin: '12px 0' }} />
                          
                          <TypographyText>
                            <CalendarOutlined style={{ marginRight: '8px' }} />
                            {new Date(booking.travelDates.startDate).toLocaleDateString()} - {new Date(booking.travelDates.endDate).toLocaleDateString()}
                          </TypographyText>
                          
                          <TypographyText strong style={{ fontSize: '18px', color: '#ff6b35' }}>
                            ₹{booking.pricing?.finalAmount?.toLocaleString() || booking.totalAmount?.toLocaleString() || '0'}
                          </TypographyText>
                          
                          <Space style={{ width: '100%' }} direction="vertical">
                            <Button 
                              type="primary" 
                              block
                              onClick={() => handleViewDetails(booking)}
                            >
                              View Details
                            </Button>
                            {booking.payment?.status === 'paid' && (
                              <Button 
                                icon={<DownloadOutlined />} 
                                block
                                onClick={() => {
                                  paymentService.downloadReceipt(booking._id)
                                    .then(() => {
                                      message.success('📄 Receipt downloaded successfully!');
                                    })
                                    .catch((err) => {
                                      message.error('Failed to download receipt');
                                      console.error(err);
                                    });
                                }}
                              >
                                Download Receipt
                              </Button>
                            )}
                          </Space>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty
                  description="No bookings yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" onClick={() => navigate('/')}>
                    Explore Tours
                  </Button>
                </Empty>
              )}
                  </>
                ),
              },
              {
                key: 'wishlist',
                label: (
                  <span>
                    <HeartFilled style={{ color: '#FF6B35' }} />
                    My Wishlist
                  </span>
                ),
                children: (
                  <>
                    {wishlistLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Spin size="large" />
                </div>
              ) : wishlist && wishlist.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {wishlist.map((item) => {
                    const tour = item.tour;
                    const tourId = tour?._id || tour;
                    const isRemoving = removingWishlist[tourId];
                    
                    return (
                      <Col xs={24} md={12} lg={8} key={item._id}>
                        <Card
                          hoverable
                          style={{ borderRadius: '8px', height: '100%' }}
                          cover={
                            tour?.images?.[0]?.url ? (
                              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                <img
                                  alt={tour?.title}
                                  src={tour?.images[0].url}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                                <Button
                                  type="primary"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFromWishlist(tourId);
                                  }}
                                  loading={isRemoving}
                                  style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    zIndex: 10
                                  }}
                                />
                              </div>
                            ) : (
                              <div style={{ 
                                height: '200px', 
                                backgroundColor: '#f0f0f0', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                position: 'relative'
                              }}>
                                <HeartOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                                <Button
                                  type="primary"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFromWishlist(tourId);
                                  }}
                                  loading={isRemoving}
                                  style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    zIndex: 10
                                  }}
                                />
                              </div>
                            )
                          }
                          onClick={() => navigate(`/package/${tourId}`)}
                        >
                          <Space direction="vertical" style={{ width: '100%' }} size="small">
                            <Title level={5} style={{ margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                              {tour?.title || 'Tour Package'}
                            </Title>
                            
                            {tour?.destination && (
                              <TypographyText type="secondary" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <EnvironmentOutlined style={{ marginRight: '4px' }} />
                                {tour.destination}
                              </TypographyText>
                            )}
                            
                            {tour?.duration?.days && (
                              <TypographyText style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <CalendarOutlined style={{ marginRight: '4px' }} />
                                {tour.duration.days} Days
                              </TypographyText>
                            )}
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                              <TypographyText strong style={{ fontSize: '18px', color: '#FF6B35', fontFamily: 'Poppins, sans-serif' }}>
                                ₹{(tour?.price?.adult || tour?.price || 0).toLocaleString()}
                              </TypographyText>
                              {tour?.category && (
                                <Tag color="orange" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  {tour.category}
                                </Tag>
                              )}
                            </div>
                            
                            <Button 
                              type="primary" 
                              block
                              style={{ marginTop: '12px', fontFamily: 'Poppins, sans-serif' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/package/${tourId}`);
                              }}
                            >
                              View Details
                            </Button>
                          </Space>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <Empty
                  description="Your wishlist is empty"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" onClick={() => navigate('/package')} style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Explore Tours
                  </Button>
                </Empty>
                    )}
                  </>
                ),
              },
              {
                key: 'settings',
                label: (
                <span>
                  <SettingOutlined />
                  Profile Settings
                </span>
                ),
                children: (
              <Card>
                <Title level={4}>Personal Information</Title>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <TypographyText strong>Name:</TypographyText>
                    <Paragraph>{user?.name}</Paragraph>
                  </div>
                  <div>
                    <TypographyText strong>Email:</TypographyText>
                    <Paragraph>{user?.email}</Paragraph>
                  </div>
                  <div>
                    <TypographyText strong>Phone:</TypographyText>
                    <Paragraph>{user?.phone || 'Not provided'}</Paragraph>
                  </div>
                  <div>
                    <TypographyText strong>Member Since:</TypographyText>
                    <Paragraph>
                      {new Date(user?.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Paragraph>
                  </div>
                  
                  <Button type="primary" size="large">
                    Edit Profile
                  </Button>
                </Space>
              </Card>
                ),
              }
            ]}
          />
        </Card>
      </div>

      {/* Booking Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOutlined style={{ fontSize: '24px', color: '#FF6B35' }} />
            <span style={{ fontSize: '20px', fontFamily: 'Poppins, sans-serif' }}>
              Booking Details
            </span>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedBooking(null);
        }}
        footer={null}
        width={800}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {selectedBooking && (
          <div>
            {/* Booking Status Alert */}
            <Alert
              message={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag color={getStatusColor(selectedBooking.status)} style={{ margin: 0 }}>
                    {selectedBooking.status.toUpperCase()}
                  </Tag>
                  <span>Booking #{selectedBooking.bookingNumber || selectedBooking._id}</span>
                </div>
              }
              type={selectedBooking.status === 'confirmed' ? 'success' : selectedBooking.status === 'cancelled' ? 'error' : 'info'}
              style={{ marginBottom: '24px' }}
            />

            <Descriptions bordered column={1} size="middle">
              {/* Tour Information */}
              <Descriptions.Item 
                label={
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                    <BookOutlined style={{ marginRight: '8px', color: '#FF6B35' }} />
                    Package
                  </span>
                }
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', fontFamily: 'Poppins, sans-serif' }}>
                    {selectedBooking.tour?.title || 'Package Name'}
                  </div>
                  {selectedBooking.tour?.destination && (
                    <div style={{ color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>
                      <EnvironmentOutlined style={{ marginRight: '4px' }} />
                      {selectedBooking.tour.destination}
                    </div>
                  )}
                </div>
              </Descriptions.Item>

              {/* Travel Dates */}
              <Descriptions.Item 
                label={
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                    <CalendarOutlined style={{ marginRight: '8px', color: '#FF6B35' }} />
                    Travel Dates
                  </span>
                }
              >
                <div style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {selectedBooking.travelDates?.startDate ? (
                    <>
                      {new Date(selectedBooking.travelDates.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {' - '}
                      {new Date(selectedBooking.travelDates.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </>
                  ) : (
                    <span style={{ color: '#6c757d' }}>Not specified</span>
                  )}
                </div>
              </Descriptions.Item>

              {/* Travelers */}
              <Descriptions.Item 
                label={
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                    <UserAddOutlined style={{ marginRight: '8px', color: '#FF6B35' }} />
                    Travelers
                  </span>
                }
              >
                <div style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {selectedBooking.travelers?.adults ? (
                    <>
                      <span>{selectedBooking.travelers.adults} Adult{selectedBooking.travelers.adults > 1 ? 's' : ''}</span>
                      {selectedBooking.travelers.children > 0 && (
                        <span>, {selectedBooking.travelers.children} Child{selectedBooking.travelers.children > 1 ? 'ren' : ''}</span>
                      )}
                    </>
                  ) : (
                    <span style={{ color: '#6c757d' }}>Not specified</span>
                  )}
                </div>
              </Descriptions.Item>

              {/* Pricing */}
              <Descriptions.Item 
                label={
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                    <CreditCardOutlined style={{ marginRight: '8px', color: '#FF6B35' }} />
                    Pricing
                  </span>
                }
              >
                <div style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {selectedBooking.pricing ? (
                    <div>
                      {selectedBooking.pricing.basePrice && (
                        <div style={{ marginBottom: '4px' }}>
                          Base Price: <strong>₹{selectedBooking.pricing.basePrice.toLocaleString()}</strong>
                        </div>
                      )}
                      {selectedBooking.pricing.discount > 0 && (
                        <div style={{ marginBottom: '4px', color: '#28a745' }}>
                          Discount: <strong>-₹{selectedBooking.pricing.discount.toLocaleString()}</strong>
                        </div>
                      )}
                      {selectedBooking.pricing.taxes > 0 && (
                        <div style={{ marginBottom: '4px' }}>
                          Taxes: <strong>₹{selectedBooking.pricing.taxes.toLocaleString()}</strong>
                        </div>
                      )}
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e8e8e8' }}>
                        <span style={{ fontSize: '18px', fontWeight: '700', color: '#FF6B35' }}>
                          Total: ₹{selectedBooking.pricing.finalAmount?.toLocaleString() || selectedBooking.totalAmount?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: '#FF6B35' }}>
                        ₹{selectedBooking.totalAmount?.toLocaleString() || '0'}
                      </span>
                    </div>
                  )}
                </div>
              </Descriptions.Item>

              {/* Applied Coupon */}
              {selectedBooking.appliedCoupon && (
                <Descriptions.Item 
                  label={
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                      <GiftOutlined style={{ marginRight: '8px', color: '#FF6B35' }} />
                      Applied Coupon
                    </span>
                  }
                >
                  <div style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <Tag color="green" style={{ fontSize: '13px', padding: '4px 12px' }}>
                      {selectedBooking.appliedCoupon.code}
                    </Tag>
                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#28a745', fontWeight: '600' }}>
                      Discount: ₹{selectedBooking.appliedCoupon.discountAmount?.toLocaleString() || '0'}
                    </div>
                    <div style={{ marginTop: '2px', fontSize: '11px', color: '#6c757d' }}>
                      {selectedBooking.appliedCoupon.discountType === 'percentage' 
                        ? `${selectedBooking.appliedCoupon.discountValue}% OFF`
                        : `₹${selectedBooking.appliedCoupon.discountValue} OFF`}
                    </div>
                  </div>
                </Descriptions.Item>
              )}

              {/* Payment Information */}
              <Descriptions.Item 
                label={
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                    <CreditCardOutlined style={{ marginRight: '8px', color: '#FF6B35' }} />
                    Payment Status
                  </span>
                }
              >
                <div style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <Tag color={selectedBooking.payment?.status === 'paid' ? 'green' : 'orange'}>
                    {selectedBooking.payment?.status?.toUpperCase() || 'PENDING'}
                  </Tag>
                  {selectedBooking.payment?.method && (
                    <span style={{ marginLeft: '8px', color: '#6c757d' }}>
                      via {selectedBooking.payment.method}
                    </span>
                  )}
                  {selectedBooking.payment?.transactionId && (
                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#6c757d' }}>
                      Transaction ID: {selectedBooking.payment.transactionId}
                    </div>
                  )}
                  {selectedBooking.payment?.paymentDate && (
                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#6c757d' }}>
                      Paid on: {new Date(selectedBooking.payment.paymentDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </Descriptions.Item>

              {/* Cancellation Policy */}
              {selectedBooking.cancellationPolicy && (
                <Descriptions.Item 
                  label={
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                      <InfoCircleOutlined style={{ marginRight: '8px', color: '#FF6B35' }} />
                      Cancellation Policy
                    </span>
                  }
                  span={2}
                >
                  <div style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {selectedBooking.cancellationPolicy.canCancel ? (
                      <div>
                        <div style={{ marginBottom: '8px' }}>
                          <Tag color="green">Cancellation Allowed</Tag>
                        </div>
                        {(() => {
                          const refundPreview = calculateRefundPreview(selectedBooking);
                          return (
                            <div>
                              <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                                <strong>Refund Policy:</strong>
                              </div>
                              <ul style={{ margin: '4px 0', paddingLeft: '20px', fontSize: '12px', color: '#6c757d' }}>
                                <li>More than 30 days: 100% refund</li>
                                <li>15-30 days: 75% refund</li>
                                <li>7-15 days: 50% refund</li>
                                <li>0-7 days: 25% refund</li>
                                <li>Same day or past: No refund</li>
                              </ul>
                              <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f0f9ff', borderRadius: '4px', fontSize: '12px' }}>
                                <div><strong>Current Status:</strong> {refundPreview.daysUntilTravel} days until travel</div>
                                {refundPreview.refundable ? (
                                  <div style={{ color: '#52c41a', marginTop: '4px' }}>
                                    Eligible for {refundPreview.refundPercentage}% refund (₹{refundPreview.refundAmount.toLocaleString()})
                                  </div>
                                ) : (
                                  <div style={{ color: '#ff4d4f', marginTop: '4px' }}>
                                    No refund applicable
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <div>
                        <Tag color="red">Cancellation Not Allowed</Tag>
                        <div style={{ marginTop: '4px', fontSize: '12px', color: '#6c757d' }}>
                          This booking cannot be cancelled as per policy.
                        </div>
                      </div>
                    )}
                    {selectedBooking.cancellationPolicy.cancellationDeadline && (
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#6c757d' }}>
                        Cancellation Deadline: {new Date(selectedBooking.cancellationPolicy.cancellationDeadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                  </div>
                </Descriptions.Item>
              )}

              {/* Refund Information (if cancelled) */}
              {selectedBooking.status === 'cancelled' && selectedBooking.cancellationRefund && (
                <Descriptions.Item 
                  label={
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                      <InfoCircleOutlined style={{ marginRight: '8px', color: '#FF6B35' }} />
                      Refund Information
                    </span>
                  }
                  span={2}
                >
                  <div style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {selectedBooking.cancellationRefund.refundable ? (
                      <div>
                        <Alert
                          type="success"
                          message={
                            <div>
                              <div style={{ marginBottom: '4px' }}>
                                <strong>Refund Processed</strong>
                              </div>
                              <div>Refund Amount: ₹{selectedBooking.cancellationRefund.refundAmount.toLocaleString()}</div>
                              <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                                ({selectedBooking.cancellationRefund.refundPercentage}% of ₹{selectedBooking.cancellationRefund.totalPaid.toLocaleString()})
                              </div>
                              {selectedBooking.cancellationRefund.cancelledAt && (
                                <div style={{ fontSize: '11px', color: '#6c757d', marginTop: '4px' }}>
                                  Cancelled on: {new Date(selectedBooking.cancellationRefund.cancelledAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                              )}
                            </div>
                          }
                        />
                      </div>
                    ) : (
                      <Alert
                        type="warning"
                        message="No refund was applicable for this cancellation as per policy."
                      />
                    )}
                  </div>
                </Descriptions.Item>
              )}

              {/* Contact Information */}
              {selectedBooking.contactInfo && (
                <Descriptions.Item 
                  label={
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                      <PhoneOutlined style={{ marginRight: '8px', color: '#FF6B35' }} />
                      Contact Information
                    </span>
                  }
                >
                  <div style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {selectedBooking.contactInfo.name && (
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Name:</strong> {selectedBooking.contactInfo.name}
                      </div>
                    )}
                    {selectedBooking.contactInfo.email && (
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Email:</strong> {selectedBooking.contactInfo.email}
                      </div>
                    )}
                    {selectedBooking.contactInfo.phone && (
                      <div>
                        <strong>Phone:</strong> {selectedBooking.contactInfo.phone}
                      </div>
                    )}
                  </div>
                </Descriptions.Item>
              )}

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <Descriptions.Item 
                  label={
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                      <InfoCircleOutlined style={{ marginRight: '8px', color: '#FF6B35' }} />
                      Special Requests
                    </span>
                  }
                >
                  <div style={{ fontFamily: 'Poppins, sans-serif', color: '#495057' }}>
                    {selectedBooking.specialRequests}
                  </div>
                </Descriptions.Item>
              )}

              {/* Booking Date */}
              <Descriptions.Item 
                label={
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>
                    <CalendarOutlined style={{ marginRight: '8px', color: '#FF6B35' }} />
                    Booking Date
                  </span>
                }
              >
                <div style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {new Date(selectedBooking.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </Descriptions.Item>
            </Descriptions>

            {/* Action Buttons */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              {selectedBooking.payment?.status === 'paid' && (
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    paymentService.downloadReceipt(selectedBooking._id)
                      .then(() => {
                        message.success('📄 Receipt downloaded successfully!');
                      })
                      .catch((err) => {
                        message.error('Failed to download receipt');
                        console.error(err);
                      });
                  }}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Download Receipt
                </Button>
              )}
              
              {canCancelBooking(selectedBooking) && (() => {
                const refundPreview = calculateRefundPreview(selectedBooking);
                return (
                  <Popconfirm
                    title={
                      <div style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                          Cancel Booking?
                        </div>
                        {refundPreview.refundable && refundPreview.refundAmount > 0 ? (
                          <div style={{ marginBottom: '8px' }}>
                            <Alert
                              type="info"
                              message={
                                <div>
                                  <div style={{ marginBottom: '4px' }}>
                                    <strong>Refund Information:</strong>
                                  </div>
                                  <div>Total Paid: ₹{refundPreview.totalPaid.toLocaleString()}</div>
                                  <div style={{ color: '#52c41a', fontWeight: '600' }}>
                                    Refund Amount: ₹{refundPreview.refundAmount.toLocaleString()} ({refundPreview.refundPercentage}%)
                                  </div>
                                  <div style={{ color: '#ff4d4f', fontSize: '12px' }}>
                                    Cancellation Fee: ₹{refundPreview.cancellationFee.toLocaleString()}
                                  </div>
                                  <div style={{ fontSize: '11px', marginTop: '4px', color: '#6c757d' }}>
                                    Days until travel: {refundPreview.daysUntilTravel}
                                  </div>
                                  <div style={{ fontSize: '11px', marginTop: '4px', color: '#6c757d' }}>
                                    Refund will be processed within 5-7 business days.
                                  </div>
                                </div>
                              }
                              style={{ marginBottom: '8px' }}
                            />
                          </div>
                        ) : (
                          <Alert
                            type="warning"
                            message={
                              <div>
                                <div style={{ marginBottom: '4px' }}>
                                  <strong>No Refund:</strong>
                                </div>
                                <div>This booking is not eligible for refund as per cancellation policy.</div>
                                {refundPreview.daysUntilTravel <= 0 && (
                                  <div style={{ fontSize: '11px', marginTop: '4px' }}>
                                    Travel date has passed or is today.
                                  </div>
                                )}
                              </div>
                            }
                            style={{ marginBottom: '8px' }}
                          />
                        )}
                        <div style={{ fontSize: '13px', color: '#6c757d' }}>
                          This action cannot be undone. Are you sure you want to proceed?
                        </div>
                      </div>
                    }
                    onConfirm={handleCancelBooking}
                    okText="Yes, Cancel Booking"
                    cancelText="Keep Booking"
                    okButtonProps={{ danger: true, loading: cancelling }}
                    overlayStyle={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <Button
                      danger
                      icon={<CloseOutlined />}
                      loading={cancelling}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Cancel Booking
                    </Button>
                  </Popconfirm>
                );
              })()}
              
              <Button
                onClick={() => {
                  setDetailModalVisible(false);
                  setSelectedBooking(null);
                }}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
};

export default UserDashboard;

