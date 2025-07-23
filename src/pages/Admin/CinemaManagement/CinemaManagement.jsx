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
  Upload,
  message,
} from "antd";
import { toast } from "react-toastify";
import {
  SearchOutlined,
  HomeOutlined,
  ReloadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DollarOutlined,
  UploadOutlined,
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
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [form] = Form.useForm();

  // Fetch cinema list
  const fetchCinemas = async () => {
    try {
      setLoading(true);
      const response = await cinemaService.getAllCinemas();
      if (response?.success !== false && response?.result) {
        setCinemas(response.result);
      } else {
        toast.error(response?.message || "Không tìm thấy dữ liệu");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách rạp chiếu phim:", error);
      toast.error(error.message || "Không thể tải danh sách rạp chiếu phim");
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
      if (response?.success !== false && response?.result) {
        setCinemaDetails(response.result);
      } else {
        toast.error(response?.message || "Không tìm thấy chi tiết");
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết rạp chiếu phim:", error);
      toast.error(error.message || "Không thể tải chi tiết rạp chiếu phim");
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
      const response = await cinemaService.activateCinema(id, newStatus);

      if (response?.success !== false) {
        setCinemas(
          cinemas.map((cinema) =>
            cinema.id === id ? { ...cinema, active: newStatus } : cinema
          )
        );
        toast.success(
          `Rạp chiếu phim đã ${
            newStatus ? "kích hoạt" : "vô hiệu hóa"
          } thành công`
        );
      } else {
        toast.error(
          response?.message ||
            `Không thể ${
              newStatus ? "kích hoạt" : "vô hiệu hóa"
            } rạp chiếu phim`
        );
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái rạp chiếu phim:", error);
      toast.error(
        error.message ||
          `Không thể ${newStatus ? "kích hoạt" : "vô hiệu hóa"} rạp chiếu phim`
      );
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
    setThumbnailFile(null);

    if (id) {
      // Fetch cinema details to get the most up-to-date data
      try {
        setLoading(true);
        const response = await cinemaService.getCinemaById(id);
        if (response?.success !== false && response?.result) {
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
            })) || [{}],
          });
        } else {
          toast.error(
            response?.message || "Không thể tải thông tin rạp chiếu phim"
          );
        }
      } catch (error) {
        console.error(
          "Lỗi khi lấy chi tiết rạp chiếu phim để chỉnh sửa:",
          error
        );
        toast.error(
          error.message || "Không thể tải thông tin rạp chiếu phim để chỉnh sửa"
        );
      } finally {
        setLoading(false);
      }
    } else {
      form.resetFields();
      form.setFieldsValue({
        roomRequestList: [{}],
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
          id: selectedCinemaId && room.id ? room.id : undefined,
          name: room.name,
          roomType: room.roomType,
          requestType: selectedCinemaId && room.id ? "UPDATE" : "CREATE",
        })),
      };

      if (selectedCinemaId) {
        requestBody.id = selectedCinemaId;
      }

      const response = await cinemaService.createCinema(
        requestBody,
        thumbnailFile
      );

      if (response?.success !== false) {
        toast.success(
          `${selectedCinemaId ? "Cập nhật" : "Tạo"} rạp chiếu phim thành công`
        );
        fetchCinemas();
        setIsModalVisible(false);
      } else {
        toast.error(
          response?.message ||
            `Không thể ${selectedCinemaId ? "cập nhật" : "tạo"} rạp chiếu phim`
        );
      }
    } catch (error) {
      console.error("Lỗi khi tạo/cập nhật rạp chiếu phim:", error);
      toast.error(
        error.message ||
          `Không thể ${selectedCinemaId ? "cập nhật" : "tạo"} rạp chiếu phim`
      );
    }
  };

  // Handle thumbnail upload
  const handleThumbnailChange = (info) => {
    if (info.file) {
      setThumbnailFile(info.file.originFileObj);
    }
  };

  // Table columns configuration
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên rạp", dataIndex: "name", key: "name" },
    { title: "Đường dây nóng", dataIndex: "hotline", key: "hotline" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Tỉnh/Thành phố", dataIndex: "province", key: "province" },
    {
      title: "Trạng thái",
      key: "active",
      render: (_, record) => (
        <Space>
          <Badge
            status={record.active ? "success" : "error"}
            text={record.active ? "Hoạt động" : "Không hoạt động"}
          />
          <Switch
            checked={record.active}
            onChange={() => handleActivateCinema(record.id, record.active)}
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
          />
        </Space>
      ),
    },
    {
      title: "Thao tác",
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
              { title: "Quản lý rạp chiếu phim" },
            ]}
          />
        </Col>

        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={24} className="flex justify-between items-center">
                <Title level={4} className="!mb-0">
                  Danh sách rạp chiếu phim
                </Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showModal()}
                >
                  Thêm mới
                </Button>
              </Col>

              <Col span={24}>
                <Row gutter={[16, 16]} className="items-center">
                  <Col xs={24} sm={8} md={6}>
                    <Input
                      placeholder="Tìm kiếm rạp chiếu phim"
                      prefix={<SearchOutlined />}
                      onChange={(e) => setSearchText(e.target.value)}
                      allowClear
                    />
                  </Col>
                  <Col xs={24} sm={8} md={4}>
                    <Select
                      placeholder="Lọc theo trạng thái"
                      style={{ width: "100%" }}
                      onChange={(value) => setFilterActive(value)}
                      defaultValue="all"
                    >
                      <Select.Option value="all">Tất cả</Select.Option>
                      <Select.Option value="true">Hoạt động</Select.Option>
                      <Select.Option value="false">
                        Không hoạt động
                      </Select.Option>
                    </Select>
                  </Col>
                  <Col>
                    <Tooltip title="Làm mới dữ liệu">
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
                    showTotal: (total) => `Tổng ${total} rạp chiếu phim`,
                  }}
                  scroll={{ x: "max-content" }}
                  locale={{ emptyText: "Không có dữ liệu rạp chiếu phim" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Create/Update Cinema Modal */}
      <Modal
        title={
          selectedCinemaId
            ? "Cập nhật rạp chiếu phim"
            : "Thêm rạp chiếu phim mới"
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          onFinish={handleCreateOrUpdateCinema}
          layout="vertical"
          initialValues={{ roomRequestList: [{}] }}
        >
          <Form.Item
            label="Tên rạp"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên rạp!" }]}
          >
            <Input placeholder="Nhập tên rạp" />
          </Form.Item>

          <Form.Item
            label="Đường dây nóng"
            name="hotline"
            rules={[
              { required: true, message: "Vui lòng nhập đường dây nóng!" },
            ]}
          >
            <Input placeholder="Nhập đường dây nóng" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item
            label="Tỉnh/Thành phố"
            name="province"
            rules={[
              { required: true, message: "Vui lòng nhập tỉnh/thành phố!" },
            ]}
          >
            <Input placeholder="Nhập tỉnh/thành phố" />
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            name="thumbnail"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture"
              onChange={handleThumbnailChange}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>

          <h3 className="mt-4 mb-2">Thông tin phòng</h3>
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
                      label="Tên phòng"
                      name={[field.name, "name"]}
                      rules={[
                        { required: true, message: "Vui lòng nhập tên phòng!" },
                      ]}
                    >
                      <Input placeholder="Nhập tên phòng" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Loại phòng"
                      name={[field.name, "roomType"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn loại phòng!",
                        },
                      ]}
                    >
                      <Select placeholder="Chọn loại">
                        <Select.Option value="STANDARD">
                          Tiêu chuẩn
                        </Select.Option>
                        <Select.Option value="VIP">VIP</Select.Option>
                        <Select.Option value="IMAX">IMAX</Select.Option>
                      </Select>
                    </Form.Item>

                    <Button
                      danger
                      onClick={() => remove(field.name)}
                      icon={<MinusCircleOutlined />}
                    >
                      Xóa
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
                    Thêm phòng
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {selectedCinemaId ? "Cập nhật" : "Tạo mới"}
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
                {cinemaDetails.imageUrl && (
                  <div className="mb-4 text-center">
                    <img
                      src={cinemaDetails.imageUrl}
                      alt={cinemaDetails.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="ID">
                    {cinemaDetails.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên rạp">
                    {cinemaDetails.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Đường dây nóng">
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
                              <strong>Số cột:</strong> {room.columnCount}
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

              {cinemaDetails.ticketPrices &&
                cinemaDetails.ticketPrices.length > 0 && (
                  <Tabs.TabPane tab="Giá vé" key="prices">
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
                  </Tabs.TabPane>
                )}
            </Tabs>
          )
        )}
      </Modal>
    </div>
  );
};

export default CinemaManagement;
