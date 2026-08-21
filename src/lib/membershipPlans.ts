export type MembershipPlanId = "monthly" | "yearly";

export const MEMBERSHIP_BASE_BENEFITS = [
  "Behind-the-scenes!",
  "Live on-location access",
  "First look at upcoming movie projects",
  "Watch new releases with no ads",
  "Access to VIP movie parties, step-and-repeat events, and more",
  "Networking Opportunities",
] as const;

export const MEMBERSHIP_PLANS = {
  monthly: {
    id: "monthly" as const,
    name: "Monthly membership",
    amount: "9.99",
    priceLabel: "$9.99",
    period: "per month",
    intervalLength: 1,
    description:
      "Full velvet-rope access renewed monthly. Cancel anytime.",
    benefits: [...MEMBERSHIP_BASE_BENEFITS],
  },
  yearly: {
    id: "yearly" as const,
    name: "Premium membership",
    amount: "89.99",
    priceLabel: "$89.99",
    period: "per year",
    intervalLength: 12,
    description:
      "Best value — everything in Monthly, plus exclusive Movie Studio merch.",
    badge: "Best Value",
    benefits: [
      ...MEMBERSHIP_BASE_BENEFITS,
      "Premium access to new releases",
      "Includes t-shirts, hats, posters and more.",
      "Join the team and get free themoviestudio t-shirt and hat",
      "Custom access to the Movie Studio private channel",
      "Email access to the producers and directors",
    ],
  },
} as const;

export function isMembershipPlanId(
  value: unknown,
): value is MembershipPlanId {
  return value === "monthly" || value === "yearly";
}
