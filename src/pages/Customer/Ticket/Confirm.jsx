import React from "react";
import { Card, Typography, Button, Space, Divider, Row, Col } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Confirm = () => {
  // Mock data - replace with actual data from your state/API
  const bookingDetails = {
    movieName: "Avengers: Endgame",
    theater: "CGV Aeon Mall",
    date: "2024-03-20",
    time: "19:30",
    seats: ["A1", "A2", "A3"],
    totalAmount: 450000,
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="shadow-lg">
        <div className="text-center mb-6">
          <CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a" }} />
          <Title level={3} className="mt-4">
            Booking Confirmed!
          </Title>
          <Text type="secondary">
            Your booking has been successfully confirmed
          </Text>
        </div>

        <Divider />

        <div className="space-y-4">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Title level={4}>{bookingDetails.movieName}</Title>
            </Col>

            <Col span={24}>
              <Space direction="vertical" className="w-full">
                <Space>
                  <EnvironmentOutlined />
                  <Text>{bookingDetails.theater}</Text>
                </Space>

                <Space>
                  <CalendarOutlined />
                  <Text>{bookingDetails.date}</Text>
                </Space>

                <Space>
                  <ClockCircleOutlined />
                  <Text>{bookingDetails.time}</Text>
                </Space>
              </Space>
            </Col>

            <Col span={24}>
              <div className="bg-gray-50 p-4 rounded">
                <Text strong>Selected Seats:</Text>
                <div className="mt-2">
                  {bookingDetails.seats.map((seat) => (
                    <span
                      key={seat}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2 mb-2"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </Col>

            <Col span={24}>
              <div className="text-right">
                <Text strong>Total Amount: </Text>
                <Text strong className="text-lg">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(bookingDetails.totalAmount)}
                </Text>
              </div>
            </Col>
          </Row>
        </div>

        <Divider />

        <div className="text-center space-y-4">
          <Button type="primary" size="large" block>
            Download Ticket
          </Button>
          <Button size="large" block>
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Confirm;
