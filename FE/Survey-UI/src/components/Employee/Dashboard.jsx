import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Tag, Typography, Alert, Spin } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import { getApiUrl, getAuthHeaders } from '../../config/api';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingTests: 0,
    completedTests: 0,
    totalTests: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Mô phỏng dữ liệu - trong thực tế sẽ lấy từ API
  useEffect(() => {
    // Giả lập gọi API
    setTimeout(() => {
      setStats({
        pendingTests: 2,
        completedTests: 5,
        totalTests: 7
      });

      setRecentTests([
        { id: 1, title: 'Khảo sát mức độ hài lòng Q2/2023', status: 'pending', dueDate: '2023-06-30' },
        { id: 2, title: 'Đánh giá năng lực nhân viên', status: 'pending', dueDate: '2023-07-15' },
        { id: 3, title: 'Khảo sát môi trường làm việc', status: 'completed', completedDate: '2023-05-20' },
        { id: 4, title: 'Đánh giá kỹ năng làm việc nhóm', status: 'completed', completedDate: '2023-04-10' },
      ]);

      setNotifications([
        { id: 1, message: 'Bạn có bài khảo sát mới cần hoàn thành', time: '2 giờ trước', read: false },
        { id: 2, message: 'Kết quả đánh giá năng lực đã được cập nhật', time: '1 ngày trước', read: true },
        { id: 3, message: 'Nhắc nhở: Còn 3 ngày để hoàn thành khảo sát', time: '2 ngày trước', read: true },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleTestClick = (testId) => {
    navigate(`/employee/tests/${testId}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Xin chào, Nhân viên!</Title>
      <Text type="secondary">Chào mừng bạn đến với hệ thống khảo sát nội bộ</Text>

      <Alert
        message="Bạn có 2 bài khảo sát đang chờ hoàn thành"
        type="info"
        showIcon
        style={{ margin: '24px 0' }}
        action={
          <a onClick={() => navigate('/employee/tests')}>Xem ngay</a>
        }
      />

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Bài khảo sát chờ làm"
              value={stats.pendingTests}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Bài khảo sát đã hoàn thành"
              value={stats.completedTests}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số bài khảo sát"
              value={stats.totalTests}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={16}>
          <Card title="Bài khảo sát gần đây" extra={<a onClick={() => navigate('/employee/tests')}>Xem tất cả</a>}>
            <List
              dataSource={recentTests}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a key="view" onClick={() => handleTestClick(item.id)}>
                      {item.status === 'pending' ? 'Làm bài' : 'Xem kết quả'}
                    </a>
                  ]}
                >
                  <List.Item.Meta
                    title={<a onClick={() => handleTestClick(item.id)}>{item.title}</a>}
                    description={
                      <>
                        <Tag color={item.status === 'pending' ? 'blue' : 'green'}>
                          {item.status === 'pending' ? 'Chưa làm' : 'Đã hoàn thành'}
                        </Tag>
                        {item.status === 'pending' 
                          ? <Text type="secondary"> Hạn nộp: {item.dueDate}</Text>
                          : <Text type="secondary"> Hoàn thành: {item.completedDate}</Text>
                        }
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Thông báo" extra={<a>Xem tất cả</a>}>
            <List
              dataSource={notifications}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<BellOutlined style={{ color: item.read ? '#d9d9d9' : '#1890ff' }} />}
                    title={<span style={{ fontWeight: item.read ? 'normal' : 'bold' }}>{item.message}</span>}
                    description={<Text type="secondary">{item.time}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;