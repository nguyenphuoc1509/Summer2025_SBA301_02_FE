import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants";
import { useAuth } from "../../hooks/useAuth";
import { message } from "antd";
import { useEffect } from "react";

export const AdminGuard = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN_ADMIN} replace />;
  }

  const roles =
    user?.roles || JSON.parse(localStorage.getItem("roleNames") || "[]");

  useEffect(() => {
    if (!roles.includes("ADMIN")) {
      message.error("Bạn không có quyền truy cập vào trang này!");
      navigate(ROUTES.HOME);
    }
  }, [roles, navigate]);

  if (!roles.includes("ADMIN")) {
    return null;
  }

  return children;
};
