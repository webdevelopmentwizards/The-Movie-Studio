export type AcceptJsConfig = {
  clientKey: string;
  apiLoginId: string;
};

export type TokenizeCardFields = {
  cardNumber: string;
  month: string; // MM
  year: string; // YYYY
  cardCode: string;
  zip?: string;
};

export type OpaqueData = {
  dataDescriptor: string;
  dataValue: string;
};

export function loadAcceptJs(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Accept.js can only run in the browser."));
      return;
    }

    if (window.Accept) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
    if (existing) {
      if (window.Accept) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Accept.js")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.charset = "utf-8";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Accept.js"));
    document.head.appendChild(script);
  });
}

export function tokenizeCard(
  config: AcceptJsConfig,
  fields: TokenizeCardFields,
): Promise<OpaqueData> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.Accept) {
      reject(new Error("Payment form is not ready. Please refresh and try again."));
      return;
    }

    if (!config.clientKey || !config.apiLoginId) {
      reject(new Error("Payment is not configured. Missing Accept.js keys."));
      return;
    }

    const authData = {
      clientKey: String(config.clientKey),
      apiLoginID: String(config.apiLoginId),
    };

    // Accept.js reads `.length` on every cardData key. Never pass undefined.
    const cardData: {
      cardNumber: string;
      month: string;
      year: string;
      cardCode: string;
      zip?: string;
    } = {
      cardNumber: String(fields.cardNumber || "").replace(/\s+/g, ""),
      month: String(fields.month || "").padStart(2, "0"),
      year: String(fields.year || ""),
      cardCode: String(fields.cardCode || ""),
    };

    const zip = fields.zip?.trim();
    if (zip) {
      cardData.zip = zip;
    }

    try {
      window.Accept.dispatchData({ authData, cardData }, (response) => {
        const messages = response?.messages;
        if (messages?.resultCode === "Error") {
          const first = messages.message?.[0];
          const code = first?.code;
          const text = first?.text || "Card could not be processed.";
          if (code === "E_WC_02" || /https/i.test(text)) {
            reject(
              new Error(
                "Authorize.net requires HTTPS. Open https://localhost:3000 and try again.",
              ),
            );
            return;
          }
          reject(new Error(text));
          return;
        }

        const dataDescriptor = response?.opaqueData?.dataDescriptor;
        const dataValue = response?.opaqueData?.dataValue;
        if (!dataDescriptor || !dataValue) {
          reject(new Error("Card could not be processed."));
          return;
        }

        resolve({ dataDescriptor, dataValue });
      });
    } catch (error) {
      reject(
        error instanceof Error
          ? error
          : new Error("Card could not be processed."),
      );
    }
  });
}
