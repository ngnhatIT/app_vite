// Refactored userSlice.ts with separated status and cache optimization
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUsersThunk,
  createUserThunk,
  updateUserThunk,
  updateUserStatusThunk,
  getUserDetailThunk,
} from "./userThunk";
import type { UserDTO } from "./dto/UserDTO";

interface UserState {
  users: UserDTO[];
  selectedUser: UserDTO | null;
  status: {
    list: "idle" | "loading" | "succeeded" | "failed";
    detail: "idle" | "loading" | "succeeded" | "failed";
    create: "idle" | "loading" | "succeeded" | "failed";
    update: "idle" | "loading" | "succeeded" | "failed";
    toggleStatus: "idle" | "loading" | "succeeded" | "failed";
  };
  error: string | null;
  lastFetched: number | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  status: {
    list: "idle",
    detail: "idle",
    create: "idle",
    update: "idle",
    toggleStatus: "idle",
  },
  error: null,
  lastFetched: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.status.list = "loading";
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.status.list = "succeeded";
        state.users = action.payload.data;
        state.lastFetched = Date.now();
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.status.list = "failed";
        state.error = action.error.message ?? "Failed to fetch users";
      })

      .addCase(getUserDetailThunk.pending, (state) => {
        state.status.detail = "loading";
        state.error = null;
      })
      .addCase(getUserDetailThunk.fulfilled, (state, action) => {
        state.status.detail = "succeeded";
        state.selectedUser = action.payload;
      })
      .addCase(getUserDetailThunk.rejected, (state, action) => {
        state.status.detail = "failed";
        state.error = action.error.message ?? "Failed to get user detail";
      })

      .addCase(createUserThunk.pending, (state) => {
        state.status.create = "loading";
      })
      .addCase(createUserThunk.fulfilled, (state) => {
        state.status.create = "succeeded";
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.status.create = "failed";
        state.error = action.error.message ?? "Failed to create user";
      })

      .addCase(updateUserThunk.pending, (state) => {
        state.status.update = "loading";
      })
      .addCase(updateUserThunk.fulfilled, (state) => {
        state.status.update = "succeeded";
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.status.update = "failed";
        state.error = action.error.message ?? "Failed to update user";
      })

      .addCase(updateUserStatusThunk.pending, (state) => {
        state.status.toggleStatus = "loading";
      })
      .addCase(updateUserStatusThunk.fulfilled, (state) => {
        state.status.toggleStatus = "succeeded";
      })
      .addCase(updateUserStatusThunk.rejected, (state, action) => {
        state.status.toggleStatus = "failed";
        state.error = action.error.message ?? "Failed to update user status";
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
