// 📁 src/api/axiosInstance.ts
import axios, { type AxiosResponse, AxiosError } from "axios";
import { logout } from "../features/auth/authSlice";
import { store } from "../app/store";
import type { NavigateFunction } from "react-router-dom";
import i18n from "../i18n/i18n";

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
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token && isValidToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Accept-Language"] =
      i18n.language ?? localStorage.getItem("language") ?? "ja";

    try {
      const device = await (window as any)?.deviceInfo?.get?.();
      config.headers["X-Client-IP"] = (device?.ip?.toUpperCase()) ?? "unknown";
      config.headers["X-Client-MAC"] =(device?.mac?.toUpperCase()) ?? "unknown";
    } catch {
      config.headers["X-Client-IP"] = "unknown";
      config.headers["X-Client-MAC"] = "unknown";
    }
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
      sessionStorage.removeItem("accessToken");
      if (navigate) navigate("/auth/login");
      else window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
