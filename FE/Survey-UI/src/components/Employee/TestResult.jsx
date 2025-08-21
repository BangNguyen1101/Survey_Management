import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Descriptions, Tag, Progress, Divider, List, Space, Button, Collapse, Spin, Result } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined, TrophyOutlined, ArrowLeftOutlined, CommentOutlined } from '@ant-design/icons';
// import { getApiUrl, getAuthHeaders } from '../../config/api';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const TestResult = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchTestResult();
  }, [testId]);

  const fetchTestResult = async () => {
    try {
      // Trong thực tế, sẽ gọi API để lấy kết quả bài khảo sát
      // const response = await fetch(getApiUrl(`/api/Test/result/${testId}`), {
      //   headers: getAuthHeaders(),
      // });
      // const data = await response.json();
      // setResult(data);

      // Giả lập dữ liệu
      setTimeout(() => {
        const mockResult = {
          id: 1,
          testId: parseInt(testId),
          title: 'Khảo sát môi trường làm việc',
          description: 'Đánh giá mức độ hài lòng của nhân viên về môi trường làm việc',
          completedDate: '2023-05-20',
          submittedAt: '2023-05-20 14:30:45',
          score: 85,
          totalQuestions: 5,
          correctAnswers: 4,
          timeSpent: 15, // phút
          feedback: 'Bài làm tốt, thể hiện sự hiểu biết về môi trường làm việc và văn hóa công ty.',
          questions: [
            {
              id: 1,
              content: 'Bạn đánh giá như thế nào về môi trường làm việc hiện tại?',
              type: 'multiple_choice',
              options: [
                { id: 1, content: 'Rất không hài lòng' },
                { id: 2, content: 'Không hài lòng' },
                { id: 3, content: 'Bình thường' },
                { id: 4, content: 'Hài lòng' },
                { id: 5, content: 'Rất hài lòng' },
              ],
              userAnswer: 4,
              correctAnswer: null, // Không có đáp án đúng cho câu hỏi khảo sát
              score: 20,
              maxScore: 20,
              feedback: 'Đánh giá tích cực về môi trường làm việc',
            },
            {
              id: 2,
              content: 'Bạn thấy công việc hiện tại có phù hợp với kỹ năng và sở thích của mình không?',
              type: 'multiple_choice',
              options: [
                { id: 1, content: 'Hoàn toàn không phù hợp' },
                { id: 2, content: 'Không phù hợp' },
                { id: 3, content: 'Bình thường' },
                { id: 4, content: 'Phù hợp' },
                { id: 5, content: 'Rất phù hợp' },
              ],
              userAnswer: 5,
              correctAnswer: null,
              score: 20,
              maxScore: 20,
              feedback: 'Rất hài lòng với công việc hiện tại',
            },
            {
              id: 3,
              content: 'Bạn hài lòng với chế độ lương thưởng và phúc lợi hiện tại?',
              type: 'multiple_choice',
              options: [
                { id: 1, content: 'Rất không hài lòng' },
                { id: 2, content: 'Không hài lòng' },
                { id: 3, content: 'Bình thường' },
                { id: 4, content: 'Hài lòng' },
                { id: 5, content: 'Rất hài lòng' },
              ],
              userAnswer: 3,
              correctAnswer: null,
              score: 15,
              maxScore: 20,
              feedback: 'Đánh giá trung bình về chế độ lương thưởng',
            },
            {
              id: 4,
              content: 'Những yếu tố nào sau đây bạn cho rằng cần được cải thiện? (Có thể chọn nhiều đáp án)',
              type: 'checkbox',
              options: [
                { id: 1, content: 'Môi trường làm việc' },
                { id: 2, content: 'Chế độ lương thưởng' },
                { id: 3, content: 'Cơ hội thăng tiến' },
                { id: 4, content: 'Đào tạo và phát triển' },
                { id: 5, content: 'Văn hóa công ty' },
                { id: 6, content: 'Cân bằng công việc - cuộc sống' },
              ],
              userAnswer: [2, 3, 4],
              correctAnswer: null,
              score: 15,
              maxScore: 20,
              feedback: 'Đã chỉ ra được các yếu tố cần cải thiện',
            },
            {
              id: 5,
              content: 'Bạn có đề xuất hoặc ý kiến gì để cải thiện môi trường làm việc không?',
              type: 'essay',
              userAnswer: 'Công ty nên tổ chức thêm các hoạt động team building để tăng cường tinh thần đồng đội. Ngoài ra, cần có thêm các chương trình đào tạo kỹ năng chuyên môn và kỹ năng mềm cho nhân viên.',
              correctAnswer: null,
              score: 15,
              maxScore: 20,
              feedback: 'Đề xuất hợp lý và có tính xây dựng',
            },
          ],
        };
        
        setResult(mockResult);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching test result:', error);
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#52c41a'; // Xuất sắc - xanh lá
    if (score >= 80) return '#1890ff'; // Tốt - xanh dương
    if (score >= 70) return '#faad14'; // Trung bình - vàng
    return '#f5222d'; // Dưới trung bình - đỏ
  };

  const getScoreText = (score) => {
    if (score >= 90) return 'Xuất sắc';
    if (score >= 80) return 'Tốt';
    if (score >= 70) return 'Trung bình';
    return 'Cần cải thiện';
  };

  const renderAnswerContent = (question) => {
  switch (question.type) {
    case 'multiple_choice': {
      const selectedOption = question.options.find(opt => opt.id === question.userAnswer);
      return selectedOption ? selectedOption.content : 'Không có câu trả lời';
    }
    
    case 'checkbox': {
      if (!question.userAnswer || question.userAnswer.length === 0) {
        return 'Không có câu trả lời';
      }
      return (
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          {question.userAnswer.map(answerId => {
            const option = question.options.find(opt => opt.id === answerId);
            return option ? <li key={answerId}>{option.content}</li> : null;
          })}
        </ul>
      );
    }
    
    case 'essay': {
      return question.userAnswer || 'Không có câu trả lời';
    }
    
    default:
      return 'Không xác định';
  }
};


  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Đang tải kết quả bài khảo sát...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <Result
        status="warning"
        title="Không tìm thấy kết quả"
        subTitle="Không thể tìm thấy kết quả bài khảo sát này. Có thể bạn chưa hoàn thành bài khảo sát hoặc đã có lỗi xảy ra."
        extra={
          <Button type="primary" onClick={() => navigate('/employee/history')}>
            Quay lại lịch sử khảo sát
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/employee/history')}
            style={{ marginRight: '16px' }}
          >
            Quay lại
          </Button>
          <Title level={2} style={{ display: 'inline-block', margin: 0 }}>
            Kết quả khảo sát
          </Title>
        </div>
        <Tag color={getScoreColor(result.score)} style={{ fontSize: '16px', padding: '8px 12px' }}>
          <TrophyOutlined /> Điểm số: {result.score}/100 - {getScoreText(result.score)}
        </Tag>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <Descriptions title={result.title} bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
          <Descriptions.Item label="Ngày hoàn thành">{result.completedDate}</Descriptions.Item>
          <Descriptions.Item label="Thời gian nộp bài">{result.submittedAt}</Descriptions.Item>
          <Descriptions.Item label="Thời gian làm bài">{result.timeSpent} phút</Descriptions.Item>
          <Descriptions.Item label="Số câu hỏi">{result.totalQuestions}</Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Progress
            type="circle"
            percent={result.score}
            format={() => `${result.score}/100`}
            strokeColor={getScoreColor(result.score)}
            width={120}
          />
          <div style={{ marginTop: '16px' }}>
            <Text strong style={{ fontSize: '18px', color: getScoreColor(result.score) }}>
              {getScoreText(result.score)}
            </Text>
          </div>
        </div>

        {result.feedback && (
          <div style={{ marginTop: '24px', background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
            <Space>
              <CommentOutlined />
              <Text strong>Nhận xét của người đánh giá:</Text>
            </Space>
            <Paragraph style={{ marginTop: '8px', marginLeft: '24px' }}>
              {result.feedback}
            </Paragraph>
          </div>
        )}
      </Card>

      <Title level={3}>Chi tiết câu trả lời</Title>

      <Collapse defaultActiveKey={['1']} style={{ marginBottom: '24px' }}>
        {result.questions.map((question, index) => (
          <Panel 
            header={
              <Space>
                <Text strong>Câu {index + 1}:</Text>
                <Text>{question.content}</Text>
                <Tag color={question.score === question.maxScore ? '#52c41a' : '#1890ff'}>
                  {question.score}/{question.maxScore} điểm
                </Tag>
              </Space>
            } 
            key={question.id}
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Câu trả lời của bạn">
                {renderAnswerContent(question)}
              </Descriptions.Item>
              
              {question.feedback && (
                <Descriptions.Item label="Nhận xét">
                  {question.feedback}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Panel>
        ))}
      </Collapse>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Space>
          <Button 
            type="primary" 
            onClick={() => navigate('/employee/tests')}
          >
            Xem các bài khảo sát khác
          </Button>
          <Button 
            onClick={() => navigate('/employee/feedback')}
          >
            Gửi phản hồi về bài khảo sát
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default TestResult;