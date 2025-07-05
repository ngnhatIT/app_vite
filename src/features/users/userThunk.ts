import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "./userService";
import type { UserCreateRequestDTO, UserCreateResponseDTO } from "./dto/UserCreateDTO";
import type { UserUpdateRequestDTO, UserStatusUpdateDTO } from "./dto/UserUpdateDTO";
import type { UserDTO, UserListResponseDTO } from "./dto/UserDTO";

// Fetch Users
export const fetchUsersThunk = createAsyncThunk<
  UserListResponseDTO,
  void,
  { rejectValue: string }
>(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userService.fetchUsers();
      return res;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// Create User
export const createUserThunk = createAsyncThunk<
  UserCreateResponseDTO,
  UserCreateRequestDTO,
  { rejectValue: string }
>(
  "user/createUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await userService.createUser(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// Update User
export const updateUserThunk = createAsyncThunk<
  UserDTO,
  UserUpdateRequestDTO,
  { rejectValue: string }
>(
  "user/updateUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await userService.updateUser(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// Update User Status
export const updateUserStatusThunk = createAsyncThunk<
  UserDTO,
  UserStatusUpdateDTO,
  { rejectValue: string }
>(
  "user/updateUserStatus",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await userService.updateUserStatus(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

// Get User Detail
export const getUserDetailThunk = createAsyncThunk<
  UserDTO,
  string,
  { rejectValue: string }
>(
  "user/getUserDetail",
  async (user_id, { rejectWithValue }) => {
    try {
      const res = await userService.getUserDetail(user_id);
      return res;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);
