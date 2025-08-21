import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, Avatar, Row, Col, Typography, message, Divider, Descriptions, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, TeamOutlined } from '@ant-design/icons';
import { getApiUrl, getAuthHeaders, API_ENDPOINTS } from '../../config/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Trong thực tế, sẽ gọi API để lấy thông tin người dùng
      // const response = await fetch(getApiUrl(API_ENDPOINTS.USERS_ME), {
      //   headers: getAuthHeaders(),
      // });
      // const data = await response.json();
      // setUser(data);

      // Giả lập dữ liệu
      setTimeout(() => {
        const userData = {
          id: 1,
          fullName: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          department: 'Phòng Kỹ thuật',
          role: 'Nhân viên',
          level: 'Senior',
          joinDate: '01/01/2020',
          phone: '0987654321',
          address: 'Hà Nội, Việt Nam',
          avatar: null
        };
        setUser(userData);
        profileForm.setFieldsValue({
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      message.error('Không thể tải thông tin người dùng');
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (values) => {
    setUpdating(true);
    try {
      // Trong thực tế, sẽ gọi API để cập nhật thông tin
      // const response = await fetch(getApiUrl(API_ENDPOINTS.USERS_ME), {
      //   method: 'PUT',
      //   headers: getAuthHeaders(),
      //   body: JSON.stringify(values),
      // });
      // const data = await response.json();

      // Giả lập cập nhật thành công
      setTimeout(() => {
        setUser({
          ...user,
          ...values,
        });
        message.success('Cập nhật thông tin thành công!');
        setUpdating(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Không thể cập nhật thông tin');
      setUpdating(false);
    }
  };

  const handleChangePassword = async (values) => {
    setUpdating(true);
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.CHANGE_PASSWORD), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        message.success('Đổi mật khẩu thành công!');
        passwordForm.resetFields();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Không thể đổi mật khẩu');
      }
    
    } catch (error) {
      console.error('Error changing password:', error);
      message.error('Không thể đổi mật khẩu: Lỗi kết nối');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Hồ sơ cá nhân</Title>
      <Text type="secondary">Xem và cập nhật thông tin cá nhân của bạn</Text>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                src={user?.avatar} 
                style={{ backgroundColor: '#1890ff' }}
              />
              <Title level={4} style={{ marginTop: '16px', marginBottom: '4px' }}>{user?.fullName}</Title>
              <Text type="secondary">{user?.role} - {user?.department}</Text>
              
              <Divider />
              
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
                <Descriptions.Item label="Phòng ban">{user?.department}</Descriptions.Item>
                <Descriptions.Item label="Chức vụ">{user?.role}</Descriptions.Item>
                <Descriptions.Item label="Cấp bậc">{user?.level}</Descriptions.Item>
                <Descriptions.Item label="Ngày vào làm">{user?.joinDate}</Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={16}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Thông tin cá nhân" key="1">
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleUpdateProfile}
                  initialValues={{
                    fullName: user?.fullName,
                    email: user?.email,
                    phone: user?.phone,
                    address: user?.address,
                  }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Vui lòng nhập email!' },
                          { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="Email" disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                      >
                        <Input placeholder="Số điện thoại" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="address"
                        label="Địa chỉ"
                      >
                        <Input placeholder="Địa chỉ" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={updating}>
                      Cập nhật thông tin
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              
              <TabPane tab="Đổi mật khẩu" key="2">
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handleChangePassword}
                >
                  <Form.Item
                    name="currentPassword"
                    label="Mật khẩu hiện tại"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu hiện tại" />
                  </Form.Item>
                  
                  <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
                  </Form.Item>
                  
                  <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu mới"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={updating}>
                      Đổi mật khẩu
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;