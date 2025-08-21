import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Button, message } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  HistoryOutlined,
  CommentOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const EmployeeLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Invalid user data in localStorage:", e);
        setUser(null);
      }
    }
  }, []);
  
  const menuItems = [
    {
      key: '/employee',
      icon: <DashboardOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/employee/profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
    },
    {
      key: '/employee/tests',
      icon: <FileTextOutlined />,
      label: 'Bài khảo sát',
    },
    {
      key: '/employee/history',
      icon: <HistoryOutlined />,
      label: 'Lịch sử khảo sát',
    },
    {
      key: '/employee/feedback',
      icon: <CommentOutlined />,
      label: 'Phản hồi & Góp ý',
    },
    {
      key: '/employee/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt tài khoản',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    message.success('Đăng xuất thành công!');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
      onClick: () => navigate('/employee/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt tài khoản',
      onClick: () => navigate('/employee/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        theme="light"
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#1890ff',
          fontSize: collapsed ? '16px' : '18px',
          fontWeight: 'bold',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {collapsed ? 'SM' : 'Survey Management'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 'none' }}
        />
      </Sider>
      
      <Layout style={{ background: '#f5f5f5' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 999
        }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
              Trang Nhân Viên
            </span>
          </Space>
          
          <Space size="large">
            <Badge count={3}>
              <Button type="text" icon={<BellOutlined />} size="large" />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <span style={{ color: '#333' }}>{user?.fullName || 'Nhân viên'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: '24px', 
          padding: '24px', 
          background: '#fff', 
          borderRadius: '8px',
          minHeight: 'calc(100vh - 112px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'auto'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default EmployeeLayout;