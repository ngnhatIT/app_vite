import axiosInstance from "../../api/axiosIntance";
import { handleApiCall } from "../../api/handApiCall";

export const workspaceService = {
  fetchWorkSpace: () =>
    handleApiCall(async () => {
      const res = await axiosInstance.get("");
      return res.data;
    }),
};
