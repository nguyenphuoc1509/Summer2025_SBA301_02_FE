import React, { useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../router/constants";
import { useAuth } from "../../../hooks/useAuth";
import { authService } from "../../../services/auth";
import { Form, Input, Button, Card, Typography, Spin, message } from "antd";

const { Title } = Typography;

const LoginAdmin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.loginAdmin(
        values.username,
        values.password
      );
      if (response?.code === 200 && response.result) {
        const { accessToken, refreshToken, userId, roleNames } =
          response.result;

        // Lưu token vào localStorage
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Lưu roleNames vào localStorage để sử dụng cho phân quyền
        localStorage.setItem("roleNames", JSON.stringify(roleNames));

        // Gọi hàm login với userId và roleNames
        login({ id: userId, roles: roleNames });
        message.success(response.message || "Đăng nhập thành công");
        navigate(ROUTES.DASHBOARD);
      } else {
        throw new Error(response?.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Đăng nhập thất bại, vui lòng kiểm tra tên đăng nhập và mật khẩu!";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8">
        <Title level={2} className="text-center mb-8">
          Đăng nhập quản trị
        </Title>
        <Spin spinning={isLoading}>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="space-y-4"
          >
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              ]}
            >
              <Input
                prefix={<RiLockPasswordLine className="text-gray-400" />}
                placeholder="Nhập tên đăng nhập"
                size="large"
              />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<RiLockPasswordLine className="text-gray-400" />}
                placeholder="Nhập mật khẩu"
                size="large"
              />
            </Form.Item>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
                className="mt-4"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default LoginAdmin;
