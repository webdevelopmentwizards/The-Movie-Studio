import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  authService,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from "@/services/auth.service";
import {
  membershipService,
  type MembershipPayData,
  type MembershipRecord,
} from "@/services/membership.service";
import { resolvePlanGate } from "@/lib/auth/routeAfterAuth";
import type { TokenizeCardFields } from "@/lib/acceptjs";
import type { MembershipPlanId } from "@/lib/membershipPlans";
import {
  clearStoredTokens,
  getApiErrorMessage,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
} from "@/services/axiosInstance";

export type AuthState = {
  user: AuthUser | null;
  membership: MembershipRecord | null;
  isMember: boolean;
  requiresPlan: boolean;
  accessToken: string | null;
  status: "idle" | "loading" | "authenticated" | "anonymous";
  error: string | null;
  initialized: boolean;
};

const initialState: AuthState = {
  user: null,
  membership: null,
  isMember: false,
  requiresPlan: false,
  accessToken: null,
  status: "idle",
  error: null,
  initialized: false,
};

function displayName(user: AuthUser): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  return user.email.split("@")[0] || "Member";
}

async function loadMembershipGate(authFlags?: {
  requiresPlan?: boolean;
  isMember?: boolean;
}) {
  let membership: MembershipRecord | null = null;
  let gate = resolvePlanGate(authFlags || {});

  try {
    const membershipData = await membershipService.me();
    membership = membershipData.membership;
    gate = resolvePlanGate({
      requiresPlan: authFlags?.requiresPlan ?? membershipData.requiresPlan,
      isMember: authFlags?.isMember ?? membershipData.isMember,
    });
  } catch {
    // membership endpoint may fail; keep flags from auth payload
  }

  return { membership, ...gate };
}

export const bootstrapAuth = createAsyncThunk(
  "auth/bootstrap",
  async (_, { rejectWithValue }) => {
    const token = getStoredAccessToken();
    if (!token) {
      return {
        user: null,
        membership: null,
        isMember: false,
        requiresPlan: false,
        accessToken: null,
      };
    }

    setStoredTokens({
      accessToken: token,
      refreshToken: getStoredRefreshToken() || undefined,
    });

    try {
      const me = await authService.me();
      const gate = await loadMembershipGate({
        requiresPlan: me.requiresPlan,
        isMember: me.isMember,
      });
      return {
        user: me.user,
        membership: gate.membership,
        isMember: gate.isMember,
        requiresPlan: gate.requiresPlan,
        accessToken: token,
      };
    } catch (error) {
      clearStoredTokens();
      return rejectWithValue(getApiErrorMessage(error, "Session expired."));
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (input: LoginInput, { rejectWithValue }) => {
    try {
      const payload = await authService.login(input);
      const gate = await loadMembershipGate({
        requiresPlan: payload.requiresPlan,
        isMember: payload.isMember,
      });
      return {
        user: payload.user,
        membership: gate.membership,
        isMember: gate.isMember,
        requiresPlan: gate.requiresPlan,
        accessToken: payload.tokens.accessToken,
      };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Invalid credentials."));
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (input: RegisterInput, { rejectWithValue }) => {
    try {
      const payload = await authService.register(input);
      const gate = resolvePlanGate({
        requiresPlan: payload.requiresPlan,
        isMember: payload.isMember,
      });
      return {
        user: payload.user,
        membership: null as MembershipRecord | null,
        isMember: gate.isMember,
        requiresPlan: gate.requiresPlan,
        accessToken: payload.tokens.accessToken,
      };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Registration failed."));
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await authService.logout();
  } catch {
    clearStoredTokens();
  }
});

export const payMembership = createAsyncThunk(
  "auth/payMembership",
  async (
    input: { planId: MembershipPlanId; card: TokenizeCardFields },
    { rejectWithValue },
  ) => {
    try {
      return await membershipService.payWithAcceptJs(input.planId, input.card);
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "Payment failed"),
      );
    }
  },
);

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleStatus(
      state,
      action: PayloadAction<"idle" | "loading" | "authenticated" | "anonymous">,
    ) {
      state.status = action.payload;
    },
    clearAuthError(state) {
      state.error = null;
    },
    resetAuth(state) {
      Object.assign(state, {
        ...initialState,
        initialized: true,
        status: "anonymous",
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.initialized = true;
        state.user = action.payload.user;
        state.membership = action.payload.membership;
        state.isMember = action.payload.isMember;
        state.requiresPlan = action.payload.requiresPlan;
        state.accessToken = action.payload.accessToken;
        state.status = action.payload.user ? "authenticated" : "anonymous";
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.initialized = true;
        state.user = null;
        state.membership = null;
        state.isMember = false;
        state.requiresPlan = false;
        state.accessToken = null;
        state.status = "anonymous";
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.membership = action.payload.membership;
        state.isMember = action.payload.isMember;
        state.requiresPlan = action.payload.requiresPlan;
        state.accessToken = action.payload.accessToken;
        state.status = "authenticated";
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "anonymous";
        state.error = (action.payload as string) || "Login failed.";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.membership = action.payload.membership;
        state.isMember = action.payload.isMember;
        state.requiresPlan = action.payload.requiresPlan;
        state.accessToken = action.payload.accessToken;
        state.status = "authenticated";
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "anonymous";
        state.error = (action.payload as string) || "Registration failed.";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.membership = null;
        state.isMember = false;
        state.requiresPlan = false;
        state.accessToken = null;
        state.status = "anonymous";
        state.error = null;
      })
      .addCase(
        payMembership.fulfilled,
        (state, action: PayloadAction<MembershipPayData>) => {
          state.membership = action.payload.membership;
          state.isMember = true;
          state.requiresPlan = false;
        },
      )
      .addCase(payMembership.rejected, (state, action) => {
        state.error = (action.payload as string) || "Payment failed.";
      });
  },
});

export const { clearAuthError, resetAuth, handleStatus } = slice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectDisplayName = (state: { auth: AuthState }) =>
  state.auth.user ? displayName(state.auth.user) : "";

export default slice.reducer;
