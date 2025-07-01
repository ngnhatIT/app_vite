import { createHashRouter } from "react-router-dom"; // ✅ Đổi Browser -> Hash
import { authRoutes } from "./authRoutes";

import MainLayout from "../../layouts/main/MainLayout";
import { securityRoutes, systemRoutes, userRoutes } from "./mainRoutes";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createHashRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [securityRoutes, userRoutes, systemRoutes],
  },
  authRoutes,
]);
