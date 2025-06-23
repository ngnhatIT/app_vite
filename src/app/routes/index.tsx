import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./authRoutes";

import MainLayout from "../../layouts/main/MainLayout";
import { securityRoutes, systemRoutes, userRoutes } from "./mainRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [securityRoutes, userRoutes, systemRoutes],
  },
  authRoutes,
]);
