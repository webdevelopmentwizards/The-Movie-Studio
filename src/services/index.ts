export { toastService } from "@/services/toast.service";
export {
  default as axiosInstance,
  getApiErrorMessage,
} from "@/services/axiosInstance";
export type { ApiSuccess, ApiErrorBody } from "@/services/axiosInstance";

export { authService } from "@/services/auth.service";
export type {
  AuthUser,
  AuthTokens,
  AuthPayload,
  LoginInput,
  RegisterInput,
} from "@/services/auth.service";

export { contactService } from "@/services/contact.service";
export type { ContactInput } from "@/services/contact.service";

export { auditionService } from "@/services/audition.service";
export type { AuditionSubmitResult } from "@/services/audition.service";

export { membershipService } from "@/services/membership.service";
export type { MembershipRecord } from "@/services/membership.service";

export { chatService } from "@/services/chat.service";
export type { ChatMessage } from "@/services/chat.service";
