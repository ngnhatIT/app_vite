import { handleAxiosError } from "../api/handleAxiosError";

export const getErrorMessage = (
  err: unknown,
  t: (key: string) => string
): string => {
  const error = handleAxiosError(err);
  return error.message;
};
