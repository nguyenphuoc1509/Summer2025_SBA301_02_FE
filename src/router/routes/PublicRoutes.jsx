import Homepage from "../../pages/Customer/Homepage/Homepage";
import { ROUTES } from "../constants";
import { MainLayout } from "../layouts/MainLayout";
import NowShowingPage from "../../pages/Customer/Movie/NowShowingPage";
import UpComingPage from "../../pages/Customer/Movie/UpComingPage";
import MovieDetail from "../../pages/Customer/Movie/MovieDetail";
import LoginCustomer from "../../pages/Customer/Auth/LoginCustomer";

export const PublicRoutes = [
  {
    path: ROUTES.HOME,
    element: <Homepage />,
    layout: MainLayout,
  },
  {
    path: ROUTES.NOW_SHOWING,
    element: <NowShowingPage />,
    layout: MainLayout,
  },
  {
    path: ROUTES.UPCOMING,
    element: <UpComingPage />,
    layout: MainLayout,
  },
  {
    path: ROUTES.MOVIE_DETAIL,
    element: <MovieDetail />,
    layout: MainLayout,
  },
];
