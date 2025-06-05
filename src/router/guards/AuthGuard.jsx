import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../constants";
import { useAuth } from "../../hooks/useAuth";

export const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};
