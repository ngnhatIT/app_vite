import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWorkspacesThunk,
  createWorkspaceThunk,
  updateWorkspaceThunk,
  deleteWorkspaceThunk,
  addUserThunk,
  removeUsersThunk,
  updateUserThunk,
  changePasswordThunk,
} from "./workspaceThunk";
import type { Workspace } from "../workspace/dto/workspaceDTO";

type WorkspaceState = {
  list: Workspace[];
  loading: boolean;
  error: string | null;
};

const initialState: WorkspaceState = {
  list: [],
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspacesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspacesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchWorkspacesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createWorkspaceThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateWorkspaceThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex(
          (w: any) => w.id === action.payload.id
        );
        if (idx >= 0) state.list[idx] = action.payload;
      })
      .addCase(deleteWorkspaceThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((w: any) => w.id !== action.payload);
      })

      // Manage Users
      .addCase(addUserThunk.fulfilled, (state, action) => {
        // optionally: update state if needed
      })
      .addCase(removeUsersThunk.fulfilled, (state, action) => {
        // optionally: update state if needed
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        // optionally: update state if needed
      })
      .addCase(changePasswordThunk.fulfilled, (state, action) => {
        // optionally: update state if needed
      });
  },
});

export default workspaceSlice.reducer;
