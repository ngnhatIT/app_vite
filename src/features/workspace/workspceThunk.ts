import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  CheckUserInWspDTO,
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
import { workspaceService } from "./workspaceService";

// ✅ Kiểm tra workspace có yêu cầu password
export const checkPassword = createAsyncThunk(
  "workspace/checkPassword",
  async (dto: CheckUserInWspDTO, thunkAPI) => {
    try {
      const res = await workspaceService.checkPassword(dto);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const updateUserPermissions = createAsyncThunk(
  "workspace/updateUserPermissions",
  async (dto: UpdateUserPermissionDTO, thunkAPI) => {
    try {
      const res = await workspaceService.updateUserPermissions(dto);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ✅ Đăng nhập workspace
export const loginWorkspace = createAsyncThunk(
  "workspace/login",
  async (dto: LoginWspDTO, thunkAPI) => {
    try {
      const res = await workspaceService.login(dto);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ✅ Lấy danh sách file
export const fetchFiles = createAsyncThunk(
  "workspace/fetchFiles",
  async (dto: ListFileGoogleSheetDTO, thunkAPI) => {
    try {
      const res = await workspaceService.listFiles(dto);
      return res.list as GoogleSheetFile[];
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ✅ Tạo file mới
export const createFile = createAsyncThunk(
  "workspace/createFile",
  async (dto: CreateFileGoogleSheetDTO, thunkAPI) => {
    try {
      const res = await workspaceService.createFile(dto);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ✅ Xoá file
export const deleteFile = createAsyncThunk(
  "workspace/deleteFile",
  async (dto: DeleteSheetDTO, thunkAPI) => {
    try {
      const res = await workspaceService.deleteFile(dto);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ✅ Lấy danh sách user theo sheet
export const fetchUsersBySheet = createAsyncThunk(
  "workspace/fetchUsersBySheet",
  async (dto: ListUserBySheetDTO, thunkAPI) => {
    try {
      const res = await workspaceService.listUsersBySheet(dto);
      return res.list as SheetUserPermission[];
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ✅ Thêm user vào sheet
export const addUserToSheet = createAsyncThunk(
  "workspace/addUserToSheet",
  async (dto: AddUserSheetDTO, thunkAPI) => {
    try {
      const res = await workspaceService.addUserToSheet(dto);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ✅ Xoá user khỏi sheet
export const removeUserFromSheet = createAsyncThunk(
  "workspace/removeUserFromSheet",
  async (dto: DelUserSheetDTO, thunkAPI) => {
    try {
      const res = await workspaceService.removeUserFromSheet(dto);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
