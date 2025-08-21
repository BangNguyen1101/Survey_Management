import React, { useState, useEffect } from 'react';
import { Table, Typography, Tag, Button, Space, DatePicker, Select, Input, Card, Tooltip, Empty, Spin } from 'antd';
import { SearchOutlined, FilterOutlined, EyeOutlined, TrophyOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import { getApiUrl, getAuthHeaders } from '../../config/api';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const TestHistory = () => {
  const [loading, setLoading] = useState(true);
  const [testHistory, setTestHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [scoreFilter, setScoreFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [testHistory, searchText, dateRange, scoreFilter]);

  const fetchTestHistory = async () => {
    try {
      // Trong thực tế, sẽ gọi API để lấy lịch sử bài khảo sát
      // const response = await fetch(getApiUrl('/api/Test/history'), {
      //   headers: getAuthHeaders(),
      // });
      // const data = await response.json();
      // setTestHistory(data);

      // Giả lập dữ liệu
      setTimeout(() => {
        const mockHistory = [
          {
            id: 1,
            testId: 3,
            title: 'Khảo sát môi trường làm việc',
            completedDate: '2023-05-20',
            score: 85,
            totalQuestions: 10,
            correctAnswers: 8,
            timeSpent: 15, // phút
            department: 'Toàn công ty',
            feedback: 'Bài khảo sát tốt, đánh giá chính xác về môi trường làm việc',
          },
          {
            id: 2,
            testId: 4,
            title: 'Đánh giá kỹ năng làm việc nhóm',
            completedDate: '2023-04-10',
            score: 92,
            totalQuestions: 20,
            correctAnswers: 18,
            timeSpent: 25,
            department: 'Phòng Kỹ thuật',
            feedback: 'Đánh giá tốt về kỹ năng làm việc nhóm và giao tiếp',
          },
          {
            id: 3,
            testId: 5,
            title: 'Khảo sát nhu cầu đào tạo',
            completedDate: '2023-02-15',
            score: 78,
            totalQuestions: 12,
            correctAnswers: 9,
            timeSpent: 18,
            department: 'Toàn công ty',
            feedback: 'Cần cải thiện một số kỹ năng chuyên môn',
          },
          {
            id: 4,
            testId: 6,
            title: 'Đánh giá hiệu suất Q1/2023',
            completedDate: '2023-03-25',
            score: 88,
            totalQuestions: 15,
            correctAnswers: 13,
            timeSpent: 22,
            department: 'Phòng Kỹ thuật',
            feedback: 'Hiệu suất làm việc tốt, cần phát huy hơn nữa',
          },
          {
            id: 5,
            testId: 7,
            title: 'Khảo sát văn hóa doanh nghiệp',
            completedDate: '2023-01-10',
            score: 95,
            totalQuestions: 10,
            correctAnswers: 9,
            timeSpent: 12,
            department: 'Toàn công ty',
            feedback: 'Hiểu rõ về văn hóa doanh nghiệp',
          },
        ];
        setTestHistory(mockHistory);
        setFilteredHistory(mockHistory);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching test history:', error);
      setLoading(false);
    }
  };

  const filterHistory = () => {
    let filtered = [...testHistory];
    
    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Lọc theo khoảng thời gian
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');
      
      filtered = filtered.filter(item => {
        const completedDate = new Date(item.completedDate);
        return completedDate >= startDate.toDate() && completedDate <= endDate.toDate();
      });
    }
    
    // Lọc theo điểm số
    if (scoreFilter !== 'all') {
      switch (scoreFilter) {
        case 'excellent':
          filtered = filtered.filter(item => item.score >= 90);
          break;
        case 'good':
          filtered = filtered.filter(item => item.score >= 80 && item.score < 90);
          break;
        case 'average':
          filtered = filtered.filter(item => item.score >= 70 && item.score < 80);
          break;
        case 'below_average':
          filtered = filtered.filter(item => item.score < 70);
          break;
        default:
          break;
      }
    }
    
    setFilteredHistory(filtered);
  };

  const handleViewResult = (testId) => {
    navigate(`/employee/results/${testId}`);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#52c41a'; // Xuất sắc - xanh lá
    if (score >= 80) return '#1890ff'; // Tốt - xanh dương
    if (score >= 70) return '#faad14'; // Trung bình - vàng
    return '#f5222d'; // Dưới trung bình - đỏ
  };

  const columns = [
    {
      title: 'Tên bài khảo sát',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a onClick={() => handleViewResult(record.testId)}>{text}</a>
      ),
    },
    {
      title: 'Ngày hoàn thành',
      dataIndex: 'completedDate',
      key: 'completedDate',
      render: (date) => (
        <Space>
          <CalendarOutlined />
          {date}
        </Space>
      ),
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      key: 'score',
      render: (score) => (
        <Tooltip title={`${score}/100 điểm`}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TrophyOutlined style={{ color: getScoreColor(score), marginRight: '8px' }} />
            <span style={{ color: getScoreColor(score), fontWeight: 'bold' }}>{score}</span>
          </div>
        </Tooltip>
      ),
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: 'Câu trả lời đúng',
      dataIndex: 'correctAnswers',
      key: 'correctAnswers',
      render: (correct, record) => `${correct}/${record.totalQuestions}`,
    },
    {
      title: 'Thời gian làm bài',
      dataIndex: 'timeSpent',
      key: 'timeSpent',
      render: (time) => `${time} phút`,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewResult(record.testId)}
        >
          Xem kết quả
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Đang tải lịch sử bài khảo sát...</p>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Lịch sử khảo sát</Title>
      <Text type="secondary">Xem lại các bài khảo sát đã hoàn thành và kết quả</Text>

      <Card style={{ marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <Input
            placeholder="Tìm kiếm theo tên"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          
          <RangePicker 
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(dates) => setDateRange(dates)}
            style={{ width: 250 }}
          />
          
          <Select
            placeholder="Lọc theo điểm số"
            style={{ width: 200 }}
            value={scoreFilter}
            onChange={(value) => setScoreFilter(value)}
          >
            <Option value="all">Tất cả điểm số</Option>
            <Option value="excellent">Xuất sắc (≥ 90)</Option>
            <Option value="good">Tốt (80-89)</Option>
            <Option value="average">Trung bình (70-79)</Option>
            <Option value="below_average">Dưới trung bình (&lt; 70)</Option>
          </Select>
        </div>

        {filteredHistory.length === 0 ? (
          <Empty description="Không tìm thấy kết quả nào" />
        ) : (
          <Table 
            columns={columns} 
            dataSource={filteredHistory} 
            rowKey="id" 
            pagination={{ pageSize: 5 }}
          />
        )}
      </Card>
    </div>
  );
};

export default TestHistory;