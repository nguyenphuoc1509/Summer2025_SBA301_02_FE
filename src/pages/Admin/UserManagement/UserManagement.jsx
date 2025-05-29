import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Card,
  Row,
  Col,
  Typography,
  Breadcrumb,
  Tooltip,
  Badge,
  Avatar,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
  HomeOutlined,
  ReloadOutlined,
  UserOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const { Title } = Typography;

  // Giả lập dữ liệu người dùng
  useEffect(() => {
    setUsers([
      {
        id: 1,
        username: "user1",
        fullName: "Nguyễn Văn A",
        email: "user1@example.com",
        role: "user",
        status: "active",
        lastLogin: "2024-03-15 14:30",
        avatar: null,
      },
      {
        id: 2,
        username: "admin1",
        fullName: "Trần Thị B",
        email: "admin1@example.com",
        role: "admin",
        status: "active",
        lastLogin: "2024-03-15 15:45",
        avatar: null,
      },
    ]);
  }, []);

  const columns = [
    {
      title: "Người dùng",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            src={record.avatar}
            style={{ backgroundColor: "#1890ff" }}
          />
          <Space direction="vertical" size={0}>
            <Typography.Text strong>{record.fullName}</Typography.Text>
            <Typography.Text type="secondary">
              {record.username}
            </Typography.Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "purple" : "blue"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status === "active" ? "success" : "error"}
          text={status === "active" ? "Hoạt động" : "Không hoạt động"}
        />
      ),
    },
    {
      title: "Đăng nhập cuối",
      dataIndex: "lastLogin",
      key: "lastLogin",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = (user) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: `User: ${user.username}`,
      onOk: () => {
        setUsers(users.filter((u) => u.id !== user.id));
        message.success("User deleted successfully");
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingUser) {
        // Cập nhật người dùng
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? { ...user, ...values } : user
          )
        );
        message.success("User updated successfully");
      } else {
        // Thêm người dùng mới
        const newUser = {
          id: users.length + 1,
          ...values,
        };
        setUsers([...users, newUser]);
        message.success("User added successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Dữ liệu đã được làm mới");
    }, 1000);
  };

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    const roleMatch = filterRole === "all" || user.role === filterRole;
    const statusMatch = filterStatus === "all" || user.status === filterStatus;
    return searchMatch && roleMatch && statusMatch;
  });

  return (
    <div className="p-6">
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <HomeOutlined /> Trang chủ
                  </>
                ),
              },
              { title: "Quản lý người dùng" },
            ]}
          />
        </Col>

        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={24} className="flex justify-between items-center">
                <Title level={4} className="!mb-0">
                  Danh sách người dùng
                </Title>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => {
                    setEditingUser(null);
                    form.resetFields();
                    setIsModalVisible(true);
                  }}
                >
                  Thêm người dùng
                </Button>
              </Col>

              <Col span={24}>
                <Row gutter={[16, 16]} className="items-center">
                  <Col xs={24} sm={8} md={6}>
                    <Input
                      placeholder="Tìm kiếm người dùng"
                      prefix={<SearchOutlined />}
                      onChange={(e) => setSearchText(e.target.value)}
                      allowClear
                    />
                  </Col>
                  <Col xs={24} sm={8} md={4}>
                    <Select
                      placeholder="Lọc theo vai trò"
                      style={{ width: "100%" }}
                      onChange={(value) => setFilterRole(value)}
                      defaultValue="all"
                    >
                      <Select.Option value="all">Tất cả vai trò</Select.Option>
                      <Select.Option value="admin">Admin</Select.Option>
                      <Select.Option value="user">User</Select.Option>
                    </Select>
                  </Col>
                  <Col xs={24} sm={8} md={4}>
                    <Select
                      placeholder="Lọc theo trạng thái"
                      style={{ width: "100%" }}
                      onChange={(value) => setFilterStatus(value)}
                      defaultValue="all"
                    >
                      <Select.Option value="all">
                        Tất cả trạng thái
                      </Select.Option>
                      <Select.Option value="active">Hoạt động</Select.Option>
                      <Select.Option value="inactive">
                        Không hoạt động
                      </Select.Option>
                    </Select>
                  </Col>
                  <Col>
                    <Tooltip title="Làm mới dữ liệu">
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Table
                  columns={columns}
                  dataSource={filteredUsers}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    total: filteredUsers.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} người dùng`,
                  }}
                  scroll={{ x: "max-content" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingUser(null);
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              >
                <Select>
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="user">User</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select>
                  <Select.Option value="active">Hoạt động</Select.Option>
                  <Select.Option value="inactive">
                    Không hoạt động
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
