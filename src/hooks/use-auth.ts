import { useEffect, useState } from "react";

import { logger } from "@/lib/logger";
import { AuthService } from "@/services/auth-service";
import { SessionService } from "@/services/session-service";
import { User, UserService } from "@/services/user-service";
import { LocalStorage } from "@/lib/storage/local-storage";
import { useAuthStore } from "@/stores/auth-store";

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
  isConnectionError: boolean;
  login: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  }) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  clearError: () => void;
  retryConnection: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnectionError, setIsConnectionError] = useState(false);

  const {
    setAuth,
    setUser,
    clearAuth,
    setTokens,
    setInitialized,
    refreshToken,
    initialized,
    isAuthenticated,
    user,
  } = useAuthStore();

  // Helper function to check if error is a connection error
  const isNetworkError = (error: string): boolean => {
    return error.includes("Failed to fetch") || 
           error.includes("Network Error") || 
           error.includes("ERR_NETWORK") ||
           error.includes("ERR_INTERNET_DISCONNECTED") ||
           error.includes("ERR_CONNECTION_REFUSED");
  };

  // Check saved tokens on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (initialized) return;

      setIsLoading(true);
      setError(null);
      setIsConnectionError(false);

      const tokens = LocalStorage.getAuthTokens();

      // If there are no tokens, set initialized to true
      if (!tokens.accessToken || !tokens.refreshToken || !tokens.sessionId) {
        setInitialized(true);
        setIsLoading(false);
        return;
      }

      // Set tokens
      setTokens(tokens.accessToken, tokens.refreshToken, tokens.sessionId);

      // Try to get current user
      try {
        const [userData, userError] = await UserService.getMe();

        if (userError) {
          // Check if it's a connection error
          if (isNetworkError(userError)) {
            setIsConnectionError(true);
            setError("Unable to connect to the server. Please check your internet connection and try again.");
            logger.error("Connection error during initialization:", userError);
            setIsLoading(false);
            return; // Don't set initialized to true, so user can retry
          } else {
            // Authentication error, clear session
            setError("Session expired. Please log in again.");
            logger.error("Session expired. Please log in again.", `User error: ${userError}`);
            LocalStorage.clearAuthData();
            clearAuth();
          }
        }

        if (userData) {
          // If there is a user, set it
          setUser(userData);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        
        if (isNetworkError(errorMessage)) {
          setIsConnectionError(true);
          setError("Unable to connect to the server. Please check your internet connection and try again.");
          logger.error("Connection error during initialization:", err);
          setIsLoading(false);
          return; // Don't set initialized to true, so user can retry
        } else {
          setError("An unexpected error occurred during initialization.");
          logger.error("Unexpected error during initialization:", err);
          LocalStorage.clearAuthData();
          clearAuth();
        }
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

    try {
      const [tokenData, tokenError] = await AuthService.refreshToken(refreshToken);

      if (tokenError) {
        // Check if it's a connection error
        if (isNetworkError(tokenError)) {
          setIsConnectionError(true);
          setError("Unable to connect to the server. Please check your internet connection and try again.");
          setIsLoading(false);
          return false;
        } else {
          setError("Session expired. Please log in again.");
          logger.error("Session expired. Please log in again.", `Token error: ${tokenError}`);
          LocalStorage.clearAuthData();
          clearAuth();
          setIsLoading(false);
          return false;
        }
      }

      if (!tokenData) {
        setError("Session expired. Please log in again.");
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      
      if (isNetworkError(errorMessage)) {
        setIsConnectionError(true);
        setError("Unable to connect to the server. Please check your internet connection and try again.");
      } else {
        setError("Session expired. Please log in again.");
        LocalStorage.clearAuthData();
        clearAuth();
      }
      
      setIsLoading(false);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
    setIsConnectionError(false);
  };

  const retryConnection = () => {
    // Force a complete page reload for safety
    window.location.reload();
  };

  return {
    isLoading,
    isAuthenticated,
    error,
    initialized,
    user,
    isConnectionError,
    login,
    logout,
    refreshAuth,
    clearError,
    retryConnection,
  };
};