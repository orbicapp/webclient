import { logger } from "../logger";
import { LocalKeys } from "./local-keys";

export class LocalStorage {
  /**
   * Store authentication tokens securely
   */
  static setAuthTokens(
    accessToken: string,
    refreshToken: string,
    sessionId: string
  ): void {
    try {
      localStorage.setItem(LocalKeys.ACCESS_TOKEN, accessToken);
      localStorage.setItem(LocalKeys.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(LocalKeys.SESSION_ID, sessionId);

      logger.debug("Auth tokens stored successfully", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasSessionId: !!sessionId,
      });
    } catch (error) {
      logger.error("Failed to store auth tokens:", error);
      throw new Error("Storage unavailable");
    }
  }

  /**
   * Retrieve authentication tokens
   */
  static getAuthTokens(): {
    accessToken: string | null;
    refreshToken: string | null;
    sessionId: string | null;
  } {
    try {
      const tokens = {
        accessToken: localStorage.getItem(LocalKeys.ACCESS_TOKEN),
        refreshToken: localStorage.getItem(LocalKeys.REFRESH_TOKEN),
        sessionId: localStorage.getItem(LocalKeys.SESSION_ID),
      };

      logger.debug("Retrieved auth tokens from localStorage", {
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        hasSessionId: !!tokens.sessionId,
      });

      return tokens;
    } catch (error) {
      logger.error("Failed to retrieve auth tokens:", error);
      return {
        accessToken: null,
        refreshToken: null,
        sessionId: null,
      };
    }
  }

  /**
   * Clear all authentication data
   */
  static clearAuthData(): void {
    try {
      const keysToRemove = [
        LocalKeys.ACCESS_TOKEN,
        LocalKeys.REFRESH_TOKEN,
        LocalKeys.SESSION_ID,
      ];

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      logger.info("Auth data cleared from localStorage");
    } catch (error) {
      logger.error("Failed to clear auth data:", error);
    }
  }

  /**
   * Update last sync timestamp
   */
  static setLastSync(timestamp: Date): void {
    try {
      localStorage.setItem(LocalKeys.LAST_SYNC, timestamp.toISOString());
    } catch (error) {
      logger.error("Failed to store last sync timestamp:", error);
    }
  }

  /**
   * Get last sync timestamp
   */
  static getLastSync(): Date | null {
    try {
      const timestamp = localStorage.getItem(LocalKeys.LAST_SYNC);
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      logger.error("Failed to retrieve last sync timestamp:", error);
      return null;
    }
  }

  /**
   * Check if storage is available
   */
  static isAvailable(): boolean {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}
