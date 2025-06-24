export interface ResetPasswordRequestDTO {
  email: string;
  otpCode: string;
  newPassword: string;
}

export interface ResetPasswordResponseDTO {
  success: boolean;
  message?: string;
}
