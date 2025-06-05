import React, { useState } from "react";
import { Card, Form, Input, Button, Radio, Space, Typography } from "antd";
import {
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit");

  const onFinish = (values) => {
    console.log("Payment values:", values);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="shadow-lg">
        <Title level={3} className="text-center mb-6">
          Payment Details
        </Title>

        <Form layout="vertical" onFinish={onFinish} className="space-y-4">
          <Form.Item label="Payment Method">
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full"
            >
              <Space direction="vertical" className="w-full">
                <Radio value="credit" className="w-full">
                  <Space>
                    <CreditCardOutlined />
                    <Text>Credit Card</Text>
                  </Space>
                </Radio>
                <Radio value="bank" className="w-full">
                  <Space>
                    <BankOutlined />
                    <Text>Bank Transfer</Text>
                  </Space>
                </Radio>
                <Radio value="wallet" className="w-full">
                  <Space>
                    <WalletOutlined />
                    <Text>Digital Wallet</Text>
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {paymentMethod === "credit" && (
            <>
              <Form.Item
                label="Card Number"
                name="cardNumber"
                rules={[
                  { required: true, message: "Please input your card number!" },
                ]}
              >
                <Input placeholder="1234 5678 9012 3456" maxLength={19} />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Expiry Date"
                  name="expiryDate"
                  rules={[
                    { required: true, message: "Please input expiry date!" },
                  ]}
                >
                  <Input placeholder="MM/YY" maxLength={5} />
                </Form.Item>

                <Form.Item
                  label="CVV"
                  name="cvv"
                  rules={[{ required: true, message: "Please input CVV!" }]}
                >
                  <Input placeholder="123" maxLength={3} />
                </Form.Item>
              </div>
            </>
          )}

          <Form.Item
            label="Cardholder Name"
            name="cardholderName"
            rules={[
              { required: true, message: "Please input cardholder name!" },
            ]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full"
            >
              Pay Now
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Payment;
