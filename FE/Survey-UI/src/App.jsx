import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Import components
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/Dashboard';
import UserManagement from './components/Admin/UserManagement';
import QuestionManagement from './components/Admin/QuestionManagement';
import TestManagement from './components/Admin/TestManagement';

// Import existing components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="questions" element={<QuestionManagement />} />
            <Route path="departments" element={<div>Quản lý phòng ban (Coming soon)</div>} />
            <Route path="tests" element={<TestManagement />} />
            <Route path="reports" element={<div>Báo cáo & Thống kê (Coming soon)</div>} />
            <Route path="settings" element={<div>Cài đặt hệ thống (Coming soon)</div>} />
          </Route>
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
