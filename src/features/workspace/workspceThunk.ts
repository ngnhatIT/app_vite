import { createAsyncThunk } from "@reduxjs/toolkit";
import { workspaceService } from "./workspaceService";
import type { Workspace } from "./dto/workspaceDTO";

// Lấy danh sách workspace của user
export const fetchWorkspacesThunk = createAsyncThunk<Workspace[]>(
  "workspace/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      const data = await workspaceService.fetchWorkSpace();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to load workspaces"
      );
    }
  }
);
