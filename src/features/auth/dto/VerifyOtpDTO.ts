export interface VerifyOtpRequestDTO {
  userName?: string;
  email: string;
  otpCode: string;
  flowType: string;
}

export interface VerifyOtpResponseDTO {
  success: boolean;
  message?: string;
}
