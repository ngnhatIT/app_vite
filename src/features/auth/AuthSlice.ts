import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  loginThunk,
  registerThunk,
  resetPasswordThunk,
  sendOtpThunk,
  verifyOtpThunk,
} from "./AuthThunk";

interface UserDTO {
  username: string;
  email: string;
}

interface AuthState {
  user: UserDTO | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.isAuthenticated = false;
      state.error = null;
      sessionStorage.removeItem("access_token");
    },
    clearError(state) {
      state.error = null;
    },
    resetAuth: () => initialState,
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed";
      });

    // REGISTER
    builder
      .addCase(registerThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Register failed";
      });

    // VERIFY OTP
    builder
      .addCase(verifyOtpThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "OTP verification failed";
      });

    // SEND OTP
    builder
      .addCase(sendOtpThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Send OTP failed";
      });

    // RESET PASSWORD
    builder
      .addCase(resetPasswordThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Reset password failed";
      });
  },
});

export const { logout, clearError,resetAuth } = authSlice.actions;
export default authSlice.reducer;
