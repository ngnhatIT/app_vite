import { handleAxiosError } from "../api/HandleAxiosError";

export const getErrorMessage = (
  err: unknown,
  t: (key: string) => string
): string => {
  const error = handleAxiosError(err, t);
  return error.message;
};
