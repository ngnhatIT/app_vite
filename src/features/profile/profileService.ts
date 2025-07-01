import axiosInstance from "../../api/AxiosIntance";
import { handleApiCall } from "../../api/HandApiCall";
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
