"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import axiosInstance, {
  API_BASE_URL,
  getApiErrorMessage,
  type ApiSuccess,
  type ApiErrorBody,
} from "@/services/axiosInstance";
import { authService } from "@/services/auth.service";
import { contactService } from "@/services/contact.service";
import { auditionService } from "@/services/audition.service";
import { membershipService } from "@/services/membership.service";
import { chatService } from "@/services/chat.service";
import { toastService } from "@/services/toast.service";

export type ApiContextValue = {
  baseUrl: string;
  client: typeof axiosInstance;
  getErrorMessage: typeof getApiErrorMessage;
  toast: typeof toastService;
  auth: typeof authService;
  contact: typeof contactService;
  audition: typeof auditionService;
  membership: typeof membershipService;
  chat: typeof chatService;
};

const ApiContext = createContext<ApiContextValue | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ApiContextValue>(
    () => ({
      baseUrl: API_BASE_URL,
      client: axiosInstance,
      getErrorMessage: getApiErrorMessage,
      toast: toastService,
      auth: authService,
      contact: contactService,
      audition: auditionService,
      membership: membershipService,
      chat: chatService,
    }),
    [],
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi(): ApiContextValue {
  const ctx = useContext(ApiContext);
  if (!ctx) {
    throw new Error("useApi must be used within ApiProvider");
  }
  return ctx;
}

export type { ApiSuccess, ApiErrorBody };
