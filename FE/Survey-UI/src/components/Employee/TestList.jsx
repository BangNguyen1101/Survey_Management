import React, { useState, useEffect } from 'react';
import { List, Card, Tag, Button, Input, Select, Empty, Spin, Typography, Space, Badge } from 'antd';
import { SearchOutlined, FilterOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import { getApiUrl, getAuthHeaders } from '../../config/api';

const { Title, Text } = Typography;
const { Option } = Select;

const TestList = () => {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    filterTests();
  }, [tests, searchText, statusFilter]);

  const fetchTests = async () => {
    try {
      // Trong thực tế, sẽ gọi API để lấy danh sách bài khảo sát
      // const response = await fetch(getApiUrl('/api/Test/employee'), {
      //   headers: getAuthHeaders(),
      // });
      // const data = await response.json();
      // setTests(data);

      // Giả lập dữ liệu
      setTimeout(() => {
        const mockTests = [
          {
            id: 1,
            title: 'Khảo sát mức độ hài lòng Q2/2023',
            description: 'Đánh giá mức độ hài lòng của nhân viên về môi trường làm việc trong quý 2/2023',
            status: 'pending',
            dueDate: '2023-06-30',
            totalQuestions: 15,
            estimatedTime: 20,
            department: 'Toàn công ty',
            createdAt: '2023-05-15',
          },
          {
            id: 2,
            title: 'Đánh giá năng lực nhân viên',
            description: 'Bài đánh giá năng lực chuyên môn và kỹ năng mềm của nhân viên',
            status: 'pending',
            dueDate: '2023-07-15',
            totalQuestions: 25,
            estimatedTime: 45,
            department: 'Phòng Kỹ thuật',
            createdAt: '2023-06-01',
          },
          {
            id: 3,
            title: 'Khảo sát môi trường làm việc',
            description: 'Đánh giá về môi trường làm việc và văn hóa công ty',
            status: 'completed',
            completedDate: '2023-05-20',
            totalQuestions: 10,
            score: 85,
            department: 'Toàn công ty',
            createdAt: '2023-05-01',
          },
          {
            id: 4,
            title: 'Đánh giá kỹ năng làm việc nhóm',
            description: 'Bài đánh giá về kỹ năng làm việc nhóm và giao tiếp',
            status: 'completed',
            completedDate: '2023-04-10',
            totalQuestions: 20,
            score: 92,
            department: 'Phòng Kỹ thuật',
            createdAt: '2023-03-25',
          },
          {
            id: 5,
            title: 'Khảo sát nhu cầu đào tạo',
            description: 'Khảo sát về nhu cầu đào tạo và phát triển kỹ năng của nhân viên',
            status: 'completed',
            completedDate: '2023-02-15',
            totalQuestions: 12,
            score: 78,
            department: 'Toàn công ty',
            createdAt: '2023-02-01',
          },
        ];
        setTests(mockTests);
        setFilteredTests(mockTests);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setLoading(false);
    }
  };

  const filterTests = () => {
    let filtered = [...tests];
    
    // Lọc theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter(test => test.status === statusFilter);
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      filtered = filtered.filter(test => 
        test.title.toLowerCase().includes(searchText.toLowerCase()) ||
        test.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredTests(filtered);
  };

  const handleTestClick = (testId) => {
    navigate(`/employee/tests/${testId}`);
  };

  const renderTestStatus = (test) => {
    if (test.status === 'pending') {
      return (
        <Tag color="blue" icon={<ClockCircleOutlined />}>
          Chưa làm
        </Tag>
      );
    } else if (test.status === 'completed') {
      return (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Đã hoàn thành
        </Tag>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Đang tải danh sách bài khảo sát...</p>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Danh sách bài khảo sát</Title>
      <Text type="secondary">Xem và làm các bài khảo sát được giao</Text>

      <div style={{ margin: '24px 0', display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="Tìm kiếm bài khảo sát"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={(value) => setStatusFilter(value)}
            prefix={<FilterOutlined />}
          >
            <Option value="all">Tất cả</Option>
            <Option value="pending">Chưa làm</Option>
            <Option value="completed">Đã hoàn thành</Option>
          </Select>
        </Space>

        <Badge count={filteredTests.filter(test => test.status === 'pending').length}>
          <Button type="primary">
            Bài khảo sát chưa làm
          </Button>
        </Badge>
      </div>

      {filteredTests.length === 0 ? (
        <Empty description="Không tìm thấy bài khảo sát nào" />
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
          dataSource={filteredTests}
          renderItem={test => (
            <List.Item>
              <Card
                title={test.title}
                extra={renderTestStatus(test)}
                hoverable
                onClick={() => handleTestClick(test.id)}
              >
                <div style={{ height: 100, overflow: 'hidden' }}>
                  <p>{test.description}</p>
                </div>
                <div style={{ marginTop: 16 }}>
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">Phòng ban: {test.department}</Text>
                    <Text type="secondary">Số câu hỏi: {test.totalQuestions}</Text>
                    {test.status === 'pending' ? (
                      <Text type="secondary">Hạn nộp: {test.dueDate}</Text>
                    ) : (
                      <Text type="secondary">Điểm số: {test.score}/100</Text>
                    )}
                  </Space>
                </div>
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <Button type="primary">
                    {test.status === 'pending' ? 'Làm bài' : 'Xem kết quả'}
                  </Button>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default TestList;