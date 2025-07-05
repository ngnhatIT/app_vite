import axiosInstance from "../../api/AxiosIntance";
import { handleApiCall } from "../../api/HandApiCall";
import type {
  CheckUserInWspDTO,
  ResponseDTO,
  LoginWspDTO,
  ListFileGoogleSheetDTO,
  GoogleSheetFile,
  CreateFileGoogleSheetDTO,
  DeleteSheetDTO,
  ListUserBySheetDTO,
  SheetUserPermission,
  AddUserSheetDTO,
  DelUserSheetDTO,
  UpdateUserPermissionDTO,
  WorkspaceListByUserResponseDto,
} from "./dto/workspaceDTO";

export const workspaceService = {
  updateUserPermissions: (dto: UpdateUserPermissionDTO): Promise<ResponseDTO> =>
    handleApiCall(() =>
      axiosInstance.post("/googlesheet/update-user-permissions", dto)
    ),

  checkPassword: (dto: CheckUserInWspDTO): Promise<ResponseDTO> =>
    handleApiCall(async () => {
      const res = await axiosInstance.post("/googlesheet/checkpass-wsp", dto);
      return res.data;
    }),

  login: (dto: LoginWspDTO): Promise<ResponseDTO> =>
    handleApiCall(async () => {
      const res = await axiosInstance.post("/googlesheet/login-wsp", dto);
      return res.data;
    }),

  listFiles: (
    dto: ListFileGoogleSheetDTO
  ): Promise<ResponseDTO<{ list: GoogleSheetFile[] }>> =>
    handleApiCall(async () => {
      const res = await axiosInstance.post("/googlesheet/list-file", dto);
      return res.data;
    }),

  createFile: (dto: CreateFileGoogleSheetDTO): Promise<ResponseDTO> =>
    handleApiCall(() => axiosInstance.post("/googlesheet/create-file", dto)),

  deleteFile: (dto: DeleteSheetDTO): Promise<ResponseDTO> =>
    handleApiCall(() => axiosInstance.post("/googlesheet/delete-file", dto)),

  listUsersBySheet: (
    dto: ListUserBySheetDTO
  ): Promise<ResponseDTO<SheetUserPermission[]>> =>
    handleApiCall(() =>
      axiosInstance.post("/googlesheet/list-user-permission", dto)
    ),

  addUserToSheet: (dto: AddUserSheetDTO): Promise<ResponseDTO> =>
    handleApiCall(() => axiosInstance.post("/googlesheet/add-user-sheet", dto)),

  removeUserFromSheet: (dto: DelUserSheetDTO): Promise<ResponseDTO> =>
    handleApiCall(() => axiosInstance.post("/googlesheet/del-user-sheet", dto)),

  /** 🔷 BỔ SUNG: Lấy danh sách workspace theo user */
  listWorkspacesByUser: (): Promise<
    ResponseDTO<WorkspaceListByUserResponseDto[]>
  > =>
    handleApiCall(async () => {
      const res = await axiosInstance.get<
        ResponseDTO<WorkspaceListByUserResponseDto[]>
      >("system/workspaces/sub-menu");
      return res.data;
    }),
};
