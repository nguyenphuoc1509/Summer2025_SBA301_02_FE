import React, { useState, useEffect } from "react";
import {
  getTickets,
  updateTicketStatus,
  checkInTicket,
} from "../../../services/ticketManagement";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  Divider,
  Typography,
  Row,
  Col,
  Card,
  Spin,
  Tooltip,
  Pagination,
  Badge,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;
const { Option } = Select;

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        ...(search && { search }),
        ...(statusFilter !== "ALL" && { status: statusFilter }),
      };

      const response = await getTickets(params);

      // Check if response has the expected structure
      if (response && response.content) {
        setTickets(response.content);
        setPagination({
          ...pagination,
          total: response.totalElements || 0,
        });
      } else {
        console.error("Unexpected API response format:", response);
        setTickets([]);
        toast.error("Failed to load ticket data. Unexpected response format.");
      }
    } catch (error) {
      console.error("Failed to fetch tickets", error);
      setTickets([]);
      toast.error("Failed to load ticket data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [pagination.current, pagination.pageSize, statusFilter]);

  const handleSearch = () => {
    setPagination({
      ...pagination,
      current: 1,
    });
    fetchTickets();
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleDetailOpen = (ticket) => {
    setSelectedTicket(ticket);
    setDetailVisible(true);
  };

  const handleDetailClose = () => {
    setDetailVisible(false);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTicketStatus(id, { paymentStatus: status });
      fetchTickets();
      if (selectedTicket && selectedTicket.ticketId === id) {
        setSelectedTicket({
          ...selectedTicket,
          paymentStatus: status,
        });
      }
      toast.success(`Ticket status updated to ${status}`);
    } catch (error) {
      console.error("Failed to update ticket status", error);
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.message || "Failed to update ticket status"
        );
      } else {
        toast.error("Failed to update ticket status");
      }
    }
  };

  const handleCheckIn = async (ticket) => {
    try {
      await checkInTicket(ticket.ticketCode);
      fetchTickets();
      if (selectedTicket && selectedTicket.ticketId === ticket.ticketId) {
        setSelectedTicket({
          ...selectedTicket,
          checkedIn: true,
        });
      }
      toast.success("Ticket checked in successfully");
    } catch (error) {
      console.error("Failed to check in ticket", error);

      // Handle specific API error messages
      if (error.response && error.response.data) {
        const errorData = error.response.data;

        if (errorData.code === 1037) {
          toast.error(
            "Check-in is too late. Check-in is not allowed after showtime"
          );
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else {
          toast.error("Failed to check in ticket");
        }
      } else {
        toast.error("Failed to check in ticket");
      }
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "SUCCESS":
        return <Tag color="green">SUCCESS</Tag>;
      case "PENDING":
        return <Tag color="orange">PENDING</Tag>;
      case "CANCELLED":
        return <Tag color="red">CANCELLED</Tag>;
      case "FAILED":
        return <Tag color="red">FAILED</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const formatCurrency = (amount) => {
    // Check if amount is in cents or whole numbers
    if (amount > 1000) {
      // Likely in VND
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(amount);
    } else {
      // Likely in dollars or other currency
      return `$${amount.toFixed(2)}`;
    }
  };

  const columns = [
    {
      title: "Ticket Code",
      dataIndex: "ticketCode",
      key: "ticketCode",
      width: 150,
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      render: (text, record) => (
        <div>
          <div>{record.customerName}</div>
          <div className="text-xs text-gray-500">{record.customerEmail}</div>
        </div>
      ),
      width: 180,
    },
    {
      title: "Movie",
      dataIndex: "movieTitle",
      key: "movieTitle",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Cinema / Room",
      key: "cinema",
      render: (_, record) => (
        <div>
          <div>{record.cinemaName}</div>
          <div className="text-xs text-gray-500">Room: {record.roomName}</div>
        </div>
      ),
      width: 180,
      ellipsis: true,
    },
    {
      title: "Showtime",
      dataIndex: "showtimeStart",
      key: "showtimeStart",
      render: (text) => moment(text).format("MMM DD, YYYY HH:mm"),
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => formatCurrency(text),
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => getStatusTag(status),
      width: 100,
    },
    {
      title: "Check-In",
      dataIndex: "checkedIn",
      key: "checkedIn",
      render: (checkedIn) =>
        checkedIn ? (
          <Badge status="success" text="Checked In" />
        ) : (
          <Badge status="default" text="Not Checked" />
        ),
      width: 110,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleDetailOpen(record)}
            />
          </Tooltip>
          <Tooltip title="Check-In">
            <Button
              type="text"
              icon={<CheckCircleOutlined />}
              disabled={record.checkedIn}
              onClick={() => handleCheckIn(record)}
              className={record.checkedIn ? "" : "text-blue-500"}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Title level={4}>Ticket Management</Title>

      <Card className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Input.Search
              placeholder="Search by ticket code, customer name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={handleSearch}
              enterButton
              allowClear
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Filter by Status"
              style={{ width: "100%" }}
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPagination({ ...pagination, current: 1 });
                setTimeout(() => fetchTickets(), 0);
              }}
            >
              <Option value="ALL">All Statuses</Option>
              <Option value="SUCCESS">Success</Option>
              <Option value="PENDING">Pending</Option>
              <Option value="CANCELLED">Cancelled</Option>
              <Option value="FAILED">Failed</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Items Per Page"
              style={{ width: "100%" }}
              value={pagination.pageSize}
              onChange={(value) => {
                setPagination({
                  ...pagination,
                  pageSize: value,
                  current: 1,
                });
                setTimeout(() => fetchTickets(), 0);
              }}
            >
              <Option value={5}>5 / page</Option>
              <Option value={10}>10 / page</Option>
              <Option value={20}>20 / page</Option>
              <Option value={50}>50 / page</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={tickets}
          rowKey="ticketId"
          pagination={{
            ...pagination,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
          loading={loading}
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* Ticket Detail Modal */}
      <Modal
        title={
          selectedTicket
            ? `Ticket Details - ${selectedTicket.ticketCode}`
            : "Ticket Details"
        }
        open={detailVisible}
        onCancel={handleDetailClose}
        width={800}
        footer={[
          selectedTicket && selectedTicket.paymentStatus === "PENDING" && (
            <Button
              key="markPaid"
              type="primary"
              onClick={() => {
                handleStatusChange(selectedTicket.ticketId, "SUCCESS");
                handleDetailClose();
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Mark as Paid
            </Button>
          ),
          selectedTicket && selectedTicket.paymentStatus !== "CANCELLED" && (
            <Button
              key="cancel"
              danger
              onClick={() => {
                handleStatusChange(selectedTicket.ticketId, "CANCELLED");
                handleDetailClose();
              }}
            >
              Cancel Ticket
            </Button>
          ),
          selectedTicket && !selectedTicket.checkedIn && (
            <Button
              key="checkIn"
              type="primary"
              onClick={() => {
                handleCheckIn(selectedTicket);
                handleDetailClose();
              }}
            >
              Check In
            </Button>
          ),
          <Button key="close" onClick={handleDetailClose}>
            Close
          </Button>,
        ]}
      >
        {selectedTicket && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-4">
                  <Text strong>Customer Information</Text>
                  <div>Name: {selectedTicket.customerName}</div>
                  <div>Email: {selectedTicket.customerEmail}</div>
                  <div>
                    Booking Time:{" "}
                    {moment(selectedTicket.bookingTime).format(
                      "MMM DD, YYYY HH:mm:ss"
                    )}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-4">
                  <Text strong>Movie Information</Text>
                  <div>Title: {selectedTicket.movieTitle}</div>
                  <div>Cinema: {selectedTicket.cinemaName}</div>
                  <div>Room: {selectedTicket.roomName}</div>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-4">
                  <Text strong>Showtime</Text>
                  <div>
                    Start:{" "}
                    {moment(selectedTicket.showtimeStart).format(
                      "MMM DD, YYYY HH:mm"
                    )}
                  </div>
                  <div>
                    End:{" "}
                    {moment(selectedTicket.showtimeEnd).format(
                      "MMM DD, YYYY HH:mm"
                    )}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-4">
                  <Text strong>Seats</Text>
                  <div>
                    {selectedTicket.seatCodes.map((seat, index) => (
                      <Tag key={index} className="mr-1 mb-1">
                        {seat}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-4">
                  <Text strong>Payment Information</Text>
                  <div>
                    Total Amount: {formatCurrency(selectedTicket.totalAmount)}
                  </div>
                  <div className="mt-1">
                    Status: {getStatusTag(selectedTicket.paymentStatus)}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-4">
                  <Text strong>Ticket Status</Text>
                  <div className="mt-1">
                    {selectedTicket.checkedIn ? (
                      <Badge status="success" text="Checked In" />
                    ) : (
                      <Badge status="default" text="Not Checked In" />
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TicketManagement;
