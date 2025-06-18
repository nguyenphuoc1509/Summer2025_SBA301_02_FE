import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  Card,
  Row,
  Col,
  Typography,
  Breadcrumb,
  Tooltip,
  Badge,
  Switch,
  Tabs,
  Descriptions,
  List,
  Tag,
  Empty,
} from "antd";
import {
  SearchOutlined,
  HomeOutlined,
  ReloadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import cinemaService from "../../../services/cinemaManagement/cinemaService";
import moment from "moment";

const { Title } = Typography;

const CinemaManagement = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [cinemaDetails, setCinemaDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetch cinema list
  const fetchCinemas = async () => {
    try {
      setLoading(true);
      const response = await cinemaService.getAllCinemas();
      if (response?.result) {
        setCinemas(response.result);
      } else {
        throw new Error(response?.message || "No data found");
      }
    } catch (error) {
      console.error("Error fetching cinemas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  // Fetch cinema details
  const fetchCinemaDetails = async (id) => {
    try {
      setDetailsLoading(true);
      const response = await cinemaService.getCinemaById(id);
      if (response?.result) {
        setCinemaDetails(response.result);
      } else {
        throw new Error(response?.message || "No details found");
      }
    } catch (error) {
      console.error("Error fetching cinema details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Show cinema details modal
  const showDetailsModal = async (id) => {
    setSelectedCinemaId(id);
    await fetchCinemaDetails(id);
    setIsDetailsModalVisible(true);
  };

  // Activate/deactivate cinema
  const handleActivateCinema = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await cinemaService.activateCinema(id);
      setCinemas(
        cinemas.map((cinema) =>
          cinema.id === id ? { ...cinema, active: newStatus } : cinema
        )
      );
    } catch (error) {
      console.error("Error activating cinema:", error);
    }
  };

  // Filter and search
  const filteredCinemas = cinemas.filter((cinema) => {
    const searchMatch =
      cinema.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      cinema.hotline?.toLowerCase().includes(searchText.toLowerCase()) ||
      cinema.address?.toLowerCase().includes(searchText.toLowerCase()) ||
      cinema.province?.toLowerCase().includes(searchText.toLowerCase());
    const activeMatch =
      filterActive === "all" || cinema.active === (filterActive === "true");
    return searchMatch && activeMatch;
  });

  // Open form for create or update
  const showModal = async (id = null) => {
    setSelectedCinemaId(id);
    if (id) {
      // Fetch cinema details to get the most up-to-date data including rooms
      try {
        setLoading(true);
        const response = await cinemaService.getCinemaById(id);
        if (response?.result) {
          const cinemaData = response.result;
          form.setFieldsValue({
            name: cinemaData.name,
            hotline: cinemaData.hotline,
            address: cinemaData.address,
            province: cinemaData.province,
            roomRequestList: cinemaData.roomResponseList?.map((room) => ({
              id: room.id,
              name: room.name,
              roomType: room.roomType,
              seatCount: room.seatCount,
              rowCount: room.rowCount,
            })) || [{}],
            ticketPriceRequests: cinemaData.ticketPrices?.map((price) => ({
              id: price.priceId,
              dateType: price.dateType,
              price: price.price,
            })) || [
              { dateType: "WEEKDAY", price: 0 },
              { dateType: "WEEKEND", price: 0 },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching cinema details for edit:", error);
      } finally {
        setLoading(false);
      }
    } else {
      form.resetFields();
      form.setFieldsValue({
        roomRequestList: [{}],
        ticketPriceRequests: [
          { dateType: "WEEKDAY", price: 0 },
          { dateType: "WEEKEND", price: 0 },
        ],
      });
    }
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleCreateOrUpdateCinema = async (values) => {
    try {
      const requestBody = {
        name: values.name,
        address: values.address,
        hotline: values.hotline,
        province: values.province,
        requestType: selectedCinemaId ? "UPDATE" : "CREATE",
        roomRequestList: values.roomRequestList.map((room) => ({
          ...room,
          id: selectedCinemaId && room.id ? room.id : undefined,
          requestType: selectedCinemaId && room.id ? "UPDATE" : "CREATE",
        })),
        ticketPriceRequests:
          values.ticketPriceRequests?.map((price) => ({
            ...price,
            id: selectedCinemaId && price.id ? price.id : undefined,
          })) || [],
      };

      if (selectedCinemaId) {
        requestBody.id = selectedCinemaId;
      }

      await cinemaService.createCinema(requestBody);
      fetchCinemas();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating/updating cinema:", error);
    }
  };

  // Table columns configuration
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Cinema Name", dataIndex: "name", key: "name" },
    { title: "Hotline", dataIndex: "hotline", key: "hotline" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Province", dataIndex: "province", key: "province" },
    {
      title: "Status",
      key: "active",
      render: (_, record) => (
        <Space>
          <Badge
            status={record.active ? "success" : "error"}
            text={record.active ? "Active" : "Inactive"}
          />
          <Switch
            checked={record.active}
            onChange={() => handleActivateCinema(record.id, record.active)}
            checkedChildren="On"
            unCheckedChildren="Off"
          />
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showDetailsModal(record.id)}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => showModal(record.id)}
          >
            Sửa
          </Button>
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
              { title: <HomeOutlined /> },
              { title: "Cinema Management" },
            ]}
          />
        </Col>

        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={24} className="flex justify-between items-center">
                <Title level={4} className="!mb-0">
                  Cinema List
                </Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showModal()}
                >
                  Add New
                </Button>
              </Col>

              <Col span={24}>
                <Row gutter={[16, 16]} className="items-center">
                  <Col xs={24} sm={8} md={6}>
                    <Input
                      placeholder="Search cinemas"
                      prefix={<SearchOutlined />}
                      onChange={(e) => setSearchText(e.target.value)}
                      allowClear
                    />
                  </Col>
                  <Col xs={24} sm={8} md={4}>
                    <Select
                      placeholder="Filter by status"
                      style={{ width: "100%" }}
                      onChange={(value) => setFilterActive(value)}
                      defaultValue="all"
                    >
                      <Select.Option value="all">All</Select.Option>
                      <Select.Option value="true">Active</Select.Option>
                      <Select.Option value="false">Inactive</Select.Option>
                    </Select>
                  </Col>
                  <Col>
                    <Tooltip title="Refresh data">
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchCinemas}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Table
                  columns={columns}
                  dataSource={filteredCinemas}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    total: filteredCinemas.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} cinemas`,
                  }}
                  scroll={{ x: "max-content" }}
                  locale={{ emptyText: "No cinema data" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Create/Update Cinema Modal */}
      <Modal
        title={selectedCinemaId ? "Update Cinema" : "Add New Cinema"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateOrUpdateCinema}
          layout="vertical"
          initialValues={{ roomRequestList: [{}] }}
        >
          <Form.Item
            label="Cinema Name"
            name="name"
            rules={[{ required: true, message: "Please enter cinema name!" }]}
          >
            <Input placeholder="Enter cinema name" />
          </Form.Item>
          <Form.Item
            label="Hotline"
            name="hotline"
            rules={[{ required: true, message: "Please enter hotline!" }]}
          >
            <Input placeholder="Enter hotline" />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter address!" }]}
          >
            <Input placeholder="Enter address" />
          </Form.Item>
          <Form.Item
            label="Province"
            name="province"
            rules={[{ required: true, message: "Please enter province!" }]}
          >
            <Input placeholder="Enter province" />
          </Form.Item>

          <Form.List name="roomRequestList">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      label="Room Name"
                      name={[field.name, "name"]}
                      rules={[
                        { required: true, message: "Please enter room name!" },
                      ]}
                    >
                      <Input placeholder="Enter room name" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Room Type"
                      name={[field.name, "roomType"]}
                      rules={[
                        { required: true, message: "Please select room type!" },
                      ]}
                    >
                      <Select placeholder="Select type">
                        <Select.Option value="STANDARD">Standard</Select.Option>
                        <Select.Option value="VIP">VIP</Select.Option>
                        <Select.Option value="IMAX">IMAX</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Seat Count"
                      name={[field.name, "seatCount"]}
                      rules={[
                        { required: true, message: "Please enter seat count!" },
                      ]}
                    >
                      <Input type="number" placeholder="Enter seat count" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Row Count"
                      name={[field.name, "rowCount"]}
                      rules={[
                        { required: true, message: "Please enter row count!" },
                      ]}
                    >
                      <Input type="number" placeholder="Enter row count" />
                    </Form.Item>
                    <Button
                      type="danger"
                      onClick={() => remove(field.name)}
                      icon={<MinusCircleOutlined />}
                    >
                      Remove
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Room
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <h3 className="mt-4 mb-2">Giá vé</h3>
          <Form.List name="ticketPriceRequests">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      label="Loại ngày"
                      name={[field.name, "dateType"]}
                      rules={[
                        { required: true, message: "Vui lòng chọn loại ngày!" },
                      ]}
                    >
                      <Select placeholder="Chọn loại ngày">
                        <Select.Option value="WEEKDAY">
                          Ngày thường
                        </Select.Option>
                        <Select.Option value="WEEKEND">Cuối tuần</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Giá vé"
                      name={[field.name, "price"]}
                      rules={[
                        { required: true, message: "Vui lòng nhập giá vé!" },
                      ]}
                    >
                      <Input
                        type="number"
                        prefix={<DollarOutlined />}
                        placeholder="Nhập giá vé"
                        addonAfter="VND"
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <Button
                        type="danger"
                        onClick={() => remove(field.name)}
                        icon={<MinusCircleOutlined />}
                      >
                        Xóa
                      </Button>
                    )}
                  </Space>
                ))}
                {fields.length < 2 && (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm giá vé
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {selectedCinemaId ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Cinema Details Modal */}
      <Modal
        title="Chi tiết rạp chiếu phim"
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsDetailsModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setIsDetailsModalVisible(false);
              showModal(selectedCinemaId);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
      >
        {detailsLoading ? (
          <div className="flex justify-center py-8">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          cinemaDetails && (
            <Tabs defaultActiveKey="info">
              <Tabs.TabPane tab="Thông tin chung" key="info">
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="ID">
                    {cinemaDetails.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên rạp">
                    {cinemaDetails.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hotline">
                    {cinemaDetails.hotline}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    {cinemaDetails.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tỉnh/Thành phố">
                    {cinemaDetails.province}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Badge
                      status={cinemaDetails.active ? "success" : "error"}
                      text={
                        cinemaDetails.active ? "Hoạt động" : "Không hoạt động"
                      }
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">
                    {cinemaDetails.createdAt
                      ? moment(cinemaDetails.createdAt).format(
                          "DD/MM/YYYY HH:mm"
                        )
                      : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cập nhật lần cuối">
                    {cinemaDetails.updatedAt
                      ? moment(cinemaDetails.updatedAt).format(
                          "DD/MM/YYYY HH:mm"
                        )
                      : "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Danh sách phòng" key="rooms">
                {cinemaDetails.roomResponseList &&
                cinemaDetails.roomResponseList.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={cinemaDetails.roomResponseList}
                    renderItem={(room) => (
                      <List.Item>
                        <Card title={room.name} style={{ width: "100%" }}>
                          <Row gutter={[16, 16]}>
                            <Col span={8}>
                              <strong>Loại phòng:</strong>{" "}
                              <Tag
                                color={
                                  room.roomType === "VIP"
                                    ? "gold"
                                    : room.roomType === "IMAX"
                                    ? "blue"
                                    : "green"
                                }
                              >
                                {room.roomType}
                              </Tag>
                            </Col>
                            <Col span={8}>
                              <strong>Số ghế:</strong> {room.seatCount}
                            </Col>
                            <Col span={8}>
                              <strong>Số hàng:</strong> {room.rowCount}
                            </Col>
                            <Col span={24}>
                              <strong>Trạng thái:</strong>{" "}
                              <Badge
                                status={room.active ? "success" : "error"}
                                text={
                                  room.active ? "Hoạt động" : "Không hoạt động"
                                }
                              />
                            </Col>
                          </Row>
                        </Card>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="Không có phòng nào" />
                )}
              </Tabs.TabPane>

              <Tabs.TabPane tab="Giá vé" key="prices">
                {cinemaDetails.ticketPrices &&
                cinemaDetails.ticketPrices.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={cinemaDetails.ticketPrices}
                    renderItem={(price) => (
                      <List.Item>
                        <Card style={{ width: "100%" }}>
                          <Row gutter={[16, 16]}>
                            <Col span={12}>
                              <strong>Loại ngày:</strong>{" "}
                              <Tag
                                color={
                                  price.dateType === "WEEKEND"
                                    ? "orange"
                                    : "blue"
                                }
                              >
                                {price.dateType === "WEEKEND"
                                  ? "Cuối tuần"
                                  : "Ngày thường"}
                              </Tag>
                            </Col>
                            <Col span={12}>
                              <strong>Giá vé:</strong>{" "}
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(price.price)}
                            </Col>
                          </Row>
                        </Card>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="Không có thông tin giá vé" />
                )}
              </Tabs.TabPane>
            </Tabs>
          )
        )}
      </Modal>
    </div>
  );
};

export default CinemaManagement;
