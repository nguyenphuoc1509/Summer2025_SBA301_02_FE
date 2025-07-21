import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Select,
  Upload,
  Tabs,
  Spin,
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Divider,
  Badge,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
  GlobalOutlined,
  FileTextOutlined,
  PictureOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { personService } from "../../../services/personManagement/personService";
import moment from "moment";
import { countryService } from "../../../services/countryManagement/countryService";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

const PersonManagement = () => {
  const [persons, setPersons] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPerson, setEditingPerson] = useState(null);
  const [viewingPerson, setViewingPerson] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState("ACTOR");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchPersons();
    fetchCountries();
  }, []);

  const fetchPersons = async () => {
    console.log("Starting to fetch persons...");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const response = await personService.getAllPersons();
      console.log("Person API response:", response);

      if (response && response.result && response.result.content) {
        setPersons(response.result.content);
      } else {
        console.error("Unexpected response structure:", response);
        setPersons([]);
      }
    } catch (error) {
      console.error("Error fetching persons:", error);
      message.error(`Failed to fetch persons: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await countryService.getAllCountries();
      setCountries(response.result.content);
    } catch (error) {
      message.error("Không thể tải danh sách quốc gia");
    }
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "images",
      key: "avatar",
      width: 80,
      render: (images, record) => (
        <Avatar
          size={50}
          src={images && images[0] ? images[0] : null}
          icon={<UserOutlined />}
          style={{
            border: "2px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
      ),
    },
    {
      title: "Thông tin",
      key: "info",
      render: (_, record) => (
        <div>
          <div
            style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}
          >
            {record.name}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>ID: {record.id}</div>
        </div>
      ),
    },
    {
      title: "Nghề nghiệp",
      dataIndex: "occupation",
      key: "occupation",
      render: (occupation) => (
        <Tag
          icon={occupation === "DIRECTOR" ? <ManOutlined /> : <WomanOutlined />}
          color={occupation === "DIRECTOR" ? "blue" : "green"}
          style={{ borderRadius: "16px", padding: "4px 12px" }}
        >
          {occupation === "DIRECTOR" ? "Đạo diễn" : "Diễn viên"}
        </Tag>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (date) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <CalendarOutlined style={{ color: "#1890ff" }} />
          <span>{date ? moment(date).format("DD/MM/YYYY") : "N/A"}</span>
        </div>
      ),
      sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate),
    },
    {
      title: "Quốc gia",
      dataIndex: "country",
      key: "country",
      render: (country) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <GlobalOutlined style={{ color: "#52c41a" }} />
          <span>{country || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ borderRadius: "6px" }}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              style={{ borderRadius: "6px" }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa người này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                style={{ borderRadius: "6px" }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingPerson(null);
    form.resetFields();
    setFileList([]);
    setActiveTab("ACTOR");
    setIsModalVisible(true);
    form.setFieldsValue({ occupation: "ACTOR" });
  };

  const handleEdit = async (person) => {
    setEditingPerson(person);
    setActiveTab(person.occupation || "ACTOR");
    setIsModalVisible(true);
    setModalLoading(true);

    try {
      const response = await personService.getPersonById(person.id);
      const fullPersonData = response.result;

      console.log("Full person data:", fullPersonData);

      setEditingPerson(fullPersonData);
      setActiveTab(fullPersonData.occupation || "ACTOR");

      const birthDate = fullPersonData.birthDate
        ? moment(fullPersonData.birthDate).format("YYYY-MM-DD")
        : null;

      const countryObj = countries.find(
        (c) => c.name === fullPersonData.country
      );
      const countryId = countryObj ? countryObj.id : null;

      form.setFieldsValue({
        name: fullPersonData.name,
        description: fullPersonData.description,
        birthDate: birthDate,
        height: fullPersonData.height,
        occupation: fullPersonData.occupation || "ACTOR",
        biography: fullPersonData.biography,
        countryId: countryId,
      });

      setFileList(
        fullPersonData.images
          ? fullPersonData.images.map((url, index) => ({
              uid: `existing-${index}`,
              name: url.substring(url.lastIndexOf("/") + 1),
              status: "done",
              url: url,
              isExisting: true,
            }))
          : []
      );
    } catch (error) {
      message.error("Không thể lấy thông tin chi tiết person");
      console.error("Error fetching person details:", error);
      setIsModalVisible(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await personService.deletePerson(id);
      message.success("Xóa Person thành công");
      fetchPersons();
    } catch (error) {
      message.error("Failed to delete person.");
      console.error("Error deleting person:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setModalLoading(true);

      const personData = {
        name: values.name,
        description: values.description,
        birthDate: values.birthDate,
        height: values.height ? parseFloat(values.height) : 0.0,
        occupation: values.occupation,
        biography: values.biography,
        countryId: values.countryId,
      };

      const newFiles = fileList
        .filter((file) => file.originFileObj && !file.isExisting)
        .map((file) => file.originFileObj);

      if (editingPerson) {
        await personService.updatePerson(
          editingPerson.id,
          personData,
          newFiles
        );
        message.success("Cập nhật Person thành công");
      } else {
        await personService.createPerson(personData, newFiles);
        message.success("Thêm Person thành công");
      }

      setIsModalVisible(false);
      setModalLoading(false);
      fetchPersons();
    } catch (error) {
      message.error("Failed to save person.");
      console.error("Error saving person:", error);
      setModalLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    form.setFieldsValue({ images: newFileList });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    form.setFieldsValue({ occupation: key });
  };

  const handleViewDetails = async (person) => {
    setViewingPerson(null);
    setIsViewModalVisible(true);
    setDetailLoading(true);

    try {
      const response = await personService.getPersonById(person.id);
      const personData = response.result;
      setViewingPerson(personData);
    } catch (error) {
      message.error("Không thể lấy thông tin chi tiết person");
      console.error("Error fetching person details:", error);
      setIsViewModalVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          background: "white",
        }}
        bodyStyle={{ padding: "20px 24px" }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              <UserOutlined style={{ marginRight: "12px" }} />
              Quản lý Nhân vật
            </Title>
            <Text type="secondary">
              Quản lý thông tin diễn viên và đạo diễn trong hệ thống
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Input
                placeholder="Tìm kiếm nhân vật..."
                prefix={<SearchOutlined />}
                style={{
                  width: "300px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                style={{
                  borderRadius: "8px",
                  height: "40px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  boxShadow: "0 2px 8px rgba(24,144,255,0.3)",
                }}
              >
                Thêm nhân vật
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          background: "white",
        }}
        bodyStyle={{ padding: "0" }}
      >
        {loading && persons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px", color: "#666" }}>
              Đang tải danh sách nhân vật...
            </div>
          </div>
        ) : filteredPersons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px" }}>
            <UserOutlined
              style={{
                fontSize: "64px",
                color: "#d9d9d9",
                marginBottom: "16px",
              }}
            />
            <Title level={4} type="secondary">
              Chưa có nhân vật nào
            </Title>
            <Text type="secondary">
              Hãy thêm nhân vật đầu tiên để bắt đầu quản lý
            </Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredPersons}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} nhân vật`,
            }}
            loading={loading}
            style={{ borderRadius: "12px" }}
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UserOutlined style={{ color: "#1890ff" }} />
            <span>
              {editingPerson ? "Chỉnh sửa nhân vật" : "Thêm nhân vật mới"}
            </span>
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setFileList([]);
          form.resetFields();
          setModalLoading(false);
        }}
        width={700}
        confirmLoading={modalLoading}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {modalLoading && editingPerson ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
            <p style={{ marginTop: "16px", color: "#666" }}>
              Đang tải thông tin...
            </p>
          </div>
        ) : (
          <div>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              style={{ marginBottom: 16 }}
              items={[
                {
                  key: "ACTOR",
                  label: (
                    <span>
                      <WomanOutlined />
                      Diễn viên
                    </span>
                  ),
                },
                {
                  key: "DIRECTOR",
                  label: (
                    <span>
                      <ManOutlined />
                      Đạo diễn
                    </span>
                  ),
                },
              ]}
            />

            <Form form={form} layout="vertical">
              <Form.Item
                name="occupation"
                initialValue={activeTab}
                style={{ display: "none" }}
              >
                <Input />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label={
                      <span>
                        <UserOutlined style={{ marginRight: "4px" }} />
                        Họ và tên
                      </span>
                    }
                    rules={[
                      { required: true, message: "Vui lòng nhập tên nhân vật" },
                    ]}
                  >
                    <Input placeholder="Nhập họ tên..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="birthDate"
                    label={
                      <span>
                        <CalendarOutlined style={{ marginRight: "4px" }} />
                        Ngày sinh
                      </span>
                    }
                    rules={[
                      { required: true, message: "Vui lòng nhập ngày sinh" },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          const selectedDate = new Date(value);
                          const currentDate = new Date();
                          if (selectedDate > currentDate) {
                            return Promise.reject(
                              "Ngày sinh không thể trong tương lai"
                            );
                          }
                          if (selectedDate.getFullYear() < 1800) {
                            return Promise.reject("Năm sinh không hợp lệ");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input type="date" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="height" label={<span>Chiều cao (mét)</span>}>
                    <Input type="number" step="0.01" placeholder="VD: 1.75" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="countryId"
                    label={
                      <span>
                        <GlobalOutlined style={{ marginRight: "4px" }} />
                        Quốc gia
                      </span>
                    }
                    rules={[
                      { required: true, message: "Vui lòng chọn quốc gia" },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Chọn quốc gia"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {countries.map((country) => (
                        <Select.Option key={country.id} value={country.id}>
                          {country.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label={
                  <span>
                    <FileTextOutlined style={{ marginRight: "4px" }} />
                    Mô tả ngắn
                  </span>
                }
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              >
                <TextArea rows={3} placeholder="Mô tả ngắn về nhân vật..." />
              </Form.Item>

              <Form.Item
                name="biography"
                label={
                  <span>
                    <FileTextOutlined style={{ marginRight: "4px" }} />
                    Tiểu sử chi tiết
                  </span>
                }
                rules={[{ required: true, message: "Vui lòng nhập tiểu sử" }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Tiểu sử chi tiết của nhân vật..."
                />
              </Form.Item>

              <Form.Item
                name="images"
                label={
                  <span>
                    <PictureOutlined style={{ marginRight: "4px" }} />
                    Hình ảnh
                  </span>
                }
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng tải lên ít nhất một hình ảnh",
                  },
                ]}
              >
                <Upload
                  beforeUpload={() => false}
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  accept="image/*"
                  multiple
                >
                  {fileList.length < 5 && (
                    <div style={{ textAlign: "center" }}>
                      <UploadOutlined
                        style={{ fontSize: "16px", marginBottom: "4px" }}
                      />
                      <div>Tải ảnh lên</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* View Details Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <EyeOutlined style={{ color: "#1890ff" }} />
            <span>Chi tiết nhân vật</span>
          </div>
        }
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={900}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        {detailLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
            <p style={{ marginTop: "16px", color: "#666" }}>
              Đang tải thông tin...
            </p>
          </div>
        ) : viewingPerson ? (
          <div>
            <Row gutter={[24, 24]}>
              {/* Basic Info Card */}
              <Col span={12}>
                <Card
                  title={
                    <span>
                      <UserOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      Thông tin cơ bản
                    </span>
                  }
                  size="small"
                  style={{ height: "100%" }}
                >
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Text strong>ID: </Text>
                      <Badge
                        count={viewingPerson.id}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    </div>
                    <div>
                      <Text strong>Tên: </Text>
                      <Text>{viewingPerson.name}</Text>
                    </div>
                    <div>
                      <Text strong>Nghề nghiệp: </Text>
                      <Tag
                        color={
                          viewingPerson.occupation === "DIRECTOR"
                            ? "blue"
                            : "green"
                        }
                        style={{ borderRadius: "12px" }}
                      >
                        {viewingPerson.occupation === "DIRECTOR"
                          ? "Đạo diễn"
                          : "Diễn viên"}
                      </Tag>
                    </div>
                    <div>
                      <Text strong>Ngày sinh: </Text>
                      <Text>
                        {viewingPerson.birthDate
                          ? moment(viewingPerson.birthDate).format("DD/MM/YYYY")
                          : "Chưa có thông tin"}
                      </Text>
                    </div>
                    <div>
                      <Text strong>Chiều cao: </Text>
                      <Text>
                        {viewingPerson.height
                          ? `${viewingPerson.height} m`
                          : "Chưa có thông tin"}
                      </Text>
                    </div>
                    <div>
                      <Text strong>Quốc gia: </Text>
                      <Text>
                        {viewingPerson.country || "Chưa có thông tin"}
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>

              {/* Description Card */}
              <Col span={12}>
                <Card
                  title={
                    <span>
                      <FileTextOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      Mô tả
                    </span>
                  }
                  size="small"
                  style={{ height: "100%" }}
                >
                  <Paragraph>
                    {viewingPerson.description || "Chưa có mô tả"}
                  </Paragraph>
                </Card>
              </Col>
            </Row>

            {/* Biography Section */}
            <Card
              title={
                <span>
                  <FileTextOutlined
                    style={{ marginRight: "8px", color: "#1890ff" }}
                  />
                  Tiểu sử
                </span>
              }
              size="small"
              style={{ marginTop: "16px" }}
            >
              <Paragraph style={{ whiteSpace: "pre-wrap" }}>
                {viewingPerson.biography || "Chưa có thông tin tiểu sử"}
              </Paragraph>
            </Card>

            {/* Images Section */}
            <Card
              title={
                <span>
                  <PictureOutlined
                    style={{ marginRight: "8px", color: "#1890ff" }}
                  />
                  Hình ảnh (
                  {viewingPerson.images ? viewingPerson.images.length : 0})
                </span>
              }
              size="small"
              style={{ marginTop: "16px" }}
            >
              {viewingPerson.images && viewingPerson.images.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {viewingPerson.images.map((url, index) => (
                    <Col key={index} xs={12} sm={8} md={6}>
                      <div
                        style={{
                          width: "100%",
                          height: "150px",
                          overflow: "hidden",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src={url}
                          alt={`${viewingPerson.name} - ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#999",
                  }}
                >
                  <PictureOutlined
                    style={{ fontSize: "48px", marginBottom: "16px" }}
                  />
                  <div>Chưa có hình ảnh</div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "50px", color: "#999" }}>
            Không có thông tin
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PersonManagement;
