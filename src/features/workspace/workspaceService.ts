// services/workspaceService.ts

import axiosInstance from "../../api/AxiosIntance";
import type {
  AddUserToWorkspaceDTO,
  ChangeWorkspacePasswordDTO,
  WorkspaceDTO,
} from "./dto/WorkspaceDTO";

export const workspaceService = {
  getAll: () => axiosInstance.get("/workspaces"),
  create: (data: WorkspaceDTO) => axiosInstance.post("/workspaces", data),
  update: (id: number, data: Partial<WorkspaceDTO>) =>
    axiosInstance.put(`/workspaces/${id}`, data),
  delete: (id: number) => axiosInstance.delete(`/workspaces/${id}`),
  addUser: (data: AddUserToWorkspaceDTO) =>
    axiosInstance.post(`/workspaces/${data.workspaceId}/users`, {
      email: data.email,
    }),
  changePassword: (data: ChangeWorkspacePasswordDTO) =>
    axiosInstance.post(`/workspaces/${data.workspaceId}/change-password`, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }),
};
