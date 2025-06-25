import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { User } from "@/lib/services/user-service";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  initialized: boolean;

  setAuth: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  }) => void;
  setTokens: (
    accessToken: string,
    refreshToken: string,
    sessionId: string
  ) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    profile: null,
    accessToken: null,
    refreshToken: null,
    sessionId: null,
    isAuthenticated: false,
    initialized: false,

    setAuth: (data) =>
      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        sessionId: data.sessionId,
        isAuthenticated: true,
        initialized: true,
      }),

    setTokens: (accessToken, refreshToken, sessionId) =>
      set({
        accessToken,
        refreshToken,
        sessionId,
      }),

    setUser: (user) =>
      set({
        user,
        isAuthenticated: true,
      }),

    clearAuth: () =>
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        sessionId: null,
        isAuthenticated: false,
      }),

    setInitialized: (initialized) => set({ initialized }),
  }))
);
