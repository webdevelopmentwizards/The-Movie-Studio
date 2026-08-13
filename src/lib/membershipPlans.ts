export type MembershipPlanId = "monthly" | "yearly";

export const MEMBERSHIP_BASE_BENEFITS = [
  "Behind-the-scenes footage",
  "Live on-location access",
  "First look at upcoming movie projects",
  "Watch new releases with no ads",
  "Access to VIP movie parties, step-and-repeat events, and more",
  "Access to Movie Studio merchandise/gear",
] as const;

export const MEMBERSHIP_YEARLY_MERCH = [
  "T-shirts",
  "Hats",
  "Mugs",
  "Computer/laptop cases",
  "Car decals",
  "Posters",
  "Other branded merchandise",
] as const;

export const MEMBERSHIP_PLANS = {
  monthly: {
    id: "monthly" as const,
    name: "Monthly",
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
    name: "Yearly",
    amount: "89.99",
    priceLabel: "$89.99",
    period: "per year",
    intervalLength: 12,
    description:
      "Best value — everything in Monthly, plus exclusive Movie Studio merch.",
    badge: "Best Value",
    benefits: [...MEMBERSHIP_BASE_BENEFITS],
    extraBenefits: [
      "Movie Studio merchandise, including:",
      ...MEMBERSHIP_YEARLY_MERCH.map((item) => item),
    ],
    merchItems: [...MEMBERSHIP_YEARLY_MERCH],
  },
} as const;

export function isMembershipPlanId(
  value: unknown,
): value is MembershipPlanId {
  return value === "monthly" || value === "yearly";
}
