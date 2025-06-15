import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
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
  Switch,
} from "antd";
import {
  SearchOutlined,
  HomeOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { userService } from "../../../services/userManagement/userService";
import moment from "moment";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { Title } = Typography;

  // Hàm lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      if (response?.result?.content) {
        // Chuẩn hóa dữ liệu status
        const normalizedUsers = response.result.content.map((user) => ({
          ...user,
          status:
            user.status.toLowerCase() === "active" ? "active" : "inactive",
        }));
        setUsers(normalizedUsers);
      } else {
        message.error("Không tìm thấy dữ liệu người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      message.error("Lỗi khi tải dữ liệu người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Xử lý thay đổi trạng thái người dùng
  const handleStatusChange = async (user, newStatus) => {
    try {
      if (newStatus === "active") {
        await userService.activateUser(user.id);
        message.success(`Kích hoạt người dùng ${user.fullName} thành công`);
      } else {
        await userService.disableUser(user.id);
        message.success(`Vô hiệu hóa người dùng ${user.fullName} thành công`);
      }
      fetchUsers();
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
      message.error("Lỗi khi thay đổi trạng thái người dùng");
    }
  };

  // Làm mới dữ liệu
  const handleRefresh = () => {
    fetchUsers();
    message.success("Dữ liệu đã được làm mới");
  };

  // Lọc người dùng theo tìm kiếm, vai trò và trạng thái
  const filteredUsers = users.filter((user) => {
    const searchMatch =
      (user.username?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
      (user.fullName?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
      (user.phone?.toLowerCase() || "").includes(searchText.toLowerCase());
    const roleMatch =
      filterRole === "all" || user.roles?.includes(filterRole.toUpperCase());
    const statusMatch = filterStatus === "all" || user.status === filterStatus;
    return searchMatch && roleMatch && statusMatch;
  });

  // Cấu hình cột cho bảng
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
            <Typography.Text strong>{record.fullName || "N/A"}</Typography.Text>
            <Typography.Text type="secondary">
              {record.username || "N/A"}
            </Typography.Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "N/A",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) =>
        gender
          ? gender === "MALE"
            ? "Nam"
            : gender === "FEMALE"
            ? "Nữ"
            : "Khác"
          : "N/A",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (birthDate) =>
        birthDate ? moment(birthDate).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (address) => address || "N/A",
    },
    {
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      render: (roles) =>
        roles?.length > 0
          ? roles.map((role) => (
              <Tag key={role} color={role === "STAFF" ? "blue" : "red"}>
                {role === "STAFF" ? "Nhân viên" : role}
              </Tag>
            ))
          : "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space>
          <Badge
            status={status === "active" ? "success" : "error"}
            text={status === "active" ? "Hoạt động" : "Không hoạt động"}
          />
          <Switch
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
            checked={status === "active"}
            onChange={(checked) =>
              handleStatusChange(record, checked ? "active" : "inactive")
            }
          />
        </Space>
      ),
    },
  ];

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
                      <Select.Option value="staff">Nhân viên</Select.Option>
                      <Select.Option value="admin">Quản trị viên</Select.Option>
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
                    showTotal: (total) => `Tổng cộng ${total} người dùng`,
                  }}
                  scroll={{ x: "max-content" }}
                  locale={{
                    emptyText: "Không có dữ liệu người dùng",
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserManagement;
