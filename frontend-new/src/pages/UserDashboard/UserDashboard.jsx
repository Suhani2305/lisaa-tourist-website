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
  Alert,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Rate
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
  ShareAltOutlined,
  FacebookOutlined,
  TwitterOutlined,
  WhatsAppOutlined,
  EditOutlined,
  PlusOutlined,
  MinusOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { authService, bookingService, paymentService, wishlistService, reviewService } from '../../services';
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
  const [modificationModalVisible, setModificationModalVisible] = useState(false);
  const [modificationType, setModificationType] = useState(null);
  const [modificationForm] = Form.useForm();
  const [submittingModification, setSubmittingModification] = useState(false);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchWishlist();
    fetchCompletedBookings();
    fetchUserReviews();
  }, []);

  const fetchCompletedBookings = async () => {
    try {
      const bookingsData = await bookingService.getMyBookings();
      // Filter only completed bookings
      const completed = Array.isArray(bookingsData) 
        ? bookingsData.filter(booking => booking.status === 'completed')
        : [];
      setCompletedBookings(completed);
    } catch (error) {
      console.error('Error fetching completed bookings:', error);
      setCompletedBookings([]);
    }
  };

  const fetchUserReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviewsData = await reviewService.getUserReviews();
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBookingForReview(booking);
    setReviewModalVisible(true);
    reviewForm.resetFields();
    reviewForm.setFieldsValue({
      bookingId: booking._id
    });
  };

  const handleSubmitReview = async (values) => {
    if (!selectedBookingForReview) return;

    try {
      setReviewSubmitting(true);
      
      const reviewData = {
        tourId: selectedBookingForReview.tour?._id || selectedBookingForReview.tour,
        bookingId: values.bookingId,
        rating: values.rating,
        title: values.title,
        comment: values.comment,
        images: values.images || []
      };

      const response = await reviewService.createReview(reviewData);

      if (response.review) {
        message.success('Review submitted successfully!');
        setReviewModalVisible(false);
        reviewForm.resetFields();
        setSelectedBookingForReview(null);
        // Refresh reviews and completed bookings
        await fetchUserReviews();
        await fetchCompletedBookings();
      } else {
        message.error(response.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit review. Please try again.';
      message.error(errorMessage);
    } finally {
      setReviewSubmitting(false);
    }
  };

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

  const handleShareBooking = (platform) => {
    if (!selectedBooking) return;

    const bookingTitle = selectedBooking.tour?.title || 'My Booking';
    const bookingDate = selectedBooking.travelDates?.startDate 
      ? new Date(selectedBooking.travelDates.startDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : 'TBA';
    const shareText = `I just booked "${bookingTitle}" for ${bookingDate}! Check out this amazing tour package.`;
    const shareUrl = window.location.origin + `/package/${selectedBooking.tour?._id || ''}`;

    let shareLink = '';

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        message.success('Booking link copied to clipboard!');
        return;
      default:
        return;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
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
                key: 'reviews',
                label: (
                  <span>
                    <EditOutlined style={{ color: '#FF6B35' }} />
                    My Reviews
                  </span>
                ),
                children: (
                  <>
                    {reviewsLoading ? (
                      <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <>
                        <div style={{ marginBottom: '24px' }}>
                          <Title level={4} style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Completed Journeys - Leave a Review
                          </Title>
                          <TypographyText type="secondary" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Share your experience for completed bookings
                          </TypographyText>
                        </div>

                        {completedBookings && completedBookings.length > 0 ? (
                          <Row gutter={[16, 16]}>
                            {completedBookings.map((booking) => {
                              const tour = booking.tour;
                              const hasReview = reviews.some(
                                review => (review.booking?._id || review.booking) === booking._id
                              );
                              
                              return (
                                <Col xs={24} md={12} key={booking._id}>
                                  <Card
                                    hoverable
                                    style={{ borderRadius: '8px', border: hasReview ? '2px solid #52c41a' : '1px solid #d9d9d9' }}
                                  >
                                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Title level={5} style={{ margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                                          {tour?.title || 'Tour Package'}
                                        </Title>
                                        {hasReview && (
                                          <Tag color="green" icon={<CheckCircleOutlined />}>
                                            Reviewed
                                          </Tag>
                                        )}
                                      </div>
                                      
                                      <Divider style={{ margin: '12px 0' }} />
                                      
                                      <TypographyText style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        <CalendarOutlined style={{ marginRight: '8px' }} />
                                        {new Date(booking.travelDates?.startDate).toLocaleDateString()} - {new Date(booking.travelDates?.endDate).toLocaleDateString()}
                                      </TypographyText>
                                      
                                      <TypographyText style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        <EnvironmentOutlined style={{ marginRight: '8px' }} />
                                        {tour?.destination || 'N/A'}
                                      </TypographyText>
                                      
                                      <TypographyText style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        Booking #{booking.bookingNumber || booking._id.slice(-6)}
                                      </TypographyText>
                                      
                                      <Button 
                                        type={hasReview ? "default" : "primary"}
                                        block
                                        icon={hasReview ? <EditOutlined /> : <EditOutlined />}
                                        onClick={() => {
                                          if (hasReview) {
                                            message.info('You have already reviewed this booking');
                                          } else {
                                            handleOpenReviewModal(booking);
                                          }
                                        }}
                                        style={{ 
                                          marginTop: '12px', 
                                          fontFamily: 'Poppins, sans-serif',
                                          backgroundColor: hasReview ? '#f0f0f0' : '#FF6B35',
                                          borderColor: hasReview ? '#d9d9d9' : '#FF6B35',
                                          color: hasReview ? '#595959' : 'white'
                                        }}
                                      >
                                        {hasReview ? 'Update Review' : 'Write a Review'}
                                      </Button>
                                    </Space>
                                  </Card>
                                </Col>
                              );
                            })}
                          </Row>
                        ) : (
                          <Empty
                            description="No completed journeys yet"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          >
                            <TypographyText type="secondary" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              Complete a journey to leave a review
                            </TypographyText>
                          </Empty>
                        )}

                        {reviews && reviews.length > 0 && (
                          <>
                            <Divider style={{ margin: '32px 0' }} />
                            <div style={{ marginBottom: '24px' }}>
                              <Title level={4} style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Your Reviews
                              </Title>
                            </div>
                            <Row gutter={[16, 16]}>
                              {reviews.map((review) => {
                                const tour = review.tour;
                                return (
                                  <Col xs={24} key={review._id}>
                                    <Card style={{ borderRadius: '8px' }}>
                                      <Space direction="vertical" style={{ width: '100%' }} size="small">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                          <div style={{ flex: 1 }}>
                                            <Title level={5} style={{ margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                                              {tour?.title || 'Tour Package'}
                                            </Title>
                                            <TypographyText type="secondary" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                              {tour?.destination || 'N/A'}
                                            </TypographyText>
                                          </div>
                                          <Tag color="green" icon={<CheckCircleOutlined />}>
                                            Reviewed
                                          </Tag>
                                        </div>
                                        
                                        <Divider style={{ margin: '12px 0' }} />
                                        
                                        <div>
                                          <TypographyText strong style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            {review.title}
                                          </TypographyText>
                                          <div style={{ marginTop: '8px' }}>
                                            <Rate disabled defaultValue={review.rating} style={{ fontSize: '14px' }} />
                                          </div>
                                          <Paragraph style={{ marginTop: '8px', fontFamily: 'Poppins, sans-serif' }}>
                                            {review.comment}
                                          </Paragraph>
                                          <TypographyText type="secondary" style={{ fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                                            Reviewed on {new Date(review.createdAt).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric'
                                            })}
                                          </TypographyText>
                                        </div>
                                        
                                        <Button 
                                          type="link"
                                          onClick={() => navigate(`/package/${tour?._id || tour}`)}
                                          style={{ padding: 0, fontFamily: 'Poppins, sans-serif' }}
                                        >
                                          View Package
                                        </Button>
                                      </Space>
                                    </Card>
                                  </Col>
                                );
                              })}
                            </Row>
                          </>
                        )}
                      </>
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
                  {Array.isArray(selectedBooking.travelers) && selectedBooking.travelers.length > 0 ? (
                    <div>
                      {selectedBooking.travelers.map((traveler, index) => (
                        <div key={index} style={{ marginBottom: '8px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong>{traveler.name}</strong>
                              <Tag color="blue" style={{ marginLeft: '8px' }}>{traveler.type}</Tag>
                              <span style={{ marginLeft: '8px', color: '#6c757d' }}>Age: {traveler.age}</span>
                              <span style={{ marginLeft: '8px', color: '#6c757d' }}>
                                {traveler.gender === 'male' ? <ManOutlined /> : traveler.gender === 'female' ? <WomanOutlined /> : <UserOutlined />}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedBooking.travelers?.adults ? (
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

            {/* Share Booking Section */}
            <Divider style={{ margin: '24px 0' }}>Share Your Booking</Divider>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '16px'
            }}>
              <Button
                type="primary"
                icon={<FacebookOutlined />}
                onClick={() => handleShareBooking('facebook')}
                style={{
                  backgroundColor: '#1877F2',
                  borderColor: '#1877F2',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Share on Facebook
              </Button>
              <Button
                type="primary"
                icon={<TwitterOutlined />}
                onClick={() => handleShareBooking('twitter')}
                style={{
                  backgroundColor: '#1DA1F2',
                  borderColor: '#1DA1F2',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Share on Twitter
              </Button>
              <Button
                type="primary"
                icon={<WhatsAppOutlined />}
                onClick={() => handleShareBooking('whatsapp')}
                style={{
                  backgroundColor: '#25D366',
                  borderColor: '#25D366',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Share on WhatsApp
              </Button>
              <Button
                icon={<ShareAltOutlined />}
                onClick={() => handleShareBooking('copy')}
                style={{
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Copy Link
              </Button>
            </div>

            {/* Modification Requests Section */}
            {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
              <>
                <Divider style={{ margin: '24px 0' }}>Request Modifications</Divider>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <Button
                    icon={<CalendarOutlined />}
                    onClick={() => {
                      setModificationType('date_change');
                      modificationForm.setFieldsValue({
                        newStartDate: selectedBooking.travelDates?.startDate 
                          ? (dayjs(selectedBooking.travelDates.startDate).isValid() ? dayjs(selectedBooking.travelDates.startDate) : null)
                          : null,
                        newEndDate: selectedBooking.travelDates?.endDate 
                          ? (dayjs(selectedBooking.travelDates.endDate).isValid() ? dayjs(selectedBooking.travelDates.endDate) : null)
                          : null
                      });
                      setModificationModalVisible(true);
                    }}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Change Dates
                  </Button>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setModificationType('traveler_add');
                      modificationForm.resetFields();
                      setModificationModalVisible(true);
                    }}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Add Traveler
                  </Button>
                  {Array.isArray(selectedBooking.travelers) && selectedBooking.travelers.length > 0 && (
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() => {
                        setModificationType('traveler_remove');
                        modificationForm.resetFields();
                        modificationForm.setFieldsValue({
                          travelerToRemove: selectedBooking.travelers[0]._id || selectedBooking.travelers[0].id
                        });
                        setModificationModalVisible(true);
                      }}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Remove Traveler
                    </Button>
                  )}
                  <Button
                    icon={<FileTextOutlined />}
                    onClick={() => {
                      setModificationType('special_request');
                      modificationForm.setFieldsValue({
                        newSpecialRequest: selectedBooking.specialRequests || ''
                      });
                      setModificationModalVisible(true);
                    }}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Update Requests
                  </Button>
                </div>
              </>
            )}

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

      {/* Modification Request Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <EditOutlined style={{ fontSize: '24px', color: '#FF6B35' }} />
            <span style={{ fontSize: '20px', fontFamily: 'Poppins, sans-serif' }}>
              {modificationType === 'date_change' && 'Request Date Change'}
              {modificationType === 'traveler_add' && 'Add Traveler'}
              {modificationType === 'traveler_remove' && 'Remove Traveler'}
              {modificationType === 'special_request' && 'Update Special Requests'}
            </span>
          </div>
        }
        open={modificationModalVisible}
        onCancel={() => {
          setModificationModalVisible(false);
          setModificationType(null);
          modificationForm.resetFields();
        }}
        onOk={async () => {
          try {
            const values = await modificationForm.validateFields();
            setSubmittingModification(true);

            let requestDetails = {};
            let type = modificationType;

            if (type === 'date_change') {
              requestDetails = {
                newStartDate: dayjs.isDayjs(values.newStartDate) ? values.newStartDate.toISOString() : values.newStartDate,
                newEndDate: dayjs.isDayjs(values.newEndDate) ? values.newEndDate.toISOString() : values.newEndDate,
                reason: values.reason
              };
            } else if (type === 'traveler_add') {
              requestDetails = {
                travelerToAdd: {
                  name: values.name,
                  age: values.age,
                  type: values.type,
                  gender: values.gender
                },
                reason: values.reason
              };
            } else if (type === 'traveler_remove') {
              requestDetails = {
                travelerToRemove: values.travelerToRemove,
                reason: values.reason
              };
            } else if (type === 'special_request') {
              // Special requests can be updated directly without admin approval
              await bookingService.updateSpecialRequests(selectedBooking._id, values.newSpecialRequest);
              message.success('Special requests updated successfully!');
              setModificationModalVisible(false);
              setModificationType(null);
              modificationForm.resetFields();
              fetchUserData(); // Refresh bookings
              return;
            }

            await bookingService.requestModification(selectedBooking._id, {
              type,
              requestDetails,
              reason: values.reason
            });

            message.success('Modification request submitted successfully! Admin will review it shortly.');
            setModificationModalVisible(false);
            setModificationType(null);
            modificationForm.resetFields();
            fetchUserData(); // Refresh bookings
          } catch (error) {
            console.error('Failed to submit modification request:', error);
            message.error(error.message || 'Failed to submit modification request');
          } finally {
            setSubmittingModification(false);
          }
        }}
        okText="Submit Request"
        cancelText="Cancel"
        okButtonProps={{ loading: submittingModification }}
        width={600}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        <Form
          form={modificationForm}
          layout="vertical"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {modificationType === 'date_change' && (
            <>
              <Form.Item
                name="newStartDate"
                label="New Start Date"
                rules={[{ required: true, message: 'Please select new start date' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
              <Form.Item
                name="newEndDate"
                label="New End Date"
                rules={[{ required: true, message: 'Please select new end date' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
              <Form.Item
                name="reason"
                label="Reason for Date Change"
                rules={[{ required: true, message: 'Please provide a reason' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Please explain why you need to change the travel dates..."
                />
              </Form.Item>
            </>
          )}

          {modificationType === 'traveler_add' && (
            <>
              <Form.Item
                name="name"
                label="Traveler Name"
                rules={[{ required: true, message: 'Please enter traveler name' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="age"
                    label="Age"
                    rules={[{ required: true, message: 'Please enter age' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      max={120}
                      placeholder="Age"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="type"
                    label="Type"
                    rules={[{ required: true, message: 'Please select type' }]}
                  >
                    <Select placeholder="Select type">
                      <Select.Option value="adult">Adult</Select.Option>
                      <Select.Option value="child">Child</Select.Option>
                      <Select.Option value="infant">Infant</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Select placeholder="Select gender">
                  <Select.Option value="male">Male</Select.Option>
                  <Select.Option value="female">Female</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
              </Form.Item>
              <Alert
                message="Note"
                description="Adding a traveler may require additional payment. The amount will be calculated and you'll be notified."
                type="info"
                style={{ marginBottom: '16px' }}
              />
              <Form.Item
                name="reason"
                label="Reason (Optional)"
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Any additional information..."
                />
              </Form.Item>
            </>
          )}

          {modificationType === 'traveler_remove' && (
            <>
              <Form.Item
                name="travelerToRemove"
                label="Select Traveler to Remove"
                rules={[{ required: true, message: 'Please select a traveler' }]}
              >
                <Select placeholder="Select traveler">
                  {Array.isArray(selectedBooking.travelers) && selectedBooking.travelers.map((traveler, index) => (
                    <Select.Option key={traveler._id || traveler.id || index} value={traveler._id || traveler.id}>
                      {traveler.name} ({traveler.type}, Age: {traveler.age})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Alert
                message="Note"
                description="Removing a traveler may result in a partial refund. The refund amount will be calculated based on our cancellation policy."
                type="info"
                style={{ marginBottom: '16px' }}
              />
              <Form.Item
                name="reason"
                label="Reason for Removal"
                rules={[{ required: true, message: 'Please provide a reason' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Please explain why you need to remove this traveler..."
                />
              </Form.Item>
            </>
          )}

          {modificationType === 'special_request' && (
            <>
              <Form.Item
                name="newSpecialRequest"
                label="Special Requests"
                rules={[{ max: 500, message: 'Special requests cannot exceed 500 characters' }]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder="Enter any special requests or requirements (e.g., dietary restrictions, accessibility needs, etc.)"
                  maxLength={500}
                  showCount
                />
              </Form.Item>
              <Alert
                message="Note"
                description="Special requests are updated immediately without admin approval."
                type="info"
              />
            </>
          )}
        </Form>
      </Modal>

      {/* Review Submission Modal */}
      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <EditOutlined style={{ fontSize: '24px', color: '#FF6B35', marginBottom: '8px' }} />
            <h3 style={{ margin: '8px 0 0 0', fontFamily: 'Poppins, sans-serif' }}>Write a Review</h3>
          </div>
        }
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          reviewForm.resetFields();
          setSelectedBookingForReview(null);
        }}
        footer={null}
        width={600}
      >
        {selectedBookingForReview && (
          <Form
            form={reviewForm}
            layout="vertical"
            onFinish={handleSubmitReview}
          >
            <Card style={{ marginBottom: '16px', backgroundColor: '#f8f9fa' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontFamily: 'Poppins, sans-serif' }}>Reviewing Package</h4>
              <div style={{ fontSize: '14px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>
                <div><strong>{selectedBookingForReview.tour?.title || 'Tour Package'}</strong></div>
                <div>📍 {selectedBookingForReview.tour?.destination || 'N/A'}</div>
                <div>📅 Booking #{selectedBookingForReview.bookingNumber || selectedBookingForReview._id.slice(-6)}</div>
              </div>
            </Card>

            <Form.Item
              name="bookingId"
              hidden
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: 'Please provide a rating' }]}
            >
              <Rate style={{ fontSize: '24px' }} />
            </Form.Item>

            <Form.Item
              name="title"
              label="Review Title"
              rules={[
                { required: true, message: 'Please enter a review title' },
                { max: 100, message: 'Title cannot exceed 100 characters' }
              ]}
            >
              <Input
                placeholder="Give your review a title"
                maxLength={100}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="comment"
              label="Your Review"
              rules={[
                { required: true, message: 'Please write your review' },
                { max: 1000, message: 'Review cannot exceed 1000 characters' }
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder="Share your experience with this package..."
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={reviewSubmitting}
                size="large"
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: '#FF6B35',
                  borderColor: '#FF6B35',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <EditOutlined /> Submit Review
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', fontSize: '11px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>
              By submitting, you agree that your review is based on genuine experience
            </div>
          </Form>
        )}
      </Modal>

      <Footer />
    </div>
  );
};

export default UserDashboard;

