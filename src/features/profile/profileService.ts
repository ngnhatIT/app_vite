import axiosInstance from "../../api/axiosIntance";
import { handleApiCall } from "../../api/handApiCall";
import { ENDPOINT } from "../../utils/constantEndPoint";
import type { profileChangePasswordDTO } from "./dto/profileChangePasswordDTO";
import type { profileResponseDTO } from "./dto/profileDTO";

export const profileService = {
  fetchProfile: async (): Promise<profileResponseDTO> =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.get(ENDPOINT.PROFILE);
      return data;
    }),

  changePassword: async (payload: profileChangePasswordDTO) =>
    handleApiCall(async () => {
      const { data } = await axiosInstance.put(
        ENDPOINT.CHANGE_PASSWORD,
        payload
      );
      return data;
    }),
};
