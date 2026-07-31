export type CollectJsTokenResponse = {
  token: string;
  card?: {
    number?: string;
    bin?: string;
    exp?: string;
    hash?: string;
    type?: string;
  };
  check?: {
    name?: string;
    account?: string;
    hash?: string;
    aba?: string;
  };
};

type CollectJsConfig = {
  paymentType?: "cc" | "ck" | "toc";
  callback?: (response: CollectJsTokenResponse) => void;
  fields?: Record<string, unknown>;
  price?: string;
  currency?: string;
  country?: string;
  primaryColor?: string;
  secondaryColor?: string;
  buttonText?: string;
  instructionText?: string;
  theme?: string;
  paymentSelector?: string;
};

declare global {
  interface Window {
    CollectJS?: {
      configure: (config: CollectJsConfig) => void;
      startPaymentRequest: (event?: Event) => void;
    };
  }
}

export {};
