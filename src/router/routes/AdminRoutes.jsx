import AdminDashboard from "../../pages/Admin/AdminDashboard/AdminDashboard";
import { ROUTES } from "../constants";
import { AdminLayout } from "../layouts/AdminLayout";

export const AdminRoutes = [
  {
    path: ROUTES.DASHBOARD,
    element: <AdminDashboard />,
    layout: AdminLayout,
  },
];
