import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  // Kiểm tra token
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Kiểm tra quyền truy cập dựa trên role
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      const userRole = user.role?.toLowerCase() || '';
      const path = location.pathname;
      
      // Nếu người dùng không phải admin nhưng cố gắng truy cập trang admin
      if (path.startsWith('/admin') && !userRole.includes('admin')) {
        console.log('Unauthorized access to admin page, redirecting to employee page');
        return <Navigate to="/employee" replace />;
      }
      
      // Nếu người dùng là admin nhưng cố gắng truy cập trang employee
      // Bỏ comment dòng dưới nếu muốn admin không được truy cập trang employee
      // if (path.startsWith('/employee') && userRole.includes('admin')) {
      //   console.log('Admin accessing employee page, redirecting to admin page');
      //   return <Navigate to="/admin" replace />;
      // }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  return children;
};

export default ProtectedRoute;
