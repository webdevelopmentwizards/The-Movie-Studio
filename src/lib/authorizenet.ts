import { AUDITION_PLANS, type AuditionPlanId } from "@/lib/auditionPlans";

export type OpaquePaymentData = {
  dataDescriptor: string;
  dataValue: string;
};

export type ChargeAuditionResult = {
  transactionId: string;
  subscriptionId: string;
  authCode: string;
};

type AuthNetMessage = {
  code?: string;
  text?: string;
};

type AuthNetMessages = {
  resultCode?: string;
  message?: AuthNetMessage[];
};

function apiEndpoint(): string {
  const env = (
    process.env.AUTHORIZENET_ENV ||
    process.env.NEXT_PUBLIC_AUTHORIZENET_ENV ||
    "sandbox"
  )
    .trim()
    .toLowerCase();
  return env === "production"
    ? "https://api.authorize.net/xml/v1/request.api"
    : "https://apitest.authorize.net/xml/v1/request.api";
}

function merchantAuthentication() {
  const name = process.env.AUTHORIZENET_API_LOGIN_ID?.trim();
  const transactionKey = process.env.AUTHORIZENET_TRANSACTION_KEY?.trim();
  if (!name || !transactionKey) {
    throw new Error(
      "Authorize.net is not configured. Add AUTHORIZENET_API_LOGIN_ID and AUTHORIZENET_TRANSACTION_KEY.",
    );
  }
  return { name, transactionKey };
}

export function isAuthorizeNetConfigured(): boolean {
  return Boolean(
    process.env.AUTHORIZENET_API_LOGIN_ID?.trim() &&
      process.env.AUTHORIZENET_TRANSACTION_KEY?.trim(),
  );
}

async function authNetRequest<T>(body: unknown): Promise<T> {
  const response = await fetch(apiEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const cleaned = text.replace(/^\uFEFF/, "");
  return JSON.parse(cleaned) as T;
}

function firstError(messages?: AuthNetMessages): string {
  const msg = messages?.message?.[0];
  if (msg?.text) return msg.text;
  return "Payment failed.";
}

function assertOk(messages: AuthNetMessages | undefined, fallback: string) {
  if (messages?.resultCode === "Ok") return;
  throw new Error(firstError(messages) || fallback);
}

function formatDateYmd(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Next billing after the initial capture (avoids double-charging day one). */
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
  return formatDateYmd(next);
}

type ChargeParams = {
  planId: AuditionPlanId;
  opaqueData: OpaquePaymentData;
  firstName: string;
  lastName: string;
  email: string;
  zip?: string;
};

async function createImmediateCharge(params: ChargeParams): Promise<{
  transactionId: string;
  authCode: string;
}> {
  const plan = AUDITION_PLANS[params.planId];
  const invoiceNumber = `AUD${Date.now()}`.slice(0, 20);

  const data = await authNetRequest<{
    messages?: AuthNetMessages;
    transactionResponse?: {
      responseCode?: string | number;
      authCode?: string;
      transId?: string | number;
      errors?: { errorCode?: string; errorText?: string }[];
      messages?: { code?: string; description?: string }[];
    };
  }>({
    createTransactionRequest: {
      merchantAuthentication: merchantAuthentication(),
      refId: invoiceNumber,
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount: plan.amount,
        payment: {
          opaqueData: {
            dataDescriptor: params.opaqueData.dataDescriptor,
            dataValue: params.opaqueData.dataValue,
          },
        },
        order: {
          invoiceNumber,
          description: `Audition ${plan.name} (initial)`,
        },
        customer: {
          email: params.email,
        },
        billTo: {
          firstName: params.firstName,
          lastName: params.lastName,
          zip: params.zip || undefined,
        },
      },
    },
  });

  assertOk(data.messages, "Transaction request failed.");

  const tx = data.transactionResponse;
  const responseCode = String(tx?.responseCode ?? "").trim();
  const transId = String(tx?.transId ?? "").trim();

  if (!tx || responseCode !== "1" || !transId || transId === "0") {
    const decline =
      tx?.errors?.[0]?.errorText ||
      (responseCode !== "1"
        ? tx?.messages?.[0]?.description
        : undefined) ||
      (transId === "0"
        ? "Authorize.net is in Test Mode (transaction ID 0). Turn OFF Test Mode to create recurring subscriptions."
        : "Card was declined.");
    throw new Error(decline);
  }

  return {
    transactionId: transId,
    authCode: String(tx.authCode || ""),
  };
}

async function createCustomerProfileFromTransaction(
  transactionId: string,
  email: string,
): Promise<{ customerProfileId: string; paymentProfileId: string }> {
  const data = await authNetRequest<{
    messages?: AuthNetMessages;
    customerProfileId?: string | number;
    customerPaymentProfileIdList?: Array<string | number>;
  }>({
    createCustomerProfileFromTransactionRequest: {
      merchantAuthentication: merchantAuthentication(),
      transId: transactionId,
      customer: {
        email,
      },
    },
  });

  assertOk(data.messages, "Unable to save card for recurring billing.");

  const customerProfileId = String(data.customerProfileId ?? "").trim();
  const paymentProfileId = String(
    data.customerPaymentProfileIdList?.[0] ?? "",
  ).trim();

  if (!customerProfileId || !paymentProfileId) {
    throw new Error("Customer profile was not created for recurring billing.");
  }

  return { customerProfileId, paymentProfileId };
}

async function createArbSubscription(params: {
  planId: AuditionPlanId;
  customerProfileId: string;
  paymentProfileId: string;
}): Promise<string> {
  const plan = AUDITION_PLANS[params.planId];

  // Profile-based ARB: do not send order / billTo / customer (schema rejects them).
  const data = await authNetRequest<{
    messages?: AuthNetMessages;
    subscriptionId?: string | number;
  }>({
    ARBCreateSubscriptionRequest: {
      merchantAuthentication: merchantAuthentication(),
      subscription: {
        name: `Audition ${plan.name}`.slice(0, 50),
        paymentSchedule: {
          interval: {
            length: plan.intervalLength,
            unit: "months",
          },
          startDate: nextBillingStartDate(params.planId),
          totalOccurrences: 9999,
        },
        amount: plan.amount,
        profile: {
          customerProfileId: params.customerProfileId,
          customerPaymentProfileId: params.paymentProfileId,
        },
      },
    },
  });

  assertOk(data.messages, "Unable to create recurring subscription.");

  const subscriptionId = String(data.subscriptionId ?? "").trim();
  if (!subscriptionId) {
    throw new Error("Subscription ID missing from Authorize.net response.");
  }

  return subscriptionId;
}

/**
 * Immediate charge + ARB recurring subscription (next cycle onwards).
 */
export async function chargeAuditionPayment(
  params: ChargeParams,
): Promise<ChargeAuditionResult> {
  const charge = await createImmediateCharge(params);

  let subscriptionId = "";
  try {
    const profile = await createCustomerProfileFromTransaction(
      charge.transactionId,
      params.email,
    );
    subscriptionId = await createArbSubscription({
      planId: params.planId,
      customerProfileId: profile.customerProfileId,
      paymentProfileId: profile.paymentProfileId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(
      "[authorizenet] charge ok but recurring setup failed:",
      message,
      "transactionId=",
      charge.transactionId,
    );
  }

  return {
    transactionId: charge.transactionId,
    subscriptionId,
    authCode: charge.authCode,
  };
}

export const chargeAuditionSubscription = chargeAuditionPayment;
