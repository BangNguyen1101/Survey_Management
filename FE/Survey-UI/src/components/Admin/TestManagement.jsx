import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Card,
  Tag,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  InputNumber,
  DatePicker,
  Transfer,
  Steps,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TrophyOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { getApiUrl, getAuthHeaders } from '../../config/api';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTests();
    fetchQuestions();
    fetchUsers();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/Test'), {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Không thể tải danh sách tests');
      }
      
      const data = await response.json();
      setTests(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
      message.error('Lỗi khi tải danh sách bài test');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(getApiUrl('/api/Question'), {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Không thể tải danh sách câu hỏi');
      }
      
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(getApiUrl('/api/User'), {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Không thể tải danh sách người dùng');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAdd = () => {
    setEditingTest(null);
    setCurrentStep(0);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingTest(record);
    setCurrentStep(0);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      timeLimit: record.timeLimit,
      passScore: record.passScore
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(getApiUrl(`/api/Test/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa bài test');
      }
      
      setTests(tests.filter(test => test.testId !== id));
      message.success('Xóa bài test thành công');
    } catch (error) {
      console.error('Error deleting test:', error);
      message.error('Lỗi khi xóa bài test: ' + error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const testData = {
        title: values.title,
        description: values.description,
        timeLimit: values.timeLimit,
        passScore: values.passScore
      };

      let response;
      
      if (editingTest) {
        // Update test
        response = await fetch(getApiUrl(`/api/Test/${editingTest.testId}`), {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(testData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Không thể cập nhật bài test');
        }
        
        // Update state
        setTests(tests.map(test => 
          test.testId === editingTest.testId ? { ...test, ...testData } : test
        ));
        message.success('Cập nhật bài test thành công');
      } else {
        // Add new test
        response = await fetch(getApiUrl('/api/Test'), {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(testData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Không thể thêm bài test');
        }
        
        const newTest = await response.json();
        setTests([...tests, newTest]);
        message.success('Thêm bài test thành công');
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error saving test:', error);
      message.error('Lỗi khi lưu bài test: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'Tên bài test',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.description}</div>
        </Space>
      ),
    },
    {
      title: 'Thông tin',
      key: 'info',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div style={{ fontSize: '12px' }}>
            <ClockCircleOutlined /> {record.timeLimit || 'N/A'} phút | 
            <CheckCircleOutlined /> {record.passScore || 'N/A'}% đạt
          </div>
        </Space>
      ),
    },
    {
      title: 'Số câu hỏi',
      key: 'questionCount',
      render: (_, record) => {
        const questionCount = questions.filter(q => q.testId === record.testId).length;
        return (
          <Tag color="blue">
            {questionCount} câu hỏi
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa bài test này?"
            onConfirm={() => handleDelete(record.testId)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleView = (test) => {
    const questionCount = questions.filter(q => q.testId === test.testId).length;
    Modal.info({
      title: 'Chi tiết bài test',
      width: 600,
      content: (
        <div>
          <p><strong>Tên:</strong> {test.title}</p>
          <p><strong>Mô tả:</strong> {test.description}</p>
          <p><strong>Thời gian:</strong> {test.timeLimit || 'N/A'} phút</p>
          <p><strong>Điểm đạt:</strong> {test.passScore || 'N/A'}%</p>
          <p><strong>Số câu hỏi:</strong> {questionCount}</p>
        </div>
      ),
    });
  };

  const steps = [
    {
      title: 'Thông tin cơ bản',
      content: (
        <div>
          <Form.Item
            name="title"
            label="Tên bài test"
            rules={[{ required: true, message: 'Vui lòng nhập tên bài test!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="timeLimit"
                label="Thời gian (phút)"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
              >
                <InputNumber min={1} max={300} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="passScore"
                label="Điểm đạt (%)"
                rules={[{ required: true, message: 'Vui lòng nhập điểm đạt!' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: 'Chọn câu hỏi',
      content: (
        <div>
          <Form.Item
            name="selectedQuestions"
            label="Chọn câu hỏi cho bài test"
          >
            <Transfer
              dataSource={questions.map(q => ({
                key: q.questionId,
                title: q.content,
                description: `${q.skill} - ${q.difficulty}`
              }))}
              titles={['Câu hỏi có sẵn', 'Câu hỏi đã chọn']}
              render={item => item.title}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Phân công',
      content: (
        <div>
          <Form.Item
            name="assignedUsers"
            label="Chọn người tham gia"
          >
            <Transfer
              dataSource={users.map(u => ({
                key: u.userId,
                title: u.fullName,
                description: `${u.departmentId} - ${u.level}`
              }))}
              titles={['Danh sách người dùng', 'Người được giao']}
              render={item => item.title}
            />
          </Form.Item>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Tổng số bài test"
                value={tests.length}
                prefix={<TrophyOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tổng số câu hỏi"
                value={questions.length}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tổng số người dùng"
                value={users.length}
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Trung bình câu hỏi/test"
                value={tests.length > 0 ? Math.round(questions.length / tests.length) : 0}
                prefix={<UserOutlined />}
              />
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Tạo bài test mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tests}
          loading={loading}
          rowKey="testId"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bài test`,
          }}
        />
      </Card>

      <Modal
        title={editingTest ? 'Sửa bài test' : 'Tạo bài test mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          {steps.map(item => (
            <Steps.Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {steps[currentStep].content}

          <Divider />

          <div style={{ textAlign: 'right' }}>
            <Space>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  Quay lại
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                  Tiếp theo
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="primary" htmlType="submit">
                  {editingTest ? 'Cập nhật' : 'Tạo bài test'}
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TestManagement;
