import { createAsyncThunk } from "@reduxjs/toolkit";
import { workspaceService } from "./workspaceService";
import type { Workspace, CreateWorkspaceDTO, UpdateWorkspaceDTO, AddMemberDTO, RemoveMembersDTO, ChangePasswordDTO, WorkspaceDetail } from "./dto/workSpaceDTO";


export const fetchWorkspacesThunk = createAsyncThunk<
  Workspace[]
>("workspace/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await workspaceService.fetchAll();
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const createWorkspaceThunk = createAsyncThunk<
  Workspace,
  CreateWorkspaceDTO
>("workspace/create", async (payload, { rejectWithValue }) => {
  try {
    return await workspaceService.create(payload);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getWorkspaceDetailThunk = createAsyncThunk<
  WorkspaceDetail,
  string,
  { rejectValue: string }
>("workspace/getDetail", async (id, { rejectWithValue }) => {
  try {
    const data = await workspaceService.getDetail(id);
    return data;
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to load detail");
  }
});

export const updateWorkspaceThunk = createAsyncThunk<
  WorkspaceDetail,
  { id: string; payload: Partial<WorkspaceDetail> & { viewConfig?: File; editConfig?: File; commentConfig?: File; password?: string; confirmPassword?: string } },
  { rejectValue: string }
>("workspace/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const data = await workspaceService.update(id, payload);
    return data;
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to update workspace");
  }
});

export const deleteWorkspaceThunk = createAsyncThunk<
  string,
  string
>("workspace/delete", async (id, { rejectWithValue }) => {
  try {
    await workspaceService.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const addMemberThunk = createAsyncThunk<
  any, // hoặc Workspace nếu bạn trả về toàn bộ workspace
  { workspaceId: string; userId: string }
>("workspace/addMember", async ({ workspaceId, userId }, { rejectWithValue }) => {
  try {
    return await workspaceService.addMember(workspaceId, userId);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const removeMembersThunk = createAsyncThunk<
  Workspace,
  RemoveMembersDTO
>("workspace/removeMembers", async (payload, { rejectWithValue }) => {
  try {
    return await workspaceService.removeMembers(payload);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const changePasswordThunk = createAsyncThunk<
  void,
  ChangePasswordDTO
>("workspace/changePassword", async (payload, { rejectWithValue }) => {
  try {
    await workspaceService.changePassword(payload);
  } catch (err) {
    return rejectWithValue(err);
  }
});
