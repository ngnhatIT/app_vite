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

export const handleAxiosError = (
  err: unknown,
  translate: (key: string) => string
): ErrorDetails => {
  let code = "UNKNOWN";
  let status: number | undefined;
  let message = "";

  if (!(err instanceof AxiosError)) {
    return {
      code: "RUNTIME_ERROR",
      message: err instanceof Error ? err.message : translate("error.unknown"),
    };
  }

  const axiosErr = err as AxiosError<ServerErrorResponse>;
  const res = axiosErr.response;

  if (axiosErr.code === "ECONNABORTED") {
    return {
      code: "TIMEOUT",
      message: translate("error.timeout"),
    };
  }

  if (!res) {
    return {
      code: "NETWORK",
      message: translate("error.network"),
    };
  }

  status = res.status;

  let serverMessage: string | undefined;

  if (typeof res.data === "string") {
    serverMessage = res.data;
  } else if (res.status === 422 && res.data?.errors) {
    serverMessage = res.data.errors
      .map((e) => `${e.field}: ${e.message}`)
      .join("; ");
  } else if (res.data?.msg) {
    serverMessage = res.data.msg;
  } else if (res.data?.message) {
    serverMessage = res.data.message;
  } else if (res.data?.error) {
    serverMessage = res.data.error;
  }

  message =
    typeof serverMessage === "string" && serverMessage.trim()
      ? serverMessage.trim()
      : res.statusText?.trim() || translate("error.unknown");

  console.log("🔍 Final message:", message);

  switch (res.status) {
    case 400:
      code = "BAD_REQUEST";
      break;
    case 401:
      code = "UNAUTHORIZED";
      break;
    case 403:
      code = "FORBIDDEN";
      break;
    case 404:
      code = "NOT_FOUND";
      break;
    case 409:
      code = "CONFLICT";
      break;
    case 422:
      code = "VALIDATION_FAILED";
      break;
    case 500:
      code = "SERVER_ERROR";
      break;
    default:
      code = `HTTP_${res.status}`;
  }

  const result = {
    code,
    message,
    status,
    raw: res.data,
  };

  console.log("✅ return from handleAxiosError:", result); // THÊM LOG QUAN TRỌNG

  return result;
};
