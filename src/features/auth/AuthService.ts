import axiosInstance from "../../api/AxiosIntance";
import { handleApiCall } from "../../api/HandApiCall";
import { ENDPOINT } from "../../utils/constantEndPoint";
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
  loginUser: (payload: SignInRequestDTO) =>
    handleApiCall(async () => {
      const res = await axiosInstance.post<SignInResponseDTO>(
        ENDPOINT.LOGIN,
        payload
      );
      return res.data.data.token;
    }),

  registerUser: (data: SignUpRequestDTO) =>
    handleApiCall(async () => {
      const res = await axiosInstance.post<SignUpResponseDTO>(
        ENDPOINT.REGISTER,
        data
      );
      return res.data;
    }),

  sendOtp: (data: SendOtpRequestDTO) =>
    handleApiCall(async () => {
      const res = await axiosInstance.post<SendOtpResponseDTO>(
        ENDPOINT.SEND_OTP,
        data
      );
      return res.data;
    }),

  verifyOtp: (data: VerifyOtpRequestDTO) =>
    handleApiCall(async () => {
      const res = await axiosInstance.post<VerifyOtpResponseDTO>(
        ENDPOINT.VERIFY_OTP,
        data
      );
      return res.data;
    }),

  resetPassword: (payload: ResetPasswordRequestDTO) =>
    handleApiCall(async () => {
      const res = await axiosInstance.post<ResetPasswordResponseDTO>(
        ENDPOINT.RESET_PASSWORD,
        payload
      );
      return res.data;
    }),
};
