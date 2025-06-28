export interface SignInRequestDTO {
  userName: string;
  password: string;
}

export interface SignInResponseDTO {
  code: number;
  msg: string;
  data: {
    token: string;
    username: string;
    email?: string;
    role:string;
  };
}