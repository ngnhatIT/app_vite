export interface UserCreateRequestDTO {
  username: string;
  mail: string;
  password: string;
  confirm_password: string;
  role: string;
  workspace: string;
}

export interface UserCreateResponseDTO {
  code: number;
  msg: string;
  data: {
    message: string;
  };
}
