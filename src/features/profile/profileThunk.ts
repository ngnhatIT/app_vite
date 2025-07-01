// store/modules/profile/profileThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { profileChangePasswordDTO } from "./dto/profileChangePasswordDTO";
import type { profileResponseDTO } from "./dto/profileDTO";
import  { profileService } from "./profileService";


export const fetchProfileThunk = createAsyncThunk<
  profileResponseDTO,
  void,
  { rejectValue: string }
>("profile/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await profileService.fetchProfile();
    return response;
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to fetch profile");
  }
});

export const changePasswordThunk = createAsyncThunk<
  any, // bạn có thể tạo DTO cho response nếu cần
  profileChangePasswordDTO,
  { rejectValue: string }
>("profile/changePassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await profileService.changePassword(payload);
    return response;
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to change password");
  }
});
