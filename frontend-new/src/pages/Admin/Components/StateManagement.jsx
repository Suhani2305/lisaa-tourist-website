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
  Row,
  Col,
  Image,
  Divider,
  Checkbox,
  DatePicker,
} from 'antd';
import dayjs from 'dayjs';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { stateService, tourService } from '../../../services';

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

const StateManagement = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityTours, setCityTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tourModalVisible, setTourModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingTour, setEditingTour] = useState(null);
  const [selectedCityForTour, setSelectedCityForTour] = useState(null);
  const [activeTab, setActiveTab] = useState('states');
  const [form] = Form.useForm();
  const [tourForm] = Form.useForm();
  const [imageUrls, setImageUrls] = useState(['']);
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    fetchStates();
    fetchCities();
    if (activeTab === 'city-tours') {
      fetchCityTours();
    }
  }, [activeTab]);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const data = await stateService.getAllStates({ all: 'true' });
      const statesArray = Array.isArray(data) ? data : (data?.states || []);
      setStates(statesArray);
    } catch (error) {
      message.error('Failed to fetch states');
      console.error('❌ Fetch states error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const data = await stateService.getAllCities({ all: 'true' });
      const citiesArray = Array.isArray(data) ? data : (data?.cities || []);
      setCities(citiesArray);
    } catch (error) {
      message.error('Failed to fetch cities');
      console.error('❌ Fetch cities error:', error);
    }
  };

  const fetchCityTours = async () => {
    try {
      setLoading(true);
      // Fetch all tours that have city linking
      const data = await tourService.getAllTours({ all: 'true', limit: 1000 });
      const toursArray = Array.isArray(data) ? data : (data?.tours || []);
      // Filter tours that have citySlug (city tours)
      const cityToursList = toursArray.filter(tour => tour.citySlug || tour.city);
      setCityTours(cityToursList);
      console.log('✅ City tours loaded:', cityToursList.length);
    } catch (error) {
      message.error('Failed to fetch city tours');
      console.error('❌ Fetch city tours error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCitiesForState = async (stateSlug) => {
    try {
      const citiesData = await stateService.getAllCities({ stateSlug, all: 'true' });
      const citiesArray = Array.isArray(citiesData) ? citiesData : (citiesData?.cities || []);
      setCities(citiesArray);
    } catch (error) {
      console.error('Failed to fetch cities for state:', error);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    
    if (activeTab === 'states') {
      form.setFieldsValue({
        name: record.name,
        slug: record.slug,
        description: record.description,
        shortDescription: record.shortDescription,
        heroImage: record.heroImage,
        capital: record.capital,
        area: record.area,
        population: record.population,
        bestTimeToVisit: record.bestTimeToVisit,
        region: record.region || 'Other',
        featured: record.featured,
        isActive: record.isActive,
        order: record.order,
        metaTitle: record.metaTitle,
        metaDescription: record.metaDescription,
        metaKeywords: record.metaKeywords,
      });
    } else {
      form.setFieldsValue({
        name: record.name,
        slug: record.slug,
        state: record.state,
        stateSlug: record.stateSlug,
        description: record.description,
        shortDescription: record.shortDescription,
        heroImage: record.heroImage,
        bestTimeToVisit: record.bestTimeToVisit,
        featured: record.featured,
        isActive: record.isActive,
        order: record.order,
        metaTitle: record.metaTitle,
        metaDescription: record.metaDescription,
        metaKeywords: record.metaKeywords,
        attractions: record.attractions?.join(', ') || '',
      });
    }
    
    setModalVisible(true);
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === 'state') {
        await stateService.deleteState(id);
        setStates(states.filter(s => s._id !== id));
      } else {
        await stateService.deleteCity(id);
        setCities(cities.filter(c => c._id !== id));
      }
      message.success(`${type === 'state' ? 'State' : 'City'} deleted successfully!`);
    } catch (error) {
      message.error(`Failed to delete ${type}`);
      console.error('❌ Delete error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (activeTab === 'cities' && values.attractions) {
        values.attractions = values.attractions.split(',').map(a => a.trim()).filter(a => a);
      }

      if (activeTab === 'states') {
        if (editingItem) {
          await stateService.updateState(editingItem._id, values);
          message.success('State updated successfully! ✅');
        } else {
          await stateService.createState(values);
          message.success('State created successfully! ✅');
        }
        fetchStates();
      } else {
        if (editingItem) {
          await stateService.updateCity(editingItem._id, values);
          message.success('City updated successfully! ✅');
        } else {
          await stateService.createCity(values);
          message.success('City created successfully! ✅');
        }
        fetchCities();
      }
      
      setModalVisible(false);
      form.resetFields();
      setEditingItem(null);
    } catch (error) {
      console.error('❌ Save error:', error);
      message.error(error.message || `Failed to save ${activeTab === 'states' ? 'state' : 'city'}`);
    }
  };

  // Generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    form.setFieldsValue({ slug });
  };

  const stateColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {record.featured && <Tag color="gold">Featured</Tag>}
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Capital',
      dataIndex: 'capital',
      key: 'capital',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this state?"
            onConfirm={() => handleDelete(record._id, 'state')}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const cityColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {record.featured && <Tag color="gold">Featured</Tag>}
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'State Slug',
      dataIndex: 'stateSlug',
      key: 'stateSlug',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this city?"
            onConfirm={() => handleDelete(record._id, 'city')}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const cityTourColumns = [
    {
      title: 'Tour Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          {record.featured && <Tag color="gold">Featured</Tag>}
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, record) => `${record.duration?.days || 0}D/${record.duration?.nights || 0}N`,
    },
    {
      title: 'Price',
      key: 'price',
      render: (_, record) => `₹${record.price?.adult?.toLocaleString() || '0'}`,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditTour(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this city tour?"
            onConfirm={() => handleDeleteTour(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEditTour = (record) => {
    setEditingTour(record);
    setImageUrls(record.images && record.images.length > 0 ? record.images : ['']);
    setItinerary(record.itinerary || []);
    
    tourForm.setFieldsValue({
      title: record.title,
      destination: record.destination,
      city: record.city,
      citySlug: record.citySlug,
      state: record.state,
      stateSlug: record.stateSlug,
      description: record.description,
      shortDescription: record.shortDescription,
      durationDays: record.duration?.days,
      durationNights: record.duration?.nights,
      adultPrice: record.price?.adult,
      childPrice: record.price?.child,
      infantPrice: record.price?.infant,
      discountType: record.discount?.type || 'percentage',
      discountValue: record.discount?.value || 0,
      discountActive: record.discount?.isActive || false,
      discountStartDate: record.discount?.startDate ? dayjs(record.discount.startDate) : null,
      discountEndDate: record.discount?.endDate ? dayjs(record.discount.endDate) : null,
      category: record.category,
      trendingCategories: record.trendingCategories || [],
      difficulty: record.difficulty || 'moderate',
      maxGroupSize: record.groupSize?.max || 20,
      featured: record.featured,
      isActive: record.isActive,
      highlights: record.highlights?.join('\n') || '',
      inclusions: record.inclusions?.join('\n') || '',
      exclusions: record.exclusions?.join('\n') || '',
    });

    // Find and select the city
    if (record.citySlug) {
      const city = cities.find(c => c.slug === record.citySlug);
      if (city) {
        setSelectedCityForTour(city);
      }
    }
    
    setTourModalVisible(true);
  };

  const handleDeleteTour = async (id) => {
    try {
      await tourService.deleteTour(id);
      setCityTours(cityTours.filter(t => t._id !== id));
      message.success('City tour deleted successfully!');
      fetchCityTours(); // Refresh list
    } catch (error) {
      message.error('Failed to delete city tour');
      console.error('❌ Delete tour error:', error);
    }
  };

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
    const newItinerary = itinerary.filter((_, i) => i !== index).map((day, i) => ({
      ...day,
      day: i + 1
    }));
    setItinerary(newItinerary);
  };

  const updateItineraryDay = (index, field, value) => {
    const newItinerary = [...itinerary];
    if (field === 'activities') {
      newItinerary[index].activities = value.split('\n').filter(a => a.trim());
    } else if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newItinerary[index][parent] = { ...newItinerary[index][parent], [child]: value };
    } else {
      newItinerary[index][field] = value;
    }
    setItinerary(newItinerary);
  };

  const handleTourSubmit = async (values) => {
    try {
      setLoading(true);
      
      const tourData = {
        ...values,
        city: selectedCityForTour?.name || values.city,
        citySlug: selectedCityForTour?.slug || values.citySlug,
        state: selectedCityForTour?.state || values.state,
        stateSlug: selectedCityForTour?.stateSlug || values.stateSlug,
        duration: {
          days: values.durationDays,
          nights: values.durationNights
        },
        price: {
          adult: values.adultPrice,
          child: values.childPrice && values.childPrice > 0 
            ? values.childPrice 
            : Math.round(values.adultPrice * 0.7), // Default 70% of adult price
          infant: values.infantPrice || 0
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
        itinerary: itinerary.filter(day => day.title && day.description),
        highlights: values.highlights ? values.highlights.split('\n').filter(h => h.trim()) : [],
        inclusions: values.inclusions ? values.inclusions.split('\n').filter(i => i.trim()) : [],
        exclusions: values.exclusions ? values.exclusions.split('\n').filter(e => e.trim()) : [],
        trendingCategories: values.trendingCategories || [],
        difficulty: values.difficulty || 'moderate',
        groupSize: {
          max: values.maxGroupSize || 20,
          min: 1
        },
      };

      if (editingTour) {
        await tourService.updateTour(editingTour._id, tourData);
        message.success('City tour updated successfully! ✅');
      } else {
        await tourService.createTour(tourData);
        message.success('City tour created successfully! ✅');
      }
      
      setTourModalVisible(false);
      tourForm.resetFields();
      setEditingTour(null);
      setImageUrls(['']);
      setItinerary([]);
      setSelectedCityForTour(null);
      fetchCityTours();
    } catch (error) {
      console.error('❌ Save city tour error:', error);
      message.error(error.message || 'Failed to save city tour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>States & Cities Management</h2>
          {activeTab !== 'city-tours' && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="large"
            >
              Create {activeTab === 'states' ? 'State' : 'City'}
            </Button>
          )}
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="States" key="states">
            <Table
              columns={stateColumns}
              dataSource={states}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="Cities" key="cities">
            <Table
              columns={cityColumns}
              dataSource={cities}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane tab="City Tours" key="city-tours">
            <div style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingTour(null);
                  tourForm.resetFields();
                  setImageUrls(['']);
                  setItinerary([]);
                  setSelectedCityForTour(null);
                  setTourModalVisible(true);
                }}
                size="large"
              >
                Create City Tour
              </Button>
            </div>
            <Table
              columns={cityTourColumns}
              dataSource={cityTours}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingItem ? `Edit ${activeTab === 'states' ? 'State' : 'City'}` : `Create ${activeTab === 'states' ? 'State' : 'City'}`}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingItem(null);
        }}
        width={800}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter name' }]}
              >
                <Input placeholder="e.g., Rajasthan" onBlur={handleNameChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Please enter slug' }]}
                tooltip="URL-friendly version (auto-generated from name)"
              >
                <Input placeholder="e.g., rajasthan" />
              </Form.Item>
            </Col>
          </Row>

          {activeTab === 'cities' && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="state"
                    label="State Name"
                    rules={[{ required: true, message: 'Please enter state name' }]}
                  >
                    <Input placeholder="e.g., Rajasthan" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="stateSlug"
                    label="State Slug"
                    rules={[{ required: true, message: 'Please enter state slug' }]}
                  >
                    <Input placeholder="e.g., rajasthan" />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Form.Item
            name="shortDescription"
            label="Short Description"
          >
            <TextArea rows={2} placeholder="Brief description (appears in cards)" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={6} placeholder="Full description" />
          </Form.Item>

          <Divider orientation="left">📸 Images</Divider>

          <Form.Item
            name="heroImage"
            label="Hero Image URL"
            tooltip="Main image for the state/city"
          >
            <Input placeholder="Paste image URL here" />
          </Form.Item>

          <Form.Item label="Hero Image Preview">
            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.heroImage !== curr.heroImage}>
              {({ getFieldValue }) => {
                const imageUrl = getFieldValue('heroImage');
                return imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Hero Image Preview"
                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '12px' }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
                  />
                ) : (
                  <div style={{ padding: '40px', border: '2px dashed #d9d9d9', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
                    Paste image URL above to see preview
                  </div>
                );
              }}
            </Form.Item>
          </Form.Item>

          {activeTab === 'states' && (
            <>
              <Divider orientation="left">📍 State Information</Divider>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="capital" label="Capital">
                    <Input placeholder="e.g., Jaipur" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="area" label="Area">
                    <Input placeholder="e.g., 342,239 km²" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="population" label="Population">
                    <Input placeholder="e.g., 68 million" />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {activeTab === 'cities' && (
            <>
              <Divider orientation="left">🏛️ Attractions</Divider>
              <Form.Item
                name="attractions"
                label="Popular Attractions"
                tooltip="Comma-separated list of attractions"
              >
                <Input placeholder="e.g., Amber Fort, City Palace, Hawa Mahal" />
              </Form.Item>
            </>
          )}

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="bestTimeToVisit" label="Best Time to Visit">
                    <Input placeholder="e.g., October to March" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="region" label="Region" rules={[{ required: true, message: 'Please select region' }]}>
                    <Select placeholder="Select Region">
                      <Option value="North">North</Option>
                      <Option value="South">South</Option>
                      <Option value="East">East</Option>
                      <Option value="West">West</Option>
                      <Option value="Northeast">Northeast</Option>
                      <Option value="Central">Central</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="order" label="Display Order">
                    <InputNumber min={0} placeholder="Lower number = shown first" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

          <Divider orientation="left">⚙️ Settings</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="featured" label="Featured" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">🔍 SEO Settings</Divider>

          <Form.Item name="metaTitle" label="SEO Title">
            <Input placeholder="Meta title for search engines" />
          </Form.Item>

          <Form.Item name="metaDescription" label="SEO Description">
            <TextArea rows={3} placeholder="Meta description for search engines" />
          </Form.Item>

          <Form.Item name="metaKeywords" label="Meta Keywords">
            <Input placeholder="Comma-separated keywords" />
          </Form.Item>
        </Form>
      </Modal>

      {/* City Tour Modal */}
      <Modal
        title={editingTour ? 'Edit City Tour' : 'Create City Tour'}
        open={tourModalVisible}
        onCancel={() => {
          setTourModalVisible(false);
          tourForm.resetFields();
          setEditingTour(null);
          setImageUrls(['']);
          setItinerary([]);
          setSelectedCityForTour(null);
        }}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <Form 
          form={tourForm} 
          layout="vertical"
          onFinish={handleTourSubmit}
          initialValues={{
            featured: false,
            isActive: true,
            discountType: 'percentage',
          }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="📝 Basic Info" key="1">
              {/* City Selection */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="stateSlug"
                    label="State"
                    rules={[{ required: true, message: 'Please select state' }]}
                  >
                    <Select
                      placeholder="Select State"
                      onChange={(value) => {
                        const selectedState = states.find(s => s.slug === value);
                        tourForm.setFieldsValue({
                          state: selectedState?.name || '',
                          citySlug: undefined,
                          city: undefined
                        });
                        setSelectedCityForTour(null);
                        if (value) {
                          fetchCitiesForState(value);
                        }
                      }}
                    >
                      {states.map(state => (
                        <Option key={state._id} value={state.slug}>{state.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="citySlug"
                    label="City"
                    rules={[{ required: true, message: 'Please select city' }]}
                    dependencies={['stateSlug']}
                  >
                    <Select
                      placeholder="Select City (State required)"
                      disabled={!tourForm.getFieldValue('stateSlug')}
                      onChange={(value) => {
                        const selectedCity = cities.find(c => c.slug === value);
                        if (selectedCity) {
                          setSelectedCityForTour(selectedCity);
                          tourForm.setFieldsValue({
                            city: selectedCity.name,
                            state: selectedCity.state,
                            stateSlug: selectedCity.stateSlug
                          });
                        }
                      }}
                    >
                      {cities.map(city => (
                        <Option key={city._id} value={city.slug}>{city.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="title"
                label="Tour Title"
                rules={[{ required: true, message: 'Please enter tour title' }]}
              >
                <Input placeholder="e.g., Jaipur Heritage Tour" />
              </Form.Item>

              <Form.Item
                name="destination"
                label="Destination"
                rules={[{ required: true, message: 'Please enter destination' }]}
              >
                <Input placeholder="e.g., Jaipur City" />
              </Form.Item>

              <Form.Item
                name="shortDescription"
                label="Short Description"
              >
                <TextArea rows={2} placeholder="Brief description (appears in cards)" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <TextArea rows={4} placeholder="Enter detailed tour description" />
              </Form.Item>

              <Space style={{ width: '100%' }} size="large">
                <Form.Item
                  name="durationDays"
                  label="Duration (Days)"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber min={1} placeholder="3" style={{ width: 120 }} />
                </Form.Item>

                <Form.Item
                  name="durationNights"
                  label="Duration (Nights)"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber min={0} placeholder="2" style={{ width: 120 }} />
                </Form.Item>
              </Space>

              <Space style={{ width: '100%' }} size="large">
                <Form.Item
                  name="adultPrice"
                  label="Adult Price (₹)"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber min={0} placeholder="5000" style={{ width: 150 }} />
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
                        {tourForm.getFieldValue('adultPrice') 
                          ? `or ₹${Math.round((tourForm.getFieldValue('adultPrice') || 0) * 0.7)}`
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
                            const discountType = tourForm.getFieldValue('discountType');
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
                        max={tourForm.getFieldValue('discountType') === 'percentage' ? 100 : undefined}
                        placeholder={tourForm.getFieldValue('discountType') === 'percentage' ? "10" : "500"} 
                        style={{ width: '100%' }}
                        addonAfter={tourForm.getFieldValue('discountType') === 'percentage' ? '%' : '₹'}
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
                            tourForm.setFieldsValue({
                              discountStartDate: null,
                              discountEndDate: null,
                              discountValue: 0
                            });
                            // Clear validation errors
                            setTimeout(() => {
                              tourForm.validateFields(['discountStartDate', 'discountEndDate']).catch(() => {});
                            }, 100);
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item shouldUpdate={(prev, curr) => prev.discountActive !== curr.discountActive}>
                  {() => {
                    const discountActive = tourForm.getFieldValue('discountActive');
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
                                  
                                  const startDateValue = tourForm.getFieldValue('discountStartDate');
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
                                
                                const today = dayjs().startOf('day');
                                if (current.isBefore(today)) {
                                  return true;
                                }
                                
                                const startDateValue = tourForm.getFieldValue('discountStartDate');
                                const startDate = ensureDayjs(startDateValue);
                                
                                if (startDate && startDate.isValid() && current.isBefore(startDate.startOf('day'))) {
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
                  <Option value="day-tour">Day Tour</Option>
                  <Option value="package">Package</Option>
                  <Option value="multi-day">Multi Day</Option>
                  <Option value="religious">Religious</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="trendingCategories"
                label="Trending Categories (Multiple Selection)"
                help="Select one or more trending categories to feature this tour"
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
                <Form.Item name="featured" valuePropName="checked" label="Featured Tour">
                  <Switch />
                </Form.Item>

                <Form.Item name="isActive" valuePropName="checked" label="Active">
                  <Switch defaultChecked />
                </Form.Item>
              </Space>
            </TabPane>

            <TabPane tab="🖼️ Images" key="2">
              <div style={{ marginBottom: 16 }}>
                <h4>Tour Images (URLs)</h4>
                <p style={{ color: '#666', fontSize: '12px' }}>Add multiple image URLs. First image will be the cover image.</p>
              </div>
              
              {imageUrls.map((url, index) => (
                <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Input
                    placeholder={`Image URL ${index + 1} (https://...)`}
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...imageUrls];
                      newUrls[index] = e.target.value;
                      setImageUrls(newUrls);
                    }}
                    style={{ width: 500 }}
                  />
                  {imageUrls.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => {
                        const newUrls = imageUrls.filter((_, i) => i !== index);
                        setImageUrls(newUrls.length > 0 ? newUrls : ['']);
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Space>
              ))}
              
              <Button
                type="dashed"
                onClick={() => setImageUrls([...imageUrls, ''])}
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
                <p style={{ color: '#666', fontSize: '12px' }}>Add detailed daily activities, places to visit, food, accommodation, etc.</p>
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
                    placeholder="Day Title (e.g., Arrival & City Palace Visit)"
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
              <Form.Item name="highlights" label="Tour Highlights (One per line)">
                <TextArea
                  rows={4}
                  placeholder="Visit Amber Fort&#10;Explore City Palace&#10;Traditional Rajasthani Lunch&#10;Expert local guide"
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
                {editingTour ? 'Update City Tour' : 'Create City Tour'}
              </Button>
              <Button size="large" onClick={() => setTourModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StateManagement;

