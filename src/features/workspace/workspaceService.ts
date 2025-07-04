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
} from "./dto/workspaceDTO";

export const workspaceService = {
  updateUserPermissions: (dto: UpdateUserPermissionDTO): Promise<ResponseDTO> =>
    handleApiCall(() =>
      axiosInstance.post("/googlesheet/update-user-permissions", dto)
    ),

  checkPassword: (dto: CheckUserInWspDTO): Promise<ResponseDTO> =>
    handleApiCall(() => axiosInstance.post("/googlesheet/checkpass-wsp", dto)),

  login: (dto: LoginWspDTO): Promise<ResponseDTO> =>
    handleApiCall(() => axiosInstance.post("/googlesheet/login-wsp", dto)),

  listFiles: (
    dto: ListFileGoogleSheetDTO
  ): Promise<ResponseDTO<GoogleSheetFile[]>> =>
    handleApiCall(() => axiosInstance.post("/googlesheet/list-file", dto)),

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
};
