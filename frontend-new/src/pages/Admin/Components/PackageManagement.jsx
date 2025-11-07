import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Space,
  Tag,
  Popconfirm,
  Switch,
  Tabs,
  List,
  Checkbox,
  DatePicker,
  Row,
  Col,
} from 'antd';
import dayjs from 'dayjs';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { tourService } from '../../../services';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// Helper function to ensure date is a valid dayjs object
const ensureDayjs = (val) => {
  if (!val || val === null || val === undefined || val === '') return null;
  if (dayjs.isDayjs(val)) {
    return val.isValid() ? val : null;
  }
  const d = dayjs(val);
  return d.isValid() ? d : null;
};

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [form] = Form.useForm();

  // Dynamic states for images and itinerary
  const [imageUrls, setImageUrls] = useState(['']);
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching all packages from backend...');
      
      // Fetch ALL packages including inactive ones (for admin)
      const data = await tourService.getAllTours({ all: 'true', limit: 1000 });
      
      console.log('📡 Raw API response:', data);
      
      const packagesArray = Array.isArray(data) ? data : (data?.data || data?.tours || []);
      
      console.log('📦 Processed packages array:', packagesArray);
      console.log('📊 Total packages found:', packagesArray.length);
      
      if (packagesArray.length === 0) {
        message.warning('No packages found in database. Create your first package!');
      } else {
        message.success(`Loaded ${packagesArray.length} packages successfully!`);
      }
      
      setPackages(packagesArray);
    } catch (error) {
      message.error('Failed to fetch packages. Check console for details.');
      console.error('❌ Fetch error:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPackage(null);
    form.resetFields();
    setImageUrls(['']);
    setItinerary([]);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingPackage(record);
    setImageUrls(record.images && record.images.length > 0 ? record.images : ['']);
    setItinerary(record.itinerary || []);
    
      form.setFieldsValue({
        title: record.title,
        destination: record.destination,
        description: record.description,
      durationDays: record.duration?.days,
      durationNights: record.duration?.nights,
      adultPrice: record.price?.adult,
      childPrice: record.price?.child,
      infantPrice: record.price?.infant,
      discountType: record.discount?.type || 'percentage',
      discountValue: record.discount?.value || 0,
      discountActive: record.discount?.isActive || false,
      discountStartDate: record.discount?.startDate ? (dayjs(record.discount.startDate).isValid() ? dayjs(record.discount.startDate) : null) : null,
      discountEndDate: record.discount?.endDate ? (dayjs(record.discount.endDate).isValid() ? dayjs(record.discount.endDate) : null) : null,
      category: record.category,
      trendingCategories: record.trendingCategories || [],
      difficulty: record.difficulty,
      maxGroupSize: record.groupSize?.max || 20,
      featured: record.featured || false,
      availability: record.availability?.isAvailable !== undefined ? record.availability.isAvailable : true,
      inclusions: record.inclusions?.join('\n') || '',
      exclusions: record.exclusions?.join('\n') || '',
      highlights: record.highlights?.join('\n') || '',
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await tourService.deleteTour(id);
      message.success('Package deleted successfully! ✅');
      fetchPackages();
    } catch (error) {
      message.error('Failed to delete package');
      console.error('❌ Delete error:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      console.log('📝 Form values:', values);
      console.log('🖼️ Image URLs:', imageUrls);
      console.log('📅 Itinerary:', itinerary);
      
      const packageData = {
        title: values.title,
        destination: values.destination,
        city: values.city || '',
        citySlug: values.citySlug || '',
        state: values.state || '',
        stateSlug: values.stateSlug || '',
        description: values.description,
        duration: {
          days: values.durationDays,
          nights: values.durationNights,
        },
        price: {
          adult: values.adultPrice,
          child: values.childPrice && values.childPrice > 0 
            ? values.childPrice 
            : Math.round(values.adultPrice * 0.7), // Default 70% of adult price
          infant: values.infantPrice || 0,
        },
        discount: {
          type: values.discountType || 'percentage',
          value: values.discountValue || 0,
          isActive: values.discountActive || false,
          startDate: values.discountStartDate 
            ? (dayjs.isDayjs(values.discountStartDate) 
                ? values.discountStartDate.toISOString() 
                : dayjs(values.discountStartDate).toISOString())
            : null,
          endDate: values.discountEndDate 
            ? (dayjs.isDayjs(values.discountEndDate) 
                ? values.discountEndDate.toISOString() 
                : dayjs(values.discountEndDate).toISOString())
            : null,
        },
        images: imageUrls.filter(url => url && url.trim()),
        category: values.category,
        trendingCategories: values.trendingCategories || [],
        featured: values.featured || false,
        availability: {
          isAvailable: values.availability !== undefined ? values.availability : true
        },
        groupSize: {
          max: values.maxGroupSize || 20,
          min: 1
        },
        difficulty: values.difficulty || 'moderate',
        inclusions: values.inclusions ? values.inclusions.split('\n').filter(item => item.trim()) : [],
        exclusions: values.exclusions ? values.exclusions.split('\n').filter(item => item.trim()) : [],
        highlights: values.highlights ? values.highlights.split('\n').filter(item => item.trim()) : [],
        itinerary: itinerary.filter(day => day.title && day.description),
      };

      console.log('📦 Sending package data:', JSON.stringify(packageData, null, 2));

      if (editingPackage) {
        await tourService.updateTour(editingPackage._id, packageData);
        message.success('Package updated successfully! ✅');
      } else {
        const result = await tourService.createTour(packageData);
        console.log('✅ Package created:', result);
        message.success('Package created successfully! ✅');
      }

      setModalVisible(false);
      form.resetFields();
      setImageUrls(['']);
      setItinerary([]);
      fetchPackages();
    } catch (error) {
      console.error('❌ Error saving package:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Full error:', JSON.stringify(error, null, 2));
      
      // Show detailed error
      let errorMessage = 'Failed to save package';
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorList = error.response.data.errors.map(err => `• ${err.field}: ${err.message}`).join('\n');
        errorMessage = `Validation Errors:\n${errorList}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Modal.error({
        title: 'Error Saving Package',
        content: (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {errorMessage}
            <br /><br />
            <small style={{ color: '#999' }}>Check browser console (F12) for detailed error logs</small>
          </div>
        ),
        width: 500
      });
    } finally {
      setLoading(false);
    }
  };

  // Image URL handlers
  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length > 0 ? newUrls : ['']);
  };

  const updateImageUrl = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  // Itinerary handlers
  const addItineraryDay = () => {
    setItinerary([...itinerary, {
      day: itinerary.length + 1,
      title: '',
      description: '',
      activities: [],
      meals: { breakfast: false, lunch: false, dinner: false },
      accommodation: ''
    }]);
  };

  const removeItineraryDay = (index) => {
    const newItinerary = itinerary.filter((_, i) => i !== index);
    // Re-number days
    setItinerary(newItinerary.map((day, i) => ({ ...day, day: i + 1 })));
  };

  const updateItineraryDay = (index, field, value) => {
    const newItinerary = [...itinerary];
    if (field === 'activities') {
      newItinerary[index][field] = value.split('\n').filter(a => a.trim());
    } else if (field.startsWith('meals.')) {
      const mealType = field.split('.')[1];
      newItinerary[index].meals[mealType] = value;
    } else {
      newItinerary[index][field] = value;
    }
    setItinerary(newItinerary);
  };

  const getCategoryColor = (category) => {
    const colors = {
      spiritual: 'blue',
      wellness: 'green',
      heritage: 'orange',
      study: 'purple',
      adventure: 'red',
      cultural: 'cyan',
      package: 'magenta',
    };
    return colors[category] || 'default';
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      width: 100,
      render: (images) => (
        <img
          src={images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=80&h=80&fit=crop&q=80'}
          alt="Package"
          style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 250,
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      key: 'destination',
      width: 150,
    },
    {
      title: 'Duration',
      key: 'duration',
      width: 120,
      render: (_, record) => (
        <span>{record.duration?.days || 0}D / {record.duration?.nights || 0}N</span>
      ),
    },
    {
      title: 'Price (Adult)',
      key: 'price',
      width: 120,
      render: (_, record) => (
        <span>₹{record.price?.adult?.toLocaleString()}</span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => (
        <Tag color={getCategoryColor(category)}>
          {category?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      width: 100,
      render: (featured) => (
        <Tag color={featured ? 'green' : 'default'}>
          {featured ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'availability',
      key: 'availability',
      width: 100,
      render: (availability) => {
        const isAvailable = availability?.isAvailable !== undefined ? availability.isAvailable : true;
        return (
          <Tag color={isAvailable ? 'success' : 'error'}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this package?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Package Management
          </span>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
            style={{ backgroundColor: '#ff6b35', borderColor: '#ff6b35' }}
          >
            Add New Package
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={packages}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} packages`,
          }}
        />
      </Card>

      <Modal
        title={editingPackage ? 'Edit Package' : 'Add New Package'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setImageUrls(['']);
          setItinerary([]);
        }}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            featured: false,
            availability: true,
            difficulty: 'moderate',
            maxGroupSize: 20,
          }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="📝 Basic Info" key="1">
              <Form.Item
                name="title"
                label="Package Title"
                rules={[{ required: true, message: 'Please enter package title' }]}
              >
                <Input placeholder="e.g., Char Dham Pilgrim Circuit" />
              </Form.Item>

              <Form.Item
                name="destination"
                label="Destination"
                rules={[{ required: true, message: 'Please enter destination' }]}
              >
                <Input placeholder="e.g., Kedarnath-Badrinath" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <TextArea rows={4} placeholder="Enter detailed package description" />
              </Form.Item>

              <Space style={{ width: '100%' }} size="large">
                <Form.Item
                  name="durationDays"
                  label="Duration (Days)"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber min={1} placeholder="8" style={{ width: 120 }} />
                </Form.Item>

                <Form.Item
                  name="durationNights"
                  label="Duration (Nights)"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber min={0} placeholder="7" style={{ width: 120 }} />
                </Form.Item>
              </Space>

              <Space style={{ width: '100%' }} size="large">
                <Form.Item
                  name="adultPrice"
                  label="Adult Price (₹)"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber min={0} placeholder="28000" style={{ width: 150 }} />
                </Form.Item>

                <Form.Item 
                  name="childPrice" 
                  label="Child Price (₹)"
                  tooltip="Leave empty to auto-calculate 70% of adult price. Or enter custom price."
                  dependencies={['adultPrice']}
                >
                  <InputNumber 
                    min={0} 
                    placeholder="Auto (70% of adult)" 
                    style={{ width: 180 }}
                    addonAfter={
                      <span style={{ fontSize: '11px', color: '#999' }}>
                        {form.getFieldValue('adultPrice') 
                          ? `or ₹${Math.round((form.getFieldValue('adultPrice') || 0) * 0.7)}`
                          : 'or Auto'}
                      </span>
                    }
                  />
                </Form.Item>

                <Form.Item name="infantPrice" label="Infant Price (₹)">
                  <InputNumber min={0} placeholder="0" style={{ width: 150 }} />
                </Form.Item>
              </Space>

              {/* Discount Section */}
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '8px', 
                marginBottom: '16px',
                border: '1px solid #d9d9d9'
              }}>
                <h4 style={{ marginBottom: '16px', color: '#FF6B35' }}>💰 Discount Options</h4>
                
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item 
                      name="discountType" 
                      label="Discount Type"
                      initialValue="percentage"
                    >
                      <Select style={{ width: '100%' }}>
                        <Option value="percentage">Percentage (%)</Option>
                        <Option value="fixed">Fixed Amount (₹)</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      name="discountValue"
                      label="Discount Value"
                      rules={[
                        { 
                          validator: (_, value) => {
                            if (value === undefined || value === null || value === '') {
                              return Promise.resolve();
                            }
                            if (value < 0) {
                              return Promise.reject('Discount cannot be negative');
                            }
                            const discountType = form.getFieldValue('discountType');
                            if (discountType === 'percentage' && value > 100) {
                              return Promise.reject('Discount percentage cannot exceed 100%');
                            }
                            return Promise.resolve();
                          }
                        }
                      ]}
                    >
                      <InputNumber 
                        min={0} 
                        max={form.getFieldValue('discountType') === 'percentage' ? 100 : undefined}
                        placeholder={form.getFieldValue('discountType') === 'percentage' ? "10" : "500"} 
                        style={{ width: '100%' }}
                        addonAfter={form.getFieldValue('discountType') === 'percentage' ? '%' : '₹'}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item 
                      name="discountActive" 
                      valuePropName="checked" 
                      label="Activate Discount"
                    >
                      <Switch 
                        onChange={(checked) => {
                          if (!checked) {
                            // Clear discount dates and value when discount is disabled
                            form.setFieldsValue({
                              discountStartDate: null,
                              discountEndDate: null,
                              discountValue: 0
                            });
                            // Clear validation errors
                            setTimeout(() => {
                              form.validateFields(['discountStartDate', 'discountEndDate']).catch(() => {});
                            }, 100);
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item shouldUpdate={(prev, curr) => prev.discountActive !== curr.discountActive}>
                  {() => {
                    const discountActive = form.getFieldValue('discountActive');
                    return (
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item 
                            name="discountStartDate" 
                            label="Discount Start Date"
                            rules={[
                              {
                                validator: (_, value) => {
                                  if (!discountActive) {
                                    return Promise.resolve();
                                  }
                                  
                                  const startDate = ensureDayjs(value);
                                  if (!startDate) {
                                    return Promise.reject('Start date is required when discount is active');
                                  }
                                  
                                  return Promise.resolve();
                                }
                              }
                            ]}
                          >
                            <DatePicker 
                              style={{ width: '100%' }}
                              placeholder="Select start date (Required)"
                              format="YYYY-MM-DD"
                              disabled={!discountActive}
                              disabledDate={(current) => {
                                if (!current || !discountActive) return false;
                                if (!dayjs.isDayjs(current) || !current.isValid()) return false;
                                const today = dayjs().startOf('day');
                                return current.isBefore(today);
                              }}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item 
                            name="discountEndDate" 
                            label="Discount End Date"
                            rules={[
                              {
                                validator: (_, value) => {
                                  if (!discountActive) {
                                    return Promise.resolve();
                                  }
                                  
                                  const endDate = ensureDayjs(value);
                                  if (!endDate) {
                                    return Promise.reject('End date is required when discount is active');
                                  }
                                  
                                  const startDateValue = form.getFieldValue('discountStartDate');
                                  const startDate = ensureDayjs(startDateValue);
                                  
                                  if (startDate && endDate.isBefore(startDate, 'day')) {
                                    return Promise.reject('End date must be same or after start date');
                                  }
                                  
                                  return Promise.resolve();
                                }
                              }
                            ]}
                          >
                            <DatePicker 
                              style={{ width: '100%' }}
                              placeholder="Select end date (Required)"
                              format="YYYY-MM-DD"
                              disabled={!discountActive}
                              disabledDate={(current) => {
                                if (!current || !discountActive) return false;
                                if (!dayjs.isDayjs(current) || !current.isValid()) return false;
                                
                                const today = dayjs().startOf('day');
                                if (current.isBefore(today)) {
                                  return true;
                                }
                                
                                const startDateValue = form.getFieldValue('discountStartDate');
                                const startDate = ensureDayjs(startDateValue);
                                
                                if (startDate && dayjs.isDayjs(startDate) && startDate.isValid() && current.isBefore(startDate.startOf('day'))) {
                                  return true;
                                }
                                
                                return false;
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    );
                  }}
                </Form.Item>
              </div>

              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="spiritual">Spiritual</Option>
                  <Option value="wellness">Wellness</Option>
                  <Option value="heritage">Heritage</Option>
                  <Option value="study">Study</Option>
                  <Option value="adventure">Adventure</Option>
                  <Option value="cultural">Cultural</Option>
                  <Option value="city-tour">City Tour</Option>
                  <Option value="beach">Beach</Option>
                  <Option value="wildlife">Wildlife</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="trendingCategories"
                label="Trending Categories (Multiple Selection)"
                help="Select one or more trending categories to feature this package"
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <Checkbox value="Culture & Heritage">🕌 Culture & Heritage</Checkbox>
                  <Checkbox value="Nature & Adventure">🏔️ Nature & Adventure</Checkbox>
                  <Checkbox value="Beaches & Islands">🏖️ Beaches & Islands</Checkbox>
                  <Checkbox value="Wellness & Spirituality">🧘‍♀️ Wellness & Spirituality</Checkbox>
                  <Checkbox value="Food & Festivals">🍛 Food & Festivals</Checkbox>
                  <Checkbox value="Modern India">🏙️ Modern India</Checkbox>
                  <Checkbox value="Special Journeys">🚗 Special Journeys</Checkbox>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item name="difficulty" label="Difficulty Level">
                <Select>
                  <Option value="easy">Easy</Option>
                  <Option value="moderate">Moderate</Option>
                  <Option value="challenging">Challenging</Option>
                </Select>
              </Form.Item>

              <Form.Item name="maxGroupSize" label="Max Group Size">
                <InputNumber min={1} max={100} />
              </Form.Item>

              <Space>
                <Form.Item name="featured" valuePropName="checked" label="Featured Package">
                  <Switch />
                </Form.Item>

                <Form.Item name="availability" valuePropName="checked" label="Available">
                  <Switch defaultChecked />
                </Form.Item>
              </Space>
            </TabPane>

            <TabPane tab="🖼️ Images" key="2">
              <div style={{ marginBottom: 16 }}>
                <h4>Package Images (URLs)</h4>
                <p style={{ color: '#666', fontSize: '12px' }}>Add multiple image URLs. First image will be the cover image.</p>
              </div>
              
              {imageUrls.map((url, index) => (
                <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Input
                    placeholder={`Image URL ${index + 1} (https://...)`}
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    style={{ width: 500 }}
                  />
                  {imageUrls.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeImageUrl(index)}
                    >
                      Remove
                    </Button>
                  )}
                </Space>
              ))}
              
              <Button
                type="dashed"
                onClick={addImageUrl}
                icon={<PlusOutlined />}
                style={{ width: '100%', marginTop: 8 }}
              >
                Add Image URL
              </Button>

              {imageUrls[0] && imageUrls[0].trim() && (
                <div style={{ marginTop: 16 }}>
                  <h4>Preview (First Image):</h4>
                  <img
                    src={imageUrls[0]}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=200&fit=crop&q=80'; }}
                  />
                </div>
              )}
            </TabPane>

            <TabPane tab="📅 Itinerary" key="3">
              <div style={{ marginBottom: 16 }}>
                <h4>Day-by-Day Itinerary</h4>
                <p style={{ color: '#666', fontSize: '12px' }}>Add detailed daily activities for your tour package.</p>
              </div>

              {itinerary.map((day, index) => (
                <Card
                  key={index}
                  size="small"
                  title={`Day ${day.day}`}
                  extra={
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeItineraryDay(index)}
                    >
                      Remove
                    </Button>
                  }
                  style={{ marginBottom: 16 }}
                >
                  <Input
                    placeholder="Day Title (e.g., Arrival in Kedarnath)"
                    value={day.title}
                    onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                  
                  <TextArea
                    placeholder="Day Description"
                    value={day.description}
                    onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                    rows={3}
                    style={{ marginBottom: 8 }}
                  />
                  
                  <TextArea
                    placeholder="Activities (one per line)"
                    value={day.activities?.join('\n') || ''}
                    onChange={(e) => updateItineraryDay(index, 'activities', e.target.value)}
                    rows={2}
                    style={{ marginBottom: 8 }}
                  />

                  <div style={{ marginBottom: 8 }}>
                    <span style={{ marginRight: 16 }}>Meals Included:</span>
                    <Checkbox
                      checked={day.meals?.breakfast}
                      onChange={(e) => updateItineraryDay(index, 'meals.breakfast', e.target.checked)}
                    >
                      Breakfast
                    </Checkbox>
                    <Checkbox
                      checked={day.meals?.lunch}
                      onChange={(e) => updateItineraryDay(index, 'meals.lunch', e.target.checked)}
                    >
                      Lunch
                    </Checkbox>
                    <Checkbox
                      checked={day.meals?.dinner}
                      onChange={(e) => updateItineraryDay(index, 'meals.dinner', e.target.checked)}
                    >
                      Dinner
                    </Checkbox>
                  </div>

                  <Input
                    placeholder="Accommodation (Optional)"
                    value={day.accommodation}
                    onChange={(e) => updateItineraryDay(index, 'accommodation', e.target.value)}
                  />
                </Card>
              ))}

              <Button
                type="dashed"
                onClick={addItineraryDay}
                icon={<PlusOutlined />}
                style={{ width: '100%' }}
              >
                Add Day
              </Button>
            </TabPane>

            <TabPane tab="✨ Details" key="4">
              <Form.Item name="highlights" label="Package Highlights (One per line)">
                <TextArea
                  rows={4}
                  placeholder="Visit sacred temples&#10;Scenic mountain views&#10;Traditional cuisine&#10;Expert guide"
                />
              </Form.Item>

              <Form.Item name="inclusions" label="Inclusions (One per line)">
                <TextArea
                  rows={4}
                  placeholder="Accommodation&#10;Daily meals&#10;Transportation&#10;Tour guide"
                />
              </Form.Item>

              <Form.Item name="exclusions" label="Exclusions (One per line)">
                <TextArea
                  rows={3}
                  placeholder="Flight tickets&#10;Personal expenses&#10;Travel insurance"
                />
              </Form.Item>
            </TabPane>
          </Tabs>

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{ backgroundColor: '#ff6b35', borderColor: '#ff6b35' }}
              >
                {editingPackage ? 'Update Package' : 'Create Package'}
              </Button>
              <Button size="large" onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PackageManagement;
