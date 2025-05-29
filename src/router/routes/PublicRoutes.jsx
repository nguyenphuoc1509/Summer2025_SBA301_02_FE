import Homepage from "../../pages/Customer/Homepage/Homepage";
import { ROUTES } from "../constants";
import { MainLayout } from "../layouts/MainLayout";
import NowShowingPage from "../../pages/Customer/Movie/NowShowingPage";
import UpComingPage from "../../pages/Customer/Movie/UpComingPage";
import MovieDetail from "../../pages/Customer/Movie/MovieDetail";
import LoginCustomer from "../../pages/Customer/Auth/LoginCustomer";
import MovieGenre from "../../pages/Customer/Cinema/MovieGenre";
import Actor from "../../pages/Customer/Cinema/Actor";
import Director from "../../pages/Customer/Cinema/Director";
import MovieReview from "../../pages/Customer/Cinema/MovieReview";
import MovieBlog from "../../pages/Customer/Cinema/MovieBlog";
import LoginAdmin from "../../pages/Admin/Login/LoginAdmin";
import { AuthLayout } from "../layouts/AuthLayout";

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
  {
    path: ROUTES.MOVIE_GENRE,
    element: <MovieGenre />,
    layout: MainLayout,
  },
  {
    path: ROUTES.MOVIE_ACTOR,
    element: <Actor />,
    layout: MainLayout,
  },
  {
    path: ROUTES.MOVIE_DIRECTOR,
    element: <Director />,
    layout: MainLayout,
  },
  {
    path: ROUTES.MOVIE_REVIEW,
    element: <MovieReview />,
    layout: MainLayout,
  },
  {
    path: ROUTES.MOVIE_BLOG,
    element: <MovieBlog />,
    layout: MainLayout,
  },
  {
    path: ROUTES.LOGIN_ADMIN,
    element: <LoginAdmin />,
    layout: AuthLayout,
  },
];
