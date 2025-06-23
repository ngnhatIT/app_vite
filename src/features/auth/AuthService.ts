import { handleAxiosError } from "../../api/AandleAxiosError";
import axiosInstance from "../../api/AxiosIntance";
import type { ResendOtpRequestDTO } from "./dto/ResendOtpRequestDTO";
import type { ResetPasswordRequestDTO } from "./dto/ResetPasswordRequestDTO";
import type { SendOtpRequestDTO } from "./dto/SendOtpRequestDTO";
import type { SignInRequestDTO } from "./dto/SignInRequestDTO";
import type { SignUpRequestDTO } from "./dto/SignUpRequestDTO";
import type { VerifyOtpRequestDTO } from "./dto/VerifyOtpRequestDTO";


export const useAuthService = (translate: (key: string) => string) => {
  const loginUser = async (
    payload: SignInRequestDTO
  ) =>  {
    try {
      const res = await axiosInstance.post<{ token: string }>(
        "/auth/signin",
        payload
      );
      sessionStorage.setItem("access_token", res.data.token);
      return res.data.token;
    } catch (err) {
      throw handleAxiosError(err, translate, translate("login.failed"));
    }
  };

  const registerUser = async (
    data: SignUpRequestDTO
  ) => {
    try {
      const res = await axiosInstance.post<SignUpRequestDTO>(
        "/auth/regist",
        data
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, translate, translate("register.failed"));
    }
  };

  const sendOtp = async (data : SendOtpRequestDTO) => {
    try {
      const res = await axiosInstance.post("/auth/signup", { data });
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, translate, translate("otp.failed"));
    }
  };

  const resendOtp = async (data:ResendOtpRequestDTO) => {
    try {
      await axiosInstance.post("/auth/sendotpcode", { data });
    } catch (err) {
      throw handleAxiosError(err, translate, translate("otp.failed"));
    }
  };

  const verifyOtp = async (
    data: VerifyOtpRequestDTO
  ): Promise<{ success: boolean }> => {
    try {
      const res = await axiosInstance.post<{ success: boolean }>(
        "/auth/verify-otp",
        data
      );
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, translate, translate("otp.failed"));
    }
  };

  const resetPassword = async (
    payload: ResetPasswordRequestDTO
  ): Promise<{ success: boolean }> => {
    try {
      const res = await axiosInstance.post("/auth/reset-password", payload);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err, translate, translate("otp.failed"));
    }
  };

  return { loginUser, registerUser, verifyOtp, sendOtp, resetPassword, resendOtp };
};
