import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserDTO } from "./dto/LoginResponseDTO";
import type { LoginRequestDTO } from "./dto/LoginRequestDTO";
import type { AppThunk } from "../../app/store";
import i18n from "../../i18n/i18n";
import { notification } from "antd";
import { getErrorMessage } from "../../utils/errorUtil";
import { useAuthService } from "./AuthService";
import type { VerifyOtpRequestDTO } from "./dto/VerifyOtpRequestDTO";
import type { ResetPasswordRequestDTO } from "./dto/ResetPasswordRequestDTO";

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
  (t: (key: string) => string,payload: LoginRequestDTO): AppThunk =>
  async (dispatch) => {
    dispatch(setAuthStatus("loading"));
    try {
      const { loginUser } = useAuthService(t);
      const { access_token, user } = await loginUser(payload);
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

export const sendOtp =
  (t: (key: string) => string,email: string): AppThunk =>
  async (dispatch) => {
    dispatch(setAuthStatus("loading"));
    try {
      const { sendOtp } = useAuthService(t);
      await sendOtp(email);
      dispatch(setAuthStatus("succeeded"));
    } catch (err: any) {
      dispatch(setAuthStatus("failed"));
      notification.error({
        message: t("otp.resendFailed"),
        description: getErrorMessage(err, t),
        placement: "topLeft",
      });
    }
  };

export const registerOtpThunk =
  (t: (key: string) => string,email: string, onSubmit: () => void): AppThunk =>
  async (dispatch) => {
    dispatch(setAuthStatus("loading"));
    try {
      const { sendOtp } = useAuthService(t);
      await sendOtp(email);
      onSubmit();
    } catch (err: any) {
      notification.error({
        message: t("register.failedTitle"),
        description: err?.response?.data?.message ?? t("register.failed"),
        placement: "topLeft",
      });
      dispatch(setAuthStatus("failed"));
    }
  };

  export const verifyOtpThunk =
  (
    data: VerifyOtpRequestDTO,
    t: (key: string) => string,
    flowType: "register" | "forgot-password",
    onSuccess: (access_token?: string, user?: any) => void
  ): AppThunk =>
  async (dispatch) => {
    dispatch(setAuthStatus("loading"));
    try {
      const { verifyOtp,registerUser } = useAuthService(t);
      const { success } = await verifyOtp(data);
      if (!success) throw new Error("OTP failed");

      if (flowType === "register") {
        const { access_token, user } = await registerUser(data.user);
        dispatch(registerSuccess({ user, token: access_token }));
        notification.success({
          message: t("otp.successTitle"),
          description: t("otp.successRegister"),
        });
        onSuccess(access_token, user);
      } else {
        notification.success({
          message: t("otp.successTitle"),
          description: t("otp.successForgotPassword"),
        });
        onSuccess(); // navigate tới reset-password
      }
    } catch (err: any) {
      dispatch(setAuthStatus("failed"));
      notification.error({
        message: t("otp.failedTitle"),
        description: getErrorMessage(err, t),
      });
    }
  };
export const resetPasswordThunk =
  ( t: (key: string) => string,
    payload: ResetPasswordRequestDTO,
   
    onSuccess: () => void
  ): AppThunk =>
  async (dispatch) => {
    dispatch(setAuthStatus("loading"));
    try {
       const { resetPassword } = useAuthService(t);
      const { success } = await resetPassword(payload);
      if (success) {
        notification.success({
          message: t("reset.successTitle"),
          description: t("reset.successDescription"),
        });
        onSuccess();
      }
    } catch (err: any) {
      dispatch(setAuthStatus("failed"));
      notification.error({
        message: t("reset.failedTitle"),
        description: err?.response?.data?.message ?? t("reset.failedDescription"),
      });
    }
  };