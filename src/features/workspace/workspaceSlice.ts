import { createSlice } from "@reduxjs/toolkit";
import { fetchWorkspacesThunk } from "./workspceThunk";
import type { Workspace } from "./dto/workspaceDTO";
interface WorkspaceState {
  list: Workspace[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WorkspaceState = {
  list: [],
  status: "idle",
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspacesThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkspacesThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchWorkspacesThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default workspaceSlice.reducer;
