// ✅ File: features/users/userService.ts - gọi API thật
import axios from "axios";
import type { User } from "./userSlice";

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get("/api/users");
  return response.data;
};

export const deleteUserById = async (id: number): Promise<void> => {
  await axios.delete(`/api/users/${id}`);
};
