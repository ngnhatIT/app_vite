import { createSlice } from "@reduxjs/toolkit";
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

const setPending = (state: AuthState) => {
  state.status = "loading";
  state.error = null;
};

const setSucceeded = (state: AuthState) => {
  state.status = "succeeded";
  state.error = null;
};

const setFailed = (
  state: AuthState,
  action: { payload: unknown; error: { message?: string } }
) => {
  state.status = "failed";
  // Try to extract a string error message from payload or error.message
  if (typeof action.payload === "string") {
    state.error = action.payload;
  } else if (action.error && typeof action.error.message === "string") {
    state.error = action.error.message;
  } else {
    state.error = "Unknown error";
  }
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
      sessionStorage.removeItem("accessToken");
    },
    clearError(state) {
      state.error = null;
    },
    resetAuth: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, setPending)
      .addCase(loginThunk.fulfilled, (state, action) => {
        setSucceeded(state);
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        sessionStorage.setItem("accessToken", action.payload.token);
      })
      .addCase(loginThunk.rejected, setFailed)
      .addCase(registerThunk.pending, setPending)
      .addCase(registerThunk.fulfilled, (state) => {
        setSucceeded(state);
      })
      .addCase(registerThunk.rejected, setFailed)
      .addCase(verifyOtpThunk.pending, setPending)
      .addCase(verifyOtpThunk.fulfilled, setSucceeded)
      .addCase(verifyOtpThunk.rejected, setFailed)
      .addCase(sendOtpThunk.pending, setPending)
      .addCase(sendOtpThunk.fulfilled, setSucceeded)
      .addCase(sendOtpThunk.rejected, setFailed)
      .addCase(resetPasswordThunk.pending, setPending)
      .addCase(resetPasswordThunk.fulfilled, setSucceeded)
      .addCase(resetPasswordThunk.rejected, setFailed);
  },
});

export const { logout, clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
