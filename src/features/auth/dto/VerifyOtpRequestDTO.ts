export interface UserRegisterDTO {
  email: string;
  username: string;
  password: string;
}

export interface VerifyOtpRequestDTO {
  otp: string;
  user: UserRegisterDTO;
}