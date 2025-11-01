import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services';

// Protected Route for regular users
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Protected Route for admin users
export const AdminProtectedRoute = ({ children }) => {
  const isAdminAuthenticated = authService.isAdminAuthenticated();
  
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

