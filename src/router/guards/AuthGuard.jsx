import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../constants";
import { useAuth } from "../../hooks/useAuth";

export const AuthGuard = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};
