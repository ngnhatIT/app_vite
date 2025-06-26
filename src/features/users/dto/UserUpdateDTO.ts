export interface UserUpdateRequestDTO {
  user_id: string;
  password?: string;
  confirm_password?: string;
  role?: string;
}

export interface UserStatusUpdateDTO {
  user_id: string;
  is_active: boolean;
}
