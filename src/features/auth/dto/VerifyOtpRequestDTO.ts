export interface UserRegisterDTO {
  email: string;
  userName: string;
  password: string;
  otpCode:string;
}

export interface VerifyOtpRequestDTO {
  otp: string;
  user: UserRegisterDTO;
}