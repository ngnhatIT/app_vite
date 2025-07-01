// store/modules/profile/profileSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchProfileThunk, changePasswordThunk } from "./profileThunk";
import type { profileResponseDTO } from "./dto/profileDTO";

interface ProfileState {
  profile: profileResponseDTO | null;
  loading: boolean;
  error: string | null;
  passwordChangeSuccess: boolean;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  passwordChangeSuccess: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetPasswordStatus: (state) => {
      state.passwordChangeSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProfileThunk
      .addCase(fetchProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load profile";
      })

      // changePasswordThunk
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeSuccess = true;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to change password";
        state.passwordChangeSuccess = false;
      });
  },
});

export const { resetPasswordStatus } = profileSlice.actions;
export default profileSlice.reducer;
