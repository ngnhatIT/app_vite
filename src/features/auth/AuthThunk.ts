// Refactored AuthThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SignInRequestDTO } from "./dto/SignInDTO";
import type { SignUpRequestDTO } from "./dto/SignUpDTO";
import type { VerifyOtpRequestDTO } from "./dto/VerifyOtpDTO";
import type { ResetPasswordRequestDTO } from "./dto/ResetPasswordDTO";
import type { SendOtpRequestDTO } from "./dto/SendOtpDTO";
import { authService } from "./authService";

interface LocalizedPayload<T> {
  payload: T;
  onSuccess?: () => void;
  onFailure?: (message: string) => void;
}

export const loginThunk = createAsyncThunk<
  { token: string; user: { username: string; email: string } },
  LocalizedPayload<SignInRequestDTO>,
  { rejectValue: string }
>("auth/login", async ({ payload }, { rejectWithValue }) => {
  try {
    const token = await authService.loginUser(payload);
    return { token, user: { username: payload.userName, email: "" } };
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const registerThunk = createAsyncThunk<
  void,
  LocalizedPayload<SignUpRequestDTO>,
  { rejectValue: string }
>("auth/register", async ({ payload }, { rejectWithValue }) => {
  try {
    await authService.registerUser(payload);
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const verifyOtpThunk = createAsyncThunk<
  any,
  LocalizedPayload<VerifyOtpRequestDTO>,
  { rejectValue: string }
>("auth/verifyOtp", async ({ payload }, { rejectWithValue }) => {
  try {
    return await authService.verifyOtp(payload);
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const resetPasswordThunk = createAsyncThunk<
  void,
  LocalizedPayload<ResetPasswordRequestDTO>,
  { rejectValue: string }
>("auth/resetPassword", async ({ payload }, { rejectWithValue }) => {
  try {
    await authService.resetPassword(payload);
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const sendOtpThunk = createAsyncThunk<
  void,
  LocalizedPayload<SendOtpRequestDTO>,
  { rejectValue: string }
>("auth/sendOtp", async ({ payload }, { rejectWithValue }) => {
  try {
    await authService.sendOtp(payload);
  } catch (error: any) {
    return rejectWithValue(error);
  }
});


