import React, { useState } from "react";
import { Card, Typography, Button, Row, Col, Tag, Divider, Modal } from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const MyTicket = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const tickets = [
    {
      id: 1,
      movieName: "Avengers: Endgame",
      cinema: "CGV Aeon Mall",
      date: "20/03/2024",
      time: "19:30",
      seats: ["A1", "A2"],
      status: "completed",
      ticketCode: "TK123456",
      price: "180.000đ",
      room: "Phòng 3",
      purchaseDate: "15/03/2024",
    },
    {
      id: 2,
      movieName: "The Batman",
      cinema: "BHD Star Bitexco",
      date: "15/03/2024",
      time: "20:00",
      seats: ["B3", "B4"],
      status: "completed",
      ticketCode: "TK789012",
      price: "160.000đ",
      room: "Phòng 5",
      purchaseDate: "10/03/2024",
    },
  ];

  const showTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedTicket(null);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Lịch sử vé đã mua</Title>
      <Divider />

      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          style={{ marginBottom: "16px", borderRadius: "8px" }}
          hoverable
          onClick={() => showTicketDetails(ticket)}
        >
          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Title level={4}>{ticket.movieName}</Title>
              <div style={{ marginBottom: "8px" }}>
                <EnvironmentOutlined /> {ticket.cinema}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <CalendarOutlined /> {ticket.date}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <ClockCircleOutlined /> {ticket.time}
              </div>
              <div>
                <Text strong>Ghế: </Text>
                {ticket.seats.join(", ")}
              </div>
            </Col>
            <Col span={8} style={{ textAlign: "right" }}>
              <Tag color="green" style={{ marginBottom: "16px" }}>
                Đã Thanh Toán
              </Tag>
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Mã vé: </Text>
                <br />
                <Text copyable>{ticket.ticketCode}</Text>
              </div>
              <Button type="primary" icon={<InfoCircleOutlined />}>
                Xem chi tiết
              </Button>
            </Col>
          </Row>
        </Card>
      ))}

      <Modal
        title="Chi tiết vé"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedTicket && (
          <div>
            <Title level={4}>{selectedTicket.movieName}</Title>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Mã vé:</Text>
                <br />
                <Text copyable>{selectedTicket.ticketCode}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Ngày mua:</Text>
                <br />
                <Text>{selectedTicket.purchaseDate}</Text>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Rạp chiếu:</Text>
                <br />
                <Text>{selectedTicket.cinema}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Phòng chiếu:</Text>
                <br />
                <Text>{selectedTicket.room}</Text>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Ngày chiếu:</Text>
                <br />
                <Text>{selectedTicket.date}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Giờ chiếu:</Text>
                <br />
                <Text>{selectedTicket.time}</Text>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Ghế:</Text>
                <br />
                <Text>{selectedTicket.seats.join(", ")}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Giá vé:</Text>
                <br />
                <Text>{selectedTicket.price}</Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyTicket;
