import axiosInstance from "../../api/AxiosIntance";
import { handleAxiosError } from "../../api/HandleAxiosError";
import type {
  ResetPasswordRequestDTO,
  ResetPasswordResponseDTO,
} from "./dto/ResetPasswordDTO";
import type { SendOtpRequestDTO, SendOtpResponseDTO } from "./dto/SendOtpDTO";
import type { SignInRequestDTO, SignInResponseDTO } from "./dto/SignInDTO";
import type { SignUpRequestDTO, SignUpResponseDTO } from "./dto/SignUpDTO";
import type {
  VerifyOtpRequestDTO,
  VerifyOtpResponseDTO,
} from "./dto/VerifyOtpDTO";

export const authService = {
  loginUser: async (
    payload: SignInRequestDTO,
    t: (key: string) => string
  ): Promise<SignInResponseDTO> => {
    try {
      const res = await axiosInstance.post<SignInResponseDTO>(
        "/auth/sign-in",
        payload
      );
      const { success, token } = res.data;
      if (success && token) {
        sessionStorage.setItem("access_token", token);
      }
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, t, t("login.failed"));
    }
  },

  registerUser: async (
    data: SignUpRequestDTO,
    t: (key: string) => string
  ): Promise<SignUpResponseDTO> => {
    try {
      const res = await axiosInstance.post<SignUpResponseDTO>(
        "/auth/sign-up",
        data
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, t, t("register.failed"));
    }
  },

  sendOtp: async (
    data: SendOtpRequestDTO,
    t: (key: string) => string
  ): Promise<SendOtpResponseDTO> => {
    try {
      const res = await axiosInstance.post("/auth/signup", { data });
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, t, t("otp.failed"));
    }
  },

  verifyOtp: async (
    data: VerifyOtpRequestDTO,
    t: (key: string) => string
  ): Promise<VerifyOtpResponseDTO> => {
    try {
      const res = await axiosInstance.post<{ success: boolean }>(
        "/auth/verify-otp",
        data
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, t, t("otp.failed"));
    }
  },

  resetPassword: async (
    payload: ResetPasswordRequestDTO,
    t: (key: string) => string
  ): Promise<ResetPasswordResponseDTO> => {
    try {
      const res = await axiosInstance.post("/auth/reset-password", payload);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, t, t("otp.failed"));
    }
  },
};
