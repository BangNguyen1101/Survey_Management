import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Space, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, ApiOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../../config/api';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const navigate = useNavigate();

  const testApiConnection = async () => {
    try {
      console.log('Testing API connection to:', getApiUrl('/api/User/test'));
      
      const response = await fetch(getApiUrl('/api/User/test'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setApiStatus('success');
        message.success(`Kết nối API thành công! ${data.message}`);
      } else {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        setApiStatus('error');
        message.error(`API server đang chạy nhưng có lỗi! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setApiStatus('error');
      message.error(`Không thể kết nối đến API server! Error: ${error.message}`);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login response:', data); // Debug log
        
        // Kiểm tra cấu trúc response
        if (data.accessToken) {
          localStorage.setItem('token', data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          message.success('Đăng nhập thành công!');
          navigate('/admin');
        } else {
          message.error('Response không hợp lệ từ server!');
        }
      } else {
        try {
          const errorData = await response.json();
          message.error(errorData.message || 'Email hoặc mật khẩu không đúng!');
        } catch {
          message.error(`Lỗi ${response.status}: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Lỗi kết nối! Vui lòng kiểm tra lại API server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            Survey Management
          </Title>
          <Text type="secondary">Đăng nhập vào hệ thống</Text>
        </div>

        {apiStatus === 'error' && (
          <Alert
            message="Lỗi kết nối API"
            description="API server chưa được khởi động. Vui lòng chạy lệnh 'dotnet run' trong thư mục SurveyManagement."
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<LoginOutlined />}
              size="large"
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              icon={<ApiOutlined />}
              size="large"
              block
              onClick={testApiConnection}
            >
              Kiểm tra kết nối API
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Space>
              <Text type="secondary">Chưa có tài khoản?</Text>
              <Link to="/register">
                <Text type="primary" style={{ fontWeight: 'bold' }}>
                  Đăng ký ngay
                </Text>
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
