import axiosInstance, {
  type ApiSuccess,
  setStoredTokens,
  clearStoredTokens,
} from "@/services/axiosInstance";

export type AuthUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  profileImage?: string | null;
  role?: { id: string; code: string } | null;
  createdAt?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthPayload = {
  user: AuthUser;
  tokens: AuthTokens;
  requiresPlan?: boolean;
  isMember?: boolean;
};

export type AuthMeData = {
  user: AuthUser;
  requiresPlan?: boolean;
  isMember?: boolean;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  email: string;
  otp: string;
  password: string;
};

export const authService = {
  async login(input: LoginInput) {
    const { data } = await axiosInstance.post<ApiSuccess<AuthPayload>>(
      "/auth/login",
      input,
    );
    setStoredTokens(data.data.tokens);
    return data.data;
  },

  async register(input: RegisterInput) {
    const { data } = await axiosInstance.post<ApiSuccess<AuthPayload>>(
      "/auth/register",
      input,
    );
    setStoredTokens(data.data.tokens);
    return data.data;
  },

  async logout() {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      clearStoredTokens();
    }
  },

  async me() {
    const { data } = await axiosInstance.get<
      ApiSuccess<AuthMeData | (AuthUser & { requiresPlan?: boolean; isMember?: boolean })>
    >("/auth/me");
    const payload = data.data;
    if (payload && "user" in payload && payload.user) {
      return payload;
    }
    const nested = payload as AuthUser & {
      requiresPlan?: boolean;
      isMember?: boolean;
    };
    return {
      user: nested,
      requiresPlan: nested.requiresPlan,
      isMember: nested.isMember,
    };
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const { data } = await axiosInstance.post<ApiSuccess<null>>(
      "/auth/forgot-password",
      input,
    );
    return data;
  },

  async resetPassword(input: ResetPasswordInput) {
    const { data } = await axiosInstance.post<ApiSuccess<null>>(
      "/auth/reset-password",
      input,
    );
    return data;
  },
};
