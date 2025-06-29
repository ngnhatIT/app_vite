export interface UserDTO {
  user_id: string;
  username: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  is_active: boolean;
}

export interface UserListResponseDTO {
  code: number;
  msg: string;
  data: UserDTO[];
}
