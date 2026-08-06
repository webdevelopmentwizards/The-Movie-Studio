export type AuditionPlanId = "monthly" | "yearly";

export const AUDITION_PLANS = {
  monthly: {
    id: "monthly" as const,
    name: "Monthly",
    amount: "9.99",
    priceLabel: "$9.99",
    period: "per month",
    description:
      "Perfect for trying out auditions and submitting your first scenes.",
  },
  yearly: {
    id: "yearly" as const,
    name: "Yearly",
    amount: "89.99",
    priceLabel: "$89.99",
    period: "per year",
    description: "Best value — stay in the spotlight all year long.",
    badge: "Best Value",
  },
} as const;
