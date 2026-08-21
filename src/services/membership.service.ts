import {
  loadAcceptJs,
  tokenizeCard,
  type OpaqueData,
  type TokenizeCardFields,
} from "@/lib/acceptjs";
import type { MembershipPlanId } from "@/lib/membershipPlans";
import axiosInstance, { type ApiSuccess } from "@/services/axiosInstance";

export type MembershipRecord = {
  id: string;
  userId?: string;
  planId: MembershipPlanId;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING";
  startsAt: string;
  endsAt?: string | null;
  transactionId?: string;
  createdAt?: string;
};

export type MembershipPlanConfig = {
  id: MembershipPlanId;
  label: string;
  amount: number;
};

export type MembershipConfig = {
  env: string;
  apiLoginId: string;
  clientKey: string;
  acceptJsUrl: string;
  plans: {
    monthly: MembershipPlanConfig;
    yearly: MembershipPlanConfig;
  };
};

export type MembershipMeData = {
  membership: MembershipRecord | null;
  isMember: boolean;
  requiresPlan?: boolean;
};

export type MembershipPayment = {
  transactionId: string;
  authCode: string;
  accountNumber: string;
  accountType: string;
  amount: number;
  planId: MembershipPlanId;
  planLabel: string;
};

export type MembershipPayData = {
  membership: MembershipRecord;
  payment: MembershipPayment;
  isMember?: boolean;
  requiresPlan?: boolean;
};

function envFallbackConfig(): MembershipConfig {
  const env = process.env.NEXT_PUBLIC_AUTHORIZENET_ENV || "sandbox";
  return {
    env,
    apiLoginId: process.env.NEXT_PUBLIC_AUTHORIZENET_API_LOGIN_ID || "",
    clientKey: process.env.NEXT_PUBLIC_AUTHORIZENET_CLIENT_KEY || "",
    acceptJsUrl:
      env === "production"
        ? "https://js.authorize.net/v1/Accept.js"
        : "https://jstest.authorize.net/v1/Accept.js",
    plans: {
      monthly: { id: "monthly", label: "Monthly Membership", amount: 9.99 },
      yearly: { id: "yearly", label: "Premium Membership", amount: 89.99 },
    },
  };
}

export const membershipService = {
  async getConfig() {
    const { data } = await axiosInstance.get<ApiSuccess<MembershipConfig>>(
      "/membership/config",
    );
    return data.data;
  },

  async config(): Promise<MembershipConfig> {
    try {
      const config = await this.getConfig();
      const apiLoginId = config?.apiLoginId || (config as { apiLoginID?: string })?.apiLoginID;
      const clientKey = config?.clientKey;
      const acceptJsUrl = config?.acceptJsUrl;
      if (apiLoginId && clientKey && acceptJsUrl) {
        return { ...config, apiLoginId, clientKey, acceptJsUrl };
      }
    } catch {
      // Use public Accept.js env keys if the config endpoint is unavailable.
    }
    return envFallbackConfig();
  },

  async me() {
    const { data } = await axiosInstance.get<ApiSuccess<MembershipMeData>>(
      "/membership/me",
    );
    return data.data;
  },

  async pay(planId: MembershipPlanId, opaqueData: OpaqueData) {
    const { data } = await axiosInstance.post<ApiSuccess<MembershipPayData>>(
      "/membership/pay",
      { planId, opaqueData },
    );
    return data.data;
  },

  async payWithAcceptJs(planId: MembershipPlanId, card: TokenizeCardFields) {
    const cfg = await this.config();
    await loadAcceptJs(cfg.acceptJsUrl);
    const opaqueData = await tokenizeCard(
      { clientKey: cfg.clientKey, apiLoginId: cfg.apiLoginId },
      card,
    );
    return this.pay(planId, opaqueData);
  },
};
