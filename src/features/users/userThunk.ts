import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "./userService";
import type {
  UserUpdateRequestDTO,
  UserStatusUpdateDTO,
} from "./dto/UserUpdateDTO";
import type { UserCreateRequestDTO } from "./dto/UserCreateDTO";

// Lấy danh sách user
export const fetchUsersThunk = createAsyncThunk("user/fetchUsers", async () => {
  const res = await userService.fetchUsers();
  return res;
});

// Lấy chi tiết user theo ID
export const getUserDetailThunk = createAsyncThunk(
  "user/getUserDetail",
  async (userId: string) => {
    const res = await userService.getUserDetail(userId);
    return res;
  }
);

// Tạo user mới
export const createUserThunk = createAsyncThunk(
  "user/createUser",
  async (payload: UserCreateRequestDTO, { dispatch }) => {
    await userService.createUser(payload);
    dispatch(fetchUsersThunk());
  }
);

// Cập nhật user
export const updateUserThunk = createAsyncThunk(
  "user/updateUser",
  async (payload: UserUpdateRequestDTO, { dispatch }) => {
    await userService.updateUser(payload);
    dispatch(fetchUsersThunk());
  }
);

// Đổi trạng thái user
export const updateUserStatusThunk = createAsyncThunk(
  "user/updateUserStatus",
  async (payload: UserStatusUpdateDTO, { dispatch }) => {
    await userService.toggleUserStatus(payload);
    dispatch(fetchUsersThunk());
  }
);
