import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants";
import { useAuth } from "../../hooks/useAuth";
import { message } from "antd";
import { useEffect } from "react";

export const AdminGuard = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Kiểm tra token và quyền ADMIN
  if (!token) {
    return <Navigate to={ROUTES.LOGIN_ADMIN} replace />;
  }

  // Lấy roleNames từ localStorage nếu không có trong user state
  const roles =
    user?.roles || JSON.parse(localStorage.getItem("roleNames") || "[]");

  // Kiểm tra xem người dùng có quyền ADMIN không
  useEffect(() => {
    if (!roles.includes("ADMIN")) {
      // Hiển thị thông báo lỗi
      message.error("Bạn không có quyền truy cập vào trang này!");
      // Chuyển hướng về trang chủ sau khi hiển thị thông báo
      navigate(ROUTES.HOME);
    }
  }, [roles, navigate]);

  // Nếu không có quyền ADMIN, không render children
  if (!roles.includes("ADMIN")) {
    return null;
  }

  return children;
};
