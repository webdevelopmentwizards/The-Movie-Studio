import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import {
  clearStoredTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
} from "@/lib/auth/tokenStorage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";

export {
  clearStoredTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
};

export const TOKEN_STORAGE_KEY = "tms_access_token";
export const REFRESH_TOKEN_STORAGE_KEY = "tms_refresh_token";

export type ApiSuccess<T> = {
  statusCode: string;
  message: string;
  data: T;
};

export type ApiErrorBody = {
  statusCode?: string;
  message?: string;
};

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong.",
) {
  const axiosError = error as AxiosError<ApiErrorBody>;
  return (
    axiosError?.response?.data?.message || axiosError?.message || fallback
  );
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const url = error.config?.url || "";
      const isAuthEndpoint =
        url.includes("/auth/login") ||
        url.includes("/auth/signup") ||
        url.includes("/auth/register");

      if (!isAuthEndpoint) {
        clearStoredTokens();
        window.dispatchEvent(new Event("tms-auth-unauthorized"));
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
export { API_BASE_URL };
