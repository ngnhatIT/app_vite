// 📁 src/api/handleAxiosError.ts
import { AxiosError } from "axios";

interface ServerErrorResponse {
  msg?: string;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  code?: number;
  statusCode?: number;
  data?: any;
}

interface ErrorDetails {
  code: string;
  message: string;
  status?: number;
  raw?: any;
}

export const handleAxiosError = (err: unknown): ErrorDetails => {
  if (!(err instanceof AxiosError)) {
    return {
      code: "RUNTIME_ERROR",
      message: err instanceof Error ? err.message : "Unknown runtime error",
    };
  }

  const axiosErr = err as AxiosError<ServerErrorResponse>;
  const res = axiosErr.response;

  if (axiosErr.code === "ECONNABORTED") {
    return {
      code: "TIMEOUT",
      message: "Time out",
    };
  }

  if (!res) {
    return {
      code: "NETWORK",
      message: "Network error",
    };
  }

  const status = res.status;
  const data = res.data;

  console.log(data);

  const code = data?.code?.toString() ?? "UNKNOWN";

  const message =
    typeof data === "string"
      ? data
      : data?.errors?.map((e) => `${e.field}: ${e.message}`).join("; ") ??
        data?.msg ??
        data?.message ??
        data?.error ??
        "Unknown server error";

  return {
    code,
    message: message.trim(),
    status,
    raw: data,
  };
};
