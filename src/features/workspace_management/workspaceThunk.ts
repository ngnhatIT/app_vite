// 📁 src/features/workspace/workspaceThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { workspaceService } from "./workspaceService";

export const fetchWorkspacesThunk = createAsyncThunk(
  "workspace/fetchList",
  async (
    params: { page: number; pageSize: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await workspaceService.fetch(params);
      return { list: res.data.data, total: res.data.total };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createWorkspaceThunk = createAsyncThunk(
  "workspace/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await workspaceService.create(formData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateWorkspaceThunk = createAsyncThunk(
  "workspace/update",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const res = await workspaceService.update(id, formData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteWorkspaceThunk = createAsyncThunk(
  "workspace/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await workspaceService.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const addUserToWorkspaceThunk = createAsyncThunk(
  "workspace/addUser",
  async (
    { workspaceId, userId }: { workspaceId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await workspaceService.addUser(workspaceId, userId);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeUsersFromWorkspaceThunk = createAsyncThunk(
  "workspace/removeUsers",
  async (
    { workspaceId, userIds }: { workspaceId: string; userIds: string[] },
    { rejectWithValue }
  ) => {
    try {
      const res = await workspaceService.removeUsers(workspaceId, userIds);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateWorkspaceUserThunk = createAsyncThunk(
  "workspace/updateUser",
  async (
    {
      workspaceId,
      userId,
      role,
    }: { workspaceId: string; userId: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await workspaceService.updateUser(workspaceId, userId, role);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const changeWorkspacePasswordThunk = createAsyncThunk(
  "workspace/changePassword",
  async (
    {
      workspaceId,
      current,
      next,
    }: { workspaceId: string; current: string; next: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await workspaceService.changePassword(
        workspaceId,
        current,
        next
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
