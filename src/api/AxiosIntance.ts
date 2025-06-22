// 📁 src/api/axiosInstance.ts
import axios, { type AxiosResponse, AxiosError } from "axios";
import i18n from "../i18n/i18n";
import { logout } from "../features/auth/AuthSlice";
import { store } from "../app/store";
import type { NavigateFunction } from "react-router-dom";

let navigate: NavigateFunction | null = null;

export const setNavigate = (nav: NavigateFunction) => {
  navigate = nav;
};

interface SuccessApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}
interface ErrorApiResponse {
  message: string;
  status: number;
  statusText: string;
  errors?: Array<{ field: string; message: string }>;
}
type ApiResponse<T = any> = SuccessApiResponse<T> | ErrorApiResponse;

const isValidToken = (token: string): boolean => {
  try {
    return token.split(".").length === 3;
  } catch {
    return false;
  }
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token && isValidToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Accept-Language"] = i18n.language || "en";

    // ✅ Lấy thông tin từ preload async
    const device = await (window as any).deviceInfo?.get?.();
    const ip = device?.ip ?? "unknown";
    const mac = device?.mac ?? "unknown";

    config.headers["X-Client-IP"] = ip;
    config.headers["X-Client-MAC"] = mac;

    console.log("Request Config:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });

    return config;
  },
  (error) => Promise.reject(new Error(error?.message ?? "Request error"))
);

// ✅ RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error: AxiosError<ApiResponse>) => {
    const { response, code } = error;
    if (code === "ECONNABORTED") return Promise.reject(error);
    if (!response) return Promise.reject(error);

    if (response.status === 401) {
      store.dispatch(logout());
      sessionStorage.removeItem("access_token");
      if (navigate) navigate("/auth/login");
      else window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
