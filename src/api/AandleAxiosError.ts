import { AxiosError } from "axios";

// Interface cho server response data
interface ServerErrorResponse {
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

interface ErrorDetails {
  code: string;
  message: string;
  status?: number;
  raw?: any;
}

/**
 * Chuẩn hoá AxiosError thành object rõ ràng
 * @param err Lỗi cần xử lý
 * @param translate Hàm dịch văn bản
 * @param fallbackMessage Thông báo lỗi mặc định
 */
export const handleAxiosError = (
  err: unknown,
  translate: (key: string) => string,
  fallbackMessage: string
): ErrorDetails => {
  const defaultMessage = fallbackMessage;
  let code = "UNKNOWN";
  let status: number | undefined;
  let message = defaultMessage;

  // Xử lý lỗi không phải AxiosError
  if (!(err instanceof AxiosError)) {
    return {
      code: "RUNTIME_ERROR",
      message: err instanceof Error ? err.message : defaultMessage,
    };
  }

  const axiosErr = err as AxiosError<ServerErrorResponse>;
  const res = axiosErr.response;

  // Xử lý lỗi timeout
  if (axiosErr.code === "ECONNABORTED") {
    return {
      code: "TIMEOUT",
      message: translate("error.timeout"),
    };
  }

  // Xử lý lỗi mạng
  if (!res) {
    return {
      code: "NETWORK",
      message: translate("error.network"),
    };
  }

  status = res.status;

  // Ưu tiên dùng message từ server
  let serverMessage =
    typeof res.data === "string"
      ? res.data
      : res.data?.message ?? null;

  // Xử lý lỗi validation (422)
  if (res.status === 422 && res.data?.errors) {
    serverMessage = res.data.errors
      .map((e) => `${e.field}: ${e.message}`)
      .join("; ");
  }

  message = serverMessage ?? res.statusText ?? defaultMessage;

  // Gán code theo status
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

  return {
    code,
    message,
    status,
    raw: res.data,
  };
};