// 📁 src/features/workspace/workspaceSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWorkspacesThunk,
  createWorkspaceThunk,
  updateWorkspaceThunk,
  deleteWorkspaceThunk,
  addUserToWorkspaceThunk,
  removeUsersFromWorkspaceThunk,
  updateWorkspaceUserThunk,
  changeWorkspacePasswordThunk,
} from "./workspaceThunk";

interface WorkspaceState {
  list: any[];
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
}

const initialState: WorkspaceState = {
  list: [],
  total: 0,
  status: "idle",
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchWorkspacesThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkspacesThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.list;
        state.total = action.payload.total;
      })
      .addCase(fetchWorkspacesThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createWorkspaceThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createWorkspaceThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createWorkspaceThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateWorkspaceThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateWorkspaceThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateWorkspaceThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteWorkspaceThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteWorkspaceThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter((w) => w.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteWorkspaceThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // ADD USER
      .addCase(addUserToWorkspaceThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addUserToWorkspaceThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // REMOVE USERS
      .addCase(removeUsersFromWorkspaceThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(removeUsersFromWorkspaceThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // UPDATE USER ROLE
      .addCase(updateWorkspaceUserThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateWorkspaceUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // CHANGE PASSWORD
      .addCase(changeWorkspacePasswordThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(changeWorkspacePasswordThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default workspaceSlice.reducer;
