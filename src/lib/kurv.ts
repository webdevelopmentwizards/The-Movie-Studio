export type AuditionPlanId = "monthly" | "yearly";

export const AUDITION_PLANS = {
  monthly: {
    id: "monthly" as const,
    name: "Monthly",
    amount: "8.99",
    priceLabel: "$8.99",
    period: "per month",
    monthFrequency: 1,
    description:
      "Perfect for trying out auditions and submitting your first scenes.",
  },
  yearly: {
    id: "yearly" as const,
    name: "Yearly",
    amount: "9.99",
    priceLabel: "$9.99",
    period: "per year",
    monthFrequency: 12,
    description: "Best value — stay in the spotlight all year long.",
    badge: "Best Value",
  },
} as const;

export type KurvTransactionResponse = {
  response: string;
  responsetext: string;
  authcode: string;
  transactionid: string;
  avsresponse: string;
  cvvresponse: string;
  orderid: string;
  type: string;
  response_code: string;
  subscription_id: string;
};

const KURV_API_URL = "https://kurv.transactiongateway.com/api/transact.php";

function formatYyyymmdd(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/** Next billing date after an immediate first charge (avoids double-billing). */
export function nextBillingStartDate(
  planId: AuditionPlanId,
  from: Date = new Date(),
): string {
  const next = new Date(from);
  if (planId === "monthly") {
    next.setUTCMonth(next.getUTCMonth() + 1);
  } else {
    next.setUTCFullYear(next.getUTCFullYear() + 1);
  }
  return formatYyyymmdd(next);
}

export function parseKurvResponse(body: string): KurvTransactionResponse {
  const params = new URLSearchParams(body);
  return {
    response: params.get("response") ?? "",
    responsetext: params.get("responsetext") ?? "",
    authcode: params.get("authcode") ?? "",
    transactionid: params.get("transactionid") ?? "",
    avsresponse: params.get("avsresponse") ?? "",
    cvvresponse: params.get("cvvresponse") ?? "",
    orderid: params.get("orderid") ?? "",
    type: params.get("type") ?? "",
    response_code: params.get("response_code") ?? "",
    subscription_id: params.get("subscription_id") ?? "",
  };
}

export function isKurvApproved(result: KurvTransactionResponse): boolean {
  return result.response === "1";
}

type ChargeAuditionParams = {
  paymentToken: string;
  planId: AuditionPlanId;
  firstName: string;
  lastName: string;
  email: string;
  zip?: string;
  ipAddress?: string;
};

export async function chargeAuditionSubscription(
  params: ChargeAuditionParams,
): Promise<KurvTransactionResponse> {
  const securityKey = process.env.KURV_SECURITY_KEY;
  if (!securityKey) {
    throw new Error("KURV_SECURITY_KEY is not configured.");
  }

  const plan = AUDITION_PLANS[params.planId];
  const now = new Date();
  const dayOfMonth = Math.min(now.getUTCDate(), 28);
  const orderId = `audition-${params.planId}-${Date.now()}`;

  const body = new URLSearchParams({
    type: "sale",
    security_key: securityKey,
    payment_token: params.paymentToken,
    amount: plan.amount,
    currency: "USD",
    orderid: orderId,
    order_description: `Audition ${plan.name} subscription`,
    billing_method: "initial_recurring",
    recurring: "add_subscription",
    plan_payments: "0",
    plan_amount: plan.amount,
    month_frequency: String(plan.monthFrequency),
    day_of_month: String(dayOfMonth),
    start_date: nextBillingStartDate(params.planId, now),
    first_name: params.firstName,
    last_name: params.lastName,
    email: params.email,
    customer_receipt: "true",
  });

  if (params.zip?.trim()) {
    body.set("zip", params.zip.trim());
  }
  if (params.ipAddress) {
    body.set("ipaddress", params.ipAddress);
  }

  const response = await fetch(KURV_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Kurv gateway error (${response.status}).`);
  }

  return parseKurvResponse(text);
}
