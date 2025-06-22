export interface ResetPasswordRequestDTO {
  otp: string;
  newPassword: string;
  email:string;
}