import { createSlice } from "@reduxjs/toolkit";

import {
  fetchWorkspacesThunk,
  createWorkspaceThunk,
  updateWorkspaceThunk,
  deleteWorkspaceThunk,
  addMemberThunk,
  removeMembersThunk,
  getWorkspaceDetailThunk,
} from "./workspaceThunk";
import type { Workspace, WorkspaceDetail } from "./dto/workSpaceDTO";

interface WorkspaceState {
  list: Workspace[];
  detail: WorkspaceDetail | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  loadingDetail: boolean;
  updating: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  list: [],
  detail: null,
  status: "idle",
  loadingDetail: false,
  updating: false,
  error: null,
};

// 📋 Mapper: WorkspaceDetail → Workspace
function mapDetailToWorkspace(detail: WorkspaceDetail): Workspace {
  return {
    workspaceId: detail.workspaceId,
    workspaceName: detail.workspaceName,
    workspaceOwner: detail.ownerUsername || "",
    email: "", // optional
    avatar: "", // optional
    members: 0, // optional
    createdAt: "", // optional
    updatedAt: "", // optional
  };
}

const workspaceSlice = createSlice({
  name: "workspaceMng",
  initialState,
  reducers: {
    clearDetail(state) {
      state.detail = null;
    },
    clearError(state) {
      state.error = null;
    },

    // ✅ Thêm/giảm members local
    addMemberLocal(state, action) {
      const { workspaceId } = action.payload;
      const idx = state.list.findIndex((w) => w.workspaceId === workspaceId);
      if (idx >= 0) {
        state.list[idx].members = Number(state.list[idx].members) + 1;
      }
    },
    removeMembersLocal(state, action) {
      const { workspaceId, count } = action.payload;
      const idx = state.list.findIndex((w) => w.workspaceId === workspaceId);
      if (idx >= 0) {
        state.list[idx].members = Math.max(
          0,
          Number(state.list[idx].members) - count
        );
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspacesThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWorkspacesThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchWorkspacesThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as any)?.message || "Failed to fetch";
      })

      .addCase(createWorkspaceThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(updateWorkspaceThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateWorkspaceThunk.fulfilled, (state, action) => {
        state.updating = false;
        const idx = state.list.findIndex(
          (w) => w.workspaceId === action.payload.workspaceId
        );
        if (idx >= 0) {
          state.list[idx] = mapDetailToWorkspace(action.payload);
        }
      })
      .addCase(updateWorkspaceThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = (action.payload as any) || "Failed to update";
      })

      .addCase(deleteWorkspaceThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((w) => w.workspaceId !== action.payload);
      })

      .addCase(addMemberThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex(
          (w) => w.workspaceId === action.payload.workspaceId
        );
        if (idx >= 0) {
          state.list[idx] = action.payload as any;
        }
      })

      .addCase(removeMembersThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex(
          (w) => w.workspaceId === action.payload.workspaceId
        );
        if (idx >= 0) {
          state.list[idx] = action.payload as any;
        }
      })

      .addCase(getWorkspaceDetailThunk.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(getWorkspaceDetailThunk.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.detail = action.payload;
      })
      .addCase(getWorkspaceDetailThunk.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = (action.payload as any) || "Failed to load detail";
      });
  },
});

export const { clearDetail, clearError, addMemberLocal, removeMembersLocal } =
  workspaceSlice.actions;

export default workspaceSlice.reducer;
