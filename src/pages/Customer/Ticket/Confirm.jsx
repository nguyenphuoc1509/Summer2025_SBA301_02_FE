import React from "react";
import { Card, Typography, Button, Space, Divider, Row, Col, Spin } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Confirm = ({ bookingDetails, onConfirm, loading }) => {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="shadow-lg">
        <div className="text-center mb-6">
          <CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a" }} />
          <Title level={3} className="mt-4">
            Xác nhận đặt vé
          </Title>
          <Text type="secondary">
            Vui lòng kiểm tra thông tin đặt vé của bạn
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

                <Space>
                  <CreditCardOutlined />
                  <Text>
                    Phương thức thanh toán: {bookingDetails.paymentMethod}
                  </Text>
                </Space>
              </Space>
            </Col>

            <Col span={24}>
              <div className="bg-gray-50 p-4 rounded">
                <Text strong>Ghế đã chọn:</Text>
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
                <Text strong>Tổng tiền: </Text>
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
          <Button
            type="primary"
            size="large"
            block
            onClick={onConfirm}
            loading={loading}
          >
            Xác nhận đặt vé
          </Button>
          <Button size="large" block disabled={loading}>
            Quay về trang chủ
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Confirm;
