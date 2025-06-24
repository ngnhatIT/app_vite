export interface SignInRequestDTO {
  userName: string;
  password: string;
}

export interface SignInResponseDTO {
  success: boolean;
  token: string;
  message?: string;
}
