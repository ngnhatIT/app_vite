export interface ResetPasswordRequestDTO {
  email: string;
  otpCode: string;
  newpassword: string;
}

export interface ResetPasswordResponseDTO {
  success: boolean;
  message?: string;
}
