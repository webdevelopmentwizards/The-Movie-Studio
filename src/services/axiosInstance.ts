import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import {
  MEMBERSHIP_REQUIRED_EVENT,
  MEMBERSHIP_REQUIRED_MESSAGE,
  MEMBERSHIP_REQUIRED_STATUS,
} from "@/lib/auth/constants";
import {
  clearStoredTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
} from "@/lib/auth/tokenStorage";

function resolveApiBaseUrl() {
  const api =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api/v1";

  if (typeof window === "undefined") return api;

  try {
    const parsed = new URL(api, window.location.origin);
    if (window.location.protocol === "https:" && parsed.protocol === "http:") {
      return "/__api";
    }
  } catch {
    return api;
  }

  return api;
}

const API_BASE_URL = resolveApiBaseUrl();

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
    if (typeof window !== "undefined") {
      const status = error.response?.status;
      const body = error.response?.data;
      const url = error.config?.url || "";

      if (status === 401) {
        const isAuthEndpoint =
          url.includes("/auth/login") ||
          url.includes("/auth/signup") ||
          url.includes("/auth/register");

        if (!isAuthEndpoint) {
          clearStoredTokens();
          window.dispatchEvent(new Event("tms-auth-unauthorized"));
        }
      }

      if (
        status === 403 &&
        (body?.message === MEMBERSHIP_REQUIRED_MESSAGE ||
          body?.statusCode === MEMBERSHIP_REQUIRED_STATUS)
      ) {
        window.dispatchEvent(new Event(MEMBERSHIP_REQUIRED_EVENT));
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
export { API_BASE_URL };
