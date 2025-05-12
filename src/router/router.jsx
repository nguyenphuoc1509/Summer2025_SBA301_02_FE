import { createBrowserRouter } from "react-router-dom";
import { PublicRoutes } from "./routes/PublicRoutes";
import { PrivateRoutes } from "./routes/PrivateRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";
import { AuthGuard } from "./guards/AuthGuard";
import { AdminGuard } from "./guards/AdminGuard";
import { ScrollToTop } from "../components/ScrollToTop/ScrollToTop";

const wrapWithLayout = (route) => {
  const Layout = route.layout;
  return Layout ? (
    <Layout>
      <ScrollToTop />
      {route.element}
    </Layout>
  ) : (
    <>
      <ScrollToTop />
      {route.element}
    </>
  );
};

const wrapWithGuard = (route, Guard) => {
  return Guard ? <Guard>{wrapWithLayout(route)}</Guard> : wrapWithLayout(route);
};

const routes = [
  ...PublicRoutes.map((route) => ({
    path: route.path,
    element: wrapWithLayout(route),
  })),
  ...PrivateRoutes.map((route) => ({
    path: route.path,
    element: wrapWithGuard(route, AuthGuard),
  })),
  ...AdminRoutes.map((route) => ({
    path: route.path,
    element: wrapWithGuard(route, AdminGuard),
  })),
];

export const router = createBrowserRouter(routes);
