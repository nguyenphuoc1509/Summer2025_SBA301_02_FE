import MyProfile from "../../pages/Customer/Profile/MyProfile";
import MyTicket from "../../pages/Customer/Profile/MyTicket";
import { ROUTES } from "../constants";
import { MainLayout } from "../layouts/MainLayout";

export const PrivateRoutes = [
  {
    path: ROUTES.PROFILE,
    element: <MyProfile />,
    layout: MainLayout,
  },
  {
    path: ROUTES.TICKET_INFO,
    element: <MyTicket />,
    layout: MainLayout,
  },
];
