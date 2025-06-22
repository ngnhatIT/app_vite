import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./authRoutes";

import { ProtectedRoute } from "./ProtectedRoute";
import { securityRoutes } from "./securityRoutes";
import MainLayout from "../../layouts/main/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
     
        <MainLayout />
      
    ),
    children: [securityRoutes],
  },
  authRoutes,
]);
