// 📁 src/features/workspace/workspaceService.ts

import axiosInstance from "../../api/AxiosIntance";
import { handleApiCall } from "../../api/HandApiCall";

export const workspaceService = {
  fetch: (params: { page: number; pageSize: number; search?: string }) =>
    handleApiCall(() => axiosInstance.get("/workspaces", { params })),

  create: (formData: FormData) =>
    handleApiCall(() => axiosInstance.post("/workspaces", formData)),

  update: (id: string, formData: FormData) =>
    handleApiCall(() => axiosInstance.put(`/workspaces/${id}`, formData)),

  delete: (id: string) =>
    handleApiCall(() => axiosInstance.delete(`/workspaces/${id}`)),

  // 👥 Manage users
  addUser: (workspaceId: string, userId: string) =>
    handleApiCall(() =>
      axiosInstance.post(`/workspaces/${workspaceId}/users`, { userId })
    ),

  removeUsers: (workspaceId: string, userIds: string[]) =>
    handleApiCall(() =>
      axiosInstance.delete(`/workspaces/${workspaceId}/users`, {
        data: { userIds },
      })
    ),

  updateUser: (workspaceId: string, userId: string, role: string) =>
    handleApiCall(() =>
      axiosInstance.put(`/workspaces/${workspaceId}/users/${userId}`, { role })
    ),

  // 🔐 Change workspace password
  changePassword: (workspaceId: string, current: string, next: string) =>
    handleApiCall(() =>
      axiosInstance.post(`/workspaces/${workspaceId}/change-password`, {
        current,
        next,
      })
    ),
};
