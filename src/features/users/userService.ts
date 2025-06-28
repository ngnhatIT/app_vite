import axiosInstance from "../../api/AxiosIntance";
import type { RoleDTO } from "./dto/RoleDTO";
import type {
  UserCreateRequestDTO,
  UserCreateResponseDTO,
} from "./dto/UserCreateDTO";
import type { UserDTO, UserListResponseDTO } from "./dto/UserDTO";
import type {
  UserStatusUpdateDTO,
  UserUpdateRequestDTO,
} from "./dto/UserUpdateDTO";

export const userService = {
  fetchUsers: async (): Promise<UserListResponseDTO> => {
    const res = await axiosInstance.get("/user");
    return res.data;
  },

  createUser: async (
    payload: UserCreateRequestDTO
  ): Promise<UserCreateResponseDTO> => {
    const res = await axiosInstance.post("/user/create", payload);
    return res.data;
  },

  updateUser: async (payload: UserUpdateRequestDTO): Promise<UserDTO> => {
    const res = await axiosInstance.put("/user/update", payload);
    return res.data;
  },

  toggleUserStatus: async (payload: UserStatusUpdateDTO): Promise<UserDTO> => {
    const res = await axiosInstance.put("/user/update_status", payload);
    return res.data;
  },
  getRoles: async (): Promise<RoleDTO[]> => {
    const res = await axiosInstance.get("/role");
    return res.data.data; // trả về mảng role
  },
  getUserDetail: async (userId: string): Promise<UserDTO> => {
    const res = await axiosInstance.get(`/user/get_detail`, {
      params: { user_id: userId },
    });
    return res.data;
  },
};
