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
  ): Promise<string> => {
    try {
      const res = await axiosInstance.post<SignInResponseDTO>(
        "/auth/signin",
        payload
      );
      const { token } = res.data.data;
      return token;
    } catch (err) {
      throw handleAxiosError(err, t);
    }
  },

  registerUser: async (
    data: SignUpRequestDTO,
    t: (key: string) => string
  ): Promise<SignUpResponseDTO> => {
    try {
      const res = await axiosInstance.post<SignUpResponseDTO>(
        "/auth/signup",
        data
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, t);
    }
  },

  sendOtp: async (
    data: SendOtpRequestDTO,
    t: (key: string) => string
  ): Promise<SendOtpResponseDTO> => {
    try {
      const res = await axiosInstance.post("/auth/send-otp", data);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, t);
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
      throw handleAxiosError(err, t);
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
      throw handleAxiosError(err, t);
    }
  },
};
