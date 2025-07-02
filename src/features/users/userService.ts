import axiosInstance from "../../api/AxiosIntance";
import { handleApiCall } from "../../api/HandApiCall";
import { ENDPOINT } from "../../utils/constantEndPoint";
import type { RoleDTO } from "./dto/RoleDTO";
import type {
  UserCreateRequestDTO,
  UserCreateResponseDTO,
} from "./dto/UserCreateDTO";
import type { UserListResponseDTO, UserDTO } from "./dto/UserDTO";
import type {
  UserUpdateRequestDTO,
  UserStatusUpdateDTO,
} from "./dto/UserUpdateDTO";
import type { WorkSpaceDTO } from "./dto/WorkSpace.DTO";

export const userService = {
  fetchUsers: async (): Promise<UserListResponseDTO> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.get(ENDPOINT.LIST);
      return data;
    }),

  createUser: async (
    payload: UserCreateRequestDTO
  ): Promise<UserCreateResponseDTO> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.post(ENDPOINT.CREATE, payload);
      return data;
    }),

  updateUser: async (payload: UserUpdateRequestDTO): Promise<UserDTO> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.put(ENDPOINT.UPDATE, payload);
      return data;
    }),

  toggleUserStatus: async (payload: UserStatusUpdateDTO): Promise<UserDTO> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.put(ENDPOINT.UPDATESTATUS, payload);
      return data;
    }),

  getRoles: async (): Promise<RoleDTO[]> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.get(ENDPOINT.ROLE);
      return data.data;
    }),
  getWorkSpaces: async (): Promise<WorkSpaceDTO[]> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.get(ENDPOINT.WORKSPACELST);
      return data.data;
    }),

  getUserDetail: async (userId: string): Promise<UserDTO> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.get(ENDPOINT.DETAIL, {
        params: { user_id: userId },
      });
      return data.data;
    }),
};
