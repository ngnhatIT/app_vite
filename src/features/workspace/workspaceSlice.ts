import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  checkPassword,
  loginWorkspace,
  fetchFiles,
  createFile,
  deleteFile,
  fetchUsersBySheet,
  addUserToSheet,
  removeUserFromSheet,
} from "./workspceThunk";
import type { GoogleSheetFile, SheetUserPermission } from "./dto/workspaceDTO";

interface WorkspaceState {
  loading: boolean;
  error: string | null;
  successMsg: string | null;
  loggedIn: boolean;
  files: GoogleSheetFile[];
  users: SheetUserPermission[];
  currentWorkspaceId: string | null;
}

const initialState: WorkspaceState = {
  loading: false,
  error: null,
  successMsg: null,
  loggedIn: false,
  files: [],
  users: [],
  currentWorkspaceId: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccessMsg(state) {
      state.successMsg = null;
    },
    setCurrentWorkspaceId(state, action: PayloadAction<string | null>) {
      state.currentWorkspaceId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(checkPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message || "Check password failed";
      })
      .addCase(loginWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWorkspace.fulfilled, (state) => {
        state.loading = false;
        state.loggedIn = true;
      })
      .addCase(loginWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Login failed";
      })
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload || [];
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Fetch files failed";
      })
      .addCase(createFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFile.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg =
          (action.payload as any)?.message || "File created successfully";
      })
      .addCase(createFile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Create file failed";
      })
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg =
          (action.payload as any)?.message || "File deleted successfully";
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Delete file failed";
      })
      .addCase(fetchUsersBySheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersBySheet.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersBySheet.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Fetch users failed";
      })
      .addCase(addUserToSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserToSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg =
          (action.payload as any)?.message || "User added successfully";
      })
      .addCase(addUserToSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Add user failed";
      })
      .addCase(removeUserFromSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUserFromSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg =
          (action.payload as any)?.message || "User removed successfully";
      })
      .addCase(removeUserFromSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Remove user failed";
      });
  },
});

export const { clearError, clearSuccessMsg, setCurrentWorkspaceId } =
  workspaceSlice.actions;

export default workspaceSlice.reducer;
