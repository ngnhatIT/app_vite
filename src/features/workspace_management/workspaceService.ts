import axiosInstance from "../../api/AxiosIntance";
import { handleApiCall } from "../../api/HandApiCall";
import { ENDPOINT } from "../../utils/constantEndPoint";
import type { Workspace, CreateWorkspaceDTO, UpdateWorkspaceDTO, AddMemberDTO, RemoveMembersDTO, ChangePasswordDTO, WorkspaceDetail } from "./dto/workSpaceDTO";

export const workspaceService = {
  /**
   * Lấy toàn bộ workspace
   */
  fetchAll: () =>
    handleApiCall<Workspace[]>(async () => {
      const res = await axiosInstance.get<{ data: Workspace[] }>(
        ENDPOINT.WORKSPACELST
      );
      return res.data.data;
    }),

  /**
   * Tạo workspace mới
   */
  create: (payload: CreateWorkspaceDTO) =>
    handleApiCall<Workspace>(async () => {
      const formData = new FormData();

      formData.append("workspaceName", payload.workspaceName);
      formData.append("ownerId", payload.ownerId);

      if (payload.description) formData.append("description", payload.description);
      if (payload.isPasswordRequired !== undefined)
        formData.append("isPasswordRequired", String(payload.isPasswordRequired));
      if (payload.password) formData.append("password", payload.password);
      if (payload.confirmPassword) formData.append("confirmPassword", payload.confirmPassword);

      if (payload.viewConfig) formData.append("viewConfig", payload.viewConfig);
      if (payload.editConfig) formData.append("editConfig", payload.editConfig);
      if (payload.commentConfig) formData.append("commentConfig", payload.commentConfig);

      const res = await axiosInstance.post<{ data: Workspace }>(
        ENDPOINT.WORKSPACELST,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return res.data.data;
    }),

 getDetail: (id: string) =>
    handleApiCall<WorkspaceDetail>(async () => {
      const res = await axiosInstance.get<{ data: WorkspaceDetail }>(
        `${ENDPOINT.WORKSPACELST}/${id}`
      );
      return res.data.data;
    }),

  update: (id: string, payload: Partial<WorkspaceDetail> & {
    viewConfig?: File;
    editConfig?: File;
    commentConfig?: File;
    password?: string;
    confirmPassword?: string;
  }) =>
    handleApiCall<WorkspaceDetail>(async () => {
      const formData = new FormData();

      formData.append("workspaceName", payload.workspaceName || "");
      formData.append("ownerId", payload.ownerId || "");
      if (payload.description) formData.append("description", payload.description);
      formData.append("isPasswordRequired", String(payload.isPasswordRequired));

      if (payload.password) formData.append("password", payload.password);
      if (payload.confirmPassword) formData.append("confirmPassword", payload.confirmPassword);

      if (payload.viewConfig) formData.append("viewConfig", payload.viewConfig);
      if (payload.editConfig) formData.append("editConfig", payload.editConfig);
      if (payload.commentConfig) formData.append("commentConfig", payload.commentConfig);

      const res = await axiosInstance.patch<{ data: WorkspaceDetail }>(
        `${ENDPOINT.WORKSPACELST}/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return res.data.data;
    }),

  /**
   * Xóa workspace
   */
  delete: (id: string) =>
    handleApiCall<void>(async () => {
      await axiosInstance.delete(`${ENDPOINT.WORKSPACELST}/${id}`);
    }),

  /**
   * Thêm thành viên
   */
  addMember: (workspaceId: string, user_id: string) =>
    handleApiCall(async () => {
      const res = await axiosInstance.post(`system/workspaces/${workspaceId}/members`, {
        user_id : user_id,
      });
      return res.data;
    }),

  /**
   * Xóa thành viên
   */
  removeMembers: (payload: RemoveMembersDTO) =>
    handleApiCall<Workspace>(async () => {
      const res = await axiosInstance.delete<{ data: Workspace }>(
        `${ENDPOINT.WORKSPACELST}/${payload.workspaceId}/members`,
        {
          data: { memberIds: payload.memberIds },
        }
      );
      return res.data.data;
    }),

  /**
   * Đổi mật khẩu
   */
  changePassword: (payload: ChangePasswordDTO) =>
    handleApiCall<void>(async () => {
      await axiosInstance.patch(
        `${ENDPOINT.WORKSPACELST}/${payload.workspaceId}/reset-password`,
        {
          currentPassword: payload.currentPassword,
          password: payload.password,
          confirmPassword:payload.confirmPassword
        }
      );
    }),
};
