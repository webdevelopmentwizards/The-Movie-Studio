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
    const { data } = await axiosInstance.get<ApiSuccess<{ user: AuthUser }>>(
      "/auth/me",
    );
    return data.data.user;
  },
};
