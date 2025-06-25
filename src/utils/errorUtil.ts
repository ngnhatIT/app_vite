import { handleAxiosError } from "../api/HandleAxiosError";


export const getErrorMessage = (
  err: unknown,
  t: (key: string) => string
): string => {
  const error = handleAxiosError(err, t);
  console.log("🧪 getErrorMessage: error =", error);
  console.log("🧪 getErrorMessage: error.message =", error.message);
  return error.message;
};