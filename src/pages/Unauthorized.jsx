import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/constants";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Result
        status="403"
        title="Không có quyền truy cập"
        subTitle="Xin lỗi, bạn không có quyền truy cập vào trang này."
        extra={
          <Button type="primary" onClick={() => navigate(ROUTES.HOME)}>
            Về trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized;
