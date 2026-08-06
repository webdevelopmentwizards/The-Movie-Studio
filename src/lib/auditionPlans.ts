export type AuditionPlanId = "monthly" | "yearly";

export const AUDITION_PLANS = {
  monthly: {
    id: "monthly" as const,
    name: "Monthly",
    amount: "9.99",
    priceLabel: "$9.99",
    period: "per month",
    /** ARB interval length in months */
    intervalLength: 1,
    description:
      "Perfect for trying out auditions and submitting your first scenes. Renews automatically each month.",
  },
  yearly: {
    id: "yearly" as const,
    name: "Yearly",
    amount: "89.99",
    priceLabel: "$89.99",
    period: "per year",
    intervalLength: 12,
    description:
      "Best value — stay in the spotlight all year. Renews automatically each year.",
    badge: "Best Value",
  },
} as const;
