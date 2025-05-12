import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../constants";
import { useAuth } from "../../hooks/useAuth";

export const AdminGuard = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== "admin") {
    return <Navigate to={ROUTES.LOGIN_ADMIN} replace />;
  }

  return children;
};
