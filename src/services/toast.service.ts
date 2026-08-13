import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  description?: string;
  duration?: number;
};

/**
 * App-wide notification layer (Sonner).
 * Never use window.alert / confirm for user feedback.
 */
export const toastService = {
  success(message: string, options?: ToastOptions) {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration ?? 4000,
    });
  },

  error(message: string, options?: ToastOptions) {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration ?? 5000,
    });
  },

  info(message: string, options?: ToastOptions) {
    return sonnerToast.message(message, {
      description: options?.description,
      duration: options?.duration ?? 4000,
    });
  },

  warning(message: string, options?: ToastOptions) {
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration ?? 4500,
    });
  },

  loading(message: string) {
    return sonnerToast.loading(message);
  },

  dismiss(id?: string | number) {
    sonnerToast.dismiss(id);
  },
};
