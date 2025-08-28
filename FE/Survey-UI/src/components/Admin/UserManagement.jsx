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
  Tooltip,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  UploadOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { getApiUrl, getAuthHeaders } from '../../config/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/User'), {
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        message.error('Lỗi khi tải danh sách người dùng');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(getApiUrl('/api/Department'), {
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      // Giả sử có API endpoint cho roles, nếu không thì dùng hardcode
      setRoles([
        // { roleId: 1, roleName: 'Admin' }, // Ẩn khỏi danh sách chọn
        { roleId: 2, roleName: 'User' },
        { roleId: 3, roleName: 'HR' },
        { roleId: 4, roleName: 'Manager' }
      ]);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    // Mặc định vai trò User khi thêm mới
    form.setFieldsValue({ roleId: 2 });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    // Map dữ liệu từ backend sang form
    const formData = {
      fullName: record.fullName,
      email: record.email,
      roleId: record.roleId,
      departmentId: record.departmentId,
      level: record.level,
      password: '' // Không hiển thị password cũ
    };
    form.setFieldsValue(formData);
    setModalVisible(true);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(getApiUrl(`/api/User/${userId}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        message.success('Xóa người dùng thành công');
        fetchUsers(); // Reload danh sách
      } else {
        message.error('Lỗi khi xóa người dùng');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Lỗi khi xóa người dùng');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const userData = {
        fullName: values.fullName,
        email: values.email,
        password: values.password || undefined, // Chỉ gửi password nếu có
        roleId: values.roleId,
        level: values.level,
        departmentId: values.departmentId
      };

      let response;
      if (editingUser) {
        // Update user - chỉ gửi password nếu có thay đổi
        if (!userData.password) {
          delete userData.password;
        }
        response = await fetch(getApiUrl(`/api/User/${editingUser.userId}`), {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(userData),
        });
      } else {
        // Add new user
        response = await fetch(getApiUrl('/api/User'), {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(userData),
        });
      }
      
      if (response.ok) {
        message.success(editingUser ? 'Cập nhật người dùng thành công' : 'Thêm người dùng thành công');
        setModalVisible(false);
        form.resetFields();
        fetchUsers(); // Reload danh sách
      } else {
        let msg = 'Lỗi khi lưu người dùng';
        // Đọc body một lần rồi thử parse JSON
        const raw = await response.text();
        try {
          const errorData = raw ? JSON.parse(raw) : null;
          if (errorData) msg = errorData.message || errorData.error || msg;
          else if (raw) msg = `${msg}: ${raw}`;
        } catch {
          if (raw) msg = `${msg}: ${raw}`;
        }
        message.error(`${msg} (HTTP ${response.status})`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      message.error('Lỗi khi lưu người dùng');
    }
  };

  const handleExportExcel = () => {
    try {
      // Chuẩn bị dữ liệu để export
      const exportData = users.map(user => {
        const role = roles.find(r => r.roleId === user.roleId);
        const dept = departments.find(d => d.departmentId === user.departmentId);
        
        return {
          'ID': user.userId,
          'Họ tên': user.fullName,
          'Email': user.email,
          'Vai trò': role ? role.roleName : 'Unknown',
          'Phòng ban': dept ? dept.departmentName : 'N/A',
          'Level': user.level || 'N/A',
          'Ngày tạo': user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'
        };
      });

      // Tạo workbook và worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách người dùng');

      // Điều chỉnh độ rộng cột
      const colWidths = [
        { wch: 8 },   // ID
        { wch: 25 },  // Họ tên
        { wch: 30 },  // Email
        { wch: 15 },  // Vai trò
        { wch: 20 },  // Phòng ban
        { wch: 12 },  // Level
        { wch: 15 }   // Ngày tạo
      ];
      ws['!cols'] = colWidths;

      // Tạo file Excel
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Tạo tên file với timestamp
      const fileName = `Danh_sach_nguoi_dung_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Download file
      saveAs(data, fileName);
      
      message.success('Xuất Excel thành công!');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      message.error('Lỗi khi xuất Excel');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 80,
      sorter: (a, b) => a.userId - b.userId,
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => (
        <div style={{ fontWeight: 'bold' }}>{text}</div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId) => {
        const role = roles.find(r => r.roleId === roleId);
        const roleName = role ? role.roleName : 'Unknown';
        
        const colors = {
          'Admin': 'red',
          'HR': 'blue',
          'Manager': 'green',
          'User': 'default'
        };
        return <Tag color={colors[roleName]}>{roleName}</Tag>;
      },
    },
    {
      title: 'Phòng ban',
      dataIndex: 'departmentId',
      key: 'departmentId',
      render: (departmentId) => {
        const dept = departments.find(d => d.departmentId === departmentId);
        return dept ? dept.departmentName : 'N/A';
      },
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        if (!level) return 'N/A';
        const colors = {
          'senior': 'green',
          'middle': 'blue',
          'fresher': 'orange'
        };
        return <Tag color={colors[level.toLowerCase()]}>{level}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => {
        // Ẩn thao tác Sửa/Xóa cho tài khoản Admin (roleId === 1)
        if (record.roleId === 1) {
          return null;
        }
        return (
          <Space size="middle">
            <Tooltip title="Sửa người dùng">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                Sửa
              </Button>
            </Tooltip>
            <Tooltip title="Xóa người dùng">
              <Popconfirm
                title="Bạn có chắc muốn xóa người dùng này?"
                description="Hành động này không thể hoàn tác"
                onConfirm={() => handleDelete(record.userId)}
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
        );
      },
    },
  ];

  

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Tổng số người dùng"
                value={users.length}
                prefix={<UserOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Admin"
                value={users.filter(u => u.roleId === 1).length}
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Senior"
                value={users.filter(u => u.level && u.level.toLowerCase() === 'senior').length}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Middle/Fresher"
                value={users.filter(u => u.level && (u.level.toLowerCase() === 'middle' || u.level.toLowerCase() === 'fresher')).length}
                valueStyle={{ color: '#1890ff' }}
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
              Thêm người dùng
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchUsers}
            >
              Làm mới
            </Button>
            
            <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
              Export Excel
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="userId"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50'],
          }}
          defaultSortOrder="ascend"
          sortDirections={["ascend", "descend"]}
        />
      </Card>

      <Modal
        title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="Nhập họ tên đầy đủ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input placeholder="example@company.com" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roleId"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select placeholder="Chọn vai trò">
                  {roles
                    // Đảm bảo không hiển thị Admin nếu có trong danh sách
                    .filter(r => r.roleId !== 1)
                    .map(role => (
                      <Option key={role.roleId} value={role.roleId}>{role.roleName}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="departmentId"
                label="Phòng ban"
                rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
              >
                <Select placeholder="Chọn phòng ban">
                  {departments.map(dept => (
                    <Option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: 'Vui lòng chọn level!' }]}
              >
                <Select placeholder="Chọn level">
                  <Option value="fresher">Fresher</Option>
                  <Option value="middle">Middle</Option>
                  <Option value="senior">Senior</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
                              <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    { required: !editingUser, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                  ]}
                  extra={editingUser ? "Để trống nếu không muốn thay đổi mật khẩu" : ""}
                >
                  <Input.Password placeholder={editingUser ? "Để trống nếu không đổi" : "Nhập mật khẩu"} />
                </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
