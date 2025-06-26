import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUsersThunk,
  getUserDetailThunk,
  createUserThunk,
  updateUserThunk,
  updateUserStatusThunk,
} from "./userThunk";
import type { UserDTO } from "./dto/UserDTO";

interface UserState {
  users: UserDTO[];
  currentUser: UserDTO | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.users = action.payload.data;
        state.status = "succeeded";
      })
      .addCase(fetchUsersThunk.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getUserDetailThunk.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export default userSlice.reducer;
