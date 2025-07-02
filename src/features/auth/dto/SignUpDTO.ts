export interface SignUpRequestDTO {
  userName: string;
  email: string;
  password: string;
  fullName:string;
}

export interface SignUpResponseDTO {
  success: boolean;
  message?: string;
}
