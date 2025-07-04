export interface SendOtpRequestDTO {
  userName?: string;
  email: string;
  flowType: string;
}

export interface SendOtpResponseDTO {
  code: number;
  msg: string;
  data: {
    message: string;
    otplimit: number;
  };
}