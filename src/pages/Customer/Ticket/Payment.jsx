import React, { useState } from "react";
import { Card, Form, Input, Button, Radio, Space, Typography } from "antd";
import {
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Payment = ({ onNext }) => {
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  const onFinish = (values) => {
    console.log("Payment values:", values);
    onNext({ paymentMethod });
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="shadow-lg">
        <Title level={3} className="text-center mb-6">
          Thông tin thanh toán
        </Title>

        <Form layout="vertical" onFinish={onFinish} className="space-y-4">
          <Form.Item label="Phương thức thanh toán">
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full"
            >
              <Space direction="vertical" className="w-full">
                <Radio value="ONLINE" className="w-full">
                  <Space>
                    <CreditCardOutlined />
                    <Text>Thanh toán online</Text>
                  </Space>
                </Radio>
                <Radio value="BANK" className="w-full" disabled>
                  <Space>
                    <BankOutlined />
                    <Text>Chuyển khoản ngân hàng (Không khả dụng)</Text>
                  </Space>
                </Radio>
                <Radio value="WALLET" className="w-full" disabled>
                  <Space>
                    <WalletOutlined />
                    <Text>Ví điện tử (Không khả dụng)</Text>
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Tên chủ thẻ"
            name="cardholderName"
            rules={[{ required: true, message: "Vui lòng nhập tên chủ thẻ!" }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label="Số thẻ"
            name="cardNumber"
            rules={[{ required: true, message: "Vui lòng nhập số thẻ!" }]}
          >
            <Input placeholder="1234 5678 9012 3456" maxLength={19} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Ngày hết hạn"
              name="expiryDate"
              rules={[
                { required: true, message: "Vui lòng nhập ngày hết hạn!" },
              ]}
            >
              <Input placeholder="MM/YY" maxLength={5} />
            </Form.Item>

            <Form.Item
              label="CVV"
              name="cvv"
              rules={[{ required: true, message: "Vui lòng nhập CVV!" }]}
            >
              <Input placeholder="123" maxLength={3} />
            </Form.Item>
          </div>

          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full"
            >
              Thanh toán ngay
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Payment;
