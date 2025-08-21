import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Steps, Form, Radio, Input, Checkbox, Space, Row, Col, Divider, Modal, Progress, message, Spin, Tag, Alert } from 'antd';
import { ClockCircleOutlined, CheckOutlined, SaveOutlined, SendOutlined, LeftOutlined, RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import { getApiUrl, getAuthHeaders } from '../../config/api';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

const TestDetail = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [test, setTest] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [timer, setTimer] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchTestDetails();
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [testId]);

  const fetchTestDetails = async () => {
    try {
      // Trong thực tế, sẽ gọi API để lấy chi tiết bài khảo sát
      // const response = await fetch(getApiUrl(`/api/Test/${testId}`), {
      //   headers: getAuthHeaders(),
      // });
      // const data = await response.json();
      // setTest(data);

      // Giả lập dữ liệu
      setTimeout(() => {
        const mockTest = {
          id: parseInt(testId),
          title: 'Khảo sát mức độ hài lòng Q2/2023',
          description: 'Đánh giá mức độ hài lòng của nhân viên về môi trường làm việc trong quý 2/2023',
          instructions: 'Vui lòng trả lời tất cả các câu hỏi một cách trung thực. Thông tin của bạn sẽ được giữ bí mật và chỉ được sử dụng cho mục đích cải thiện môi trường làm việc.',
          timeLimit: 30, // phút
          totalQuestions: 5,
          status: 'pending',
          dueDate: '2023-06-30',
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
              required: true,
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
              required: true,
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
              required: true,
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
              required: true,
            },
            {
              id: 5,
              content: 'Bạn có đề xuất hoặc ý kiến gì để cải thiện môi trường làm việc không?',
              type: 'essay',
              required: false,
            },
          ],
        };
        
        setTest(mockTest);
        setTimeLeft(mockTest.timeLimit * 60); // Chuyển đổi phút thành giây
        startTimer(mockTest.timeLimit * 60);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching test details:', error);
      message.error('Không thể tải thông tin bài khảo sát');
      setLoading(false);
    }
  };

  const startTimer = (seconds) => {
  setTimeLeft(seconds); // reset trước khi chạy
  const interval = setInterval(() => {
    setTimeLeft((prevTime) => {
      if (prevTime <= 1) {
        clearInterval(interval);
        message.warning('Hết thời gian làm bài!');
        handleSubmit();
        return 0;
      }
      return prevTime - 1;
    });
  }, 1000);
  setTimer(interval);
};


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
  form.validateFields()
    .then(() => {
      // Nếu validate ok thì sang câu tiếp theo
      if (currentStep < test.questions.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    })
    .catch(() => {
      const currentQuestion = test?.questions?.[currentStep];
      // Nếu câu hiện tại không bắt buộc thì vẫn cho đi tiếp
      if (currentQuestion && !currentQuestion.required) {
        if (currentStep < test.questions.length - 1) {
          setCurrentStep((prev) => prev + 1);
        }
      }
    });
};


  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const values = form.getFieldsValue();
      setAnswers({ ...answers, ...values });
      
      // Trong thực tế, sẽ gọi API để lưu nháp
      // const response = await fetch(getApiUrl(`/api/Test/${testId}/draft`), {
      //   method: 'POST',
      //   headers: getAuthHeaders(),
      //   body: JSON.stringify(values),
      // });

      message.success('Đã lưu nháp bài làm!');
    } catch (error) {
      console.error('Error saving draft:', error);
      message.error('Không thể lưu nháp bài làm');
    }
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    
    try {
      const values = form.getFieldsValue();
      const finalAnswers = { ...answers, ...values };
      
      // Trong thực tế, sẽ gọi API để nộp bài
      // const response = await fetch(getApiUrl(`/api/Test/${testId}/submit`), {
      //   method: 'POST',
      //   headers: getAuthHeaders(),
      //   body: JSON.stringify(finalAnswers),
      // });

      // Giả lập nộp bài thành công
      setTimeout(() => {
        message.success('Nộp bài thành công!');
        if (timer) clearInterval(timer);
        navigate('/employee/tests');
        setSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error('Error submitting test:', error);
      message.error('Không thể nộp bài');
      setSubmitting(false);
    }
  };

  const showSubmitConfirm = () => {
    setShowConfirm(true);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <Form.Item
            name={`question_${question.id}`}
            rules={[{ required: question.required, message: 'Vui lòng chọn một đáp án!' }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                {question.options.map(option => (
                  <Radio key={option.id} value={option.id}>{option.content}</Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
        );
      
      case 'checkbox':
        return (
          <Form.Item
            name={`question_${question.id}`}
            rules={[{ required: question.required, message: 'Vui lòng chọn ít nhất một đáp án!' }]}
          >
            <Checkbox.Group>
              <Space direction="vertical">
                {question.options.map(option => (
                  <Checkbox key={option.id} value={option.id}>{option.content}</Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>
        );
      
      case 'essay':
        return (
          <Form.Item
            name={`question_${question.id}`}
            rules={[{ required: question.required, message: 'Vui lòng nhập câu trả lời!' }]}
          >
            <TextArea rows={6} placeholder="Nhập câu trả lời của bạn" />
          </Form.Item>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Đang tải bài khảo sát...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={2}>{test.title}</Title>
          <Text type="secondary">{test.description}</Text>
        </div>
        <div>
          <Tag color="blue" icon={<ClockCircleOutlined />} style={{ fontSize: '16px', padding: '8px 12px' }}>
            Thời gian còn lại: {formatTime(timeLeft)}
          </Tag>
        </div>
      </div>

      <Alert
        message="Hướng dẫn làm bài"
        description={test.instructions}
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={24}>
        <Col xs={24} md={6}>
          <Card title="Tiến độ làm bài" style={{ marginBottom: '24px' }}>
            <Progress
              type="circle"
              percent={Math.round((currentStep + 1) / test.questions.length * 100)}
              format={() => `${currentStep + 1}/${test.questions.length}`}
              style={{ marginBottom: '16px', display: 'block', textAlign: 'center' }}
            />
            <Steps
              direction="vertical"
              size="small"
              current={currentStep}
              style={{ marginTop: '16px' }}
            >
              {test.questions.map((question, index) => (
                <Step
                  key={question.id}
                  title={`Câu ${index + 1}`}
                  onClick={() => setCurrentStep(index)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Steps>
          </Card>

          <div style={{ marginTop: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                icon={<SaveOutlined />} 
                block 
                onClick={handleSaveDraft}
              >
                Lưu nháp
              </Button>
              <Button 
                type="primary" 
                icon={<SendOutlined />} 
                block 
                onClick={showSubmitConfirm}
              >
                Nộp bài
              </Button>
            </Space>
          </div>
        </Col>

        <Col xs={24} md={18}>
          <Card>
            <Form form={form} layout="vertical">
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ fontSize: '18px' }}>
                  Câu {currentStep + 1}: {test.questions[currentStep].content}
                </Text>
                {test.questions[currentStep].required && (
                  <Tag color="red" style={{ marginLeft: '8px' }}>Bắt buộc</Tag>
                )}
              </div>

              {renderQuestion(test.questions[currentStep])}

              <Divider />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  type="default" 
                  onClick={handlePrev} 
                  disabled={currentStep === 0}
                  icon={<LeftOutlined />}
                >
                  Câu trước
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleNext} 
                  disabled={currentStep === test.questions.length - 1}
                  icon={<RightOutlined />}
                >
                  Câu tiếp theo
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Xác nhận nộp bài"
        open={showConfirm}
        onOk={handleSubmit}
        onCancel={() => setShowConfirm(false)}
        confirmLoading={submitting}
        okText="Nộp bài"
        cancelText="Hủy"
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ExclamationCircleOutlined style={{ fontSize: '22px', color: '#faad14', marginRight: '16px' }} />
          <div>
            <p>Bạn có chắc chắn muốn nộp bài?</p>
            <p>Sau khi nộp bài, bạn sẽ không thể chỉnh sửa câu trả lời.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TestDetail;