import AdminDashboard from "../../pages/Admin/AdminDashboard/AdminDashboard";
import { ROUTES } from "../constants";
import { AdminLayout } from "../layouts/AdminLayout";
import UserManagement from "../../pages/Admin/UserManagement/UserManagement";
import LoginAdmin from "../../pages/Admin/Login/LoginAdmin";

export const AdminRoutes = [
  {
    path: ROUTES.DASHBOARD,
    element: <AdminDashboard />,
    layout: AdminLayout,
  },
  {
    path: ROUTES.USER_MANAGEMENT,
    element: <UserManagement />,
    layout: AdminLayout,
  },
];
