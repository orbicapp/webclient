import { useEffect, useState } from "react";

import { logger } from "@/lib/logger";
import { AuthService } from "@/lib/services/auth-service";
import { SessionService } from "@/lib/services/session-service";
import { User, UserService } from "@/lib/services/user-service";
import { LocalStorage } from "@/lib/storage/local-storage";
import { useAuthStore } from "@/stores/auth-store";

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  isAuthenticated: boolean;
  login: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  }) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    setAuth,
    setUser,
    clearAuth,
    setTokens,
    setInitialized,
    refreshToken,
    initialized,
    isAuthenticated,
  } = useAuthStore();

  // Check saved tokens on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (initialized) return;

      setIsLoading(true);
      setError(null);

      const tokens = LocalStorage.getAuthTokens();

      // If there are no tokens, set initialized to true
      if (!tokens.accessToken || !tokens.refreshToken || !tokens.sessionId) {
        setInitialized(true);
        return;
      }

      // Set tokens
      setTokens(tokens.accessToken, tokens.refreshToken, tokens.sessionId);

      // Try to get current user
      const [userData, userError] = await UserService.getMe();

      if (userError || !userData) {
        // If there is an error, log it and clear the session
        setError("Session expired. Please log in again.");
        logger.error(
          "Session expired. Please log in again.",
          `User error: ${userError}`,
          `User data: ${userData}`
        );
        LocalStorage.clearAuthData();
        clearAuth();
      }

      if (userData) {
        // If there is a user, set it
        setUser(userData);
      }

      setInitialized(true);
      setIsLoading(false);
    };

    initializeAuth();
  }, [initialized, setAuth, setUser, clearAuth, setTokens, setInitialized]);

  const login = (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  }) => {
    // Save tokens
    LocalStorage.setAuthTokens(
      data.accessToken,
      data.refreshToken,
      data.sessionId
    );

    // Update store
    setAuth(data);
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    const [result, logoutError] = await SessionService.logout();

    if (logoutError || !result) {
      logger.error(
        "Logout failed",
        `Error: ${logoutError}`,
        `Result: ${result}`
      );
    }

    LocalStorage.clearAuthData();
    clearAuth();
    setIsLoading(false);
  };

  const refreshAuth = async (): Promise<boolean> => {
    if (!refreshToken) {
      clearAuth();
      LocalStorage.clearAuthData();
      return false;
    }

    setIsLoading(true);
    setError(null);

    const [tokenData, tokenError] = await AuthService.refreshToken(
      refreshToken
    );

    if (tokenError || !tokenData) {
      setError("Session expired. Please log in again.");
      logger.error(
        "Session expired. Please log in again.",
        `Token error: ${tokenError}`,
        `Token data: ${tokenData}`
      );
      LocalStorage.clearAuthData();
      clearAuth();
      setIsLoading(false);
      return false;
    }

    // Update store
    LocalStorage.setAuthTokens(
      tokenData.accessToken,
      tokenData.refreshToken,
      tokenData.sessionId
    );

    setTokens(
      tokenData.accessToken,
      tokenData.refreshToken,
      tokenData.sessionId
    );

    setUser(tokenData.user);
    setIsLoading(false);
    return true;
  };

  const clearError = () => setError(null);

  return {
    isLoading,
    isAuthenticated,
    error,
    initialized,
    login,
    logout,
    refreshAuth,
    clearError,
  };
};
