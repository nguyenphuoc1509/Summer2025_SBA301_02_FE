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
import DirectorDetail from "../../pages/Customer/Cinema/DirectorDetail";
import MovieReview from "../../pages/Customer/Cinema/MovieReview";
import MovieBlog from "../../pages/Customer/Cinema/MovieBlog";
import LoginAdmin from "../../pages/Admin/Login/LoginAdmin";
import { AuthLayout } from "../layouts/AuthLayout";
import Ticket from "../../pages/Customer/Ticket/Ticket";
import Event from "../../pages/Customer/Event/Event";
import EventDetail from "../../pages/Customer/Event/EventDetail";
import ChooseSeat from "../../pages/Customer/Ticket/ChooseSeat";
import Payment from "../../pages/Customer/Ticket/Payment";
import Confirm from "../../pages/Customer/Ticket/Confirm";
import VNPayCallback from "../../pages/Customer/Ticket/VNPayCallback";
import PaymentSuccess from "../../pages/Customer/Ticket/PaymentSuccess";
import CinemaSystem from "../../pages/Customer/Cinema/CinemaSystem";

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
    path: ROUTES.MOVIE_DIRECTOR_DETAIL,
    element: <DirectorDetail />,
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
  {
    path: ROUTES.TICKET,
    element: <Ticket />,
    layout: MainLayout,
  },
  {
    path: ROUTES.EVENT,
    element: <Event />,
    layout: MainLayout,
  },
  {
    path: ROUTES.EVENT_DETAIL,
    element: <EventDetail />,
    layout: MainLayout,
  },
  {
    path: ROUTES.CHOOSE_SEAT,
    element: <ChooseSeat />,
    layout: MainLayout,
  },
  {
    path: ROUTES.PAYMENT,
    element: <Payment />,
    layout: MainLayout,
  },
  {
    path: ROUTES.PAYMENT_SUCCESS,
    element: <PaymentSuccess />,
    layout: MainLayout,
  },
  {
    path: ROUTES.CONFIRM,
    element: <Confirm />,
    layout: MainLayout,
  },
  {
    path: ROUTES.VNPAY_CALLBACK,
    element: <VNPayCallback />,
    layout: MainLayout,
  },
  {
    path: ROUTES.CINEMA_SYSTEM,
    element: <CinemaSystem />,
    layout: MainLayout,
  },
];
