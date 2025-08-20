import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Button, Space } from 'antd';
import { UserOutlined, TeamOutlined, FileTextOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDepartments: 0,
    totalQuestions: 0,
    totalTests: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch dashboard data from API
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now
      setStats({
        totalUsers: 156,
        totalDepartments: 8,
        totalQuestions: 1247,
        totalTests: 23
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const columns = [
    {
      title: 'Tên bài test',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Số người tham gia',
      dataIndex: 'participants',
      key: 'participants',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'active' ? 'green' : 'orange',
          fontWeight: 'bold'
        }}>
          {status === 'active' ? 'Đang diễn ra' : 'Sắp diễn ra'}
        </span>
      ),
    },
  ];

  const quickActions = [
    {
      title: 'Quản lý người dùng',
      icon: <UserOutlined />,
      color: '#1890ff',
      path: '/admin/users'
    },
    {
      title: 'Quản lý phòng ban',
      icon: <TeamOutlined />,
      color: '#52c41a',
      path: '/admin/departments'
    },
    {
      title: 'Quản lý câu hỏi',
      icon: <FileTextOutlined />,
      color: '#faad14',
      path: '/admin/questions'
    },
    {
      title: 'Quản lý bài test',
      icon: <TrophyOutlined />,
      color: '#f5222d',
      path: '/admin/tests'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Dashboard Admin</h1>
      
      {/* Thống kê tổng quan */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Phòng ban"
              value={stats.totalDepartments}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Câu hỏi"
              value={stats.totalQuestions}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bài test"
              value={stats.totalTests}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        {quickActions.map((action, index) => (
          <Col span={6} key={index}>
            <Card
              hoverable
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate(action.path)}
            >
              <div style={{ fontSize: '32px', color: action.color, marginBottom: '8px' }}>
                {action.icon}
              </div>
              <div style={{ fontWeight: 'bold' }}>{action.title}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Bài test gần đây */}
      <Card title="Bài test gần đây" style={{ marginBottom: '24px' }}>
        <Table
          columns={columns}
          dataSource={[
            {
              key: '1',
              name: 'Test kỹ năng React',
              department: 'Development',
              participants: 25,
              status: 'active'
            },
            {
              key: '2',
              name: 'Test kiến thức Testing',
              department: 'QA',
              participants: 18,
              status: 'upcoming'
            }
          ]}
          pagination={false}
        />
      </Card>

      {/* Thống kê theo role */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Phân bố theo Role">
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '16px' }}>
                <span>Admin: </span>
                <Progress percent={15} size="small" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span>HR: </span>
                <Progress percent={20} size="small" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span>Quản lý: </span>
                <Progress percent={25} size="small" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span>Nhân viên: </span>
                <Progress percent={40} size="small" />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Phân bố theo Level">
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '16px' }}>
                <span>Junior: </span>
                <Progress percent={35} size="small" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span>Middle: </span>
                <Progress percent={45} size="small" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span>Senior: </span>
                <Progress percent={20} size="small" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
