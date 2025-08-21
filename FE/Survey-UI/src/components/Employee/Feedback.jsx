import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Rate, Card, Typography, message, Divider, Radio, Upload, Modal, Spin } from 'antd';
import { SendOutlined, UploadOutlined, PaperClipOutlined, DeleteOutlined } from '@ant-design/icons';
// import { getApiUrl, getAuthHeaders } from '../../config/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Feedback = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tests, setTests] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      // Trong thực tế, sẽ gọi API để lấy danh sách bài khảo sát đã làm
      // const response = await fetch(getApiUrl('/api/Test/completed'), {
      //   headers: getAuthHeaders(),
      // });
      // const data = await response.json();
      // setTests(data);

      // Giả lập dữ liệu
      setTimeout(() => {
        const mockTests = [
          { id: 3, title: 'Khảo sát môi trường làm việc' },
          { id: 4, title: 'Đánh giá kỹ năng làm việc nhóm' },
          { id: 5, title: 'Khảo sát nhu cầu đào tạo' },
          { id: 6, title: 'Đánh giá hiệu suất Q1/2023' },
          { id: 7, title: 'Khảo sát văn hóa doanh nghiệp' },
        ];
        setTests(mockTests);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching tests:', error);
      message.error('Không thể tải danh sách bài khảo sát');
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // Xử lý file upload nếu có
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('files', file.originFileObj);
      });
      
      // Thêm các trường dữ liệu khác
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      // Trong thực tế, sẽ gọi API để gửi phản hồi
      // const response = await fetch(getApiUrl('/api/Feedback'), {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      //   body: formData,
      // });

      // Giả lập gửi phản hồi thành công
      setTimeout(() => {
        message.success('Gửi phản hồi thành công!');
        form.resetFields();
        setFileList([]);
        setSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      message.error('Không thể gửi phản hồi');
      setSubmitting(false);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList }) => setFileList(fileList);

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  // Hàm chuyển đổi file thành base64 để xem trước
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
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
      <Title level={2}>Phản hồi & Góp ý</Title>
      <Text type="secondary">Gửi phản hồi về bài khảo sát hoặc góp ý cải thiện hệ thống</Text>

      <Card style={{ marginTop: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            feedbackType: 'test',
            satisfaction: 3,
          }}
        >
          <Form.Item
            name="feedbackType"
            label="Loại phản hồi"
            rules={[{ required: true, message: 'Vui lòng chọn loại phản hồi!' }]}
          >
            <Radio.Group>
              <Radio value="test">Phản hồi về bài khảo sát</Radio>
              <Radio value="system">Góp ý về hệ thống</Radio>
              <Radio value="other">Khác</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="testId"
            label="Bài khảo sát"
            rules={[{ required: true, message: 'Vui lòng chọn bài khảo sát!' }]}
            dependencies={['feedbackType']}
          >
            <Select
              placeholder="Chọn bài khảo sát"
              disabled={form.getFieldValue('feedbackType') !== 'test'}
            >
              {tests.map(test => (
                <Option key={test.id} value={test.id}>{test.title}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="satisfaction"
            label="Mức độ hài lòng"
          >
            <Rate allowHalf />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung phản hồi"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi!' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Nhập nội dung phản hồi hoặc góp ý của bạn" 
            />
          </Form.Item>

          <Form.Item
            name="attachments"
            label="Tệp đính kèm (nếu có)"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false} // Ngăn upload tự động
            >
              {fileList.length >= 3 ? null : uploadButton}
            </Upload>
            <Text type="secondary">Hỗ trợ: JPG, PNG, PDF. Tối đa 3 tệp.</Text>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={submitting}
              size="large"
            >
              Gửi phản hồi
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>

      <Divider />

      <Title level={3}>Các phản hồi đã gửi</Title>
      <Text type="secondary">Bạn chưa gửi phản hồi nào.</Text>
    </div>
  );
};

export default Feedback;