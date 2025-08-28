import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Card,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BankOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { getApiUrl, getAuthHeaders } from '../../config/api';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/Department'), {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      } else {
        message.error('Lỗi khi tải danh sách phòng ban');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      message.error('Lỗi khi tải danh sách phòng ban');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDepartment(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingDepartment(record);
    form.setFieldsValue({
      departmentName: record.departmentName
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(getApiUrl(`/api/Department/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        message.success('Xóa phòng ban thành công');
        fetchDepartments();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Lỗi khi xóa phòng ban');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      message.error('Lỗi khi xóa phòng ban');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const departmentData = {
        departmentName: values.departmentName
      };

      let response;
      if (editingDepartment) {
        // Update department
        departmentData.departmentId = editingDepartment.departmentId;
        response = await fetch(getApiUrl(`/api/Department/${editingDepartment.departmentId}`), {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(departmentData),
        });
      } else {
        // Add new department
        response = await fetch(getApiUrl('/api/Department'), {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(departmentData),
        });
      }
      
      if (response.ok) {
        message.success(editingDepartment ? 'Cập nhật phòng ban thành công' : 'Thêm phòng ban thành công');
        setModalVisible(false);
        form.resetFields();
        fetchDepartments();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Lỗi khi lưu phòng ban');
      }
    } catch (error) {
      console.error('Error saving department:', error);
      message.error('Lỗi khi lưu phòng ban');
    }
  };

  const columns = [
    {
      title: 'Tên phòng ban',
      dataIndex: 'departmentName',
      key: 'departmentName',
      render: (text) => (
        <Space>
          <BankOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Sửa phòng ban">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              Sửa
            </Button>
          </Tooltip>
          <Tooltip title="Xóa phòng ban">
            <Popconfirm
              title="Bạn có chắc muốn xóa phòng ban này?"
              description="Hành động này không thể hoàn tác"
              onConfirm={() => handleDelete(record.departmentId)}
              okText="Có"
              cancelText="Không"
              okType="danger"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="Tổng số phòng ban"
                value={departments.length}
                prefix={<BankOutlined />}
              />
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Thêm phòng ban
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchDepartments}
            >
              Làm mới
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={departments}
          loading={loading}
          rowKey="departmentId"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} phòng ban`,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </Card>

      <Modal
        title={editingDepartment ? 'Sửa phòng ban' : 'Thêm phòng ban'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="departmentName"
            label="Tên phòng ban"
            rules={[
              { required: true, message: 'Vui lòng nhập tên phòng ban!' },
              { min: 2, message: 'Tên phòng ban phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tên phòng ban" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingDepartment ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;

