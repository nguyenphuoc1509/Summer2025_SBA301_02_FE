import AdminDashboard from "../../pages/Admin/AdminDashboard/AdminDashboard";
import { ROUTES } from "../constants";
import { AdminLayout } from "../layouts/AdminLayout";
import UserManagement from "../../pages/Admin/UserManagement/UserManagement";
import LoginAdmin from "../../pages/Admin/Login/LoginAdmin";
import MovieManagement from "../../pages/Admin/MovieManagement/MovieManagement";
import ScheduleManagement from "../../pages/Admin/ScheduleManagement/ScheduleManagement";
import BlogManagement from "../../pages/Admin/BlogManagement/BlogManagement";
import GenreManagement from "../../pages/Admin/GenreManagement/GenreManagement";
import PersonManagement from "../../pages/Admin/PersonManagement/PersonManagement";
import CountryManagement from "../../pages/Admin/CountryManagement/CountryManagement";
import CinemaManagement from "../../pages/Admin/CinemaManagement/CinemaManagement";

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
  {
    path: ROUTES.MOVIE_MANAGEMENT,
    element: <MovieManagement />,
    layout: AdminLayout,
  },
  {
    path: ROUTES.CINEMA_MANAGEMENT,
    element: <CinemaManagement />,
    layout: AdminLayout,
  },
  {
    path: ROUTES.SCHEDULE_MANAGEMENT,
    element: <ScheduleManagement />,
    layout: AdminLayout,
  },
  {
    path: ROUTES.BLOG_MANAGEMENT,
    element: <BlogManagement />,
    layout: AdminLayout,
  },
  {
    path: ROUTES.GENRE_MANAGEMENT,
    element: <GenreManagement />,
    layout: AdminLayout,
  },
  {
    path: ROUTES.PERSON_MANAGEMENT,
    element: <PersonManagement />,
    layout: AdminLayout,
  },
  {
    path: ROUTES.COUNTRY_MANAGEMENT,
    element: <CountryManagement />,
    layout: AdminLayout,
  },
];
