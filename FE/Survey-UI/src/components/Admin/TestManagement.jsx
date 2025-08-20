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
      // TODO: Replace with actual API call
      const mockTests = [
        {
          id: 1,
          title: 'Test kỹ năng React',
          description: 'Bài test đánh giá kiến thức React cơ bản',
          duration: 60,
          passingScore: 70,
          totalQuestions: 20,
          skill: 'React',
          difficulty: 'Junior',
          status: 'active',
          assignedUsers: 25,
          completedUsers: 18,
          startDate: '2024-01-01',
          endDate: '2024-01-31'
        },
        {
          id: 2,
          title: 'Test kiến thức Testing',
          description: 'Bài test về các phương pháp testing',
          duration: 90,
          passingScore: 80,
          totalQuestions: 30,
          skill: 'Testing',
          difficulty: 'Middle',
          status: 'upcoming',
          assignedUsers: 15,
          completedUsers: 0,
          startDate: '2024-02-01',
          endDate: '2024-02-28'
        }
      ];
      setTests(mockTests);
    } catch (error) {
      message.error('Lỗi khi tải danh sách bài test');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    // TODO: Replace with actual API call
    setQuestions([
      { id: 1, content: 'React Hook nào được sử dụng để quản lý state?', skill: 'React', difficulty: 'Junior' },
      { id: 2, content: 'Giải thích khái niệm RESTful API', skill: 'Backend', difficulty: 'Senior' }
    ]);
  };

  const fetchUsers = async () => {
    // TODO: Replace with actual API call
    setUsers([
      { id: 1, name: 'Nguyễn Văn A', department: 'IT', level: 'Junior' },
      { id: 2, name: 'Trần Thị B', department: 'QA', level: 'Middle' }
    ]);
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
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Replace with actual API call
      setTests(tests.filter(test => test.id !== id));
      message.success('Xóa bài test thành công');
    } catch (error) {
      message.error('Lỗi khi xóa bài test');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTest) {
        // Update test
        setTests(tests.map(test => 
          test.id === editingTest.id ? { ...test, ...values } : test
        ));
        message.success('Cập nhật bài test thành công');
      } else {
        // Add new test
        const newTest = {
          id: Date.now(),
          ...values,
          status: 'upcoming',
          assignedUsers: 0,
          completedUsers: 0
        };
        setTests([...tests, newTest]);
        message.success('Thêm bài test thành công');
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi lưu bài test');
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
          <Space size="small">
            <Tag color="blue">{record.skill}</Tag>
            <Tag color={record.difficulty === 'Junior' ? 'green' : record.difficulty === 'Middle' ? 'orange' : 'red'}>
              {record.difficulty}
            </Tag>
          </Space>
          <div style={{ fontSize: '12px' }}>
            <ClockCircleOutlined /> {record.duration} phút | 
            <CheckCircleOutlined /> {record.passingScore}% đạt
          </div>
        </Space>
      ),
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>Từ: {record.startDate}</div>
          <div>Đến: {record.endDate}</div>
        </div>
      ),
    },
    {
      title: 'Tham gia',
      key: 'participation',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>Đã giao: {record.assignedUsers}</div>
          <div>Hoàn thành: {record.completedUsers}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? 'Đang diễn ra' : 'Sắp diễn ra'}
        </Tag>
      ),
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
            onConfirm={() => handleDelete(record.id)}
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
    Modal.info({
      title: 'Chi tiết bài test',
      width: 600,
      content: (
        <div>
          <p><strong>Tên:</strong> {test.title}</p>
          <p><strong>Mô tả:</strong> {test.description}</p>
          <p><strong>Thời gian:</strong> {test.duration} phút</p>
          <p><strong>Điểm đạt:</strong> {test.passingScore}%</p>
          <p><strong>Số câu hỏi:</strong> {test.totalQuestions}</p>
          <p><strong>Kỹ năng:</strong> {test.skill}</p>
          <p><strong>Độ khó:</strong> {test.difficulty}</p>
        </div>
      ),
    });
  };

  const steps = [
    {
      title: 'Thông tin cơ bản',
      content: (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Tên bài test"
                rules={[{ required: true, message: 'Vui lòng nhập tên bài test!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="skill"
                label="Kỹ năng"
                rules={[{ required: true, message: 'Vui lòng chọn kỹ năng!' }]}
              >
                <Select placeholder="Chọn kỹ năng">
                  <Option value="React">React</Option>
                  <Option value="Vue">Vue</Option>
                  <Option value="Backend">Backend</Option>
                  <Option value="Testing">Testing</Option>
                  <Option value="BA">BA</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="difficulty"
                label="Độ khó"
                rules={[{ required: true, message: 'Vui lòng chọn độ khó!' }]}
              >
                <Select placeholder="Chọn độ khó">
                  <Option value="Junior">Junior</Option>
                  <Option value="Middle">Middle</Option>
                  <Option value="Senior">Senior</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="duration"
                label="Thời gian (phút)"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
              >
                <InputNumber min={1} max={300} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="passingScore"
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
                key: q.id,
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
                key: u.id,
                title: u.name,
                description: `${u.department} - ${u.level}`
              }))}
              titles={['Danh sách người dùng', 'Người được giao']}
              render={item => item.title}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Ngày bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="Ngày kết thúc"
                rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
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
                title="Đang diễn ra"
                value={tests.filter(t => t.status === 'active').length}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Sắp diễn ra"
                value={tests.filter(t => t.status === 'upcoming').length}
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tổng người tham gia"
                value={tests.reduce((sum, test) => sum + test.assignedUsers, 0)}
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
          rowKey="id"
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
