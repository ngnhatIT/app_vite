export interface SendOtpRequestDTO {
  userName?: string;
  email: string;
  flowType: string;
}

export interface SendOtpResponseDTO {
  success: boolean;
  message?: string;
}
