import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "../../app/store";
import i18n from "../../i18n/i18n";
import { notification } from "antd";
import { getErrorMessage } from "../../utils/errorUtil";
import { useAuthService } from "./AuthService";
import type { VerifyOtpRequestDTO } from "./dto/VerifyOtpRequestDTO";
import type { ResetPasswordRequestDTO } from "./dto/ResetPasswordRequestDTO";
import type { SignInRequestDTO } from "./dto/SignInRequestDTO";
import type { SendOtpRequestDTO } from "./dto/SendOtpRequestDTO";
import type { ResendOtpRequestDTO } from "./dto/ResendOtpRequestDTO";
import type { SignUpRequestDTO } from "./dto/SignUpRequestDTO";
import type { App } from "electron";

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
    loginSuccess(
      state,
      action: PayloadAction<{ user: UserDTO; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "succeeded";
      state.isAuthenticated = true;
      state.error = null;
    },
    registerSuccess(
      state,
      action: PayloadAction<{ user: UserDTO; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "succeeded";
      state.isAuthenticated = true;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.isAuthenticated = false;
      state.error = null;
      sessionStorage.removeItem("access_token");
    },
    setAuthStatus(state, action: PayloadAction<AuthState["status"]>) {
      state.status = action.payload;
      if (action.payload === "succeeded" || action.payload === "idle") {
        state.error = null;
      }
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = "failed";
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  loginSuccess,
  registerSuccess,
  logout,
  setAuthStatus,
  setAuthError,
  clearError,
} = authSlice.actions;
export default authSlice.reducer;

export const loginThunk =
  (t: (key: string) => string, payload: SignInRequestDTO): AppThunk =>
  async (dispatch) => {
    dispatch(setAuthStatus("loading"));
    try {
      const { loginUser } = useAuthService(t);
      const access_token = await loginUser(payload);
      sessionStorage.setItem("access_token", access_token);
      const user = {
        username: payload.userName,
        email: "",
      };
      dispatch(loginSuccess({ user, token: access_token }));
    } catch (err: any) {
      dispatch(setAuthStatus("failed"));
      notification.error({
        message: t("login.failedTitle"),
        description: getErrorMessage(err, t),
        placement: "topLeft",
      });
    }
  };

export const sendOtpThunk =
  (t: (key: string) => string, payload: SendOtpRequestDTO,onSubmit:()=>void): AppThunk =>
  async (dispatch) => {
    dispatch(setAuthStatus("loading"));
    try {
      const { sendOtp } = useAuthService(t);
      await sendOtp(payload);
      dispatch(setAuthStatus("succeeded"));
      onSubmit();
    } catch (err: any) {
      dispatch(setAuthStatus("failed"));
    }
  };

export const resendOtpThunk =
  (t: (key: string) => string, payload: ResendOtpRequestDTO): AppThunk =>
  async (dispatch) => {
    dispatch(setAuthStatus("loading"));
    try {
      const { resendOtp } = useAuthService(t);
      await resendOtp(payload);
      dispatch(setAuthStatus("succeeded"));
    } catch (err: any) {
      dispatch(setAuthStatus("failed"));
    }
  };

export const registerThunk =
  (
    t: (key: string) => string,
    payload: SignUpRequestDTO,
    onSubmit: () => void
  ): AppThunk =>
  async (dispatch) => {
    dispatch(setAuthStatus("loading"));
    try {
      const { registerUser } = useAuthService(t);
      await registerUser(payload);
      onSubmit();
    } catch (err: any) {
      dispatch(setAuthStatus("failed"));
    }
  };

export const resetPasswordThunk =():AppThunk => async(dispatch) =>{}

export const verifyOtpThunk =():AppThunk => async(dispatch) => {
  // Implementation for verifyOtpThunk
}
