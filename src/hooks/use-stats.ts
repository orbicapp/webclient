import { useEffect, useState } from "react";

import { StatsService, UserStats } from "@/services/stats-service";
import { useStatsStore } from "@/stores/stats-store";

/**
 * Hook to fetch and cache user statistics
 */
export const useUserStats = (
  forceRefresh = false
): [boolean, UserStats | null, string | null] => {
  const { getUserStats, setUserStats, isStale } = useStatsStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const stats = getUserStats();
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
