import { useEffect, useState } from "react";

import { StatsService, UserStats } from "@/services/stats-service";
import { useStatsStore } from "@/stores/stats-store";

/**
 * Hook to fetch and cache user statistics
 */
export const useUserStats = (
  forceRefresh = false
): [boolean, UserStats | null, string | null] => {
  const {
    getUserStats,
    setUserStats,
    isStale,
    getLastUpdated,
  } = useStatsStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const stats = getUserStats();
  const lastUpdated = getLastUpdated();
  const shouldFetch = forceRefresh || !stats || isStale();

  useEffect(() => {
    // If stats are fresh and not forcing refresh, don't fetch
    if (!shouldFetch) {
      setInitialized(true);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      const [stats, error] = await StatsService.getMyStats();
      if (stats) {
        setUserStats(stats);
      } else {
        setError(error || "Failed to fetch user statistics");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchStats();
  }, [shouldFetch, setUserStats]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, null, null];
  }

  return [loading, stats, error];
};

/**
 * Hook to update user stats locally
 */
export const useUpdateUserStats = (): [
  (updates: Partial<UserStats>) => void
] => {
  const { updateUserStats } = useStatsStore();

  const updateStats = (updates: Partial<UserStats>) => {
    updateUserStats(updates);
  };

  return [updateStats];
};

/**
 * Hook to check if stats are stale
 */
export const useStatsStale = (maxAgeMinutes = 30): boolean => {
  const { isStale } = useStatsStore();
  return isStale(maxAgeMinutes);
};

/**
 * Hook to get last stats update time
 */
export const useStatsLastUpdated = (): string | null => {
  const { getLastUpdated } = useStatsStore();
  return getLastUpdated();
};

/**
 * Hook to refresh stats manually
 */
export const useRefreshStats = (): [() => Promise<void>, boolean, string | null] => {
  const { setUserStats } = useStatsStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = async () => {
    setLoading(true);
    setError(null);

    const [stats, error] = await StatsService.getMyStats();
    if (stats) {
      setUserStats(stats);
    } else {
      setError(error || "Failed to refresh user statistics");
    }

    setLoading(false);
  };

  return [refreshStats, loading, error];
};