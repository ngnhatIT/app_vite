import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../utils/errorUtil";
import { authService } from "./AuthService";
import type { SignInRequestDTO } from "./dto/SignInDTO";
import type { SignUpRequestDTO } from "./dto/SignUpDTO";
import type { VerifyOtpRequestDTO } from "./dto/VerifyOtpDTO";
import type { ResetPasswordRequestDTO } from "./dto/ResetPasswordDTO";
import type { SendOtpRequestDTO } from "./dto/SendOtpDTO";
import { showDialog } from "../../components/DialogService";


interface WithT<T> {
  payload: T;
  t: (key: string) => string;
  onSuccess?: () => void;
  onFailure?: (message: string) => void;
}

// ========== LOGIN ==========
export const loginThunk = createAsyncThunk<
  { token: string; user: { username: string; email: string } },
  WithT<SignInRequestDTO>,
  { rejectValue: string }
>("auth/login", async ({ payload, t }, { rejectWithValue }) => {
  try {
    const  token = await authService.loginUser(payload, t);
    return { token, user: { username: payload.userName, email: "" } };
  } catch (error: any) {
   
    const errMsg =
      error?.message && typeof error.message === "string"
        ? error.message
        : getErrorMessage(error, t);

    showDialog({
        title: t("common.error"),
        content: errMsg,
      });
    return rejectWithValue(errMsg);
  }
});


// ========== REGISTER ==========
export const registerThunk = createAsyncThunk<
  { user: { username: string; email: string }; token: string },
  WithT<SignUpRequestDTO>,
  { rejectValue: string }
>("auth/register", async ({ payload, t }, { rejectWithValue }) => {
  try {
    await authService.registerUser(payload, t);
    const user = { username: payload.userName, email: payload.email };
    return { user, token: "dummy-token" };
  } catch (error: any) {
    return rejectWithValue(getErrorMessage(error, t));
  }
});

// ========== VERIFY OTP ==========
export const verifyOtpThunk = createAsyncThunk<
  any,
  WithT<VerifyOtpRequestDTO>,
  { rejectValue: string }
>("auth/verifyOtp", async ({ payload, t }, { rejectWithValue }) => {
  try {
    return await authService.verifyOtp(payload, t);
  } catch (error: any) {
    return rejectWithValue(getErrorMessage(error, t));
  }
});

// ========== RESET PASSWORD ==========
export const resetPasswordThunk = createAsyncThunk<
  void,
  WithT<ResetPasswordRequestDTO>,
  { rejectValue: string }
>("auth/resetPassword", async ({ payload, t }, { rejectWithValue }) => {
  try {
    const result = await authService.resetPassword(payload, t);
    if (!result.success) throw new Error("Reset password failed");
  } catch (error: any) {
    return rejectWithValue(getErrorMessage(error, t));
  }
});

// ========== SEND OTP ==========
export const sendOtpThunk = createAsyncThunk<
  void,
  WithT<SendOtpRequestDTO>,
  { rejectValue: string }
>("auth/sendOtp", async ({ payload, t }, { rejectWithValue }) => {
  try {
    await authService.sendOtp(payload, t);
  } catch (error: any) {
    console.log(getErrorMessage(error, t));
    return rejectWithValue(getErrorMessage(error, t));
  }
});
