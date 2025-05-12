import Homepage from "../../pages/Customer/Homepage";
import { ROUTES } from "../constants";
import { MainLayout } from "../layouts/MainLayout";

export const PublicRoutes = [
  {
    path: ROUTES.HOME,
    element: <Homepage />,
    layout: MainLayout,
  },
];
