import { AUDITION_PLANS, type AuditionPlanId } from "@/lib/auditionPlans";

export type OpaquePaymentData = {
  dataDescriptor: string;
  dataValue: string;
};

export type ChargeAuditionResult = {
  transactionId: string;
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

type ChargeParams = {
  planId: AuditionPlanId;
  opaqueData: OpaquePaymentData;
  firstName: string;
  lastName: string;
  email: string;
  zip?: string;
};

/** One-time audition plan charge (no recurring / ARB). */
export async function chargeAuditionPayment(
  params: ChargeParams,
): Promise<ChargeAuditionResult> {
  const plan = AUDITION_PLANS[params.planId];
  const invoiceNumber = `AUD${Date.now()}`.slice(0, 20);

  const data = await authNetRequest<{
    messages?: AuthNetMessages;
    transactionResponse?: {
      responseCode?: string;
      authCode?: string;
      transId?: string;
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
          description: `Audition ${plan.name} payment`,
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
  const transId = tx?.transId?.trim() || "";
  if (!tx || tx.responseCode !== "1" || !transId || transId === "0") {
    const decline =
      tx?.errors?.[0]?.errorText ||
      tx?.messages?.[0]?.description ||
      (transId === "0"
        ? "Authorize.net is in Test Mode (transaction ID 0). Turn OFF Test Mode in the merchant settings."
        : "Card was declined.");
    throw new Error(decline);
  }

  return {
    transactionId: transId,
    authCode: tx.authCode || "",
  };
}

/** @deprecated Use chargeAuditionPayment — kept for older imports. */
export const chargeAuditionSubscription = chargeAuditionPayment;
