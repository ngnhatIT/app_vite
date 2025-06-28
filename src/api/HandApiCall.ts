import { handleAxiosError } from "./HandleAxiosError";

export const handleApiCall = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  try {
    return await apiCall();
  } catch (err) {
    throw handleAxiosError(err);
  }
};