// store/slices/workspaceSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { WorkspaceDTO } from "./dto/WorkspaceDTO";
import {
  createWorkspaceThunk,
  deleteWorkspaceThunk,
  fetchWorkspacesThunk,
  updateWorkspaceThunk,
} from "./workspaceThunk";

interface WorkspaceState {
  data: WorkspaceDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  data: [],
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspacesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspacesThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchWorkspacesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi khi tải workspaces";
      })
      .addCase(createWorkspaceThunk.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateWorkspaceThunk.fulfilled, (state, action) => {
        const idx = state.data.findIndex((w) => w.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
      })
      .addCase(deleteWorkspaceThunk.fulfilled, (state, action) => {
        state.data = state.data.filter((w) => w.id !== action.payload);
      });
  },
});

export default workspaceSlice.reducer;
