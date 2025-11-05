import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tourService, paymentService, authService, reviewService, bookingService, wishlistService, offerService } from '../../services';
import { Spin, message, Tabs, Timeline, Tag, Card, Row, Col, Modal, Form, Input, InputNumber, DatePicker, Button, Collapse, Rate, Avatar, Empty, Divider, Select, Alert, Typography } from 'antd';
import Header from '../landingpage/components/Header';
import Footer from '../landingpage/components/Footer';
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
  ArrowLeftOutlined,
  MessageOutlined,
  EditOutlined,
  LikeOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons';

const { Panel } = Collapse;
const { Option } = Select;
const { Text: TypographyText } = Typography;

const PackageDetail = () => {
  const navigate = useNavigate();
  const { packageSlug } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [form] = Form.useForm();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewForm] = Form.useForm();
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  
  // Watch form values for price calculation (must be at top level, before any returns)
  const adultsCount = Form.useWatch('adults', form) || 1;
  const childrenCount = Form.useWatch('children', form) || 0;


  const calculateBaseTotal = () => {
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
    
    return (adultsCount * adultPrice) + (childrenCount * childPrice);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError('');
      
      // Validate against base total (before coupon discount)
      const baseTotal = calculateBaseTotal();
      const user = authService.isAuthenticated() ? await authService.getProfile() : null;
      
      const response = await offerService.validateOffer(
        couponCode.trim().toUpperCase(),
        baseTotal,
        user?._id || null,
        packageData?._id || null
      );
      
      if (response.valid && response.offer) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          offer: response.offer
        });
        message.success(`Coupon "${couponCode.trim().toUpperCase()}" applied successfully!`);
        setCouponCode('');
      } else {
        setCouponError('Invalid coupon code');
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      setCouponError(error.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    message.info('Coupon removed');
  };
  
  useEffect(() => {
    fetchPackageDetails();
  }, [packageSlug]);

  useEffect(() => {
    if (packageData && packageData._id) {
      fetchReviews();
      checkWishlistStatus();
    }
  }, [packageData]);

  const checkWishlistStatus = async () => {
    if (!authService.isAuthenticated() || !packageData?._id) {
      setIsInWishlist(false);
      return;
    }

    try {
      const status = await wishlistService.checkWishlist(packageData._id);
      setIsInWishlist(status);
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
      setIsInWishlist(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!authService.isAuthenticated()) {
      message.warning('Please login to add packages to wishlist');
      navigate('/login');
      return;
    }

    if (!packageData?._id) {
      message.error('Package information not available');
      return;
    }

    try {
      setWishlistLoading(true);
      
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(packageData._id);
        setIsInWishlist(false);
        message.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(packageData._id);
        setIsInWishlist(true);
        message.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      message.error(error.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

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

  const fetchReviews = async () => {
    if (!packageData || !packageData._id) return;
    
    try {
      setReviewsLoading(true);
      const response = await reviewService.getTourReviews(packageData._id);
      
      if (response.reviews) {
        setReviews(response.reviews);
      }
      
      if (response.averageRating) {
        setAverageRating(response.averageRating.average || 0);
        setReviewCount(response.averageRating.count || 0);
      } else if (response.total) {
        setReviewCount(response.total);
      }
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      // Don't show error message - reviews are optional
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    if (!authService.isAuthenticated()) {
      setUserBookings([]);
      return;
    }

    try {
      setBookingsLoading(true);
      const bookings = await bookingService.getMyBookings();
      
      // Filter bookings for this tour only
      const tourBookings = Array.isArray(bookings) 
        ? bookings.filter(booking => {
            // Check if booking.tour is an object with _id or string
            const tourId = booking.tour?._id || booking.tour;
            return tourId === packageData._id || tourId === packageData._id?.toString();
          })
        : [];
      
      setUserBookings(tourBookings);
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      setUserBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleSubmitReview = async (values) => {
    try {
      // Check if user is logged in
      if (!authService.isAuthenticated()) {
        message.error('Please login to submit a review');
        navigate('/login');
        return;
      }

      // Check if booking is required
      if (!values.bookingId && userBookings.length > 0) {
        message.error('Please select a booking for this review');
        return;
      }

      setReviewSubmitting(true);
      
      const reviewData = {
        tourId: packageData._id,
        bookingId: values.bookingId || null,
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
        // Refresh reviews
        await fetchReviews();
      } else {
        message.error(response.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      message.error(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleReviewModalOpen = () => {
    if (!authService.isAuthenticated()) {
      message.error('Please login to submit a review');
      navigate('/login');
      return;
    }
    setReviewModalVisible(true);
    fetchUserBookings();
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
      
      const baseTotal = (adults * adultPrice) + (children * childPrice);
      
      // Apply coupon discount if available
      let totalAmount = baseTotal;
      let couponDiscount = 0;
      let appliedCouponCode = null;
      let appliedOfferId = null;
      
      if (appliedCoupon && appliedCoupon.offer) {
        couponDiscount = appliedCoupon.offer.discount || 0;
        totalAmount = Math.max(0, baseTotal - couponDiscount);
        appliedCouponCode = appliedCoupon.code;
        appliedOfferId = appliedCoupon.offer.id;
      }

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
        customerPhone: values.phone || user.phone,
        couponCode: appliedCouponCode,
        couponDiscount: couponDiscount,
        baseAmount: baseTotal
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
              },
              couponCode: appliedCouponCode,
              couponDiscount: couponDiscount,
              baseAmount: baseTotal
            };

            const verifyResponse = await paymentService.verifyPayment(verificationData);

            if (verifyResponse.success) {
              message.success({
                content: '🎉 Payment successful! Your booking is confirmed! Check your email, SMS & WhatsApp for confirmation.',
                duration: 5
              });
              setBookingModalVisible(false);
              form.resetFields();
              
              // Download receipt if available
              if (verifyResponse.receiptUrl || verifyResponse.bookingId) {
                setTimeout(() => {
                  paymentService.downloadReceipt(verifyResponse.bookingId)
                    .then(() => {
                      message.success('📄 Receipt downloaded successfully!');
                    })
                    .catch((err) => {
                      console.warn('Receipt download failed:', err);
                      // Don't show error - receipt download is optional
                    });
                }, 1000);
              }
              
              // Redirect to user dashboard
              setTimeout(() => {
                navigate('/user-dashboard');
              }, 3000);
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
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px' }}>
        <Spin size="large" />
          <div style={{ color: '#6c757d', fontSize: '16px', fontFamily: 'Poppins, sans-serif' }}>Loading package details...</div>
      </div>
        <Footer />
      </>
    );
  }

  if (!packageData) {
    return (
      <>
        <Header />
      <div style={{ 
          minHeight: '60vh', 
          backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '40px'
      }}>
          <h1 style={{ color: '#dc3545', marginBottom: '16px', fontFamily: 'Poppins, sans-serif' }}>Package Not Found</h1>
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
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f15a29';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#FF6B35';
              e.target.style.transform = 'translateY(0)';
          }}
        >
          Back to Packages
        </button>
      </div>
        <Footer />
      </>
    );
  }

  const isMobile = window.innerWidth <= 768;
  const isSmall = window.innerWidth <= 480;

  return (
    <>
      <Header />
      
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        {/* Main Content */}
      <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isSmall ? '24px 16px' : isMobile ? '30px 20px' : '40px 120px'
        }}>
          {/* Breadcrumb & Title */}
        <div style={{
            fontSize: isSmall ? '11px' : isMobile ? '12px' : '14px', 
            color: '#6c757d',
            marginBottom: '12px',
            fontFamily: 'Poppins, sans-serif'
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
            <span 
              onClick={() => navigate('/package')}
              style={{ 
                cursor: 'pointer',
                color: '#6c757d',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
            >
              Tours
            </span>
            {packageData && (
              <>
                <span style={{ margin: '0 8px', color: '#6c757d' }}> &gt; </span>
                <span style={{ color: '#212529' }}>{packageData.title}</span>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h1 style={{ 
              fontSize: isSmall ? '1.2rem' : isMobile ? '1.5rem' : '2rem', 
              fontWeight: '700', 
              color: '#212529',
              margin: 0,
              fontFamily: 'Poppins, sans-serif',
              lineHeight: '1.3',
              flex: 1
            }}>
              {packageData.title}
            </h1>
            <Button
              type="default"
              icon={isInWishlist ? <HeartFilled /> : <HeartOutlined />}
              onClick={handleWishlistToggle}
              loading={wishlistLoading}
              size="large"
              style={{
                borderColor: isInWishlist ? '#FF6B35' : '#d9d9d9',
                color: isInWishlist ? '#FF6B35' : '#595959',
                backgroundColor: isInWishlist ? '#fff5f5' : '#fff',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
                height: isMobile ? '40px' : '48px',
                padding: isMobile ? '0 16px' : '0 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isInWishlist) {
                  e.currentTarget.style.borderColor = '#FF6B35';
                  e.currentTarget.style.color = '#FF6B35';
                }
              }}
              onMouseLeave={(e) => {
                if (!isInWishlist) {
                  e.currentTarget.style.borderColor = '#d9d9d9';
                  e.currentTarget.style.color = '#595959';
                }
              }}
            >
              {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
          gap: isMobile ? '20px' : '30px'
        }}>
          {/* Left Content */}
          <div>
            {/* Quick Info Bar */}
            <Card style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <EnvironmentOutlined style={{ fontSize: '24px', color: '#FF6B35', marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>Destination</div>
                    <div style={{ fontWeight: '600', fontSize: '14px', fontFamily: 'Poppins, sans-serif', color: '#212529' }}>{packageData.destination}</div>
                </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <ClockCircleOutlined style={{ fontSize: '24px', color: '#FF6B35', marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>Duration</div>
                    <div style={{ fontWeight: '600', fontSize: '14px', fontFamily: 'Poppins, sans-serif', color: '#212529' }}>
                      {packageData.duration?.days}D/{packageData.duration?.nights}N
                </div>
              </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <UserOutlined style={{ fontSize: '24px', color: '#FF6B35', marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>Group Size</div>
                    <div style={{ fontWeight: '600', fontSize: '14px', fontFamily: 'Poppins, sans-serif', color: '#212529' }}>
                      Max {packageData.groupSize?.max || 20}
              </div>
            </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <StarFilled style={{ fontSize: '24px', color: '#ffc107', marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>Rating</div>
                    <div style={{ fontWeight: '600', fontSize: '14px', fontFamily: 'Poppins, sans-serif', color: '#212529' }}>
                      {(averageRating || packageData.rating?.average || 0).toFixed(1)}/5
                      {reviewCount > 0 && (
                        <span style={{ fontSize: '11px', color: '#6c757d', marginLeft: '4px' }}>
                          ({reviewCount})
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Image Gallery */}
            <Card style={{ marginBottom: '24px', borderRadius: '12px', padding: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
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
                  WebkitImageRendering: 'high-quality',
                  borderRadius: '12px 12px 0 0'
                  }}
                />
              {packageData.images && packageData.images.length > 1 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${isSmall ? 3 : 4}, 1fr)`,
                  gap: isSmall ? '8px' : '12px',
                  padding: '16px'
                }}>
                  {packageData.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedImage === idx ? '3px solid #FF6B35' : '3px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedImage !== idx) {
                          e.currentTarget.style.borderColor = '#ff6b3590';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedImage !== idx) {
                          e.currentTarget.style.borderColor = 'transparent';
                        }
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
            </Card>

            {/* Tabs for Details */}
            <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Tabs 
                defaultActiveKey="1" 
                size="large"
                items={[
                  {
                    key: '1',
                    label: '📝 Overview',
                    children: (
                  <div style={{ padding: '16px 0' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#212529', fontFamily: 'Poppins, sans-serif' }}>
                      Package Description
                    </h3>
                    <p style={{ fontSize: '15px', color: '#495057', lineHeight: '1.7', fontFamily: 'Poppins, sans-serif' }}>
                      {packageData.description}
                    </p>

                    {packageData.highlights && packageData.highlights.length > 0 && (
                      <>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '12px', color: '#212529', fontFamily: 'Poppins, sans-serif' }}>
                          ✨ Package Highlights
                        </h3>
                        <Row gutter={[12, 12]}>
                          {packageData.highlights.map((highlight, index) => (
                            <Col xs={24} sm={12} key={index}>
                  <div style={{
                    display: 'flex',
                                alignItems: 'flex-start',
                    gap: '8px',
                                padding: '12px',
                  backgroundColor: '#f8f9fa',
                                borderRadius: '8px'
                              }}>
                                <StarFilled style={{ color: '#FF6B35', marginTop: '4px', flexShrink: 0 }} />
                                <span style={{ fontSize: '14px', color: '#495057', fontFamily: 'Poppins, sans-serif' }}>{highlight}</span>
                  </div>
                            </Col>
                          ))}
                        </Row>
                      </>
                    )}
                      </div>
                    ),
                  },
                  {
                    key: '2',
                    label: '📅 Itinerary',
                    children: (
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
                              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#212529', marginBottom: '8px', fontFamily: 'Poppins, sans-serif' }}>
                                Day {day.day}: {day.title}
                              </h4>
                              <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '12px', lineHeight: '1.6', fontFamily: 'Poppins, sans-serif' }}>
                                {day.description}
                              </p>

                              {day.activities && day.activities.length > 0 && (
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#495057', marginBottom: '8px', fontFamily: 'Poppins, sans-serif' }}>
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
                                      <span style={{ fontSize: '13px', color: '#495057', fontFamily: 'Poppins, sans-serif' }}>{activity}</span>
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
                    ),
                  },
                  {
                    key: '4',
                    label: '⭐ Reviews',
                    children: (
                      <div style={{ padding: '16px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#212529', fontFamily: 'Poppins, sans-serif' }}>
                          Customer Reviews
                        </h3>
                        {reviewCount > 0 && (
                          <div style={{ fontSize: '14px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>
                            {averageRating.toFixed(1)} out of 5 ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                          </div>
                        )}
                      </div>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={handleReviewModalOpen}
                        style={{
                          backgroundColor: '#FF6B35',
                          borderColor: '#FF6B35',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        Write a Review
                      </Button>
                    </div>

                    {reviewsLoading ? (
                      <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" />
                      </div>
                    ) : reviews.length === 0 ? (
                      <Empty
                        description={
                          <span style={{ fontFamily: 'Poppins, sans-serif', color: '#6c757d' }}>
                            No reviews yet. Be the first to review this package!
                          </span>
                        }
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      >
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={handleReviewModalOpen}
                          style={{
                            backgroundColor: '#FF6B35',
                            borderColor: '#FF6B35',
                            fontFamily: 'Poppins, sans-serif'
                          }}
                        >
                          Write the First Review
                        </Button>
                      </Empty>
                    ) : (
                      <div>
                        {reviews.map((review, index) => (
                          <Card
                            key={review._id || index}
                            style={{
                              marginBottom: '16px',
                              borderRadius: '12px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}
                          >
                            <div style={{ display: 'flex', gap: '16px' }}>
                              <Avatar
                                size={48}
                                src={review.user?.profileImage}
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#FF6B35', flexShrink: 0 }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                  <div>
                                    <div style={{ fontWeight: '600', fontSize: '16px', color: '#212529', fontFamily: 'Poppins, sans-serif', marginBottom: '4px' }}>
                                      {review.user?.name || 'Anonymous'}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                      <Rate disabled defaultValue={review.rating} style={{ fontSize: '14px' }} />
                                      <span style={{ fontSize: '12px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>
                                        {new Date(review.createdAt || review.updatedAt).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                  {review.isVerified && (
                                    <Tag color="green" icon={<CheckCircleOutlined />}>
                                      Verified
                                    </Tag>
                                  )}
                                </div>
                                {review.title && (
                                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#212529', marginBottom: '8px', fontFamily: 'Poppins, sans-serif' }}>
                                    {review.title}
                                  </h4>
                                )}
                                <p style={{ fontSize: '14px', color: '#495057', lineHeight: '1.6', fontFamily: 'Poppins, sans-serif', marginBottom: '12px' }}>
                                  {review.comment}
                                </p>
                                {review.images && review.images.length > 0 && (
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                    {review.images.map((img, idx) => (
                                      <img
                                        key={idx}
                                        src={img.url}
                                        alt={img.alt || 'Review image'}
                                        style={{
                                          width: '80px',
                                          height: '80px',
                                          objectFit: 'cover',
                                          borderRadius: '8px',
                                          cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                          // Could open in a modal for full view
                                          window.open(img.url, '_blank');
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}
                                {review.response && review.response.text && (
                                  <div style={{
                                    marginTop: '12px',
                                    padding: '12px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    borderLeft: '3px solid #FF6B35'
                                  }}>
                                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#FF6B35', marginBottom: '4px', fontFamily: 'Poppins, sans-serif' }}>
                                      Response from Lisaa Tours & Travels:
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#495057', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                                      {review.response.text}
                                    </p>
                                  </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                                  <Button
                                    type="text"
                                    icon={<LikeOutlined />}
                                    size="small"
                                    style={{ color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}
                                  >
                                    Helpful ({review.helpful?.count || 0})
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                      </div>
                    ),
                  },
                  {
                    key: '3',
                    label: '✅ Inclusions',
                    children: (
                      <div style={{ padding: '16px 0' }}>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} md={12}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#28a745', fontFamily: 'Poppins, sans-serif' }}>
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
                                <span style={{ fontSize: '14px', color: '#155724', fontFamily: 'Poppins, sans-serif' }}>{item}</span>
                      </div>
                            ))}
                </div>
                        ) : (
                          <p style={{ color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>Details will be shared upon inquiry</p>
                        )}
                      </Col>

                      <Col xs={24} md={12}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#dc3545', fontFamily: 'Poppins, sans-serif' }}>
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
                                <span style={{ fontSize: '14px', color: '#721c24', fontFamily: 'Poppins, sans-serif' }}>{item}</span>
                          </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>Details will be shared upon inquiry</p>
                        )}
                      </Col>
                    </Row>
                      </div>
                    ),
                  }
                ]}
              />
            </Card>
          </div>

          {/* Right Sidebar - Booking Card */}
          <div>
            <Card style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              position: isMobile ? 'relative' : 'sticky',
              top: isMobile ? '0' : '100px',
              fontFamily: 'Poppins, sans-serif'
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                paddingBottom: '20px'
              }}>
                <Tag color={packageData.category === 'spiritual' ? 'blue' : packageData.category === 'adventure' ? 'red' : 'orange'} style={{ marginBottom: '12px' }}>
                  {packageData.category?.toUpperCase()}
                </Tag>
                <div style={{
                  fontSize: '14px',
                  color: '#6c757d',
                  marginBottom: '8px',
                  fontFamily: 'Poppins, sans-serif'
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
                          textDecoration: 'line-through',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          ₹{priceInfo.originalPrice.toLocaleString()}
                        </div>
                        <div style={{
                          fontSize: '2.2rem',
                          fontWeight: '700',
                          color: '#FF6B35',
                          fontFamily: 'Poppins, sans-serif'
                        }}>
                          ₹{priceInfo.finalPrice.toLocaleString()}
                        </div>
                      </>
                    ) : (
                      <div style={{
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        color: '#FF6B35',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        ₹{packageData.price?.adult?.toLocaleString()}
                      </div>
                    );
                  })()}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6c757d',
                  fontFamily: 'Poppins, sans-serif'
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
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#495057', fontFamily: 'Poppins, sans-serif' }}>
                  Package Details:
                </div>
                <div style={{ fontSize: '13px', color: '#6c757d', lineHeight: '1.8', fontFamily: 'Poppins, sans-serif' }}>
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
                marginBottom: '16px',
                fontFamily: 'Poppins, sans-serif'
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
                  color: '#6c757d',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  📧 Lsiaatech@gmail.com
              </div>
            </div>
            </Card>
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
          setAppliedCoupon(null);
          setCouponCode('');
          setCouponError('');
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

          {/* Coupon Code Section */}
          <Card style={{ marginBottom: '16px', backgroundColor: '#f8f9fa', border: '1px solid #e8e8e8' }}>
            <div style={{ marginBottom: '12px' }}>
              <TypographyText strong style={{ fontSize: '14px', fontFamily: 'Poppins, sans-serif' }}>
                Have a Coupon Code?
              </TypographyText>
            </div>
            {appliedCoupon ? (
              <div style={{
                padding: '12px',
                backgroundColor: '#d4edda',
                borderRadius: '8px',
                border: '1px solid #c3e6cb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#155724', fontFamily: 'Poppins, sans-serif' }}>
                      ✓ Coupon Applied: {appliedCoupon.code}
                    </div>
                    <div style={{ fontSize: '12px', color: '#155724', marginTop: '4px' }}>
                      Discount: ₹{appliedCoupon.offer.discount.toLocaleString()}
                    </div>
                  </div>
                  <Button
                    type="link"
                    danger
                    onClick={handleRemoveCoupon}
                    style={{ padding: '0', fontFamily: 'Poppins, sans-serif' }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  onPressEnter={handleApplyCoupon}
                  style={{ flex: 1, fontFamily: 'Poppins, sans-serif' }}
                  maxLength={20}
                />
                <Button
                  type="primary"
                  onClick={handleApplyCoupon}
                  loading={couponLoading}
                  style={{
                    backgroundColor: '#FF6B35',
                    borderColor: '#FF6B35',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  Apply
                </Button>
              </div>
            )}
            {couponError && (
              <div style={{ marginTop: '8px', color: '#ff4d4f', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                {couponError}
              </div>
            )}
          </Card>

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
                  
                  const baseTotal = (adultsCount * adultPrice) + (childrenCount * childPrice);
                  const originalTotal = (adultsCount * (packageData?.price?.adult || 0)) + 
                                       (childrenCount * (packageData?.price?.child || 0));
                  
                  // Apply coupon discount
                  let finalAmount = baseTotal;
                  let couponDiscount = 0;
                  if (appliedCoupon && appliedCoupon.offer) {
                    couponDiscount = appliedCoupon.offer.discount || 0;
                    finalAmount = Math.max(0, baseTotal - couponDiscount);
                  }
                  
                  return (
                    <>
                      {(adultPriceInfo.hasDiscount || couponDiscount > 0) && (
                        <div style={{ fontSize: '12px', color: '#6c757d', textDecoration: 'line-through', marginBottom: '4px' }}>
                          ₹{originalTotal.toLocaleString()}
                        </div>
                      )}
                      {baseTotal !== originalTotal && baseTotal !== finalAmount && (
                        <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
                          Base: ₹{baseTotal.toLocaleString()}
                        </div>
                      )}
                      {couponDiscount > 0 && (
                        <div style={{ fontSize: '12px', color: '#28a745', fontWeight: '600', marginBottom: '4px' }}>
                          Coupon Discount: -₹{couponDiscount.toLocaleString()}
                        </div>
                      )}
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B35' }}>
                        ₹{finalAmount.toLocaleString()}
                      </div>
                      {adultPriceInfo.hasDiscount && !couponDiscount && (
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
        }}
        footer={null}
        width={600}
      >
        <Form
          form={reviewForm}
          layout="vertical"
          onFinish={handleSubmitReview}
        >
          <Card style={{ marginBottom: '16px', backgroundColor: '#f8f9fa' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontFamily: 'Poppins, sans-serif' }}>Reviewing Package</h4>
            <div style={{ fontSize: '14px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>
              <div><strong>{packageData?.title}</strong></div>
              <div>📍 {packageData?.destination}</div>
            </div>
          </Card>

          {bookingsLoading ? (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <Spin size="small" />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#6c757d' }}>Loading your bookings...</div>
            </div>
          ) : userBookings.length > 0 ? (
            <Form.Item
              name="bookingId"
              label="Select Booking"
              rules={[{ required: true, message: 'Please select a booking' }]}
            >
              <Select
                placeholder="Select the booking you want to review"
                loading={bookingsLoading}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {userBookings.map((booking) => (
                  <Option key={booking._id} value={booking._id}>
                    {booking.bookingNumber || booking._id} - 
                    {booking.travelDates?.startDate 
                      ? ` Booked for ${new Date(booking.travelDates.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                      : ` Created on ${new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    }
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Alert
              message="No Bookings Found"
              description="You need to book this package before you can review it. Please book the package first and then come back to leave a review."
              type="info"
              showIcon
              style={{ marginBottom: '16px', fontFamily: 'Poppins, sans-serif' }}
            />
          )}

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

          <div style={{ marginBottom: '16px', textAlign: 'center', fontSize: '12px', color: '#6c757d', fontFamily: 'Poppins, sans-serif' }}>
            <MessageOutlined /> Your review will help other travelers make informed decisions
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={reviewSubmitting}
              size="large"
              disabled={userBookings.length === 0}
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
      </Modal>
      </div>
      
      <Footer />
    </>
  );
};

export default PackageDetail;
