import MyProfile from "../../pages/Customer/Profile/MyProfile";
import { ROUTES } from "../constants";
import { MainLayout } from "../layouts/MainLayout";

export const PrivateRoutes = [
  {
    path: ROUTES.PROFILE,
    element: <MyProfile />,
    layout: MainLayout,
  },
];
