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
  Upload,
  Row,
  Col,
  Statistic,
  InputNumber,
  Divider,
  Checkbox
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockQuestions = [
        {
          id: 1,
          content: 'React Hook nào được sử dụng để quản lý state trong functional component?',
          type: 'multiple_choice',
          skill: 'React',
          difficulty: 'Junior',
          answers: [
            { id: 1, content: 'useState', isCorrect: true },
            { id: 2, content: 'useEffect', isCorrect: false },
            { id: 3, content: 'useContext', isCorrect: false },
            { id: 4, content: 'useReducer', isCorrect: false }
          ]
        },
        {
          id: 2,
          content: 'Giải thích khái niệm RESTful API và các nguyên tắc cơ bản.',
          type: 'essay',
          skill: 'Backend',
          difficulty: 'Senior',
          answers: []
        }
      ];
      setQuestions(mockQuestions);
    } catch (error) {
      message.error('Lỗi khi tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingQuestion(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingQuestion(record);
    form.setFieldsValue({
      ...record,
      answers: record.answers || []
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Replace with actual API call
      setQuestions(questions.filter(q => q.id !== id));
      message.success('Xóa câu hỏi thành công');
    } catch (error) {
      message.error('Lỗi khi xóa câu hỏi');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingQuestion) {
        // Update question
        setQuestions(questions.map(q => 
          q.id === editingQuestion.id ? { ...q, ...values } : q
        ));
        message.success('Cập nhật câu hỏi thành công');
      } else {
        // Add new question
        const newQuestion = {
          id: Date.now(),
          ...values
        };
        setQuestions([...questions, newQuestion]);
        message.success('Thêm câu hỏi thành công');
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi lưu câu hỏi');
    }
  };

  const columns = [
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'content',
      key: 'content',
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <Space size="small">
            <Tag color="blue">{record.skill}</Tag>
            <Tag color={record.difficulty === 'Junior' ? 'green' : record.difficulty === 'Middle' ? 'orange' : 'red'}>
              {record.difficulty}
            </Tag>
            <Tag color={record.type === 'multiple_choice' ? 'purple' : 'cyan'}>
              {record.type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
            </Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Kỹ năng',
      dataIndex: 'skill',
      key: 'skill',
      filters: [
        { text: 'React', value: 'React' },
        { text: 'Backend', value: 'Backend' },
        { text: 'Testing', value: 'Testing' },
        { text: 'BA', value: 'BA' }
      ],
      onFilter: (value, record) => record.skill === value,
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      filters: [
        { text: 'Junior', value: 'Junior' },
        { text: 'Middle', value: 'Middle' },
        { text: 'Senior', value: 'Senior' }
      ],
      onFilter: (value, record) => record.difficulty === value,
    },
    {
      title: 'Loại câu hỏi',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'multiple_choice' ? 'purple' : 'cyan'}>
          {type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
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
            title="Bạn có chắc muốn xóa câu hỏi này?"
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

  const handleView = (question) => {
    Modal.info({
      title: 'Chi tiết câu hỏi',
      width: 600,
      content: (
        <div>
          <p><strong>Nội dung:</strong> {question.content}</p>
          <p><strong>Kỹ năng:</strong> {question.skill}</p>
          <p><strong>Độ khó:</strong> {question.difficulty}</p>
          <p><strong>Loại:</strong> {question.type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}</p>
          {question.answers && question.answers.length > 0 && (
            <div>
              <p><strong>Đáp án:</strong></p>
              <ul>
                {question.answers.map((answer, index) => (
                  <li key={answer.id} style={{ color: answer.isCorrect ? 'green' : 'black' }}>
                    {String.fromCharCode(65 + index)}. {answer.content}
                    {answer.isCorrect && <Tag color="green">Đúng</Tag>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    });
  };

  const uploadProps = {
    name: 'file',
    action: '/api/questions/import',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        fetchQuestions();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '24px' }}>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none'
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'white' }}>Tổng số câu hỏi</span>}
              value={questions.length}
              prefix={<FileTextOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              border: 'none'
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title="Trắc nghiệm"
              value={questions.filter(q => q.type === 'multiple_choice').length}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              border: 'none'
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title="Tự luận"
              value={questions.filter(q => q.type === 'essay').length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
              border: 'none'
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title="Senior level"
              value={questions.filter(q => q.difficulty === 'Senior').length}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Card 
        style={{ 
          marginBottom: 24, 
          background: '#fafafa',
          border: '1px solid #f0f0f0'
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <Space wrap size="middle">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
          >
            Thêm câu hỏi
          </Button>
          <Upload {...uploadProps}>
            <Button 
              icon={<UploadOutlined />} 
              size="large"
              style={{ 
                background: '#fff',
                border: '1px solid #d9d9d9',
                color: '#666'
              }}
            >
              Import Excel
            </Button>
          </Upload>
          <Button 
            icon={<DownloadOutlined />} 
            size="large"
            style={{ 
              background: '#fff',
              border: '1px solid #d9d9d9',
              color: '#666'
            }}
          >
            Export Excel
          </Button>
        </Space>
      </Card>

        <Card 
          style={{ 
            background: '#fff',
            border: '1px solid #f0f0f0'
          }}
        >
          <Table
            columns={columns}
            dataSource={questions}
            loading={loading}
            rowKey="id"
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} câu hỏi`,
            }}
            style={{ background: '#fff' }}
          />
        </Card>

      <Modal
        title={editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="content"
            label="Nội dung câu hỏi"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="skill"
                label="Kỹ năng"
                rules={[{ required: true, message: 'Vui lòng chọn kỹ năng!' }]}
              >
                <Select placeholder="Chọn kỹ năng">
                  <Option value="React">React</Option>
                  <Option value="Vue">Vue</Option>
                  <Option value="Angular">Angular</Option>
                  <Option value="Backend">Backend</Option>
                  <Option value="Testing">Testing</Option>
                  <Option value="BA">BA</Option>
                  <Option value="DevOps">DevOps</Option>
                </Select>
              </Form.Item>
            </Col>
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
                name="type"
                label="Loại câu hỏi"
                rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi!' }]}
              >
                <Select placeholder="Chọn loại">
                  <Option value="multiple_choice">Trắc nghiệm</Option>
                  <Option value="essay">Tự luận</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="answers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={16} key={key} style={{ marginBottom: '8px' }}>
                    <Col span={16}>
                      <Form.Item
                        {...restField}
                        name={[name, 'content']}
                        rules={[{ required: true, message: 'Vui lòng nhập đáp án!' }]}
                      >
                        <Input placeholder="Nhập đáp án" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'isCorrect']}
                        valuePropName="checked"
                      >
                        <Checkbox>Đáp án đúng</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button type="link" danger onClick={() => remove(name)}>
                        Xóa
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm đáp án
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingQuestion ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionManagement;
