export type AcceptJsCardData = {
  cardNumber: string;
  month: string;
  year: string;
  cardCode: string;
  zip?: string;
  fullName?: string;
};

export type AcceptJsAuthData = {
  clientKey: string;
  apiLoginID: string;
};

export type AcceptJsResponse = {
  messages: {
    resultCode: "Ok" | "Error";
    message: { code: string; text: string }[];
  };
  opaqueData?: {
    dataDescriptor: string;
    dataValue: string;
  };
};

declare global {
  interface Window {
    Accept?: {
      dispatchData: (
        secureData: {
          authData: AcceptJsAuthData;
          cardData: AcceptJsCardData;
        },
        callback: (response: AcceptJsResponse) => void,
      ) => void;
    };
  }
}

export {};
