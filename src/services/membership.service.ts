import axiosInstance, { type ApiSuccess } from "@/services/axiosInstance";
import type { MembershipPlanId } from "@/lib/membershipPlans";

export type MembershipRecord = {
  id: string;
  userId: string;
  planId: MembershipPlanId;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING";
  startsAt: string;
  endsAt?: string | null;
  createdAt: string;
};

export const membershipService = {
  async me() {
    const { data } = await axiosInstance.get<
      ApiSuccess<{ membership: MembershipRecord | null; isMember: boolean }>
    >("/membership/me");
    return data.data;
  },

  async activate(planId: MembershipPlanId) {
    const { data } = await axiosInstance.post<
      ApiSuccess<{ membership: MembershipRecord }>
    >("/membership/activate", { planId });
    return data.data.membership;
  },
};
