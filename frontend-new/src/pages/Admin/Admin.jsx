import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './Components/AdminLayout';
import AdminDashboard from './Components/AdminDashboard';
import AdminLogin from './Components/AdminLogin';
import PackageManagement from './Components/PackageManagement';
import BookingsManagement from './Components/BookingsManagement';
import CustomersManagement from './Components/CustomersManagement';
import InquiriesManagement from './Components/InquiriesManagement';
import OffersManagement from './Components/OffersManagement';
import ContentManagement from './Components/ContentManagement';
import MediaGallery from './Components/MediaGallery';
import ReportsAnalytics from './Components/ReportsAnalytics';
import Settings from './Components/Settings';
import StateManagement from './Components/StateManagement';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

// Placeholder components for other pages (to be built)
const PackagesManagement = PackageManagement;

const Admin = () => {
  // Check if user is logged in
  const adminToken = localStorage.getItem('adminToken');
  
  return (
    <Routes>
      {/* Admin Login Route */}
      <Route path="login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes with Layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="packages" element={<PackagesManagement />} />
        <Route path="states" element={<StateManagement />} />
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="customers" element={<CustomersManagement />} />
        <Route path="inquiries" element={<InquiriesManagement />} />
        <Route path="offers" element={<OffersManagement />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="gallery" element={<MediaGallery />} />
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Redirect /admin based on login status */}
      <Route index element={
        adminToken ? 
        <Navigate to="dashboard" replace /> : 
        <Navigate to="login" replace />
      } />
      
      {/* Redirect any unmatched admin routes based on login status */}
      <Route path="*" element={
        adminToken ? 
        <Navigate to="dashboard" replace /> : 
        <Navigate to="login" replace />
      } />
    </Routes>
  );
};

export default Admin;
