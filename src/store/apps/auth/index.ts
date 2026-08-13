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
  type MembershipRecord,
} from "@/services/membership.service";
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
  accessToken: string | null;
  status: "idle" | "loading" | "authenticated" | "anonymous";
  error: string | null;
  initialized: boolean;
};

const initialState: AuthState = {
  user: null,
  membership: null,
  isMember: false,
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

export const bootstrapAuth = createAsyncThunk(
  "auth/bootstrap",
  async (_, { rejectWithValue }) => {
    const token = getStoredAccessToken();
    if (!token) {
      return {
        user: null,
        membership: null,
        isMember: false,
        accessToken: null,
      };
    }

    setStoredTokens({
      accessToken: token,
      refreshToken: getStoredRefreshToken() || undefined,
    });

    try {
      const user = await authService.me();
      let membership: MembershipRecord | null = null;
      let isMember = false;
      try {
        const membershipData = await membershipService.me();
        membership = membershipData.membership;
        isMember = membershipData.isMember;
      } catch {
        // membership endpoint may fail for non-members; ignore
      }
      return { user, membership, isMember, accessToken: token };
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
      const { user, tokens } = await authService.login(input);
      let membership: MembershipRecord | null = null;
      let isMember = false;
      try {
        const membershipData = await membershipService.me();
        membership = membershipData.membership;
        isMember = membershipData.isMember;
      } catch {
        // ignore
      }
      return {
        user,
        membership,
        isMember,
        accessToken: tokens.accessToken,
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
      const { user, tokens } = await authService.register(input);
      return {
        user,
        membership: null as MembershipRecord | null,
        isMember: false,
        accessToken: tokens.accessToken,
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

export const activateMembership = createAsyncThunk(
  "auth/activateMembership",
  async (planId: "monthly" | "yearly", { rejectWithValue }) => {
    try {
      const membership = await membershipService.activate(planId);
      return membership;
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "Unable to activate membership."),
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
        state.accessToken = action.payload.accessToken;
        state.status = action.payload.user ? "authenticated" : "anonymous";
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.initialized = true;
        state.user = null;
        state.membership = null;
        state.isMember = false;
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
        state.accessToken = null;
        state.status = "anonymous";
        state.error = null;
      })
      .addCase(
        activateMembership.fulfilled,
        (state, action: PayloadAction<MembershipRecord>) => {
          state.membership = action.payload;
          state.isMember = action.payload.status === "ACTIVE";
        },
      )
      .addCase(activateMembership.rejected, (state, action) => {
        state.error =
          (action.payload as string) || "Membership activation failed.";
      });
  },
});

export const { clearAuthError, resetAuth, handleStatus } = slice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectDisplayName = (state: { auth: AuthState }) =>
  state.auth.user ? displayName(state.auth.user) : "";

export default slice.reducer;
