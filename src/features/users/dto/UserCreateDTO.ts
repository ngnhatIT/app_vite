export interface UserCreateRequestDTO {
  username: string;
  mail: string;
  password: string;
  confirm_password: string;
  role: string;
  workspace: string;
  ip_check:boolean;
  fullname:string;
}

export interface UserCreateResponseDTO {
  code: number;
  msg: string;
  data: {
    message: string;
  };
}
