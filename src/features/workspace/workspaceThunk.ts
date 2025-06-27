// store/thunks/workspaceThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  WorkspaceDTO,
  AddUserToWorkspaceDTO,
  ChangeWorkspacePasswordDTO,
} from "./dto/WorkspaceDTO";
import { workspaceService } from "./workspaceService";

export const fetchWorkspacesThunk = createAsyncThunk(
  "workspaces/fetchAll",
  async () => {
    const res = await workspaceService.getAll();
    return res.data;
  }
);

export const createWorkspaceThunk = createAsyncThunk(
  "workspaces/create",
  async (data: WorkspaceDTO) => {
    const res = await workspaceService.create(data);
    return res.data;
  }
);

export const updateWorkspaceThunk = createAsyncThunk(
  "workspaces/update",
  async ({ id, data }: { id: number; data: Partial<WorkspaceDTO> }) => {
    const res = await workspaceService.update(id, data);
    return res.data;
  }
);

export const deleteWorkspaceThunk = createAsyncThunk(
  "workspaces/delete",
  async (id: number) => {
    await workspaceService.delete(id);
    return id;
  }
);

export const addUserToWorkspaceThunk = createAsyncThunk(
  "workspaces/addUser",
  async (data: AddUserToWorkspaceDTO) => {
    const res = await workspaceService.addUser(data);
    return res.data;
  }
);

export const changeWorkspacePasswordThunk = createAsyncThunk(
  "workspaces/changePassword",
  async (data: ChangeWorkspacePasswordDTO) => {
    const res = await workspaceService.changePassword(data);
    return res.data;
  }
);
