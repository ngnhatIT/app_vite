import axiosInstance from "../../api/AxiosIntance";
import { handleApiCall } from "../../api/HandApiCall";
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

interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export const userService = {
  fetchUsers: async (): Promise<UserListResponseDTO> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.get("/user");
      return data;
    }),

  createUser: async (
    payload: UserCreateRequestDTO
  ): Promise<UserCreateResponseDTO> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.post("/user/create", payload);
      return data;
    }),

  updateUser: async (payload: UserUpdateRequestDTO): Promise<UserDTO> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.put("/user/update", payload);
      return data;
    }),

  toggleUserStatus: async (payload: UserStatusUpdateDTO): Promise<UserDTO> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.put("/user/update_status", payload);
      return data;
    }),

  getRoles: async (): Promise<RoleDTO[]> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.get("/role");
      return data.data;
    }),

  getUserDetail: async (userId: string): Promise<UserDTO> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.get("/user/get_detail", {
        params: { user_id: userId },
      });
      return data.data;
    }),
};
