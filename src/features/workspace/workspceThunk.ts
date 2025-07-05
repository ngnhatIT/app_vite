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
  WorkspaceListByUserResponseDto,
} from "./dto/workspaceDTO";
import type { ResponseDTO } from "./dto/workspaceDTO";
import { workspaceService } from "./workspaceService";

// ✅ Kiểm tra workspace có yêu cầu password
export const checkPassword = createAsyncThunk(
  "workspace/checkPassword",
  async (dto: CheckUserInWspDTO, thunkAPI) => {
    try {
      const res: ResponseDTO<any> = await workspaceService.checkPassword(dto);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const updateUserPermissions = createAsyncThunk(
  "workspace/updateUserPermissions",
  async (dto: UpdateUserPermissionDTO, thunkAPI) => {
    try {
      const res: ResponseDTO<any> =
        await workspaceService.updateUserPermissions(dto);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const loginWorkspace = createAsyncThunk(
  "workspace/login",
  async (dto: LoginWspDTO, { rejectWithValue }) => {
    try {
      const res: ResponseDTO<any> = await workspaceService.login(dto);
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchFiles = createAsyncThunk<
  GoogleSheetFile[],
  ListFileGoogleSheetDTO,
  { rejectValue: string }
>("workspace/fetchFiles", async (dto, { rejectWithValue }) => {
  try {
    const res: ResponseDTO<{ list: GoogleSheetFile[] }> =
      await workspaceService.listFiles(dto);
    console.log("fetchFiles res.data:", res.data); // Debug log
    return res.data.list;
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to fetch files");
  }
});

export const createFile = createAsyncThunk(
  "workspace/createFile",
  async (dto: CreateFileGoogleSheetDTO, { rejectWithValue }) => {
    try {
      const res: ResponseDTO<any> = await workspaceService.createFile(dto);
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteFile = createAsyncThunk(
  "workspace/deleteFile",
  async (dto: DeleteSheetDTO, { rejectWithValue }) => {
    try {
      const res: ResponseDTO<any> = await workspaceService.deleteFile(dto);
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchUsersBySheet = createAsyncThunk<
  SheetUserPermission[],
  ListUserBySheetDTO,
  { rejectValue: string }
>("workspace/fetchUsersBySheet", async (dto, { rejectWithValue }) => {
  try {
    const res: ResponseDTO<SheetUserPermission[]> =
      await workspaceService.listUsersBySheet(dto);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to fetch users by sheet");
  }
});

export const addUserToSheet = createAsyncThunk(
  "workspace/addUserToSheet",
  async (dto: AddUserSheetDTO, thunkAPI) => {
    try {
      const res: ResponseDTO<any> = await workspaceService.addUserToSheet(dto);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const removeUserFromSheet = createAsyncThunk(
  "workspace/removeUserFromSheet",
  async (dto: DelUserSheetDTO, { rejectWithValue }) => {
    try {
      const res: ResponseDTO<any> = await workspaceService.removeUserFromSheet(
        dto
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const listWorkspacesByUserThunk = createAsyncThunk<
  WorkspaceListByUserResponseDto[],
  void,
  { rejectValue: string }
>("workspace/listWorkspacesByUser", async (_, { rejectWithValue }) => {
  try {
    const res = await workspaceService.listWorkspacesByUser();
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to fetch workspaces");
  }
});
