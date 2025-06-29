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
    isInitialized,
    setInitialized 
  } = useStatsStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = getUserStats();
  const initialized = isInitialized();
  
  // ✅ Only fetch if not initialized, stale, or force refresh
  const shouldFetch = forceRefresh || !initialized || (initialized && isStale());

  useEffect(() => {
    // ✅ If already initialized and not stale, don't fetch
    if (initialized && !isStale() && !forceRefresh) {
      return;
    }

    // ✅ If already loading, don't start another fetch
    if (loading) {
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const [stats, error] = await StatsService.getMyStats();
        if (stats) {
          setUserStats(stats); // ✅ This will set initialized: true
        } else {
          setError(error || "Failed to fetch user statistics");
          // ✅ Mark as initialized even on error to prevent infinite retries
          setInitialized(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user statistics");
        setInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    if (shouldFetch) {
      fetchStats();
    }
  }, [shouldFetch, loading, setUserStats, setInitialized, forceRefresh]);

  // ✅ Return data immediately if available, even while loading fresh data
  return [loading && !initialized, stats, error];
};